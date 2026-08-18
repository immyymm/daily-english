import { describe, expect, it, vi } from 'vitest';
import { syncDetailedRecords } from './cloudRecords';
import type { AppSnapshot } from '../types';

describe('syncDetailedRecords', () => {
  it('updates an existing AI evaluation instead of ignoring its completed result', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const requestIds = vi.fn().mockResolvedValue({ data: [], error: null });
    const eq = vi.fn(() => ({ in: requestIds }));
    const select = vi.fn(() => ({ eq }));
    const client = {
      from: vi.fn(() => ({ upsert, select }))
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
        rubricVersion: '2026.08.18.8',
        result: {
          overallScore: 95,
          taskCompletionScore: 10,
          taskCompliance: {
            passed: true,
            summaryZh: '完整使用了指定搭配。',
            checks: [{ id: 'exact:improve on', labelZh: '使用指定表达“improve on”', passed: true, evidenceZh: '已使用“improve on”。' }]
          },
          dimensionScores: {
            meaningContext: 23,
            activeRecall: 19,
            collocation: 19,
            grammar: 14,
            naturalness: 10
          },
          dimensionFeedback: {
            meaningContext: '语义清楚。',
            activeRecall: '能主动造句。',
            collocation: '搭配正确。',
            grammar: '语法正确。',
            naturalness: '表达自然。'
          },
          correctedAnswer: 'I want to improve on my writing.',
          naturalVersion: 'I want to improve on my writing skills.',
          naturalVersionReasonZh: '加入 skills 后，表达的改进对象更具体。',
          naturalChanges: [{
            from: 'writing',
            to: 'writing skills',
            sourceIssueZh: 'writing 单独出现时只表示写作活动，没有明确指出学习者想提升的是一项语言能力。',
            replacementReasonZh: 'writing skills 把改进对象明确为写作能力，和 improve 的宾语搭配更具体清楚。',
            reasonZh: '加入 skills 后，表达的改进对象从写作活动明确为写作能力。'
          }],
          reasonZh: '表达正确且符合题目要求。',
          errorTypes: [],
          issues: [],
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
    expect(requestIds).toHaveBeenCalledWith('request_id', ['evaluation-1']);
    expect(upsert).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({
        request_id: 'evaluation-1',
        status: 'complete'
      })]),
      { onConflict: 'user_id,request_id' }
    );
  });

  it('does not let a stale completed evaluation overwrite a newer cloud correction', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const requestIds = vi.fn().mockResolvedValue({
      data: [{ request_id: 'evaluation-stale', updated_at: '2026-08-18T03:00:00.000Z' }],
      error: null
    });
    const eq = vi.fn(() => ({ in: requestIds }));
    const select = vi.fn(() => ({ eq }));
    const client = { from: vi.fn(() => ({ upsert, select })) };
    const snapshot: AppSnapshot = {
      settings: {
        id: 'settings', firstUseDate: '2026-08-18', streak: 1, aiConsent: true,
        reduceMotion: false, dailyAiLimit: 20
      },
      progress: [],
      attempts: [],
      aiEvaluations: [{
        requestId: 'evaluation-stale', cardId: 'improve-v', questionType: 'free_sentence',
        stage: 'T1', answer: 'answer', status: 'complete',
        createdAt: '2026-08-18T00:00:00.000Z', updatedAt: '2026-08-18T02:00:00.000Z',
        rubricVersion: '2026.08.18.8'
      }],
      dailyPlans: [],
      dailyRecommendations: [],
      exportedAt: '2026-08-18T02:00:00.000Z',
      schemaVersion: 2
    };

    await syncDetailedRecords(client as never, 'user-1', snapshot, 'device-1');

    expect(upsert).not.toHaveBeenCalled();
  });

  it('does not let a stale local pending row overwrite a completed cloud evaluation', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const client = { from: vi.fn(() => ({ upsert })) };
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
        requestId: 'evaluation-pending',
        cardId: 'improve-v',
        questionId: 'improve-free-sentence',
        questionType: 'free_sentence',
        stage: 'T1',
        prompt: '请用完整搭配 “improve on” 造句。',
        answer: 'I want to improve on my writing.',
        status: 'pending',
        createdAt: '2026-08-18T00:00:00.000Z',
        rubricVersion: '2026.08.18.8'
      }],
      dailyPlans: [],
      dailyRecommendations: [],
      exportedAt: '2026-08-18T00:00:01.000Z',
      schemaVersion: 2
    };

    await syncDetailedRecords(client as never, 'user-1', snapshot, 'device-1');

    expect(upsert).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ request_id: 'evaluation-pending', status: 'pending' })]),
      { onConflict: 'user_id,request_id', ignoreDuplicates: true }
    );
  });

  it('normalizes legacy attempt values before uploading them', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const client = { from: vi.fn(() => ({ upsert })) };
    const snapshot = {
      settings: {
        id: 'settings',
        firstUseDate: '2026-08-18',
        streak: 1,
        aiConsent: true,
        reduceMotion: false,
        dailyAiLimit: 20
      },
      progress: [],
      attempts: [{
        id: 'legacy-attempt',
        cardId: 'improve-v',
        score: 120.8,
        correct: true,
        responseMs: -10,
        errorTypes: ['拼写或答案不正确'],
        createdAt: 'not-a-date',
        ai: false,
        dimensionScores: { grammar: Number.NaN, naturalness: 125 }
      }],
      aiEvaluations: [],
      dailyPlans: [],
      dailyRecommendations: [],
      exportedAt: '2026-08-18T00:00:01.000Z',
      schemaVersion: 2
    } as unknown as AppSnapshot;

    await syncDetailedRecords(client as never, 'user-1', snapshot, 'device-1');

    expect(upsert).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 'legacy-attempt',
        question_id: 'legacy-question-legacy-attempt',
        question_type: 'recall',
        stage: 'T0',
        prompt: '',
        answer: '',
        correct_answer: '',
        score: 100,
        response_ms: 0,
        dimension_scores: { naturalness: 100 },
        created_at: '2026-08-18T00:00:01.000Z'
      })
    ], { onConflict: 'user_id,id' });
  });
});
