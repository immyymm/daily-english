import type { EvaluationResult, TaskRequirements } from '../types';
import { checkTaskRequirements, deriveTaskRequirements, failedTaskRequirements, type TaskRequirementContext } from './taskRequirements';

export interface EvaluationConstraintContext {
  questionType?: string;
  prompt?: string;
  targetWord?: string;
}

export interface EvaluationFinalizationContext extends TaskRequirementContext {
  answer: string;
}

interface EvaluationTextResult {
  correctedAnswer?: string;
  naturalVersion?: string;
  naturalVersionReasonZh?: string;
}

function cleanExpression(value: string) {
  return value
    .trim()
    .replace(/^[\s“”"'.,!?;:，。！？；：]+|[\s“”"'.,!?;:，。！？；：]+$/g, '')
    .replace(/\s+/g, ' ');
}

function comparable(value: string) {
  return ` ${value.toLocaleLowerCase('en-US').replace(/[^a-z0-9']+/g, ' ').trim()} `;
}

export function includesRequiredExpression(text: string, expression: string) {
  const normalizedExpression = comparable(expression).trim();
  return Boolean(normalizedExpression) && comparable(text).includes(` ${normalizedExpression} `);
}

export function requiredExpressionsForEvaluation(context: EvaluationConstraintContext) {
  if (context.questionType === 'weekly_writing' || context.questionType === 'weekly_speaking') return [];

  const quotedExpressions = Array.from((context.prompt ?? '').matchAll(/[“"]([^”"]+)[”"]/g))
    .map((match) => cleanExpression(match[1]))
    .filter((value) => /[a-z]/i.test(value));
  const candidates = [...quotedExpressions, cleanExpression(context.targetWord ?? '')]
    .filter(Boolean)
    .filter((value, index, values) => values.findIndex((item) => item.toLocaleLowerCase('en-US') === value.toLocaleLowerCase('en-US')) === index);

  return candidates.filter((candidate) => !candidates.some((other) => (
    other !== candidate
    && other.split(/\s+/).length > candidate.split(/\s+/).length
    && includesRequiredExpression(other, candidate)
  )));
}

export function missingRequiredExpressions(text: string, requiredExpressions: string[]) {
  return requiredExpressions.filter((expression) => !includesRequiredExpression(text, expression));
}

export function normalizeEvaluationResultForHistory<T extends EvaluationTextResult>(
  result: T,
  context: EvaluationConstraintContext
): T & { correctedAnswer: string; naturalVersion: string; naturalVersionReasonZh: string } {
  const requiredExpressions = requiredExpressionsForEvaluation(context);
  const correctedAnswer = result.correctedAnswer ?? '';
  const originalNaturalVersion = result.naturalVersion ?? '';
  const missingFromCorrected = missingRequiredExpressions(correctedAnswer, requiredExpressions);
  const missingFromNatural = missingRequiredExpressions(originalNaturalVersion, requiredExpressions);
  const canUseCorrectedAnswer = missingFromNatural.length > 0 && missingFromCorrected.length === 0;
  const naturalVersion = canUseCorrectedAnswer ? correctedAnswer : originalNaturalVersion;
  const requiredLabel = requiredExpressions.map((item) => `“${item}”`).join('、');
  let naturalVersionReasonZh = result.naturalVersionReasonZh?.trim() ?? '';

  if (canUseCorrectedAnswer) {
    naturalVersionReasonZh = `原自然表达遗漏了题目要求的${requiredLabel}，因此已改为保留指定表达的修正句；修正后的句子本身已经自然，无需为了改写而偏离题意。`;
  } else if (!naturalVersionReasonZh) {
    const unchanged = comparable(naturalVersion) === comparable(correctedAnswer);
    naturalVersionReasonZh = unchanged
      ? '修正后的句子已经自然且符合题目要求，因此自然表达保留原句；两者没有需要进一步优化的差别。'
      : requiredExpressions.length
        ? `相比修正表达，这个版本使用了更常见的日常措辞或语序，同时完整保留了题目要求的${requiredLabel}。`
        : '相比修正表达，这个版本使用了更常见的日常措辞或语序，因此读起来更自然。';
  }

  return { ...result, correctedAnswer, naturalVersion, naturalVersionReasonZh };
}

function sameText(left: string, right: string) {
  return comparable(left) === comparable(right);
}

export function generatedEvaluationViolations(
  result: Pick<EvaluationResult, 'correctedAnswer' | 'naturalVersion' | 'naturalChanges'>,
  context: EvaluationFinalizationContext
) {
  const requirements = deriveTaskRequirements(context);
  const correctedFailures = failedTaskRequirements(result.correctedAnswer, requirements);
  const naturalFailures = failedTaskRequirements(result.naturalVersion, requirements);
  const invalidChanges = sameText(result.correctedAnswer, result.naturalVersion)
    ? result.naturalChanges.length > 0
    : result.naturalChanges.length === 0 || result.naturalChanges.some((change) => (
      !change.reasonZh.trim()
      || (change.from.trim() && !result.correctedAnswer.toLocaleLowerCase('en-US').includes(change.from.toLocaleLowerCase('en-US')))
      || (change.to.trim() && !result.naturalVersion.toLocaleLowerCase('en-US').includes(change.to.toLocaleLowerCase('en-US')))
    ));
  return { requirements, correctedFailures, naturalFailures, invalidChanges, valid: correctedFailures.length === 0 && naturalFailures.length === 0 && !invalidChanges };
}

function normalizedNaturalChanges(result: EvaluationResult) {
  if (sameText(result.correctedAnswer, result.naturalVersion)) return [];
  const valid = result.naturalChanges.filter((change) => (
    change.reasonZh.trim()
    && (!change.from.trim() || result.correctedAnswer.toLocaleLowerCase('en-US').includes(change.from.toLocaleLowerCase('en-US')))
    && (!change.to.trim() || result.naturalVersion.toLocaleLowerCase('en-US').includes(change.to.toLocaleLowerCase('en-US')))
  ));
  return valid.length ? valid : [{
    from: result.correctedAnswer,
    to: result.naturalVersion,
    reasonZh: result.naturalVersionReasonZh || '自然表达调整了措辞和语序，同时保留了原意与题目要求。'
  }];
}

export function calculateEvaluationOverallScore(result: Pick<EvaluationResult, 'dimensionScores' | 'taskCompletionScore'>) {
  return Math.max(0, Math.min(100, Math.round(
    result.dimensionScores.meaningContext
    + result.dimensionScores.activeRecall
    + result.dimensionScores.collocation
    + result.dimensionScores.grammar
    + result.dimensionScores.naturalness
    + result.taskCompletionScore
  )));
}

export function finalizeEvaluationResult(
  input: EvaluationResult,
  context: EvaluationFinalizationContext,
  requirements: TaskRequirements = deriveTaskRequirements(context)
): EvaluationResult {
  const checks = checkTaskRequirements(context.answer, requirements);
  const passedChecks = checks.filter((check) => check.passed).length;
  const deterministicTaskScore = checks.length ? Math.round(passedChecks / checks.length * 10) : 10;
  const taskCompletionScore = Math.min(input.taskCompletionScore, deterministicTaskScore);
  const explicitPassed = checks.every((check) => check.passed);
  const taskPassed = explicitPassed && input.taskCompliance.passed;
  const failedEvidence = checks.filter((check) => !check.passed).map((check) => check.evidenceZh);
  const naturalChanges = normalizedNaturalChanges(input);
  const naturalVersionReasonZh = sameText(input.correctedAnswer, input.naturalVersion)
    ? '修正后的句子已经自然、清楚并符合题目要求，因此无需为了改写而另造一个版本。'
    : naturalChanges.map((change) => change.reasonZh).join('；');
  const errorTypes = [...new Set([...input.errorTypes, ...(!taskPassed ? ['任务要求' as const] : [])])];
  const overallScore = calculateEvaluationOverallScore({ ...input, taskCompletionScore });

  return {
    ...input,
    overallScore,
    taskCompletionScore,
    taskCompliance: {
      passed: taskPassed,
      summaryZh: failedEvidence.length ? failedEvidence.join('；') : input.taskCompliance.summaryZh,
      checks
    },
    errorTypes,
    naturalChanges,
    naturalVersionReasonZh,
    needsRetry: input.needsRetry || !taskPassed || overallScore < 75
  };
}
