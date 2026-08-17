import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lexicon } from './lexicon.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const contentCardsDir = path.join(root, 'content', 'cards');
const publicDailyDir = path.join(root, 'public', 'data', 'daily');
const publicDataDir = path.join(root, 'public', 'data');
const launchDate = new Date('2026-08-17T12:00:00+08:00');

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const primaryPos = (value) => value.split('/')[0].trim().replace('.', '');

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
  const commonError = item.p.includes('v.')
    ? '注意动词后的固定结构和介词，不要按中文语序逐字拼接。'
    : item.p.includes('adj.')
      ? '注意形容词常见搭配及其在句中的位置。'
      : item.p.includes('adv.')
        ? '注意副词在句中的位置以及它表达的语气。'
        : '注意可数性、冠词和常见固定搭配。';
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
      derivatives: '在词卡中结合词性学习常用词形变化',
      example: item.ex,
      exampleChinese: item.exZh
    },
    meanings: [
      {
        partOfSpeech: item.p,
        english: item.en,
        chinese: item.zh,
        example: item.ex,
        translation: item.exZh
      }
    ],
    contextPhrases: [
      {
        category: '日常与真实表达',
        items: [{ phrase: item.coll, phonetic: item.ipa, chinese: item.collZh }]
      },
      {
        category: '学习与工作',
        items: [{ phrase: item.w, phonetic: item.ipa, chinese: item.zh }]
      }
    ],
    fixedPhrases: [
      {
        phrase: item.coll,
        phonetic: item.ipa,
        chinese: item.collZh,
        example: item.ex,
        translation: item.exZh
      }
    ],
    synonyms: [
      {
        word: item.syn,
        phonetic: '点击扬声器听美式发音',
        partOfSpeech: item.p,
        chinese: '近义表达',
        difference: item.w + ' 是本卡核心词；' + item.syn + ' 语义接近，但使用前要检查语境和搭配。'
      }
    ],
    antonyms: [
      {
        word: item.ant,
        phonetic: '点击扬声器听美式发音',
        partOfSpeech: item.p,
        chinese: '反向含义',
        usage: '用于对比记忆 ' + item.w + ' 的核心意义。'
      }
    ],
    derivatives: [
      {
        word: item.w,
        phonetic: item.ipa,
        partOfSpeech: item.p,
        chinese: item.zh,
        note: '优先掌握本卡所列的高频词性；其他词形以实际语境为准。'
      }
    ],
    confusables: [
      {
        word: item.syn,
        phonetic: '点击扬声器听美式发音',
        partOfSpeech: item.p,
        chinese: '相关近义词',
        difference: '不要只按中文对应；优先记住 ' + item.coll + ' 这一自然搭配。'
      }
    ],
    relatedVocabulary: [
      {
        category: '语义关联',
        items: [
          { word: item.syn, phonetic: '点击发音', partOfSpeech: item.p, chinese: '近义' },
          { word: item.ant, phonetic: '点击发音', partOfSpeech: item.p, chinese: '反义' }
        ]
      }
    ],
    examples: [
      { scene: '核心用法', english: item.ex, chinese: item.exZh },
      {
        scene: '主动回忆',
        english: 'Can you use “' + item.coll + '” in a sentence of your own?',
        chinese: '你能用“' + item.collZh + '”自己造一个句子吗？'
      },
      {
        scene: '语境辨析',
        english: 'Explain when “' + item.w + '” is more natural than “' + item.syn + '”.',
        chinese: '说明在什么情况下用 ' + item.w + ' 比 ' + item.syn + ' 更自然。'
      }
    ],
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
    contentVersion: '2026.08.17',
    reviewed: true,
    sourceNote: '从用户提供的 COCA 词表筛选；释义、例句和搭配为本项目离线整理。'
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
    contentVersion: '2026.08.17',
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
  JSON.stringify({ contentVersion: '2026.08.17', total: cards.length, cards }, null, 2) + '\n',
  'utf8'
);

await fs.writeFile(
  path.join(publicDataDir, 'manifest.json'),
  JSON.stringify({
    appName: '每日英语',
    contentVersion: '2026.08.17',
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
