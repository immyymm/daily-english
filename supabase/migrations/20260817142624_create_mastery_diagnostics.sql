create schema if not exists private;

create table public.daily_english_attempts (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  card_id text not null,
  question_id text not null,
  question_type text not null,
  stage text not null,
  prompt text not null,
  answer text not null,
  correct_answer text not null default '',
  score smallint not null check (score between 0 and 100),
  correct boolean not null,
  response_ms integer not null default 0 check (response_ms >= 0),
  error_types text[] not null default '{}',
  dimension_scores jsonb not null default '{}'::jsonb check (jsonb_typeof(dimension_scores) = 'object'),
  ai boolean not null default false,
  session_id text,
  schedule_impact boolean not null default true,
  created_at timestamptz not null,
  device_id text,
  primary key (user_id, id)
);

create index daily_english_attempts_user_card_created_idx
  on public.daily_english_attempts (user_id, card_id, created_at desc);

create table public.daily_english_mastery (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id text not null,
  learned_at timestamptz not null,
  stage text not null default 'T0',
  next_review_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  status text not null default '学习中',
  last_score smallint check (last_score is null or last_score between 0 and 100),
  correct_streak integer not null default 0 check (correct_streak >= 0),
  wrong_count integer not null default 0 check (wrong_count >= 0),
  unstable_count integer not null default 0 check (unstable_count >= 0),
  weak boolean not null default false,
  passed_t7 boolean not null default false,
  passed_t30 boolean not null default false,
  passed_t60 boolean not null default false,
  mastery_score numeric(5,2) not null default 0 check (mastery_score between 0 and 100),
  dimension_scores jsonb not null default '{}'::jsonb check (jsonb_typeof(dimension_scores) = 'object'),
  weak_dimensions text[] not null default '{}',
  error_counts jsonb not null default '{}'::jsonb check (jsonb_typeof(error_counts) = 'object'),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  target_question_count integer not null default 8 check (target_question_count between 5 and 17),
  last_analyzed_at timestamptz,
  device_id text,
  updated_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

create index daily_english_mastery_due_idx
  on public.daily_english_mastery (user_id, next_review_at, weak desc);

create table public.daily_english_ai_evaluations (
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id text not null,
  card_id text not null,
  question_id text not null,
  question_type text not null,
  stage text not null,
  prompt text not null,
  answer text not null,
  correct_answer text not null default '',
  response_ms integer not null default 0 check (response_ms >= 0),
  status text not null default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  request_payload jsonb not null default '{}'::jsonb check (jsonb_typeof(request_payload) = 'object'),
  result jsonb,
  model text,
  rubric_version text not null,
  token_usage jsonb,
  estimated_cost_microusd bigint,
  error_message text,
  retry_count integer not null default 0 check (retry_count >= 0),
  queued_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, request_id)
);

create index daily_english_ai_evaluations_status_idx
  on public.daily_english_ai_evaluations (user_id, status, updated_at desc);

create table public.daily_english_daily_plans (
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_date date not null,
  generated_at timestamptz not null default now(),
  recommended_card_ids text[] not null default '{}',
  focus_dimensions text[] not null default '{}',
  target_question_count integer not null default 10 check (target_question_count between 5 and 17),
  summary text not null,
  analysis jsonb not null default '{}'::jsonb check (jsonb_typeof(analysis) = 'object'),
  primary key (user_id, plan_date)
);

comment on table public.daily_english_mastery is
  'Realtime per-word mastery matrix and forgetting-curve schedule for Daily English.';
comment on table public.daily_english_ai_evaluations is
  'Durable, retrievable AI evaluation jobs and results for Daily English.';
comment on table public.daily_english_daily_plans is
  'Daily 05:00 Asia/Shanghai adaptive review prescriptions.';

alter table public.daily_english_attempts enable row level security;
alter table public.daily_english_attempts force row level security;
alter table public.daily_english_mastery enable row level security;
alter table public.daily_english_mastery force row level security;
alter table public.daily_english_ai_evaluations enable row level security;
alter table public.daily_english_ai_evaluations force row level security;
alter table public.daily_english_daily_plans enable row level security;
alter table public.daily_english_daily_plans force row level security;

revoke all on public.daily_english_attempts from anon, authenticated;
revoke all on public.daily_english_mastery from anon, authenticated;
revoke all on public.daily_english_ai_evaluations from anon, authenticated;
revoke all on public.daily_english_daily_plans from anon, authenticated;

grant select, insert, update, delete on public.daily_english_attempts to authenticated;
grant select, insert, update, delete on public.daily_english_mastery to authenticated;
grant select, insert, update on public.daily_english_ai_evaluations to authenticated;
grant select on public.daily_english_daily_plans to authenticated;

create policy daily_english_attempts_own
on public.daily_english_attempts for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy daily_english_mastery_own
on public.daily_english_mastery for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy daily_english_ai_evaluations_select_own
on public.daily_english_ai_evaluations for select to authenticated
using ((select auth.uid()) = user_id);

create policy daily_english_ai_evaluations_insert_own
on public.daily_english_ai_evaluations for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy daily_english_ai_evaluations_update_own
on public.daily_english_ai_evaluations for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy daily_english_daily_plans_select_own
on public.daily_english_daily_plans for select to authenticated
using ((select auth.uid()) = user_id);

create or replace function private.daily_english_touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
begin
  new.updated_at := now();
  return new;
end
$$;

revoke all on function private.daily_english_touch_updated_at() from public, anon, authenticated;

create trigger daily_english_mastery_touch_updated_at
before update on public.daily_english_mastery
for each row execute function private.daily_english_touch_updated_at();

create trigger daily_english_ai_evaluations_touch_updated_at
before update on public.daily_english_ai_evaluations
for each row execute function private.daily_english_touch_updated_at();

create or replace function private.daily_english_refresh_mastery_from_attempt()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_attempt_count integer;
  v_average_score numeric;
  v_dimension_average numeric;
  v_mastery_score numeric;
  v_dimension_scores jsonb;
  v_error_counts jsonb;
  v_weak_dimensions text[];
  v_reinforcement_due timestamptz;
begin
  select
    count(*),
    avg(score),
    jsonb_strip_nulls(jsonb_build_object(
      'meaningContext', round(avg((dimension_scores ->> 'meaningContext')::numeric)) filter (where dimension_scores ? 'meaningContext'),
      'activeRecall', round(avg((dimension_scores ->> 'activeRecall')::numeric)) filter (where dimension_scores ? 'activeRecall'),
      'collocation', round(avg((dimension_scores ->> 'collocation')::numeric)) filter (where dimension_scores ? 'collocation'),
      'grammar', round(avg((dimension_scores ->> 'grammar')::numeric)) filter (where dimension_scores ? 'grammar'),
      'naturalness', round(avg((dimension_scores ->> 'naturalness')::numeric)) filter (where dimension_scores ? 'naturalness')
    ))
  into v_attempt_count, v_average_score, v_dimension_scores
  from public.daily_english_attempts
  where user_id = new.user_id and card_id = new.card_id;

  select coalesce(jsonb_object_agg(error_type, occurrences), '{}'::jsonb)
  into v_error_counts
  from (
    select error_type, count(*) as occurrences
    from public.daily_english_attempts a
    cross join lateral unnest(a.error_types) as error_type
    where a.user_id = new.user_id and a.card_id = new.card_id
    group by error_type
  ) errors;

  select avg(value::numeric)
  into v_dimension_average
  from jsonb_each_text(v_dimension_scores);

  v_mastery_score := round(coalesce(v_dimension_average, v_average_score, 0) * 0.75 + coalesce(v_average_score, 0) * 0.25);

  select coalesce(array_agg(key order by value::numeric), '{}')
  into v_weak_dimensions
  from jsonb_each_text(v_dimension_scores)
  where value::numeric < 75;

  v_reinforcement_due := now() + case when new.score < 60 then interval '20 minutes' else interval '1 day' end;

  insert into public.daily_english_mastery (
    user_id, card_id, learned_at, stage, next_review_at, last_reviewed_at,
    status, last_score, weak, mastery_score, dimension_scores, weak_dimensions,
    error_counts, attempt_count, target_question_count, last_analyzed_at
  ) values (
    new.user_id, new.card_id, new.created_at, new.stage,
    case when new.score < 75 then v_reinforcement_due else new.created_at + interval '1 day' end,
    new.created_at,
    case when new.score < 75 or cardinality(v_weak_dimensions) > 0 then '薄弱词' else '识别词汇' end,
    new.score,
    new.score < 75 or cardinality(v_weak_dimensions) > 0,
    v_mastery_score,
    v_dimension_scores,
    v_weak_dimensions,
    v_error_counts,
    v_attempt_count,
    case when new.score < 75 or cardinality(v_weak_dimensions) > 0 then 12 else 8 end,
    now()
  )
  on conflict (user_id, card_id) do update set
    last_score = excluded.last_score,
    mastery_score = excluded.mastery_score,
    dimension_scores = excluded.dimension_scores,
    weak_dimensions = excluded.weak_dimensions,
    error_counts = excluded.error_counts,
    attempt_count = excluded.attempt_count,
    weak = public.daily_english_mastery.weak or excluded.weak,
    status = case when excluded.weak then '薄弱词' else public.daily_english_mastery.status end,
    next_review_at = case
      when excluded.weak and public.daily_english_mastery.next_review_at > v_reinforcement_due then v_reinforcement_due
      else public.daily_english_mastery.next_review_at
    end,
    target_question_count = case when excluded.weak then 12 else greatest(public.daily_english_mastery.target_question_count, 8) end,
    last_analyzed_at = now();

  return new;
end
$$;

revoke all on function private.daily_english_refresh_mastery_from_attempt() from public, anon, authenticated;

create trigger daily_english_attempt_refresh_mastery
after insert or update of score, error_types, dimension_scores
on public.daily_english_attempts
for each row execute function private.daily_english_refresh_mastery_from_attempt();

create or replace function private.daily_english_generate_daily_plans()
returns integer
language plpgsql
security invoker
set search_path = pg_catalog, public, private
as $$
declare
  v_plan_date date := (now() at time zone 'Asia/Shanghai')::date;
  v_rows integer := 0;
begin
  with scored as (
    select
      m.*,
      (case when m.weak then 100000 else 0 end)
      + greatest(0, extract(epoch from (now() - m.next_review_at)) / 3600) * 10
      + (100 - m.mastery_score) * 4
      + m.wrong_count * 20
      + m.unstable_count * 15 as priority
    from public.daily_english_mastery m
  ),
  ranked as (
    select scored.*, row_number() over (partition by user_id order by priority desc, next_review_at asc) as rank_no
    from scored
  ),
  recommended as (
    select
      user_id,
      array_agg(card_id order by priority desc, next_review_at asc) filter (where rank_no <= 20) as card_ids,
      count(*) filter (where weak) as weak_count,
      count(*) filter (where next_review_at <= now()) as due_count,
      round(avg(mastery_score), 1) as average_mastery
    from ranked
    group by user_id
  ),
  dimension_values as (
    select m.user_id, dimensions.key as dimension, avg(dimensions.value::numeric) as score
    from public.daily_english_mastery m
    cross join lateral jsonb_each_text(m.dimension_scores) dimensions
    group by m.user_id, dimensions.key
  ),
  focus as (
    select
      user_id,
      coalesce(array_agg(dimension order by score) filter (where score < 75), '{}') as focus_dimensions
    from dimension_values
    group by user_id
  )
  insert into public.daily_english_daily_plans (
    user_id, plan_date, generated_at, recommended_card_ids, focus_dimensions,
    target_question_count, summary, analysis
  )
  select
    r.user_id,
    v_plan_date,
    now(),
    coalesce(r.card_ids, '{}'),
    coalesce(f.focus_dimensions, '{}'),
    case when r.weak_count > 0 or cardinality(coalesce(f.focus_dimensions, '{}')) > 0 then 12 else 10 end,
    case
      when r.weak_count > 0 then '今日优先处理 ' || r.weak_count || ' 个薄弱词，并按遗忘风险强化低分维度。'
      when r.due_count > 0 then '今日有 ' || r.due_count || ' 个到期词，按遗忘曲线从高风险到低风险复习。'
      else '今天没有明显逾期词，安排低掌握度词进行预防性巩固。'
    end,
    jsonb_build_object(
      'weakWordCount', r.weak_count,
      'dueWordCount', r.due_count,
      'averageMastery', r.average_mastery,
      'algorithmVersion', '2026.08.17.1',
      'timezone', 'Asia/Shanghai'
    )
  from recommended r
  left join focus f using (user_id)
  on conflict (user_id, plan_date) do update set
    generated_at = excluded.generated_at,
    recommended_card_ids = excluded.recommended_card_ids,
    focus_dimensions = excluded.focus_dimensions,
    target_question_count = excluded.target_question_count,
    summary = excluded.summary,
    analysis = excluded.analysis;

  get diagnostics v_rows = row_count;

  update public.daily_english_mastery m
  set
    target_question_count = p.target_question_count,
    last_analyzed_at = now()
  from public.daily_english_daily_plans p
  where p.plan_date = v_plan_date
    and p.user_id = m.user_id
    and m.card_id = any(p.recommended_card_ids);

  return v_rows;
end
$$;

revoke all on function private.daily_english_generate_daily_plans() from public, anon, authenticated;
grant execute on function private.daily_english_generate_daily_plans() to postgres, service_role;

do $$
begin
  alter publication supabase_realtime add table public.daily_english_attempts;
exception when duplicate_object then null;
end
$$;

do $$
begin
  alter publication supabase_realtime add table public.daily_english_mastery;
exception when duplicate_object then null;
end
$$;

do $$
begin
  alter publication supabase_realtime add table public.daily_english_ai_evaluations;
exception when duplicate_object then null;
end
$$;

do $$
begin
  alter publication supabase_realtime add table public.daily_english_daily_plans;
exception when duplicate_object then null;
end
$$;

create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

do $$
declare
  existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'daily-english-0500-shanghai';
  if existing_job is not null then
    perform cron.unschedule(existing_job);
  end if;
end
$$;

select cron.schedule(
  'daily-english-0500-shanghai',
  '0 21 * * *',
  'select private.daily_english_generate_daily_plans();'
);

select private.daily_english_generate_daily_plans();
