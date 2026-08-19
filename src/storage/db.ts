import Dexie, { type EntityTable } from 'dexie';
import type { AIEvaluation, AppSettings, AppSnapshot, Attempt, CardProgress, DailyPlanRecord, DailyRecommendation, ReviewSessionProgress } from '../types';
import { toLocalDateKey } from '../learning/reviewEngine';

class DailyEnglishDatabase extends Dexie {
  settings!: EntityTable<AppSettings, 'id'>;
  dailyPlans!: EntityTable<DailyPlanRecord, 'date'>;
  progress!: EntityTable<CardProgress, 'cardId'>;
  attempts!: EntityTable<Attempt, 'id'>;
  aiEvaluations!: EntityTable<AIEvaluation, 'requestId'>;
  dailyRecommendations!: EntityTable<DailyRecommendation, 'date'>;
  reviewSessions!: EntityTable<ReviewSessionProgress, 'id'>;

  constructor() {
    super('daily-english');
    this.version(1).stores({
      settings: 'id',
      dailyPlans: 'date, studyDay',
      progress: 'cardId, nextReviewAt, status, weak',
      attempts: 'id, cardId, createdAt, stage, questionType',
      aiEvaluations: 'requestId, cardId, createdAt, status'
    });
    this.version(2).stores({
      settings: 'id',
      dailyPlans: 'date, studyDay',
      progress: 'cardId, nextReviewAt, status, weak',
      attempts: 'id, cardId, createdAt, stage, questionType',
      aiEvaluations: 'requestId, cardId, createdAt, status',
      dailyRecommendations: 'date, generatedAt'
    });
    this.version(3).stores({
      settings: 'id',
      dailyPlans: 'date, studyDay',
      progress: 'cardId, nextReviewAt, status, weak',
      attempts: 'id, cardId, createdAt, stage, questionType',
      aiEvaluations: 'requestId, cardId, createdAt, status',
      dailyRecommendations: 'date, generatedAt',
      reviewSessions: 'id, date, status, updatedAt, currentCardId'
    });
  }
}

export const db = new DailyEnglishDatabase();

function reviewedCardIdsForDate(progress: CardProgress[], date: string) {
  return new Set(progress
    .filter((item) => item.lastReviewedAt && toLocalDateKey(new Date(item.lastReviewedAt)) === date)
    .map((item) => item.cardId));
}

function sanitizeRecommendation(
  recommendation: DailyRecommendation,
  reviewedCardIds: Set<string>
): DailyRecommendation {
  const reviewCardIds = recommendation.reviewCardIds.filter((cardId) => !reviewedCardIds.has(cardId));
  const recommendedCardIds = recommendation.recommendedCardIds.filter((cardId) => !reviewedCardIds.has(cardId));
  const allowedPrescriptionIds = new Set([...reviewCardIds, ...recommendedCardIds]);
  const cardPrescriptions = Object.fromEntries(
    Object.entries(recommendation.cardPrescriptions).filter(([cardId]) => allowedPrescriptionIds.has(cardId))
  );
  const codexAnalysis = recommendation.codexAnalysis
    ? {
      ...recommendation.codexAnalysis,
      recommendedCardIds: recommendation.codexAnalysis.recommendedCardIds
        .filter((cardId) => !reviewedCardIds.has(cardId))
    }
    : undefined;
  return { ...recommendation, reviewCardIds, recommendedCardIds, cardPrescriptions, codexAnalysis };
}

function sanitizeReviewSession(
  session: ReviewSessionProgress,
  reviewedCardIds: Set<string>,
  updatedAt: string
): ReviewSessionProgress {
  if (session.status !== 'active') return session;
  const queueCardIds = session.queueCardIds.filter((cardId) => !reviewedCardIds.has(cardId));
  if (queueCardIds.length === session.queueCardIds.length) return session;
  if (!queueCardIds.length) {
    return {
      ...session,
      status: 'completed',
      queueCardIds: [],
      currentCardId: undefined,
      stage: undefined,
      questionIds: [],
      questionIndex: 0,
      answer: '',
      feedback: undefined,
      attempts: [],
      speechLatency: undefined,
      updatedAt
    };
  }
  if (queueCardIds.includes(session.currentCardId ?? '')) return { ...session, queueCardIds, updatedAt };
  return {
    ...session,
    queueCardIds,
    currentCardId: queueCardIds[0],
    stage: undefined,
    questionIds: [],
    questionIndex: 0,
    answer: '',
    feedback: undefined,
    attempts: [],
    speechLatency: undefined,
    updatedAt
  };
}

export function sanitizeSnapshotReviewState(snapshot: AppSnapshot, date = toLocalDateKey()): AppSnapshot {
  const reviewedCardIds = reviewedCardIdsForDate(snapshot.progress, date);
  if (!reviewedCardIds.size) return snapshot;
  const updatedAt = new Date().toISOString();
  return {
    ...snapshot,
    dailyRecommendations: snapshot.dailyRecommendations.map((item) => (
      item.date === date ? sanitizeRecommendation(item, reviewedCardIds) : item
    )),
    reviewSessions: snapshot.reviewSessions?.map((item) => (
      item.date === date ? sanitizeReviewSession(item, reviewedCardIds, updatedAt) : item
    ))
  };
}

export async function sanitizeStoredReviewState(progress: CardProgress[], date = toLocalDateKey()) {
  const reviewedCardIds = reviewedCardIdsForDate(progress, date);
  if (!reviewedCardIds.size) return;
  const [recommendation, sessions] = await Promise.all([
    db.dailyRecommendations.get(date),
    db.reviewSessions.where('date').equals(date).toArray()
  ]);
  const updatedAt = new Date().toISOString();
  const sanitizedRecommendation = recommendation
    ? sanitizeRecommendation(recommendation, reviewedCardIds)
    : undefined;
  const sanitizedSessions = sessions.map((session) => sanitizeReviewSession(session, reviewedCardIds, updatedAt));
  const recommendationChanged = recommendation && JSON.stringify(recommendation) !== JSON.stringify(sanitizedRecommendation);
  const changedSessions = sanitizedSessions.filter((session, index) => JSON.stringify(session) !== JSON.stringify(sessions[index]));
  if (!recommendationChanged && !changedSessions.length) return;
  await db.transaction('rw', db.dailyRecommendations, db.reviewSessions, async () => {
    if (recommendationChanged && sanitizedRecommendation) await db.dailyRecommendations.put(sanitizedRecommendation);
    if (changedSessions.length) await db.reviewSessions.bulkPut(changedSessions);
  });
}

export async function getSettings(): Promise<AppSettings> {
  const existing = await db.settings.get('settings');
  if (existing) return existing;
  const settings: AppSettings = {
    id: 'settings',
    firstUseDate: toLocalDateKey(),
    streak: 1,
    aiConsent: false,
    reduceMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
    dailyAiLimit: 20
  };
  await db.settings.put(settings);
  return settings;
}

export async function touchStudyStreak(settings: AppSettings): Promise<AppSettings> {
  const today = toLocalDateKey();
  if (settings.lastStudyDate === today) return settings;
  let streak = settings.streak;
  if (settings.lastStudyDate) {
    const previous = new Date(settings.lastStudyDate + 'T12:00:00');
    const current = new Date(today + 'T12:00:00');
    const diff = Math.round((current.getTime() - previous.getTime()) / 86400000);
    streak = diff === 1 ? streak + 1 : 1;
  }
  const next = { ...settings, lastStudyDate: today, streak };
  await db.settings.put(next);
  return next;
}

export async function exportSnapshot(): Promise<AppSnapshot> {
  const progress = await db.progress.toArray();
  await sanitizeStoredReviewState(progress);
  return sanitizeSnapshotReviewState({
    settings: await getSettings(),
    progress,
    attempts: await db.attempts.toArray(),
    aiEvaluations: await db.aiEvaluations.toArray(),
    dailyPlans: await db.dailyPlans.toArray(),
    dailyRecommendations: await db.dailyRecommendations.toArray(),
    reviewSessions: await db.reviewSessions.toArray(),
    exportedAt: new Date().toISOString(),
    schemaVersion: 3
  });
}

export async function importSnapshot(snapshot: AppSnapshot): Promise<void> {
  if (![1, 2, 3].includes(snapshot.schemaVersion) || !snapshot.settings || !Array.isArray(snapshot.progress)) {
    throw new Error('备份文件格式不正确');
  }
  const sanitized = sanitizeSnapshotReviewState(snapshot);
  await db.transaction('rw', [db.settings, db.progress, db.attempts, db.aiEvaluations, db.dailyPlans, db.dailyRecommendations, db.reviewSessions], async () => {
    await Promise.all([
      db.settings.clear(),
      db.progress.clear(),
      db.attempts.clear(),
      db.aiEvaluations.clear(),
      db.dailyPlans.clear(),
      db.dailyRecommendations.clear(),
      db.reviewSessions.clear()
    ]);
    await db.settings.put(sanitized.settings);
    await db.progress.bulkPut(sanitized.progress);
    await db.attempts.bulkPut(sanitized.attempts ?? []);
    await db.aiEvaluations.bulkPut(sanitized.aiEvaluations ?? []);
    await db.dailyPlans.bulkPut(sanitized.dailyPlans ?? []);
    await db.dailyRecommendations.bulkPut(sanitized.dailyRecommendations ?? []);
    await db.reviewSessions.bulkPut(sanitized.reviewSessions ?? []);
  });
}

export async function clearLearningData(): Promise<void> {
  await db.delete();
  await db.open();
}
