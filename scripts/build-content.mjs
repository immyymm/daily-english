import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lexicon } from './lexicon.mjs';
import { confusables, families, secondarySenses } from './content-overrides.mjs';
import { cardOverrides } from './card-overrides.mjs';
import { curatedPhrases } from './curated-phrases.mjs';
import { ipaFor } from './phonetics.mjs';
import cocaRankData from './coca-ranks.json' with { type: 'json' };

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const contentCardsDir = path.join(root, 'content', 'cards');
const publicDailyDir = path.join(root, 'public', 'data', 'daily');
const publicDataDir = path.join(root, 'public', 'data');
const launchDate = new Date('2026-08-17T12:00:00+08:00');
const contentVersion = '2026.08.19.1';

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const primaryPos = (value) => value.split('/')[0].trim().replace('.', '');
const firstMeaning = (value) => value.split('；')[0];
const lexiconByWord = new Map(lexicon.map((item) => [item.w, item]));
const posLabels = { v: 'v.', n: 'n.', j: 'adj.', r: 'adv.' };
const familyPosOverrides = {
  likelihood: 'n.', belief: 'n.', memory: 'n.', comparison: 'n.', chosen: 'adj.', effect: 'n.', discovery: 'n.',
  opportune: 'adj.', serve: 'v.', advise: 'v.', difficulty: 'n.', unaware: 'adj.', unfamiliar: 'adj.', comfort: 'n.',
  certainty: 'n.', uncertain: 'adj.', near: 'adj. / adv.', simple: 'adj.', quick: 'adj.', direct: 'adj. / adv.',
  healthy: 'adj.', unhealthy: 'adj.', workplace: 'n.', speech: 'n.', businesslike: 'adj.', teamwork: 'n.', unlikely: 'adj.'
};
const uncountableNouns = new Set([
  'effort', 'experience', 'information', 'service', 'value', 'behavior', 'attention', 'progress', 'confidence',
  'quality', 'success', 'advice', 'health', 'work', 'study', 'travel', 'money', 'business', 'time', 'language'
]);

function familyPartOfSpeech(word) {
  const known = lexiconByWord.get(word);
  if (known) return known.p;
  if (familyPosOverrides[word]) return familyPosOverrides[word];
  if (/(tion|sion|ment|ness|ity|ance|ence|ship|er|or|ism|hood)$/.test(word)) return 'n.';
  if (/ly$/.test(word)) return 'adv.';
  if (/(able|ible|ive|ous|ful|less|al|ic|ed|ing|ent|ant|ary)$/.test(word)) return 'adj.';
  return 'word family';
}

function relatedChinese(word, item, relation) {
  const known = lexiconByWord.get(word);
  if (known) return firstMeaning(known.zh);
  if (relation === 'synonym') return '与“' + firstMeaning(item.zh) + '”意义接近';
  if (relation === 'antonym') return '与“' + firstMeaning(item.zh) + '”意义相反';
  return '与 ' + item.w + ' 同词族的常用词形';
}

function syllableHint(word) {
  const hints = {
    improve: 'im·prove', notice: 'no·tice', support: 'sup·port', likely: 'like·ly', manage: 'man·age',
    provide: 'pro·vide', understand: 'un·der·stand', believe: 'be·lieve', create: 'cre·ate', include: 'in·clude',
    remember: 're·mem·ber', continue: 'con·tin·ue', consider: 'con·sid·er', develop: 'de·vel·op',
    explain: 'ex·plain', prepare: 'pre·pare', achieve: 'a·chieve', compare: 'com·pare',
    ability: 'a·bil·i·ty', opportunity: 'op·por·tu·ni·ty', relationship: 're·la·tion·ship',
    environment: 'en·vi·ron·ment', information: 'in·for·ma·tion', community: 'com·mu·ni·ty',
    important: 'im·por·tant', available: 'a·vail·a·ble', possible: 'pos·si·ble',
    difficult: 'dif·fi·cult', responsible: 're·spon·si·ble', effective: 'ef·fec·tive',
    actually: 'ac·tu·al·ly', probably: 'prob·a·bly', especially: 'es·pe·cial·ly',
    language: 'lan·guage', activity: 'ac·tiv·i·ty', situation: 'sit·u·a·tion'
  };
  if (hints[word]) return hints[word];
  const groups = word.toLowerCase().replace(/e$/, '').match(/[aeiouy]+/g)?.length ?? 1;
  return groups <= 1 ? word + '（单音节）' : word + '（约 ' + groups + ' 音节）';
}

function extractExampleChunk(item) {
  const words = item.ex.replace(/[.!?,;:]/g, '').split(/\s+/);
  const stem = item.w.slice(0, Math.min(4, item.w.length)).toLowerCase();
  const index = words.findIndex((word) => word.toLowerCase().startsWith(stem));
  if (index < 0) return item.coll;
  return words.slice(Math.max(0, index - 2), Math.min(words.length, index + 4)).join(' ');
}

function genericPhraseTuples(item) {
  const p = item.p;
  if (p.startsWith('v.')) {
    return [
      [item.coll, item.collZh],
      ['to ' + item.coll, '去' + item.collZh],
      ['need to ' + item.coll, '需要' + item.collZh],
      ['try to ' + item.coll, '尝试' + item.collZh],
      ['can ' + item.coll, '能够' + item.collZh],
      ['how to ' + item.coll, '如何' + item.collZh],
      ['learn to ' + item.coll, '学会' + item.collZh],
      [item.coll + ' well', '很好地' + item.collZh],
      [item.w + ' in practice', '在实际语境中使用 ' + item.w],
      [item.w + ' more effectively', '更有效地' + item.collZh],
      [item.w + ' when necessary', '在必要时' + item.collZh],
      [item.w + ' over time', '逐步' + item.collZh]
    ];
  }
  if (p.startsWith('n.')) {
    const determiner = uncountableNouns.has(item.w) ? item.w : 'the ' + item.w;
    return [
      [item.coll, item.collZh],
      [determiner + ' in daily life', '日常生活中的' + firstMeaning(item.zh)],
      [determiner + ' at work', '工作中的' + firstMeaning(item.zh)],
      ['the importance of ' + item.w, firstMeaning(item.zh) + '的重要性'],
      ['focus on ' + item.w, '关注' + firstMeaning(item.zh)],
      ['talk about ' + item.w, '谈论' + firstMeaning(item.zh)],
      ['understand ' + item.w, '理解' + firstMeaning(item.zh)],
      [item.w + ' and ' + item.syn, item.w + ' 与 ' + item.syn],
      [item.w + ' or ' + item.ant, item.w + ' 或 ' + item.ant],
      [item.w + ' in context', '语境中的 ' + item.w],
      ['a better understanding of ' + item.w, '更好地理解' + firstMeaning(item.zh)],
      [item.w + ' matters', firstMeaning(item.zh) + '很重要']
    ];
  }
  if (p.includes('adj.')) {
    return [
      [item.coll, item.collZh],
      ['be ' + item.w, '是' + firstMeaning(item.zh) + '的'],
      ['seem ' + item.w, '显得' + firstMeaning(item.zh)],
      ['remain ' + item.w, '保持' + firstMeaning(item.zh)],
      ['become ' + item.w, '变得' + firstMeaning(item.zh)],
      ['feel ' + item.w, '感觉' + firstMeaning(item.zh)],
      ['very ' + item.w, '非常' + firstMeaning(item.zh)],
      ['more ' + item.w, '更加' + firstMeaning(item.zh)],
      ['less ' + item.w, '不那么' + firstMeaning(item.zh)],
      [item.w + ' enough', '足够' + firstMeaning(item.zh)],
      [item.w + ' in context', '在语境中理解 ' + item.w],
      [item.w + ', not ' + item.ant, item.w + '，而非 ' + item.ant]
    ];
  }
  return [
    [item.coll, item.collZh],
    ['use ' + item.w + ' correctly', '正确使用 ' + item.w],
    [item.w + ' in conversation', '对话中的 ' + item.w],
    [item.w + ' in a sentence', '句子中的 ' + item.w],
    ['say ' + item.w + ' naturally', '自然地说出 ' + item.w],
    ['listen for ' + item.w, '留意听辨 ' + item.w],
    ['write ' + item.w, '写出 ' + item.w],
    ['the adverb ' + item.w, '副词 ' + item.w],
    [item.w + ' in context', '语境中的 ' + item.w],
    [item.w + ', not ' + item.syn, item.w + '，而非 ' + item.syn],
    ['practice ' + item.w, '练习使用 ' + item.w],
    ['remember ' + item.w, '记住 ' + item.w]
  ];
}

function genericErrors(item) {
  if (item.p.startsWith('v.')) {
    return [
      ['can to ' + item.w, 'can ' + item.w, '情态动词 can 后直接接动词原形，不加 to。'],
      ['to ' + item.w + 'ing', 'to ' + item.w, '不定式 to 后接动词原形；不要把不定式和 -ing 形式混合。']
    ];
  }
  if (item.p.startsWith('n.')) {
    return [
      ['use ' + item.w + ' with the same article in every context', 'check the countability of ' + item.w + ' in context', '同一个名词在不同义项下可能有可数、不可数或单复数差异，不能机械套用冠词。'],
      ['translate ' + item.w + ' word by word', 'learn the complete phrase “' + item.coll + '”', '不要只按中文逐字替换；优先把本卡高频搭配作为完整句块记忆。']
    ];
  }
  if (item.p.includes('adj.')) {
    return [
      ['feel ' + item.w + 'ly', 'feel ' + item.w, '系动词 feel 后接形容词作表语，不随意加 -ly。'],
      ['more ' + item.w + 'er', 'more ' + item.w, '较长形容词通常用 more 构成比较级，不重复加 -er。']
    ];
  }
  return [
    ['a ' + item.w + ' answer', 'use ' + item.w + ' to modify the statement', '副词通常不直接放在名词前作定语，应根据句意放在动词、形容词或整个分句旁。'],
    [item.w + 'ly', item.w, item.w + ' 本身已经是本卡要学的形式，不要再次机械添加 -ly。']
  ];
}

function normalizeMeanings(item, override) {
  if (override?.meanings) {
    return override.meanings.map(([partOfSpeech, english, chinese, example, translation]) => ({ partOfSpeech, english, chinese, example, translation }));
  }
  const secondary = secondarySenses[item.w];
  return [
    { partOfSpeech: item.p.split('/')[0].trim(), english: item.en, chinese: firstMeaning(item.zh), example: item.ex, translation: item.exZh },
    ...(secondary ? [secondary] : [])
  ];
}

function normalizeStructures(item, override, tuples) {
  const source = override?.structures ?? tuples.slice(0, 4);
  return source.map(([phrase, chinese]) => ({ phrase, phonetic: ipaFor(phrase, item.w, item.ipa), chinese }));
}

function normalizeErrors(item, override) {
  const source = override?.errors ?? genericErrors(item);
  return source.map(([wrong, right, note]) => ({
    wrong,
    wrongPhonetic: ipaFor(wrong, item.w, item.ipa),
    right,
    rightPhonetic: ipaFor(right, item.w, item.ipa),
    note
  }));
}

function normalizeContexts(item, override, tuples) {
  const source = override?.contexts ?? [
    ['核心高频搭配', tuples.slice(0, 3)],
    ['句型与语法框架', tuples.slice(3, 6)],
    ['真实表达延伸', tuples.slice(6, 9)],
    ['主动输出提示', tuples.slice(9, 12)]
  ];
  return source.map(([category, items]) => ({
    category,
    items: items.map(([phrase, chinese]) => ({ phrase, phonetic: ipaFor(phrase, item.w, item.ipa), chinese }))
  }));
}

function genericPhraseExample(item, phrase, index) {
  if (index === 0) return [item.ex, item.exZh];
  const templates = [
    ['The phrase “' + phrase + '” is useful in everyday English.', '“' + phrase + '”是日常英语中的实用表达。'],
    ['I added “' + phrase + '” to my vocabulary notebook.', '我把“' + phrase + '”记进了词汇本。'],
    ['Listen for “' + phrase + '” in real conversations.', '在真实对话中留意“' + phrase + '”。'],
    ['Can you use “' + phrase + '” in a complete sentence?', '你能用“' + phrase + '”说一个完整句子吗？'],
    ['We practiced “' + phrase + '” aloud three times.', '我们把“' + phrase + '”大声练了三遍。']
  ];
  return templates[(index - 1) % templates.length];
}

function normalizeFixedPhrases(item, override, tuples) {
  const source = override?.phrases ?? tuples.slice(0, 8).map(([phrase, chinese], index) => {
    const [example, translation] = genericPhraseExample(item, phrase, index);
    return [phrase, chinese, example, translation];
  });
  return source.map(([phrase, chinese, example, translation]) => ({
    phrase,
    phonetic: ipaFor(phrase, item.w, item.ipa),
    chinese,
    example,
    translation
  }));
}

function normalizeRelations(item, override, key) {
  if (override?.[key]) {
    const noteKey = key === 'synonyms' || key === 'confusables' ? 'difference' : key === 'antonyms' ? 'usage' : 'note';
    return override[key].map(([word, partOfSpeech, chinese, note]) => ({
      word,
      phonetic: ipaFor(word),
      partOfSpeech,
      chinese,
      [noteKey]: note
    }));
  }
  if (key === 'synonyms') {
    return [{
      word: item.syn,
      phonetic: ipaFor(item.syn),
      partOfSpeech: item.p,
      chinese: relatedChinese(item.syn, item, 'synonym'),
      difference: item.w + ' 是本卡核心搭配 “' + item.coll + '” 中的中性常用选择；' + item.syn + ' 含义接近，但语体、宾语范围和固定搭配可能不同，不能机械互换。'
    }];
  }
  if (key === 'antonyms') {
    return [{
      word: item.ant,
      phonetic: ipaFor(item.ant),
      partOfSpeech: item.p,
      chinese: relatedChinese(item.ant, item, 'antonym'),
      usage: '在本卡核心义下与 ' + item.w + ' 构成最直接的语义对比；实际使用前仍要核对词性和句型。'
    }];
  }
  return [];
}

function normalizeDerivatives(item, override) {
  if (override?.derivatives) {
    return override.derivatives.map(([word, partOfSpeech, chinese, note]) => ({ word, phonetic: ipaFor(word), partOfSpeech, chinese, note }));
  }
  return (families[item.w] ?? []).filter((word) => word !== item.w).map((word) => ({
    word,
    phonetic: ipaFor(word),
    partOfSpeech: familyPartOfSpeech(word),
    chinese: relatedChinese(word, item, 'family'),
    note: '这是 ' + item.w + ' 的常用词族成员；先辨认词性，再放进完整句子中使用。'
  }));
}

function normalizeConfusables(item, override) {
  if (override?.confusables) {
    return normalizeRelations(item, override, 'confusables');
  }
  return confusables[item.w] ? [{ ...confusables[item.w], phonetic: ipaFor(confusables[item.w].word) }] : [];
}

function vocabularyItem(word, fallbackPos = 'word') {
  const known = lexiconByWord.get(word);
  return {
    word,
    phonetic: known?.ipa ?? ipaFor(word),
    partOfSpeech: known?.p ?? familyPartOfSpeech(word) ?? fallbackPos,
    chinese: known ? firstMeaning(known.zh) : '与本词相关的常用表达'
  };
}

function normalizeRelated(item, index, override, derivatives) {
  if (override?.related) {
    return override.related.map(([category, items]) => ({
      category,
      items: items.map(([word, partOfSpeech, chinese]) => ({ word, phonetic: ipaFor(word), partOfSpeech, chinese }))
    }));
  }
  const nearby = [-2, -1, 1, 2].map((offset) => lexicon[(index + offset + lexicon.length) % lexicon.length].w);
  const familyWords = derivatives.slice(0, 3).map((entry) => entry.word);
  const familyOrPeers = [...new Set([...familyWords, ...nearby])].slice(0, 3);
  return [
    { category: '语义坐标：近义与反义', items: [vocabularyItem(item.syn), vocabularyItem(item.ant)] },
    {
      category: familyWords.length ? '词族与构词联系' : '同词性高频词',
      items: familyOrPeers.map((word) => vocabularyItem(word))
    },
    { category: '同一学习主题中的高频词', items: nearby.map((word) => vocabularyItem(word)) }
  ];
}

function normalizeExamples(item, override) {
  if (override?.examples) {
    return override.examples.map(([scene, english, chinese]) => ({ scene, english, chinese }));
  }
  return [
    { scene: '核心真实用法', english: item.ex, chinese: item.exZh },
    { scene: '英文释义理解', english: 'In this lesson, I learned that “' + item.w + '” means “' + item.en + '”.', chinese: '这节课里，我学到 ' + item.w + ' 的核心意思是“' + item.zh + '”。' },
    { scene: '高频搭配辨认', english: 'The phrase “' + item.coll + '” is useful in everyday English.', chinese: '“' + item.coll + '”是日常英语中的实用表达。' },
    { scene: '主动造句', english: 'Can you use “' + item.w + '” in a sentence of your own?', chinese: '你能用 ' + item.w + ' 说一个自己的句子吗？' },
    { scene: '词汇笔记', english: 'I wrote “' + item.w + '” and its pronunciation in my notebook.', chinese: '我把 ' + item.w + ' 和它的发音记进了笔记本。' },
    { scene: '听力辨认', english: 'Listen for “' + item.w + '” the next time you hear English.', chinese: '下次听英语时，留意辨认 ' + item.w + '。' },
    { scene: '近义比较', english: 'I compared “' + item.w + '” with “' + item.syn + '” before choosing the word.', chinese: '选词前，我比较了 ' + item.w + ' 和 ' + item.syn + '。' },
    { scene: '反义对照', english: 'The opposite idea is often expressed with “' + item.ant + '”.', chinese: '相反的意思常可用 ' + item.ant + ' 表达。' },
    { scene: '间隔复习', english: 'I reviewed “' + item.w + '” again before going to bed.', chinese: '睡前我又复习了一遍 ' + item.w + '。' },
    { scene: '口语输出', english: 'Which real situation would make you use “' + item.w + '”?', chinese: '在什么真实情境中你会用到 ' + item.w + '？' }
  ];
}

function rotateOptions(options, seed) {
  const unique = [...new Set(options.filter(Boolean))];
  const start = unique.length ? seed % unique.length : 0;
  return unique.slice(start).concat(unique.slice(0, start));
}

function relationOptions(answer, candidates, index) {
  const distractors = [...new Set(candidates.filter((candidate) => candidate && candidate !== answer))].slice(0, 3);
  return rotateOptions([answer, ...distractors], index);
}

const irregularForms = {
  be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'], become: ['became', 'becoming'], build: ['built'],
  choose: ['chose', 'chosen'], deal: ['dealt'], do: ['does', 'did', 'done', 'doing'], feel: ['felt'], find: ['found'],
  give: ['gave', 'given'], have: ['has', 'had'], make: ['made'], mean: ['meant'], run: ['ran', 'running'],
  speak: ['spoke', 'spoken'], spend: ['spent'], take: ['took', 'taken'], tell: ['told'], understand: ['understood'],
  write: ['wrote', 'written']
};

function inflectedForms(word) {
  const forms = new Set([word, word + 's', word + 'es', word + 'ed', word + 'ing']);
  if (word.endsWith('e')) {
    forms.add(word + 'd');
    forms.add(word.slice(0, -1) + 'ing');
  }
  if (/[^aeiou]y$/.test(word)) {
    forms.add(word.slice(0, -1) + 'ies');
    forms.add(word.slice(0, -1) + 'ied');
  }
  if (/[^aeiou][aeiou][^aeiouwxy]$/.test(word)) {
    forms.add(word + word.at(-1) + 'ed');
    forms.add(word + word.at(-1) + 'ing');
  }
  (irregularForms[word] ?? []).forEach((form) => forms.add(form));
  return forms;
}

function wordsWithOffsets(text) {
  return [...text.matchAll(/[A-Za-z]+(?:'[A-Za-z]+)?/g)].map((match) => ({
    text: match[0],
    index: match.index
  }));
}

function blankWord(text, word) {
  return text.slice(0, word.index) + '_____' + text.slice(word.index + word.text.length);
}

function clozeTargetQuestion(id, promptPrefix, text, targetWord, stage) {
  const forms = inflectedForms(targetWord.toLowerCase());
  const matched = wordsWithOffsets(text).find((word) => forms.has(word.text.toLowerCase()));
  if (!matched) throw new Error(id + ': source text does not contain a valid form of ' + targetWord);
  return {
    id,
    type: 'collocation',
    prompt: promptPrefix + blankWord(text, matched) + '（填写 ' + targetWord + ' 的正确形式）' + slotGuidance(text),
    answer: matched.text,
    stage,
    ai: false
  };
}

function clozeStructureQuestion(id, promptPrefix, text, targetWord, stage, position) {
  const words = wordsWithOffsets(text);
  const forms = inflectedForms(targetWord.toLowerCase());
  const targetIndex = words.findIndex((word) => forms.has(word.text.toLowerCase()));
  const preferredIndex = position === 'after-target' ? targetIndex + 1 : words.length - 1;
  const selected = words[preferredIndex] && !forms.has(words[preferredIndex].text.toLowerCase())
    ? words[preferredIndex]
    : words.find((word) => !forms.has(word.text.toLowerCase()));
  if (!selected) throw new Error(id + ': source phrase needs a non-target structure word');
  return { id, type: 'collocation', prompt: promptPrefix + blankWord(text, selected) + slotGuidance(text), answer: selected.text, stage, ai: false };
}

function phraseMeaningQuestion(id, entry, candidates, stage, index) {
  return {
    id,
    type: 'collocation',
    prompt: '词卡结构辨义（' + (index % 2 === 0 ? '一' : '二') + '）：哪一个结构或搭配表示“' + entry.chinese + '”？' + slotGuidance(entry.phrase),
    options: relationOptions(entry.phrase, candidates.map((candidate) => candidate.phrase), index),
    answer: entry.phrase,
    stage,
    ai: false
  };
}

function slotGuidance(phrase) {
  const notes = [];
  if (/\bto do\b/i.test(phrase)) notes.push('do 代表任意合适的动词原形，不要求写出单词 do');
  if (/\bdoing\b/i.test(phrase)) notes.push('doing 代表符合语境的动词 -ing 形式，不要求写出单词 doing');
  if (/\bdone\b/i.test(phrase)) notes.push('done 代表符合语境的过去分词，不要求写出单词 done');
  if (/\bsomeone\b/i.test(phrase)) notes.push('someone 要替换成实际的人或代词');
  if (/\bsomething\b/i.test(phrase)) notes.push('something 要替换成实际的事物或内容');
  if (/\byourself\b/i.test(phrase)) notes.push('yourself 要替换成与主语一致的 myself、yourself、herself 等正确形式');
  if (/\bA\b/.test(phrase) || /\bB\b/.test(phrase)) notes.push('A、B 要替换成实际比较内容');
  return notes.length ? '；' + notes.join('；') : '';
}

function makeCard(item, index) {
  const id = slug(item.w + '-' + primaryPos(item.p));
  const override = cardOverrides[item.w];
  const tuples = [...(curatedPhrases[item.w] ?? []), ...genericPhraseTuples(item)]
    .filter(([phrase], tupleIndex, source) => source.findIndex(([candidate]) => candidate === phrase) === tupleIndex)
    .slice(0, 12);
  const structures = normalizeStructures(item, override, tuples);
  const commonErrors = normalizeErrors(item, override);
  const meanings = normalizeMeanings(item, override);
  const contextPhrases = normalizeContexts(item, override, tuples);
  const fixedPhrases = normalizeFixedPhrases(item, override, tuples);
  const synonyms = normalizeRelations(item, override, 'synonyms');
  const antonyms = normalizeRelations(item, override, 'antonyms');
  const derivatives = normalizeDerivatives(item, override);
  const confusableItems = normalizeConfusables(item, override);
  const relatedVocabulary = normalizeRelated(item, index, override, derivatives);
  const examples = normalizeExamples(item, override);
  const wordFamily = derivatives.map((entry) => entry.word);
  const focus = override?.focus ?? [
    item.zh + '；英文核心释义：' + item.en + '。',
    '把 “' + item.coll + '” 作为一个完整句块记忆。',
    commonErrors[0].note,
    item.ex
  ];
  const ranks = (cocaRankData[item.w] ?? []).map((entry) => ({
    ...entry,
    partOfSpeech: posLabels[entry.pos] ?? entry.pos
  }));
  const cocaRankLabel = ranks.length
    ? ranks.map((entry) => entry.partOfSpeech + ' 第 ' + entry.rank + ' 名').join('；')
    : 'COCA 高频精选';
  const next = lexicon[(index + 17) % lexicon.length];
  const nextTwo = lexicon[(index + 43) % lexicon.length];
  const meaningOptions = rotateOptions([item.zh, next.zh, nextTwo.zh], index);
  const englishMeaningOptions = rotateOptions([meanings[0].english, next.en, nextTwo.en], index + 1);
  const structureOptions = relationOptions(structures[0].phrase, [next.coll, nextTwo.coll, fixedPhrases[1]?.phrase], index + 2);
  const synonymAnswer = synonyms[0].word;
  const antonymAnswer = antonyms[0].word;
  const synonymOptions = relationOptions(synonymAnswer, [antonymAnswer, confusableItems[0]?.word, next.w, nextTwo.w], index + 3);
  const antonymOptions = relationOptions(antonymAnswer, [synonymAnswer, confusableItems[0]?.word, next.w, nextTwo.w], index + 4);
  const contrast = confusableItems[0] ?? derivatives[0] ?? synonyms[0];
  const contrastKind = confusableItems[0] ? '易混词' : derivatives[0] ? '派生词' : '相关近义词';
  const contrastOptions = relationOptions(contrast.word, [synonymAnswer, antonymAnswer, next.w, nextTwo.w], index + 5);
  const firstContextEntry = contextPhrases[0]?.items[0] ?? { phrase: item.coll, chinese: item.collZh };
  const firstContextPhrase = firstContextEntry.phrase;
  const firstFixedEntry = fixedPhrases[0] ?? { phrase: item.coll, chinese: item.collZh };
  const firstFixedPhrase = firstFixedEntry.phrase;
  const secondFixedEntry = fixedPhrases.find((entry) => entry.phrase !== firstFixedPhrase)
    ?? { phrase: structures[1]?.phrase ?? item.coll, chinese: structures[1]?.chinese ?? item.collZh };
  const questions = [
    { id: id + '-meaning-core', type: 'meaning_choice', prompt: '“' + item.w + '”最核心的中文含义是？', options: meaningOptions, answer: item.zh, stage: 'T0', ai: false },
    { id: id + '-meaning-english', type: 'meaning_choice', prompt: '哪一项英文释义最符合词卡中的 “' + item.w + '”？', options: englishMeaningOptions, answer: meanings[0].english, stage: 'T0', ai: false },
    { id: id + '-structure-choice', type: 'meaning_choice', prompt: '哪一个是词卡要求优先记住的 “' + item.w + '” 核心结构？', options: structureOptions, answer: structures[0].phrase, stage: 'T1', ai: false },
    { id: id + '-synonym-choice', type: 'meaning_choice', prompt: '哪个词是词卡中列出的 “' + item.w + '” 最直接近义词？', options: synonymOptions, answer: synonymAnswer, stage: 'T2', ai: false },
    { id: id + '-antonym-choice', type: 'meaning_choice', prompt: '哪个词是词卡中列出的 “' + item.w + '” 最直接反义词？', options: antonymOptions, answer: antonymAnswer, stage: 'T2', ai: false },
    { id: id + '-contrast-choice', type: 'meaning_choice', prompt: '根据本词卡辨析，哪个词被列为 “' + item.w + '” 的' + contrastKind + '？', options: contrastOptions, answer: contrast.word, stage: 'T3', ai: false },
    { id: id + '-recall-definition', type: 'recall', prompt: '根据英文释义写出目标词：' + meanings[0].english, answer: item.w, stage: 'T1', ai: false },
    { id: id + '-recall-chinese', type: 'recall', prompt: '写出符合“' + item.zh + '”（' + item.p + '）的本课目标词。', answer: item.w, stage: 'T1', ai: false },
    clozeTargetQuestion(id + '-collocation-core', '补全高频搭配：', item.coll, item.w, 'T0'),
    clozeStructureQuestion(id + '-collocation-structure', '补全核心结构中的连接成分：', structures[0].phrase, item.w, 'T1', 'after-target'),
    clozeStructureQuestion(id + '-collocation-context', '根据语境补全搭配：', firstContextPhrase, item.w, 'T2', 'tail'),
    phraseMeaningQuestion(id + '-collocation-fixed-1', firstFixedEntry, fixedPhrases, 'T2', index + 6),
    phraseMeaningQuestion(id + '-collocation-fixed-2', secondFixedEntry, fixedPhrases, 'T3', index + 7),
    clozeTargetQuestion(id + '-example-cloze', '根据句意补全词卡核心例句：', item.ex, item.w, 'T3'),
    { id: id + '-sentence-core', type: 'free_sentence', prompt: '请用 “' + item.w + '” 写一个自然、真实的英文句子，含义必须符合词卡核心义“' + item.zh + '”。', answer: '', stage: 'T2', ai: true },
    { id: id + '-sentence-phrase', type: 'free_sentence', prompt: '请使用 “' + firstFixedPhrase + '” 结构写一个与自己有关的自然英文句子' + slotGuidance(firstFixedPhrase) + '。', answer: '', stage: 'T3', ai: true },
    { id: id + '-dialogue', type: 'dialogue', prompt: '写一段 2–4 轮真实对话，自然使用 “' + item.w + '” 和 “' + firstContextPhrase + '” 结构，并避免中文直译' + slotGuidance(firstContextPhrase) + '。', answer: '', stage: 'T4', ai: true }
  ];

  return {
    id,
    word: item.w,
    lemma: item.w,
    cocaRanks: ranks,
    cocaRankLabel,
    phonetic: item.ipa,
    syllables: syllableHint(item.w),
    partOfSpeech: item.p,
    frequencyBand: 'COCA 高频精选 · ' + cocaRankLabel,
    difficulty: index < 50 ? '基础' : index < 110 ? '进阶' : '应用',
    tags: [item.p.split('/')[0].trim(), '模板完整版', index < 50 ? '高频表达' : '主动词汇'],
    coreMemory: {
      chinese: item.zh,
      english: meanings.map((meaning) => meaning.partOfSpeech + ' ' + meaning.english).join('；'),
      structure: structures.map((entry) => entry.phrase + ' ' + entry.phonetic + '（' + entry.chinese + '）').join('；'),
      structures,
      commonError: commonErrors.map((entry) => '❌ ' + entry.wrong + ' → ✅ ' + entry.right).join('；'),
      commonErrors,
      directSynonym: synonyms.map((entry) => entry.word + ' ' + entry.phonetic + '（' + entry.chinese + '）').join('；'),
      directAntonym: antonyms.map((entry) => entry.word + ' ' + entry.phonetic + '（' + entry.chinese + '）').join('；'),
      derivatives: wordFamily.length ? wordFamily.join(' · ') : '本词暂无需额外强记的高频派生词',
      example: item.ex,
      exampleChinese: item.exZh
    },
    meanings,
    contextPhrases,
    fixedPhrases,
    synonyms,
    antonyms,
    derivatives,
    confusables: confusableItems,
    relatedVocabulary,
    examples,
    studyFocus: {
      coreMeaning: focus[0],
      keyCollocation: focus[1],
      commonMistake: focus[2],
      mustUseExample: focus[3]
    },
    questions,
    reviewStages: {
      T0: ['meaning_choice', 'collocation', 'free_sentence'], T1: ['meaning_choice', 'recall', 'collocation'],
      T2: ['meaning_choice', 'recall', 'collocation', 'free_sentence'], T3: ['meaning_choice', 'recall', 'collocation', 'dialogue'],
      T4: ['meaning_choice', 'recall', 'collocation', 'free_sentence', 'dialogue'],
      T5: ['meaning_choice', 'recall', 'collocation', 'free_sentence', 'dialogue'],
      T6: ['meaning_choice', 'recall', 'collocation', 'free_sentence', 'dialogue'],
      T7: ['meaning_choice', 'recall', 'collocation', 'free_sentence', 'dialogue']
    },
    detailLevel: 'template-complete',
    contentVersion,
    reviewed: true,
    sourceNote: override
      ? '从用户提供的 COCA 词表筛选；本卡依照用户词卡模板人工精校；音标为美式发音。'
      : '从用户提供的 COCA 词表筛选；依照完整十章节模板离线整理；词频来自用户词表，关系词与词组音标来自 CMU 北美英语发音词典。'
  };
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

await fs.mkdir(contentCardsDir, { recursive: true });
await fs.mkdir(publicDailyDir, { recursive: true });

const cards = lexicon.map(makeCard);
for (const card of cards) {
  await fs.writeFile(path.join(contentCardsDir, card.id + '.json'), JSON.stringify(card, null, 2) + '\n', 'utf8');
}

const dailyFiles = [];
for (let dayIndex = 0; dayIndex < 30; dayIndex += 1) {
  const date = new Date(launchDate);
  date.setDate(launchDate.getDate() + dayIndex);
  const dateKey = formatDate(date);
  const dailyCards = cards.slice(dayIndex * 5, dayIndex * 5 + 5);
  const fileName = dateKey + '.json';
  const dailyPack = { date: dateKey, dayNumber: dayIndex + 1, contentVersion, cards: dailyCards };
  await fs.writeFile(path.join(publicDailyDir, fileName), JSON.stringify(dailyPack, null, 2) + '\n', 'utf8');
  dailyFiles.push({ dayNumber: dayIndex + 1, date: dateKey, file: 'data/daily/' + fileName, cardIds: dailyCards.map((card) => card.id) });
}

await fs.writeFile(path.join(publicDataDir, 'all-cards.json'), JSON.stringify({ contentVersion, total: cards.length, cards }, null, 2) + '\n', 'utf8');
await fs.writeFile(path.join(publicDataDir, 'manifest.json'), JSON.stringify({
  appName: '每日英语', contentVersion, totalCards: cards.length, totalDays: dailyFiles.length,
  cardsPerDay: 5, scheduleStart: formatDate(launchDate), dailyFiles
}, null, 2) + '\n', 'utf8');
await fs.writeFile(path.join(root, 'content', 'content-manifest.json'), JSON.stringify({
  source: 'COCA词频单词表.xlsx', generatedAt: '2026-08-17', contentVersion,
  detailLevel: 'template-complete', cardIds: cards.map((card) => card.id)
}, null, 2) + '\n', 'utf8');

console.log('Generated ' + cards.length + ' template-complete cards and ' + dailyFiles.length + ' daily files.');
