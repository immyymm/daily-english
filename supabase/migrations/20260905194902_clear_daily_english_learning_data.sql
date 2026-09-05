create or replace function public.daily_english_clear_my_learning_data()
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  v_user_id uuid := auth.uid();
  v_reset_at timestamptz := now();
  v_first_study_date date := (now() at time zone 'Asia/Shanghai')::date;
  v_revision bigint;
  v_attempts integer := 0;
  v_mastery integer := 0;
  v_evaluations integer := 0;
  v_plans integer := 0;
  v_recommendations integer := 0;
  v_sessions integer := 0;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  delete from public.daily_english_review_sessions where user_id = v_user_id;
  get diagnostics v_sessions = row_count;

  delete from public.daily_english_ai_evaluations where user_id = v_user_id;
  get diagnostics v_evaluations = row_count;

  delete from public.daily_english_attempts where user_id = v_user_id;
  get diagnostics v_attempts = row_count;

  delete from public.daily_english_mastery where user_id = v_user_id;
  get diagnostics v_mastery = row_count;

  delete from public.daily_english_daily_plans where user_id = v_user_id;
  get diagnostics v_plans = row_count;

  delete from public.daily_english_codex_recommendations where user_id = v_user_id;
  get diagnostics v_recommendations = row_count;

  insert into public.daily_english_profiles (
    user_id,
    first_study_date,
    timezone,
    updated_at
  ) values (
    v_user_id,
    v_first_study_date,
    'Asia/Shanghai',
    v_reset_at
  )
  on conflict (user_id) do update set
    first_study_date = excluded.first_study_date,
    timezone = excluded.timezone,
    updated_at = excluded.updated_at;

  insert into public.daily_english_snapshots (
    user_id,
    payload,
    schema_version,
    client_updated_at,
    updated_at,
    revision,
    device_id
  ) values (
    v_user_id,
    jsonb_build_object(
      'settings', jsonb_build_object(
        'id', 'settings',
        'firstUseDate', v_first_study_date::text,
        'dataResetAt', v_reset_at,
        'streak', 1,
        'aiConsent', false,
        'reduceMotion', false,
        'dailyAiLimit', 20
      ),
      'progress', '[]'::jsonb,
      'attempts', '[]'::jsonb,
      'aiEvaluations', '[]'::jsonb,
      'dailyPlans', '[]'::jsonb,
      'dailyRecommendations', '[]'::jsonb,
      'reviewSessions', '[]'::jsonb,
      'exportedAt', v_reset_at,
      'schemaVersion', 3
    ),
    3,
    v_reset_at,
    v_reset_at,
    1,
    'server-reset'
  )
  on conflict (user_id) do update set
    payload = excluded.payload,
    schema_version = excluded.schema_version,
    client_updated_at = excluded.client_updated_at,
    updated_at = excluded.updated_at,
    revision = public.daily_english_snapshots.revision + 1,
    device_id = excluded.device_id
  returning revision into v_revision;

  return jsonb_build_object(
    'reset_at', v_reset_at,
    'first_study_date', v_first_study_date,
    'revision', v_revision,
    'deleted', jsonb_build_object(
      'attempts', v_attempts,
      'mastery', v_mastery,
      'evaluations', v_evaluations,
      'daily_plans', v_plans,
      'codex_recommendations', v_recommendations,
      'review_sessions', v_sessions
    )
  );
end
$$;

revoke all on function public.daily_english_clear_my_learning_data() from public, anon, authenticated;
grant execute on function public.daily_english_clear_my_learning_data() to authenticated;

comment on function public.daily_english_clear_my_learning_data() is
  'Atomically clears the authenticated user''s Daily English learning history and publishes a reset snapshot for every device.';
