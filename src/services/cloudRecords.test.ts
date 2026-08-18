import { describe, expect, it, vi } from 'vitest';
import { syncDetailedRecords } from './cloudRecords';
import type { AppSnapshot } from '../types';

describe('syncDetailedRecords', () => {
  it('updates an existing AI evaluation instead of ignoring its completed result', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const client = {
      from: vi.fn(() => ({ upsert }))
    };
    const snapshot: AppSnapshot = {
      settings: {
        id: 'settings',
        firstUseDate: '2026-08-18',
        streak: 1,
        aiConsent: true,
        reduceMotion: false,
        dailyAiLimit: 20
      },
      progress: [],
      attempts: [],
      aiEvaluations: [{
        requestId: 'evaluation-1',
        cardId: 'improve-v',
        questionId: 'improve-free-sentence',
        questionType: 'free_sentence',
        stage: 'T1',
        prompt: '请用完整搭配 “improve on” 造句。',
        answer: 'I want to improve on my writing.',
        correctAnswer: 'I want to improve on my writing.',
        responseMs: 1200,
        status: 'complete',
        createdAt: '2026-08-18T00:00:00.000Z',
        updatedAt: '2026-08-18T00:00:01.000Z',
        rubricVersion: '2026.08.18.4',
        result: {
          overallScore: 95,
          dimensionScores: {
            meaningContext: 95,
            activeRecall: 95,
            collocation: 100,
            grammar: 95,
            naturalness: 95
          },
          correctedAnswer: 'I want to improve on my writing.',
          naturalVersion: 'I want to improve on my writing skills.',
          naturalVersionReasonZh: '加入 skills 后，表达的改进对象更具体。',
          reasonZh: '表达正确且符合题目要求。',
          errorTypes: [],
          collocationSuggestions: ['improve on a previous result'],
          needsRetry: false,
          confidence: 0.98
        }
      }],
      dailyPlans: [],
      dailyRecommendations: [],
      exportedAt: '2026-08-18T00:00:01.000Z',
      schemaVersion: 2
    };

    await syncDetailedRecords(client as never, 'user-1', snapshot, 'device-1');

    expect(upsert).toHaveBeenCalledTimes(1);
    expect(upsert).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({
        request_id: 'evaluation-1',
        status: 'complete'
      })]),
      { onConflict: 'user_id,request_id' }
    );
  });
});
