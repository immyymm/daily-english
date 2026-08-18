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
      'meaningContext', round(avg((dimension_scores ->> 'meaningContext')::numeric) filter (where dimension_scores ? 'meaningContext')),
      'activeRecall', round(avg((dimension_scores ->> 'activeRecall')::numeric) filter (where dimension_scores ? 'activeRecall')),
      'collocation', round(avg((dimension_scores ->> 'collocation')::numeric) filter (where dimension_scores ? 'collocation')),
      'grammar', round(avg((dimension_scores ->> 'grammar')::numeric) filter (where dimension_scores ? 'grammar')),
      'naturalness', round(avg((dimension_scores ->> 'naturalness')::numeric) filter (where dimension_scores ? 'naturalness'))
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
