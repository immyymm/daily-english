export interface EvaluationConstraintContext {
  questionType?: string;
  prompt?: string;
  targetWord?: string;
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
