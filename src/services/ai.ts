import type { EvaluationResult, QuestionType, ReviewStage, WordCard } from '../types';
import { evaluationSchema } from '../schemas/evaluation';
import { getSupabase } from './supabase';

export interface EvaluationRequest {
  requestId: string;
  card: WordCard;
  questionType: QuestionType;
  stage: ReviewStage;
  questionId: string;
  prompt: string;
  answer: string;
  correctAnswer?: string;
  responseMs: number;
  weeklyWords?: string[];
  rubricVersion?: string;
}

export type EvaluationResponse =
  | { status: 'pending' | 'processing'; requestId: string }
  | { status: 'complete'; requestId: string; model: string; result: EvaluationResult };

async function authHeaders(): Promise<Record<string, string>> {
  const client = await getSupabase();
  const { data } = client ? await client.auth.getSession() : { data: { session: null } };
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}

export async function evaluateAnswer(input: EvaluationRequest): Promise<EvaluationResponse> {
  const endpoint = import.meta.env.VITE_AI_API_URL || '/api/evaluate';
  const authorization = await authHeaders();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authorization },
    body: JSON.stringify({
      requestId: input.requestId,
      cardId: input.card.id,
      questionId: input.questionId,
      targetWord: input.card.word,
      partOfSpeech: input.card.partOfSpeech,
      questionType: input.questionType,
      stage: input.stage,
      prompt: input.prompt,
      answer: input.answer,
      correctAnswer: input.correctAnswer ?? '',
      responseMs: input.responseMs,
      rubricVersion: input.rubricVersion ?? '2026.08.18.4',
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

  if (payload.status === 'pending' || payload.status === 'processing') {
    return { status: payload.status, requestId: payload.requestId ?? input.requestId };
  }
  return {
    status: 'complete',
    requestId: payload.requestId ?? input.requestId,
    model: payload.model ?? 'server-configured',
    result: evaluationSchema.parse(payload.result)
  };
}

export async function getEvaluationStatus(requestId: string): Promise<EvaluationResponse | { status: 'failed'; requestId: string; errorMessage?: string }> {
  const endpoint = import.meta.env.VITE_AI_API_URL || '/api/evaluate';
  const authorization = await authHeaders();
  const response = await fetch(`${endpoint}?requestId=${encodeURIComponent(requestId)}`, { headers: authorization });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof payload?.message === 'string' ? payload.message : '读取点评结果失败');
  if (payload.status === 'complete') {
    return {
      status: 'complete',
      requestId,
      model: payload.model ?? 'server-configured',
      result: evaluationSchema.parse(payload.result)
    };
  }
  if (payload.status === 'failed') return { status: 'failed', requestId, errorMessage: payload.errorMessage };
  return { status: payload.status === 'processing' ? 'processing' : 'pending', requestId };
}
