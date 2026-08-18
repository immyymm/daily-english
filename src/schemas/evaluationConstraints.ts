import type { EvaluationResult, NaturalExpressionChange, TaskRequirements } from '../types.js';
import { checkTaskRequirements, deriveTaskRequirements, failedTaskRequirements, type TaskRequirementContext } from './taskRequirements.js';

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
  naturalChanges?: NaturalExpressionChange[];
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

function sameText(left: string, right: string) {
  return comparable(left) === comparable(right);
}

function isSpecificNaturalReason(reason: string) {
  const normalized = reason.replace(/\s+/g, ' ').trim();
  if (normalized.length < 18) return false;
  return /(搭配|语序|语气|指代|时态|介词|修饰|范围|对象|语境|词性|主语|宾语|口语|书面|礼貌|委婉|强调|具体|明确|准确|简洁|衔接|习惯|常用|歧义|重复|含义|比较|动作|状态)/.test(normalized);
}

function expressionWordCount(value: string) {
  return comparable(value).trim().split(/\s+/).filter(Boolean).length;
}

function hasDetailedNaturalExplanation(change: NaturalExpressionChange) {
  return change.sourceIssueZh.trim().length >= 18
    && change.replacementReasonZh.trim().length >= 18
    && isSpecificNaturalReason(`${change.sourceIssueZh} ${change.replacementReasonZh}`);
}

function isGranularNaturalChange(
  change: NaturalExpressionChange,
  correctedAnswer: string,
  naturalVersion: string
) {
  const from = change.from.trim();
  const to = change.to.trim();
  if (!from || !to || sameText(from, to)) return false;
  if (sameText(from, correctedAnswer) || sameText(to, naturalVersion)) return false;
  return expressionWordCount(from) <= 8 && expressionWordCount(to) <= 8;
}

function replaceOnceCaseInsensitive(source: string, from: string, to: string) {
  const index = source.toLocaleLowerCase('en-US').indexOf(from.toLocaleLowerCase('en-US'));
  if (index < 0) return undefined;
  return source.slice(0, index) + to + source.slice(index + from.length);
}

function transformedNaturalVersion(correctedAnswer: string, changes: NaturalExpressionChange[]) {
  let transformed = correctedAnswer;
  for (const change of changes) {
    const from = change.from.trim();
    const to = change.to.trim();
    if (!from || !to || sameText(from, to)) return undefined;
    const next = replaceOnceCaseInsensitive(transformed, from, to);
    if (next === undefined) return undefined;
    transformed = next;
  }
  return transformed;
}

function clearNaturalReason(change: NaturalExpressionChange) {
  const reason = change.reasonZh.replace(/\s+/g, ' ').trim();
  if (isSpecificNaturalReason(reason)) return reason;
  const combined = `${change.sourceIssueZh ?? ''} ${change.replacementReasonZh ?? ''}`.replace(/\s+/g, ' ').trim();
  return isSpecificNaturalReason(combined) ? combined : '';
}

function normalizedChangeDetails(change: NaturalExpressionChange): NaturalExpressionChange {
  const from = change.from.trim();
  const to = change.to.trim();
  const legacyReason = clearNaturalReason(change);
  const sourceIssueZh = change.sourceIssueZh?.trim()
    || (legacyReason
      ? `旧版点评只保存了合并说明，未单独记录“${from}”在原句中的具体问题。`
      : '旧版点评没有保存这一处原表达的具体问题。');
  const replacementReasonZh = change.replacementReasonZh?.trim()
    || legacyReason
    || `旧版点评没有保存为什么要改成“${to}”的具体语言依据。`;
  return {
    from,
    to,
    sourceIssueZh,
    replacementReasonZh,
    reasonZh: legacyReason || `${sourceIssueZh} ${replacementReasonZh}`
  };
}

function explicitNaturalSummary(changes: NaturalExpressionChange[]) {
  return changes
    .map((change) => `把“${change.from.trim()}”改为“${change.to.trim()}”。原表达的问题：${change.sourceIssueZh} 改后更合适的原因：${change.replacementReasonZh}`)
    .join('\n');
}

function normalizeChangeList(
  correctedAnswer: string,
  naturalVersion: string,
  changes: NaturalExpressionChange[] | undefined,
  fallbackReason = ''
) {
  if (sameText(correctedAnswer, naturalVersion)) return [];
  const candidates = (changes ?? []).map(normalizedChangeDetails);
  const transformed = transformedNaturalVersion(correctedAnswer, candidates);
  if (transformed
    && sameText(transformed, naturalVersion)
    && candidates.every((change) => isGranularNaturalChange(change, correctedAnswer, naturalVersion))) return candidates;
  void fallbackReason;
  return [];
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
): T & { correctedAnswer: string; naturalVersion: string; naturalVersionReasonZh: string; naturalChanges: NaturalExpressionChange[] } {
  const requiredExpressions = requiredExpressionsForEvaluation(context);
  const correctedAnswer = result.correctedAnswer ?? '';
  const originalNaturalVersion = result.naturalVersion ?? '';
  const missingFromCorrected = missingRequiredExpressions(correctedAnswer, requiredExpressions);
  const missingFromNatural = missingRequiredExpressions(originalNaturalVersion, requiredExpressions);
  const canUseCorrectedAnswer = missingFromNatural.length > 0 && missingFromCorrected.length === 0;
  const naturalVersion = canUseCorrectedAnswer ? correctedAnswer : originalNaturalVersion;
  const requiredLabel = requiredExpressions.map((item) => `“${item}”`).join('、');
  let naturalVersionReasonZh = result.naturalVersionReasonZh?.trim() ?? '';
  let naturalChanges = normalizeChangeList(correctedAnswer, naturalVersion, result.naturalChanges, naturalVersionReasonZh);

  if (canUseCorrectedAnswer) {
    naturalVersionReasonZh = `原自然表达遗漏了题目要求的${requiredLabel}，因此已改为保留指定表达的修正句；修正后的句子本身已经自然，无需为了改写而偏离题意。`;
    naturalChanges = [];
  } else if (!naturalVersionReasonZh) {
    const unchanged = comparable(naturalVersion) === comparable(correctedAnswer);
    naturalVersionReasonZh = unchanged
      ? '修正后的句子已经自然且符合题目要求，因此自然表达保留原句；两者没有需要进一步优化的差别。'
      : requiredExpressions.length
        ? `相比修正表达，这个版本使用了更常见的日常措辞或语序，同时完整保留了题目要求的${requiredLabel}。`
        : '相比修正表达，这个版本使用了更常见的日常措辞或语序，因此读起来更自然。';
  }

  if (naturalChanges.length > 0) {
    naturalVersionReasonZh = explicitNaturalSummary(naturalChanges);
  } else if (!sameText(correctedAnswer, naturalVersion)) {
    naturalVersionReasonZh = '这条旧版点评没有保存可验证的逐词或逐短语说明，系统已停止用“整句改整句”的笼统内容代替详细解释。';
  }

  return { ...result, correctedAnswer, naturalVersion, naturalVersionReasonZh, naturalChanges };
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
    : result.naturalChanges.length === 0
      || result.naturalChanges.some((change) => (
        !isGranularNaturalChange(change, result.correctedAnswer, result.naturalVersion)
        || !hasDetailedNaturalExplanation(change)
      ))
      || !sameText(transformedNaturalVersion(result.correctedAnswer, result.naturalChanges) ?? '', result.naturalVersion);
  return { requirements, correctedFailures, naturalFailures, invalidChanges, valid: correctedFailures.length === 0 && naturalFailures.length === 0 && !invalidChanges };
}

function normalizedNaturalChanges(result: EvaluationResult) {
  return normalizeChangeList(
    result.correctedAnswer,
    result.naturalVersion,
    result.naturalChanges,
    result.naturalVersionReasonZh
  );
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
    : explicitNaturalSummary(naturalChanges);
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

