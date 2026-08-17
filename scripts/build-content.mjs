import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lexicon } from './lexicon.mjs';
import { confusables, families, secondarySenses } from './content-overrides.mjs';
import { ipaFor } from './phonetics.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const contentCardsDir = path.join(root, 'content', 'cards');
const publicDailyDir = path.join(root, 'public', 'data', 'daily');
const publicDataDir = path.join(root, 'public', 'data');
const launchDate = new Date('2026-08-17T12:00:00+08:00');

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const primaryPos = (value) => value.split('/')[0].trim().replace('.', '');
const lexiconByWord = new Map(lexicon.map((item) => [item.w, item]));
const familyPosOverrides = {
  likelihood: 'n.', belief: 'n.', memory: 'n.', comparison: 'n.', chosen: 'adj.', effect: 'n.', discovery: 'n.',
  opportune: 'adj.', serve: 'v.', advise: 'v.', difficulty: 'n.', unaware: 'adj.', unfamiliar: 'adj.', comfort: 'n.',
  certainty: 'n.', uncertain: 'adj.', near: 'adj. / adv.', simple: 'adj.', quick: 'adj.', direct: 'adj. / adv.',
  healthy: 'adj.', unhealthy: 'adj.', workplace: 'n.', speech: 'n.', businesslike: 'adj.', teamwork: 'n.', unlikely: 'adj.'
};

function firstMeaning(value) {
  return value.split('；')[0];
}

function relatedChinese(word, item, relation) {
  const known = lexiconByWord.get(word);
  if (known) return firstMeaning(known.zh);
  if (relation === 'synonym') return '与“' + firstMeaning(item.zh) + '”意义接近';
  if (relation === 'antonym') return '与“' + firstMeaning(item.zh) + '”意义相反';
  return '与“' + item.w + '”同词族的常用词形';
}

function familyPartOfSpeech(word) {
  const known = lexiconByWord.get(word);
  if (known) return known.p;
  if (familyPosOverrides[word]) return familyPosOverrides[word];
  if (/(tion|sion|ment|ness|ity|ance|ence|ship|er|or|ism|hood)$/.test(word)) return 'n.';
  if (/ly$/.test(word)) return 'adv.';
  if (/(able|ible|ive|ous|ful|less|al|ic|ed|ing|ent|ant|ary)$/.test(word)) return 'adj.';
  return 'word family';
}

function extractExampleChunk(item) {
  const words = item.ex.replace(/[.!?,;:]/g, '').split(/\s+/);
  const stem = item.w.slice(0, Math.min(4, item.w.length)).toLowerCase();
  const index = words.findIndex((word) => word.toLowerCase().startsWith(stem));
  if (index < 0) return item.w;
  return words.slice(Math.max(0, index - 2), Math.min(words.length, index + 3)).join(' ');
}

function makeExamples(item) {
  return [
    { scene: '日常 / 真实表达', english: item.ex, chinese: item.exZh },
    {
      scene: '学习 / 工作场景',
      english: 'In today’s lesson, we practiced the word “' + item.w + '” in a complete sentence.',
      chinese: '今天的课程里，我们练习了怎样在完整句子中使用 ' + item.w + '。'
    },
    {
      scene: '核心搭配复现',
      english: '“' + item.coll + '” is the key phrase I want to remember.',
      chinese: '“' + item.coll + '”是我想重点记住的搭配。'
    },
    {
      scene: '常见错误提醒',
      english: 'I checked the context before choosing “' + item.w + '” instead of “' + item.syn + '”.',
      chinese: '我先检查语境，再决定用 ' + item.w + ' 而不是 ' + item.syn + '。'
    },
    {
      scene: '词义与近义辨析',
      english: 'Here, “' + item.w + '” means “' + item.en + '”.',
      chinese: '在这里，' + item.w + ' 的意思是“' + item.zh + '”。'
    }
  ];
}

function syllableHint(word) {
  const hints = {
    improve: 'im·prove', notice: 'no·tice', support: 'sup·port', likely: 'like·ly',
    manage: 'man·age', provide: 'pro·vide', understand: 'un·der·stand',
    believe: 'be·lieve', create: 'cre·ate', include: 'in·clude'
  };
  return hints[word] ?? word.replace(/(tion|sion|ment|ness|able|ible|ity|ing|ly)$/i, '·$1');
}

function makeCard(item, index) {
  const id = slug(item.w + '-' + primaryPos(item.p));
  const next = lexicon[(index + 17) % lexicon.length];
  const nextTwo = lexicon[(index + 43) % lexicon.length];
  const cloze = item.coll.includes(item.w)
    ? item.coll.replace(item.w, '_____')
    : 'Use _____ naturally in this situation.';
  const secondary = secondarySenses[item.w];
  const wordFamily = (families[item.w] ?? []).filter((word) => word !== item.w);
  const commonError = secondary
    ? '不要把不同词性混在一起；先确认句中需要的是 ' + item.p.split('/')[0].trim() + ' 还是 ' + secondary.partOfSpeech + '，并整体记住 “' + item.coll + '”。'
    : '不要只按中文逐字替换，也不要随意改动介词或语序；优先把 “' + item.coll + '” 当作一个完整句块记忆。';
  const meaningOptions = [item.zh, next.zh, nextTwo.zh];
  const shift = index % meaningOptions.length;
  const rotatedMeaningOptions = meaningOptions.slice(shift).concat(meaningOptions.slice(0, shift));

  return {
    id,
    word: item.w,
    lemma: item.w,
    phonetic: item.ipa,
    syllables: syllableHint(item.w),
    partOfSpeech: item.p,
    frequencyBand: 'COCA 高频精选',
    difficulty: index < 50 ? '基础' : index < 110 ? '进阶' : '应用',
    tags: [item.p.split('/')[0].trim(), index < 50 ? '高频表达' : '主动词汇'],
    coreMemory: {
      chinese: item.zh,
      english: item.en,
      structure: item.coll + '（' + item.collZh + '）',
      commonError,
      directSynonym: item.syn,
      directAntonym: item.ant,
      derivatives: wordFamily.length ? wordFamily.join(' · ') : '本词暂无需额外强记的高频派生词',
      example: item.ex,
      exampleChinese: item.exZh
    },
    meanings: [
      {
        partOfSpeech: item.p.split('/')[0].trim(),
        english: item.en,
        chinese: firstMeaning(item.zh),
        example: item.ex,
        translation: item.exZh
      },
      ...(secondary ? [secondary] : [])
    ],
    contextPhrases: [
      {
        category: '核心高频搭配',
        items: [{ phrase: item.coll, phonetic: ipaFor(item.coll, item.w, item.ipa), chinese: item.collZh }]
      },
      {
        category: '真实例句句块',
        items: [{ phrase: extractExampleChunk(item), phonetic: ipaFor(extractExampleChunk(item), item.w, item.ipa), chinese: '核心例句片段：' + item.exZh }]
      }
    ],
    fixedPhrases: [
      {
        phrase: item.coll,
        phonetic: ipaFor(item.coll, item.w, item.ipa),
        chinese: item.collZh,
        example: item.ex,
        translation: item.exZh
      }
    ],
    synonyms: [
      {
        word: item.syn,
        phonetic: ipaFor(item.syn),
        partOfSpeech: item.p,
        chinese: relatedChinese(item.syn, item, 'synonym'),
        difference: item.w + ' 在 “' + item.coll + '” 中是本卡需要主动掌握的表达；' + item.syn + ' 含义接近，但宾语、语气和固定搭配不一定相同。'
      }
    ],
    antonyms: [
      {
        word: item.ant,
        phonetic: ipaFor(item.ant),
        partOfSpeech: item.p,
        chinese: relatedChinese(item.ant, item, 'antonym'),
        usage: '和 ' + item.w + ' 的核心义形成对比；先在真实句子中判断是否确实构成反向关系。'
      }
    ],
    derivatives: wordFamily.map((word) => ({
      word,
      phonetic: ipaFor(word),
      partOfSpeech: familyPartOfSpeech(word),
      chinese: relatedChinese(word, item, 'family'),
      note: '这是 ' + item.w + ' 的常用词族成员；先辨认词性，再放进完整句子中使用。'
    })),
    confusables: confusables[item.w] ? [{
      ...confusables[item.w],
      phonetic: ipaFor(confusables[item.w].word)
    }] : [],
    relatedVocabulary: [
      {
        category: '语义坐标：近义与反义',
        items: [
          { word: item.syn, phonetic: ipaFor(item.syn), partOfSpeech: item.p, chinese: relatedChinese(item.syn, item, 'synonym') },
          { word: item.ant, phonetic: ipaFor(item.ant), partOfSpeech: item.p, chinese: relatedChinese(item.ant, item, 'antonym') }
        ]
      }
    ],
    examples: makeExamples(item),
    studyFocus: {
      coreMeaning: item.zh,
      keyCollocation: item.coll + '：' + item.collZh,
      commonMistake: commonError,
      mustUseExample: item.ex
    },
    questions: [
      {
        id: id + '-meaning',
        type: 'meaning_choice',
        prompt: '“' + item.w + '”最核心的中文含义是？',
        options: rotatedMeaningOptions,
        answer: item.zh,
        stage: 'T0',
        ai: false
      },
      {
        id: id + '-recall',
        type: 'recall',
        prompt: item.en + '。请输入目标单词。',
        answer: item.w,
        stage: 'T1',
        ai: false
      },
      {
        id: id + '-collocation',
        type: 'collocation',
        prompt: '补全高频搭配：' + cloze,
        answer: item.w,
        stage: 'T2',
        ai: false
      },
      {
        id: id + '-sentence',
        type: 'free_sentence',
        prompt: '请用 “' + item.w + '” 写一个自然、真实的英文句子。',
        answer: '',
        stage: 'T3',
        ai: true
      },
      {
        id: id + '-dialogue',
        type: 'dialogue',
        prompt: '在一段真实对话中自然使用 “' + item.w + '”，并避免中文直译。',
        answer: '',
        stage: 'T4',
        ai: true
      }
    ],
    reviewStages: {
      T0: ['meaning_choice', 'collocation', 'free_sentence'],
      T1: ['recall', 'collocation'],
      T2: ['recall', 'collocation', 'free_sentence'],
      T3: ['recall', 'dialogue'],
      T4: ['recall', 'dialogue'],
      T5: ['dialogue', 'free_sentence'],
      T6: ['dialogue', 'free_sentence'],
      T7: ['dialogue', 'free_sentence']
    },
    contentVersion: '2026.08.17.2',
    reviewed: true,
    sourceNote: '从用户提供的 COCA 词表筛选；释义、例句和搭配为本项目离线整理；关系词与词组音标来自 CMU 北美英语发音词典。'
  };
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

await fs.mkdir(contentCardsDir, { recursive: true });
await fs.mkdir(publicDailyDir, { recursive: true });

const cards = lexicon.map(makeCard);
for (const card of cards) {
  await fs.writeFile(
    path.join(contentCardsDir, card.id + '.json'),
    JSON.stringify(card, null, 2) + '\n',
    'utf8'
  );
}

const dailyFiles = [];
for (let dayIndex = 0; dayIndex < 30; dayIndex += 1) {
  const date = new Date(launchDate);
  date.setDate(launchDate.getDate() + dayIndex);
  const dateKey = formatDate(date);
  const dailyCards = cards.slice(dayIndex * 5, dayIndex * 5 + 5);
  const fileName = dateKey + '.json';
  const dailyPack = {
    date: dateKey,
    dayNumber: dayIndex + 1,
    contentVersion: '2026.08.17.2',
    cards: dailyCards
  };
  await fs.writeFile(
    path.join(publicDailyDir, fileName),
    JSON.stringify(dailyPack, null, 2) + '\n',
    'utf8'
  );
  dailyFiles.push({ dayNumber: dayIndex + 1, date: dateKey, file: 'data/daily/' + fileName, cardIds: dailyCards.map((card) => card.id) });
}

await fs.writeFile(
  path.join(publicDataDir, 'all-cards.json'),
  JSON.stringify({ contentVersion: '2026.08.17.2', total: cards.length, cards }, null, 2) + '\n',
  'utf8'
);

await fs.writeFile(
  path.join(publicDataDir, 'manifest.json'),
  JSON.stringify({
    appName: '每日英语',
    contentVersion: '2026.08.17.2',
    totalCards: cards.length,
    totalDays: dailyFiles.length,
    cardsPerDay: 5,
    scheduleStart: formatDate(launchDate),
    dailyFiles
  }, null, 2) + '\n',
  'utf8'
);

await fs.writeFile(
  path.join(root, 'content', 'content-manifest.json'),
  JSON.stringify({ source: 'COCA词频单词表.xlsx', generatedAt: '2026-08-17', cardIds: cards.map((card) => card.id) }, null, 2) + '\n',
  'utf8'
);

console.log('Generated ' + cards.length + ' cards and ' + dailyFiles.length + ' daily files.');
