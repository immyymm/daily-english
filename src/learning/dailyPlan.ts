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
  const batches = Array.from({ length: Math.ceil(cards.length / DAILY_WORD_COUNT) }, (_, index) => (
    cards.slice(index * DAILY_WORD_COUNT, index * DAILY_WORD_COUNT + DAILY_WORD_COUNT).map((card) => card.id)
  )).filter((cardIds) => cardIds.length > 0);
  const learnedCardIds = new Set(progress.map((item) => item.cardId));
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
    completedCardIds: cardIds.filter((cardId) => learnedCardIds.has(cardId)),
    contentVersion
  };
}
