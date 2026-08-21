import { describe, expect, it } from 'vitest';
import type { AppSnapshot, DailyRecommendation, ReviewSessionProgress } from '../types';
import { sanitizeSnapshotReviewState } from './db';

const recommendation: DailyRecommendation = {
  date: '2026-08-19',
  generatedAt: '2026-08-19T05:00:00.000Z',
  studyDay: 3,
  newCardIds: [],
  reviewCardIds: ['improve-v'],
  recommendedCardIds: ['improve-v'],
  cardPrescriptions: {
    'improve-v': {
      riskScore: 1,
      riskLevel: 'high',
      targetQuestionCount: 17,
      focusDimensions: ['grammar'],
      overdueDays: 0,
      reason: 'stale'
    }
  },
  focusDimensions: ['grammar'],
  targetQuestionCount: 17,
  algorithmVersion: '2026.08.19.2',
  summary: 'stale',
  analysis: {},
  codexStatus: 'complete'
};

const session: ReviewSessionProgress = {
  id: 'session',
  date: '2026-08-19',
  status: 'active',
  initialCardIds: ['improve-v'],
  queueCardIds: ['improve-v'],
  batchTotal: 1,
  currentCardId: 'improve-v',
  stage: 'T0',
  questionIds: ['q1'],
  questionIndex: 0,
  answer: 'draft',
  attempts: [],
  shownAt: '2026-08-19T12:00:00.000Z',
  attemptSessionId: 'attempt-session',
  createdAt: '2026-08-19T12:00:00.000Z',
  updatedAt: '2026-08-19T12:00:00.000Z'
};

describe('sanitizeSnapshotReviewState', () => {
  it('removes words already reviewed today from recommendations and active sessions', () => {
    const snapshot: AppSnapshot = {
      settings: {
        id: 'settings', firstUseDate: '2026-08-17', streak: 1,
        aiConsent: false, reduceMotion: false, dailyAiLimit: 20
      },
      progress: [{
        cardId: 'improve-v', learnedAt: '2026-08-17T01:00:00.000Z',
        lastReviewedAt: '2026-08-19T12:00:00+08:00', stage: 'T0',
        nextReviewAt: '2026-08-20T08:00:00+08:00', status: '薄弱词',
        correctStreak: 0, wrongCount: 1, unstableCount: 1, weak: true,
        passedT7: false, passedT30: false, passedT60: false
      }],
      attempts: [],
      aiEvaluations: [],
      dailyPlans: [],
      dailyRecommendations: [recommendation],
      reviewSessions: [session],
      exportedAt: '2026-08-19T12:00:00.000Z',
      schemaVersion: 3
    };

    const sanitized = sanitizeSnapshotReviewState(snapshot, '2026-08-19');
    expect(sanitized.dailyRecommendations[0].reviewCardIds).toEqual([]);
    expect(sanitized.dailyRecommendations[0].recommendedCardIds).toEqual([]);
    expect(sanitized.dailyRecommendations[0].cardPrescriptions).toEqual({});
    expect(sanitized.reviewSessions?.[0].status).toBe('completed');
    expect(sanitized.reviewSessions?.[0].queueCardIds).toEqual([]);
  });

  it('removes not-yet-due words from a stale active queue', () => {
    const snapshot: AppSnapshot = {
      settings: {
        id: 'settings', firstUseDate: '2026-08-17', streak: 1,
        aiConsent: false, reduceMotion: false, dailyAiLimit: 20
      },
      progress: [{
        cardId: 'improve-v', learnedAt: '2026-08-17T01:00:00.000Z',
        lastReviewedAt: '2026-08-19T12:00:00+08:00', stage: 'T3',
        nextReviewAt: '2026-08-26T08:00:00+08:00', status: '基本掌握',
        correctStreak: 3, wrongCount: 0, unstableCount: 0, weak: true,
        passedT7: false, passedT30: false, passedT60: false
      }],
      attempts: [],
      aiEvaluations: [],
      dailyPlans: [],
      dailyRecommendations: [{ ...recommendation, date: '2026-08-21' }],
      reviewSessions: [{ ...session, date: '2026-08-21' }],
      exportedAt: '2026-08-21T12:00:00.000Z',
      schemaVersion: 3
    };

    const sanitized = sanitizeSnapshotReviewState(
      snapshot,
      '2026-08-21',
      new Date('2026-08-21T20:00:00+08:00')
    );
    expect(sanitized.reviewSessions?.[0].status).toBe('completed');
    expect(sanitized.reviewSessions?.[0].queueCardIds).toEqual([]);
  });
});
