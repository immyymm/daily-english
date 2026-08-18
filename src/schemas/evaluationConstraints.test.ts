import { describe, expect, it } from 'vitest';
import {
  missingRequiredExpressions,
  normalizeEvaluationResultForHistory,
  requiredExpressionsForEvaluation
} from './evaluationConstraints';

describe('AI evaluation expression constraints', () => {
  const context = {
    questionType: 'free_sentence' as const,
    prompt: '请用完整搭配 “improve on” 写一个与自己有关的自然英文句子。',
    targetWord: 'improve'
  };

  it('extracts the complete required phrase instead of the contained single word', () => {
    expect(requiredExpressionsForEvaluation(context)).toEqual(['improve on']);
  });

  it('detects when a natural version drops the required phrase', () => {
    expect(missingRequiredExpressions('I want to get a better score next time.', ['improve on'])).toEqual(['improve on']);
  });

  it('repairs an old natural version by preserving the compliant corrected answer', () => {
    const repaired = normalizeEvaluationResultForHistory({
      correctedAnswer: 'I want to improve on my last test score.',
      naturalVersion: 'I want to get a better score next time.'
    }, context);

    expect(repaired.naturalVersion).toBe('I want to improve on my last test score.');
    expect(repaired.naturalVersionReasonZh).toContain('遗漏');
    expect(repaired.naturalVersionReasonZh).toContain('improve on');
  });

  it('does not force weekly writing to contain every listed word', () => {
    expect(requiredExpressionsForEvaluation({
      questionType: 'weekly_writing',
      prompt: '写一篇短文，主题是“一个小改变”。',
      targetWord: 'improve'
    })).toEqual([]);
  });
});
