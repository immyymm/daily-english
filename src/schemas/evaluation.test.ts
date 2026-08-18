import { describe, expect, it } from 'vitest';
import { evaluationSchema } from './evaluation';

describe('AI evaluation schema', () => {
  it('accepts a complete structured result', () => {
    const result = evaluationSchema.parse({
      overallScore: 86,
      dimensionScores: {
        meaningContext: 23,
        activeRecall: 18,
        collocation: 16,
        grammar: 14,
        naturalness: 8
      },
      errorTypes: ['搭配'],
      correctedAnswer: 'I managed to finish it.',
      naturalVersion: 'I managed to get it done.',
      naturalVersionReasonZh: 'get it done 在日常口语中比 finish it 更自然。',
      reasonZh: '意思准确，搭配可以更自然。',
      collocationSuggestions: ['manage to do something'],
      needsRetry: false,
      confidence: 0.9
    });
    expect(result.overallScore).toBe(86);
  });

  it('rejects scores outside the rubric', () => {
    expect(() => evaluationSchema.parse({
      overallScore: 120,
      dimensionScores: { meaningContext: 0, activeRecall: 0, collocation: 0, grammar: 0, naturalness: 0 },
      errorTypes: [],
      correctedAnswer: '',
      naturalVersion: '',
      naturalVersionReasonZh: '',
      reasonZh: '',
      collocationSuggestions: [],
      needsRetry: true,
      confidence: 0.5
    })).toThrow();
  });
});
