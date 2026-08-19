import type { EvaluationResult, NaturalExpressionChange, QuestionType, TaskRequirements } from '../types.js';
import { checkTaskRequirements, deriveTaskRequirements, failedTaskRequirements, includesLemma, includesUsagePattern, type TaskRequirementContext } from './taskRequirements.js';

export interface EvaluationConstraintContext {
  questionType?: QuestionType;
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

const internalProcessPatterns = [
  /confidence\s*[:=]/i,
  /\bthe assistant(?:'s)?\b/i,
  /\b(?:valid|clean|corrected|malformed)\s+json\b/i,
  /\bjson\s+(?:object|now|properly)\b/i,
  /\bprevious (?:content|result)\b/i,
  /\b(?:system prompt|hidden reasoning|rubric checks|model output|schema validation)\b/i,
  /\blet'?s\s+(?:reconstruct|present|deliver|craft|redo)\b/i,
  /\bi(?:'ll| will| must| am going to)\s+(?:output|present|deliver|provide|craft)\b/i,
  /\bwait\.\s+i must\b/i,
  /\bsorry\.\s+i(?:'ll| will| must)\b/i,
  /```|\*\*\*/
];

function plainText(value: string, maximum: number) {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maximum)
    .trim();
}

export function containsInternalProcessLeak(value: string) {
  return internalProcessPatterns.some((pattern) => pattern.test(value));
}

export function sanitizeUserFacingText(value: string, fallback: string, maximum = 1_200) {
  const normalized = plainText(value, Math.max(maximum * 2, maximum));
  const leakIndex = internalProcessPatterns.reduce((earliest, pattern) => {
    const index = normalized.search(pattern);
    return index >= 0 && (earliest < 0 || index < earliest) ? index : earliest;
  }, -1);
  const safePrefix = leakIndex >= 0 ? normalized.slice(0, leakIndex) : normalized;
  const cleaned = safePrefix
    .replace(/[{}\[\]`*]+$/g, '')
    .replace(/[,:;\s]+$/g, '')
    .trim();
  const usable = leakIndex >= 0 ? cleaned.length >= 8 : cleaned.length > 0;
  return plainText(usable ? cleaned : fallback, maximum);
}

function safeExpression(value: string, maximum = 4_000) {
  return plainText(value, maximum);
}

function evaluationExplanatoryTexts(result: EvaluationResult) {
  return [
    result.reasonZh,
    result.naturalVersionReasonZh,
    ...Object.values(result.dimensionFeedback),
    result.taskCompliance.summaryZh,
    ...result.taskCompliance.checks.flatMap((check) => [check.labelZh, check.evidenceZh]),
    ...result.issues.map((issue) => issue.explanationZh),
    ...result.naturalChanges.flatMap((change) => [change.sourceIssueZh, change.replacementReasonZh, change.reasonZh]),
    ...result.collocationSuggestions
  ];
}

export function sanitizeEvaluationResult(result: EvaluationResult): EvaluationResult {
  const hiddenFallback = '本次点评中夹带了与学习无关的系统内容，已自动隐藏；请重新提交以获得完整分析。';
  const sanitizeExplanation = (value: string, fallback = hiddenFallback) => sanitizeUserFacingText(value, fallback, 1_200);
  return {
    ...result,
    taskCompliance: {
      ...result.taskCompliance,
      summaryZh: sanitizeExplanation(result.taskCompliance.summaryZh),
      checks: result.taskCompliance.checks.map((check) => ({
        ...check,
        id: safeExpression(check.id, 120),
        labelZh: sanitizeUserFacingText(check.labelZh, '任务要求', 200),
        evidenceZh: sanitizeExplanation(check.evidenceZh)
      }))
    },
    dimensionFeedback: {
      meaningContext: sanitizeExplanation(result.dimensionFeedback.meaningContext, ''),
      activeRecall: sanitizeExplanation(result.dimensionFeedback.activeRecall, ''),
      collocation: sanitizeExplanation(result.dimensionFeedback.collocation, ''),
      grammar: sanitizeExplanation(result.dimensionFeedback.grammar, ''),
      naturalness: sanitizeExplanation(result.dimensionFeedback.naturalness, '')
    },
    issues: result.issues.map((issue) => ({
      ...issue,
      originalText: safeExpression(issue.originalText),
      suggestedText: safeExpression(issue.suggestedText),
      explanationZh: sanitizeExplanation(issue.explanationZh)
    })),
    correctedAnswer: safeExpression(result.correctedAnswer),
    naturalVersion: safeExpression(result.naturalVersion),
    naturalVersionReasonZh: sanitizeExplanation(result.naturalVersionReasonZh),
    naturalChanges: result.naturalChanges.map((change) => ({
      from: safeExpression(change.from, 300),
      to: safeExpression(change.to, 300),
      sourceIssueZh: sanitizeExplanation(change.sourceIssueZh),
      replacementReasonZh: sanitizeExplanation(change.replacementReasonZh),
      reasonZh: sanitizeExplanation(change.reasonZh)
    })),
    reasonZh: sanitizeExplanation(result.reasonZh),
    collocationSuggestions: result.collocationSuggestions
      .filter((item) => !containsInternalProcessLeak(item))
      .map((item) => safeExpression(item, 160))
      .filter(Boolean)
  };
}

function comparable(value: string) {
  return ` ${value.toLocaleLowerCase('en-US').replace(/[^a-z0-9']+/g, ' ').trim()} `;
}

function sameText(left: string, right: string) {
  return comparable(left) === comparable(right);
}

function surfaceText(value: string) {
  return value
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function sameSurfaceText(left: string, right: string) {
  return surfaceText(left) === surfaceText(right);
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

export function reconstructNaturalVersion(
  correctedAnswer: string,
  naturalVersion: string,
  changes: Pick<NaturalExpressionChange, 'from' | 'to'>[]
) {
  if (sameSurfaceText(correctedAnswer, naturalVersion)) return changes.length === 0 ? correctedAnswer : undefined;
  if (changes.length === 0) return undefined;

  let sourceCursor = 0;
  let targetCursor = 0;
  let reconstructed = '';
  for (const change of changes) {
    const from = change.from.trim();
    const to = change.to.trim();
    if (!from || !to || sameSurfaceText(from, to)) return undefined;

    const sourceIndex = correctedAnswer.indexOf(from, sourceCursor);
    const targetIndex = naturalVersion.indexOf(to, targetCursor);
    if (sourceIndex < sourceCursor || targetIndex < targetCursor) return undefined;

    // A phrase that occurs more than once cannot be tied unambiguously to the displayed sentence.
    if (correctedAnswer.indexOf(from) !== correctedAnswer.lastIndexOf(from)
      || naturalVersion.indexOf(to) !== naturalVersion.lastIndexOf(to)) return undefined;

    reconstructed += correctedAnswer.slice(sourceCursor, sourceIndex) + to;
    sourceCursor = sourceIndex + from.length;
    targetCursor = targetIndex + to.length;
  }
  reconstructed += correctedAnswer.slice(sourceCursor);
  return sameSurfaceText(reconstructed, naturalVersion) ? reconstructed : undefined;
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
  const transformed = reconstructNaturalVersion(correctedAnswer, naturalVersion, candidates);
  if (transformed
    && sameSurfaceText(transformed, naturalVersion)
    && candidates.every((change) => isGranularNaturalChange(change, correctedAnswer, naturalVersion))) return candidates;
  void fallbackReason;
  return [];
}

export function includesRequiredExpression(text: string, expression: string) {
  const normalizedExpression = comparable(expression).trim();
  return Boolean(normalizedExpression) && comparable(text).includes(` ${normalizedExpression} `);
}

export function requiredExpressionsForEvaluation(context: EvaluationConstraintContext) {
  if (!context.questionType || !context.prompt || !context.targetWord) return [];
  const requirements = deriveTaskRequirements({
    questionType: context.questionType,
    prompt: context.prompt,
    targetWord: context.targetWord
  });
  return [...requirements.mustUseExact, ...requirements.mustUsePatterns, ...requirements.mustUseLemma];
}

export function missingRequiredExpressions(text: string, requiredExpressions: string[]) {
  return requiredExpressions.filter((expression) => (
    expression.includes(' ')
      ? !includesUsagePattern(text, expression)
      : !includesLemma(text, expression)
  ));
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
  result: EvaluationResult,
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
      || !reconstructNaturalVersion(result.correctedAnswer, result.naturalVersion, result.naturalChanges);
  const leakedProcess = evaluationExplanatoryTexts(result).some(containsInternalProcessLeak);
  return {
    requirements,
    correctedFailures,
    naturalFailures,
    invalidChanges,
    leakedProcess,
    valid: correctedFailures.length === 0 && naturalFailures.length === 0 && !invalidChanges && !leakedProcess
  };
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
  const sanitizedInput = sanitizeEvaluationResult(input);
  const checks = checkTaskRequirements(context.answer, requirements);
  const passedChecks = checks.filter((check) => check.passed).length;
  const deterministicTaskScore = checks.length ? Math.round(passedChecks / checks.length * 10) : 10;
  const taskCompletionScore = deterministicTaskScore;
  const explicitPassed = checks.every((check) => check.passed);
  const taskPassed = explicitPassed;
  const failedEvidence = checks.filter((check) => !check.passed).map((check) => check.evidenceZh);
  const naturalChanges = normalizedNaturalChanges(sanitizedInput);
  const naturalVersionReasonZh = sameText(sanitizedInput.correctedAnswer, sanitizedInput.naturalVersion)
    ? '修正后的句子已经自然、清楚并符合题目要求，因此无需为了改写而另造一个版本。'
    : explicitNaturalSummary(naturalChanges);
  const errorTypes = [...new Set([
    ...sanitizedInput.errorTypes.filter((type) => type !== '任务要求' || !taskPassed),
    ...(!taskPassed ? ['任务要求' as const] : [])
  ])];
  const issues = taskPassed ? sanitizedInput.issues.filter((issue) => issue.category !== '任务要求') : sanitizedInput.issues;
  const overallScore = calculateEvaluationOverallScore({ ...sanitizedInput, taskCompletionScore });
  const reasonZh = taskPassed && /(未满足|任务要求|必须短语|必须包含)/.test(sanitizedInput.reasonZh)
    ? '已满足题目的目标词或结构要求；评分只反映回答本身在词义、搭配、语法和自然度上的实际表现。'
    : sanitizedInput.reasonZh;

  return {
    ...sanitizedInput,
    overallScore,
    taskCompletionScore,
    taskCompliance: {
      passed: taskPassed,
      summaryZh: failedEvidence.length
        ? failedEvidence.join('；')
        : checks.length
          ? '已满足题目中可机械核验的目标词、结构和格式要求。'
          : sanitizedInput.taskCompliance.summaryZh,
      checks
    },
    errorTypes,
    issues,
    reasonZh,
    naturalChanges,
    naturalVersionReasonZh,
    needsRetry: !taskPassed || overallScore < 75
  };
}
