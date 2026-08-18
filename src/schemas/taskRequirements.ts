import type { QuestionType, TaskRequirementCheck, TaskRequirements } from '../types.js';

export interface TaskRequirementContext {
  questionType: QuestionType;
  prompt: string;
  targetWord: string;
  weeklyWords?: string[];
}

function clean(value: string) {
  return value
    .trim()
    .replace(/^[\s“”"'.,!?;:，。！？；：]+|[\s“”"'.,!?;:，。！？；：]+$/g, '')
    .replace(/\s+/g, ' ');
}

function normalizedWords(value: string): string[] {
  return value.toLocaleLowerCase('en-US').match(/[a-z]+(?:'[a-z]+)?/g) ?? [];
}

const irregularLemmaForms: Record<string, string[]> = {
  be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'],
  become: ['became', 'become', 'becoming'],
  build: ['built', 'building'],
  choose: ['chose', 'chosen', 'choosing'],
  deal: ['dealt', 'dealing'],
  do: ['does', 'did', 'done', 'doing'],
  feel: ['felt', 'feeling'],
  find: ['found', 'finding'],
  give: ['gave', 'given', 'giving'],
  go: ['went', 'gone', 'going'],
  have: ['has', 'had', 'having'],
  make: ['made', 'making'],
  mean: ['meant', 'meaning'],
  read: ['read', 'reading'],
  run: ['ran', 'running'],
  speak: ['spoke', 'spoken', 'speaking'],
  spend: ['spent', 'spending'],
  take: ['took', 'taken', 'taking'],
  tell: ['told', 'telling'],
  understand: ['understood', 'understanding'],
  write: ['wrote', 'written', 'writing']
};

const patternHeadVerbs = new Set([
  'accept', 'achieve', 'affect', 'allow', 'ask', 'avoid', 'be', 'become', 'believe', 'benefit', 'build',
  'change', 'choose', 'compare', 'consider', 'continue', 'create', 'deal', 'decide', 'depend', 'describe',
  'develop', 'discover', 'do', 'encourage', 'expect', 'explain', 'express', 'face', 'feel', 'find', 'follow',
  'form', 'gain', 'give', 'handle', 'have', 'improve', 'include', 'increase', 'learn', 'listen', 'look',
  'make', 'manage', 'mean', 'notice', 'offer', 'pay', 'prefer', 'prepare', 'protect', 'provide', 'reach',
  'read', 'realize', 'reduce', 'remain', 'remember', 'require', 'respond', 'run', 'save', 'seem', 'set',
  'share', 'solve', 'sound', 'speak', 'spend', 'study', 'suggest', 'support', 'take', 'tell', 'travel',
  'work', 'write'
]);

function regexEscape(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function phrasePattern(value: string) {
  const tokens = normalizedWords(value).map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return tokens.length ? new RegExp(`\\b${tokens.join('\\s+')}\\b`, 'i') : undefined;
}

export function includesExactExpression(text: string, expression: string) {
  return phrasePattern(expression)?.test(text) ?? false;
}

function lemmaForms(lemma: string) {
  const word = clean(lemma).toLocaleLowerCase('en-US');
  const forms = new Set([word, `${word}s`, `${word}ed`, `${word}ing`]);
  if (word.endsWith('e')) {
    forms.add(`${word}d`);
    forms.add(`${word.slice(0, -1)}ing`);
  }
  if (/[^aeiou]y$/.test(word)) {
    forms.add(`${word.slice(0, -1)}ies`);
    forms.add(`${word.slice(0, -1)}ied`);
  }
  if (/[^aeiou][aeiou][^aeiouwxy]$/.test(word)) {
    forms.add(`${word}${word.at(-1)}ed`);
    forms.add(`${word}${word.at(-1)}ing`);
  }
  (irregularLemmaForms[word] ?? []).forEach((form) => forms.add(form));
  return forms;
}

export function includesLemma(text: string, lemma: string) {
  const words = new Set(normalizedWords(text));
  return [...lemmaForms(lemma)].some((form) => words.has(form));
}

function lemmaPattern(lemma: string) {
  return `(?:${[...lemmaForms(lemma)].sort((left, right) => right.length - left.length).map(regexEscape).join('|')})`;
}

function patternTokens(value: string) {
  return value.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) ?? [];
}

function usagePattern(value: string, targetWord = '') {
  const tokens = patternTokens(value);
  if (!tokens.length) return undefined;
  const pieces = tokens.map((rawToken, index) => {
    const token = rawToken.toLocaleLowerCase('en-US');
    const previous = tokens[index - 1]?.toLocaleLowerCase('en-US');
    if (rawToken === 'A' || rawToken === 'B' || token === 'someone' || token === 'something') {
      return "(?:[a-z]+(?:'[a-z]+)?)(?:\\s+[a-z]+(?:'[a-z]+)?){0,5}";
    }
    if (token === 'yourself') return '(?:myself|yourself|himself|herself|itself|ourselves|yourselves|themselves)';
    if (token === 'your') return '(?:my|your|his|her|its|our|their)';
    if (token === 'doing') return "(?:[a-z]+ing)";
    if (token === 'done') return "(?:[a-z]+(?:ed|en|n|t)?|done)";
    if (token === 'do' && previous === 'to') return "(?:[a-z]+(?:'[a-z]+)?)";
    if (token === targetWord.toLocaleLowerCase('en-US') || patternHeadVerbs.has(token) && index === 0) {
      return lemmaPattern(token);
    }
    return regexEscape(token);
  });
  return new RegExp(`\\b${pieces.join('\\s+')}\\b`, 'i');
}

export function includesUsagePattern(text: string, pattern: string, targetWord = '') {
  const normalizedText = normalizedWords(text).join(' ');
  return usagePattern(pattern, targetWord)?.test(normalizedText) ?? false;
}

export function describeUsagePattern(pattern: string) {
  return pattern
    .replace(/\bto do\b/gi, 'to + 动词原形')
    .replace(/\bdoing\b/gi, '动词 -ing 形式')
    .replace(/\bdone\b/gi, '过去分词')
    .replace(/\bsomeone\b/gi, '某人')
    .replace(/\bsomething\b/gi, '某事/某物')
    .replace(/\byourself\b/gi, '与主语一致的反身代词')
    .replace(/\bA\b/g, '内容 A')
    .replace(/\bB\b/g, '内容 B');
}

function unique(values: string[]) {
  return values.filter(Boolean).filter((value, index, list) => (
    list.findIndex((item) => item.toLocaleLowerCase('en-US') === value.toLocaleLowerCase('en-US')) === index
  ));
}

function numberRange(prompt: string, unit: string) {
  const match = prompt.match(new RegExp(`(\\d+)\\s*[–—-]\\s*(\\d+)\\s*${unit}`));
  return match ? { min: Number(match[1]), max: Number(match[2]) } : undefined;
}

function listAfter(prompt: string, label: string) {
  const match = prompt.match(new RegExp(`${label}（([^）]+)）`));
  return match ? unique(match[1].split(/[、,，]/).map(clean).filter((item) => /[a-z]/i.test(item))) : [];
}

export function deriveTaskRequirements(context: TaskRequirementContext): TaskRequirements {
  const weekly = context.questionType === 'weekly_writing' || context.questionType === 'weekly_speaking';
  const quoted = unique(Array.from(context.prompt.matchAll(/[“"]([^”"]+)[”"]/g))
    .map((match) => clean(match[1]))
    .filter((value) => /[a-z]/i.test(value)));
  const requiresLiteralText = /(逐字|原样|完全照写)/.test(context.prompt);
  const multiword = quoted.filter((value) => normalizedWords(value).length > 1);
  const exact: string[] = requiresLiteralText ? multiword : [];
  const patterns: string[] = requiresLiteralText ? [] : multiword;
  const lemmas = quoted.filter((value) => normalizedWords(value).length === 1);
  const targetCovered = [...exact, ...patterns].some((phrase) => normalizedWords(phrase).includes(context.targetWord.toLocaleLowerCase('en-US')));
  if (!weekly && !targetCovered) lemmas.push(context.targetWord);

  const turnRange = context.questionType === 'dialogue' ? numberRange(context.prompt, '轮') : undefined;
  const wordRange = context.questionType === 'weekly_writing' ? numberRange(context.prompt, '词') : undefined;
  const weeklyWords = weekly
    ? unique(context.weeklyWords ?? [])
    : [];
  const weeklyMinimum = context.prompt.match(/至少自然使用\s*(\d+)\s*个本周词/);
  const collocationMinimum = context.prompt.match(/至少自然使用[^。]*?和\s*(\d+)\s*个词卡搭配/);
  const requiredCollocations = listAfter(context.prompt, '词卡搭配');

  return {
    mustUseExact: unique(exact),
    mustUsePatterns: unique(patterns),
    mustUseLemma: unique(lemmas).filter((lemma) => ![...exact, ...patterns].some((phrase) => normalizedWords(phrase).includes(lemma.toLocaleLowerCase('en-US')))),
    mustAvoid: [],
    minTurns: turnRange?.min,
    maxTurns: turnRange?.max,
    minWords: wordRange?.min,
    maxWords: wordRange?.max,
    weeklyWords,
    minWeeklyWords: weeklyMinimum ? Number(weeklyMinimum[1]) : undefined,
    requiredCollocations,
    minCollocations: collocationMinimum ? Number(collocationMinimum[1]) : undefined
  };
}

function dialogueTurns(answer: string) {
  return answer.split(/\r?\n/).map((line) => line.trim()).filter((line) => /^[A-Za-z][\w .'-]{0,20}:\s*\S+/.test(line)).length;
}

function wordCount(answer: string) {
  return normalizedWords(answer).length;
}

export function checkTaskRequirements(answer: string, requirements: TaskRequirements): TaskRequirementCheck[] {
  const checks: TaskRequirementCheck[] = [];
  requirements.mustUseExact.forEach((expression) => {
    const passed = includesExactExpression(answer, expression);
    checks.push({ id: `exact:${expression}`, labelZh: `使用指定表达“${expression}”`, passed, evidenceZh: passed ? `已使用“${expression}”。` : `没有找到完整表达“${expression}”。` });
  });
  (requirements.mustUsePatterns ?? []).forEach((pattern) => {
    const passed = includesUsagePattern(answer, pattern);
    const described = describeUsagePattern(pattern);
    checks.push({
      id: `pattern:${pattern}`,
      labelZh: `正确使用“${described}”结构`,
      passed,
      evidenceZh: passed
        ? `已正确实例化“${described}”结构；模板中的 do、doing、someone、something、A/B 等只代表可替换成分。`
        : `尚未检测到“${described}”结构；模板中的占位词不要求逐字写出。`
    });
  });
  requirements.mustUseLemma.forEach((lemma) => {
    const passed = includesLemma(answer, lemma);
    checks.push({ id: `lemma:${lemma}`, labelZh: `使用目标词“${lemma}”或合理变形`, passed, evidenceZh: passed ? `已使用“${lemma}”的合理形式。` : `没有使用“${lemma}”或其合理变形。` });
  });
  requirements.mustAvoid.forEach((expression) => {
    const passed = !includesExactExpression(answer, expression);
    checks.push({ id: `avoid:${expression}`, labelZh: `避免错误表达“${expression}”`, passed, evidenceZh: passed ? `未使用错误表达“${expression}”。` : `仍出现了应避免的“${expression}”。` });
  });
  if (requirements.minTurns !== undefined || requirements.maxTurns !== undefined) {
    const count = dialogueTurns(answer);
    const passed = count >= (requirements.minTurns ?? 0) && count <= (requirements.maxTurns ?? Number.POSITIVE_INFINITY);
    checks.push({ id: 'dialogue-turns', labelZh: `${requirements.minTurns ?? 0}–${requirements.maxTurns ?? '不限'} 轮对话`, passed, evidenceZh: `检测到 ${count} 轮带说话人标记的对话。` });
  }
  if (requirements.minWords !== undefined || requirements.maxWords !== undefined) {
    const count = wordCount(answer);
    const passed = count >= (requirements.minWords ?? 0) && count <= (requirements.maxWords ?? Number.POSITIVE_INFINITY);
    checks.push({ id: 'word-count', labelZh: `${requirements.minWords ?? 0}–${requirements.maxWords ?? '不限'} 词`, passed, evidenceZh: `当前共 ${count} 个英文词。` });
  }
  if (requirements.minWeeklyWords !== undefined) {
    const used = requirements.weeklyWords.filter((word) => includesLemma(answer, word));
    const passed = used.length >= requirements.minWeeklyWords;
    checks.push({ id: 'weekly-words', labelZh: `至少自然使用 ${requirements.minWeeklyWords} 个本周词`, passed, evidenceZh: used.length ? `检测到 ${used.length} 个：${used.join('、')}。` : '没有检测到本周目标词。' });
  }
  if (requirements.minCollocations !== undefined) {
    const used = requirements.requiredCollocations.filter((phrase) => includesUsagePattern(answer, phrase));
    const passed = used.length >= requirements.minCollocations;
    checks.push({ id: 'weekly-collocations', labelZh: `至少使用 ${requirements.minCollocations} 个指定搭配`, passed, evidenceZh: used.length ? `检测到 ${used.length} 个：${used.join('、')}。` : '没有检测到指定词卡搭配。' });
  }
  return checks;
}

export function failedTaskRequirements(answer: string, requirements: TaskRequirements) {
  return checkTaskRequirements(answer, requirements).filter((check) => !check.passed);
}
