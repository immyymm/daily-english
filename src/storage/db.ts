import Dexie, { type EntityTable } from 'dexie';
import type { AIEvaluation, AppSettings, AppSnapshot, Attempt, CardProgress, DailyPlanRecord, DailyRecommendation } from '../types';
import { toLocalDateKey } from '../learning/reviewEngine';

class DailyEnglishDatabase extends Dexie {
  settings!: EntityTable<AppSettings, 'id'>;
  dailyPlans!: EntityTable<DailyPlanRecord, 'date'>;
  progress!: EntityTable<CardProgress, 'cardId'>;
  attempts!: EntityTable<Attempt, 'id'>;
  aiEvaluations!: EntityTable<AIEvaluation, 'requestId'>;
  dailyRecommendations!: EntityTable<DailyRecommendation, 'date'>;

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
  }
}

export const db = new DailyEnglishDatabase();

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
  return {
    settings: await getSettings(),
    progress: await db.progress.toArray(),
    attempts: await db.attempts.toArray(),
    aiEvaluations: await db.aiEvaluations.toArray(),
    dailyPlans: await db.dailyPlans.toArray(),
    dailyRecommendations: await db.dailyRecommendations.toArray(),
    exportedAt: new Date().toISOString(),
    schemaVersion: 2
  };
}

export async function importSnapshot(snapshot: AppSnapshot): Promise<void> {
  if (![1, 2].includes(snapshot.schemaVersion) || !snapshot.settings || !Array.isArray(snapshot.progress)) {
    throw new Error('备份文件格式不正确');
  }
  await db.transaction('rw', [db.settings, db.progress, db.attempts, db.aiEvaluations, db.dailyPlans, db.dailyRecommendations], async () => {
    await Promise.all([
      db.settings.clear(),
      db.progress.clear(),
      db.attempts.clear(),
      db.aiEvaluations.clear(),
      db.dailyPlans.clear(),
      db.dailyRecommendations.clear()
    ]);
    await db.settings.put(snapshot.settings);
    await db.progress.bulkPut(snapshot.progress);
    await db.attempts.bulkPut(snapshot.attempts ?? []);
    await db.aiEvaluations.bulkPut(snapshot.aiEvaluations ?? []);
    await db.dailyPlans.bulkPut(snapshot.dailyPlans ?? []);
    await db.dailyRecommendations.bulkPut(snapshot.dailyRecommendations ?? []);
  });
}

export async function clearLearningData(): Promise<void> {
  await db.delete();
  await db.open();
}
