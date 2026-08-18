import type { SupabaseClient } from '@supabase/supabase-js';
import { calculateMasteryProfile } from '../learning/mastery';
import { evaluationSchema } from '../schemas/evaluation';
import { normalizeEvaluationResultForHistory } from '../schemas/evaluationConstraints';
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
const reviewStageSet = new Set<string>(['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']);
const questionTypeSet = new Set<string>([
  'meaning_choice',
  'recall',
  'collocation',
  'free_sentence',
  'dialogue',
  'weekly_writing',
  'weekly_speaking'
]);

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

function textValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : value === null || value === undefined ? fallback : String(value);
}

function boundedInteger(value: unknown, minimum: number, maximum: number, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(minimum, Math.min(maximum, Math.round(parsed))) : fallback;
}

function isoTimestamp(value: unknown, fallback: string) {
  const parsed = new Date(textValue(value, fallback));
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : fallback;
}

function normalizedDimensionScores(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const raw = value as Record<string, unknown>;
  return Object.fromEntries(masteryDimensionValues.flatMap((dimension) => {
    const parsed = Number(raw[dimension]);
    return Number.isFinite(parsed) ? [[dimension, Math.max(0, Math.min(100, parsed))]] : [];
  }));
}

function nonNegativeCounts(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const raw = value as Record<string, unknown>;
  return Object.fromEntries(Object.entries(raw).flatMap(([key, count]) => {
    const parsed = Number(count);
    return key && Number.isFinite(parsed) ? [[key, Math.max(0, Math.round(parsed))]] : [];
  }));
}

function jsonObjectOrNull(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
}

function syncWriteError(tableLabel: string, error: unknown): never {
  const detail = error as { code?: string; message?: string; details?: string; hint?: string };
  console.error('CLOUD_RECORD_SYNC_FAILED', {
    table: tableLabel,
    code: detail.code,
    message: detail.message,
    details: detail.details,
    hint: detail.hint
  });
  throw new Error(`${tableLabel}同步失败，记录仍安全保存在本机；刷新页面后系统会自动重试。`);
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
  const fallbackTimestamp = isoTimestamp(snapshot.exportedAt, '1970-01-01T00:00:00.000Z');
  const attemptRows = snapshot.attempts.map((attempt, index) => {
    const raw = attempt as unknown as Record<string, unknown>;
    const cardId = textValue(raw.cardId, 'unknown-card').trim() || 'unknown-card';
    const id = textValue(raw.id).trim() || `legacy-${cardId}-${index}`;
    const score = boundedInteger(raw.score, 0, 100, 0);
    const ai = typeof raw.ai === 'boolean' ? raw.ai : false;
    const rawStage = textValue(raw.stage, 'T0');
    const rawQuestionType = textValue(raw.questionType, 'recall');
    return {
      user_id: userId,
      id,
      card_id: cardId,
      question_id: textValue(raw.questionId).trim() || `legacy-question-${id}`,
      question_type: questionTypeSet.has(rawQuestionType) ? rawQuestionType : 'recall',
      stage: reviewStageSet.has(rawStage) ? rawStage : 'T0',
      prompt: textValue(raw.prompt),
      answer: textValue(raw.answer),
      correct_answer: textValue(raw.correctAnswer),
      score,
      correct: typeof raw.correct === 'boolean' ? raw.correct : score >= 75,
      response_ms: boundedInteger(raw.responseMs, 0, 2_147_483_647, 0),
      error_types: stringArray(raw.errorTypes),
      dimension_scores: normalizedDimensionScores(raw.dimensionScores),
      ai,
      session_id: textValue(raw.sessionId).trim() || null,
      schedule_impact: typeof raw.scheduleImpact === 'boolean' ? raw.scheduleImpact : !ai,
      created_at: isoTimestamp(raw.createdAt, fallbackTimestamp),
      device_id: deviceId ?? null
    };
  });

  for (const batch of chunks(attemptRows)) {
    const { error } = await client.from('daily_english_attempts').upsert(batch, { onConflict: 'user_id,id' });
    if (error) syncWriteError('学习记录', error);
  }

  const evaluationRows = snapshot.aiEvaluations.map((evaluation, index) => {
    const raw = evaluation as unknown as Record<string, unknown>;
    const requestId = textValue(raw.requestId).trim() || `legacy-evaluation-${index}`;
    const questionId = textValue(raw.questionId).trim() || requestId;
    const questionType = textValue(raw.questionType, 'free_sentence');
    const stage = textValue(raw.stage, 'T0');
    const status = ['pending', 'processing', 'complete', 'failed'].includes(textValue(raw.status))
      ? textValue(raw.status)
      : 'failed';
    const createdAt = isoTimestamp(raw.createdAt, fallbackTimestamp);
    const updatedAt = isoTimestamp(raw.updatedAt, createdAt);
    const responseMs = boundedInteger(raw.responseMs, 0, 2_147_483_647, 0);
    const prompt = textValue(raw.prompt);
    const answer = textValue(raw.answer);
    const correctAnswer = textValue(raw.correctAnswer);
    return {
      user_id: userId,
      request_id: requestId,
      card_id: textValue(raw.cardId, 'unknown-card').trim() || 'unknown-card',
      question_id: questionId,
      question_type: questionTypeSet.has(questionType) ? questionType : 'free_sentence',
      stage: reviewStageSet.has(stage) ? stage : 'T0',
      prompt,
      answer,
      correct_answer: correctAnswer,
      response_ms: responseMs,
      status,
      request_payload: { prompt, answer, questionId, correctAnswer, responseMs },
      result: jsonObjectOrNull(raw.result),
      model: textValue(raw.model).trim() || null,
      rubric_version: textValue(raw.rubricVersion, '2026.08.18.8'),
      token_usage: jsonObjectOrNull(raw.tokenUsage),
      error_message: textValue(raw.errorMessage).trim() || null,
      retry_count: boundedInteger(raw.retryCount, 0, 2_147_483_647, 0),
      queued_at: createdAt,
      completed_at: status === 'complete' ? updatedAt : null,
      created_at: createdAt,
      updated_at: updatedAt
    };
  });

  for (const batch of chunks(evaluationRows)) {
    const completeRows = batch.filter((row) => row.status === 'complete');
    const unfinishedRows = batch.filter((row) => row.status !== 'complete');
    if (completeRows.length) {
      const { data: remoteRows, error: remoteError } = await client
        .from('daily_english_ai_evaluations')
        .select('request_id,updated_at')
        .eq('user_id', userId)
        .in('request_id', completeRows.map((row) => row.request_id));
      if (remoteError) syncWriteError('AI 点评记录', remoteError);
      const remoteUpdatedAt = new Map((remoteRows ?? []).map((row) => [
        String(row.request_id),
        new Date(String(row.updated_at)).getTime() || 0
      ]));
      const nonStaleRows = completeRows.filter((row) => (
        new Date(row.updated_at).getTime() >= (remoteUpdatedAt.get(row.request_id) ?? 0)
      ));
      if (nonStaleRows.length) {
        const { error } = await client.from('daily_english_ai_evaluations').upsert(nonStaleRows, {
          onConflict: 'user_id,request_id'
        });
        if (error) syncWriteError('AI 点评记录', error);
      }
    }
    if (unfinishedRows.length) {
      const { error } = await client.from('daily_english_ai_evaluations').upsert(unfinishedRows, {
        onConflict: 'user_id,request_id',
        ignoreDuplicates: true
      });
      if (error) syncWriteError('AI 点评记录', error);
    }
  }

  const attemptsByCard = new Map<string, Attempt[]>();
  snapshot.attempts.forEach((attempt) => {
    const list = attemptsByCard.get(attempt.cardId) ?? [];
    list.push(attempt);
    attemptsByCard.set(attempt.cardId, list);
  });
  const masteryRows = snapshot.progress.map((progress) => {
    const raw = progress as unknown as Record<string, unknown>;
    const profile = calculateMasteryProfile(attemptsByCard.get(progress.cardId) ?? []);
    const dimensionScores = {
      ...normalizedDimensionScores(profile.dimensionScores),
      ...normalizedDimensionScores(raw.dimensionScores)
    };
    const weakDimensions = masteryDimensions(raw.weakDimensions ?? profile.weakDimensions);
    const stage = textValue(raw.stage, 'T0');
    const lastScore = raw.lastScore === null || raw.lastScore === undefined
      ? null
      : boundedInteger(raw.lastScore, 0, 100, 0);
    const masteryScore = Number.isFinite(Number(raw.masteryScore))
      ? Math.max(0, Math.min(100, Number(raw.masteryScore)))
      : Math.max(0, Math.min(100, Number(profile.masteryScore) || 0));
    return {
      user_id: userId,
      card_id: textValue(raw.cardId, 'unknown-card').trim() || 'unknown-card',
      learned_at: isoTimestamp(raw.learnedAt, fallbackTimestamp),
      stage: reviewStageSet.has(stage) ? stage : 'T0',
      next_review_at: isoTimestamp(raw.nextReviewAt, fallbackTimestamp),
      last_reviewed_at: raw.lastReviewedAt ? isoTimestamp(raw.lastReviewedAt, fallbackTimestamp) : null,
      status: textValue(raw.status, '学习中'),
      last_score: lastScore,
      correct_streak: boundedInteger(raw.correctStreak, 0, 2_147_483_647, 0),
      wrong_count: boundedInteger(raw.wrongCount, 0, 2_147_483_647, 0),
      unstable_count: boundedInteger(raw.unstableCount, 0, 2_147_483_647, 0),
      weak: Boolean(raw.weak) || weakDimensions.length > 0,
      passed_t7: Boolean(raw.passedT7),
      passed_t30: Boolean(raw.passedT30),
      passed_t60: Boolean(raw.passedT60),
      mastery_score: masteryScore,
      dimension_scores: dimensionScores,
      weak_dimensions: weakDimensions,
      error_counts: nonNegativeCounts(raw.errorCounts ?? profile.errorCounts),
      attempt_count: boundedInteger(raw.attemptCount ?? profile.attemptCount, 0, 2_147_483_647, 0),
      target_question_count: boundedQuestionCount(raw.targetQuestionCount, Boolean(raw.weak) ? 12 : 8),
      last_analyzed_at: raw.lastAnalyzedAt ? isoTimestamp(raw.lastAnalyzedAt, fallbackTimestamp) : null,
      device_id: deviceId ?? null,
      updated_at: new Date().toISOString()
    };
  });

  for (const batch of chunks(masteryRows)) {
    const { error } = await client.from('daily_english_mastery').upsert(batch, { onConflict: 'user_id,card_id' });
    if (error) syncWriteError('掌握状态', error);
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
  const questionType = row.question_type as QuestionType;
  const prompt = String(row.prompt ?? payload.prompt ?? '');
  const result = parsed.success ? normalizeEvaluationResultForHistory(parsed.data, {
    questionType,
    prompt
  }) : undefined;
  return {
    requestId: String(row.request_id),
    cardId: String(row.card_id),
    questionType,
    stage: row.stage as ReviewStage,
    answer: String(row.answer ?? payload.answer ?? ''),
    status: row.status as AIEvaluation['status'],
    createdAt: String(row.created_at ?? row.queued_at),
    updatedAt: String(row.updated_at ?? row.created_at),
    model: row.model ? String(row.model) : undefined,
    rubricVersion: String(row.rubric_version ?? '2026.08.18.8'),
    result,
    errorMessage: row.error_message ? String(row.error_message) : undefined,
    prompt,
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
  const existingEvaluations = new Map((await db.aiEvaluations.toArray()).map((item) => [item.requestId, item]));
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

  const mergedEvaluations = evaluationRows.map(rowToEvaluation).map((remote) => {
    const local = existingEvaluations.get(remote.requestId);
    if (!local) return remote;
    if (local.status === 'complete' && remote.status !== 'complete') return local;
    if (remote.status === 'complete' && local.status !== 'complete') return remote;
    return new Date(remote.updatedAt ?? remote.createdAt).getTime() >= new Date(local.updatedAt ?? local.createdAt).getTime()
      ? remote
      : local;
  });

  await db.transaction('rw', db.progress, db.attempts, db.aiEvaluations, db.dailyRecommendations, async () => {
    if (mergedProgress.length) await db.progress.bulkPut(mergedProgress);
    if (attemptRows.length) await db.attempts.bulkPut(attemptRows.map(rowToAttempt));
    if (mergedEvaluations.length) await db.aiEvaluations.bulkPut(mergedEvaluations);
    if (recommendationRows.length) await db.dailyRecommendations.bulkPut(recommendationRows.map(rowToRecommendation));
  });
}

export interface CloudRecordCounts {
  snapshots: number;
  attempts: number;
  mastery: number;
  evaluations: number;
}

export async function countCloudRecords(client: SupabaseClient, userId: string): Promise<CloudRecordCounts> {
  const count = async (table: string) => {
    const { count: value, error } = await client.from(table).select('*', { count: 'exact', head: true }).eq('user_id', userId);
    if (error) throw error;
    return value ?? 0;
  };
  const [snapshots, attempts, mastery, evaluations] = await Promise.all([
    count('daily_english_snapshots'),
    count('daily_english_attempts'),
    count('daily_english_mastery'),
    count('daily_english_ai_evaluations')
  ]);
  return { snapshots, attempts, mastery, evaluations };
}
