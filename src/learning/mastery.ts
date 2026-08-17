import type {
  Attempt,
  EvaluationResult,
  MasteryDimension,
  MasteryDimensionScores,
  QuestionType
} from '../types';

export const masteryDimensionLabels: Record<MasteryDimension, string> = {
  meaningContext: '词义与语境',
  activeRecall: '主动回忆',
  collocation: '搭配运用',
  grammar: '语法准确',
  naturalness: '表达自然度'
};

export const masteryDimensions = Object.keys(masteryDimensionLabels) as MasteryDimension[];

const objectiveDimension: Partial<Record<QuestionType, MasteryDimension>> = {
  meaning_choice: 'meaningContext',
  recall: 'activeRecall',
  collocation: 'collocation'
};

export function dimensionForQuestionType(type: QuestionType) {
  return objectiveDimension[type];
}

function toPercent(value: number, max: number) {
  return Math.max(0, Math.min(100, Math.round(value / max * 100)));
}

export function dimensionsFromEvaluation(result: EvaluationResult): MasteryDimensionScores {
  return {
    meaningContext: toPercent(result.dimensionScores.meaningContext, 25),
    activeRecall: toPercent(result.dimensionScores.activeRecall, 20),
    collocation: toPercent(result.dimensionScores.collocation, 20),
    grammar: toPercent(result.dimensionScores.grammar, 15),
    naturalness: toPercent(result.dimensionScores.naturalness, 10)
  };
}

export function dimensionsForAttempt(attempt: Attempt): Partial<MasteryDimensionScores> {
  if (attempt.dimensionScores && Object.keys(attempt.dimensionScores).length) return attempt.dimensionScores;
  const dimension = dimensionForQuestionType(attempt.questionType);
  return dimension ? { [dimension]: attempt.score } : {};
}

export interface MasteryProfile {
  masteryScore: number;
  dimensionScores: Partial<MasteryDimensionScores>;
  weakDimensions: MasteryDimension[];
  errorCounts: Record<string, number>;
  attemptCount: number;
}

function recentAverage(values: number[]) {
  const recent = values.slice(-12);
  if (!recent.length) return undefined;
  const weighted = recent.reduce((sum, value, index) => sum + value * (1 + index * 0.12), 0);
  const weights = recent.reduce((sum, _value, index) => sum + 1 + index * 0.12, 0);
  return Math.round(weighted / weights);
}

export function calculateMasteryProfile(attempts: Attempt[]): MasteryProfile {
  const sorted = [...attempts].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const buckets = Object.fromEntries(masteryDimensions.map((dimension) => [dimension, [] as number[]])) as Record<MasteryDimension, number[]>;
  const errorCounts: Record<string, number> = {};

  for (const attempt of sorted) {
    const scores = dimensionsForAttempt(attempt);
    masteryDimensions.forEach((dimension) => {
      const value = scores[dimension];
      if (typeof value === 'number') buckets[dimension].push(value);
    });
    attempt.errorTypes.forEach((error) => {
      errorCounts[error] = (errorCounts[error] ?? 0) + 1;
    });
  }

  const dimensionScores: Partial<MasteryDimensionScores> = {};
  masteryDimensions.forEach((dimension) => {
    const average = recentAverage(buckets[dimension]);
    if (average !== undefined) dimensionScores[dimension] = average;
  });
  const measured = Object.values(dimensionScores).filter((value): value is number => typeof value === 'number');
  const recentScores = sorted.slice(-20).map((attempt) => attempt.score);
  const questionAverage = recentAverage(recentScores) ?? 0;
  const dimensionAverage = measured.length ? measured.reduce((sum, value) => sum + value, 0) / measured.length : questionAverage;
  const masteryScore = Math.round(dimensionAverage * 0.75 + questionAverage * 0.25);

  return {
    masteryScore,
    dimensionScores,
    weakDimensions: masteryDimensions.filter((dimension) => {
      const value = dimensionScores[dimension];
      return typeof value === 'number' && value < 75;
    }),
    errorCounts,
    attemptCount: sorted.length
  };
}
