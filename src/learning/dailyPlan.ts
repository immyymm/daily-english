import type { CardProgress, DailyPlanRecord, WordCard } from '../types';

const DAILY_WORD_COUNT = 5;

function sameCardIds(left: string[], right: string[]) {
  return left.length === right.length && left.every((cardId, index) => cardId === right[index]);
}

export function resolveDailyLearningPlan({
  cards,
  progress,
  existingPlan,
  date,
  contentVersion
}: {
  cards: WordCard[];
  progress: CardProgress[];
  existingPlan?: DailyPlanRecord;
  date: string;
  contentVersion: string;
}): DailyPlanRecord {
  const knownCardIds = new Set(cards.map((card) => card.id));
  const existingCardIdsAreValid = Boolean(existingPlan?.cardIds.length)
    && existingPlan!.cardIds.every((cardId) => knownCardIds.has(cardId));
  const learnedCardIds = new Set(progress.map((item) => item.cardId));

  // A content-only deployment must never replace the five words already shown
  // for the current day. The card bodies are looked up by id and therefore can
  // still receive corrections without mutating the user's saved plan.
  if (existingPlan && existingCardIdsAreValid && existingPlan.contentVersion !== contentVersion) {
    return {
      ...existingPlan,
      completedCardIds: existingPlan.cardIds.filter((cardId) => (
        existingPlan.completedCardIds.includes(cardId) || learnedCardIds.has(cardId)
      ))
    };
  }

  const batches = Array.from({ length: Math.ceil(cards.length / DAILY_WORD_COUNT) }, (_, index) => (
    cards.slice(index * DAILY_WORD_COUNT, index * DAILY_WORD_COUNT + DAILY_WORD_COUNT).map((card) => card.id)
  )).filter((cardIds) => cardIds.length > 0);
  const firstIncompleteIndex = batches.findIndex((cardIds) => cardIds.some((cardId) => !learnedCardIds.has(cardId)));
  const existingBatchIndex = existingPlan
    ? batches.findIndex((cardIds) => sameCardIds(cardIds, existingPlan.cardIds))
    : -1;
  const existingBatchCompleted = existingBatchIndex >= 0
    && batches[existingBatchIndex].every((cardId) => learnedCardIds.has(cardId));

  // Once today's five-word batch is complete, keep it visible until the next
  // local day. Otherwise always return the earliest unfinished batch, so a
  // missed or partially learned day can never be skipped by the calendar.
  const selectedIndex = existingBatchCompleted
    && (firstIncompleteIndex < 0 || existingBatchIndex < firstIncompleteIndex)
    ? existingBatchIndex
    : firstIncompleteIndex >= 0 ? firstIncompleteIndex : Math.max(0, batches.length - 1);
  const cardIds = batches[selectedIndex] ?? [];

  return {
    date,
    studyDay: selectedIndex + 1,
    cycle: Math.floor(selectedIndex / 30) + 1,
    cardIds,
    completedCardIds: cardIds.filter((cardId) => (
      learnedCardIds.has(cardId) || existingPlan?.completedCardIds.includes(cardId)
    )),
    contentVersion
  };
}
