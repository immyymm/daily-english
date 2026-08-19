import { z } from 'zod';

const conciseUserText = z.string().max(600);
const detailedUserText = z.string().max(1_200);
const englishExpression = z.string().max(4_000);

export const evaluationErrorTypeSchema = z.enum([
  '任务要求',
  '词义',
  '拼写',
  '词性',
  '介词',
  '搭配',
  '语法',
  '语境',
  '语气',
  '中文直译',
  '表达不自然'
]);

const dimensionFeedbackSchema = z.object({
  meaningContext: conciseUserText,
  activeRecall: conciseUserText,
  collocation: conciseUserText,
  grammar: conciseUserText,
  naturalness: conciseUserText
});

const taskComplianceSchema = z.object({
  passed: z.boolean(),
  summaryZh: conciseUserText,
  checks: z.array(z.object({
    id: z.string().max(120),
    labelZh: z.string().max(200),
    passed: z.boolean(),
    evidenceZh: conciseUserText
  })).max(20)
});

export const evaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  taskCompletionScore: z.number().min(0).max(10).default(10),
  taskCompliance: taskComplianceSchema.default({
    passed: true,
    summaryZh: '旧版点评未保存结构化任务检查。',
    checks: []
  }),
  dimensionScores: z.object({
    meaningContext: z.number().min(0).max(25),
    activeRecall: z.number().min(0).max(20),
    collocation: z.number().min(0).max(20),
    grammar: z.number().min(0).max(15),
    naturalness: z.number().min(0).max(10)
  }),
  dimensionFeedback: dimensionFeedbackSchema.default({
    meaningContext: '',
    activeRecall: '',
    collocation: '',
    grammar: '',
    naturalness: ''
  }),
  errorTypes: z.array(evaluationErrorTypeSchema).max(8),
  issues: z.array(z.object({
    category: evaluationErrorTypeSchema,
    severity: z.enum(['minor', 'major']),
    originalText: englishExpression,
    suggestedText: englishExpression,
    explanationZh: detailedUserText
  })).max(8).default([]),
  correctedAnswer: englishExpression,
  naturalVersion: englishExpression,
  naturalVersionReasonZh: detailedUserText.describe('用简体中文逐项说明 correctedAnswer 的哪些词被改成了什么，并解释对应的搭配、语序、语气或语境理由；禁止只写“更自然/更口语”。若两句相同则说明无需进一步改写。').default(''),
  naturalChanges: z.array(z.object({
    from: z.string().max(300).describe('correctedAnswer 中实际被替换的最短词或短语，禁止填写整句。'),
    to: z.string().max(300).describe('naturalVersion 中对应的新词或短语，禁止填写整句。'),
    sourceIssueZh: detailedUserText.describe('具体说明原词或原短语在本句中的问题，例如搭配对象、词性、语序、介词、语气或语境不合适。').default(''),
    replacementReasonZh: detailedUserText.describe('具体说明为什么新词或新短语在本句中更合适，以及它带来的含义、搭配或语气效果。').default(''),
    reasonZh: detailedUserText.describe('把原表达问题和替换理由合并成一句完整的中文说明；禁止只说“更自然/更地道/更口语”。').default('')
  })).max(10).default([]),
  reasonZh: detailedUserText,
  collocationSuggestions: z.array(z.string().max(160)).max(5),
  needsRetry: z.boolean(),
  confidence: z.number().min(0).max(1)
});

