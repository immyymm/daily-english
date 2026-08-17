import { describe, expect, it } from 'vitest';
import { selectReviewQuestions } from './questionSelection';
import type { CardQuestion, WordCard } from '../types';

const questions: CardQuestion[] = [
  ...Array.from({ length: 4 }, (_, index) => ({ id: `meaning-${index}`, type: 'meaning_choice' as const, prompt: `meaning ${index}`, options: ['a', 'b', 'c'], answer: 'a', stage: 'T0' as const, ai: false })),
  ...Array.from({ length: 3 }, (_, index) => ({ id: `recall-${index}`, type: 'recall' as const, prompt: `recall ${index}`, answer: 'word', stage: 'T1' as const, ai: false })),
  ...Array.from({ length: 4 }, (_, index) => ({ id: `collocation-${index}`, type: 'collocation' as const, prompt: `collocation ${index}`, answer: 'word', stage: 'T1' as const, ai: false })),
  { id: 'sentence', type: 'free_sentence', prompt: 'sentence', answer: '', stage: 'T2', ai: true }
];

const card = {
  id: 'sample-v',
  questions,
  reviewStages: {
    T0: ['meaning_choice', 'collocation', 'free_sentence'],
    T1: ['meaning_choice', 'recall', 'collocation'],
    T2: ['meaning_choice', 'recall', 'collocation', 'free_sentence'],
    T3: ['recall'], T4: ['recall'], T5: ['recall'], T6: ['recall'], T7: ['recall']
  }
} as WordCard;

describe('rich review question selection', () => {
  it('selects five unique questions and covers every allowed content type', () => {
    const selected = selectReviewQuestions(card, 'T2');
    expect(selected).toHaveLength(5);
    expect(new Set(selected.map((question) => question.id)).size).toBe(5);
    expect(new Set(selected.map((question) => question.type))).toEqual(new Set(['meaning_choice', 'recall', 'collocation', 'free_sentence']));
  });

  it('is stable for the same word and review stage', () => {
    expect(selectReviewQuestions(card, 'T1')).toEqual(selectReviewQuestions(card, 'T1'));
  });
});
