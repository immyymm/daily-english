import { describe, expect, it } from 'vitest';
import type { CardProgress, DailyPlanRecord, WordCard } from '../types';
import { resolveDailyLearningPlan } from './dailyPlan';

const cards = Array.from({ length: 15 }, (_, index) => ({
  id: `card-${index + 1}`
})) as WordCard[];

const learned = (cardId: string): CardProgress => ({
  cardId,
  learnedAt: '2026-08-18T02:00:00.000Z',
  stage: 'T0',
  nextReviewAt: '2026-08-18T02:00:00.000Z',
  status: '学习中',
  correctStreak: 0,
  wrongCount: 0,
  unstableCount: 0,
  weak: false,
  passedT7: false,
  passedT30: false,
  passedT60: false
});

const plan = (studyDay: number, cardIds: string[]): DailyPlanRecord => ({
  date: '2026-08-21',
  studyDay,
  cycle: 1,
  cardIds,
  completedCardIds: [],
  contentVersion: 'test'
});

describe('daily learning plan', () => {
  it('carries the earliest unfinished five-word batch across missed calendar days', () => {
    const result = resolveDailyLearningPlan({
      cards,
      progress: cards.slice(0, 5).map((card) => learned(card.id)),
      existingPlan: plan(3, cards.slice(10, 15).map((card) => card.id)),
      date: '2026-08-21',
      contentVersion: 'test'
    });

    expect(result.studyDay).toBe(2);
    expect(result.cardIds).toEqual(cards.slice(5, 10).map((card) => card.id));
    expect(result.completedCardIds).toEqual([]);
  });

  it('keeps the same five words when only part of the batch was learned', () => {
    const result = resolveDailyLearningPlan({
      cards,
      progress: cards.slice(0, 7).map((card) => learned(card.id)),
      date: '2026-08-22',
      contentVersion: 'test'
    });

    expect(result.studyDay).toBe(2);
    expect(result.cardIds).toEqual(cards.slice(5, 10).map((card) => card.id));
    expect(result.completedCardIds).toEqual(['card-6', 'card-7']);
  });

  it('does not reveal tomorrow\'s words immediately after today\'s five are completed', () => {
    const currentCardIds = cards.slice(5, 10).map((card) => card.id);
    const result = resolveDailyLearningPlan({
      cards,
      progress: cards.slice(0, 10).map((card) => learned(card.id)),
      existingPlan: plan(2, currentCardIds),
      date: '2026-08-21',
      contentVersion: 'test'
    });

    expect(result.studyDay).toBe(2);
    expect(result.cardIds).toEqual(currentCardIds);
    expect(result.completedCardIds).toEqual(currentCardIds);
  });
});
