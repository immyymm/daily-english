create table public.daily_english_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  schema_version integer not null default 1 check (schema_version > 0),
  client_updated_at timestamptz not null,
  updated_at timestamptz not null default now(),
  revision bigint not null default 1 check (revision > 0),
  device_id text,
  constraint daily_english_snapshot_size check (pg_column_size(payload) <= 2097152)
);

comment on table public.daily_english_snapshots is
  'Per-user encrypted-transport learning snapshot for the Daily English PWA.';

alter table public.daily_english_snapshots enable row level security;
alter table public.daily_english_snapshots force row level security;

revoke all on table public.daily_english_snapshots from anon;
grant select, insert, update, delete on table public.daily_english_snapshots to authenticated;

create policy "daily_english_select_own"
on public.daily_english_snapshots
for select to authenticated
using ((select auth.uid()) = user_id);

create policy "daily_english_insert_own"
on public.daily_english_snapshots
for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "daily_english_update_own"
on public.daily_english_snapshots
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "daily_english_delete_own"
on public.daily_english_snapshots
for delete to authenticated
using ((select auth.uid()) = user_id);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'daily_english_snapshots'
  ) then
    alter publication supabase_realtime add table public.daily_english_snapshots;
  end if;
end
$$;
