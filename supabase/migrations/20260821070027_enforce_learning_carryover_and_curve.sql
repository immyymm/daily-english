-- Learning batches advance only after all five cards in the current catalog
-- batch have been learned. Calendar dates and Codex output are not scheduling
-- authorities.
create or replace function private.daily_english_enforce_learning_carryover()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_study_day integer;
  v_card_ids text[];
begin
  with batches as (
    select
      ((catalog.sequence_no - 1) / 5) + 1 as study_day,
      bool_and(mastery.card_id is not null) as completed
    from private.daily_english_card_catalog catalog
    left join public.daily_english_mastery mastery
      on mastery.user_id = new.user_id
     and mastery.card_id = catalog.card_id
    group by ((catalog.sequence_no - 1) / 5) + 1
  )
  select batches.study_day
  into v_study_day
  from batches
  where not batches.completed
  order by batches.study_day
  limit 1;

  if v_study_day is null then
    select greatest(1, ceil(max(catalog.sequence_no) / 5.0)::integer)
    into v_study_day
    from private.daily_english_card_catalog catalog;
  end if;

  select coalesce(array_agg(catalog.card_id order by catalog.sequence_no), '{}'::text[])
  into v_card_ids
  from private.daily_english_card_catalog catalog
  where catalog.sequence_no between (v_study_day - 1) * 5 + 1 and v_study_day * 5;

  new.study_day := v_study_day;
  new.new_card_ids := v_card_ids;
  new.analysis := coalesce(new.analysis, '{}'::jsonb) || jsonb_build_object(
    'studyDay', v_study_day,
    'newWordCount', cardinality(v_card_ids),
    'learningPlanPolicy', 'earliest-incomplete-five-2026.08.21.1'
  );
  return new;
end
$$;

revoke all on function private.daily_english_enforce_learning_carryover()
  from public, anon, authenticated;

drop trigger if exists daily_english_enforce_learning_carryover
  on public.daily_english_daily_plans;

create trigger daily_english_enforce_learning_carryover
before insert or update of study_day, new_card_ids
on public.daily_english_daily_plans
for each row execute function private.daily_english_enforce_learning_carryover();

-- Only the aggregate result written after a complete word-review round may
-- change stage and next_review_at. Per-question attempts remain diagnostics.
drop trigger if exists daily_english_attempt_refresh_mastery
  on public.daily_english_attempts;

drop function if exists private.daily_english_refresh_mastery_from_attempt();

-- Protect the full Ebbinghaus checkpoint, not merely a next-day floor. Weak
-- flags can increase question depth but cannot shorten a 3/7/14/... day stage.
drop trigger if exists daily_english_enforce_next_day_review_floor
  on public.daily_english_mastery;

drop function if exists private.daily_english_enforce_next_day_review_floor();

create or replace function private.daily_english_enforce_curve_checkpoint()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_days integer;
  v_minimum_due timestamptz;
begin
  if new.last_reviewed_at is null then
    return new;
  end if;

  v_days := case new.stage
    when 'T0' then 1
    when 'T1' then 1
    when 'T2' then 3
    when 'T3' then 7
    when 'T4' then 14
    when 'T5' then 30
    when 'T6' then 60
    when 'T7' then 90
    else 1
  end;

  if coalesce(new.last_score, 0) < 60 then
    v_days := 1;
  elsif new.last_score < 75 then
    v_days := greatest(1, ceil(v_days / 2.0)::integer);
  end if;

  v_minimum_due := (
    (((new.last_reviewed_at at time zone 'Asia/Shanghai')::date + v_days)::timestamp + time '08:00')
      at time zone 'Asia/Shanghai'
  );

  if new.next_review_at is null or new.next_review_at < v_minimum_due then
    new.next_review_at := v_minimum_due;
  end if;
  return new;
end
$$;

revoke all on function private.daily_english_enforce_curve_checkpoint()
  from public, anon, authenticated;

create trigger daily_english_enforce_curve_checkpoint
before insert or update of stage, last_score, last_reviewed_at, next_review_at
on public.daily_english_mastery
for each row execute function private.daily_english_enforce_curve_checkpoint();

-- Keep Codex and risk scoring downstream of the deterministic due set. They
-- may order due words and deepen questions, but cannot add an early review.
create or replace function private.daily_english_enforce_due_only_plan()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_cutoff timestamptz := coalesce(
    new.valid_until_at,
    ((new.plan_date + 1)::timestamp + time '05:00') at time zone 'Asia/Shanghai'
  );
  v_due_card_ids text[];
begin
  select coalesce(
    array_agg(candidate.card_id order by candidate.position),
    '{}'::text[]
  )
  into v_due_card_ids
  from unnest(coalesce(new.review_card_ids, '{}'::text[]))
    with ordinality as candidate(card_id, position)
  join public.daily_english_mastery mastery
    on mastery.user_id = new.user_id
   and mastery.card_id = candidate.card_id
  where mastery.next_review_at < v_cutoff
    and not (
      mastery.last_reviewed_at is not null
      and (mastery.last_reviewed_at at time zone 'Asia/Shanghai')::date = new.plan_date
    );

  new.review_card_ids := v_due_card_ids;
  new.recommended_card_ids := v_due_card_ids;
  new.card_prescriptions := coalesce((
    select jsonb_object_agg(prescription.key, prescription.value)
    from jsonb_each(coalesce(new.card_prescriptions, '{}'::jsonb)) prescription
    where prescription.key = any(v_due_card_ids)
  ), '{}'::jsonb);
  new.algorithm_version := '2026.08.21.1';
  new.summary := case
    when cardinality(v_due_card_ids) = 0
      then '今天暂无到期复习；新词按未完成的五词组顺延，复习按遗忘曲线到期。'
    else '今日有 ' || cardinality(v_due_card_ids) || ' 个到期词；薄弱度只调整题量与难度，不提前复习。'
  end;
  new.analysis := coalesce(new.analysis, '{}'::jsonb) || jsonb_build_object(
    'reviewWordCount', cardinality(v_due_card_ids),
    'dueWordCount', cardinality(v_due_card_ids),
    'preventiveReviewCount', 0,
    'schedulePolicy', 'curve-due-only-2026.08.21.1'
  );

  if jsonb_typeof(new.codex_analysis) = 'object' and new.codex_analysis <> '{}'::jsonb then
    new.codex_analysis := new.codex_analysis || jsonb_build_object(
      'summary', new.summary,
      'recommendedCardIds', to_jsonb(v_due_card_ids)
    );
  end if;
  return new;
end
$$;

revoke all on function private.daily_english_enforce_due_only_plan()
  from public, anon, authenticated;

-- A resumable queue contains only cards that are actually due now. This also
-- removes stale queues written by older clients.
create or replace function private.daily_english_enforce_review_session_due_only()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_queue_card_ids text[] := '{}'::text[];
  v_original_count integer := cardinality(coalesce(new.queue_card_ids, '{}'::text[]));
begin
  if new.session_date = (now() at time zone 'Asia/Shanghai')::date then
    select coalesce(array_agg(candidate.card_id order by candidate.position), '{}'::text[])
    into v_queue_card_ids
    from unnest(coalesce(new.queue_card_ids, '{}'::text[]))
      with ordinality as candidate(card_id, position)
    join public.daily_english_mastery mastery
      on mastery.user_id = new.user_id
     and mastery.card_id = candidate.card_id
    where mastery.next_review_at <= now()
      and not (
        mastery.last_reviewed_at is not null
        and (mastery.last_reviewed_at at time zone 'Asia/Shanghai')::date = new.session_date
      );
  end if;

  new.queue_card_ids := v_queue_card_ids;
  if cardinality(v_queue_card_ids) < v_original_count then
    new.initial_card_ids := v_queue_card_ids;
    new.batch_total := cardinality(v_queue_card_ids);
  end if;

  if new.status = 'active' and cardinality(v_queue_card_ids) = 0 then
    new.status := 'completed';
    new.current_card_id := null;
    new.stage := null;
    new.question_ids := '{}'::text[];
    new.question_index := 0;
    new.answer := '';
    new.feedback := null;
    new.attempts := '[]'::jsonb;
    new.speech_latency := null;
    new.client_updated_at := greatest(coalesce(new.client_updated_at, now()), now());
  elsif new.status = 'active'
    and not (coalesce(new.current_card_id, '') = any(v_queue_card_ids)) then
    new.current_card_id := v_queue_card_ids[1];
    new.stage := null;
    new.question_ids := '{}'::text[];
    new.question_index := 0;
    new.answer := '';
    new.feedback := null;
    new.attempts := '[]'::jsonb;
    new.speech_latency := null;
    new.client_updated_at := greatest(coalesce(new.client_updated_at, now()), now());
  end if;
  return new;
end
$$;

revoke all on function private.daily_english_enforce_review_session_due_only()
  from public, anon, authenticated;

-- Repair schedules previously collapsed to the next day. The current stage is
-- already the next checkpoint after the last completed review.
with curve as (
  select
    mastery.user_id,
    mastery.card_id,
    (
      (((mastery.last_reviewed_at at time zone 'Asia/Shanghai')::date +
        case
          when coalesce(mastery.last_score, 0) < 60 then 1
          when mastery.last_score < 75 then greatest(1, ceil((case mastery.stage
            when 'T0' then 1 when 'T1' then 1 when 'T2' then 3 when 'T3' then 7
            when 'T4' then 14 when 'T5' then 30 when 'T6' then 60 when 'T7' then 90
            else 1 end) / 2.0)::integer)
          else case mastery.stage
            when 'T0' then 1 when 'T1' then 1 when 'T2' then 3 when 'T3' then 7
            when 'T4' then 14 when 'T5' then 30 when 'T6' then 60 when 'T7' then 90
            else 1 end
        end)::timestamp + time '08:00') at time zone 'Asia/Shanghai'
    ) as expected_due
  from public.daily_english_mastery mastery
  where mastery.last_reviewed_at is not null
)
update public.daily_english_mastery mastery
set next_review_at = curve.expected_due
from curve
where mastery.user_id = curve.user_id
  and mastery.card_id = curve.card_id
  and mastery.next_review_at is distinct from curve.expected_due;

-- Normalize historical missed-day plans without changing completed batches.
update public.daily_english_daily_plans plan
set new_card_ids = plan.new_card_ids
where exists (
  select 1
  from unnest(plan.new_card_ids) card(card_id)
  where not exists (
    select 1
    from public.daily_english_mastery mastery
    where mastery.user_id = plan.user_id
      and mastery.card_id = card.card_id
  )
);

-- Re-filter all deterministic review plans against the repaired checkpoints.
update public.daily_english_daily_plans
set review_card_ids = review_card_ids;

-- Re-filter active dedicated queues immediately.
update public.daily_english_review_sessions
set queue_card_ids = queue_card_ids
where status = 'active';

select private.daily_english_generate_daily_plans();
