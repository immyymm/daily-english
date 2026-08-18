import { describe, expect, it } from 'vitest';
import { mergeSnapshots } from './useCloudSync';
import type { AppSnapshot } from '../types';

function snapshot(source: 'local' | 'remote'): AppSnapshot {
  const remote = source === 'remote';
  return {
    settings: {
      id: 'settings',
      firstUseDate: remote ? '2026-08-18' : '2026-08-17',
      streak: remote ? 3 : 2,
      aiConsent: remote,
      reduceMotion: false,
      dailyAiLimit: 20
    },
    progress: [{
      cardId: 'improve-v',
      learnedAt: '2026-08-17T01:00:00.000Z',
      lastReviewedAt: remote ? '2026-08-18T02:00:00.000Z' : '2026-08-17T02:00:00.000Z',
      stage: remote ? 'T2' : 'T1',
      nextReviewAt: '2026-08-19T02:00:00.000Z',
      status: remote ? '基本掌握' : '学习中',
      correctStreak: remote ? 2 : 1,
      wrongCount: 0,
      unstableCount: 0,
      weak: false,
      passedT7: false,
      passedT30: false,
      passedT60: false
    }],
    attempts: remote ? [{
      id: 'remote-attempt', cardId: 'improve-v', questionId: 'q1', questionType: 'recall', stage: 'T1',
      prompt: 'prompt', answer: 'improve', correctAnswer: 'improve', score: 100, correct: true,
      responseMs: 800, errorTypes: [], createdAt: '2026-08-18T02:00:00.000Z', ai: false
    }] : [],
    aiEvaluations: [],
    dailyRecommendations: [],
    dailyPlans: [{
      date: '2026-08-17', studyDay: 1, cycle: 1, cardIds: ['improve-v', 'notice-v'],
      completedCardIds: remote ? ['notice-v'] : ['improve-v'], contentVersion: '2026.08.17.2'
    }],
    exportedAt: remote ? '2026-08-18T03:00:00.000Z' : '2026-08-17T03:00:00.000Z',
    schemaVersion: 2
  };
}

describe('mergeSnapshots', () => {
  it('preserves the earliest start date and unions progress from different devices', () => {
    const merged = mergeSnapshots(snapshot('local'), snapshot('remote'));
    expect(merged.settings.firstUseDate).toBe('2026-08-17');
    expect(merged.settings.streak).toBe(3);
    expect(merged.progress[0].stage).toBe('T2');
    expect(merged.attempts.map((item) => item.id)).toEqual(['remote-attempt']);
    expect(merged.dailyPlans[0].completedCardIds).toEqual(['improve-v', 'notice-v']);
  });

  it('uses the latest evaluation update instead of keeping stale wording from the original creation time', () => {
    const local = snapshot('local');
    const remote = snapshot('remote');
    local.aiEvaluations = [{
      requestId: 'same-request', cardId: 'improve-v', questionType: 'free_sentence', stage: 'T0',
      answer: 'answer', status: 'complete', createdAt: '2026-08-18T01:00:00.000Z',
      updatedAt: '2026-08-18T01:05:00.000Z', rubricVersion: 'old', errorMessage: 'stale'
    }];
    remote.aiEvaluations = [{
      requestId: 'same-request', cardId: 'improve-v', questionType: 'free_sentence', stage: 'T0',
      answer: 'answer', status: 'complete', createdAt: '2026-08-18T01:00:00.000Z',
      updatedAt: '2026-08-18T02:00:00.000Z', rubricVersion: 'new', errorMessage: 'fresh'
    }];

    const merged = mergeSnapshots(local, remote);
    expect(merged.aiEvaluations[0].rubricVersion).toBe('new');
    expect(merged.aiEvaluations[0].errorMessage).toBe('fresh');
  });
});
