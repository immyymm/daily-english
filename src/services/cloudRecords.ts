import type { SupabaseClient } from '@supabase/supabase-js';
import { calculateMasteryProfile } from '../learning/mastery';
import { evaluationSchema } from '../schemas/evaluation';
import { db } from '../storage/db';
import type {
  AIEvaluation,
  AppSnapshot,
  Attempt,
  CardProgress,
  CodexDailyAnalysis,
  DailyCardPrescription,
  DailyRecommendation,
  MasteryDimension,
  QuestionType,
  ReviewStage
} from '../types';

const CHUNK_SIZE = 250;
const masteryDimensionValues: MasteryDimension[] = [
  'meaningContext',
  'activeRecall',
  'collocation',
  'grammar',
  'naturalness'
];
const masteryDimensionSet = new Set<string>(masteryDimensionValues);

function chunks<T>(items: T[]) {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += CHUNK_SIZE) result.push(items.slice(index, index + CHUNK_SIZE));
  return result;
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function masteryDimensions(value: unknown): MasteryDimension[] {
  return [...new Set(stringArray(value).filter((item): item is MasteryDimension => masteryDimensionSet.has(item)))];
}

function boundedQuestionCount(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(5, Math.min(17, Math.round(parsed))) : fallback;
}

function parseCodexAnalysis(value: unknown): CodexDailyAnalysis | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const raw = value as Record<string, unknown>;
  const summary = String(raw.summary ?? '').trim();
  if (!summary) return undefined;
  const risk = String(raw.overallRisk ?? 'low');
  const rawWeaknesses = Array.isArray(raw.weaknesses) ? raw.weaknesses : [];
  const weaknesses = rawWeaknesses.flatMap((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    const insight = item as Record<string, unknown>;
    const dimensions = masteryDimensions([insight.dimension]);
    if (!dimensions.length) return [];
    return [{
      dimension: dimensions[0],
      evidence: String(insight.evidence ?? '').trim(),
      action: String(insight.action ?? '').trim()
    }];
  }).filter((item) => item.evidence || item.action).slice(0, 5);
  const rawAdjustments = raw.cardAdjustments && typeof raw.cardAdjustments === 'object' && !Array.isArray(raw.cardAdjustments)
    ? raw.cardAdjustments as Record<string, unknown>
    : {};
  const cardAdjustments = Object.fromEntries(Object.entries(rawAdjustments).flatMap(([cardId, item]) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    const adjustment = item as Record<string, unknown>;
    return [[cardId, {
      targetQuestionCount: boundedQuestionCount(adjustment.targetQuestionCount, 8),
      focusDimensions: masteryDimensions(adjustment.focusDimensions),
      reason: String(adjustment.reason ?? '').trim()
    }]];
  }));
  return {
    schemaVersion: raw.schemaVersion ? String(raw.schemaVersion) : undefined,
    overallRisk: risk === 'high' || risk === 'medium' ? risk : 'low',
    summary,
    focusDimensions: masteryDimensions(raw.focusDimensions),
    targetQuestionCount: boundedQuestionCount(raw.targetQuestionCount, 10),
    recommendedCardIds: stringArray(raw.recommendedCardIds),
    weaknesses,
    strategy: stringArray(raw.strategy).map((item) => item.trim()).filter(Boolean).slice(0, 6),
    cardAdjustments
  };
}

async function fetchAll(client: SupabaseClient, table: string, userId: string) {
  const rows: Record<string, unknown>[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await client.from(table).select('*').eq('user_id', userId).range(from, from + 999);
    if (error) throw error;
    const page = (data ?? []) as Record<string, unknown>[];
    rows.push(...page);
    if (page.length < 1000) break;
  }
  return rows;
}

export async function syncDetailedRecords(
  client: SupabaseClient,
  userId: string,
  snapshot: AppSnapshot,
  deviceId?: string
) {
  const attemptRows = snapshot.attempts.map((attempt) => ({
    user_id: userId,
    id: attempt.id,
    card_id: attempt.cardId,
    question_id: attempt.questionId,
    question_type: attempt.questionType,
    stage: attempt.stage,
    prompt: attempt.prompt,
    answer: attempt.answer,
    correct_answer: attempt.correctAnswer,
    score: attempt.score,
    correct: attempt.correct,
    response_ms: attempt.responseMs,
    error_types: attempt.errorTypes,
    dimension_scores: attempt.dimensionScores ?? {},
    ai: attempt.ai,
    session_id: attempt.sessionId ?? null,
    schedule_impact: attempt.scheduleImpact ?? !attempt.ai,
    created_at: attempt.createdAt,
    device_id: deviceId ?? null
  }));

  for (const batch of chunks(attemptRows)) {
    const { error } = await client.from('daily_english_attempts').upsert(batch, { onConflict: 'user_id,id' });
    if (error) throw error;
  }

  const evaluationRows = snapshot.aiEvaluations.map((evaluation) => ({
    user_id: userId,
    request_id: evaluation.requestId,
    card_id: evaluation.cardId,
    question_id: evaluation.questionId ?? evaluation.requestId,
    question_type: evaluation.questionType,
    stage: evaluation.stage,
    prompt: evaluation.prompt ?? '',
    answer: evaluation.answer,
    correct_answer: evaluation.correctAnswer ?? '',
    response_ms: evaluation.responseMs ?? 0,
    status: evaluation.status,
    request_payload: {
      prompt: evaluation.prompt ?? '',
      answer: evaluation.answer,
      questionId: evaluation.questionId ?? evaluation.requestId,
      correctAnswer: evaluation.correctAnswer ?? '',
      responseMs: evaluation.responseMs ?? 0
    },
    result: evaluation.result ?? null,
    model: evaluation.model ?? null,
    rubric_version: evaluation.rubricVersion,
    token_usage: evaluation.tokenUsage ?? null,
    error_message: evaluation.errorMessage ?? null,
    retry_count: evaluation.retryCount ?? 0,
    queued_at: evaluation.createdAt,
    completed_at: evaluation.status === 'complete' ? evaluation.updatedAt ?? evaluation.createdAt : null,
    created_at: evaluation.createdAt,
    updated_at: evaluation.updatedAt ?? evaluation.createdAt
  }));

  for (const batch of chunks(evaluationRows)) {
    const { error } = await client.from('daily_english_ai_evaluations').upsert(batch, {
      onConflict: 'user_id,request_id',
      ignoreDuplicates: true
    });
    if (error) throw error;
  }

  const attemptsByCard = new Map<string, Attempt[]>();
  snapshot.attempts.forEach((attempt) => {
    const list = attemptsByCard.get(attempt.cardId) ?? [];
    list.push(attempt);
    attemptsByCard.set(attempt.cardId, list);
  });
  const masteryRows = snapshot.progress.map((progress) => {
    const profile = calculateMasteryProfile(attemptsByCard.get(progress.cardId) ?? []);
    const dimensionScores = { ...profile.dimensionScores, ...progress.dimensionScores };
    const weakDimensions = progress.weakDimensions ?? profile.weakDimensions;
    return {
      user_id: userId,
      card_id: progress.cardId,
      learned_at: progress.learnedAt,
      stage: progress.stage,
      next_review_at: progress.nextReviewAt,
      last_reviewed_at: progress.lastReviewedAt ?? null,
      status: progress.status,
      last_score: progress.lastScore ?? null,
      correct_streak: progress.correctStreak,
      wrong_count: progress.wrongCount,
      unstable_count: progress.unstableCount,
      weak: progress.weak || weakDimensions.length > 0,
      passed_t7: progress.passedT7,
      passed_t30: progress.passedT30,
      passed_t60: progress.passedT60,
      mastery_score: progress.masteryScore ?? profile.masteryScore,
      dimension_scores: dimensionScores,
      weak_dimensions: weakDimensions,
      error_counts: progress.errorCounts ?? profile.errorCounts,
      attempt_count: progress.attemptCount ?? profile.attemptCount,
      target_question_count: progress.targetQuestionCount ?? (progress.weak ? 12 : 8),
      last_analyzed_at: progress.lastAnalyzedAt ?? null,
      device_id: deviceId ?? null,
      updated_at: new Date().toISOString()
    };
  });

  for (const batch of chunks(masteryRows)) {
    const { error } = await client.from('daily_english_mastery').upsert(batch, { onConflict: 'user_id,card_id' });
    if (error) throw error;
  }
}

function rowToAttempt(row: Record<string, unknown>): Attempt {
  return {
    id: String(row.id),
    cardId: String(row.card_id),
    questionId: String(row.question_id),
    questionType: row.question_type as QuestionType,
    stage: row.stage as ReviewStage,
    prompt: String(row.prompt ?? ''),
    answer: String(row.answer ?? ''),
    correctAnswer: String(row.correct_answer ?? ''),
    score: Number(row.score ?? 0),
    correct: Boolean(row.correct),
    responseMs: Number(row.response_ms ?? 0),
    errorTypes: Array.isArray(row.error_types) ? row.error_types.map(String) : [],
    dimensionScores: (row.dimension_scores ?? {}) as Attempt['dimensionScores'],
    ai: Boolean(row.ai),
    sessionId: row.session_id ? String(row.session_id) : undefined,
    scheduleImpact: row.schedule_impact === undefined ? undefined : Boolean(row.schedule_impact),
    createdAt: String(row.created_at)
  };
}

function rowToEvaluation(row: Record<string, unknown>): AIEvaluation {
  const payload = (row.request_payload ?? {}) as Record<string, unknown>;
  const parsed = evaluationSchema.safeParse(row.result);
  return {
    requestId: String(row.request_id),
    cardId: String(row.card_id),
    questionType: row.question_type as QuestionType,
    stage: row.stage as ReviewStage,
    answer: String(row.answer ?? payload.answer ?? ''),
    status: row.status as AIEvaluation['status'],
    createdAt: String(row.created_at ?? row.queued_at),
    updatedAt: String(row.updated_at ?? row.created_at),
    model: row.model ? String(row.model) : undefined,
    rubricVersion: String(row.rubric_version ?? '2026.08.17.2'),
    result: parsed.success ? parsed.data : undefined,
    errorMessage: row.error_message ? String(row.error_message) : undefined,
    prompt: String(row.prompt ?? payload.prompt ?? ''),
    questionId: String(row.question_id ?? payload.questionId ?? row.request_id),
    correctAnswer: String(row.correct_answer ?? payload.correctAnswer ?? ''),
    responseMs: Number(row.response_ms ?? payload.responseMs ?? 0),
    retryCount: Number(row.retry_count ?? 0),
    tokenUsage: (row.token_usage ?? undefined) as Record<string, number> | undefined
  };
}

function rowToProgress(row: Record<string, unknown>): CardProgress {
  return {
    cardId: String(row.card_id),
    learnedAt: String(row.learned_at),
    stage: row.stage as ReviewStage,
    nextReviewAt: String(row.next_review_at),
    lastReviewedAt: row.last_reviewed_at ? String(row.last_reviewed_at) : undefined,
    status: row.status as CardProgress['status'],
    lastScore: row.last_score === null || row.last_score === undefined ? undefined : Number(row.last_score),
    correctStreak: Number(row.correct_streak ?? 0),
    wrongCount: Number(row.wrong_count ?? 0),
    unstableCount: Number(row.unstable_count ?? 0),
    weak: Boolean(row.weak),
    passedT7: Boolean(row.passed_t7),
    passedT30: Boolean(row.passed_t30),
    passedT60: Boolean(row.passed_t60),
    masteryScore: Number(row.mastery_score ?? 0),
    dimensionScores: (row.dimension_scores ?? {}) as CardProgress['dimensionScores'],
    weakDimensions: (Array.isArray(row.weak_dimensions) ? row.weak_dimensions : []) as MasteryDimension[],
    errorCounts: (row.error_counts ?? {}) as Record<string, number>,
    attemptCount: Number(row.attempt_count ?? 0),
    targetQuestionCount: Number(row.target_question_count ?? 8),
    lastAnalyzedAt: row.last_analyzed_at ? String(row.last_analyzed_at) : undefined
  };
}

function rowToRecommendation(row: Record<string, unknown>): DailyRecommendation {
  const rawPrescriptions = row.card_prescriptions && typeof row.card_prescriptions === 'object'
    ? row.card_prescriptions as Record<string, Record<string, unknown>>
    : {};
  const cardPrescriptions = Object.fromEntries(Object.entries(rawPrescriptions).map(([cardId, value]) => {
    const rawRiskLevel = String(value.riskLevel ?? 'low');
    const prescription: DailyCardPrescription = {
      riskScore: Number(value.riskScore ?? 0),
      riskLevel: rawRiskLevel === 'high' || rawRiskLevel === 'medium' ? rawRiskLevel : 'low',
      targetQuestionCount: Number(value.targetQuestionCount ?? 8),
      focusDimensions: (Array.isArray(value.focusDimensions) ? value.focusDimensions : []) as MasteryDimension[],
      dueAt: value.dueAt ? String(value.dueAt) : undefined,
      overdueDays: Number(value.overdueDays ?? 0),
      reason: String(value.reason ?? '按今日遗忘风险安排复习。')
    };
    return [cardId, prescription];
  }));
  const baselineReviewCardIds = Array.isArray(row.review_card_ids)
    ? row.review_card_ids.map(String)
    : Array.isArray(row.recommended_card_ids) ? row.recommended_card_ids.map(String) : [];
  const rawCodexStatus = String(row.codex_status ?? 'pending');
  const codexStatus = rawCodexStatus === 'complete' || rawCodexStatus === 'failed' ? rawCodexStatus : 'pending';
  const codexAnalysis = codexStatus === 'complete' ? parseCodexAnalysis(row.codex_analysis) : undefined;
  const requestedOrder = codexAnalysis?.recommendedCardIds
    .filter((cardId, index, values) => baselineReviewCardIds.includes(cardId) && values.indexOf(cardId) === index) ?? [];
  const reviewCardIds = [...requestedOrder, ...baselineReviewCardIds.filter((cardId) => !requestedOrder.includes(cardId))];
  if (codexAnalysis) {
    Object.entries(codexAnalysis.cardAdjustments).forEach(([cardId, adjustment]) => {
      const baseline = cardPrescriptions[cardId];
      if (!baseline || !baselineReviewCardIds.includes(cardId)) return;
      cardPrescriptions[cardId] = {
        ...baseline,
        targetQuestionCount: Math.max(
          baseline.targetQuestionCount,
          boundedQuestionCount(adjustment.targetQuestionCount, baseline.targetQuestionCount)
        ),
        focusDimensions: [...new Set([...baseline.focusDimensions, ...(adjustment.focusDimensions ?? [])])],
        reason: adjustment.reason || baseline.reason
      };
    });
  }
  const baselineFocusDimensions = (Array.isArray(row.focus_dimensions) ? row.focus_dimensions : []) as MasteryDimension[];
  const focusDimensions = codexAnalysis?.focusDimensions.length
    ? [...new Set([...baselineFocusDimensions, ...codexAnalysis.focusDimensions])]
    : baselineFocusDimensions;
  const baselineTargetQuestionCount = Number(row.target_question_count ?? 10);
  return {
    date: String(row.plan_date),
    generatedAt: String(row.generated_at),
    studyDay: Number(row.study_day ?? 1),
    newCardIds: Array.isArray(row.new_card_ids) ? row.new_card_ids.map(String) : [],
    reviewCardIds,
    recommendedCardIds: reviewCardIds,
    cardPrescriptions,
    focusDimensions,
    targetQuestionCount: codexAnalysis
      ? Math.max(baselineTargetQuestionCount, codexAnalysis.targetQuestionCount)
      : baselineTargetQuestionCount,
    refreshAnchorAt: row.refresh_anchor_at ? String(row.refresh_anchor_at) : undefined,
    validUntilAt: row.valid_until_at ? String(row.valid_until_at) : undefined,
    algorithmVersion: String(row.algorithm_version ?? 'legacy'),
    summary: codexAnalysis?.summary || String(row.summary ?? '按到期时间和薄弱项安排复习。'),
    analysis: (row.analysis ?? {}) as Record<string, unknown>,
    codexStatus,
    codexGeneratedAt: row.codex_generated_at ? String(row.codex_generated_at) : undefined,
    codexModel: row.codex_model ? String(row.codex_model) : undefined,
    codexAnalysis
  };
}

export async function hydrateDetailedRecords(client: SupabaseClient, userId: string) {
  const [masteryRows, attemptRows, evaluationRows, recommendationRows] = await Promise.all([
    fetchAll(client, 'daily_english_mastery', userId),
    fetchAll(client, 'daily_english_attempts', userId),
    fetchAll(client, 'daily_english_ai_evaluations', userId),
    fetchAll(client, 'daily_english_daily_plans', userId)
  ]);
  const remoteProgress = masteryRows.map(rowToProgress);
  const existingProgress = new Map((await db.progress.toArray()).map((item) => [item.cardId, item]));
  const mergedProgress = remoteProgress.map((remote) => {
    const local = existingProgress.get(remote.cardId);
    if (!local) return remote;
    const localTime = new Date(local.lastReviewedAt ?? local.learnedAt).getTime();
    const remoteTime = new Date(remote.lastReviewedAt ?? remote.learnedAt).getTime();
    return remoteTime >= localTime ? { ...local, ...remote } : {
      ...remote,
      ...local,
      masteryScore: Math.max(local.masteryScore ?? 0, remote.masteryScore ?? 0),
      dimensionScores: { ...remote.dimensionScores, ...local.dimensionScores },
      weakDimensions: [...new Set([...(remote.weakDimensions ?? []), ...(local.weakDimensions ?? [])])]
    };
  });

  await db.transaction('rw', db.progress, db.attempts, db.aiEvaluations, db.dailyRecommendations, async () => {
    if (mergedProgress.length) await db.progress.bulkPut(mergedProgress);
    if (attemptRows.length) await db.attempts.bulkPut(attemptRows.map(rowToAttempt));
    if (evaluationRows.length) await db.aiEvaluations.bulkPut(evaluationRows.map(rowToEvaluation));
    if (recommendationRows.length) await db.dailyRecommendations.bulkPut(recommendationRows.map(rowToRecommendation));
  });
}
