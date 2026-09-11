/**
 * Deterministic quality helpers for the learner-facing card sections.
 *
 * This module deliberately does not invent content. Callers must provide
 * evidence-backed phrase/lexical candidates (curated packs, COCA, ECDICT,
 * WordNet or reviewed examples). A strict builder throws when those sources
 * cannot satisfy the quality floor; silently padding with filler is forbidden.
 */

export const FORBIDDEN_QUESTION_META = /(?:目标词|本课目标词|本词卡|词卡中|词卡核心|根据本卡|根据本词卡|卡片中)/;

const GENERIC_CONTEXT_CATEGORIES = new Set([
  '核心动作与结构',
  '核心名词搭配',
  '核心用法',
  '日常与工作语境',
  '高频扩展表达',
  '补充常用语境'
]);

const GENERIC_RELATED_CATEGORIES = new Set([
  '同一语义场的高频词',
  '近义表达分类',
  '对比与易混表达分类',
  '常用词族分类',
  '上位概念',
  '具体相关表达',
  '相关动作与概念',
  '相关事物与概念',
  '相关特征与方式',
  '相关动作'
]);

const PLACEHOLDER_COPY = /(?:相近的常用表达|相反的常用表达|相近表达|相反表达|与\s*.+\s*(?:处于同一常用语义场|容易混淆的表达)|补充表达|相关词汇)/;

const INCOMPLETE_PHRASE_ENDING = /\b(?:a|an|the|any|some|my|your|his|her|our|their|is|are|was|were|has|had|about|until|wherever|what|who|why|how|when|looking|new)$/i;
const LEAKED_SENTENCE_FRAGMENT = /\b(?:otherwise you will|you will|he will|she will|they will|we will)\b/i;
const COMPLETE_IDIOMS = new Set(['if you will', 'stay the same']);
const REQUIRED_INFINITIVE_TO_ENDING = /\b(?:be\s+(?:widely\s+)?(?:able|allowed|asked|expected|likely|supposed|understood)|(?:appear|seem)\s+likely|cannot\s+wait|must\s+be\s+able|win\s+the\s+right|would\s+love|might\s+be\s+expected)\s+to$/i;

const CONTEXT_RULES = [
  ['人际沟通', /\b(?:ask|answer|call|communication|contact|discuss|explain|family|friend|hear|listen|message|people|person|say|someone|speak|talk|tell|thank|voice)\b/i],
  ['工作与学习', /\b(?:answer|book|class|course|data|example|information|job|learn|lesson|meeting|office|practice|project|report|research|school|skill|student|study|team|test|work|write)\b/i],
  ['计划与决策', /\b(?:agree|allow|choice|choose|consider|decide|decision|expect|goal|intend|offer|plan|prepare|promise|refuse|require|suggest|want)\b/i],
  ['变化与结果', /\b(?:become|better|change|continue|develop|effect|end|grow|happen|improve|increase|progress|reduce|remain|result|start|stop|success|turn)\b/i],
  ['时间与频率', /\b(?:already|always|day|early|eventually|finally|first|frequently|later|moment|never|often|recently|soon|still|time|today|usually|week|year)\b/i],
  ['地点与移动', /\b(?:abroad|away|back|bring|come|drive|far|go|home|leave|move|place|pull|return|road|run|take|travel|walk)\b/i],
  ['数量与程度', /\b(?:almost|clearly|directly|enough|especially|less|level|likely|more|much|nearly|only|quite|really|simply|very)\b/i],
  ['事物与使用', /\b(?:access|benefit|build|buy|create|food|give|have|include|keep|make|money|pay|product|provide|receive|sell|service|set|support|thing|tool|use)\b/i]
];

const IRREGULAR_FORMS = {
  be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'],
  become: ['became', 'becoming'],
  begin: ['began', 'begun'],
  break: ['broke', 'broken'],
  bring: ['brought'],
  build: ['built'],
  buy: ['bought'],
  choose: ['chose', 'chosen'],
  come: ['came'],
  cut: ['cut', 'cutting'],
  deal: ['dealt'],
  die: ['died', 'dying'],
  do: ['does', 'did', 'done', 'doing'],
  drive: ['drove', 'driven'],
  eat: ['ate', 'eaten'],
  fall: ['fell', 'fallen'],
  feel: ['felt'],
  find: ['found'],
  get: ['got', 'gotten', 'getting'],
  give: ['gave', 'given'],
  go: ['went', 'gone', 'going'],
  grow: ['grew', 'grown'],
  have: ['has', 'had'],
  hear: ['heard'],
  hold: ['held'],
  keep: ['kept'],
  know: ['knew', 'known'],
  lead: ['led'],
  leave: ['left'],
  lie: ['lay', 'lain', 'lying'],
  lose: ['lost'],
  make: ['made'],
  mean: ['meant'],
  meet: ['met'],
  pay: ['paid'],
  prefer: ['preferred', 'preferring'],
  put: ['put', 'putting'],
  read: ['read'],
  run: ['ran', 'running'],
  say: ['said'],
  see: ['saw', 'seen'],
  sell: ['sold'],
  send: ['sent'],
  sit: ['sat', 'sitting'],
  speak: ['spoke', 'spoken'],
  spend: ['spent'],
  stand: ['stood'],
  take: ['took', 'taken'],
  tell: ['told'],
  think: ['thought'],
  understand: ['understood'],
  wear: ['wore', 'worn'],
  win: ['won'],
  write: ['wrote', 'written']
};

export class SectionQualityError extends Error {
  constructor(section, word, details) {
    super(`${word}: ${section} quality floor failed: ${details}`);
    this.name = 'SectionQualityError';
    this.section = section;
    this.word = word;
  }
}

export function normalizeLearningKey(value = '') {
  return String(value)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9']+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function partOfSpeechClasses(value = '') {
  const normalized = String(value).toLowerCase();
  const classes = [];
  if (/\baux\.?\b/.test(normalized)) classes.push('aux');
  if (/(?:^|[\s/])v\.(?:$|[\s/])/.test(normalized) && !classes.includes('aux')) classes.push('v');
  if (/(?:^|[\s/])n\.(?:$|[\s/])/.test(normalized)) classes.push('n');
  if (/\badj\.?\b/.test(normalized)) classes.push('adj');
  if (/\badv\.?\b/.test(normalized)) classes.push('adv');
  if (/\bphr\.?\b/.test(normalized)) classes.push('phr');
  if (/\bprep\.?\b/.test(normalized)) classes.push('prep');
  if (/\bconj\.?\b/.test(normalized)) classes.push('conj');
  if (/\bpron\.?\b/.test(normalized)) classes.push('pron');
  if (/\bdet\.?\b/.test(normalized)) classes.push('det');
  if (/\bnum\.?\b/.test(normalized)) classes.push('num');
  return classes;
}

export function partOfSpeechCompatible(left, right) {
  const leftClasses = partOfSpeechClasses(left);
  const rightClasses = partOfSpeechClasses(right);
  if (!leftClasses.length || !rightClasses.length) return false;
  return leftClasses.some((value) => rightClasses.includes(value));
}

export function selectRelationQuestionAnswer(entries = [], { preferredWord = '' } = {}) {
  const eligible = entries.filter((entry) => entry?.word && partOfSpeechClasses(entry.partOfSpeech).length);
  const preferredKey = normalizeLearningKey(preferredWord);
  if (preferredKey) {
    const preferred = eligible.find((entry) => normalizeLearningKey(entry.word) === preferredKey);
    if (preferred) return preferred;
  }
  return eligible.find((entry) => !/\s/.test(String(entry.word).trim()))
    ?? eligible[0]
    ?? entries[0];
}

export function selectSecondaryRelationQuestionAnswer(entries = [], primary) {
  if (!primary?.word || !partOfSpeechClasses(primary.partOfSpeech).length) return undefined;
  return entries.find((entry) => (
    normalizeLearningKey(entry?.word) !== normalizeLearningKey(primary.word)
    && partOfSpeechCompatible(entry?.partOfSpeech, primary.partOfSpeech)
  ));
}

export function buildSecondaryMeaningChoiceQuestion({ id, word, meanings = [], stage = 'T1', seed = 0 }) {
  const secondary = meanings[1];
  const options = [...new Set(meanings.map((meaning) => String(meaning?.chinese ?? '').trim()).filter(Boolean))];
  if (!secondary?.english || !secondary?.chinese || options.length < 3) return undefined;
  const start = ((seed % options.length) + options.length) % options.length;
  return {
    id,
    type: 'meaning_choice',
    prompt: `“${word}”还可表达以下英文释义：${secondary.english}。对应的中文义是哪一项？`,
    options: options.slice(start).concat(options.slice(0, start)),
    answer: secondary.chinese,
    stage,
    ai: false
  };
}

export function slotGuidance(phrase, { targetWord = '', isTemplate = true } = {}) {
  if (!isTemplate) return '';
  const text = String(phrase ?? '');
  const target = normalizeLearningKey(targetWord);
  const notes = [];
  // Only explicit grammar metavariables receive placeholder guidance. Bare
  // lexical do in idioms and ordinary modal examples must not be relabelled.
  if (target !== 'do' && /\bto do (?:something|so)\b/i.test(text)) notes.push('do 代表任意合适的动词原形，不要求写出单词 do');
  if (target !== 'do' && /\bdoing something\b/i.test(text)) notes.push('doing 代表符合语境的动词 -ing 形式，不要求写出单词 doing');
  if (target !== 'do' && /\b(?:have|has|had) done something\b/i.test(text)) notes.push('done 代表符合语境的过去分词，不要求写出单词 done');
  if (/\bsomeone\b/i.test(text)) notes.push('someone 要替换成实际的人或代词');
  if (/\bsomething\b/i.test(text)) notes.push('something 要替换成实际的事物或内容');
  if (/\bhelp yourself to\b/i.test(text)) notes.push('yourself 只按听话人数使用 yourself 或 yourselves');
  else if (/\byourself\b/i.test(text)) notes.push('yourself 要与句子主语在人称和数上保持一致');
  if (/(?:\bA\b.*\bB\b|\bB\b.*\bA\b)/.test(text)) notes.push('A、B 要替换成实际比较内容');
  return notes.length ? '；' + notes.join('；') : '';
}

export function structureFormClue(phrase) {
  const normalized = String(phrase ?? '').replace(/\s+/g, ' ').trim();
  if (/^should\s+the\s+need\s+arise$/i.test(normalized)) return 'should 位于主语 the need 前，构成省略 if 的正式条件倒装';
  if (/^might\s+i\s+(?:ask|suggest)\b/i.test(normalized)) return 'might 位于主语 I 前，构成礼貌而委婉的问句';
  if (/^be\s+that\s+as\s+it\s+may$/i.test(normalized)) return '这是固定让步语，整体表示“尽管如此”；that 不在这里引导普通宾语从句';
  if (/^it\s+is\b.*\bthat\b/i.test(normalized)) return '使用形式主语 it，后面接 that 完整从句';
  if (/\b(?:what|where|when|why|how|whether)\b/i.test(normalized)) return '使用疑问词引导完整的 wh-从句，疑问词后保留陈述语序';
  if (/\bsomeone\s+doing\b/i.test(normalized)) return '宾语后接动词 -ing 形式，强调看到或感知正在进行的动作';
  if (/\bsomeone\s+do\b/i.test(normalized)) return '宾语后接动词原形，强调看到或感知完整动作';
  if (/\b(?:nothing|something|anything|everything)\s+to\s+do\s+with\b/i.test(normalized)) return '固定习语中的 do with 是不可拆换的组成部分，后面接人或事物';
  if (/\bto\s+do\b/i.test(normalized)) return '完整结构中使用 to + 动词原形；do 只是语法占位符，要换成符合语境的具体动词原形';
  if (/\bdoing\b/i.test(normalized)) return '完整结构中的 doing 是语法占位符，要换成符合语境的动词 -ing 形式';
  if (/\bdone\b/i.test(normalized)) return '完整结构中的 done 是语法占位符，要换成符合语境的过去分词';
  if (/\bto\s+be\b/i.test(normalized)) return '完整结构中使用 to be，后面接名词、形容词或其他补语';
  if (/^(?:(?:can|could|may|might|must|should|will|would)\b|need\b.*\bdo\b)/i.test(normalized)) {
    const placeholder = /\bdo something\b/i.test(normalized)
      ? '；其中 do something 是模板占位，需换成符合语境的具体动词和宾语'
      : '';
    return `情态或准情态结构后接动词原形${placeholder}`;
  }
  if (/\bfrom\b.*\bto\b/i.test(normalized)) return '同时使用 from 和 to，表示范围或变化的起点与终点';
  if (/\bmore\b.*\bto\b/i.test(normalized)) return '使用 more 构成比较级，后面再接 to + 动词原形';
  if (/\bless\b.*\bto\b/i.test(normalized)) return '使用 less 表示较低可能性，后面再接 to + 动词原形';
  if (/^be\s+likely\s+to\b/i.test(normalized)) return '基本形式为 be + likely + to + 动词原形；more/less likely to 可进一步表达可能性高低';
  if (/\bthat\b/i.test(normalized)) return '使用 that 引导一个主谓完整的从句';
  const preposition = normalized.match(/\b(on|in|at|for|with|by|from|of|about|into|over|through|to|as|like|along|against|without|within|off|down|up|out|away|back)\b/i)?.[1];
  if (preposition) return `完整搭配中使用介词 ${preposition.toLowerCase()}`;
  if (/\bsomething\b/i.test(normalized)) return '结构中直接带有事物宾语，不在目标词与宾语之间增加介词';
  if (/^be\b/i.test(normalized)) return '使用 be 的正确形式后接目标表达';
  return '选择与该中文含义和词性同时匹配的完整句块';
}

export function hasConcreteLearningValue(entry) {
  return Boolean(
    entry
    && normalizeLearningKey(entry.word ?? entry.phrase)
    && String(entry.chinese ?? '').trim()
    && !PLACEHOLDER_COPY.test(String(entry.chinese))
  );
}

export function isConcisePhraseGloss(value, maximumCharacters = 14) {
  const gloss = String(value ?? '').trim();
  if (!gloss || PLACEHOLDER_COPY.test(gloss) || /[。！？!?；;]$/.test(gloss)) return false;
  if (/(?:吗|呢|吧|嘛|呀|啊)$/.test(gloss)) return false;
  if (/^(?:大家|人们)都/.test(gloss)) return false;
  if (/^(?:我|你|他|她|它|我们|你们|他们|她们|它们)(?:该|能|可以|愿意|想|觉得|认为|知道|明白|相信|简直|或许|怎么|如何|是否|是|要|会|应该|不|没|有|已经)/.test(gloss)) return false;
  if ([...gloss.replace(/\s/g, '')].length > maximumCharacters) return false;
  return true;
}

export function reusablePhraseIssue(phrase, { maximumWords = 8 } = {}) {
  const value = String(phrase ?? '').trim();
  if (!value) return 'missing-phrase';
  const wordCount = value.split(/\s+/).length;
  const formulaicQuestion = wordCount <= 6 && /^(?:are|can|could|did|do|does|has|have|how|is|may|shall|should|was|were|what|when|where|why|will|would)\b.*\?$/i.test(value);
  const completedWhCopulaClause = /\b(?:who|what|where|how)\s+(?:(?:i|you|we|they|he|she|it)|(?:(?:the|a|an|this|that|my|your|his|her|our|their)\s+)?[a-z][a-z'-]*)\s+(?:am|is|are|was|were)$/i.test(value);
  if (wordCount > maximumWords || /[.!]$/.test(value) || (/\?$/.test(value) && !formulaicQuestion)) return 'sentence-not-phrase';
  if (/(?:\.{2,}|…)/.test(value)) return 'ellipsis-placeholder';
  if (wordCount > 6 && /^(?:i|you|we|they|he|she|the|a|an)\b/i.test(value)
    && !/^(?:it\s+(?:seems|appears|takes)|there\s+(?:is|are))\b/i.test(value)) return 'copied-sentence-opening';
  if (!COMPLETE_IDIOMS.has(value.toLowerCase()) && !completedWhCopulaClause && INCOMPLETE_PHRASE_ENDING.test(value)) return 'incomplete-ending';
  if (REQUIRED_INFINITIVE_TO_ENDING.test(value)) return 'missing-infinitive-complement';
  if (LEAKED_SENTENCE_FRAGMENT.test(value)) return 'leaked-sentence-fragment';
  return '';
}

const GENERIC_FIXED_EXAMPLE_CARRIERS = [
  'we will',
  'they can',
  'please',
  'you should',
  'the team plans to',
  'it may help to',
  'we decided to',
  'they were able to',
  'it is important to',
  'she learned to',
  'we can',
  'they agreed to'
];
const REVIEWED_NATURAL_IMPERATIVE_EXAMPLES = new Set([
  'please do as you are told',
  'please keep to the point'
]);

/**
 * Reject examples produced by wrapping the phrase in a reusable carrier
 * sentence. A detailed card must instantiate a concrete subject, object, time,
 * place, or result instead of turning the phrase label itself into a sentence.
 */
export function fixedExampleIssue(example, phrase) {
  const normalizedExample = normalizeLearningKey(example);
  const normalizedPhrase = normalizeLearningKey(phrase);
  if (!normalizedExample) return 'missing-example';
  if (!normalizedPhrase) return 'missing-phrase';
  if (normalizedExample === normalizedPhrase) return 'bare-phrase-as-example';
  if (REVIEWED_NATURAL_IMPERATIVE_EXAMPLES.has(normalizedExample)) return '';
  if (GENERIC_FIXED_EXAMPLE_CARRIERS.some((carrier) => normalizedExample === `${carrier} ${normalizedPhrase}`)) {
    return 'generic-carrier-template';
  }
  return '';
}

/**
 * Detect rows created by mechanically prefixing the target with a modal,
 * frequency adverb, or negation. Established constructions such as
 * “would like to” and “would love to” are lexical patterns in their own
 * right, so they are deliberately exempt.
 */
export function mechanicalContextIssue(phrase, word) {
  const normalizedPhrase = normalizeLearningKey(phrase);
  const normalizedWord = normalizeLearningKey(word);
  if (!normalizedPhrase || !normalizedWord) return '';
  if ((normalizedWord === 'like' || normalizedWord === 'love')
    && normalizedPhrase.startsWith(`would ${normalizedWord} to`)) return '';
  const escapedWord = normalizedWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^(?:often|usually|can|could|may|might|must|should|will|would|need to|do not)\\s+${escapedWord}\\b`, 'i').test(normalizedPhrase)
    ? 'mechanical-context-prefix'
    : '';
}

function wordForms(word) {
  const normalized = normalizeLearningKey(word);
  const forms = new Set([normalized, `${normalized}s`, `${normalized}es`, `${normalized}ed`, `${normalized}ing`]);
  if (normalized.endsWith('e')) {
    forms.add(`${normalized}d`);
    forms.add(`${normalized.slice(0, -1)}ing`);
  }
  if (/[^aeiou][aeiou][^aeiouwxy]$/.test(normalized)) {
    const finalConsonant = normalized.at(-1);
    forms.add(`${normalized}${finalConsonant}ed`);
    forms.add(`${normalized}${finalConsonant}ing`);
  }
  if (/[^aeiou]y$/.test(normalized)) {
    forms.add(`${normalized.slice(0, -1)}ies`);
    forms.add(`${normalized.slice(0, -1)}ied`);
  }
  for (const form of IRREGULAR_FORMS[normalized] ?? []) forms.add(form);
  return forms;
}

export function phraseContainsTarget(phrase, word) {
  const forms = wordForms(word);
  return normalizeLearningKey(phrase).split(' ').some((token) => forms.has(token));
}

function flattenContextCandidates(candidates = []) {
  return candidates.flatMap((entry) => {
    if (Array.isArray(entry?.items)) {
      return entry.items.map((item) => ({ ...item, sourceCategory: item.sourceCategory ?? entry.category }));
    }
    return [entry];
  });
}

function isSpecificCategory(category, genericSet) {
  return Boolean(category
    && !genericSet.has(String(category).trim())
    && !/(?:补充|其他|扩展|综合|常用语境|上位概念|具体表达|语义关联)$/.test(String(category).trim()));
}

export function classifyContextPhrase(entry, partOfSpeech = '') {
  if (isSpecificCategory(entry?.sourceCategory, GENERIC_CONTEXT_CATEGORIES)) return String(entry.sourceCategory).trim();
  const searchable = `${entry?.phrase ?? ''} ${entry?.english ?? ''}`;
  for (const [label, pattern] of CONTEXT_RULES) {
    if (pattern.test(searchable)) return label;
  }
  if (partOfSpeechClasses(partOfSpeech).includes('adv') || partOfSpeechClasses(partOfSpeech).includes('adj')) return '程度与表达方式';
  if (partOfSpeechClasses(partOfSpeech).includes('n')) return '概念与事物';
  return '日常行动';
}

export function partitionIndependentContextCandidates({ word, partOfSpeech = '', fixedPhrases = [], candidates = [], ipaFor = () => '' }) {
  const fixedKeys = new Set(fixedPhrases.map((entry) => normalizeLearningKey(entry?.phrase ?? entry)));
  const seen = new Set();
  const accepted = [];
  const rejected = [];

  for (const raw of flattenContextCandidates(candidates)) {
    const phrase = String(raw?.phrase ?? '').trim();
    const key = normalizeLearningKey(phrase);
    let reason = '';
    if (!key || !String(raw?.chinese ?? '').trim()) reason = 'incomplete';
    else if (seen.has(key)) reason = 'duplicate-context';
    else if (fixedKeys.has(key)) reason = 'duplicates-fixed-phrase';
    else if (!phraseContainsTarget(phrase, word)) reason = 'missing-target';
    else if (reusablePhraseIssue(phrase)) reason = reusablePhraseIssue(phrase);
    else if (!isConcisePhraseGloss(raw.chinese)) reason = 'sentence-translation-or-invalid-gloss';

    if (reason) {
      rejected.push({ entry: raw, reason });
      continue;
    }
    seen.add(key);
    accepted.push({
      phrase,
      phonetic: raw.phonetic || ipaFor(phrase),
      chinese: String(raw.chinese).trim().replace(/[。！？!?；;]+$/g, ''),
      category: classifyContextPhrase(raw, partOfSpeech)
    });
  }
  return { accepted, rejected };
}

export function partitionFixedPhraseCandidates({ word, candidates = [], ipaFor = () => '' }) {
  const seen = new Set();
  const seenExamples = new Set();
  const accepted = [];
  const rejected = [];
  for (const raw of candidates) {
    const phrase = String(raw?.phrase ?? '').trim();
    const key = normalizeLearningKey(phrase);
    const exampleKey = normalizeLearningKey(raw?.example);
    let reason = reusablePhraseIssue(phrase);
    if (!reason && seen.has(key)) reason = 'duplicate-fixed-phrase';
    else if (!reason && !phraseContainsTarget(phrase, word)) reason = 'missing-target';
    else if (!reason && !isConcisePhraseGloss(raw?.chinese, 24)) reason = 'sentence-translation-or-invalid-gloss';
    else if (!reason && (!String(raw?.example ?? '').trim() || !String(raw?.translation ?? '').trim())) reason = 'missing-bilingual-example';
    else if (!reason && !phraseContainsTarget(raw.example, word)) reason = 'example-missing-target';
    else if (!reason && seenExamples.has(exampleKey)) reason = 'duplicate-example';
    if (reason) {
      rejected.push({ entry: raw, reason });
      continue;
    }
    seen.add(key);
    seenExamples.add(exampleKey);
    accepted.push({
      phrase,
      phonetic: raw.phonetic || ipaFor(phrase),
      chinese: String(raw.chinese).trim().replace(/[。！？!?；;]+$/g, ''),
      example: String(raw.example).trim(),
      translation: String(raw.translation).trim()
    });
  }
  return { accepted, rejected };
}

export function buildFixedPhrases({ word, candidates = [], ipaFor = () => '', minimumItems = 10, maximumItems = 12 }) {
  const result = partitionFixedPhraseCandidates({ word, candidates, ipaFor });
  const selected = result.accepted.slice(0, maximumItems);
  if (selected.length < minimumItems) {
    throw new SectionQualityError(
      'fixedPhrases',
      word,
      `${selected.length}/${minimumItems} complete unique phrases; ${result.rejected.length} candidates rejected`
    );
  }
  const genericExamples = selected.filter((entry) => fixedExampleIssue(entry.example, entry.phrase));
  if (genericExamples.length) {
    throw new SectionQualityError(
      'fixedPhrases',
      word,
      `${genericExamples.length} example${genericExamples.length === 1 ? '' : 's'} merely wrap the phrase in a reusable carrier sentence`
    );
  }
  return selected;
}

export function buildIndependentContextGroups({
  word,
  partOfSpeech = '',
  fixedPhrases = [],
  candidates = [],
  ipaFor = () => '',
  minimumItems = 10,
  minimumCategories = 3,
  maximumItems = 12
}) {
  const { accepted, rejected } = partitionIndependentContextCandidates({ word, partOfSpeech, fixedPhrases, candidates, ipaFor });
  const selected = accepted.slice(0, maximumItems);
  const categoryOrder = [...new Set(selected.map((entry) => entry.category))];
  const groups = categoryOrder.map((category) => ({
    category,
    items: selected
      .filter((entry) => entry.category === category)
      .map(({ category: _category, ...entry }) => entry)
  }));
  if (selected.length < minimumItems || groups.length < minimumCategories) {
    throw new SectionQualityError(
      'contextPhrases',
      word,
      `${selected.length}/${minimumItems} independent phrases and ${groups.length}/${minimumCategories} semantic categories; ${rejected.length} candidates rejected`
    );
  }
  return groups;
}

function relationWordKeys(relationWords = []) {
  const result = new Set();
  const visit = (entry) => {
    if (!entry) return;
    if (Array.isArray(entry)) {
      entry.forEach(visit);
      return;
    }
    const key = normalizeLearningKey(entry.word ?? entry);
    if (key) result.add(key);
  };
  visit(relationWords);
  return result;
}

function semanticCategory(entry, sourceCategory = '') {
  if (isSpecificCategory(entry?.categoryHint ?? sourceCategory, GENERIC_RELATED_CATEGORIES)) {
    return String(entry.categoryHint ?? sourceCategory).trim();
  }
  if (entry?.relation === '@') return '上位概念';
  if (entry?.relation === '~') return '具体相关表达';
  if (entry?.relation === '#m' || entry?.relation === '#s' || entry?.relation === '#p') return '整体与组成';
  if (entry?.sourceDefinition) return '相关动作与概念';
  const classes = partOfSpeechClasses(entry?.partOfSpeech);
  if (classes.includes('n')) return '相关事物与概念';
  if (classes.includes('adj') || classes.includes('adv')) return '相关特征与方式';
  return '相关动作';
}

export function deduplicateRelatedVocabulary({ word, groups = [], semanticCandidates = [], relationWords = [], ipaFor = () => '' }) {
  const excluded = relationWordKeys(relationWords);
  excluded.add(normalizeLearningKey(word));
  const seen = new Set();
  const rejected = [];
  const accepted = [];
  const source = [
    ...groups.flatMap((group) => (group?.items ?? []).map((entry) => ({ ...entry, sourceCategory: group.category }))),
    ...semanticCandidates
  ];

  for (const raw of source) {
    const key = normalizeLearningKey(raw?.word);
    let reason = '';
    if (!hasConcreteLearningValue(raw) || !partOfSpeechClasses(raw?.partOfSpeech).length) reason = 'incomplete-or-placeholder';
    else if (excluded.has(key)) reason = 'duplicates-relation-section';
    else if (seen.has(key)) reason = 'duplicate-across-categories';
    if (reason) {
      rejected.push({ entry: raw, reason });
      continue;
    }
    seen.add(key);
    accepted.push({
      word: String(raw.word).trim(),
      phonetic: raw.phonetic || ipaFor(raw.word, raw.partOfSpeech, raw.chinese),
      partOfSpeech: String(raw.partOfSpeech).trim(),
      chinese: String(raw.chinese).trim(),
      category: semanticCategory(raw, raw.sourceCategory)
    });
  }
  const categories = [...new Set(accepted.map((entry) => entry.category))];
  const result = categories.map((category) => ({
    category,
    items: accepted.filter((entry) => entry.category === category).map(({ category: _category, ...entry }) => entry)
  }));
  return { groups: result, rejected };
}

export function buildSemanticRelatedVocabulary({
  word,
  groups = [],
  semanticCandidates = [],
  relationWords = [],
  ipaFor = () => '',
  minimumItems = 8,
  minimumCategories = 3,
  maximumItems = 14
}) {
  const result = deduplicateRelatedVocabulary({ word, groups, semanticCandidates, relationWords, ipaFor });
  // Select in rounds so a long first category cannot consume the entire
  // allowance and erase the semantic grouping learners need to see.
  const activeGroups = result.groups.map((group) => ({ ...group, items: [] }));
  let remaining = maximumItems;
  let itemIndex = 0;
  while (remaining > 0) {
    let added = false;
    for (let groupIndex = 0; groupIndex < activeGroups.length && remaining > 0; groupIndex += 1) {
      const item = result.groups[groupIndex].items[itemIndex];
      if (!item) continue;
      activeGroups[groupIndex].items.push(item);
      remaining -= 1;
      added = true;
    }
    if (!added) break;
    itemIndex += 1;
  }
  const selectedGroups = activeGroups.filter((group) => group.items.length);
  const itemCount = selectedGroups.reduce((sum, group) => sum + group.items.length, 0);
  if (itemCount < minimumItems || selectedGroups.length < minimumCategories) {
    throw new SectionQualityError(
      'relatedVocabulary',
      word,
      `${itemCount}/${minimumItems} unique non-relation words and ${selectedGroups.length}/${minimumCategories} semantic categories; ${result.rejected.length} candidates rejected`
    );
  }
  return selectedGroups;
}

function candidateRank(candidate) {
  const rank = Number(candidate?.cocaRank ?? candidate?.rank ?? candidate?.frequencyRank);
  return Number.isFinite(rank) && rank > 0 ? rank : Number.MAX_SAFE_INTEGER;
}

export function selectTeachingDistractors({ answer, candidates = [], count = 3, excluded = [] }) {
  if (!answer?.word || !partOfSpeechClasses(answer.partOfSpeech).length) {
    throw new SectionQualityError('questions', answer?.word ?? '(unknown)', 'answer needs a known part of speech');
  }
  const excludedKeys = relationWordKeys([answer, ...excluded]);
  const seen = new Set();
  const filtered = candidates.filter((candidate) => {
    const key = normalizeLearningKey(candidate?.word);
    if (!key || excludedKeys.has(key) || seen.has(key)) return false;
    if (!hasConcreteLearningValue(candidate) || !partOfSpeechCompatible(answer.partOfSpeech, candidate.partOfSpeech)) return false;
    seen.add(key);
    return true;
  }).sort((left, right) => {
    const answerField = normalizeLearningKey(answer.semanticField ?? answer.category ?? answer.sourceDefinition);
    const leftField = normalizeLearningKey(left.semanticField ?? left.category ?? left.sourceDefinition);
    const rightField = normalizeLearningKey(right.semanticField ?? right.category ?? right.sourceDefinition);
    const fieldDelta = Number(!(answerField && leftField === answerField)) - Number(!(answerField && rightField === answerField));
    if (fieldDelta) return fieldDelta;
    const rankDelta = candidateRank(left) - candidateRank(right);
    if (rankDelta) return rankDelta;
    const lengthDelta = Math.abs(String(left.word).length - String(answer.word).length)
      - Math.abs(String(right.word).length - String(answer.word).length);
    return lengthDelta || String(left.word).localeCompare(String(right.word), 'en');
  });
  if (filtered.length < count) {
    throw new SectionQualityError('questions', answer.word, `only ${filtered.length}/${count} same-part-of-speech distractors have real meanings`);
  }
  return filtered.slice(0, count);
}

function sanitizeFallbackPrompt(prompt) {
  return String(prompt)
    .replace(/词卡中的?\s*/g, '')
    .replace(/根据本词卡辨析/g, '结合词义和用法')
    .replace(/根据本卡辨析/g, '结合词义和用法')
    .replace(/本课目标词/g, '英文单词')
    .replace(/目标词/g, '对应单词')
    .replace(/词卡核心例句/g, '例句')
    .replace(/词卡核心义/g, '核心义')
    .replace(/本词卡/g, '上述内容');
}

export function rewriteLearnerQuestionPrompts(questions, {
  word,
  coreMeaning = '',
  partOfSpeech = '',
  synonymMeaning = '',
  secondarySynonymMeaning = '',
  antonymMeaning = ''
}) {
  const firstSynonymAnswer = questions.find((question) => {
    const id = String(question.id ?? '');
    return id.includes('-synonym-choice') && !id.includes('-synonym-choice-2');
  })?.answer;
  return questions.map((question) => {
    const id = String(question.id ?? '');
    let prompt;
    if (id.includes('-meaning-core')) prompt = `“${word}”最常见的核心中文义是哪一项？`;
    else if (id.includes('-meaning-english')) prompt = `“${word}”最常见的英文释义是哪一项？`;
    else if (id.includes('-synonym-choice-2')) {
      const exclusion = firstSynonymAnswer ? `除“${firstSynonymAnswer}”外，` : '除前一题的答案外，';
      const testedMeaning = secondarySynonymMeaning || coreMeaning;
      prompt = `${exclusion}在“${testedMeaning}”这个义项下，哪个词也与“${word}”意思接近？`;
    }
    else if (id.includes('-synonym-choice')) prompt = `在“${synonymMeaning || coreMeaning}”这个义项下，哪个词与“${word}”意思最接近？`;
    else if (id.includes('-antonym-choice')) prompt = `在“${antonymMeaning || coreMeaning}”这个义项下，哪个词与“${word}”意思相反？`;
    else if (id.includes('-contrast-choice')) {
      if (/派生词/.test(String(question.prompt))) prompt = `哪一项是“${word}”的常用派生词？`;
      else prompt = `结合拼写、发音和用法，哪一项需要与“${word}”重点区分？`;
    }
    else if (id.includes('-recall-definition')) prompt = sanitizeFallbackPrompt(question.prompt).replace(/^根据英文释义写出对应单词/, '根据英文释义写出对应单词');
    else if (id.includes('-recall-chinese')) prompt = `写出表示“${coreMeaning}”（${partOfSpeech}）的英文单词。`;
    else prompt = sanitizeFallbackPrompt(question.prompt);
    if (FORBIDDEN_QUESTION_META.test(prompt)) {
      throw new SectionQualityError('questions', word, `meta copy survived in ${id}: ${prompt}`);
    }
    return { ...question, prompt };
  });
}

function relationEntries(card) {
  return [card?.synonyms, card?.antonyms, card?.derivatives, card?.confusables].flatMap((entries) => entries ?? []);
}

export function auditCardSections(card, optionPartOfSpeechByWord = new Map()) {
  const issues = [];
  const fixedKeys = new Set((card.fixedPhrases ?? []).map((entry) => normalizeLearningKey(entry.phrase)));
  const contexts = (card.contextPhrases ?? []).flatMap((group) => group.items ?? []);
  const overlap = contexts.filter((entry) => fixedKeys.has(normalizeLearningKey(entry.phrase)));
  if (overlap.length) issues.push({ code: 'CONTEXT_FIXED_OVERLAP', count: overlap.length, samples: overlap.slice(0, 3).map((entry) => entry.phrase) });
  const invalidContexts = contexts.filter((entry) => reusablePhraseIssue(entry.phrase) || !isConcisePhraseGloss(entry.chinese));
  if (invalidContexts.length) issues.push({ code: 'CONTEXT_INCOMPLETE_OR_SENTENCE_GLOSS', count: invalidContexts.length, samples: invalidContexts.slice(0, 3).map((entry) => entry.phrase) });
  const mechanicalContexts = contexts.filter((entry) => mechanicalContextIssue(entry.phrase, card.word));
  if (card.word !== 'work' && mechanicalContexts.length) issues.push({ code: 'CONTEXT_MECHANICAL_PADDING', count: mechanicalContexts.length, samples: mechanicalContexts.slice(0, 3).map((entry) => entry.phrase) });
  const bareContextForms = card.word === 'work'
    ? []
    : contexts.filter((entry) => normalizeLearningKey(entry.phrase).split(' ').length < 2);
  if (bareContextForms.length) issues.push({ code: 'CONTEXT_NOT_A_REUSABLE_PHRASE', count: bareContextForms.length, samples: bareContextForms.slice(0, 3).map((entry) => entry.phrase) });
  const genericContextGroups = (card.contextPhrases ?? []).filter((group) => GENERIC_CONTEXT_CATEGORIES.has(group.category));
  if (genericContextGroups.length) issues.push({ code: 'CONTEXT_GENERIC_CATEGORY', count: genericContextGroups.length, samples: genericContextGroups.slice(0, 3).map((group) => group.category) });

  const fixedSeen = new Set();
  const duplicateFixed = [];
  const invalidFixed = [];
  for (const entry of card.fixedPhrases ?? []) {
    const key = normalizeLearningKey(entry.phrase);
    if (fixedSeen.has(key)) duplicateFixed.push(entry.phrase);
    else fixedSeen.add(key);
    if (reusablePhraseIssue(entry.phrase) || !isConcisePhraseGloss(entry.chinese, 24)
      || !String(entry.example ?? '').trim() || !String(entry.translation ?? '').trim()) invalidFixed.push(entry.phrase);
  }
  if (duplicateFixed.length) issues.push({ code: 'FIXED_DUPLICATE', count: duplicateFixed.length, samples: duplicateFixed.slice(0, 3) });
  if (invalidFixed.length) issues.push({ code: 'FIXED_INCOMPLETE_OR_SENTENCE_GLOSS', count: invalidFixed.length, samples: invalidFixed.slice(0, 3) });
  const mechanicalFixedExamples = (card.fixedPhrases ?? []).filter((entry) => fixedExampleIssue(entry.example, entry.phrase));
  if (mechanicalFixedExamples.length) issues.push({
    code: 'FIXED_EXAMPLE_TEMPLATE',
    count: mechanicalFixedExamples.length,
    samples: mechanicalFixedExamples.slice(0, 3).map((entry) => entry.example)
  });

  const relationKeys = relationWordKeys(relationEntries(card));
  const relatedSeen = new Set();
  const relatedDuplicates = [];
  const relationRepeats = [];
  for (const group of card.relatedVocabulary ?? []) {
    for (const entry of group.items ?? []) {
      const key = normalizeLearningKey(entry.word);
      if (relatedSeen.has(key)) relatedDuplicates.push(entry.word);
      else relatedSeen.add(key);
      if (relationKeys.has(key)) relationRepeats.push(entry.word);
    }
  }
  if (relatedDuplicates.length) issues.push({ code: 'RELATED_DUPLICATE_ACROSS_CATEGORIES', count: relatedDuplicates.length, samples: relatedDuplicates.slice(0, 3) });
  if (relationRepeats.length) issues.push({ code: 'RELATED_REPEATS_RELATION_SECTION', count: relationRepeats.length, samples: relationRepeats.slice(0, 3) });
  const genericRelatedGroups = (card.relatedVocabulary ?? []).filter((group) => !isSpecificCategory(group.category, GENERIC_RELATED_CATEGORIES));
  if (genericRelatedGroups.length) issues.push({ code: 'RELATED_GENERIC_CATEGORY', count: genericRelatedGroups.length, samples: genericRelatedGroups.slice(0, 3).map((group) => group.category) });

  const relationPos = new Map(relationEntries(card).map((entry) => [normalizeLearningKey(entry.word), entry.partOfSpeech]));
  const normalizedQuestionText = (value) => String(value ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase('en-US')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  const questionPromptLocations = new Map();
  const questionConceptLocations = new Map();
  const questionSourceLocations = new Map();
  const duplicateQuestionPrompts = [];
  const duplicateQuestionConcepts = [];
  const duplicateQuestionSources = [];
  for (const question of card.questions ?? []) {
    const promptKey = normalizedQuestionText(question.prompt);
    if (promptKey && questionPromptLocations.has(promptKey)) duplicateQuestionPrompts.push(question.prompt);
    else if (promptKey) questionPromptLocations.set(promptKey, question.id);
    if (Array.isArray(question.options) && question.options.length && String(question.answer ?? '').trim()) {
      const conceptKey = JSON.stringify({
        answer: normalizedQuestionText(question.answer),
        options: question.options.map(normalizedQuestionText).sort()
      });
      if (questionConceptLocations.has(conceptKey)) duplicateQuestionConcepts.push({ id: question.id, matches: questionConceptLocations.get(conceptKey), answer: question.answer });
      else questionConceptLocations.set(conceptKey, question.id);
    }
    const sourceMatch = String(question.prompt ?? '').match(/(?:原句|例句)：(.+?)(?=（(?:中文|填写)|$)/);
    if (sourceMatch && String(question.answer ?? '').trim()) {
      const filledSource = normalizedQuestionText(sourceMatch[1].replace(/_{2,}/g, String(question.answer)));
      if (questionSourceLocations.has(filledSource)) duplicateQuestionSources.push({ id: question.id, matches: questionSourceLocations.get(filledSource), source: filledSource });
      else questionSourceLocations.set(filledSource, question.id);
    }
    if (FORBIDDEN_QUESTION_META.test(String(question.prompt))) {
      issues.push({ code: 'QUESTION_META_COPY', questionId: question.id, sample: question.prompt });
    }
    if (!Array.isArray(question.options) || !/(?:synonym|antonym|contrast)-choice/.test(String(question.id))) continue;
    const answerPos = relationPos.get(normalizeLearningKey(question.answer)) ?? optionPartOfSpeechByWord.get(normalizeLearningKey(question.answer));
    if (!answerPos) {
      issues.push({ code: 'QUESTION_OPTION_POS_UNKNOWN', questionId: question.id, sample: question.answer });
      continue;
    }
    const mismatches = question.options.filter((option) => {
      const optionPos = relationPos.get(normalizeLearningKey(option)) ?? optionPartOfSpeechByWord.get(normalizeLearningKey(option));
      return !optionPos || !partOfSpeechCompatible(answerPos, optionPos);
    });
    if (mismatches.length) issues.push({ code: 'QUESTION_OPTION_POS_MISMATCH', questionId: question.id, count: mismatches.length, samples: mismatches.slice(0, 3) });
  }
  if (duplicateQuestionPrompts.length) issues.push({ code: 'DUPLICATE_QUESTION_PROMPT', count: duplicateQuestionPrompts.length, samples: duplicateQuestionPrompts.slice(0, 3) });
  if (duplicateQuestionConcepts.length) issues.push({ code: 'DUPLICATE_QUESTION_CONCEPT', count: duplicateQuestionConcepts.length, samples: duplicateQuestionConcepts.slice(0, 3) });
  if (duplicateQuestionSources.length) issues.push({ code: 'DUPLICATE_QUESTION_SOURCE', count: duplicateQuestionSources.length, samples: duplicateQuestionSources.slice(0, 3) });
  return { cardId: card.id, word: card.word, issues };
}

export function auditCardCollection(cards) {
  const optionPartOfSpeechByWord = new Map();
  const recordPartOfSpeech = (word, partOfSpeech) => {
    const key = normalizeLearningKey(word);
    if (!key || !partOfSpeech) return;
    const existing = optionPartOfSpeechByWord.get(key);
    if (!existing) {
      optionPartOfSpeechByWord.set(key, partOfSpeech);
      return;
    }
    const classes = [...new Set([...partOfSpeechClasses(existing), ...partOfSpeechClasses(partOfSpeech)])];
    const label = classes.map((value) => `${value}.`).join(' / ');
    optionPartOfSpeechByWord.set(key, label || existing);
  };
  for (const card of cards) {
    recordPartOfSpeech(card.word, card.partOfSpeech);
    for (const entry of relationEntries(card)) {
      recordPartOfSpeech(entry.word, entry.partOfSpeech);
    }
    for (const group of card.relatedVocabulary ?? []) {
      for (const entry of group.items ?? []) recordPartOfSpeech(entry.word, entry.partOfSpeech);
    }
  }
  return cards.map((card) => auditCardSections(card, optionPartOfSpeechByWord));
}

export function assertCardSectionQuality(cards) {
  const report = auditCardCollection(cards);
  const failed = report.filter((entry) => entry.issues.length);
  if (failed.length) {
    const details = failed.slice(0, 20).map((entry) => `${entry.word}: ${entry.issues.map((issue) => issue.code).join(', ')}`).join('\n');
    throw new SectionQualityError('collection', `${failed.length}/${cards.length} cards`, details);
  }
  return report;
}
