import type { CardProgress, CardQuestion, MasteryDimension, QuestionType, ReviewStage, WordCard } from '../types';

const stageSessionSize: Record<ReviewStage, number> = {
  T0: 8,
  T1: 8,
  T2: 10,
  T3: 10,
  T4: 12,
  T5: 12,
  T6: 12,
  T7: 12
};

const weaknessQuestionTypes: Record<MasteryDimension, QuestionType[]> = {
  meaningContext: ['meaning_choice', 'recall'],
  activeRecall: ['recall', 'free_sentence'],
  collocation: ['collocation', 'free_sentence', 'dialogue'],
  grammar: ['free_sentence', 'dialogue'],
  naturalness: ['dialogue', 'free_sentence']
};

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

export function selectReviewQuestions(card: WordCard, progress: Pick<CardProgress, 'stage' | 'weak' | 'weakDimensions' | 'targetQuestionCount'>): CardQuestion[] {
  const stage = progress.stage;
  const allowedTypes = card.reviewStages[stage];
  const seed = stableHash(card.id + '-' + stage);
  const selected: CardQuestion[] = [];
  const selectedIds = new Set<string>();
  const weaknessTypes = (progress.weakDimensions ?? [])
    .flatMap((dimension) => weaknessQuestionTypes[dimension])
    .filter((type) => allowedTypes.includes(type));
  const orderedTypes = [...new Set([...weaknessTypes, ...rotate(allowedTypes, seed)])];
  const baseSize = stageSessionSize[stage];
  const targetSize = Math.min(
    card.questions.filter((question) => allowedTypes.includes(question.type)).length,
    Math.max(baseSize, progress.targetQuestionCount ?? 0, progress.weak ? baseSize + 2 : baseSize)
  );

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
    if (selected.length >= targetSize) break;
    if (!selectedIds.has(question.id)) {
      selected.push(question);
      selectedIds.add(question.id);
    }
  }

  return selected.slice(0, targetSize).map((question, index) => ({
    ...question,
    id: `${question.id}-${stage}-${index}`,
    stage
  }));
}
