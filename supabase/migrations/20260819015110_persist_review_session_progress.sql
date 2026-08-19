create table public.daily_english_review_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id text not null,
  session_date date not null,
  status text not null default 'active' check (status in ('active', 'completed')),
  initial_card_ids text[] not null default '{}',
  queue_card_ids text[] not null default '{}',
  batch_total integer not null check (batch_total between 1 and 100),
  current_card_id text,
  stage text check (stage is null or stage in ('T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7')),
  question_ids text[] not null default '{}',
  question_index integer not null default 0 check (question_index between 0 and 100),
  answer text not null default '',
  feedback jsonb check (feedback is null or jsonb_typeof(feedback) = 'object'),
  attempts jsonb not null default '[]'::jsonb check (jsonb_typeof(attempts) = 'array'),
  shown_at timestamptz not null,
  speech_latency integer check (speech_latency is null or speech_latency >= 0),
  attempt_session_id text not null,
  client_updated_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  device_id text,
  primary key (user_id, session_id)
);

create index daily_english_review_sessions_user_date_idx
  on public.daily_english_review_sessions (user_id, session_date desc, status, client_updated_at desc);

comment on table public.daily_english_review_sessions is
  'Realtime resumable per-question review progress for the Daily English PWA.';

alter table public.daily_english_review_sessions enable row level security;
alter table public.daily_english_review_sessions force row level security;

revoke all on table public.daily_english_review_sessions from public, anon, authenticated;
grant select, insert, update on table public.daily_english_review_sessions to authenticated;

create policy daily_english_review_sessions_select_own
on public.daily_english_review_sessions
for select to authenticated
using ((select auth.uid()) = user_id);

create policy daily_english_review_sessions_insert_own
on public.daily_english_review_sessions
for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy daily_english_review_sessions_update_own
on public.daily_english_review_sessions
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create trigger daily_english_review_sessions_touch_updated_at
before update on public.daily_english_review_sessions
for each row execute function private.daily_english_touch_updated_at();

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'daily_english_review_sessions'
  ) then
    alter publication supabase_realtime add table public.daily_english_review_sessions;
  end if;
end
$$;
