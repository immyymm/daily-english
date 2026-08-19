alter table public.daily_english_daily_plans
  add column if not exists codex_status text not null default 'pending',
  add column if not exists codex_generated_at timestamptz,
  add column if not exists codex_model text,
  add column if not exists codex_analysis jsonb not null default '{}'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'daily_english_daily_plans_codex_status_check'
      and conrelid = 'public.daily_english_daily_plans'::regclass
  ) then
    alter table public.daily_english_daily_plans
      add constraint daily_english_daily_plans_codex_status_check
      check (codex_status in ('pending', 'complete', 'failed'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'daily_english_daily_plans_codex_analysis_object_check'
      and conrelid = 'public.daily_english_daily_plans'::regclass
  ) then
    alter table public.daily_english_daily_plans
      add constraint daily_english_daily_plans_codex_analysis_object_check
      check (jsonb_typeof(codex_analysis) = 'object');
  end if;
end
$$;

comment on column public.daily_english_daily_plans.codex_status is
  'Status of the daily Codex model analysis layered on the deterministic 05:00 plan.';
comment on column public.daily_english_daily_plans.codex_analysis is
  'Structured Codex analysis. The app validates and overlays it without replacing the deterministic fallback.';

create or replace function private.daily_english_codex_analysis_context(
  p_plan_date date default null
)
returns table (
  user_id uuid,
  plan_date date,
  context jsonb
)
language sql
stable
security definer
set search_path = pg_catalog, public, private
as $$
  with target_plans as (
    select p.*
    from public.daily_english_daily_plans p
    where p.plan_date = coalesce(
      p_plan_date,
      (now() at time zone 'Asia/Shanghai')::date
    )
  )
  select
    p.user_id,
    p.plan_date,
    jsonb_build_object(
      'schemaVersion', '2026.08.18.2',
      'timezone', 'Asia/Shanghai',
      'plan', jsonb_build_object(
        'studyDay', p.study_day,
        'newCardIds', to_jsonb(p.new_card_ids),
        'reviewCardIds', to_jsonb(p.review_card_ids),
        'focusDimensions', to_jsonb(p.focus_dimensions),
        'targetQuestionCount', p.target_question_count,
        'summary', p.summary,
        'cardPrescriptions', p.card_prescriptions,
        'algorithmVersion', p.algorithm_version,
        'analysis', p.analysis
      ),
      'mastery', coalesce((
        select jsonb_agg(jsonb_build_object(
          'cardId', m.card_id,
          'stage', m.stage,
          'status', m.status,
          'masteryScore', m.mastery_score,
          'lastScore', m.last_score,
          'weak', m.weak,
          'weakDimensions', to_jsonb(m.weak_dimensions),
          'dimensionScores', m.dimension_scores,
          'errorCounts', m.error_counts,
          'wrongCount', m.wrong_count,
          'unstableCount', m.unstable_count,
          'attemptCount', m.attempt_count,
          'correctStreak', m.correct_streak,
          'learnedAt', m.learned_at,
          'lastReviewedAt', m.last_reviewed_at,
          'nextReviewAt', m.next_review_at,
          'currentTargetQuestionCount', m.target_question_count
        ) order by m.weak desc, m.next_review_at asc, m.mastery_score asc)
        from (
          select mastery.*
          from public.daily_english_mastery mastery
          where mastery.user_id = p.user_id
          order by mastery.weak desc, mastery.next_review_at asc, mastery.mastery_score asc
          limit 60
        ) m
      ), '[]'::jsonb),
      'recentAttemptSummary', coalesce((
        select jsonb_agg(jsonb_build_object(
          'cardId', a.card_id,
          'questionType', a.question_type,
          'attemptCount', a.attempt_count,
          'averageScore', a.average_score,
          'correctRate', a.correct_rate,
          'averageResponseMs', a.average_response_ms,
          'errorTypes', to_jsonb(a.error_types),
          'latestAttemptAt', a.latest_attempt_at
        ) order by a.average_score asc, a.latest_attempt_at desc)
        from (
          select
            attempts.card_id,
            attempts.question_type,
            count(*) as attempt_count,
            round(avg(attempts.score), 1) as average_score,
            round(100.0 * avg(case when attempts.correct then 1 else 0 end), 1) as correct_rate,
            round(avg(attempts.response_ms)) as average_response_ms,
            coalesce((
              select array_agg(distinct error_type)
              from public.daily_english_attempts error_attempt
              cross join lateral unnest(error_attempt.error_types) as error_type
              where error_attempt.user_id = p.user_id
                and error_attempt.card_id = attempts.card_id
                and error_attempt.question_type = attempts.question_type
                and error_attempt.created_at >= now() - interval '30 days'
            ), '{}') as error_types,
            max(attempts.created_at) as latest_attempt_at
          from public.daily_english_attempts attempts
          where attempts.user_id = p.user_id
            and attempts.created_at >= now() - interval '30 days'
          group by attempts.card_id, attempts.question_type
          order by average_score asc, latest_attempt_at desc
          limit 80
        ) a
      ), '[]'::jsonb),
      'recentAiEvaluationSummary', coalesce((
        select jsonb_agg(jsonb_build_object(
          'cardId', e.card_id,
          'questionType', e.question_type,
          'status', e.status,
          'result', e.result,
          'model', e.model,
          'completedAt', e.completed_at,
          'errorMessage', e.error_message
        ) order by e.updated_at desc)
        from (
          select evaluations.*
          from public.daily_english_ai_evaluations evaluations
          where evaluations.user_id = p.user_id
            and evaluations.updated_at >= now() - interval '30 days'
          order by evaluations.updated_at desc
          limit 30
        ) e
      ), '[]'::jsonb)
    ) as context
  from target_plans p
  order by p.user_id;
$$;

revoke all on function private.daily_english_codex_analysis_context(date)
  from public, anon, authenticated;
grant execute on function private.daily_english_codex_analysis_context(date)
  to postgres, service_role;

create or replace function private.daily_english_apply_codex_analysis(
  p_user_id uuid,
  p_plan_date date,
  p_output jsonb,
  p_model text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_result jsonb;
begin
  if p_output is null or jsonb_typeof(p_output) <> 'object' then
    raise exception 'Codex output must be a JSON object';
  end if;

  if nullif(btrim(coalesce(p_output ->> 'summary', '')), '') is null then
    raise exception 'Codex output requires a non-empty summary';
  end if;

  update public.daily_english_daily_plans
  set
    codex_status = 'complete',
    codex_generated_at = now(),
    codex_model = left(coalesce(nullif(btrim(p_model), ''), 'codex'), 80),
    codex_analysis = p_output,
    analysis = analysis || jsonb_build_object(
      'usesCodex', true,
      'usesAppModelApi', false,
      'codexGeneratedAt', now(),
      'codexSchemaVersion', '2026.08.18.2'
    )
  where user_id = p_user_id
    and plan_date = p_plan_date
  returning jsonb_build_object(
    'userId', user_id,
    'planDate', plan_date,
    'codexStatus', codex_status,
    'codexGeneratedAt', codex_generated_at,
    'codexModel', codex_model
  ) into v_result;

  if v_result is null then
    raise exception 'No daily plan found for the requested user and date';
  end if;

  return v_result;
end
$$;

revoke all on function private.daily_english_apply_codex_analysis(uuid, date, jsonb, text)
  from public, anon, authenticated;
grant execute on function private.daily_english_apply_codex_analysis(uuid, date, jsonb, text)
  to postgres, service_role;
