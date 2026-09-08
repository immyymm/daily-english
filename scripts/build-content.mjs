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
import { manualConfusableWords, manualDerivativePacks, manualMeaningPacks, manualRelatedPacks } from './deep-card-rules.mjs';
import { directRelationPacks } from './relation-packs.mjs';

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
const verbIpaOverrides = {
  use: '/juːz/',
  live: '/lɪv/',
  lead: '/liːd/'
};
const summarizeChineseMeanings = (meanings) => {
  const seen = new Set();
  return meanings
    .flatMap((meaning) => meaning.chinese.split('；'))
    .map((gloss) => gloss.trim())
    .filter((gloss) => gloss && !seen.has(gloss) && seen.add(gloss))
    .join('；');
};
const priorityEntries = Object.fromEntries(Object.entries(verbPriorityData.entries).map(([word, entry]) => [
  word,
  {
    ...entry,
    uses: entry.uses.map((use) => {
      const correction = verbPriorityUseCorrections[`${word}|${use[0]}`];
      return correction ? [correction[2] ?? use[0], correction[3] ?? use[1], correction[0], correction[1]] : use;
    })
  }
]));
const priorityVerbLexicon = Object.entries(priorityEntries).map(([word, entry]) => ({
  w: word,
  p: new Set(['can', 'could', 'may', 'might', 'must', 'should', 'will', 'would']).has(word) ? 'v. / aux.' : 'v.',
  // A few high-frequency homographs default to their noun/adjective reading
  // in CMU. This catalog teaches the verb reading.
  ipa: verbIpaOverrides[word] ?? ipaFor(word),
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
  // A context entry must be a reusable lexical chunk, not a sentence fragment.
  // Start at the target, normalize its inflection to the lemma and retain the
  // following object/preposition words.
  const includeSubject = targetIndex > 0
    && /^(it|there)$/i.test(words[targetIndex - 1].text)
    && /^(seem|appear|take|be|happen)$/i.test(targetWord);
  const start = includeSubject ? targetIndex - 1 : targetIndex;
  const available = words.slice(start, Math.min(words.length, start + 12));
  const boundary = available.findIndex((word, index) => index >= 3 && /^(because|although|though|while|when|unless|but|if)$/i.test(word.text));
  return available
    .slice(0, boundary >= 0 ? boundary : available.length)
    .map((word, index) => index === (includeSubject ? 1 : 0) ? (includeSubject ? word.text : targetWord) : word.text)
    .join(' ');
}

function phraseSpecificError(item, phrase, fallbackIndex) {
  const normalized = phrase.replace(/\s+/g, ' ').trim();
  if (/^compare A with B$/i.test(normalized)) {
    return [
      'compare A than B',
      normalized,
      'compare 表示“比较”时不能用 than 直接连接两个比较对象。compare A with B 常用于比较异同；compare A to B 在表示类比或指出相似性时也成立，不能一概判错。'
    ];
  }
  if (/\bto do(?: something)?\b/i.test(normalized)) {
    const wrong = normalized.replace(/\bto do(?: something)?\b/i, (match) => match.endsWith(' something') ? 'to does something' : 'to does');
    return [wrong, normalized, `在“${normalized}”中，这个 to 是不定式标记，后面必须接动词原形。do 只是语法占位符，真实表达要把它换成 finish、check 等符合语境的动词原形。`];
  }
  if (/\bsomeone doing something\b/i.test(normalized)) {
    return [normalized.replace('doing', 'to do'), normalized, `在“${normalized}”中，宾语后直接接动词 -ing 形式，用来强调动作正在进行；doing 要换成具体动词的 -ing 形式，前面不能加 to。`];
  }
  if (/\bsomeone do something\b/i.test(normalized)) {
    return [normalized.replace('do', 'does'), normalized, `在“${normalized}”中，宾语后接不带 to 的动词原形，用来表示完整动作；do 是语法占位符，应替换为符合语境的具体动词原形，不能变成第三人称单数形式。`];
  }
  if (/\bthat \+ clause\b/i.test(normalized)) {
    return [
      `${item.w} that the plan`,
      `${item.w} that the plan is ready`,
      `“${normalized}”表示后接 that 从句；that 后不能只放名词短语 the plan，还需要 is ready 这样的谓语，构成主谓完整的从句。`
    ];
  }
  const preposition = normalized.match(/\b(on|in|at|for|with|by|from|of|about|into|over|through|to|as|along|against|without|within)\b/i)?.[1];
  if (preposition) {
    const wrongPrepositions = { on: 'at', in: 'at', at: 'on', for: 'at', with: 'at', by: 'with', from: 'at', of: 'for', about: 'at', into: 'at', over: 'at', through: 'at', to: 'at', as: 'for', along: 'at', against: 'at', without: 'at', within: 'at' };
    const replacement = wrongPrepositions[preposition.toLowerCase()];
    const wrong = normalized.replace(new RegExp(`(^|\\s)${preposition}(?=\\s|$)`, 'i'), `$1${replacement}`);
    return [wrong, normalized, `在“${normalized}”所表达的这个具体含义中，要用介词 ${preposition.toLowerCase()}；换成 ${replacement} 会破坏这个固定结构或改变原意。`];
  }
  if (/\bdoing something\b/i.test(normalized)) {
    return [normalized.replace('doing', 'to doing'), normalized, `“${normalized}”在本义下要求动词 -ing 形式；doing 是语法占位符，应换成具体动词的 -ing 形式，前面不要额外加 to。`];
  }
  if (/^(can|could|may|might|must|should|will|would)\b/i.test(normalized)) {
    const modal = normalized.match(/^\w+/)?.[0] ?? 'modal';
    const wrong = normalized.replace(new RegExp(`^${modal}\\s+`, 'i'), `${modal} to `);
    return [wrong, normalized, `情态动词 ${modal} 后面直接接动词原形，不加 to；如果结构中出现 do 或 something，需要按具体语境替换成真实内容。`];
  }
  const neverDoubleFinalConsonant = new Set(['answer', 'consider', 'discover', 'happen', 'listen', 'offer', 'open', 'visit']);
  const gerund = item.w.endsWith('ie')
    ? item.w.slice(0, -2) + 'ying'
    : item.w.endsWith('e') && !/(?:ee|ye|oe)$/.test(item.w)
      ? item.w.slice(0, -1) + 'ing'
      : /[^aeiou][aeiou][^aeiouwxy]$/.test(item.w) && !neverDoubleFinalConsonant.has(item.w)
        ? item.w + item.w.at(-1) + 'ing'
        : item.w + 'ing';
  return fallbackIndex === 0
    ? [`can to ${item.w}`, `can ${item.w}`, `情态动词 can 后面直接接 ${item.w} 的原形，不加 to。`]
    : [`to ${gerund}`, `to ${item.w}`, `这里的 to 是不定式标记，后面要用 ${item.w} 的原形，不能改成 ${gerund}。`];
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

const definitionHeadWords = new Set([
  ...activeWords,
  'accept', 'accompany', 'allow', 'approve', 'arrive', 'ask', 'be', 'become', 'begin', 'bring', 'carry',
  'cause', 'change', 'choose', 'collide', 'communicate', 'construct', 'contact', 'continue', 'control',
  'damage', 'decide', 'develop', 'direct', 'disappear', 'divide', 'employ', 'encounter', 'end', 'enjoy',
  'establish', 'exchange', 'exist', 'experience', 'express', 'fail', 'finish', 'function', 'gain', 'gather',
  'give', 'guide', 'have', 'identify', 'improve', 'increase', 'interrupt', 'keep', 'lift', 'locate', 'maintain',
  'manage', 'move', 'name', 'obtain', 'operate', 'organize', 'own', 'participate', 'perform', 'permit',
  'persuade', 'place', 'prefer', 'prevent', 'provide', 'reach', 'recognize', 'reduce', 'remain', 'request',
  'require', 'retain', 'satisfy', 'search', 'show', 'speak', 'start', 'stay', 'stop', 'strike', 'succeed',
  'support', 'take', 'test', 'tolerate', 'transfer', 'travel', 'drop', 'enter', 'use', 'wish'
]);

function splitEnglishSenses(definition) {
  const normalized = definition.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];
  if (/^used to\b/i.test(normalized)) return [normalized];
  const hasToPrefix = /^to\s+/i.test(normalized);
  const body = normalized.replace(/^to\s+/i, '');
  const raw = body.split(/\s*,\s*(?:or\s+)?|\s+or\s+/i).map((part) => part.trim()).filter(Boolean);
  const units = [];
  for (const part of raw) {
    const head = part.match(/^[a-z]+/i)?.[0]?.toLowerCase();
    if (!units.length || head === 'no' || head === 'not' || definitionHeadWords.has(head)) units.push(part);
    else units[units.length - 1] += `, ${part}`;
  }
  return units.map((unit) => hasToPrefix ? `to ${unit}` : unit).slice(0, 4);
}

function limitEnglishSensesToChinese(definitions, chinese) {
  const maximum = Math.max(1, chinese.split('；').map((part) => part.trim()).filter(Boolean).length);
  const merged = [...definitions];
  while (merged.length > maximum) {
    const right = merged.pop();
    const left = merged.pop();
    merged.push(`${left} or ${right.replace(/^to\s+/i, '')}`);
  }
  return merged;
}

const meaningHints = {
  accept: ['接受', '接纳', '认可'], arrive: ['到达', '抵达'], carry: ['带', '拿', '携带'], choose: ['选择', '挑选'],
  collide: ['撞击', '相撞'], contact: ['打电话', '联系'], continue: ['继续'], control: ['驾驶', '控制'],
  damage: ['弄坏', '损坏'], decide: ['决定', '确定'], develop: ['发展', '培养'], disappear: ['消失'], divide: ['切', '分开'],
  exchange: ['出售', '卖', '交换'], exist: ['存在'], express: ['表达', '表示'], fail: ['输掉', '失败'], finish: ['结束', '完成'],
  function: ['运行', '起作用', '奏效'], gather: ['采摘', '收集'], give: ['给', '提供', '给予'], grow: ['生长', '增长'],
  lift: ['举起', '捡起'], locate: ['找到', '定位'], maintain: ['保持'], manage: ['管理', '经营'], move: ['移动', '搬家'],
  name: ['称呼', '命名'], obtain: ['得到', '获得'], operate: ['运行', '经营', '操作'], organize: ['举行', '组织'],
  perform: ['做', '进行', '扮演', '演奏'], permit: ['允许', '可以'], persuade: ['推销', '说服'], place: ['放', '安置'],
  prevent: ['阻止', '防止'], provide: ['提供', '供给'], reach: ['到达', '达到'], recognize: ['辨别', '认出'], reduce: ['减少', '削减'],
  remain: ['保持', '仍然', '停留'], request: ['请求', '问'], require: ['需要', '要求', '花费'], retain: ['保留'],
  search: ['寻找'], show: ['展示', '表明'], speak: ['说', '交谈'], strike: ['击打', '撞击'], succeed: ['赢', '获得', '实现'],
  make: ['努力'], test: ['尝试', '试用', '试验'], transfer: ['给', '传递', '发送'], travel: ['去', '前往', '走路'],
  use: ['使用', '利用', '花费'], wish: ['想要', '希望', '愿意']
};

function chineseGroupsForSenses(chinese, englishSenses) {
  const parts = chinese.split('；').map((part) => part.trim()).filter(Boolean);
  if (englishSenses.length <= 1) return [parts.join('；')];
  const groups = englishSenses.map(() => []);
  const used = new Set();
  englishSenses.forEach((definition, definitionIndex) => {
    const head = definition.replace(/^to\s+/i, '').match(/^[a-z]+/i)?.[0]?.toLowerCase();
    const hints = meaningHints[head] ?? [];
    let bestIndex = parts.findIndex((part, index) => !used.has(index) && hints.some((hint) => part.includes(hint) || hint.includes(part)));
    if (bestIndex < 0) bestIndex = parts.findIndex((_, index) => !used.has(index));
    if (bestIndex >= 0) {
      groups[definitionIndex].push(parts[bestIndex]);
      used.add(bestIndex);
    }
  });
  parts.forEach((part, partIndex) => {
    if (used.has(partIndex)) return;
    const matchedIndex = englishSenses.findIndex((definition) => {
      const head = definition.replace(/^to\s+/i, '').match(/^[a-z]+/i)?.[0]?.toLowerCase();
      return (meaningHints[head] ?? []).some((hint) => part.includes(hint) || hint.includes(part));
    });
    if (matchedIndex >= 0) groups[matchedIndex].push(part);
  });
  return groups.map((group, index) => group.join('；') || parts[Math.min(index, parts.length - 1)]);
}

function meaningExamplePool(item) {
  const priorityUses = priorityEntries[item.w]?.uses;
  if (priorityUses) return priorityUses.map(([phrase, chinese, example, translation]) => ({ phrase, chinese, example, translation }));
  return (curatedExamples[item.w] ?? [[item.ex, item.exZh]]).map(([example, translation], index) => ({
    phrase: curatedPhrases[item.w]?.[index]?.[0] ?? item.coll,
    chinese: curatedPhrases[item.w]?.[index]?.[1] ?? item.collZh,
    example,
    translation
  }));
}

function selectMeaningExample(english, chinese, pool, usedIndexes) {
  const chineseParts = chinese.split('；').filter((part) => part.length > 1);
  const selected = pool
    .map((entry, index) => ({
      entry,
      index,
      score: definitionSimilarity(english, `${entry.phrase} ${entry.example}`) * 2
        + chineseParts.filter((part) => entry.chinese.includes(part) || entry.translation.includes(part)).length * 5
    }))
    .filter(({ index }) => !usedIndexes.has(index))
    .sort((left, right) => right.score - left.score || left.index - right.index)[0];
  if (!selected) return pool[0];
  usedIndexes.add(selected.index);
  return selected.entry;
}

function normalizeMeanings(item, override) {
  if (override?.meanings) {
    return override.meanings.map(([partOfSpeech, english, chinese, example, translation]) => ({ partOfSpeech, english, chinese, example, translation }));
  }
  const examplePool = meaningExamplePool(item);
  const manual = manualMeaningPacks[item.w];
  if (manual) {
    return manual.map(([partOfSpeech, english, chinese, exampleIndex, customExample, customTranslation]) => {
      const evidence = examplePool[exampleIndex] ?? examplePool[0];
      return {
        partOfSpeech,
        english,
        chinese,
        example: customExample ?? evidence.example,
        translation: customTranslation ?? evidence.translation
      };
    });
  }
  const englishSenses = limitEnglishSensesToChinese(splitEnglishSenses(item.en), item.zh);
  const chineseGroups = chineseGroupsForSenses(item.zh, englishSenses);
  const usedExamples = new Set();
  const rows = englishSenses.map((english, index) => {
    const chinese = chineseGroups[index];
    const evidence = selectMeaningExample(english, chinese, examplePool, usedExamples);
    return {
      partOfSpeech: item.p.split('/')[0].trim(),
      english,
      chinese,
      example: evidence.example,
      translation: evidence.translation
    };
  });
  const secondary = secondarySenses[item.w];
  if (secondary && !rows.some((entry) => entry.english.toLowerCase() === secondary.english.toLowerCase())) rows.push(secondary);
  const seen = new Set();
  return rows.filter((entry) => {
    const key = `${entry.english}|${entry.chinese}`.toLowerCase().replace(/[^a-z\u4e00-\u9fff]+/g, ' ').trim();
    if (!entry.english || !entry.chinese || seen.has(key)) return false;
    seen.add(key);
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
  // The source packs contain reviewed, reusable chunks. Keep those chunks as
  // context labels and reserve the complete sentences for fixed-phrase examples.
  const contextItems = examples.map((entry, index) => [entry[0], entry[1], index])
    .filter(([phrase], index, source) => source.findIndex(([candidate]) => candidate.toLowerCase() === phrase.toLowerCase()) === index);
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
  if (directRelationPacks[item.w]?.[key]) {
    const noteKey = key === 'synonyms' ? 'difference' : 'usage';
    return directRelationPacks[item.w][key].map(([word, partOfSpeech, chinese, note]) => ({
      word,
      phonetic: ipaFor(word),
      partOfSpeech,
      chinese,
      [noteKey]: key === 'synonyms'
        ? `${item.w} 与 ${word} 在本卡义项下意思接近。${note}`
        : `${item.w} 与 ${word} 在本卡义项下形成明确对比。${note}`
    }));
  }
  if (key === 'synonyms') {
    // WordNet groups words by every recorded sense.  A common word can therefore
    // pick up a technically valid but pedagogically misleading relation from a
    // rare sense (for example find -> chance or solve -> lick).  This field asks
    // for the most direct synonym, so keep only the reviewed source relation.
    const candidates = [
      { word: item.syn, partOfSpeech: item.syn.includes(' ') ? 'phr.' : item.p.split('/')[0].trim(), definition: item.en }
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
      difference: `${entry.word} 更侧重“${relationIndex === 0 ? relatedChinese(entry.word, item, 'synonym') : conciseChinese(entry.word, '相近动作')}”；${item.w} 的核心义是“${firstMeaning(item.zh)}”。两者意思接近，但替换时仍要核对宾语、介词和具体语境。`
    }));
  }
  if (key === 'antonyms') {
    // Antonymy is even more sense-dependent.  The source list contains one
    // reviewed direct contrast for the taught sense, so do not pad this section
    // with opposites belonging to unrelated secondary senses.
    const candidates = [
      { word: item.ant, partOfSpeech: item.ant.includes(' ') ? 'phr.' : item.p.split('/')[0].trim(), definition: `opposite of ${item.w}` }
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
      usage: `当 ${item.w} 表示“${firstMeaning(item.zh)}”时，${entry.word} 表示“${relationIndex === 0 ? relatedChinese(entry.word, item, 'antonym') : conciseChinese(entry.word, '相反含义')}”。两者只在这个明确义项下构成直接对比，其他用法不能一概互换。`
    }));
  }
  return [];
}

const derivativeSuffixes = new Set([
  'al', 'ance', 'ant', 'ation', 'ed', 'ence', 'ent', 'er', 'ful', 'ible', 'ic', 'ing', 'ion', 'ish',
  'ism', 'ist', 'ity', 'ive', 'ize', 'less', 'ly', 'ment', 'ness', 'or', 'ous', 'ship', 'sion', 'tion', 'y'
]);

function hasTransparentDerivativeRelation(base, candidate) {
  const source = base.toLowerCase();
  const word = candidate.toLowerCase();
  const roots = new Set([
    source,
    source.endsWith('e') ? source.slice(0, -1) : source,
    source.endsWith('y') ? `${source.slice(0, -1)}i` : source,
    source.length >= 3 ? `${source}${source.at(-1)}` : source
  ]);
  return [...roots].some((root) => word.startsWith(root) && derivativeSuffixes.has(word.slice(root.length)));
}

function isLearningDerivativePartOfSpeech(value = '') {
  return /(?:^|[\s/])(v\.|n\.|adj\.|adv\.)(?:$|[\s/])/i.test(value.trim());
}

function derivativePartOfSpeechRank(value = '') {
  const order = ['v.', 'n.', 'adj.', 'adv.'];
  const parts = value.toLowerCase().split(/\s*\/\s*/).map((part) => part.trim());
  const ranks = order.map((part, index) => parts.includes(part) ? index : 99);
  return Math.min(...ranks);
}

function finalizeDerivatives(item, entries) {
  const seen = new Set();
  return entries
    .filter((entry) => entry.word && entry.word.toLowerCase() !== item.w.toLowerCase())
    .filter((entry) => isLearningDerivativePartOfSpeech(entry.partOfSpeech))
    .filter((entry) => {
      const word = entry.word.toLowerCase();
      if (seen.has(word)) return false;
      seen.add(word);
      return true;
    })
    .sort((left, right) => derivativePartOfSpeechRank(left.partOfSpeech) - derivativePartOfSpeechRank(right.partOfSpeech))
    .slice(0, 8)
    .map((entry) => ({
      word: entry.word,
      phonetic: entry.phonetic ?? ipaFor(entry.word),
      partOfSpeech: entry.partOfSpeech,
      chinese: entry.chinese ?? conciseChinese(entry.word, '与本词同词族'),
      note: entry.note ?? `${entry.word} 是 ${item.w} 的常用词族形式；作 ${entry.partOfSpeech} 时表示“${entry.chinese ?? conciseChinese(entry.word, '相关含义')}”。`
    }));
}

function normalizeDerivatives(item, override) {
  const priorityDerivatives = priorityEntries[item.w]?.derivatives;
  if (override?.derivatives) {
    return finalizeDerivatives(item, override.derivatives
      .filter(([word]) => word.toLowerCase() !== item.w.toLowerCase())
      .map(([word, partOfSpeech, chinese, note]) => ({ word, phonetic: ipaFor(word), partOfSpeech, chinese, note })));
  }
  const hasLockedDerivativePack = Object.hasOwn(manualDerivativePacks, item.w);
  const curated = (hasLockedDerivativePack ? manualDerivativePacks[item.w] : (priorityDerivatives ?? []))
    .filter(([, , , note]) => !/(较少见|不常用|生僻)/.test(note ?? ''))
    .map(([word, partOfSpeech, chinese, note]) => ({ word, partOfSpeech, chinese, note }));
  const legacy = (hasLockedDerivativePack ? [] : (families[item.w] ?? [])).map((word) => ({
    word,
    partOfSpeech: lexiconByWord.get(word)?.p ?? wordMetadata[word]?.partOfSpeech,
    chinese: lexiconByWord.has(word) ? firstMeaning(lexiconByWord.get(word).zh) : wordMetadata[word]?.chinese
  }));
  // Never pad a card with WordNet's broad morphological relations.  A short
  // verb can otherwise acquire obscure occupations, technical senses, or mere
  // inflections.  Only the reviewed priority list, manual packs, and the
  // maintained family list are allowed into learner-facing derivative cards.
  const dictionary = [];
  const falseDerivativePairs = {
    affect: ['effect', 'effective'],
    bring: ['bringing'],
    come: ['comer'],
    eat: ['edible'],
    end: ['finally'],
    feel: ['felt'],
    get: ['getter'],
    join: ['joint'],
    leave: ['leaving'],
    let: ['letter'],
    like: ['looking'],
    live: ['liver'],
    look: ['looker'],
    pass: ['passenger'],
    put: ['putting'],
    set: ['settlement'],
    solve: ['solvent'],
    serve: ['server']
  };
  const falseFriends = new Set(falseDerivativePairs[item.w] ?? []);
  const candidates = [...curated, ...legacy, ...dictionary]
    .filter((entry) => !falseFriends.has(entry.word.toLowerCase()))
    .filter((entry) => !inflectedForms(item.w).has(entry.word.toLowerCase()) || curated.some((candidate) => candidate.word.toLowerCase() === entry.word.toLowerCase()))
    .map((entry) => ({ ...entry, partOfSpeech: entry.partOfSpeech ?? ecdictPartOfSpeech(entry.word) }));
  return finalizeDerivatives(item, candidates);
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

function normalizeRelated(item, index, override, derivatives, synonyms, antonyms, confusableItems) {
  if (override?.related) {
    return override.related.map(([category, items]) => ({
      category,
      items: items.map(([word, partOfSpeech, chinese]) => ({ word, phonetic: ipaFor(word), partOfSpeech, chinese }))
    }));
  }
  const reviewedRelated = manualRelatedPacks[item.w] ?? [];
  if (reviewedRelated.length) {
    return [{
      category: '语义关联：一起理解更清楚',
      items: reviewedRelated.map(([word, partOfSpeech, chinese]) => ({
        word,
        phonetic: ipaFor(word),
        partOfSpeech,
        chinese
      }))
    }];
  }
  // An empty section is more useful than cross-sense dictionary padding.  The
  // UI states this honestly, while curated cards and reviewed packs retain
  // meaningful related vocabulary.
  return [];
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
  begin: ['began', 'begun'], break: ['broke', 'broken'], bring: ['brought'], buy: ['bought'], choose: ['chose', 'chosen'],
  come: ['came'], cut: ['cut'], deal: ['dealt'], do: ['does', 'did', 'done', 'doing'], drive: ['drove', 'driven'], eat: ['ate', 'eaten'],
  fall: ['fell', 'fallen'], feel: ['felt'], find: ['found'], get: ['got', 'gotten'], give: ['gave', 'given'], go: ['went', 'gone'],
  grow: ['grew', 'grown'], have: ['has', 'had'], hear: ['heard'], hold: ['held'], keep: ['kept'], know: ['knew', 'known'],
  lead: ['led'], leave: ['left'], lose: ['lost'], make: ['made'], mean: ['meant'], meet: ['met'], pay: ['paid'], read: ['read'],
  run: ['ran', 'running'], say: ['said'], see: ['saw', 'seen'], sell: ['sold'], send: ['sent'], sit: ['sat'], speak: ['spoke', 'spoken'],
  spend: ['spent'], stand: ['stood'], take: ['took', 'taken'], tell: ['told'], think: ['thought'], understand: ['understood'],
  wear: ['wore', 'worn'], win: ['won'], write: ['wrote', 'written']
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
  if (/\bto\s+do\b/i.test(normalized)) return '完整结构中使用 to + 动词原形；do 只是语法占位符，要换成符合语境的具体动词原形';
  if (/\bdoing\b/i.test(normalized)) return '完整结构中的 doing 是语法占位符，要换成符合语境的动词 -ing 形式';
  if (/\bdone\b/i.test(normalized)) return '完整结构中的 done 是语法占位符，要换成符合语境的过去分词';
  if (/\bto\s+be\b/i.test(normalized)) return '完整结构中使用 to be，后面接名词、形容词或其他补语';
  if (/^(?:can|could|may|might|must|should|will|would)\s+(?:you\s+)?(?:rather\s+)?do\b/i.test(normalized)) return '情态动词结构中使用动词原形；do 是语法占位符，要换成具体动词原形';
  if (/\bfrom\b.*\bto\b/i.test(normalized)) return '同时使用 from 和 to，表示范围或变化的起点与终点';
  if (/\bmore\b.*\bto\b/i.test(normalized)) return '使用 more 构成比较级，后面再接 to + 动词原形';
  if (/\bless\b.*\bto\b/i.test(normalized)) return '使用 less 表示较低可能性，后面再接 to + 动词原式';
  if (/^be\s+likely\s+to\b/i.test(normalized)) return '使用 be + likely + to + 动词原式，不加 more 或 less 构成比较';
  if (/\bthat\b/i.test(normalized)) return '使用 that 引导一个主谓完整的从句';
  const preposition = normalized.match(/\b(on|in|at|for|with|by|from|of|about|into|over|through|to|as|along|against|without|within)\b/i)?.[1];
  if (preposition) return `完整搭配中使用介词 ${preposition.toLowerCase()}`;
  if (/\bsomething\b/i.test(normalized)) return '结构中直接带有事物宾语，不在目标词与宾语之间增加介词';
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
  const additionalMeaningFocus = meanings.length > 1
    ? `再对比另外 ${meanings.length - 1} 个常用义项，辨别不同语境。`
    : '再用本卡的固定搭配和真实例句巩固这个义项。';
  const focus = override?.focus ?? [
    `先掌握“${meanings[0].chinese}”这个核心义，${additionalMeaningFocus}`,
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
  const meaningOptions = rotateOptions([meanings[0].chinese, firstMeaning(next.zh), firstMeaning(nextTwo.zh)], index);
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
    { id: id + '-meaning-core', type: 'meaning_choice', prompt: '“' + item.w + '”最核心的中文含义是？', options: meaningOptions, answer: meanings[0].chinese, stage: 'T0', ai: false },
    { id: id + '-meaning-english', type: 'meaning_choice', prompt: '哪一项英文释义最符合词卡中的 “' + item.w + '”？', options: englishMeaningOptions, answer: meanings[0].english, stage: 'T0', ai: false },
    { id: id + '-structure-choice-v3', type: 'meaning_choice', prompt: structurePrompt(structures[0], '核心结构辨析'), options: structureOptions, answer: structures[0].phrase, stage: 'T1', ai: false },
    { id: id + '-synonym-choice', type: 'meaning_choice', prompt: '哪个词是词卡中列出的 “' + item.w + '” 最直接近义词？', options: synonymOptions, answer: synonymAnswer, stage: 'T2', ai: false },
    { id: id + '-antonym-choice', type: 'meaning_choice', prompt: '哪个词是词卡中列出的 “' + item.w + '” 最直接反义词？', options: antonymOptions, answer: antonymAnswer, stage: 'T2', ai: false },
    { id: id + '-contrast-choice', type: 'meaning_choice', prompt: '根据本词卡辨析，哪个词被列为 “' + item.w + '” 的' + contrastKind + '？', options: contrastOptions, answer: contrast.word, stage: 'T3', ai: false },
    { id: id + '-recall-definition', type: 'recall', prompt: '根据英文释义写出目标词：' + meanings[0].english, answer: item.w, stage: 'T1', ai: false },
    { id: id + '-recall-chinese', type: 'recall', prompt: '写出符合“' + meanings[0].chinese + '”（' + meanings[0].partOfSpeech + '）的本课目标词。', answer: item.w, stage: 'T1', ai: false },
    clozeTargetQuestion(id + '-collocation-core', '补全高频搭配：', item.coll, item.w, 'T0'),
    structureMeaningQuestion(id + '-collocation-structure-meaning-v3', objectiveStructure, structures, 'T1', index + 8),
    contextualCompanionQuestion(id + '-collocation-example-context-v3', item.ex, item.exZh, item.w, contextualDistractors, 'T2', index + 9),
    phraseMeaningQuestion(id + '-collocation-fixed-1-v3', firstFixedEntry, fixedPhrases, 'T2', index + 6),
    phraseMeaningQuestion(id + '-collocation-fixed-2-v3', secondFixedEntry, fixedPhrases, 'T3', index + 7),
    clozeTargetQuestion(id + '-example-cloze', '根据句意补全词卡核心例句：', item.ex, item.w, 'T3'),
    { id: id + '-sentence-core', type: 'free_sentence', prompt: '请用 “' + item.w + '” 写一个自然、真实的英文句子，含义必须符合词卡核心义“' + meanings[0].chinese + '”。', answer: '', stage: 'T2', ai: true },
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
      chinese: summarizeChineseMeanings(meanings),
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
  source: 'COCA词频单词表.xlsx', generatedAt: '2026-09-09', contentVersion, templateVersion,
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
