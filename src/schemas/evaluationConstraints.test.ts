import { describe, expect, it } from 'vitest';
import {
  finalizeEvaluationResult,
  generatedEvaluationViolations,
  missingRequiredExpressions,
  normalizeEvaluationResultForHistory,
  requiredExpressionsForEvaluation
} from './evaluationConstraints';
import type { EvaluationResult } from '../types';

describe('AI evaluation expression constraints', () => {
  const context = {
    questionType: 'free_sentence' as const,
    prompt: '请用完整搭配 “improve on” 写一个与自己有关的自然英文句子。',
    targetWord: 'improve'
  };
  const result: EvaluationResult = {
    overallScore: 99,
    taskCompletionScore: 10,
    taskCompliance: { passed: true, summaryZh: '符合要求。', checks: [] },
    dimensionScores: { meaningContext: 23, activeRecall: 18, collocation: 18, grammar: 14, naturalness: 9 },
    dimensionFeedback: {
      meaningContext: '语义明确。',
      activeRecall: '能主动调用词汇。',
      collocation: '搭配正确。',
      grammar: '语法正确。',
      naturalness: '表达自然。'
    },
    errorTypes: [],
    issues: [],
    correctedAnswer: 'I want to improve on my last test score.',
    naturalVersion: 'I would like to improve on my last test score.',
    naturalVersionReasonZh: 'would like to 语气更柔和。',
    naturalChanges: [{ from: 'want to', to: 'would like to', reasonZh: 'would like to 语气更柔和。' }],
    reasonZh: '基本正确。',
    collocationSuggestions: [],
    needsRetry: false,
    confidence: 0.9
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

  it('rejects a generated natural version that drops the required phrase', () => {
    const validation = generatedEvaluationViolations({
      ...result,
      naturalVersion: 'I would like to get a better score next time.',
      naturalChanges: [{ from: 'want to improve on my last test score', to: 'would like to get a better score next time', reasonZh: '更口语。' }]
    }, {
      ...context,
      answer: 'I want improve my score.'
    });

    expect(validation.valid).toBe(false);
    expect(validation.naturalFailures.map((item) => item.id)).toContain('exact:improve on');
  });

  it('recalculates score and retry from deterministic task compliance', () => {
    const finalized = finalizeEvaluationResult(result, {
      ...context,
      answer: 'I want to get a better score next time.'
    });

    expect(finalized.taskCompliance.passed).toBe(false);
    expect(finalized.taskCompletionScore).toBe(0);
    expect(finalized.overallScore).toBe(82);
    expect(finalized.errorTypes).toContain('任务要求');
    expect(finalized.needsRetry).toBe(true);
    expect(finalized.naturalVersionReasonZh).toContain('把“want to”改为“would like to”');
    expect(finalized.naturalVersionReasonZh).toContain('语气更柔和');
  });

  it('rejects vague explanations even when the changed words are valid', () => {
    const validation = generatedEvaluationViolations({
      ...result,
      naturalChanges: [{ from: 'want to', to: 'would like to', reasonZh: '更自然。' }]
    }, {
      ...context,
      answer: 'I want to improve on my last test score.'
    });

    expect(validation.valid).toBe(false);
    expect(validation.invalidChanges).toBe(true);
  });

  it('requires the listed changes to explain the whole sentence difference', () => {
    const validation = generatedEvaluationViolations({
      ...result,
      naturalVersion: 'I would really like to improve on my latest test score.',
      naturalChanges: [{
        from: 'want to',
        to: 'would really like to',
        reasonZh: 'would really like to 的语气更委婉，也加强了个人意愿。'
      }]
    }, {
      ...context,
      answer: 'I want to improve on my last test score.'
    });

    expect(validation.valid).toBe(false);
    expect(validation.invalidChanges).toBe(true);
  });
});
