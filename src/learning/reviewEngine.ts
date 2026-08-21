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

export function nextDueDate(stage: ReviewStage, from: Date, score: number): Date {
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

  let days = dayIntervals[stage];
  if (stage === 'T0' || score < 60) {
    due.setDate(due.getDate() + 1);
    due.setHours(8, 0, 0, 0);
    return due;
  }
  if (score < 75) days = Math.max(1, Math.ceil(days / 2));
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
  // A passed review advances to the next forgetting-curve checkpoint, so its
  // interval must come from that next stage. Using the completed stage here
  // incorrectly scheduled an extra same-day T0 round after a successful test.
  const dueStage = passed ? nextStage : progress.stage;

  return {
    ...temporary,
    stage: nextStage,
    nextReviewAt: nextDueDate(dueStage, now, score).toISOString(),
    lastReviewedAt: now.toISOString(),
    lastScore: score,
    unstableCount: progress.unstableCount + (unstable ? 1 : 0),
    status: statusFor(temporary, score),
    passedT7: progress.passedT7 || (progress.stage === 'T3' && passed),
    passedT30: progress.passedT30 || (progress.stage === 'T5' && passed),
    passedT60: progress.passedT60 || (progress.stage === 'T6' && passed),
    targetQuestionCount: weak ? Math.max(progress.targetQuestionCount ?? 0, 12) : Math.max(progress.targetQuestionCount ?? 0, 8)
  };
}

export function applyLateEvaluation(progress: CardProgress, score: number, now = new Date()): CardProgress {
  const needsReinforcement = score < 75 || (progress.weakDimensions?.length ?? 0) > 0;
  return {
    ...progress,
    lastScore: score,
    lastAnalyzedAt: now.toISOString(),
    weak: progress.weak || needsReinforcement,
    status: needsReinforcement ? '薄弱词' : progress.status,
    // A delayed AI result is diagnostic only. It may increase practice depth,
    // but it must never rewrite the forgetting-curve checkpoint established
    // when the complete review round was submitted.
    nextReviewAt: progress.nextReviewAt,
    targetQuestionCount: needsReinforcement ? 12 : Math.max(progress.targetQuestionCount ?? 0, 8)
  };
}

export function isDue(progress: CardProgress, now = new Date()): boolean {
  return new Date(progress.nextReviewAt).getTime() <= now.getTime();
}

export function isPendingReview(
  progress: CardProgress,
  _plannedForBatch: boolean,
  _batchAnchorAt?: string,
  now = new Date()
): boolean {
  const reviewedToday = Boolean(
    progress.lastReviewedAt
    && toLocalDateKey(new Date(progress.lastReviewedAt)) === toLocalDateKey(now)
  );
  // A word gets at most one completed review round per local day, regardless
  // of score. Older clients may have saved a same-day reinforcement timestamp;
  // keep it hidden until the next local day as well.
  if (reviewedToday) return false;
  return isDue(progress, now);
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
