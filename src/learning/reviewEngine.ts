import type { CardProgress, MasteryStatus, ReviewStage } from '../types';

export const STAGES: ReviewStage[] = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const DAY_MS = 24 * 60 * 60 * 1000;

export function toLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

export function studyDaySince(firstUseDate: string, now = new Date()): number {
  const start = new Date(firstUseDate + 'T12:00:00');
  const current = new Date(toLocalDateKey(now) + 'T12:00:00');
  return Math.max(1, Math.floor((current.getTime() - start.getTime()) / DAY_MS) + 1);
}

export function nextDueDate(stage: ReviewStage, from: Date, score: number, weak = false): Date {
  const due = new Date(from);
  const dayIntervals: Record<ReviewStage, number> = {
    T0: 0,
    T1: 1,
    T2: 3,
    T3: 7,
    T4: 14,
    T5: 30,
    T6: 60,
    T7: 90
  };

  if (stage === 'T0') {
    due.setTime(from.getTime() + 20 * 60 * 1000);
    return due;
  }

  let days = dayIntervals[stage];
  if (score < 60) {
    due.setTime(from.getTime() + 20 * 60 * 1000);
    return due;
  }
  if (score < 75) days = Math.max(1, Math.ceil(days / 2));
  if (weak) days = Math.max(1, Math.min(7, Math.ceil(days / 2)));
  due.setDate(due.getDate() + days);
  due.setHours(8, 0, 0, 0);
  return due;
}

export function statusFor(progress: CardProgress, score: number): MasteryStatus {
  if (progress.weak || (progress.weakDimensions?.length ?? 0) > 0 || progress.wrongCount + (score < 60 ? 1 : 0) >= 3) return '薄弱词';
  if (score < 60) return '学习中';
  if (score < 75) return '待巩固';
  if (progress.stage === 'T0' || progress.stage === 'T1') return '识别词汇';
  if (progress.stage === 'T2' || progress.stage === 'T3') return '基本掌握';
  if (progress.stage === 'T4' || progress.stage === 'T5') return '主动掌握';
  if (progress.stage === 'T6' || progress.stage === 'T7') return '长期掌握';
  return '学习中';
}

export function applyReviewScore(progress: CardProgress, score: number, now = new Date()): CardProgress {
  const currentIndex = STAGES.indexOf(progress.stage);
  const hasMeasuredWeakness = (progress.weakDimensions?.length ?? 0) > 0;
  const wasWeak = progress.weak || hasMeasuredWeakness;
  const passed = score >= (wasWeak ? 80 : 75);
  const strong = score >= 85;
  const unstable = score >= 60 && !passed;
  const failed = score < 60;
  const nextIndex = passed ? Math.min(currentIndex + 1, STAGES.length - 1) : currentIndex;
  const nextStage = STAGES[nextIndex];
  const wrongCount = progress.wrongCount + (failed ? 1 : 0);
  const correctStreak = strong ? progress.correctStreak + 1 : passed ? Math.max(1, progress.correctStreak) : 0;
  const recovered = correctStreak >= 2 && !hasMeasuredWeakness;
  const weak = wrongCount >= 3 || (wasWeak && !recovered) || hasMeasuredWeakness;
  const temporary = { ...progress, wrongCount, correctStreak, weak };

  return {
    ...temporary,
    stage: nextStage,
    nextReviewAt: nextDueDate(progress.stage, now, score, weak).toISOString(),
    lastReviewedAt: now.toISOString(),
    lastScore: score,
    unstableCount: progress.unstableCount + (unstable ? 1 : 0),
    status: statusFor(temporary, score),
    passedT7: progress.passedT7 || (progress.stage === 'T4' && passed),
    passedT30: progress.passedT30 || (progress.stage === 'T6' && passed),
    passedT60: progress.passedT60 || (progress.stage === 'T7' && passed),
    targetQuestionCount: weak ? Math.max(progress.targetQuestionCount ?? 0, 12) : Math.max(progress.targetQuestionCount ?? 0, 8)
  };
}

export function applyLateEvaluation(progress: CardProgress, score: number, now = new Date()): CardProgress {
  const needsReinforcement = score < 75 || (progress.weakDimensions?.length ?? 0) > 0;
  const acceleratedDue = new Date(now.getTime() + (score < 60 ? 20 * 60 * 1000 : 24 * 60 * 60 * 1000));
  const currentDue = new Date(progress.nextReviewAt);
  return {
    ...progress,
    lastScore: score,
    lastAnalyzedAt: now.toISOString(),
    weak: progress.weak || needsReinforcement,
    status: needsReinforcement ? '薄弱词' : progress.status,
    nextReviewAt: needsReinforcement && acceleratedDue < currentDue ? acceleratedDue.toISOString() : progress.nextReviewAt,
    targetQuestionCount: needsReinforcement ? 12 : Math.max(progress.targetQuestionCount ?? 0, 8)
  };
}

export function isDue(progress: CardProgress, now = new Date()): boolean {
  return new Date(progress.nextReviewAt).getTime() <= now.getTime();
}

export function isPendingReview(
  progress: CardProgress,
  plannedForBatch: boolean,
  batchAnchorAt?: string,
  now = new Date()
): boolean {
  if (isDue(progress, now)) return true;
  if (!plannedForBatch) return false;
  if (!progress.lastReviewedAt) return true;

  const parsedAnchor = batchAnchorAt ? new Date(batchAnchorAt).getTime() : Number.NaN;
  const fallbackAnchor = new Date(now);
  fallbackAnchor.setHours(0, 0, 0, 0);
  const anchor = Number.isFinite(parsedAnchor) ? parsedAnchor : fallbackAnchor.getTime();
  return new Date(progress.lastReviewedAt).getTime() < anchor;
}

export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/[.,!?;:'"“”‘’]/g, '').replace(/\s+/g, ' ');
}

export function objectiveScore(answer: string, expected: string, responseMs: number): { score: number; errors: string[] } {
  const correct = normalizeAnswer(answer) === normalizeAnswer(expected);
  if (!correct) return { score: 0, errors: ['拼写或答案不正确'] };
  const speedBonus = responseMs <= 5000 ? 10 : responseMs <= 12000 ? 7 : 4;
  return { score: 90 + Math.min(10, speedBonus), errors: [] };
}
