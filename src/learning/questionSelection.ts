import type { CardQuestion, ReviewStage, WordCard } from '../types';

const SESSION_SIZE = 5;

function stableHash(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function rotate<T>(items: T[], offset: number): T[] {
  if (items.length < 2) return items;
  const start = offset % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

export function selectReviewQuestions(card: WordCard, stage: ReviewStage): CardQuestion[] {
  const allowedTypes = card.reviewStages[stage];
  const seed = stableHash(card.id + '-' + stage);
  const selected: CardQuestion[] = [];
  const selectedIds = new Set<string>();
  const orderedTypes = rotate(allowedTypes, seed);

  orderedTypes.forEach((type, index) => {
    const candidates = card.questions.filter((question) => question.type === type);
    const first = rotate(candidates, seed + index * 7)[0];
    if (first && !selectedIds.has(first.id)) {
      selected.push(first);
      selectedIds.add(first.id);
    }
  });

  const remaining = rotate(
    card.questions.filter((question) => allowedTypes.includes(question.type)),
    seed + stage.charCodeAt(1)
  );
  for (const question of remaining) {
    if (selected.length >= SESSION_SIZE) break;
    if (!selectedIds.has(question.id)) {
      selected.push(question);
      selectedIds.add(question.id);
    }
  }

  return selected.slice(0, SESSION_SIZE).map((question, index) => ({
    ...question,
    id: `${question.id}-${stage}-${index}`,
    stage
  }));
}
