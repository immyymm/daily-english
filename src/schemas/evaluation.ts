import { z } from 'zod';

export const evaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  dimensionScores: z.object({
    meaningContext: z.number().min(0).max(25),
    activeRecall: z.number().min(0).max(20),
    collocation: z.number().min(0).max(20),
    grammar: z.number().min(0).max(15),
    naturalness: z.number().min(0).max(10)
  }),
  errorTypes: z.array(z.string()).max(8),
  correctedAnswer: z.string(),
  naturalVersion: z.string(),
  reasonZh: z.string(),
  collocationSuggestions: z.array(z.string()).max(5),
  needsRetry: z.boolean(),
  confidence: z.number().min(0).max(1)
});
