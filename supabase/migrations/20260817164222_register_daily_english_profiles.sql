create table if not exists public.daily_english_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_study_date date not null,
  timezone text not null default 'Asia/Shanghai' check (timezone = 'Asia/Shanghai'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.daily_english_profiles enable row level security;
alter table public.daily_english_profiles force row level security;

revoke all on public.daily_english_profiles from anon, authenticated;
grant select, insert, update on public.daily_english_profiles to authenticated;

drop policy if exists daily_english_profiles_select_own on public.daily_english_profiles;
create policy daily_english_profiles_select_own
on public.daily_english_profiles for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists daily_english_profiles_insert_own on public.daily_english_profiles;
create policy daily_english_profiles_insert_own
on public.daily_english_profiles for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists daily_english_profiles_update_own on public.daily_english_profiles;
create policy daily_english_profiles_update_own
on public.daily_english_profiles for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop trigger if exists daily_english_profiles_touch_updated_at on public.daily_english_profiles;
create trigger daily_english_profiles_touch_updated_at
before update on public.daily_english_profiles
for each row execute function private.daily_english_touch_updated_at();

do $migration$
declare
  v_definition text;
  v_old_block text := E'candidate_users as (\n    select user_id from public.daily_english_snapshots\n    union\n    select user_id from public.daily_english_mastery\n  )';
  v_new_block text := E'candidate_users as (\n    select user_id from public.daily_english_profiles\n    union\n    select user_id from public.daily_english_snapshots\n    union\n    select user_id from public.daily_english_mastery\n  )';
begin
  select pg_get_functiondef('private.daily_english_generate_daily_plans()'::regprocedure)
  into v_definition;

  if position(v_new_block in v_definition) > 0 then
    return;
  end if;

  if position(v_old_block in v_definition) = 0 then
    raise exception 'Expected Daily English candidate user block was not found';
  end if;

  execute replace(v_definition, v_old_block, v_new_block);
end
$migration$;

create or replace function private.daily_english_generate_plan_after_profile_insert()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
begin
  perform private.daily_english_generate_daily_plans();
  return null;
end
$$;

revoke all on function private.daily_english_generate_plan_after_profile_insert() from public, anon, authenticated;

drop trigger if exists daily_english_profile_generate_initial_plan on public.daily_english_profiles;
create trigger daily_english_profile_generate_initial_plan
after insert on public.daily_english_profiles
for each statement execute function private.daily_english_generate_plan_after_profile_insert();

select private.daily_english_generate_daily_plans();
