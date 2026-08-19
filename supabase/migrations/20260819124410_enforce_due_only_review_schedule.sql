-- Keep the server-side daily plan aligned with the client forgetting-curve
-- checkpoints. Risk and weakness may change ordering and question focus, but
-- they must never pull a word into a batch before next_review_at.

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
  new.algorithm_version := '2026.08.19.2';
  new.summary := case
    when cardinality(v_due_card_ids) = 0
      then '今天暂无到期复习；初学词会立即进入 T0，后续按遗忘曲线到期。'
    else '今日有 ' || cardinality(v_due_card_ids) || ' 个到期词，已按遗忘风险排序；未到期词不会提前加入。'
  end;
  new.analysis := coalesce(new.analysis, '{}'::jsonb) || jsonb_build_object(
    'reviewWordCount', cardinality(v_due_card_ids),
    'dueWordCount', cardinality(v_due_card_ids),
    'preventiveReviewCount', 0,
    'schedulePolicy', 'due-only-2026.08.19.2'
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

drop trigger if exists daily_english_enforce_due_only_plan
  on public.daily_english_daily_plans;

create trigger daily_english_enforce_due_only_plan
before insert or update of
  review_card_ids,
  recommended_card_ids,
  card_prescriptions,
  valid_until_at,
  codex_analysis
on public.daily_english_daily_plans
for each row execute function private.daily_english_enforce_due_only_plan();

-- Individual question rows and delayed AI evaluations are analytical inputs.
-- Only an explicit schedule-impact attempt may change the server-side review
-- schedule; completed review sessions sync their aggregate progress separately.
drop trigger if exists daily_english_attempt_refresh_mastery
  on public.daily_english_attempts;

create trigger daily_english_attempt_refresh_mastery
after insert or update of score, error_types, dimension_scores
on public.daily_english_attempts
for each row
when (new.schedule_impact)
execute function private.daily_english_refresh_mastery_from_attempt();

-- Re-sanitize already generated plans. The before-update trigger performs the
-- actual filtering while preserving the original review order for due words.
update public.daily_english_daily_plans
set review_card_ids = review_card_ids;
