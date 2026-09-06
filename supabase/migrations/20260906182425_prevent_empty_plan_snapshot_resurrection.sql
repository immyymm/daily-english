-- A reset snapshot is a server-side tombstone. Older app builds used to save
-- a fresh but unstarted plan immediately after clearing data. Strip that
-- presentation-only shell when no real post-reset learning records exist, so
-- an old device cannot make cleared history appear again.
create or replace function private.daily_english_sanitize_empty_reset_snapshot()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  v_has_reset boolean := nullif(new.payload #>> '{settings,dataResetAt}', '') is not null;
  v_has_snapshot_activity boolean;
  v_has_detailed_activity boolean;
begin
  if not v_has_reset then
    return new;
  end if;

  v_has_snapshot_activity :=
    jsonb_array_length(coalesce(new.payload->'progress', '[]'::jsonb)) > 0
    or jsonb_array_length(coalesce(new.payload->'attempts', '[]'::jsonb)) > 0
    or jsonb_array_length(coalesce(new.payload->'aiEvaluations', '[]'::jsonb)) > 0
    or jsonb_array_length(coalesce(new.payload->'reviewSessions', '[]'::jsonb)) > 0;

  if v_has_snapshot_activity then
    return new;
  end if;

  select
    exists (select 1 from public.daily_english_mastery m where m.user_id = new.user_id)
    or exists (select 1 from public.daily_english_attempts a where a.user_id = new.user_id)
    or exists (select 1 from public.daily_english_ai_evaluations e where e.user_id = new.user_id)
    or exists (select 1 from public.daily_english_review_sessions r where r.user_id = new.user_id)
  into v_has_detailed_activity;

  if not v_has_detailed_activity then
    new.payload := jsonb_set(
      jsonb_set(new.payload, '{dailyPlans}', '[]'::jsonb, true),
      '{dailyRecommendations}', '[]'::jsonb, true
    );
  end if;

  return new;
end
$$;

revoke all on function private.daily_english_sanitize_empty_reset_snapshot()
from public, anon, authenticated;

drop trigger if exists daily_english_snapshot_prevent_empty_plan_resurrection
on public.daily_english_snapshots;

create trigger daily_english_snapshot_prevent_empty_plan_resurrection
before insert or update of payload on public.daily_english_snapshots
for each row execute function private.daily_english_sanitize_empty_reset_snapshot();

comment on function private.daily_english_sanitize_empty_reset_snapshot() is
  'Keeps a cleared Daily English snapshot authoritative when an older device uploads an unstarted plan shell.';
