create table if not exists private.daily_english_card_catalog (
  card_id text primary key,
  sequence_no smallint not null unique check (sequence_no between 1 and 150),
  content_version text not null
);

revoke all on private.daily_english_card_catalog from public, anon, authenticated;

insert into private.daily_english_card_catalog (card_id, sequence_no, content_version)
select card_id, sequence_no::smallint, '2026.08.17.4'
from unnest(array[
  'improve-v', 'notice-v', 'support-v', 'likely-adj', 'manage-v',
  'provide-v', 'understand-v', 'believe-v', 'create-v', 'include-v',
  'remember-v', 'allow-v', 'continue-v', 'spend-v', 'change-v',
  'follow-v', 'happen-v', 'become-v', 'seem-v', 'mean-v',
  'offer-v', 'consider-v', 'expect-v', 'develop-v', 'decide-v',
  'explain-v', 'suggest-v', 'require-v', 'prepare-v', 'achieve-v',
  'avoid-v', 'compare-v', 'depend-v', 'increase-v', 'reduce-v',
  'choose-v', 'share-v', 'reach-v', 'remain-v', 'handle-v',
  'affect-v', 'realize-v', 'describe-v', 'accept-v', 'prefer-v',
  'discover-v', 'protect-v', 'encourage-v', 'solve-v', 'express-v',
  'ability-n', 'effort-n', 'reason-n', 'issue-n', 'result-n',
  'experience-n', 'opportunity-n', 'decision-n', 'relationship-n', 'environment-n',
  'information-n', 'community-n', 'service-n', 'system-n', 'level-n',
  'value-n', 'behavior-n', 'attention-n', 'purpose-n', 'choice-n',
  'challenge-n', 'progress-n', 'habit-n', 'goal-n', 'balance-n',
  'confidence-n', 'quality-n', 'success-n', 'advice-n', 'difference-n',
  'important-adj', 'available-adj', 'possible-adj', 'difficult-adj', 'responsible-adj',
  'aware-adj', 'familiar-adj', 'comfortable-adj', 'effective-adj', 'serious-adj',
  'natural-adj', 'clear-adj', 'common-adj', 'similar-adj', 'different-adj',
  'useful-adj', 'careful-adj', 'ready-adj', 'certain-adj', 'patient-adj',
  'actually-adv', 'probably-adv', 'especially-adv', 'recently-adv', 'nearly-adv',
  'instead-adv', 'however-adv', 'finally-adv', 'simply-adv', 'quickly-adv',
  'directly-adv', 'clearly-adv', 'usually-adv', 'perhaps-adv', 'already-adv',
  'still-adv', 'often-adv', 'together-adv', 'forward-adv', 'enough-adv',
  'health-n', 'work-n', 'study-n', 'learn-v', 'speak-v',
  'write-v', 'read-v', 'listen-v', 'travel-n', 'family-n',
  'money-n', 'business-n', 'friend-n', 'home-n', 'problem-n',
  'question-n', 'story-n', 'idea-n', 'place-n', 'time-n',
  'job-n', 'team-n', 'future-n', 'plan-n', 'activity-n',
  'moment-n', 'situation-n', 'language-n', 'skill-n', 'benefit-n'
]::text[]) with ordinality as cards(card_id, sequence_no)
on conflict (card_id) do update set
  sequence_no = excluded.sequence_no,
  content_version = excluded.content_version;

alter table public.daily_english_daily_plans
  add column if not exists study_day integer not null default 1 check (study_day > 0),
  add column if not exists new_card_ids text[] not null default '{}',
  add column if not exists review_card_ids text[] not null default '{}',
  add column if not exists card_prescriptions jsonb not null default '{}'::jsonb
    check (jsonb_typeof(card_prescriptions) = 'object'),
  add column if not exists refresh_anchor_at timestamptz,
  add column if not exists valid_until_at timestamptz,
  add column if not exists algorithm_version text not null default '2026.08.18.1';

comment on column public.daily_english_daily_plans.new_card_ids is
  'Five content card IDs assigned for this Shanghai study day.';
comment on column public.daily_english_daily_plans.review_card_ids is
  'Daily review batch frozen at 05:00; T0 reviews learned later are appended locally when due.';
comment on column public.daily_english_daily_plans.card_prescriptions is
  'Per-card deterministic forgetting risk, focus dimensions, question count, and rationale.';

create or replace function private.daily_english_generate_daily_plans()
returns integer
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_plan_date date := (now() at time zone 'Asia/Shanghai')::date;
  v_anchor timestamptz;
  v_valid_until timestamptz;
  v_rows integer := 0;
begin
  v_anchor := (v_plan_date::timestamp + time '05:00') at time zone 'Asia/Shanghai';
  v_valid_until := v_anchor + interval '1 day';

  with candidate_users as (
    select user_id from public.daily_english_snapshots
    union
    select user_id from public.daily_english_mastery
  ),
  user_context as (
    select
      u.user_id,
      coalesce(
        case
          when s.payload #>> '{settings,firstUseDate}' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
            then (s.payload #>> '{settings,firstUseDate}')::date
        end,
        (min(m.learned_at) at time zone 'Asia/Shanghai')::date,
        v_plan_date
      ) as first_study_date
    from candidate_users u
    left join public.daily_english_snapshots s on s.user_id = u.user_id
    left join public.daily_english_mastery m on m.user_id = u.user_id
    group by u.user_id, s.payload
  ),
  study_context as (
    select
      user_id,
      greatest(1, v_plan_date - first_study_date + 1) as study_day
    from user_context
  ),
  new_rollup as (
    select
      u.user_id,
      u.study_day,
      coalesce(array_agg(c.card_id order by c.sequence_no), '{}') as new_card_ids
    from study_context u
    left join private.daily_english_card_catalog c
      on c.sequence_no between mod(u.study_day - 1, 30) * 5 + 1
        and mod(u.study_day - 1, 30) * 5 + 5
    group by u.user_id, u.study_day
  ),
  risk_base as (
    select
      m.user_id,
      m.card_id,
      m.stage,
      m.next_review_at,
      m.last_reviewed_at,
      m.mastery_score,
      m.weak,
      m.wrong_count,
      m.unstable_count,
      m.target_question_count,
      m.next_review_at < v_valid_until as due_in_batch,
      greatest(0, extract(epoch from (v_anchor - m.next_review_at)) / 86400.0) as overdue_days,
      greatest(0, extract(epoch from (v_anchor - coalesce(m.last_reviewed_at, m.learned_at))) / 86400.0) as inactive_days,
      case
        when cardinality(m.weak_dimensions) > 0 then m.weak_dimensions
        else coalesce((
          select array_agg(dimension.key order by dimension.value::numeric)
          from jsonb_each_text(m.dimension_scores) as dimension(key, value)
          where dimension.value ~ '^[0-9]+([.][0-9]+)?$'
            and dimension.value::numeric < 75
        ), '{}')
      end as focus_dimensions
    from public.daily_english_mastery m
    join study_context u on u.user_id = m.user_id
  ),
  risk_scored as (
    select
      r.*,
      least(100, greatest(0, round(
        case when r.due_in_batch then 20 else 0 end
        + least(30, r.overdue_days * 12)
        + case when r.weak then 20 else 0 end
        + (100 - r.mastery_score) * 0.30
        + least(15, r.wrong_count * 3)
        + least(10, r.unstable_count * 2)
        + least(10, r.inactive_days * 0.50)
      )))::integer as risk_score
    from risk_base r
  ),
  risk_prescribed as (
    select
      r.*,
      case when r.risk_score >= 75 then 'high' when r.risk_score >= 55 then 'medium' else 'low' end as risk_level,
      case
        when r.weak or r.risk_score >= 75 then 12
        when r.risk_score >= 55 then 10
        else greatest(8, r.target_question_count)
      end as prescribed_question_count,
      case
        when cardinality(r.focus_dimensions) > 0 then r.focus_dimensions
        when r.mastery_score < 75 then array['activeRecall']::text[]
        else '{}'::text[]
      end as prescribed_dimensions,
      case
        when r.next_review_at <= v_anchor then '已到期或逾期，今日优先完成复测。'
        when r.weak then '薄弱项尚未稳定，今日安排预防性强化。'
        when r.mastery_score < 75 then '综合掌握度不足，今日增加主动回忆。'
        else '遗忘风险上升，今日进行短时巩固。'
      end as reason
    from risk_scored r
    where r.due_in_batch or r.weak or r.risk_score >= 55
  ),
  ranked as (
    select
      r.*,
      row_number() over (
        partition by r.user_id
        order by r.due_in_batch desc, r.risk_score desc, r.next_review_at asc
      ) as rank_no
    from risk_prescribed r
  ),
  selected as (
    select * from ranked where rank_no <= 30
  ),
  review_rollup as (
    select
      u.user_id,
      coalesce(
        array_agg(r.card_id order by r.due_in_batch desc, r.risk_score desc, r.next_review_at asc)
          filter (where r.card_id is not null),
        '{}'
      ) as review_card_ids,
      coalesce(
        jsonb_object_agg(
          r.card_id,
          jsonb_build_object(
            'riskScore', r.risk_score,
            'riskLevel', r.risk_level,
            'targetQuestionCount', r.prescribed_question_count,
            'focusDimensions', to_jsonb(r.prescribed_dimensions),
            'dueAt', r.next_review_at,
            'overdueDays', round(r.overdue_days::numeric, 1),
            'reason', r.reason
          )
        ) filter (where r.card_id is not null),
        '{}'::jsonb
      ) as card_prescriptions,
      count(*) filter (where r.card_id is not null and r.risk_level = 'high') as high_risk_count,
      count(*) filter (where r.card_id is not null and r.risk_level = 'medium') as medium_risk_count,
      count(*) filter (where r.card_id is not null and r.due_in_batch) as due_count,
      count(*) filter (where r.card_id is not null and r.weak) as weak_count,
      round(avg(r.mastery_score) filter (where r.card_id is not null), 1) as average_mastery
    from study_context u
    left join selected r on r.user_id = u.user_id
    group by u.user_id
  ),
  focus_rollup as (
    select
      r.user_id,
      coalesce(array_agg(distinct dimension), '{}') as focus_dimensions
    from selected r
    cross join lateral unnest(r.prescribed_dimensions) as dimension
    group by r.user_id
  )
  insert into public.daily_english_daily_plans (
    user_id,
    plan_date,
    generated_at,
    study_day,
    new_card_ids,
    review_card_ids,
    recommended_card_ids,
    card_prescriptions,
    focus_dimensions,
    target_question_count,
    refresh_anchor_at,
    valid_until_at,
    algorithm_version,
    summary,
    analysis
  )
  select
    n.user_id,
    v_plan_date,
    now(),
    n.study_day,
    n.new_card_ids,
    r.review_card_ids,
    r.review_card_ids,
    r.card_prescriptions,
    coalesce(f.focus_dimensions, '{}'),
    case when r.high_risk_count > 0 or r.weak_count > 0 then 12 when r.medium_risk_count > 0 then 10 else 8 end,
    v_anchor,
    v_valid_until,
    '2026.08.18.1',
    case
      when r.high_risk_count > 0 then '今日有 ' || r.high_risk_count || ' 个高遗忘风险词，优先强化薄弱维度，再完成其他到期词。'
      when r.due_count > 0 then '今日有 ' || r.due_count || ' 个到期词，已按遗忘风险从高到低安排。'
      when cardinality(r.review_card_ids) > 0 then '今天安排预防性巩固，重点处理掌握度下降的词。'
      else '今天暂无到期复习；完成 5 张新词卡后，20 分钟 T0 复测会自动加入。'
    end,
    jsonb_build_object(
      'newWordCount', cardinality(n.new_card_ids),
      'reviewWordCount', cardinality(r.review_card_ids),
      'highRiskCount', r.high_risk_count,
      'mediumRiskCount', r.medium_risk_count,
      'weakWordCount', r.weak_count,
      'dueWordCount', r.due_count,
      'averageMastery', r.average_mastery,
      'studyDay', n.study_day,
      'batchStartsAt', v_anchor,
      'batchEndsAt', v_valid_until,
      'selectionLimit', 30,
      't0RealtimeAppend', true,
      'algorithmVersion', '2026.08.18.1',
      'timezone', 'Asia/Shanghai',
      'usesModelApi', false
    )
  from new_rollup n
  join review_rollup r using (user_id)
  left join focus_rollup f using (user_id)
  on conflict (user_id, plan_date) do update set
    generated_at = excluded.generated_at,
    study_day = excluded.study_day,
    new_card_ids = excluded.new_card_ids,
    review_card_ids = excluded.review_card_ids,
    recommended_card_ids = excluded.recommended_card_ids,
    card_prescriptions = excluded.card_prescriptions,
    focus_dimensions = excluded.focus_dimensions,
    target_question_count = excluded.target_question_count,
    refresh_anchor_at = excluded.refresh_anchor_at,
    valid_until_at = excluded.valid_until_at,
    algorithm_version = excluded.algorithm_version,
    summary = excluded.summary,
    analysis = excluded.analysis;

  get diagnostics v_rows = row_count;

  update public.daily_english_mastery m
  set
    target_question_count = greatest(
      m.target_question_count,
      coalesce((p.card_prescriptions -> m.card_id ->> 'targetQuestionCount')::integer, m.target_question_count)
    ),
    last_analyzed_at = now()
  from public.daily_english_daily_plans p
  where p.plan_date = v_plan_date
    and p.user_id = m.user_id
    and p.card_prescriptions ? m.card_id;

  return v_rows;
end
$$;

revoke all on function private.daily_english_generate_daily_plans() from public, anon, authenticated;
grant execute on function private.daily_english_generate_daily_plans() to postgres, service_role;

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
