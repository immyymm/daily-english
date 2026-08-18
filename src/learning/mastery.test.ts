import { describe, expect, it } from 'vitest';
import type { Attempt, EvaluationResult } from '../types';
import { calculateMasteryProfile, dimensionsFromEvaluation } from './mastery';

const attempt = (id: string, score: number, questionType: Attempt['questionType'], errorTypes: string[] = []): Attempt => ({
  id,
  cardId: 'sample-v',
  questionId: 'q-' + id,
  questionType,
  stage: 'T2',
  prompt: 'prompt',
  answer: 'answer',
  correctAnswer: 'answer',
  score,
  correct: score >= 75,
  responseMs: 1000,
  errorTypes,
  createdAt: `2026-08-17T0${id}:00:00.000Z`,
  ai: false
});

describe('mastery diagnostics', () => {
  it('normalizes AI rubric dimensions to percentages', () => {
    const result = {
      dimensionScores: { meaningContext: 20, activeRecall: 10, collocation: 15, grammar: 12, naturalness: 8 }
    } as EvaluationResult;
    expect(dimensionsFromEvaluation(result)).toEqual({
      meaningContext: 80,
      activeRecall: 50,
      collocation: 75,
      grammar: 80,
      naturalness: 80
    });
  });

  it('finds weak dimensions and accumulates concrete error counts', () => {
    const profile = calculateMasteryProfile([
      attempt('1', 95, 'meaning_choice'),
      attempt('2', 50, 'recall', ['拼写']),
      attempt('3', 60, 'collocation', ['搭配', '拼写'])
    ]);
    expect(profile.dimensionScores.meaningContext).toBe(95);
    expect(profile.weakDimensions).toEqual(expect.arrayContaining(['activeRecall', 'collocation']));
    expect(profile.errorCounts).toEqual({ 拼写: 2, 搭配: 1 });
    expect(profile.attemptCount).toBe(3);
  });

  it('excludes legacy cloze attempts whose prompt already exposed the answer', () => {
    const attempts = [
      {
        ...attempt('4', 0, 'collocation', ['拼写或答案不正确']),
        id: 'invalid-cloze',
        questionId: 'manage-v-example-cloze-T0-3',
        prompt: '补全词卡核心例句：She managed to finish the report on time.（填入目标词）'
      },
      { ...attempt('5', 100, 'meaning_choice'), id: 'valid', questionId: 'manage-v-meaning-T0-1', prompt: 'manage 的含义是？' }
    ];

    const profile = calculateMasteryProfile(attempts);
    expect(profile.attemptCount).toBe(1);
    expect(profile.masteryScore).toBe(100);
    expect(profile.errorCounts).toEqual({});
  });
});
