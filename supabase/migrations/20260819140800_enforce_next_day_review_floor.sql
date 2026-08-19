-- A completed review is final for the local calendar day. Protect the mastery
-- schedule from legacy clients or cloud snapshots that still write a same-day
-- reinforcement timestamp.
create or replace function private.daily_english_enforce_next_day_review_floor()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_minimum_due timestamptz;
begin
  if new.last_reviewed_at is null then
    return new;
  end if;

  v_minimum_due := (
    (((new.last_reviewed_at at time zone 'Asia/Shanghai')::date + 1)::timestamp + time '08:00')
      at time zone 'Asia/Shanghai'
  );

  if new.next_review_at < v_minimum_due then
    new.next_review_at := v_minimum_due;
  end if;

  return new;
end
$$;

revoke all on function private.daily_english_enforce_next_day_review_floor()
  from public, anon, authenticated;

drop trigger if exists daily_english_enforce_next_day_review_floor
  on public.daily_english_mastery;

create trigger daily_english_enforce_next_day_review_floor
before insert or update of last_reviewed_at, next_review_at
on public.daily_english_mastery
for each row execute function private.daily_english_enforce_next_day_review_floor();

-- Repair legacy rows without touching attempts, scores, stages, or mastery data.
update public.daily_english_mastery
set next_review_at = (
  (((last_reviewed_at at time zone 'Asia/Shanghai')::date + 1)::timestamp + time '08:00')
    at time zone 'Asia/Shanghai'
)
where last_reviewed_at is not null
  and next_review_at < (
    (((last_reviewed_at at time zone 'Asia/Shanghai')::date + 1)::timestamp + time '08:00')
      at time zone 'Asia/Shanghai'
  );
