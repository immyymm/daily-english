-- Replace the inactive non-verb catalog slots with audited COCA verbs. User
-- mastery/history rows keep their original card ids; only the active learning
-- catalog and future plan selection change.
set constraints private.daily_english_card_catalog_sequence_no_key deferred;

with desired as (
  select card_id, sequence_no::smallint
  from unnest(array[
    'be-v', 'have-v', 'do-v', 'say-v', 'go-v',
    'get-v', 'can-v', 'know-v', 'will-v', 'would-v',
    'make-v', 'think-v', 'see-v', 'come-v', 'take-v',
    'want-v', 'could-v', 'look-v', 'use-v', 'tell-v',
    'find-v', 'give-v', 'need-v', 'should-v', 'work-v',
    'try-v', 'let-v', 'call-v', 'may-v', 'mean-v',
    'feel-v', 'ask-v', 'talk-v', 'keep-v', 'leave-v',
    'put-v', 'like-v', 'help-v', 'start-v', 'become-v',
    'happen-v', 'show-v', 'seem-v', 'might-v', 'hear-v',
    'believe-v', 'play-v', 'turn-v', 'run-v', 'live-v',
    'write-v', 'bring-v', 'move-v', 'must-v', 'begin-v',
    'love-v', 'hold-v', 'read-v', 'stop-v', 'pay-v',
    'provide-v', 'lose-v', 'understand-v', 'wait-v', 'meet-v',
    'thank-v', 'change-v', 'watch-v', 'sit-v', 'create-v',
    'learn-v', 'kill-v', 'include-v', 'stand-v', 'follow-v',
    'remember-v', 'speak-v', 'set-v', 'allow-v', 'win-v',
    'lead-v', 'continue-v', 'spend-v', 'stay-v', 'add-v',
    'die-v', 'buy-v', 'send-v', 'walk-v', 'grow-v',
    'open-v', 'consider-v', 'hope-v', 'offer-v', 'build-v',
    'expect-v', 'fall-v', 'appear-v', 'serve-v', 'break-v',
    'end-v', 'require-v', 'listen-v', 'agree-v', 'cut-v',
    'decide-v', 'pass-v', 'eat-v', 'report-v', 'suggest-v',
    'sell-v', 'support-v', 'receive-v', 'base-v', 'pick-v',
    'drive-v', 'reach-v', 'remain-v', 'explain-v', 'hit-v',
    'pull-v', 'raise-v', 'wear-v', 'return-v', 'choose-v',
    'cause-v', 'join-v', 'develop-v', 'share-v', 'realize-v',
    'describe-v', 'increase-v', 'protect-v', 'compare-v', 'reduce-v',
    'accept-v', 'prepare-v', 'avoid-v', 'notice-v', 'affect-v',
    'manage-v', 'improve-v', 'discover-v', 'handle-v', 'achieve-v',
    'express-v', 'encourage-v', 'depend-v', 'prefer-v', 'solve-v'
  ]::text[]) with ordinality as cards(card_id, sequence_no)
)
delete from private.daily_english_card_catalog catalog
where not exists (
  select 1 from desired where desired.card_id = catalog.card_id
);

insert into private.daily_english_card_catalog (card_id, sequence_no, content_version)
select card_id, sequence_no, '2026.09.07.2'
from unnest(array[
  'be-v', 'have-v', 'do-v', 'say-v', 'go-v',
  'get-v', 'can-v', 'know-v', 'will-v', 'would-v',
  'make-v', 'think-v', 'see-v', 'come-v', 'take-v',
  'want-v', 'could-v', 'look-v', 'use-v', 'tell-v',
  'find-v', 'give-v', 'need-v', 'should-v', 'work-v',
  'try-v', 'let-v', 'call-v', 'may-v', 'mean-v',
  'feel-v', 'ask-v', 'talk-v', 'keep-v', 'leave-v',
  'put-v', 'like-v', 'help-v', 'start-v', 'become-v',
  'happen-v', 'show-v', 'seem-v', 'might-v', 'hear-v',
  'believe-v', 'play-v', 'turn-v', 'run-v', 'live-v',
  'write-v', 'bring-v', 'move-v', 'must-v', 'begin-v',
  'love-v', 'hold-v', 'read-v', 'stop-v', 'pay-v',
  'provide-v', 'lose-v', 'understand-v', 'wait-v', 'meet-v',
  'thank-v', 'change-v', 'watch-v', 'sit-v', 'create-v',
  'learn-v', 'kill-v', 'include-v', 'stand-v', 'follow-v',
  'remember-v', 'speak-v', 'set-v', 'allow-v', 'win-v',
  'lead-v', 'continue-v', 'spend-v', 'stay-v', 'add-v',
  'die-v', 'buy-v', 'send-v', 'walk-v', 'grow-v',
  'open-v', 'consider-v', 'hope-v', 'offer-v', 'build-v',
  'expect-v', 'fall-v', 'appear-v', 'serve-v', 'break-v',
  'end-v', 'require-v', 'listen-v', 'agree-v', 'cut-v',
  'decide-v', 'pass-v', 'eat-v', 'report-v', 'suggest-v',
  'sell-v', 'support-v', 'receive-v', 'base-v', 'pick-v',
  'drive-v', 'reach-v', 'remain-v', 'explain-v', 'hit-v',
  'pull-v', 'raise-v', 'wear-v', 'return-v', 'choose-v',
  'cause-v', 'join-v', 'develop-v', 'share-v', 'realize-v',
  'describe-v', 'increase-v', 'protect-v', 'compare-v', 'reduce-v',
  'accept-v', 'prepare-v', 'avoid-v', 'notice-v', 'affect-v',
  'manage-v', 'improve-v', 'discover-v', 'handle-v', 'achieve-v',
  'express-v', 'encourage-v', 'depend-v', 'prefer-v', 'solve-v'
]::text[]) with ordinality as cards(card_id, sequence_no)
on conflict (card_id) do update set
  sequence_no = excluded.sequence_no,
  content_version = excluded.content_version;

do $$
begin
  if (select count(*) from private.daily_english_card_catalog) <> 150
    or (select count(*) from private.daily_english_card_catalog where card_id like '%-v') <> 150
    or (select min(sequence_no) from private.daily_english_card_catalog) <> 1
    or (select max(sequence_no) from private.daily_english_card_catalog) <> 150
    or (select count(*) from private.daily_english_card_catalog where content_version = '2026.09.07.2') <> 150 then
    raise exception 'daily_english all-verb catalog replacement is incomplete';
  end if;
end
$$;

-- A retired non-verb mastery row stays in history but must not re-enter an
-- active review plan after its card body has been replaced in the catalog.
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
  select coalesce(array_agg(candidate.card_id order by candidate.position), '{}'::text[])
  into v_due_card_ids
  from unnest(coalesce(new.review_card_ids, '{}'::text[]))
    with ordinality as candidate(card_id, position)
  join private.daily_english_card_catalog catalog
    on catalog.card_id = candidate.card_id
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
  new.algorithm_version := '2026.09.07.2';
  new.summary := case
    when cardinality(v_due_card_ids) = 0
      then '今天暂无到期复习；新词按未完成的五词组顺延，复习按遗忘曲线到期。'
    else '今日有 ' || cardinality(v_due_card_ids) || ' 个到期词；薄弱度只调整题量与难度，不提前复习。'
  end;
  new.analysis := coalesce(new.analysis, '{}'::jsonb) || jsonb_build_object(
    'reviewWordCount', cardinality(v_due_card_ids),
    'dueWordCount', cardinality(v_due_card_ids),
    'preventiveReviewCount', 0,
    'schedulePolicy', 'active-catalog-curve-due-only-2026.09.07.2'
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
    join private.daily_english_card_catalog catalog
      on catalog.card_id = candidate.card_id
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

-- Recalculate only today's and future presentation plans through the existing
-- carry-over trigger. Historical plans and every user-owned mastery row remain
-- untouched.
update public.daily_english_daily_plans
set new_card_ids = new_card_ids,
    review_card_ids = review_card_ids
where plan_date >= (now() at time zone 'Asia/Shanghai')::date;

update public.daily_english_review_sessions
set queue_card_ids = queue_card_ids
where status = 'active';
