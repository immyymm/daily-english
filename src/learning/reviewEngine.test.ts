import { describe, expect, it } from 'vitest';
import { applyReviewScore, nextDueDate, normalizeAnswer, objectiveScore, studyDaySince, toLocalDateKey } from './reviewEngine';
import type { CardProgress } from '../types';

const progress: CardProgress = {
  cardId: 'improve-v',
  learnedAt: '2026-08-17T00:00:00.000Z',
  stage: 'T0',
  nextReviewAt: '2026-08-17T00:00:00.000Z',
  status: '学习中',
  correctStreak: 0,
  wrongCount: 0,
  unstableCount: 0,
  weak: false,
  passedT7: false,
  passedT30: false,
  passedT60: false
};

describe('review schedule', () => {
  it('schedules T0 follow-up after 20 minutes', () => {
    const now = new Date('2026-08-17T08:00:00.000Z');
    expect(nextDueDate('T0', now, 100).getTime() - now.getTime()).toBe(20 * 60 * 1000);
  });

  it('advances one stage after a passing score', () => {
    const now = new Date('2026-08-17T08:00:00.000Z');
    const next = applyReviewScore(progress, 88, now);
    expect(next.stage).toBe('T1');
    expect(next.correctStreak).toBe(1);
    expect(next.status).toBe('识别词汇');
    expect(new Date(next.nextReviewAt).getTime() - now.getTime()).toBe(20 * 60 * 1000);
  });

  it('does not erase the current stage after a failure', () => {
    const current = { ...progress, stage: 'T3' as const, wrongCount: 2 };
    const next = applyReviewScore(current, 40, new Date('2026-08-17T08:00:00.000Z'));
    expect(next.stage).toBe('T3');
    expect(next.weak).toBe(true);
    expect(next.status).toBe('薄弱词');
  });
});

describe('answer matching', () => {
  it('ignores case and light punctuation for objective answers', () => {
    expect(normalizeAnswer(' Improve! ')).toBe('improve');
    expect(objectiveScore('Improve.', 'improve', 3000).score).toBe(100);
  });

  it('separates incorrect spelling from a correct answer', () => {
    expect(objectiveScore('improove', 'improve', 3000)).toEqual({
      score: 0,
      errors: ['拼写或答案不正确']
    });
  });
});

describe('local study dates', () => {
  it('starts at study day one and counts natural days', () => {
    expect(studyDaySince('2026-08-17', new Date('2026-08-17T18:00:00'))).toBe(1);
    expect(studyDaySince('2026-08-17', new Date('2026-08-20T09:00:00'))).toBe(4);
    expect(toLocalDateKey(new Date(2026, 7, 9))).toBe('2026-08-09');
  });
});
