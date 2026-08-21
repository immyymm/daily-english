import { describe, expect, it } from 'vitest';
import { applyLateEvaluation, applyReviewScore, isPendingReview, nextDueDate, normalizeAnswer, objectiveScore, studyDaySince, toLocalDateKey } from './reviewEngine';
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
  it('schedules a failed T0 follow-up on the next local day', () => {
    const now = new Date(2026, 7, 17, 10, 0, 0);
    const due = nextDueDate('T0', now, 40);
    expect(toLocalDateKey(due)).toBe('2026-08-18');
    expect(due.getHours()).toBe(8);
  });

  it('advances a passed T0 review to the next-day T1 checkpoint', () => {
    const now = new Date(2026, 7, 18, 10, 0, 0);
    const next = applyReviewScore(progress, 88, now);
    expect(next.stage).toBe('T1');
    expect(next.correctStreak).toBe(1);
    expect(next.status).toBe('识别词汇');
    const due = new Date(next.nextReviewAt);
    expect(toLocalDateKey(due)).toBe('2026-08-19');
    expect(due.getHours()).toBe(8);
  });

  it('uses the next stage interval after every passing review', () => {
    const now = new Date(2026, 7, 19, 10, 0, 0);
    const next = applyReviewScore({ ...progress, stage: 'T1' }, 90, now);
    expect(next.stage).toBe('T2');
    const due = new Date(next.nextReviewAt);
    expect(toLocalDateKey(due)).toBe('2026-08-22');
    expect(due.getHours()).toBe(8);
  });

  it('does not let delayed AI diagnostics pull a curve checkpoint forward', () => {
    const nextReviewAt = '2026-08-26T00:00:00.000Z';
    const next = applyLateEvaluation(
      { ...progress, stage: 'T3', nextReviewAt, weakDimensions: ['grammar'] },
      50,
      new Date('2026-08-21T12:00:00+08:00')
    );
    expect(next.nextReviewAt).toBe(nextReviewAt);
    expect(next.weak).toBe(true);
    expect(next.targetQuestionCount).toBe(12);
  });

  it('does not shorten the next checkpoint after a weak word passes its higher threshold', () => {
    const now = new Date(2026, 7, 19, 10, 0, 0);
    const next = applyReviewScore({ ...progress, stage: 'T1', weak: true }, 82, now);
    expect(next.stage).toBe('T2');
    const due = new Date(next.nextReviewAt);
    expect(toLocalDateKey(due)).toBe('2026-08-22');
    expect(due.getHours()).toBe(8);
  });

  it('does not erase the current stage after a failure', () => {
    const current = { ...progress, stage: 'T3' as const, wrongCount: 2 };
    const next = applyReviewScore(current, 40, new Date('2026-08-17T08:00:00.000Z'));
    expect(next.stage).toBe('T3');
    expect(next.weak).toBe(true);
    expect(next.status).toBe('薄弱词');
  });

  it('does not pull a planned preventive review ahead of its due time', () => {
    expect(isPendingReview({
      ...progress,
      nextReviewAt: '2026-08-20T08:00:00.000Z',
      lastReviewedAt: '2026-08-17T08:00:00.000Z'
    }, true, '2026-08-18T05:00:00.000Z', new Date('2026-08-18T10:00:00.000Z'))).toBe(false);
  });

  it('removes a planned word after it was reviewed in this batch and rescheduled', () => {
    expect(isPendingReview({
      ...progress,
      nextReviewAt: '2026-08-19T08:00:00.000Z',
      lastReviewedAt: '2026-08-18T09:00:00.000Z'
    }, true, '2026-08-18T05:00:00.000Z', new Date('2026-08-18T10:00:00.000Z'))).toBe(false);
  });

  it('does not re-add a successfully reviewed word when the daily plan refreshes later that day', () => {
    expect(isPendingReview({
      ...progress,
      nextReviewAt: '2026-08-18T09:20:00.000Z',
      lastScore: 90,
      lastReviewedAt: '2026-08-18T09:00:00.000Z'
    }, true, '2026-08-18T09:30:00.000Z', new Date('2026-08-18T10:00:00.000Z'))).toBe(false);
  });

  it('does not re-add a failed word later on the same day', () => {
    expect(isPendingReview({
      ...progress,
      nextReviewAt: '2026-08-18T09:20:00.000Z',
      lastScore: 40,
      lastReviewedAt: '2026-08-18T09:00:00.000Z'
    }, true, '2026-08-18T09:30:00.000Z', new Date('2026-08-18T09:21:00.000Z'))).toBe(false);
  });

  it('allows a failed word back into the queue on the next local day', () => {
    expect(isPendingReview({
      ...progress,
      nextReviewAt: '2026-08-18T09:20:00.000Z',
      lastScore: 40,
      lastReviewedAt: '2026-08-18T09:00:00.000Z'
    }, true, '2026-08-18T09:30:00.000Z', new Date('2026-08-19T08:00:00.000Z'))).toBe(true);
  });

  it('always includes a currently due word even when it was appended after the frozen plan', () => {
    expect(isPendingReview({
      ...progress,
      nextReviewAt: '2026-08-18T09:00:00.000Z',
      lastReviewedAt: undefined
    }, false, '2026-08-18T05:00:00.000Z', new Date('2026-08-18T10:00:00.000Z'))).toBe(true);
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
