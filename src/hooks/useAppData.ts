import { useCallback, useEffect, useMemo, useState } from 'react';
import { cardsForStudyDay, loadContent } from '../data/content';
import { calculateMasteryProfile, dimensionsFromEvaluation } from '../learning/mastery';
import { applyLateEvaluation, applyReviewScore, isDue, studyDaySince, toLocalDateKey } from '../learning/reviewEngine';
import { notifyLocalDataChanged } from './useCloudSync';
import { db, getSettings, touchStudyStreak } from '../storage/db';
import type {
  AIEvaluation,
  AppSettings,
  Attempt,
  CardProgress,
  DailyPlanRecord,
  DailyRecommendation,
  EvaluationResult,
  WordCard
} from '../types';

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
      const [content, settings, progress, attempts, aiEvaluations, dailyRecommendations] = await Promise.all([
        loadContent(),
        getSettings(),
        db.progress.toArray(),
        db.attempts.orderBy('createdAt').reverse().toArray(),
        db.aiEvaluations.orderBy('createdAt').reverse().toArray(),
        db.dailyRecommendations.orderBy('generatedAt').reverse().toArray()
      ]);
      const today = toLocalDateKey();
      const studyDay = studyDaySince(settings.firstUseDate);
      const dailyCards = cardsForStudyDay(content.cards, studyDay);
      const currentRecommendation = dailyRecommendations.find((item) => item.date === today);
      const knownCardIds = new Set(content.cards.map((card) => card.id));
      const databaseCardIds = (currentRecommendation?.newCardIds ?? []).filter((id) => knownCardIds.has(id));
      const selectedCardIds = databaseCardIds.length === 5
        ? databaseCardIds
        : dailyCards.map((card) => card.id);
      let todayPlan = await db.dailyPlans.get(today);
      if (!todayPlan) {
        todayPlan = {
          date: today,
          studyDay: currentRecommendation?.studyDay ?? studyDay,
          cycle: Math.floor(((currentRecommendation?.studyDay ?? studyDay) - 1) / 30) + 1,
          cardIds: selectedCardIds,
          completedCardIds: [],
          contentVersion: content.contentVersion
        };
        await db.dailyPlans.put(todayPlan);
      } else if (databaseCardIds.length === 5 && databaseCardIds.join('|') !== todayPlan.cardIds.join('|')) {
        todayPlan = {
          ...todayPlan,
          studyDay: currentRecommendation?.studyDay ?? todayPlan.studyDay,
          cycle: Math.floor(((currentRecommendation?.studyDay ?? todayPlan.studyDay) - 1) / 30) + 1,
          cardIds: databaseCardIds,
          completedCardIds: todayPlan.completedCardIds.filter((id) => databaseCardIds.includes(id))
        };
        await db.dailyPlans.put(todayPlan);
      }
      setState({ loading: false, cards: content.cards, settings, todayPlan, progress, attempts, aiEvaluations, dailyRecommendations });
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
      return planned || isDue(item);
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
        correct: result.overallScore >= 75,
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
    recordWeeklyResult,
    updateSettings,
    saveAIEvaluation,
    completeAIAttempt,
    refresh
  };
}
