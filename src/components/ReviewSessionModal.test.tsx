import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { selectReviewQuestions } from '../learning/questionSelection';
import type { CardProgress, ReviewSessionProgress, WordCard } from '../types';
import { ReviewSessionModal } from './ReviewSessionModal';

const card = {
  id: 'resume-v',
  word: 'resume',
  questions: [
    { id: 'meaning-1', type: 'meaning_choice', prompt: '第一题', options: ['A', 'B'], answer: 'A', ai: false },
    { id: 'meaning-2', type: 'meaning_choice', prompt: '第二题', options: ['C', 'D'], answer: 'C', ai: false }
  ],
  reviewStages: {
    T0: ['meaning_choice'], T1: ['meaning_choice'], T2: ['meaning_choice'], T3: ['meaning_choice'],
    T4: ['meaning_choice'], T5: ['meaning_choice'], T6: ['meaning_choice'], T7: ['meaning_choice']
  }
} as WordCard;

const progress: CardProgress = {
  cardId: card.id,
  learnedAt: '2026-08-19T00:00:00.000Z',
  stage: 'T0',
  nextReviewAt: '2026-08-19T00:00:00.000Z',
  status: '学习中',
  correctStreak: 0,
  wrongCount: 0,
  unstableCount: 0,
  weak: false,
  passedT7: false,
  passedT30: false,
  passedT60: false
};

describe('ReviewSessionModal progress restore', () => {
  it('resumes the exact saved question and selected answer', async () => {
    const questions = selectReviewQuestions(card, progress);
    const resumedQuestion = questions[1];
    const resumedAnswer = resumedQuestion.options![1];
    const savedSession: ReviewSessionProgress = {
      id: 'saved-session',
      date: '2026-08-19',
      status: 'active',
      initialCardIds: [card.id],
      queueCardIds: [card.id],
      batchTotal: 1,
      currentCardId: card.id,
      stage: 'T0',
      questionIds: questions.map((question) => question.id),
      questionIndex: 1,
      answer: resumedAnswer,
      attempts: [],
      shownAt: '2026-08-19T00:00:00.000Z',
      attemptSessionId: 'attempt-session',
      createdAt: '2026-08-19T00:00:00.000Z',
      updatedAt: '2026-08-19T00:01:00.000Z'
    };
    const onSaveProgress = vi.fn().mockResolvedValue(undefined);

    render(<ReviewSessionModal
      open
      card={card}
      progress={progress}
      savedSession={savedSession}
      aiConsent={false}
      onNeedConsent={vi.fn()}
      onClose={vi.fn()}
      onComplete={vi.fn().mockResolvedValue(undefined)}
      onSaveProgress={onSaveProgress}
      onRecordAttempt={vi.fn().mockResolvedValue(undefined)}
      onQueueEvaluation={vi.fn().mockResolvedValue(undefined)}
      onCompleteEvaluation={vi.fn().mockResolvedValue(undefined)}
    />);

    expect(await screen.findByText(resumedQuestion.prompt)).toBeInTheDocument();
    expect(screen.getByText(/2 \/ 2 题/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: resumedAnswer })).toHaveClass('selected');
    await waitFor(() => expect(onSaveProgress).toHaveBeenCalledWith(
      'saved-session',
      card.id,
      expect.objectContaining({ questionIndex: 1, answer: resumedAnswer, attemptSessionId: 'attempt-session' })
    ));
  });
});
