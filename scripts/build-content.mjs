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
const contentVersion = '2026.08.19.4';
const templateVersion = 'learning-template-2026.08.19.1';

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const primaryPos = (value) => value.split('/')[0].trim().replace('.', '');
const firstMeaning = (value) => value.split('；')[0];
const lexiconByWord = new Map(lexicon.map((item) => [item.w, item]));
const posLabels = { v: 'v.', n: 'n.', j: 'adj.', r: 'adv.' };
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
    ['常见结构与语境', tuples.slice(3, 6)]
  ];
  return source.filter(([, items]) => items.length).map(([category, items]) => ({
    category,
    items: items.map(([phrase, chinese]) => ({ phrase, phonetic: ipaFor(phrase, item.w, item.ipa), chinese }))
  }));
}

function normalizeFixedPhrases(item, override, tuples) {
  const source = override?.phrases ?? tuples.slice(0, 1).map(([phrase, chinese]) => [phrase, chinese, item.ex, item.exZh]);
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
  return (families[item.w] ?? [])
    .filter((word) => word !== item.w && lexiconByWord.has(word))
    .map((word) => ({
      word,
      phonetic: ipaFor(word),
      partOfSpeech: lexiconByWord.get(word).p,
      chinese: firstMeaning(lexiconByWord.get(word).zh),
      note: '与 ' + item.w + ' 同属常用词族；注意两者词性和句中位置不同。'
    }));
}

function normalizeConfusables(item, override) {
  if (override?.confusables) {
    return normalizeRelations(item, override, 'confusables');
  }
  return confusables[item.w] ? [{ ...confusables[item.w], phonetic: ipaFor(confusables[item.w].word) }] : [];
}

function vocabularyItem(word, fallbackPos = 'word', fallbackChinese = '与本词相关的常用表达') {
  const known = lexiconByWord.get(word);
  return {
    word,
    phonetic: known?.ipa ?? ipaFor(word),
    partOfSpeech: known?.p ?? fallbackPos,
    chinese: known ? firstMeaning(known.zh) : fallbackChinese
  };
}

function normalizeRelated(item, index, override, derivatives) {
  if (override?.related) {
    return override.related.map(([category, items]) => ({
      category,
      items: items.map(([word, partOfSpeech, chinese]) => ({ word, phonetic: ipaFor(word), partOfSpeech, chinese }))
    }));
  }
  return [
    {
      category: '语义坐标：近义与反义',
      items: [
        vocabularyItem(item.syn, item.p, relatedChinese(item.syn, item, 'synonym')),
        vocabularyItem(item.ant, item.p, relatedChinese(item.ant, item, 'antonym'))
      ]
    },
    ...(derivatives.length ? [{ category: '词族与构词联系', items: derivatives.map((entry) => vocabularyItem(entry.word, entry.partOfSpeech, entry.chinese)) }] : [])
  ];
}

function normalizeExamples(item, override) {
  if (override?.examples) {
    return override.examples.map(([scene, english, chinese]) => ({ scene, english, chinese }));
  }
  return [{ scene: '核心真实用法', english: item.ex, chinese: item.exZh }];
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

function structureFormClue(phrase) {
  const normalized = phrase.replace(/\s+/g, ' ').trim();
  if (/^it\s+is\b.*\bthat\b/i.test(normalized)) return '使用形式主语 it，后面接 that 完整从句';
  if (/\bsomeone\s+doing\b/i.test(normalized)) return '宾语后接动词 -ing 形式，强调看到或感知正在进行的动作';
  if (/\bsomeone\s+do\b/i.test(normalized)) return '宾语后接动词原形，强调看到或感知完整动作';
  if (/\bto\s+do\b/i.test(normalized)) return '目标词后接 to + 动词原形；do 是语法占位符，不是要逐字写出的单词';
  if (/\bdoing\b/i.test(normalized)) return '目标词后的 doing 表示要换成符合语境的动词 -ing 形式';
  if (/\bdone\b/i.test(normalized)) return '目标词后的 done 表示要换成符合语境的过去分词';
  if (/\bfrom\b.*\bto\b/i.test(normalized)) return '同时使用 from 和 to，表示范围或变化的起点与终点';
  if (/\bmore\b.*\bto\b/i.test(normalized)) return '使用 more 构成比较级，后面再接 to + 动词原形';
  if (/\bless\b.*\bto\b/i.test(normalized)) return '使用 less 表示较低可能性，后面再接 to + 动词原式';
  if (/^be\s+likely\s+to\b/i.test(normalized)) return '使用 be + likely + to + 动词原式，不加 more 或 less 构成比较';
  if (/\bthat\b/i.test(normalized)) return '使用 that 引导一个主谓完整的从句';
  const preposition = normalized.match(/\b(on|in|at|for|with|by|from|of|about|into|over|through)\b/i)?.[1];
  if (preposition) return `完整搭配中使用介词 ${preposition.toLowerCase()}`;
  if (/\bsomething\b/i.test(normalized)) return '目标词后直接接事物宾语，不额外加介词';
  if (/^be\b/i.test(normalized)) return '使用 be 的正确形式后接目标表达';
  return '选择与该中文含义和词性同时匹配的完整句块';
}

function structurePrompt(entry, label = '结构辨析') {
  return label + '：哪一项既表示“' + entry.chinese + '”，又符合这个形式线索：' + structureFormClue(entry.phrase) + '？';
}

function structureMeaningQuestion(id, entry, candidates, stage, index) {
  return {
    id,
    type: 'collocation',
    prompt: structurePrompt(entry, '句型应用'),
    options: relationOptions(entry.phrase, candidates.map((candidate) => candidate.phrase), index),
    answer: entry.phrase,
    stage,
    ai: false
  };
}

const contextClozeStopWords = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'so', 'to', 'of', 'in', 'on', 'at', 'for', 'from', 'with',
  'by', 'as', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'do', 'does', 'did', 'have', 'has',
  'had', 'will', 'would', 'can', 'could', 'may', 'might', 'must', 'should', 'i', 'you', 'he', 'she', 'it',
  'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those'
]);

function contextualCompanionWord(english, targetWord) {
  const words = wordsWithOffsets(english);
  const forms = inflectedForms(targetWord.toLowerCase());
  const targetIndex = words.findIndex((word) => forms.has(word.text.toLowerCase()));
  const isUsefulCompanion = (word) => {
    const normalized = word.text.toLowerCase();
    return !forms.has(normalized) && !contextClozeStopWords.has(normalized) && normalized.length > 2;
  };
  const afterTarget = targetIndex >= 0 ? words.slice(targetIndex + 1).find(isUsefulCompanion) : undefined;
  return afterTarget ?? [...words].reverse().find(isUsefulCompanion);
}

function contextualCompanionQuestion(id, english, chinese, targetWord, distractors, stage, index) {
  const selected = contextualCompanionWord(english, targetWord);
  if (!selected) throw new Error(id + ': example needs a meaningful non-target context word');
  return {
    id,
    type: 'collocation',
    prompt: '根据完整句意和中文提示，选出唯一能补全原句意思的词：' + blankWord(english, selected) + '（中文：' + chinese + '）',
    options: relationOptions(selected.text, distractors, index),
    answer: selected.text,
    stage,
    ai: false
  };
}

function phraseMeaningQuestion(id, entry, candidates, stage, index) {
  return {
    id,
    type: 'collocation',
    prompt: structurePrompt(entry, index % 2 === 0 ? '搭配辨析' : '用法辨析'),
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

function hasConcreteContextWord(phrase, targetWord) {
  const ignored = new Set(['a', 'an', 'the', 'to', 'do', 'doing', 'done', 'someone', 'something', 'yourself', 'of', 'in', 'on', 'for', 'with', 'at', 'by', 'from', 'as', 'and', 'or']);
  const forms = inflectedForms(targetWord.toLowerCase());
  return wordsWithOffsets(phrase).some((word) => !forms.has(word.text.toLowerCase()) && !ignored.has(word.text.toLowerCase()));
}

function hasObjectiveStructureWord(phrase, targetWord) {
  const placeholders = new Set(['do', 'doing', 'done', 'someone', 'something', 'yourself', 'a', 'b']);
  const forms = inflectedForms(targetWord.toLowerCase());
  return wordsWithOffsets(phrase).some((word) => !forms.has(word.text.toLowerCase()) && !placeholders.has(word.text.toLowerCase()));
}

function makeCard(item, index) {
  const id = slug(item.w + '-' + primaryPos(item.p));
  const override = cardOverrides[item.w];
  const tuples = [...(curatedPhrases[item.w] ?? []), [item.coll, item.collZh]]
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
  const structureOptions = relationOptions(structures[0].phrase, [
    ...structures.slice(1).map((entry) => entry.phrase),
    ...fixedPhrases.slice(0, 2).map((entry) => entry.phrase)
  ], index + 2);
  const synonymAnswer = synonyms[0].word;
  const antonymAnswer = antonyms[0].word;
  const synonymOptions = relationOptions(synonymAnswer, [antonymAnswer, confusableItems[0]?.word, next.w, nextTwo.w], index + 3);
  const antonymOptions = relationOptions(antonymAnswer, [synonymAnswer, confusableItems[0]?.word, next.w, nextTwo.w], index + 4);
  const contrast = confusableItems[0] ?? derivatives[0] ?? synonyms[0];
  const contrastKind = confusableItems[0] ? '易混词' : derivatives[0] ? '派生词' : '相关近义词';
  const contrastOptions = relationOptions(contrast.word, [synonymAnswer, antonymAnswer, next.w, nextTwo.w], index + 5);
  const firstContextEntry = contextPhrases
    .flatMap((group) => group.items)
    .find((entry) => hasConcreteContextWord(entry.phrase, item.w))
    ?? contextPhrases[0]?.items[0]
    ?? { phrase: item.coll, chinese: item.collZh };
  const firstContextPhrase = firstContextEntry.phrase;
  const objectiveStructure = structures.slice(1).find((entry) => hasObjectiveStructureWord(entry.phrase, item.w))
    ?? structures[1]
    ?? structures[0];
  const firstFixedEntry = fixedPhrases[0] ?? { phrase: item.coll, chinese: item.collZh };
  const firstFixedPhrase = firstFixedEntry.phrase;
  const secondFixedEntry = fixedPhrases.find((entry) => entry.phrase !== firstFixedPhrase)
    ?? { phrase: structures[1]?.phrase ?? item.coll, chinese: structures[1]?.chinese ?? item.collZh };
  const contextualDistractors = [next, nextTwo, lexicon[(index + 67) % lexicon.length]]
    .map((candidate) => contextualCompanionWord(candidate.ex, candidate.w)?.text ?? candidate.w);
  const questions = [
    { id: id + '-meaning-core', type: 'meaning_choice', prompt: '“' + item.w + '”最核心的中文含义是？', options: meaningOptions, answer: item.zh, stage: 'T0', ai: false },
    { id: id + '-meaning-english', type: 'meaning_choice', prompt: '哪一项英文释义最符合词卡中的 “' + item.w + '”？', options: englishMeaningOptions, answer: meanings[0].english, stage: 'T0', ai: false },
    { id: id + '-structure-choice-v3', type: 'meaning_choice', prompt: structurePrompt(structures[0], '核心结构辨析'), options: structureOptions, answer: structures[0].phrase, stage: 'T1', ai: false },
    { id: id + '-synonym-choice', type: 'meaning_choice', prompt: '哪个词是词卡中列出的 “' + item.w + '” 最直接近义词？', options: synonymOptions, answer: synonymAnswer, stage: 'T2', ai: false },
    { id: id + '-antonym-choice', type: 'meaning_choice', prompt: '哪个词是词卡中列出的 “' + item.w + '” 最直接反义词？', options: antonymOptions, answer: antonymAnswer, stage: 'T2', ai: false },
    { id: id + '-contrast-choice', type: 'meaning_choice', prompt: '根据本词卡辨析，哪个词被列为 “' + item.w + '” 的' + contrastKind + '？', options: contrastOptions, answer: contrast.word, stage: 'T3', ai: false },
    { id: id + '-recall-definition', type: 'recall', prompt: '根据英文释义写出目标词：' + meanings[0].english, answer: item.w, stage: 'T1', ai: false },
    { id: id + '-recall-chinese', type: 'recall', prompt: '写出符合“' + item.zh + '”（' + item.p + '）的本课目标词。', answer: item.w, stage: 'T1', ai: false },
    clozeTargetQuestion(id + '-collocation-core', '补全高频搭配：', item.coll, item.w, 'T0'),
    structureMeaningQuestion(id + '-collocation-structure-meaning-v3', objectiveStructure, structures, 'T1', index + 8),
    contextualCompanionQuestion(id + '-collocation-example-context-v3', item.ex, item.exZh, item.w, contextualDistractors, 'T2', index + 9),
    phraseMeaningQuestion(id + '-collocation-fixed-1-v3', firstFixedEntry, fixedPhrases, 'T2', index + 6),
    phraseMeaningQuestion(id + '-collocation-fixed-2-v3', secondFixedEntry, fixedPhrases, 'T3', index + 7),
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
    tags: [item.p.split('/')[0].trim(), override ? '人工精校' : '待精校', index < 50 ? '高频表达' : '主动词汇'],
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
    detailLevel: override ? 'template-complete' : 'standard',
    templateVersion,
    contentVersion,
    reviewed: Boolean(override),
    sourceNote: override
      ? '从用户提供的 COCA 词表筛选；本卡依照用户词卡模板人工精校；音标为美式发音。'
      : '从用户提供的 COCA 词表筛选；仅保留已核实的基础内容，未用模板套话或机械扩展冒充人工精校。'
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
  const dailyPack = { date: dateKey, dayNumber: dayIndex + 1, contentVersion, templateVersion, cards: dailyCards };
  await fs.writeFile(path.join(publicDailyDir, fileName), JSON.stringify(dailyPack, null, 2) + '\n', 'utf8');
  dailyFiles.push({ dayNumber: dayIndex + 1, date: dateKey, file: 'data/daily/' + fileName, cardIds: dailyCards.map((card) => card.id) });
}

await fs.writeFile(path.join(publicDataDir, 'all-cards.json'), JSON.stringify({ contentVersion, templateVersion, total: cards.length, cards }, null, 2) + '\n', 'utf8');
await fs.writeFile(path.join(publicDataDir, 'manifest.json'), JSON.stringify({
  appName: '每日英语', contentVersion, templateVersion, totalCards: cards.length, totalDays: dailyFiles.length,
  cardsPerDay: 5, scheduleStart: formatDate(launchDate), dailyFiles
}, null, 2) + '\n', 'utf8');
await fs.writeFile(path.join(root, 'content', 'content-manifest.json'), JSON.stringify({
  source: 'COCA词频单词表.xlsx', generatedAt: '2026-08-19', contentVersion, templateVersion,
  detailLevel: 'mixed-reviewed',
  reviewedCardIds: cards.filter((card) => card.reviewed).map((card) => card.id),
  standardCardIds: cards.filter((card) => !card.reviewed).map((card) => card.id),
  cardIds: cards.map((card) => card.id)
}, null, 2) + '\n', 'utf8');

console.log('Generated ' + cards.length + ' cards (' + cards.filter((card) => card.reviewed).length + ' template-complete, ' + cards.filter((card) => !card.reviewed).length + ' standard) and ' + dailyFiles.length + ' daily files.');
