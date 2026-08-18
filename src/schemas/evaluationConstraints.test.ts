import { describe, expect, it } from 'vitest';
import {
  finalizeEvaluationResult,
  generatedEvaluationViolations,
  missingRequiredExpressions,
  normalizeEvaluationResultForHistory,
  reconstructNaturalVersion,
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
    naturalChanges: [{
      from: 'want to',
      to: 'would like to',
      sourceIssueZh: 'want to 在这里直接陈述个人意愿，语气比较强，和礼貌表达愿望的语境不完全匹配。',
      replacementReasonZh: 'would like to 保留原来的愿望含义，同时用更委婉的情态表达让语气更礼貌柔和。',
      reasonZh: '把 want to 改成 would like to，可以把直接意愿调整为更礼貌、委婉的语气。'
    }],
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
      naturalChanges: [{
        from: 'want to improve on my last test score',
        to: 'would like to get a better score next time',
        sourceIssueZh: '原短语在这里没有语法问题，但测试用于验证自然表达是否保留指定搭配。',
        replacementReasonZh: '替换后虽然表达了相近目标，却删除了题目明确要求使用的 improve on。',
        reasonZh: '替换后删除了题目要求的固定搭配。'
      }]
    }, {
      ...context,
      answer: 'I want improve my score.'
    });

    expect(validation.valid).toBe(false);
    expect(validation.naturalFailures.map((item) => item.id)).toContain('pattern:improve on');
  });

  it('treats do as a grammar placeholder and overrides a false model task failure', () => {
    const finalized = finalizeEvaluationResult({
      ...result,
      overallScore: 25,
      taskCompletionScore: 0,
      taskCompliance: { passed: false, summaryZh: '没有逐字写出 manage to do。', checks: [] },
      errorTypes: ['任务要求', '搭配'],
      issues: [
        { category: '任务要求', severity: 'major', originalText: 'manage to save', explanationZh: '没有使用 manage to do。', suggestedText: 'manage to do well' },
        { category: '搭配', severity: 'minor', originalText: 'manage on a little money', explanationZh: '表达生硬。', suggestedText: 'manage on very little money' }
      ],
      correctedAnswer: 'I manage to save money, so I can manage on very little money.',
      naturalVersion: 'I manage to save money, so I can manage on very little money.',
      naturalChanges: [],
      reasonZh: '未满足任务要求，必须包含 manage to do。',
      needsRetry: true
    }, {
      questionType: 'free_sentence',
      prompt: '请使用 “manage to do” 结构写一个与自己有关的自然英文句子；do 代表任意合适的动词原形，不要求写出单词 do。',
      targetWord: 'manage',
      answer: 'I manage to save money so I manage on a little money'
    });

    expect(finalized.taskCompliance.passed).toBe(true);
    expect(finalized.taskCompliance.checks[0]).toMatchObject({ id: 'pattern:manage to do', passed: true });
    expect(finalized.taskCompletionScore).toBe(10);
    expect(finalized.errorTypes).not.toContain('任务要求');
    expect(finalized.issues.map((issue) => issue.category)).not.toContain('任务要求');
    expect(finalized.reasonZh).toContain('已满足');
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
    expect(finalized.naturalVersionReasonZh).toContain('原表达的问题');
    expect(finalized.naturalVersionReasonZh).toContain('更礼貌柔和');
  });

  it('rejects vague explanations even when the changed words are valid', () => {
    const validation = generatedEvaluationViolations({
      ...result,
      naturalChanges: [{
        from: 'want to',
        to: 'would like to',
        sourceIssueZh: '不够自然。',
        replacementReasonZh: '更加地道。',
        reasonZh: '更自然。'
      }]
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
        sourceIssueZh: 'want to 在这里直接表达意愿，没有体现说话人希望语气更加委婉的交际目的。',
        replacementReasonZh: 'would really like to 用 would 缓和语气，并用 really 加强个人意愿的程度。',
        reasonZh: 'would really like to 的语气更委婉，也加强了个人意愿。'
      }]
    }, {
      ...context,
      answer: 'I want to improve on my last test score.'
    });

    expect(validation.valid).toBe(false);
    expect(validation.invalidChanges).toBe(true);
  });

  it('reconstructs the displayed natural expression from unique left-to-right phrase changes', () => {
    const corrected = 'I review English daily and practice speaking regularly.';
    const natural = 'I practice English daily and review speaking regularly.';
    const changes = [
      { from: 'review', to: 'practice' },
      { from: 'practice', to: 'review' }
    ];

    expect(reconstructNaturalVersion(corrected, natural, changes)).toBe(natural);
  });

  it('rejects change text that is not copied from the displayed natural expression', () => {
    expect(reconstructNaturalVersion(
      'I improve my English every day.',
      'I work on my English every day.',
      [{ from: 'improve', to: 'get better at' }]
    )).toBeUndefined();
  });

  it('rejects ambiguous repeated spans instead of claiming the wrong word was changed', () => {
    expect(reconstructNaturalVersion(
      'I practice English and practice speaking.',
      'I review English and practice speaking.',
      [{ from: 'practice', to: 'review' }]
    )).toBeUndefined();
  });

  it('reconstructs the existing improve-on record from its displayed phrase changes', () => {
    const natural = "I've been reviewing and practicing English every day this month, so I think I have improved on last month's spoken English performance";
    expect(reconstructNaturalVersion(
      'I review and practice English every day this month, so I think my English speaking has improved on last month',
      natural,
      [
        { from: 'I review and practice', to: "I've been reviewing and practicing" },
        { from: 'my English speaking has', to: 'I have' },
        { from: 'last month', to: "last month's spoken English performance" }
      ]
    )).toBe(natural);
  });

  it('reconstructs the existing improve record from three directly traceable changes', () => {
    const natural = 'I believe daily practice and regular review can help me improve my spoken English.';
    expect(reconstructNaturalVersion(
      'I believe daily review and regular practice can help me improve my English speaking.',
      natural,
      [
        { from: 'daily review', to: 'daily practice' },
        { from: 'regular practice', to: 'regular review' },
        { from: 'English speaking', to: 'spoken English' }
      ]
    )).toBe(natural);
  });

  it('rejects an entire-sentence replacement even when its explanation is long', () => {
    const validation = generatedEvaluationViolations({
      ...result,
      naturalChanges: [{
        from: result.correctedAnswer,
        to: result.naturalVersion,
        sourceIssueZh: '原句使用 want to 直接表达愿望，语气比较强，没有体现更礼貌委婉的交际效果。',
        replacementReasonZh: '新句使用 would like to 保留原意并缓和语气，在这个语境中显得更加礼貌。',
        reasonZh: '把直接的愿望表达调整成更加委婉的表达。'
      }]
    }, {
      ...context,
      answer: 'I want to improve on my last test score.'
    });

    expect(validation.valid).toBe(false);
    expect(validation.invalidChanges).toBe(true);
  });

  it('hides an unverifiable whole-sentence explanation in old records', () => {
    const normalized = normalizeEvaluationResultForHistory({
      correctedAnswer: result.correctedAnswer,
      naturalVersion: result.naturalVersion,
      naturalVersionReasonZh: '整体换一种说法会更自然。',
      naturalChanges: [{
        from: result.correctedAnswer,
        to: result.naturalVersion,
        sourceIssueZh: '',
        replacementReasonZh: '',
        reasonZh: '整体换一种说法会更自然。'
      }]
    }, context);

    expect(normalized.naturalChanges).toEqual([]);
    expect(normalized.naturalVersionReasonZh).toContain('整句改整句');
  });
});
