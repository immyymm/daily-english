-- A completed review round is final for that local calendar day. Old clients,
-- snapshots, or resumed sessions must not re-add those cards to an active queue.
create or replace function private.daily_english_enforce_review_session_due_only()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_queue_card_ids text[];
begin
  select coalesce(array_agg(candidate.card_id order by candidate.position), '{}'::text[])
  into v_queue_card_ids
  from unnest(coalesce(new.queue_card_ids, '{}'::text[]))
    with ordinality as candidate(card_id, position)
  left join public.daily_english_mastery mastery
    on mastery.user_id = new.user_id
   and mastery.card_id = candidate.card_id
  where mastery.card_id is null
     or mastery.last_reviewed_at is null
     or (mastery.last_reviewed_at at time zone 'Asia/Shanghai')::date <> new.session_date;

  new.queue_card_ids := v_queue_card_ids;
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

drop trigger if exists daily_english_enforce_review_session_due_only
  on public.daily_english_review_sessions;

create trigger daily_english_enforce_review_session_due_only
before insert or update of status, queue_card_ids, current_card_id
on public.daily_english_review_sessions
for each row execute function private.daily_english_enforce_review_session_due_only();

-- Sanitize dedicated session rows immediately.
update public.daily_english_review_sessions
set queue_card_ids = queue_card_ids
where status = 'active';

-- Sanitize legacy snapshot copies whose complete queue was already reviewed on
-- the recorded session date. Learning progress, attempts, and evaluations stay intact.
update public.daily_english_snapshots snapshot
set payload = jsonb_set(
  snapshot.payload,
  '{reviewSessions}',
  coalesce((
    select jsonb_agg(
      case
        when session.value ->> 'status' = 'active'
          and not exists (
            select 1
            from jsonb_array_elements_text(coalesce(session.value -> 'queueCardIds', '[]'::jsonb)) queued(card_id)
            left join public.daily_english_mastery mastery
              on mastery.user_id = snapshot.user_id
             and mastery.card_id = queued.card_id
            where mastery.card_id is null
               or mastery.last_reviewed_at is null
               or (mastery.last_reviewed_at at time zone 'Asia/Shanghai')::date
                    <> (session.value ->> 'date')::date
          )
        then (session.value - 'currentCardId' - 'stage' - 'feedback' - 'speechLatency')
          || jsonb_build_object(
            'status', 'completed',
            'queueCardIds', '[]'::jsonb,
            'questionIds', '[]'::jsonb,
            'questionIndex', 0,
            'answer', '',
            'attempts', '[]'::jsonb,
            'updatedAt', now()
          )
        else session.value
      end
      order by session.position
    )
    from jsonb_array_elements(coalesce(snapshot.payload -> 'reviewSessions', '[]'::jsonb))
      with ordinality as session(value, position)
  ), '[]'::jsonb)
)
where jsonb_typeof(snapshot.payload -> 'reviewSessions') = 'array';
