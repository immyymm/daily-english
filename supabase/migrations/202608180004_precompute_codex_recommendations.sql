create table if not exists public.daily_english_codex_recommendations (
  user_id uuid not null references auth.users(id) on delete cascade,
  recommendation_date date not null,
  status text not null default 'pending' check (status in ('pending', 'complete', 'failed')),
  generated_at timestamptz,
  model text,
  analysis jsonb not null default '{}'::jsonb check (jsonb_typeof(analysis) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, recommendation_date)
);

comment on table public.daily_english_codex_recommendations is
  'Codex recommendations generated before 05:00 and overlaid onto the deterministic daily plan.';

alter table public.daily_english_codex_recommendations enable row level security;
alter table public.daily_english_codex_recommendations force row level security;

revoke all on public.daily_english_codex_recommendations from anon, authenticated;
grant select on public.daily_english_codex_recommendations to authenticated;

create policy daily_english_codex_recommendations_select_own
on public.daily_english_codex_recommendations for select to authenticated
using ((select auth.uid()) = user_id);

create trigger daily_english_codex_recommendations_touch_updated_at
before update on public.daily_english_codex_recommendations
for each row execute function private.daily_english_touch_updated_at();

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
  with target as (
    select coalesce(
      p_plan_date,
      (now() at time zone 'Asia/Shanghai')::date
    ) as plan_date
  ),
  users as (
    select
      profile.user_id,
      target.plan_date,
      greatest(1, target.plan_date - profile.first_study_date + 1) as study_day,
      ((target.plan_date::timestamp + time '05:00') at time zone 'Asia/Shanghai') as batch_starts_at,
      (((target.plan_date + 1)::timestamp + time '05:00') at time zone 'Asia/Shanghai') as batch_ends_at
    from public.daily_english_profiles profile
    cross join target
  ),
  prepared as (
    select
      u.*,
      coalesce((
        select array_agg(c.card_id order by c.sequence_no)
        from private.daily_english_card_catalog c
        where c.sequence_no between mod(u.study_day - 1, 30) * 5 + 1
          and mod(u.study_day - 1, 30) * 5 + 5
      ), '{}') as new_card_ids
    from users u
  )
  select
    u.user_id,
    u.plan_date,
    jsonb_build_object(
      'schemaVersion', '2026.08.18.3',
      'timezone', 'Asia/Shanghai',
      'targetPlan', jsonb_build_object(
        'planDate', u.plan_date,
        'studyDay', u.study_day,
        'newCardIds', to_jsonb(u.new_card_ids),
        'batchStartsAt', u.batch_starts_at,
        'batchEndsAt', u.batch_ends_at
      ),
      'previousPlan', coalesce((
        select jsonb_build_object(
          'planDate', previous.plan_date,
          'summary', previous.summary,
          'reviewCardIds', to_jsonb(previous.review_card_ids),
          'focusDimensions', to_jsonb(previous.focus_dimensions),
          'targetQuestionCount', previous.target_question_count,
          'analysis', previous.analysis
        )
        from public.daily_english_daily_plans previous
        where previous.user_id = u.user_id
          and previous.plan_date < u.plan_date
        order by previous.plan_date desc
        limit 1
      ), '{}'::jsonb),
      'reviewCandidates', coalesce((
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
          'dueInTargetBatch', m.next_review_at < u.batch_ends_at,
          'overdueDaysAtBatchStart', round(greatest(
            0,
            extract(epoch from (u.batch_starts_at - m.next_review_at)) / 86400.0
          )::numeric, 1),
          'inactiveDaysAtBatchStart', round(greatest(
            0,
            extract(epoch from (u.batch_starts_at - coalesce(m.last_reviewed_at, m.learned_at))) / 86400.0
          )::numeric, 1),
          'currentTargetQuestionCount', m.target_question_count
        ) order by
          (m.next_review_at < u.batch_ends_at) desc,
          m.weak desc,
          m.next_review_at asc,
          m.mastery_score asc)
        from (
          select mastery.*
          from public.daily_english_mastery mastery
          where mastery.user_id = u.user_id
          order by
            (mastery.next_review_at < u.batch_ends_at) desc,
            mastery.weak desc,
            mastery.next_review_at asc,
            mastery.mastery_score asc
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
              where error_attempt.user_id = u.user_id
                and error_attempt.card_id = attempts.card_id
                and error_attempt.question_type = attempts.question_type
                and error_attempt.created_at >= now() - interval '30 days'
            ), '{}') as error_types,
            max(attempts.created_at) as latest_attempt_at
          from public.daily_english_attempts attempts
          where attempts.user_id = u.user_id
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
          where evaluations.user_id = u.user_id
            and evaluations.updated_at >= now() - interval '30 days'
          order by evaluations.updated_at desc
          limit 30
        ) e
      ), '[]'::jsonb)
    ) as context
  from prepared u
  order by u.user_id;
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
  v_generated_at timestamptz := now();
  v_model text := left(coalesce(nullif(btrim(p_model), ''), 'codex'), 80);
  v_result jsonb;
begin
  if p_output is null or jsonb_typeof(p_output) <> 'object' then
    raise exception 'Codex output must be a JSON object';
  end if;

  if nullif(btrim(coalesce(p_output ->> 'summary', '')), '') is null then
    raise exception 'Codex output requires a non-empty summary';
  end if;

  if not exists (
    select 1 from public.daily_english_profiles profile
    where profile.user_id = p_user_id
  ) then
    raise exception 'No Daily English profile found for the requested user';
  end if;

  insert into public.daily_english_codex_recommendations (
    user_id,
    recommendation_date,
    status,
    generated_at,
    model,
    analysis
  ) values (
    p_user_id,
    p_plan_date,
    'complete',
    v_generated_at,
    v_model,
    p_output
  )
  on conflict (user_id, recommendation_date) do update set
    status = excluded.status,
    generated_at = excluded.generated_at,
    model = excluded.model,
    analysis = excluded.analysis;

  update public.daily_english_daily_plans
  set
    codex_status = 'complete',
    codex_generated_at = v_generated_at,
    codex_model = v_model,
    codex_analysis = p_output,
    analysis = analysis || jsonb_build_object(
      'usesCodex', true,
      'usesAppModelApi', false,
      'codexGeneratedAt', v_generated_at,
      'codexSchemaVersion', '2026.08.18.3'
    )
  where user_id = p_user_id
    and plan_date = p_plan_date;

  v_result := jsonb_build_object(
    'userId', p_user_id,
    'planDate', p_plan_date,
    'codexStatus', 'complete',
    'codexGeneratedAt', v_generated_at,
    'codexModel', v_model,
    'dailyPlanAlreadyExisted', exists (
      select 1 from public.daily_english_daily_plans plan
      where plan.user_id = p_user_id and plan.plan_date = p_plan_date
    )
  );

  return v_result;
end
$$;

revoke all on function private.daily_english_apply_codex_analysis(uuid, date, jsonb, text)
  from public, anon, authenticated;
grant execute on function private.daily_english_apply_codex_analysis(uuid, date, jsonb, text)
  to postgres, service_role;

create or replace function private.daily_english_overlay_codex_recommendation()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_recommendation public.daily_english_codex_recommendations%rowtype;
begin
  select recommendation.* into v_recommendation
  from public.daily_english_codex_recommendations recommendation
  where recommendation.user_id = new.user_id
    and recommendation.recommendation_date = new.plan_date
    and recommendation.status = 'complete';

  if found then
    new.codex_status := 'complete';
    new.codex_generated_at := v_recommendation.generated_at;
    new.codex_model := v_recommendation.model;
    new.codex_analysis := v_recommendation.analysis;
    new.analysis := new.analysis || jsonb_build_object(
      'usesCodex', true,
      'usesAppModelApi', false,
      'codexGeneratedAt', v_recommendation.generated_at,
      'codexSchemaVersion', '2026.08.18.3'
    );
  end if;

  return new;
end
$$;

revoke all on function private.daily_english_overlay_codex_recommendation()
  from public, anon, authenticated;

create trigger daily_english_daily_plan_overlay_codex
before insert or update on public.daily_english_daily_plans
for each row execute function private.daily_english_overlay_codex_recommendation();

update public.daily_english_daily_plans plan
set
  codex_status = 'complete',
  codex_generated_at = recommendation.generated_at,
  codex_model = recommendation.model,
  codex_analysis = recommendation.analysis,
  analysis = plan.analysis || jsonb_build_object(
    'usesCodex', true,
    'usesAppModelApi', false,
    'codexGeneratedAt', recommendation.generated_at,
    'codexSchemaVersion', '2026.08.18.3'
  )
from public.daily_english_codex_recommendations recommendation
where recommendation.user_id = plan.user_id
  and recommendation.recommendation_date = plan.plan_date
  and recommendation.status = 'complete';

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'daily_english_codex_recommendations'
  ) then
    alter publication supabase_realtime
      add table public.daily_english_codex_recommendations;
  end if;
end
$$;

