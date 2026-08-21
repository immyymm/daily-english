import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadContent } from '../data/content';
import { resolveDailyLearningPlan } from '../learning/dailyPlan';
import { calculateMasteryProfile, dimensionsFromEvaluation } from '../learning/mastery';
import { applyLateEvaluation, applyReviewScore, isPendingReview, toLocalDateKey } from '../learning/reviewEngine';
import { evaluationSchema } from '../schemas/evaluation';
import { finalizeEvaluationResult, normalizeEvaluationResultForHistory, sanitizeEvaluationResult } from '../schemas/evaluationConstraints';
import { notifyLocalDataChanged, notifyReviewProgressChanged } from './useCloudSync';
import { db, getSettings, sanitizeStoredReviewState, touchStudyStreak } from '../storage/db';
import type {
  AIEvaluation,
  AppSettings,
  Attempt,
  CardProgress,
  DailyPlanRecord,
  DailyRecommendation,
  EvaluationResult,
  ReviewSessionCardState,
  ReviewSessionProgress,
  WordCard
} from '../types';

const createId = () => typeof crypto.randomUUID === 'function'
  ? crypto.randomUUID()
  : Date.now().toString(36) + Math.random().toString(36).slice(2);

interface AppDataState {
  loading: boolean;
  error?: string;
  cards: WordCard[];
  settings?: AppSettings;
  todayPlan?: DailyPlanRecord;
  progress: CardProgress[];
  attempts: Attempt[];
  aiEvaluations: AIEvaluation[];
  dailyRecommendations: DailyRecommendation[];
}

const initialState: AppDataState = {
  loading: true,
  cards: [],
  progress: [],
  attempts: [],
  aiEvaluations: [],
  dailyRecommendations: []
};

export function useAppData() {
  const [state, setState] = useState<AppDataState>(initialState);

  const refresh = useCallback(async () => {
    try {
      const [content, settings, progress, attempts, aiEvaluations] = await Promise.all([
        loadContent(),
        getSettings(),
        db.progress.toArray(),
        db.attempts.orderBy('createdAt').reverse().toArray(),
        db.aiEvaluations.orderBy('createdAt').reverse().toArray()
      ]);
      const today = toLocalDateKey();
      await sanitizeStoredReviewState(progress, today);
      const sanitizedDailyRecommendations = await db.dailyRecommendations.orderBy('generatedAt').reverse().toArray();
      const currentRecommendation = sanitizedDailyRecommendations.find((item) => item.date === today);
      const cardWords = new Map(content.cards.map((card) => [card.id, card.word]));
      const normalizedEvaluations = aiEvaluations.map((evaluation) => {
        if (!evaluation.result) return evaluation;
        const parsed = evaluationSchema.safeParse(evaluation.result);
        if (!parsed.success) return evaluation;
        const normalizedText = normalizeEvaluationResultForHistory(parsed.data, {
          questionType: evaluation.questionType,
          prompt: evaluation.prompt ?? '',
          targetWord: cardWords.get(evaluation.cardId)
        });
        const result = evaluation.questionType === 'weekly_writing' || evaluation.questionType === 'weekly_speaking'
          ? sanitizeEvaluationResult(normalizedText)
          : finalizeEvaluationResult(normalizedText, {
            questionType: evaluation.questionType,
            prompt: evaluation.prompt ?? '',
            targetWord: cardWords.get(evaluation.cardId) ?? '',
            answer: evaluation.answer
          });
        const changed = JSON.stringify(result) !== JSON.stringify(evaluation.result);
        return changed ? { ...evaluation, result } : evaluation;
      });
      const repairedEvaluations = normalizedEvaluations.filter((evaluation, index) => evaluation !== aiEvaluations[index]);
      if (repairedEvaluations.length) {
        await db.aiEvaluations.bulkPut(repairedEvaluations);
        notifyLocalDataChanged();
      }
      let todayPlan = await db.dailyPlans.get(today);
      const resolvedPlan = resolveDailyLearningPlan({
        cards: content.cards,
        progress,
        existingPlan: todayPlan,
        date: today,
        contentVersion: content.contentVersion
      });
      if (!todayPlan || JSON.stringify(todayPlan) !== JSON.stringify(resolvedPlan)) {
        todayPlan = resolvedPlan;
        await db.dailyPlans.put(todayPlan);
      }
      setState({ loading: false, cards: content.cards, settings, todayPlan, progress, attempts, aiEvaluations: normalizedEvaluations, dailyRecommendations: sanitizedDailyRecommendations });
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error instanceof Error ? error.message : '应用加载失败'
      }));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const todayRecommendation = state.dailyRecommendations.find((item) => item.date === toLocalDateKey());

  const prescribedProgress = useMemo(() => state.progress.map((item) => {
    const prescription = todayRecommendation?.cardPrescriptions?.[item.cardId];
    if (!prescription) return item;
    return {
      ...item,
      targetQuestionCount: Math.max(item.targetQuestionCount ?? 0, prescription.targetQuestionCount),
      weakDimensions: [...new Set([...(item.weakDimensions ?? []), ...prescription.focusDimensions])]
    };
  }), [state.progress, todayRecommendation]);

  const progressMap = useMemo(
    () => new Map(prescribedProgress.map((item) => [item.cardId, item])),
    [prescribedProgress]
  );

  const todayCards = useMemo(() => {
    if (!state.todayPlan) return [];
    const cardMap = new Map(state.cards.map((card) => [card.id, card]));
    return state.todayPlan.cardIds.map((id) => cardMap.get(id)).filter(Boolean) as WordCard[];
  }, [state.cards, state.todayPlan]);

  const dueProgress = useMemo(
    () => prescribedProgress.filter((item) => {
      const plannedIds = todayRecommendation?.reviewCardIds ?? todayRecommendation?.recommendedCardIds ?? [];
      const planned = plannedIds.includes(item.cardId);
      return isPendingReview(item, planned, todayRecommendation?.refreshAnchorAt);
    }).sort((a, b) => {
      const plannedIds = todayRecommendation?.reviewCardIds ?? todayRecommendation?.recommendedCardIds ?? [];
      const aPriority = plannedIds.indexOf(a.cardId);
      const bPriority = plannedIds.indexOf(b.cardId);
      if (aPriority >= 0 || bPriority >= 0) {
        if (aPriority < 0) return 1;
        if (bPriority < 0) return -1;
        if (aPriority !== bPriority) return aPriority - bPriority;
      }
      if (a.weak !== b.weak) return a.weak ? -1 : 1;
      return new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime();
    }),
    [prescribedProgress, todayRecommendation]
  );

  const learnedTodayCount = state.todayPlan?.completedCardIds.filter((id) => state.todayPlan?.cardIds.includes(id)).length ?? 0;

  const learnCard = useCallback(async (card: WordCard) => {
    const now = new Date();
    const existing = await db.progress.get(card.id);
    if (!existing) {
      await db.progress.put({
        cardId: card.id,
        learnedAt: now.toISOString(),
        stage: 'T0',
        nextReviewAt: now.toISOString(),
        status: '学习中',
        correctStreak: 0,
        wrongCount: 0,
        unstableCount: 0,
        weak: false,
        passedT7: false,
        passedT30: false,
        passedT60: false
      });
    }
    if (state.todayPlan && !state.todayPlan.completedCardIds.includes(card.id)) {
      await db.dailyPlans.put({
        ...state.todayPlan,
        completedCardIds: [...state.todayPlan.completedCardIds, card.id]
      });
    }
    if (state.settings) await touchStudyStreak(state.settings);
    notifyLocalDataChanged();
    await refresh();
  }, [refresh, state.settings, state.todayPlan]);

  const recordAttempt = useCallback(async (attempt: Attempt) => {
    await db.attempts.put(attempt);
    const progress = await db.progress.get(attempt.cardId);
    if (progress) {
      const profile = calculateMasteryProfile(await db.attempts.where('cardId').equals(attempt.cardId).toArray());
      await db.progress.put({
        ...applyReviewScore({ ...progress, ...profile }, attempt.score, new Date(attempt.createdAt)),
        ...profile
      });
    }
    if (state.settings) await touchStudyStreak(state.settings);
    notifyLocalDataChanged();
    await refresh();
  }, [refresh, state.settings]);

  const saveSessionAttempt = useCallback(async (attempt: Attempt) => {
    await db.transaction('rw', db.attempts, db.progress, async () => {
      await db.attempts.put(attempt);
      const progress = await db.progress.get(attempt.cardId);
      if (!progress) return;
      const profile = calculateMasteryProfile(await db.attempts.where('cardId').equals(attempt.cardId).toArray());
      await db.progress.put({
        ...progress,
        ...profile,
        weak: progress.weak || profile.weakDimensions.length > 0,
        status: progress.weak || profile.weakDimensions.length > 0 ? '薄弱词' : progress.status,
        targetQuestionCount: progress.weak || profile.weakDimensions.length > 0 ? 12 : Math.max(progress.targetQuestionCount ?? 0, 8),
        lastAnalyzedAt: new Date().toISOString()
      });
    });
    notifyLocalDataChanged();
    await refresh();
  }, [refresh]);

  const recordReviewSession = useCallback(async (
    cardId: string,
    attempts: Attempt[],
    evaluations: AIEvaluation[]
  ) => {
    await db.transaction('rw', db.attempts, db.aiEvaluations, db.progress, async () => {
      if (attempts.length) await db.attempts.bulkPut(attempts);
      if (evaluations.length) await db.aiEvaluations.bulkPut(evaluations);
      const progress = await db.progress.get(cardId);
      if (progress && attempts.length) {
        const average = Math.round(attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length);
        const profile = calculateMasteryProfile(await db.attempts.where('cardId').equals(cardId).toArray());
        await db.progress.put({ ...applyReviewScore({ ...progress, ...profile }, average, new Date()), ...profile });
      }
    });
    if (state.settings) await touchStudyStreak(state.settings);
    notifyLocalDataChanged();
    await refresh();
  }, [refresh, state.settings]);

  const beginReviewSession = useCallback(async (dueCardIds: string[]) => {
    const date = toLocalDateKey();
    const uniqueDueCardIds = [...new Set(dueCardIds)];
    const dueSet = new Set(uniqueDueCardIds);
    const todaySessions = await db.reviewSessions.where('date').equals(date).toArray();
    const activeSessions = todaySessions
      .filter((session) => session.status === 'active')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    const active = activeSessions[0];
    const now = new Date().toISOString();

    if (activeSessions.length > 1) {
      const obsoleteSessions = activeSessions.slice(1).map((session): ReviewSessionProgress => ({
        ...session,
        status: 'completed',
        queueCardIds: [],
        currentCardId: undefined,
        questionIds: [],
        questionIndex: 0,
        answer: '',
        feedback: undefined,
        attempts: [],
        updatedAt: now
      }));
      await db.reviewSessions.bulkPut(obsoleteSessions);
      obsoleteSessions.forEach((session) => notifyReviewProgressChanged(session.id));
    }

    if (active) {
      const remaining = active.queueCardIds.filter((cardId) => dueSet.has(cardId));
      if (remaining.length) {
        const currentCardId = remaining.includes(active.currentCardId ?? '')
          ? active.currentCardId
          : remaining[0];
        const resumed: ReviewSessionProgress = currentCardId === active.currentCardId
          ? { ...active, queueCardIds: remaining, updatedAt: now }
          : {
            ...active,
            queueCardIds: remaining,
            currentCardId,
            stage: undefined,
            questionIds: [],
            questionIndex: 0,
            answer: '',
            feedback: undefined,
            attempts: [],
            shownAt: now,
            speechLatency: undefined,
            attemptSessionId: createId(),
            updatedAt: now
          };
        await db.reviewSessions.put(resumed);
        notifyReviewProgressChanged(resumed.id);
        return { session: resumed, resumed: true };
      }
      const completed: ReviewSessionProgress = {
        ...active,
        status: 'completed',
        queueCardIds: [],
        currentCardId: undefined,
        questionIds: [],
        questionIndex: 0,
        answer: '',
        feedback: undefined,
        attempts: [],
        updatedAt: now
      };
      await db.reviewSessions.put(completed);
      notifyReviewProgressChanged(completed.id);
    }

    const session: ReviewSessionProgress = {
      id: `${date}-${createId()}`,
      date,
      status: 'active',
      initialCardIds: uniqueDueCardIds,
      queueCardIds: uniqueDueCardIds,
      batchTotal: uniqueDueCardIds.length,
      currentCardId: uniqueDueCardIds[0],
      questionIds: [],
      questionIndex: 0,
      answer: '',
      attempts: [],
      shownAt: now,
      attemptSessionId: createId(),
      createdAt: now,
      updatedAt: now
    };
    await db.reviewSessions.put(session);
    notifyReviewProgressChanged(session.id);
    return { session, resumed: false };
  }, []);

  const saveReviewSessionProgress = useCallback(async (
    sessionId: string,
    cardId: string,
    cardState: ReviewSessionCardState
  ) => {
    let saved: ReviewSessionProgress | undefined;
    await db.transaction('rw', db.reviewSessions, async () => {
      const current = await db.reviewSessions.get(sessionId);
      if (!current || current.status !== 'active' || current.currentCardId !== cardId) return;
      saved = { ...current, ...cardState, updatedAt: new Date().toISOString() };
      await db.reviewSessions.put(saved);
    });
    if (saved) notifyReviewProgressChanged(sessionId);
  }, []);

  const advanceReviewSession = useCallback(async (
    sessionId: string,
    completedCardId: string,
    remainingCardIds: string[]
  ) => {
    const current = await db.reviewSessions.get(sessionId);
    if (!current || current.status !== 'active' || current.currentCardId !== completedCardId) return current;
    const now = new Date().toISOString();
    const next: ReviewSessionProgress = remainingCardIds.length
      ? {
        ...current,
        queueCardIds: remainingCardIds,
        currentCardId: remainingCardIds[0],
        stage: undefined,
        questionIds: [],
        questionIndex: 0,
        answer: '',
        feedback: undefined,
        attempts: [],
        shownAt: now,
        speechLatency: undefined,
        attemptSessionId: createId(),
        updatedAt: now
      }
      : {
        ...current,
        status: 'completed',
        queueCardIds: [],
        currentCardId: undefined,
        stage: undefined,
        questionIds: [],
        questionIndex: 0,
        answer: '',
        feedback: undefined,
        attempts: [],
        shownAt: now,
        speechLatency: undefined,
        updatedAt: now
      };
    await db.reviewSessions.put(next);
    notifyReviewProgressChanged(next.id);
    return next;
  }, []);

  const recordWeeklyResult = useCallback(async (attempt: Attempt, evaluation: AIEvaluation) => {
    await db.transaction('rw', db.attempts, db.aiEvaluations, async () => {
      await db.attempts.put(attempt);
      await db.aiEvaluations.put(evaluation);
    });
    notifyLocalDataChanged();
    await refresh();
  }, [refresh]);

  const updateSettings = useCallback(async (patch: Partial<AppSettings>) => {
    const settings = state.settings ?? await getSettings();
    await db.settings.put({ ...settings, ...patch, id: 'settings' });
    notifyLocalDataChanged();
    await refresh();
  }, [refresh, state.settings]);

  const saveAIEvaluation = useCallback(async (evaluation: AIEvaluation) => {
    await db.aiEvaluations.put(evaluation);
    notifyLocalDataChanged();
    await refresh();
  }, [refresh]);

  const completeAIAttempt = useCallback(async (
    evaluation: AIEvaluation,
    result: EvaluationResult,
    model: string,
    attempt: Omit<Attempt, 'score' | 'correct' | 'errorTypes' | 'ai'>
  ) => {
    const completed: AIEvaluation = { ...evaluation, status: 'complete', result, model, updatedAt: new Date().toISOString(), errorMessage: undefined };
    await db.transaction('rw', db.aiEvaluations, db.attempts, db.progress, async () => {
      await db.aiEvaluations.put(completed);
      const finalAttempt: Attempt = {
        ...attempt,
        score: result.overallScore,
        correct: result.overallScore >= 75 && !result.needsRetry,
        errorTypes: result.errorTypes,
        ai: true,
        dimensionScores: dimensionsFromEvaluation(result),
        scheduleImpact: false
      };
      await db.attempts.put(finalAttempt);
      const progress = await db.progress.get(attempt.cardId);
      if (progress) {
        const profile = calculateMasteryProfile(await db.attempts.where('cardId').equals(attempt.cardId).toArray());
        await db.progress.put({
          ...applyLateEvaluation({ ...progress, ...profile }, result.overallScore, new Date(attempt.createdAt)),
          ...profile
        });
      }
    });
    notifyLocalDataChanged();
    await refresh();
  }, [refresh]);

  return {
    ...state,
    progressMap,
    todayCards,
    dueProgress,
    todayRecommendation,
    learnedTodayCount,
    learnCard,
    recordAttempt,
    saveSessionAttempt,
    recordReviewSession,
    beginReviewSession,
    saveReviewSessionProgress,
    advanceReviewSession,
    recordWeeklyResult,
    updateSettings,
    saveAIEvaluation,
    completeAIAttempt,
    refresh
  };
}
