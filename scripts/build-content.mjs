import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lexicon } from './lexicon.mjs';
import verbPriorityData from './verb-priority-data.json' with { type: 'json' };
import { verbPriorityUseCorrections } from './verb-priority-corrections.mjs';
import { confusables, families, secondarySenses } from './content-overrides.mjs';
import { cardOverrides } from './card-overrides.mjs';
import { curatedPhrases } from './curated-phrases.mjs';
import { curatedExamples } from './curated-examples.mjs';
import { ipaFor } from './phonetics.mjs';
import { learningPriority, sortLexiconForLearning } from './learning-order.mjs';
import cocaRankData from './coca-ranks.json' with { type: 'json' };
import wordMetadataData from './word-metadata.json' with { type: 'json' };
import wordnetEnrichmentData from './wordnet-enrichment.json' with { type: 'json' };
import ecdictEnrichmentData from './ecdict-enrichment.json' with { type: 'json' };
import { manualConfusableWords, manualDerivativePacks, manualMeaningPacks } from './deep-card-rules.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const contentCardsDir = path.join(root, 'content', 'cards');
const publicDailyDir = path.join(root, 'public', 'data', 'daily');
const publicDataDir = path.join(root, 'public', 'data');
const launchDate = new Date('2026-08-17T12:00:00+08:00');
const release = JSON.parse(await fs.readFile(path.join(root, 'content', 'release.json'), 'utf8'));
const { contentVersion, templateVersion } = release;

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const primaryPos = (value) => value.split('/')[0].trim().replace('.', '');
const firstMeaning = (value) => value.split('；')[0];
const priorityEntries = Object.fromEntries(Object.entries(verbPriorityData.entries).map(([word, entry]) => [
  word,
  {
    ...entry,
    uses: entry.uses.map((use) => {
      const correction = verbPriorityUseCorrections[`${word}|${use[0]}`];
      return correction ? [use[0], use[1], correction[0], correction[1]] : use;
    })
  }
]));
const priorityVerbLexicon = Object.entries(priorityEntries).map(([word, entry]) => ({
  w: word,
  p: 'v.',
  ipa: ipaFor(word),
  zh: entry.zh,
  en: entry.en,
  coll: entry.uses[0][0],
  collZh: entry.uses[0][1],
  ex: entry.uses[0][2],
  exZh: entry.uses[0][3],
  syn: entry.syn,
  synZh: entry.synZh,
  ant: entry.ant,
  antZh: entry.antZh
}));
const activeLexicon = [
  ...lexicon.filter((item) => primaryPos(item.p) === 'v'),
  ...priorityVerbLexicon
];
const activeWords = new Set(activeLexicon.map((item) => item.w));
if (activeLexicon.length !== 150 || activeWords.size !== activeLexicon.length) {
  throw new Error('Verb-priority catalog must contain exactly 150 unique words.');
}
const lexiconByWord = new Map(activeLexicon.map((item) => [item.w, item]));
const orderedLexicon = sortLexiconForLearning(activeLexicon, cocaRankData);
const wordMetadata = wordMetadataData.entries;
const wordnetEntries = wordnetEnrichmentData.entries;
const ecdictEntries = ecdictEnrichmentData.entries;
const posLabels = { v: 'v.', n: 'n.', j: 'adj.', r: 'adv.' };

function stripDictionaryLabels(value = '') {
  return value
    .replace(/\\n/g, '\n')
    .split(/\r?\n/)
    .filter((line) => line.trim() && !/^\s*\[[^\]]+\]/.test(line))
    .join('；')
    .replace(/\b(?:vt|vi|aux|v|n|adj|adv|prep|conj|pron|a)\.\s*/gi, '')
    .replace(/[，,]\s*/g, '；')
    .replace(/；+/g, '；')
    .replace(/^；|；$/g, '')
    .trim();
}

function conciseChinese(word, fallback = '') {
  const source = stripDictionaryLabels(ecdictEntries[word.toLowerCase()]?.translation ?? '');
  const parts = source.split('；').map((part) => part.trim()).filter(Boolean);
  return parts.slice(0, 3).join('；') || fallback;
}

function ecdictPartOfSpeech(word, fallback = 'word') {
  const entry = ecdictEntries[word.toLowerCase()];
  const explicit = entry?.partOfSpeech?.match(/\b(vt|vi|v|n|a|adj|adv|prep|conj|pron|aux)\b/i)?.[1];
  if (explicit) return explicit.replace(/^vt$|^vi$/i, 'v').replace(/^a$/i, 'adj') + '.';
  const definition = entry?.definition ?? '';
  const inferred = definition.replace(/\\n/g, '\n').match(/(?:^|\n)(vt|vi|v|n|a|adj|adv|prep|conj|pron|aux)\.?\s/i)?.[1];
  return inferred ? inferred.replace(/^vt$|^vi$/i, 'v').replace(/^a$/i, 'adj') + '.' : fallback;
}

function dictionaryHeadword(word) {
  const normalized = word.toLowerCase().trim();
  if (ecdictEntries[normalized]) return normalized;
  const candidates = normalized.endsWith('ies')
    ? [normalized.slice(0, -3) + 'y']
    : normalized.endsWith('ing')
      ? [normalized.slice(0, -3), normalized.slice(0, -3) + 'e']
      : normalized.endsWith('ed')
        ? [normalized.slice(0, -2), normalized.slice(0, -1)]
        : normalized.endsWith('s')
          ? [normalized.slice(0, -1)]
          : [];
  return candidates.find((candidate) => ecdictEntries[candidate]) ?? normalized;
}

function candidateCommonness(word) {
  const entry = ecdictEntries[word.toLowerCase()];
  if (!entry) return -10000;
  const numeric = (value, fallback) => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : fallback;
  const bnc = numeric(entry.bncRank, 60000);
  const frequency = numeric(entry.frequencyRank, 60000);
  const collins = numeric(entry.collins, 0);
  return (activeWords.has(word) ? 500 : 0)
    + (entry.oxford === '1' ? 160 : 0)
    + collins * 20
    + (entry.tags ? 40 : 0)
    + Math.max(0, 120 - Math.min(bnc, frequency) / 250)
    - Math.max(0, word.split(' ').length - 1) * 35;
}

function selectCommonCandidates(items = [], excludedWords = [], limit = 4) {
  const excluded = new Set(excludedWords.map((word) => word.toLowerCase()));
  const seen = new Set();
  return items
    .map((entry) => ({ ...entry, word: dictionaryHeadword(entry.word ?? '') }))
    .filter((entry) => {
      const word = entry.word?.toLowerCase().trim();
      if (!word || excluded.has(word) || seen.has(word) || !ecdictEntries[word]) return false;
      if (word.length > 30 || word.split(' ').length > 3) return false;
      seen.add(word);
      return true;
    })
    .sort((left, right) => candidateCommonness(right.word) - candidateCommonness(left.word))
    .slice(0, limit);
}

function wordnetDefinitionNote(entry) {
  const definition = entry?.definition?.replace(/\s+/g, ' ').trim();
  return definition ? `对应的常用英文义是 “${definition}”。` : '';
}

const definitionStopWords = new Set(['a', 'an', 'and', 'as', 'at', 'be', 'by', 'for', 'from', 'in', 'into', 'is', 'it', 'of', 'on', 'or', 'someone', 'something', 'that', 'the', 'their', 'this', 'to', 'with']);

function definitionSimilarity(left, right) {
  const tokens = (value) => new Set(value.toLowerCase().match(/[a-z]+/g)?.filter((word) => !definitionStopWords.has(word)).map((word) => word.slice(0, Math.min(5, word.length))) ?? []);
  const leftTokens = tokens(left);
  const rightTokens = tokens(right);
  return [...leftTokens].filter((token) => rightTokens.has(token)).length;
}
function relatedChinese(word, item, relation) {
  if (relation === 'synonym' && item.synZh) return item.synZh;
  if (relation === 'antonym' && item.antZh) return item.antZh;
  const known = lexiconByWord.get(word);
  if (known) return firstMeaning(known.zh);
  if (wordMetadata[word]?.chinese) return wordMetadata[word].chinese;
  const dictionaryChinese = conciseChinese(word);
  if (dictionaryChinese) return dictionaryChinese;
  if (relation === 'synonym') return '与“' + firstMeaning(item.zh) + '”意义接近';
  if (relation === 'antonym') return '与“' + firstMeaning(item.zh) + '”意义相反';
  return '与 ' + item.w + ' 同词族的常用词形';
}

function syllableHint(word) {
  const hints = {
    improve: 'im·prove', notice: 'no·tice', support: 'sup·port', likely: 'like·ly', manage: 'man·age',
    provide: 'pro·vide', understand: 'un·der·stand', believe: 'be·lieve', create: 'cre·ate', include: 'in·clude',
    remember: 're·mem·ber', continue: 'con·tin·ue', consider: 'con·sid·er', develop: 'de·vel·op',
    explain: 'ex·plain', prepare: 'pre·pare', achieve: 'a·chieve', compare: 'com·pare', happen: 'hap·pen',
    become: 'be·come', offer: 'of·fer', expect: 'ex·pect', decide: 'de·cide', suggest: 'sug·gest',
    require: 're·quire', avoid: 'a·void', depend: 'de·pend', increase: 'in·crease', reduce: 're·duce',
    remain: 're·main', handle: 'han·dle', affect: 'af·fect', realize: 're·al·ize', describe: 'de·scribe',
    accept: 'ac·cept', prefer: 'pre·fer', discover: 'dis·cov·er', protect: 'pro·tect',
    encourage: 'en·cour·age', express: 'ex·press', begin: 'be·gin', open: 'o·pen', appear: 'ap·pear',
    agree: 'a·gree', report: 're·port', receive: 're·ceive', return: 're·turn',
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

function extractTargetChunk(text, targetWord) {
  const words = wordsWithOffsets(text);
  const forms = inflectedForms(targetWord.toLowerCase());
  const targetIndex = words.findIndex((word) => forms.has(word.text.toLowerCase()));
  if (targetIndex < 0) return text.replace(/[.!?]+$/, '').trim();
  const start = Math.max(0, targetIndex - 2);
  const end = Math.min(words.length, targetIndex + 5);
  return words.slice(start, end).map((word) => word.text).join(' ');
}

function phraseSpecificError(item, phrase, fallbackIndex) {
  const normalized = phrase.replace(/\s+/g, ' ').trim();
  if (/\bto do something\b/i.test(normalized)) {
    const wrong = normalized.replace(/\bto do something\b/i, 'doing something');
    return [wrong, normalized, `这个结构要用 ${item.w} + to + 动词原形；do 只是词卡里的动词占位符，真实句子要换成 finish、check 等具体动词。`];
  }
  if (/\bsomeone doing something\b/i.test(normalized)) {
    return [normalized.replace('doing', 'do'), normalized, `此处用动词 -ing 形式强调动作正在进行；换成动词原形时通常强调看到或感知完整动作。`];
  }
  if (/\bsomeone do something\b/i.test(normalized)) {
    return [normalized.replace('do', 'doing'), normalized, `此处用不带 to 的动词原形表示完整动作；do 同样是占位符，不是必须写出的单词。`];
  }
  if (/\bthat \+ clause\b/i.test(normalized)) {
    return [normalized.replace(/\s*that \+ clause/i, ' something'), normalized, `本义项后面要接 that 引导的完整从句，从句里需要有自己的主语和谓语。`];
  }
  const preposition = normalized.match(/\b(on|in|at|for|with|by|from|of|about|into|over|through)\b/i)?.[1];
  if (preposition) {
    const wrong = normalized.replace(new RegExp(`(^|\\s)${preposition}(?=\\s|$)`, 'i'), '$1').replace(/\s+/g, ' ').trim();
    return [wrong, normalized, `在“${normalized}”这个常用搭配中，介词 ${preposition.toLowerCase()} 负责连接后面的对象或范围，不能省略或随意换成其他介词。`];
  }
  if (/^\b(can|could|may|might|must|should|will|would)\b/i.test(normalized)) {
    const modal = normalized.match(/^\w+/)?.[0] ?? 'modal';
    return [`${modal} to ${item.w}`, normalized, `情态动词 ${modal} 后面直接接动词原形，不加 to；后面的 something 或 do 要按语境换成真实内容。`];
  }
  if (/\bdoing something\b/i.test(normalized)) {
    return [normalized.replace('doing', 'to do'), normalized, `“${normalized}”是需要动词 -ing 形式的固定结构；doing 是占位符，应换成具体动词的 -ing 形式。`];
  }
  return fallbackIndex === 0
    ? [`can to ${item.w}`, `can ${item.w}`, `情态动词 can 后面直接接 ${item.w} 的原形，不加 to。`]
    : [`to ${item.w}ing`, `to ${item.w}`, `这里的 to 是不定式标记，后面要用 ${item.w} 的原形，不能再加 -ing。`];
}

function generatedErrors(item, tuples) {
  const source = [...tuples].sort((left, right) => {
    const score = (phrase) => /\b(to do|someone do|someone doing|that \+ clause|doing something)\b/i.test(phrase) ? 2 : /\b(on|in|at|for|with|by|from|of|about|into|over|through)\b/i.test(phrase) ? 1 : 0;
    return score(right[0]) - score(left[0]);
  });
  const rows = source.slice(0, 4).map(([phrase], index) => phraseSpecificError(item, phrase, index));
  const seen = new Set();
  return rows.filter(([wrong, right]) => {
    const key = `${wrong}|${right}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 2);
}

function normalizeMeanings(item, override) {
  if (override?.meanings) {
    return override.meanings.map(([partOfSpeech, english, chinese, example, translation]) => ({ partOfSpeech, english, chinese, example, translation }));
  }
  const examplePool = priorityEntries[item.w]?.uses?.map((entry) => ({ example: entry[2], translation: entry[3] }))
    ?? (curatedExamples[item.w] ?? [[item.ex, item.exZh]]).map(([example, translation]) => ({ example, translation }));
  const manual = manualMeaningPacks[item.w];
  if (manual) {
    return manual.map(([partOfSpeech, english, chinese, exampleIndex, customExample, customTranslation]) => ({
      partOfSpeech,
      english,
      chinese,
      ...(customExample && customTranslation
        ? { example: customExample, translation: customTranslation }
        : (examplePool[exampleIndex] ?? examplePool[0]))
    }));
  }
  const secondary = secondarySenses[item.w];
  const wordnetMeanings = (wordnetEntries[item.w]?.meanings ?? [])
    .filter((entry) => entry.definition && entry.definition.toLowerCase() !== item.en.toLowerCase());
  const similarMeanings = wordnetMeanings.filter((entry) => definitionSimilarity(entry.definition, item.en) > 0);
  const dictionaryMeanings = (similarMeanings.length ? similarMeanings : wordnetMeanings.slice(0, 1)).slice(0, 1);
  const rows = [
    { partOfSpeech: item.p.split('/')[0].trim(), english: item.en, chinese: item.zh, ...examplePool[0] },
    ...(secondary ? [secondary] : []),
    ...dictionaryMeanings.map((entry, index) => ({
      partOfSpeech: item.p.split('/')[0].trim(),
      english: entry.definition,
      chinese: item.zh,
      // Use another verified target-word example so two meaning rows never
      // repeat the same sentence merely to satisfy the template.
      ...(examplePool[index + (secondary ? 2 : 1)] ?? examplePool[0])
    }))
  ];
  const seenDefinitions = new Set();
  return rows.filter((entry) => {
    const key = entry.english.toLowerCase().replace(/[^a-z]+/g, ' ').trim();
    if (seenDefinitions.has(key)) return false;
    seenDefinitions.add(key);
    return true;
  }).slice(0, 4);
}

function normalizeStructures(item, override, tuples) {
  const source = override?.structures ?? tuples.slice(0, 4);
  return source.map(([phrase, chinese]) => ({ phrase, phonetic: ipaFor(phrase, item.w, item.ipa), chinese }));
}

function normalizeErrors(item, override, tuples) {
  const source = override?.errors ?? generatedErrors(item, tuples);
  return source.map(([wrong, right, note]) => ({
    wrong,
    wrongPhonetic: ipaFor(wrong, item.w, item.ipa),
    right,
    rightPhonetic: ipaFor(right, item.w, item.ipa),
    note
  }));
}

function normalizeContexts(item, override, tuples) {
  const contextLabels = item.p.startsWith('v.')
    ? ['核心动作与结构', '日常与工作语境', '高频扩展表达', '补充常用语境']
    : item.p.startsWith('n.')
      ? ['核心名词搭配', '日常与工作语境', '高频扩展表达', '补充常用语境']
      : ['核心用法', '日常与工作语境', '高频扩展表达', '补充常用语境'];
  const examples = priorityEntries[item.w]?.uses
    ?? (curatedExamples[item.w] ?? [[item.ex, item.exZh]]).map(([example, translation], index) => [
      tuples[index]?.[0] ?? item.coll,
      tuples[index]?.[1] ?? item.collZh,
      example,
      translation
    ]);
  const contextItems = examples.map((entry, index) => [
    extractTargetChunk(entry[2], item.w),
    `${entry[1]}；原句语境：${entry[3]}`,
    index
  ]).filter(([phrase], index, source) => source.findIndex(([candidate]) => candidate.toLowerCase() === phrase.toLowerCase()) === index);
  const generatedGroups = Array.from({ length: Math.ceil(contextItems.length / 2) }, (_, index) => [
    contextLabels[index] ?? '补充常用语境',
    contextItems.slice(index * 2, index * 2 + 2).map(([phrase, chinese]) => [phrase, chinese])
  ]);
  const source = override?.contexts ?? generatedGroups;
  return source.filter(([, items]) => items.length).map(([category, items]) => ({
    category,
    items: items.map(([phrase, chinese]) => ({ phrase, phonetic: ipaFor(phrase, item.w, item.ipa), chinese }))
  }));
}

function normalizeFixedPhrases(item, override, tuples) {
  const priorityExamples = priorityEntries[item.w]?.uses?.map((entry) => [entry[2], entry[3]]);
  const examples = priorityExamples ?? curatedExamples[item.w] ?? [[item.ex, item.exZh]];
  const source = override?.phrases ?? tuples.slice(0, examples.length).map(([phrase, chinese], index) => [
    phrase,
    chinese,
    examples[index][0],
    examples[index][1]
  ]);
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
    // WordNet groups words by every recorded sense.  A common word can therefore
    // pick up a technically valid but pedagogically misleading relation from a
    // rare sense (for example find -> chance or solve -> lick).  This field asks
    // for the most direct synonym, so keep only the reviewed source relation.
    const candidates = [
      { word: item.syn, partOfSpeech: wordMetadata[item.syn]?.partOfSpeech ?? item.p.split('/')[0].trim(), definition: item.en }
    ];
    const seen = new Set();
    return candidates.filter((entry) => {
      const word = entry.word.toLowerCase();
      if (seen.has(word)) return false;
      seen.add(word);
      return true;
    }).slice(0, 3).map((entry, relationIndex) => ({
      word: entry.word,
      phonetic: ipaFor(entry.word),
      partOfSpeech: entry.partOfSpeech ?? ecdictPartOfSpeech(entry.word, item.p.split('/')[0].trim()),
      chinese: relationIndex === 0 ? relatedChinese(entry.word, item, 'synonym') : conciseChinese(entry.word, '与本卡当前义项意义接近'),
      difference: `${entry.word} 侧重“${relationIndex === 0 ? relatedChinese(entry.word, item, 'synonym') : conciseChinese(entry.word, '相近动作')}”。${wordnetDefinitionNote(entry)}${item.w} 在本卡搭配“${item.coll}”中表达“${firstMeaning(item.zh)}”；换词时要同时检查宾语和介词。`
    }));
  }
  if (key === 'antonyms') {
    // Antonymy is even more sense-dependent.  The source list contains one
    // reviewed direct contrast for the taught sense, so do not pad this section
    // with opposites belonging to unrelated secondary senses.
    const candidates = [
      { word: item.ant, partOfSpeech: wordMetadata[item.ant]?.partOfSpeech ?? item.p.split('/')[0].trim(), definition: `opposite of ${item.w}` }
    ];
    const seen = new Set();
    return candidates.filter((entry) => {
      const word = entry.word.toLowerCase();
      if (seen.has(word)) return false;
      seen.add(word);
      return true;
    }).slice(0, 3).map((entry, relationIndex) => ({
      word: entry.word,
      phonetic: ipaFor(entry.word),
      partOfSpeech: entry.partOfSpeech ?? ecdictPartOfSpeech(entry.word, item.p.split('/')[0].trim()),
      chinese: relationIndex === 0 ? relatedChinese(entry.word, item, 'antonym') : conciseChinese(entry.word, '与本卡当前义项相反'),
      usage: `在“${firstMeaning(item.zh)}”这个义项下，${entry.word}（${relationIndex === 0 ? relatedChinese(entry.word, item, 'antonym') : conciseChinese(entry.word, '相反含义')}）与 ${item.w} 形成对比。${wordnetDefinitionNote(entry)}只在这个明确义项和句型中对比，不把两个词的所有用法都视为相反。`
    }));
  }
  return [];
}

function normalizeDerivatives(item, override) {
  const priorityDerivatives = priorityEntries[item.w]?.derivatives;
  if (override?.derivatives) {
    return override.derivatives
      .filter(([word]) => word.toLowerCase() !== item.w.toLowerCase())
      .map(([word, partOfSpeech, chinese, note]) => ({ word, phonetic: ipaFor(word), partOfSpeech, chinese, note }));
  }
  const curated = [...(priorityDerivatives ?? []), ...(manualDerivativePacks[item.w] ?? [])]
    .map(([word, partOfSpeech, chinese, note]) => ({ word, partOfSpeech, chinese, note }));
  const legacy = (families[item.w] ?? []).map((word) => ({
    word,
    partOfSpeech: lexiconByWord.get(word)?.p ?? wordMetadata[word]?.partOfSpeech,
    chinese: lexiconByWord.has(word) ? firstMeaning(lexiconByWord.get(word).zh) : wordMetadata[word]?.chinese
  }));
  const stemLength = Math.min(4, Math.max(3, item.w.length - 2));
  const stem = item.w.toLowerCase().slice(0, stemLength);
  const dictionary = selectCommonCandidates(
    (wordnetEntries[item.w]?.derivatives ?? []).filter((entry) => entry.word.toLowerCase().startsWith(stem)),
    [item.w, ...curated.map((entry) => entry.word), ...legacy.map((entry) => entry.word)],
    6
  ).map((entry) => ({
    word: entry.word,
    partOfSpeech: entry.partOfSpeech ?? ecdictPartOfSpeech(entry.word),
    chinese: conciseChinese(entry.word, '与本词同词族'),
    note: `${entry.word} 是 ${item.w} 的常用词族形式，作 ${entry.partOfSpeech ?? ecdictPartOfSpeech(entry.word)} 使用；${wordnetDefinitionNote(entry)}`
  }));
  const seen = new Set();
  return [...curated, ...legacy, ...dictionary]
    .filter((entry) => entry.word && entry.word.toLowerCase() !== item.w.toLowerCase())
    .filter((entry) => {
      const word = entry.word.toLowerCase();
      if (seen.has(word)) return false;
      seen.add(word);
      return true;
    })
    .slice(0, 8)
    .map((entry) => ({
      word: entry.word,
      phonetic: ipaFor(entry.word),
      partOfSpeech: entry.partOfSpeech ?? ecdictPartOfSpeech(entry.word),
      chinese: entry.chinese ?? conciseChinese(entry.word, '与本词同词族'),
      note: entry.note ?? `${entry.word} 是 ${item.w} 的常用词族形式；作 ${entry.partOfSpeech ?? ecdictPartOfSpeech(entry.word)} 时表示“${entry.chinese ?? conciseChinese(entry.word, '相关含义')}”。`
    }));
}

function normalizeConfusables(item, override) {
  if (override?.confusables) {
    return normalizeRelations(item, override, 'confusables');
  }
  const legacy = confusables[item.w] ? [confusables[item.w].word] : [];
  const candidates = [...legacy, ...(manualConfusableWords[item.w] ?? [])];
  const specialChinese = {
    'believe in': '信仰；信任', 'there is': '有；存在', 'go back': '回去；返回',
    'used to': '过去常常', 'would not': '不会；不愿意', 'could not': '不能；不可能',
    'may not': '可能不；不可以', 'should not': '不应该', 'be unable to': '无法做某事'
  };
  const seen = new Set();
  return candidates.filter((word) => {
    const normalized = word.toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return normalized !== item.w.toLowerCase();
  }).slice(0, 3).map((word) => {
    const chinese = specialChinese[word] ?? conciseChinese(word, `与 ${item.w} 容易混淆的表达`);
    return {
      word,
      phonetic: ipaFor(word),
      partOfSpeech: word.includes(' ') ? 'phr.' : ecdictPartOfSpeech(word, item.p.split('/')[0].trim()),
      chinese,
      difference: `${word} 表示“${chinese}”；${item.w} 在本卡核心搭配“${item.coll}”中表示“${firstMeaning(item.zh)}”。答题时要根据句意和完整结构区分，不只看拼写或中文近义。`
    };
  });
}

function vocabularyItem(word, fallbackPos = 'word', fallbackChinese = '与本词相关的常用表达') {
  const known = lexiconByWord.get(word);
  const metadata = wordMetadata[word];
  return {
    word,
    phonetic: known?.ipa ?? ipaFor(word),
    partOfSpeech: known?.p ?? (fallbackPos !== 'word' ? fallbackPos : metadata?.partOfSpeech ?? ecdictPartOfSpeech(word, fallbackPos)),
    chinese: known ? firstMeaning(known.zh) : metadata?.chinese ?? conciseChinese(word, fallbackChinese)
  };
}

function isHighValueRelatedCandidate(entry) {
  const word = dictionaryHeadword(entry.word ?? '');
  const dictionary = ecdictEntries[word];
  return activeWords.has(word)
    || dictionary?.oxford === '1'
    || Number(dictionary?.collins ?? 0) >= 3;
}

function normalizeRelated(item, index, override, derivatives, synonyms, antonyms, confusableItems) {
  if (override?.related) {
    return override.related.map(([category, items]) => ({
      category,
      items: items.map(([word, partOfSpeech, chinese]) => ({ word, phonetic: ipaFor(word), partOfSpeech, chinese }))
    }));
  }
  const excluded = [
    item.w,
    ...derivatives.map((entry) => entry.word),
    ...synonyms.map((entry) => entry.word),
    ...antonyms.map((entry) => entry.word),
    ...confusableItems.map((entry) => entry.word)
  ];
  const semanticParents = selectCommonCandidates(wordnetEntries[item.w]?.hypernyms, excluded, 12)
    .filter(isHighValueRelatedCandidate)
    .slice(0, 4);
  const concreteActions = selectCommonCandidates(wordnetEntries[item.w]?.hyponyms, [...excluded, ...semanticParents.map((entry) => entry.word)], 16)
    .filter(isHighValueRelatedCandidate)
    .slice(0, 4);
  const contextExamples = priorityEntries[item.w]?.uses?.map((entry) => entry[2])
    ?? (curatedExamples[item.w] ?? []).map((entry) => entry[0]);
  const companionCandidates = contextExamples
    .flatMap((example) => wordsWithOffsets(example).map((word) => ({ word: word.text.toLowerCase() })))
    .filter((entry) => !contextClozeStopWords.has(entry.word) && entry.word.length > 3 && !inflectedForms(item.w).has(entry.word));
  const companions = selectCommonCandidates(companionCandidates, [...excluded, ...semanticParents.map((entry) => entry.word), ...concreteActions.map((entry) => entry.word)], 4);
  return [
    ...(semanticParents.length ? [{
      category: '语义上位词：这个动作属于什么类别',
      items: semanticParents.map((entry) => vocabularyItem(entry.word, entry.partOfSpeech, conciseChinese(entry.word, '相关上位概念')))
    }] : []),
    ...(concreteActions.length ? [{
      category: '具体动作：相关的更具体表达',
      items: concreteActions.map((entry) => vocabularyItem(entry.word, entry.partOfSpeech, conciseChinese(entry.word, '相关具体动作')))
    }] : []),
    ...(companions.length ? [{
      category: '真实语境：例句中常与本词同现的词',
      items: companions.map((entry) => vocabularyItem(entry.word, ecdictPartOfSpeech(entry.word), conciseChinese(entry.word, '例句中的常用语境词')))
    }] : [])
  ].filter((group) => group.items.length);
}

function normalizeExamples(item, override) {
  if (override?.examples) {
    return override.examples.map(([scene, english, chinese]) => ({ scene, english, chinese }));
  }
  const priorityExamples = priorityEntries[item.w]?.uses?.map((entry) => [entry[2], entry[3]]);
  const generated = (priorityExamples ?? curatedExamples[item.w] ?? []).map(([english, chinese], index) => ({
    scene: ['日常使用', '工作或学习', '常见搭配', '真实语境', '易错结构', '主动表达'][index] ?? '高频表达',
    english,
    chinese
  }));
  return [
    { scene: '核心真实用法', english: item.ex, chinese: item.exZh },
    ...generated.filter((entry) => entry.english !== item.ex)
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
  const priorityPhrases = priorityEntries[item.w]?.uses?.map((entry) => [entry[0], entry[1]]);
  if (!override && (priorityPhrases ?? curatedPhrases[item.w] ?? []).length < 6) {
    throw new Error(item.w + ': curated generation requires at least six curated phrase entries.');
  }
  if (!override && (priorityEntries[item.w]?.uses ?? curatedExamples[item.w] ?? []).length < 6) {
    throw new Error(item.w + ': curated generation requires at least six curated bilingual examples.');
  }
  const tuples = [...(priorityPhrases ?? curatedPhrases[item.w] ?? []), [item.coll, item.collZh]]
    .filter(([phrase], tupleIndex, source) => source.findIndex(([candidate]) => candidate === phrase) === tupleIndex)
    .slice(0, 12);
  const structures = normalizeStructures(item, override, tuples);
  const commonErrors = normalizeErrors(item, override, tuples);
  const meanings = normalizeMeanings(item, override);
  const contextPhrases = normalizeContexts(item, override, tuples);
  const fixedPhrases = normalizeFixedPhrases(item, override, tuples);
  const synonyms = normalizeRelations(item, override, 'synonyms');
  const antonyms = normalizeRelations(item, override, 'antonyms');
  const derivatives = normalizeDerivatives(item, override);
  const confusableItems = normalizeConfusables(item, override);
  const relatedVocabulary = normalizeRelated(item, index, override, derivatives, synonyms, antonyms, confusableItems);
  const examples = normalizeExamples(item, override);
  const wordFamily = derivatives.map((entry) => entry.word);
  const focus = override?.focus ?? [
    `先掌握“${firstMeaning(item.zh)}”这个核心义，再用本卡的 ${meanings.length - 1} 个常用义项辨别不同语境。`,
    `把“${item.coll}”连同介词、宾语和动词形式作为整个句块记忆。`,
    commonErrors[0]?.note ?? `使用 ${item.w} 时同时检查词性、宾语和搭配。`,
    `${item.ex}（${item.exZh}）`
  ];
  const ranks = (cocaRankData[item.w] ?? []).map((entry) => ({
    ...entry,
    partOfSpeech: posLabels[entry.pos] ?? entry.pos
  }));
  const cocaRankLabel = ranks.length
    ? ranks.map((entry) => entry.partOfSpeech + ' 第 ' + entry.rank + ' 名').join('；')
    : 'COCA 高频精选';
  const next = orderedLexicon[(index + 17) % orderedLexicon.length];
  const nextTwo = orderedLexicon[(index + 43) % orderedLexicon.length];
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
  const contextualDistractors = [next, nextTwo, orderedLexicon[(index + 67) % orderedLexicon.length]]
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
    learningPriority: learningPriority(item, index + 1, cocaRankData),
    phonetic: item.ipa,
    syllables: syllableHint(item.w),
    partOfSpeech: item.p,
    frequencyBand: 'COCA 高频精选 · ' + cocaRankLabel,
    difficulty: index < 50 ? '基础' : index < 110 ? '进阶' : '应用',
    tags: [item.p.split('/')[0].trim(), index < 50 ? '高频表达' : '主动词汇'],
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
    detailLevel: item.w === 'work' ? 'template-reference' : override ? 'template-curated' : 'template-complete',
    templateVersion,
    contentVersion,
    reviewed: Boolean(override),
    sourceNote: '词条来自 COCA 高频词表，释义、搭配和例句按实际学习场景整理，音标按美式发音展示。'
  };
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

await fs.mkdir(contentCardsDir, { recursive: true });
await fs.mkdir(publicDailyDir, { recursive: true });

for (const directory of [contentCardsDir, publicDailyDir]) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  await Promise.all(entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => fs.unlink(path.join(directory, entry.name))));
}

const cards = orderedLexicon.map(makeCard);
for (const card of cards) {
  await fs.writeFile(path.join(contentCardsDir, card.id + '.json'), JSON.stringify(card, null, 2) + '\n', 'utf8');
}

const dailyFiles = [];
const totalDays = Math.ceil(cards.length / 5);
for (let dayIndex = 0; dayIndex < totalDays; dayIndex += 1) {
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
  source: 'COCA词频单词表.xlsx', generatedAt: '2026-09-07', contentVersion, templateVersion,
  generationMode: 'one-time-static',
  orderingPolicy: 'verbs-only-then-coca-verb-rank',
  detailLevel: 'template-complete',
  reviewedCardIds: cards.filter((card) => card.reviewed).map((card) => card.id),
  referenceCardIds: cards.filter((card) => card.detailLevel === 'template-reference').map((card) => card.id),
  curatedDetailedCardIds: cards.filter((card) => card.detailLevel === 'template-curated').map((card) => card.id),
  completeCardIds: cards.filter((card) => card.detailLevel === 'template-complete').map((card) => card.id),
  cardIds: cards.map((card) => card.id)
}, null, 2) + '\n', 'utf8');

console.log('Generated all ' + cards.length + ' complete static verb cards in COCA verb-rank order, plus ' + dailyFiles.length + ' daily files.');
