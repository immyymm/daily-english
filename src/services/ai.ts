import type { EvaluationResult, QuestionType, ReviewStage, WordCard } from '../types';
import { evaluationSchema } from '../schemas/evaluation';

export interface EvaluationRequest {
  requestId: string;
  card: WordCard;
  questionType: QuestionType;
  stage: ReviewStage;
  prompt: string;
  answer: string;
  responseMs: number;
  weeklyWords?: string[];
}

export async function evaluateAnswer(input: EvaluationRequest): Promise<{ model: string; result: EvaluationResult }> {
  const endpoint = import.meta.env.VITE_AI_API_URL || '/api/evaluate';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requestId: input.requestId,
      cardId: input.card.id,
      targetWord: input.card.word,
      partOfSpeech: input.card.partOfSpeech,
      questionType: input.questionType,
      stage: input.stage,
      prompt: input.prompt,
      answer: input.answer,
      responseMs: input.responseMs,
      cardContext: {
        coreMeaning: input.card.coreMemory.chinese,
        englishDefinition: input.card.coreMemory.english,
        keyCollocation: input.card.coreMemory.structure,
        commonError: input.card.coreMemory.commonError,
        referenceExample: input.card.coreMemory.example
      },
      weeklyWords: input.weeklyWords ?? []
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof payload?.message === 'string' ? payload.message : 'AI 评分暂时不可用';
    const error = new Error(message) as Error & { code?: string };
    error.code = payload?.code;
    throw error;
  }

  return {
    model: payload.model ?? 'gpt-5-mini',
    result: evaluationSchema.parse(payload.result)
  };
}
