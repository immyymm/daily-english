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
  it('selects ten unique questions and covers every allowed content type at T2', () => {
    const selected = selectReviewQuestions(card, { stage: 'T2', weak: false });
    expect(selected).toHaveLength(10);
    expect(new Set(selected.map((question) => question.id)).size).toBe(10);
    expect(new Set(selected.map((question) => question.type))).toEqual(new Set(['meaning_choice', 'recall', 'collocation', 'free_sentence']));
    const counts = selected.reduce<Record<string, number>>((result, question) => {
      result[question.type] = (result[question.type] ?? 0) + 1;
      return result;
    }, {});
    expect(counts).toEqual({ meaning_choice: 3, recall: 3, collocation: 3, free_sentence: 1 });
  });

  it('is stable for the same word and review stage', () => {
    const progress = { stage: 'T1' as const, weak: false };
    expect(selectReviewQuestions(card, progress)).toEqual(selectReviewQuestions(card, progress));
  });

  it('uses all available questions for a weak word', () => {
    const selected = selectReviewQuestions(card, { stage: 'T2', weak: true, weakDimensions: ['collocation'] });
    expect(selected).toHaveLength(12);
  });
});
