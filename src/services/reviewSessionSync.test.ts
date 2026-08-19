import { describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ReviewSessionProgress } from '../types';
import { syncReviewSessions } from './cloudRecords';

const session: ReviewSessionProgress = {
  id: '2026-08-19-session',
  date: '2026-08-19',
  status: 'active',
  initialCardIds: ['improve-v', 'notice-v'],
  queueCardIds: ['improve-v', 'notice-v'],
  batchTotal: 2,
  currentCardId: 'improve-v',
  stage: 'T1',
  questionIds: ['improve-question-T1-0', 'improve-question-T1-1'],
  questionIndex: 1,
  answer: 'I want to improve',
  feedback: { message: '草稿已保存' },
  attempts: [],
  shownAt: '2026-08-19T01:00:00.000Z',
  attemptSessionId: 'attempt-session',
  createdAt: '2026-08-19T01:00:00.000Z',
  updatedAt: '2026-08-19T01:01:00.000Z'
};

function clientWithRemote(clientUpdatedAt?: string) {
  const upsert = vi.fn().mockResolvedValue({ error: null });
  const inRequest = vi.fn().mockResolvedValue({
    data: clientUpdatedAt ? [{ session_id: session.id, client_updated_at: clientUpdatedAt }] : [],
    error: null
  });
  const eq = vi.fn(() => ({ in: inRequest }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select, upsert }));
  return { client: { from } as unknown as SupabaseClient, upsert };
}

describe('review session cloud sync', () => {
  it('uploads the exact current word, question, draft and feedback state', async () => {
    const { client, upsert } = clientWithRemote();
    await syncReviewSessions(client, 'user-1', [session], 'device-1');

    expect(upsert).toHaveBeenCalledTimes(1);
    expect(upsert.mock.calls[0][0][0]).toMatchObject({
      session_id: session.id,
      queue_card_ids: session.queueCardIds,
      current_card_id: 'improve-v',
      question_index: 1,
      answer: 'I want to improve',
      feedback: { message: '草稿已保存' },
      device_id: 'device-1'
    });
  });

  it('does not overwrite a newer position saved by another device', async () => {
    const { client, upsert } = clientWithRemote('2026-08-19T01:02:00.000Z');
    await syncReviewSessions(client, 'user-1', [session], 'device-1');
    expect(upsert).not.toHaveBeenCalled();
  });
});
