import { z } from 'zod';

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
  meaningContext: z.string(),
  activeRecall: z.string(),
  collocation: z.string(),
  grammar: z.string(),
  naturalness: z.string()
});

const taskComplianceSchema = z.object({
  passed: z.boolean(),
  summaryZh: z.string(),
  checks: z.array(z.object({
    id: z.string(),
    labelZh: z.string(),
    passed: z.boolean(),
    evidenceZh: z.string()
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
    originalText: z.string(),
    suggestedText: z.string(),
    explanationZh: z.string()
  })).max(8).default([]),
  correctedAnswer: z.string(),
  naturalVersion: z.string(),
  naturalVersionReasonZh: z.string().describe('用简体中文逐项说明 correctedAnswer 的哪些词被改成了什么，并解释对应的搭配、语序、语气或语境理由；禁止只写“更自然/更口语”。若两句相同则说明无需进一步改写。').default(''),
  naturalChanges: z.array(z.object({
    from: z.string(),
    to: z.string(),
    reasonZh: z.string().describe('说明这一处 from→to 修改对应的具体英语习惯及其在本句中的表达效果，禁止泛泛地说“更自然”。')
  })).max(8).default([]),
  reasonZh: z.string(),
  collocationSuggestions: z.array(z.string()).max(5),
  needsRetry: z.boolean(),
  confidence: z.number().min(0).max(1)
});
