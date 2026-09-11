import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
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
import { curatedSynonymWords, semanticFallbackSynonyms, semanticPhraseChinese } from './semantic-fallbacks.mjs';
import tatoebaExampleData from './tatoeba-examples.json' with { type: 'json' };
import { finalizeMeaningRows } from './common-noun-senses.mjs';
import { semanticRelatedPacks } from './semantic-related-packs.mjs';
import { manualCardPacks } from './manual-card-packs.mjs';
import {
  buildSecondaryMeaningChoiceQuestion,
  buildFixedPhrases,
  buildSemanticRelatedVocabulary,
  classifyContextPhrase,
  isConcisePhraseGloss,
  mechanicalContextIssue,
  phraseContainsTarget,
  reusablePhraseIssue,
  rewriteLearnerQuestionPrompts,
  selectRelationQuestionAnswer,
  selectSecondaryRelationQuestionAnswer,
  selectTeachingDistractors,
  slotGuidance,
  structureFormClue
} from './quality-sections.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const contentCardsDir = path.join(root, 'content', 'cards');
const publicDailyDir = path.join(root, 'public', 'data', 'daily');
const publicDataDir = path.join(root, 'public', 'data');
const launchDate = new Date('2026-08-17T12:00:00+08:00');
const release = JSON.parse(await fs.readFile(path.join(root, 'content', 'release.json'), 'utf8'));
const { contentVersion, templateVersion } = release;
const templateLock = JSON.parse(await fs.readFile(path.join(root, 'content', 'templates', 'template-lock.json'), 'utf8'));
const CODE_RELATION_MINIMUMS = Object.freeze({ antonyms: 3, confusables: 2 });
const CODE_REFERENCE_RELATION_MINIMUMS = Object.freeze({ antonyms: 4, confusables: 4 });
const publishedMinimums = templateLock.publishedCardMinimums;
const curatedMinimums = templateLock.curatedCardMinimums ?? {};
const qualityMinimums = {
  antonyms: templateLock.qualityContract?.minimumAntonymsPerCard,
  confusables: templateLock.qualityContract?.minimumConfusablesPerCard
};
const minimumAntonyms = Math.max(CODE_RELATION_MINIMUMS.antonyms, publishedMinimums?.antonyms ?? 0, qualityMinimums.antonyms ?? 0);
const minimumConfusables = Math.max(CODE_RELATION_MINIMUMS.confusables, publishedMinimums?.confusables ?? 0, qualityMinimums.confusables ?? 0);
const detailFloorFailures = [];

for (const [field, codeFloor] of Object.entries(CODE_RELATION_MINIMUMS)) {
  const qualityField = field === 'antonyms' ? 'minimumAntonymsPerCard' : 'minimumConfusablesPerCard';
  if (!Number.isInteger(publishedMinimums?.[field]) || publishedMinimums[field] < codeFloor
    || !Number.isInteger(curatedMinimums?.[field]) || curatedMinimums[field] < codeFloor
    || !Number.isInteger(templateLock.qualityContract?.[qualityField]) || templateLock.qualityContract[qualityField] < codeFloor) {
    throw new Error(`Template lock ${field} floors cannot be weaker than the immutable code minimum of ${codeFloor}.`);
  }
  if (Object.hasOwn(templateLock.adaptiveSections ?? {}, field)) {
    throw new Error(`Template lock cannot mark mandatory ${field} as adaptive.`);
  }
}
if (templateLock.referenceCard?.word !== 'work' || templateLock.referenceCard?.cardId !== 'work-v') {
  throw new Error('Template lock must preserve work-v as the immutable reference card.');
}
for (const [field, codeFloor] of Object.entries(CODE_REFERENCE_RELATION_MINIMUMS)) {
  const value = templateLock.referenceCard?.recordedShape?.[field];
  if (!Number.isInteger(value) || value < codeFloor) {
    throw new Error(`Reference-card ${field} shape cannot be weaker than the immutable code minimum of ${codeFloor}.`);
  }
}

// Sparse verbs need a few additional, hand-checked examples so every published
// card can meet the same visible detail floor without fabricating relations.
const manualSupplementalExamples = {
  be: [
    ['She is interested in modern art.', '她对现代艺术感兴趣。', '对现代艺术感兴趣'],
    ['You are responsible for checking the figures.', '你负责核对这些数字。', '负责核对数据'],
    ['He is good at solving practical problems.', '他善于解决实际问题。', '善于解决实际问题'],
    ['Please be ready for the meeting at nine.', '请为九点的会议做好准备。', '为会议做好准备']
  ],
  have: [
    ['We have breakfast at seven every morning.', '我们每天早上七点吃早餐。', '吃早餐'],
    ['Have a look at this report.', '看一下这份报告。', '看一下这份报告'],
    ['They had a short conversation after lunch.', '他们午饭后简短地谈了一会儿。', '进行简短交谈'],
    ['I have no idea why the train is late.', '我不知道火车为什么晚点。', '不知道；不清楚']
  ],
  do: [
    ['I do my homework after dinner.', '我晚饭后做作业。', '做作业'],
    ['Our company does business with local suppliers.', '我们公司与当地供应商做生意。', '与当地供应商做生意'],
    ['The storm did serious damage to the roof.', '暴风雨严重损坏了屋顶。', '对屋顶造成严重损坏'],
    ['They do research on language learning.', '他们研究语言学习。', '研究语言学习']
  ],
  say: [
    ['Please say hello to your family.', '请代我向你的家人问好。', '向家人问好'],
    ['You can say no to an unfair request.', '你可以拒绝不公平的要求。', '拒绝不公平的要求'],
    ['It is difficult to say for certain.', '这很难说准。', '说准；确定地说'],
    ['She said something clearly and calmly.', '她清楚而冷静地说了些话。', '清楚地说出某事'],
    ['Please say your name clearly.', '请清楚地说出你的名字。', '清楚地说出名字'],
    ['She said goodbye to her colleagues before leaving.', '她离开前向同事们道别。', '向同事道别']
  ],
  go: [
    ['They go abroad every summer.', '他们每年夏天都出国。', '出国'],
    ['We go shopping on Saturday morning.', '我们星期六早上去购物。', '去购物'],
    ['I usually go by bus.', '我通常乘公交车去。', '乘公交车去'],
    ['The lights went out during the storm.', '暴风雨期间灯灭了。', '熄灭；停止运转']
  ],
  let: [
    ['My parents let me stay out late on Fridays.', '我父母允许我星期五晚些回家。', '让某人晚归', 'let someone stay out late'],
    ['The hotel lets guests use the pool until ten.', '这家酒店允许客人使用泳池到十点。', '允许某人使用某物', 'let someone use something'],
    ['Let the soup cool before you taste it.', '先让汤凉下来再尝。', '让某物冷却', 'let something cool'],
    ['She would not let go of the rope.', '她不肯松开绳子。', '松开绳子', 'let go of the rope']
  ],
  can: [
    ['We can afford to wait one more day.', '我们承担得起再等一天。', '能够承担；负担得起'],
    ['Can you please open the window?', '请问你能打开窗户吗？', '能否请你……'],
    ['She can speak three languages fluently.', '她能流利地说三种语言。', '会说三种语言'],
    ['You can always ask for help.', '你随时都可以寻求帮助。', '随时可以寻求帮助']
  ],
  make: [
    ['The news made everyone happy.', '这个消息使大家都很高兴。', '使大家高兴'],
    ['This small shop makes money by selling coffee.', '这家小店靠卖咖啡赚钱。', '赚钱'],
    ['Please make room for the visitors.', '请给来访者腾出空间。', '为来访者腾出空间'],
    ['We can make progress with daily practice.', '每天练习能让我们取得进步。', '取得进步']
  ],
  love: [
    ['I love this city for its quiet parks.', '我喜欢这座城市安静的公园。', '因为某事物的特点而喜欢它', 'love something for something'],
    ['She loves having friends over for dinner.', '她喜欢邀请朋友来家里吃饭。', '喜欢邀请朋友来家里', 'love having someone over']
  ],
  base: [
    ['We based our estimate on last year\'s sales figures.', '我们根据去年的销售数据作出了估算。'],
    ['The film is based on a true story.', '这部电影根据真实故事改编。'],
    ['You should base your decision on reliable evidence.', '你应该根据可靠的证据作出决定。']
  ],
  build: [
    ['The team built a simple tool to track its progress.', '团队制作了一个用于跟踪进度的简单工具。'],
    ['We need to build trust with our customers.', '我们需要与客户建立信任。']
  ],
  break: [
    ['Be careful not to break the glass.', '小心别打碎玻璃。']
  ],
  affect: [
    ['The delay affected everyone on the team.', '这次延误影响了团队中的每个人。'],
    ['Noise can affect your concentration.', '噪声会影响你的注意力。', '影响某人的注意力', "affect someone's concentration"],
    ['The new rule may affect how we work.', '新规定可能会影响我们的工作方式。', '影响某人的工作方式', 'affect how someone works'],
    ['The medicine did not affect my sleep.', '这种药没有影响我的睡眠。', '影响某人的睡眠', "affect someone's sleep"]
  ],
  describe: [
    ['She described the process in simple terms.', '她用简单的语言描述了这个过程。']
  ],
  encourage: [
    ['Good teachers encourage students to ask questions.', '优秀的老师会鼓励学生提问。'],
    ['The coach encouraged the players to stay focused.', '教练鼓励队员们保持专注。'],
    ['Her parents encouraged her to apply for the scholarship.', '她的父母鼓励她申请奖学金。']
  ],
  end: [
    ['The meeting ended with a clear action plan.', '会议以一份明确的行动计划结束。']
  ],
  fall: [
    ['Temperatures usually fall after sunset.', '日落后气温通常会下降。']
  ],
  handle: [
    ['She handled the complaint calmly and professionally.', '她冷静而专业地处理了这起投诉。']
  ],
  happen: [
    ['Accidents can happen anywhere.', '事故在任何地方都可能发生。', '在任何地方发生', 'happen anywhere'],
    ['The change happened gradually.', '这一变化是逐渐发生的。', '逐渐发生', 'happen gradually']
  ],
  drive: [
    ['She drives carefully in heavy traffic.', '她在拥挤的车流中谨慎驾驶。', '谨慎驾驶', 'drive carefully'],
    ['A small motor drives the pump.', '一台小型电动机驱动这台泵。', '驱动机器', 'drive a machine']
  ],
  include: [
    ['The package includes free technical support for one year.', '这个套餐包括一年的免费技术支持。'],
    ['Please include your phone number in the application.', '请在申请表中填写你的电话号码。']
  ],
  mean: [
    ['I did not mean any harm.', '我没有恶意。'],
    ['What does this word mean in context?', '这个词在语境中是什么意思？']
  ],
  realize: [
    ['I suddenly realized that I had left my keys at home.', '我突然意识到钥匙落在家里了。', '意识到某事', 'realize that + clause'],
    ['I did not realize the importance of clear instructions.', '我没有意识到清晰说明的重要性。', '意识到某事的重要性', 'realize the importance of something'],
    ['Do you realize what this change means?', '你意识到这项变化意味着什么吗？', '意识到某事意味着什么', 'realize what something means'],
    ['Over time, she came to realize the value of patience.', '慢慢地，她开始认识到耐心的价值。', '逐渐认识到某事', 'come to realize something']
  ],
  compare: [
    ['We compared the two proposals carefully.', '我们仔细比较了这两个方案。', '比较两个方案', 'compare two proposals'],
    ['Do not compare yourself with other people.', '不要拿自己与别人比较。', '拿自己与别人比较', 'compare yourself with others'],
    ['Compare prices before you place an order.', '下单前先比较价格。', '比较价格', 'compare prices'],
    ['The two teams compared notes after the experiment.', '两个团队在实验后交换了意见。', '交换意见', 'compare notes'],
    ['This report compares current sales with last year\'s figures.', '这份报告把当前销量与去年的数据作了比较。', '把当前销量与过去数据比较', 'compare current sales with past figures']
  ],
  report: [
    ['Please report any damage to the front desk.', '如有损坏，请向前台报告。'],
    ['The newspaper reported that the road had reopened.', '报纸报道称那条道路已经重新开放。'],
    ['Several employees reported feeling unwell after lunch.', '几名员工报告说午饭后感到不适。'],
    ['Please report the problem to your manager.', '请向你的经理报告这个问题。']
  ],
  require: [
    ['This job requires strong communication skills.', '这份工作要求具备很强的沟通能力。']
  ],
  solve: [
    ['We solved the problem by checking each step.', '我们通过逐步检查解决了这个问题。'],
    ['The team solved the puzzle in ten minutes.', '团队在十分钟内解开了这个谜题。', '解开谜题', 'solve a puzzle'],
    ['Good communication can solve many misunderstandings.', '良好的沟通能化解许多误会。', '化解误会', 'solve a misunderstanding']
  ],
  sit: [
    ['Sit near the window if you want more light.', '如果你想要更明亮的光线，就坐在窗边。']
  ],
  win: [
    ['The proposal won broad support from local residents.', '这项提案赢得了当地居民的广泛支持。']
  ],
  know: [
    ['Do you know the answer?', '你知道答案吗？'],
    ['I know her well.', '我很了解她。'],
    ['This town is known for its old buildings.', '这个小镇以古老建筑闻名。'],
    ['I know him by name, but I have never met him.', '我知道他的名字，但从未见过他。']
  ],
  think: [
    ['Think about the problem before answering.', '回答前先想一想这个问题。'],
    ['She thinks highly of her former teacher.', '她对以前的老师评价很高。'],
    ['We need to think ahead and prepare early.', '我们需要提前考虑并及早准备。']
  ],
  hope: [
    ['We hope for better weather tomorrow.', '我们希望明天天气更好。'],
    ['I hope to hear from you soon.', '我希望很快收到你的消息。']
  ],
  listen: [
    ['Please listen to what she has to say.', '请听听她要说什么。', '听某人说话', 'listen to what someone says'],
    ['We listened in silence while he explained the plan.', '他解释计划时，我们静静地听着。', '静静聆听', 'listen in silence'],
    ['Try to listen without interrupting the speaker.', '尽量听完，不要打断说话者。', '倾听而不打断', 'listen without interrupting']
  ],
  develop: [
    ['The team developed a clear strategy for the launch.', '团队为发布制定了明确的策略。', '制定策略', 'develop a strategy'],
    ['Some patients develop mild symptoms within a day.', '一些患者会在一天内出现轻微症状。', '出现症状', 'develop symptoms'],
    ['They are developing software for small businesses.', '他们正在为小企业开发软件。', '开发软件', 'develop software'],
    ['It takes time to develop a strong relationship.', '建立牢固的关系需要时间。', '建立关系', 'develop a relationship']
  ],
  prefer: [
    ['I prefer working from home to commuting every day.', '比起每天通勤，我更喜欢在家工作。', '更喜欢做某事而非另一件事', 'prefer doing something to doing something else'],
    ['Most guests prefer tea over coffee.', '大多数客人比起咖啡更喜欢茶。', '比起某物更喜欢另一物', 'prefer something over something else'],
    ['She prefers not to drive at night.', '她更愿意不在夜间开车。', '宁愿不做某事', 'prefer not to do something']
  ],
  expect: [
    ['We expect strong demand this summer.', '我们预计今年夏天需求旺盛。', '预计需求旺盛', 'expect strong demand'],
    ['I expect a reply by Friday.', '我预计星期五前会收到回复。', '预计收到回复', 'expect a reply']
  ],
  decide: [
    ['They decided against buying the expensive model.', '他们决定不买那个昂贵的型号。'],
    ['We need to decide on a date for the meeting.', '我们需要确定会议日期。'],
    ['She could not decide between the two options.', '她无法在两个选项之间作出决定。']
  ],
  suggest: [
    ['She suggested taking a short break.', '她建议短暂休息一下。'],
    ['The evidence suggests a different explanation.', '证据表明可能有另一种解释。', '表明另一种可能性', 'suggest another possibility'],
    ['Can you suggest a good place for lunch?', '你能推荐一个适合吃午饭的地方吗？', '推荐某物', 'suggest something']
  ]
};

function supplementalExamplesFor(word) {
  const manual = (manualSupplementalExamples[word] ?? []).map(([english, chinese, phraseChinese, phrase]) => ({ english, chinese, phraseChinese, phrase, source: 'manual' }));
  const corpus = (tatoebaExampleData.entries[word] ?? []).map((entry) => ({ ...entry, source: 'tatoeba' }));
  const seen = new Set();
  return [...manual, ...corpus].filter((entry) => {
    const key = entry.english.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function concisePhraseChinese(item, phrase, sentenceChinese, explicitChinese) {
  const clean = (value = '') => value
    .replace(/\s+/g, '')
    .replace(/[。！？!?；;]+$/g, '')
    .trim();
  const explicit = clean(explicitChinese);
  if (explicit) return explicit;
  const mapped = clean(semanticPhraseChinese[phrase.toLowerCase()] ?? semanticPhraseChinese[phrase]);
  if (mapped) return mapped;

  const senseTokens = item.zh
    .split('；')
    .map((value) => clean(value).replace(/[…·]/g, ''))
    .filter(Boolean);
  const clauses = clean(sentenceChinese)
    .split(/[，,：:]/)
    .map((value) => value.trim())
    .filter(Boolean);
  const rankedClauses = clauses
    .map((value) => ({
      value,
      score: senseTokens.reduce((score, token) => {
        if (value.includes(token)) return score + 4;
        if (token.length >= 2 && (value.includes(token.slice(0, 2)) || value.includes(token.slice(-2)))) return score + 2;
        return score;
      }, 0)
    }))
    .sort((left, right) => right.score - left.score || left.value.length - right.value.length);
  const bestClause = rankedClauses[0];
  let selected = bestClause?.value ?? clean(sentenceChinese);

  // When the translation contains the target sense after a sentence subject,
  // keep the predicate phrase instead of copying the whole sentence into the
  // context label. Preserve a preceding Chinese negation where applicable.
  if ((bestClause?.score ?? 0) > 0) {
    const matchedToken = [...senseTokens]
      .filter((token) => token.length >= 2 && selected.includes(token))
      .sort((left, right) => right.length - left.length)[0];
    if (matchedToken) {
      const tokenIndex = selected.indexOf(matchedToken);
      const startIndex = tokenIndex > 0 && /[不没未]/.test(selected[tokenIndex - 1]) ? tokenIndex - 1 : tokenIndex;
      if (startIndex > 0) selected = selected.slice(startIndex);
    }
  }

  selected = selected
    .replace(/^(?:请问|除了|如果|虽然|因为|即使|无论|当|请|麻烦|务必|千万|究竟|到底)+/, '')
    .replace(/^(?:我们|你们|他们|她们|它们|大家|有人|没有人|这个|这些|这次|这份|这项|这家|这本|这场|这种|那个|那些|那次|那份|那项|那家|那本|那场|那种|谁|我|你|他|她|它|这|那)(?:也|都|还|已经|曾经|通常|经常|一直|完全|可能|应该|必须|需要|想要|不想|没能|没有|不会|不能|无法|并不|绝不)*/, '')
    .replace(/^(?:也|都|还|已经|曾经|通常|经常|一直|完全|可能|应该|必须|需要|想要|不想|没能|没有|不会|不能|无法|并不|绝不|再)+/, '')
    .replace(/[吗呢吧]$/g, '')
    .replace(/[。！？!?；;]+$/g, '')
    .trim();
  return selected || firstMeaning(item.zh);
}

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const primaryPos = (value) => value.split('/')[0].trim().replace('.', '');
const firstMeaning = (value) => value.split('；')[0];
const verbIpaOverrides = {
  use: '/juːz/',
  live: '/lɪv/',
  lead: '/liːd/'
};
const publishedHeadwordIpaOverrides = {
  use: '/juːz/（动词）；/juːs/（名词）',
  live: '/lɪv/（动词）；/laɪv/（形容词/副词）',
  // increase is common as both a verb and a noun, with a stress shift that
  // learners must see rather than having the noun reading silently omitted.
  increase: '/ɪnˈkriːs/（动词）；/ˈɪnkriːs/（名词）'
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

function conciseChineseForPartOfSpeech(word, partOfSpeech = '', fallback = '') {
  const raw = ecdictEntries[word.toLowerCase()]?.translation?.replace(/\\n/g, '\n') ?? '';
  const wantsVerb = /(?:^|[\s/])(?:v\.|aux\.)/.test(partOfSpeech);
  const wantsNoun = /(?:^|[\s/])n\./.test(partOfSpeech);
  const wantsAdjective = /(?:^|[\s/])adj\./.test(partOfSpeech);
  const wantsAdverb = /(?:^|[\s/])adv\./.test(partOfSpeech);
  const matched = raw.split(/\r?\n/).find((line) =>
    (wantsVerb && /^\s*(?:vt|vi|v|aux)\./i.test(line))
    || (wantsNoun && /^\s*n\./i.test(line))
    || (wantsAdjective && /^\s*(?:a|adj)\./i.test(line))
    || (wantsAdverb && /^\s*adv\./i.test(line))
  );
  return stripDictionaryLabels(matched ?? '').split('；').slice(0, 3).join('；')
    || conciseChinese(word, fallback);
}

function ecdictPartOfSpeech(word, fallback = 'word') {
  const known = lexiconByWord.get(word.toLowerCase());
  if (known) return known.p.split('/')[0].trim();
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
    follow: 'fol·low', allow: 'al·low', listen: 'lis·ten',
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
  const targetForm = words[targetIndex].text;
  const previousForm = words[targetIndex - 1]?.text.toLowerCase();
  const includeAuxiliary = targetWord !== 'be' && targetIndex > 0
    && /^(?:am|is|are|was|were|be|been|being|has|have|had)$/.test(previousForm ?? '')
    && (/(?:ed|ing)$/i.test(targetForm) || (irregularForms[targetWord.toLowerCase()] ?? []).includes(targetForm.toLowerCase()));
  const start = includeSubject || includeAuxiliary ? targetIndex - 1 : targetIndex;
  const startOffset = words[start].index;
  const punctuationOffset = text.slice(startOffset).search(/[,;:!?]/);
  const clauseEnd = punctuationOffset >= 0 ? startOffset + punctuationOffset : text.length;
  const available = words
    .slice(start)
    .filter((word) => word.index < clauseEnd)
    .slice(0, 6);
  const boundary = available.findIndex((word, index) => {
    if (index < 2) return false;
    const token = word.text.toLowerCase();
    if (/^(?:because|although|though|while|when|unless|but|otherwise|than|if)$/.test(token)) return true;
    if (/^(?:during|before|after|next|last|every|tomorrow|today|tonight|yesterday|soon|now)$/.test(token)) return true;
    if (index >= 3 && /^(?:and|or)$/.test(token)) return true;
    if (index >= 3 && /^(?:i|you|he|she|it|we|they|who|which)$/.test(token)) return true;
    return false;
  });
  let chunk = available
    .slice(0, boundary >= 0 ? boundary : available.length)
    .map((word, index) => {
      if (includeAuxiliary && index === 0) return /^(?:has|have|had)$/i.test(word.text) ? 'have' : 'be';
      if (includeAuxiliary && index === 1) return word.text.toLowerCase();
      if (index === (includeSubject ? 1 : 0)) return includeSubject ? word.text : targetWord;
      return word.text;
    })
    .join(' ')
    .replace(/\s+(?:a|an|the|my|your|his|her|our|their|to|of|for|with|on|in|at|from|by|as|and|or)$/i, '')
    .trim();

  // Remove sentence-only time/place tails and repair common dangling chunks.
  // The result must be a reusable expression a learner can transfer to a new
  // sentence, not a clipped quotation from the corpus example.
  chunk = chunk
    .replace(/\s+(?:on|at|during|before|after|until|by)\s+(?:(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)|(?:this|next|last|every)\b|(?:morning|afternoon|evening|night|week|month|year)\b).*$/i, '')
    .replace(/\s+(?:next|last|every)\s+(?:morning|afternoon|evening|night|week|month|year).*$/i, '')
    .replace(/\s+(?:time|wherever|until)$/i, '')
    .trim();

  // Turn clause fragments into reusable grammar frames where the lexical
  // pattern matters more than the particular subject in the source sentence.
  if (/^(?:say|think|believe|know|understand|report|suggest|realize|hope|expect|appear)\s+that\b/i.test(chunk)) {
    return `${includeSubject ? 'it ' : ''}${targetWord} that + clause`;
  }
  if (/^(?:say|think|believe|know|understand|report|suggest|realize|hope|expect)\s+(?:i|you|he|she|it|we|they)\b/i.test(chunk)) {
    return `${targetWord} that + clause`;
  }
  if (/^(?:know|understand|explain|decide|remember|realize|discover)\s+(?:what|why|how|who|where|when)\b/i.test(chunk)) {
    return `${targetWord} wh- + clause`;
  }
  if (/^compare\b.+\bto\b.+/i.test(chunk)) return 'compare A to B';
  if (/^compare\b.+\bwith\b.+/i.test(chunk)) return 'compare A with B';
  if (/^compare\s+(?:to|with)\b/i.test(chunk)) return /^compare\s+to\b/i.test(chunk) ? 'compare A to B' : 'compare A with B';
  if (/^get\s+in\s+touch\b/i.test(chunk)) return 'get in touch with someone';
  if (/^it\s+take\b/i.test(chunk)) return 'it takes + time + to do something';
  if (/^have\s+no\s+idea\b/i.test(chunk)) return 'have no idea';
  if (/^have\s+to\s+do\s+is\b/i.test(chunk)) return 'have to do something';
  if (/^can\s+afford\s+to\b/i.test(chunk)) return 'can afford to do something';
  if (/^(?:find|discover|decide|know|understand|explain)\s+(?:what|why|how|who|where|when)\b/i.test(chunk)) return `${targetWord} wh- + clause`;
  if (/^give\s+(?:me|you|him|her|us|them)\s+(?:what|something)?$/i.test(chunk)) return 'give someone something';
  if (/^follow\s+(?:me|you|him|her|us|them)(?:\s+wherever)?$/i.test(chunk)) return 'follow someone';
  if (/\b(?:about|for|with|from|of|on|at|into|through)$/i.test(chunk)) return `${chunk} something`;
  return chunk;
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
  const modals = new Set(['can', 'could', 'may', 'might', 'must', 'should', 'will', 'would']);
  if (modals.has(item.w)) {
    return [
      [`${item.w} to work`, `${item.w} work`, `情态动词 ${item.w} 后直接接动词原形 work，不加 to。`],
      [`${item.w} works`, `${item.w} work`, `情态动词 ${item.w} 后的实义动词不随主语变化，必须使用原形 work。`]
    ];
  }
  const thirdPerson = item.w === 'be'
    ? 'is'
    : item.w === 'have'
      ? 'has'
      : item.w === 'do'
        ? 'does'
        : /(?:s|x|z|ch|sh|o)$/.test(item.w)
          ? `${item.w}es`
          : /[^aeiou]y$/.test(item.w)
            ? `${item.w.slice(0, -1)}ies`
            : `${item.w}s`;
  return [
    [`can to ${item.w}`, `can ${item.w}`, `情态动词 can 后直接接 ${item.w} 的原形，不加 to。`],
    [`to ${thirdPerson}`, `to ${item.w}`, `不定式标记 to 后使用 ${item.w} 的原形，不能使用第三人称单数形式 ${thirdPerson}。`]
  ];
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
    return finalizeMeaningRows(
      item.w,
      override.meanings.map(([partOfSpeech, english, chinese, example, translation]) => ({ partOfSpeech, english, chinese, example, translation })),
      { authoritative: Boolean(override.manualSemanticPack) }
    );
  }
  const examplePool = meaningExamplePool(item);
  const manual = manualMeaningPacks[item.w];
  if (manual) {
    return finalizeMeaningRows(item.w, manual.map(([partOfSpeech, english, chinese, exampleIndex, customExample, customTranslation]) => {
      const evidence = examplePool[exampleIndex] ?? examplePool[0];
      return {
        partOfSpeech,
        english,
        chinese,
        example: customExample ?? evidence.example,
        translation: customTranslation ?? evidence.translation
      };
    }));
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
  return finalizeMeaningRows(item.w, rows.filter((entry) => {
    const key = `${entry.english}|${entry.chinese}`.toLowerCase().replace(/[^a-z\u4e00-\u9fff]+/g, ' ').trim();
    if (!entry.english || !entry.chinese || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 4));
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

// Corpus sentences are valuable example evidence, but a clipped sentence is
// not automatically a reusable collocation. These reviewed corrections turn
// sentence-specific fragments into transferable phrase patterns and give each
// one an exact Chinese gloss. The full bilingual corpus sentence is retained
// separately as the fixed-phrase example.
const supplementalPhraseCorrections = new Map(Object.entries({
  'get|get there': ['get there', '到达那里'],
  'get|get yourself something to eat': ['get yourself something to eat', '给自己弄点吃的'],
  'get|get over the difficulties': ['get over difficulties', '克服困难'],
  'get|get home': ['get home', '到家'],
  'can|can you please open the window': ['can you please do something', '能否请你做某事'],
  'know|know someone well': ['know someone well', '很了解某人'],
  "know|be known for someone's old buildings": ['be known for something', '以某物闻名'],
  'know|know someone by name': ['know someone by name', '知道某人的名字'],
  'know|know wh- + clause': ['know wh- + clause', '知道具体信息'],
  'will|will do you good': ['will do someone good', '将对某人有好处'],
  'will|will melt on the stove': ['will melt', '将会融化'],
  'will|will attend the meeting': ['will attend a meeting', '将会参加会议'],
  'will|will miss the train': ['will miss something', '将会错过某物'],
  "would|would not betray someone's friends": ['would not betray someone', '不会背叛某人'],
  'would|would not think like that': ['would not think that way', '不会那样想'],
  'would|would make someone happy': ['would make someone happy', '会让某人高兴'],
  "would|would keep someone's promise": ['would keep a promise', '会信守承诺'],
  "think|think highly of someone's former teacher": ['think highly of someone', '对某人评价很高'],
  'think|think ahead and prepare early': ['think ahead', '提前考虑'],
  'think|think like that': ['think that way', '那样想'],
  'see|see a brown wallet around here': ['see something nearby', '在附近看见某物'],
  'see|see someone': ['see someone', '见某人'],
  "come|come over to someone's house": ['come over to someone\'s house', '到某人家里来'],
  "come|come to someone's house": ['come to someone\'s house', '来到某人家'],
  'want|want someone to call the police': ['want someone to call the police', '想让某人报警'],
  'want|want to eat noodles': ['want to eat something', '想吃某物'],
  'want|want to order': ['want to order something', '想点某物'],
  'want|want to go': ['want to go somewhere', '想去某地'],
  'could|could you call someone back': ['could you call someone back', '能否给某人回电话'],
  'could|could you cook this meat': ['could you cook something longer', '能否把某物再煮久一点'],
  'could|could you keep this luggage': ['could you keep something', '能否保管某物'],
  'could|could you please not smoke': ['could you please not do something', '能否请你不要做某事'],
  "look|look like you've just seen": ['look as if you have seen a ghost', '看起来像见了鬼'],
  'tell|tell someone a little about yourself': ['tell someone about yourself', '向某人介绍自己'],
  'tell|tell someone how to get there': ['tell someone how to get somewhere', '告诉某人如何到某地'],
  'tell|tell someone the truth': ['tell someone the truth', '告诉某人真相'],
  'tell|tell someone': ['tell someone something', '告诉某人某事'],
  'give|give someone two knives': ['give someone some utensils', '给某人一些餐具'],
  'give|give to you': ['give something to someone', '把某物给某人'],
  'need|need more time to finish': ['need more time', '需要更多时间'],
  'need|need some medicine to kill': ['need some medicine', '需要一些药'],
  'need|need to ask': ['need to ask a question', '需要提一个问题'],
  'need|need to find somewhere to practice': ['need somewhere to practice', '需要一个练习场所'],
  'ask|ask someone': ['ask someone something', '询问某人某事'],
  'ask|ask you a silly question': ['ask someone a question', '问某人一个问题'],
  'ask|ask someone about something': ['ask someone about something', '向某人询问某事'],
  'talk|talk to you about something': ['talk to someone about something', '与某人谈论某事'],
  'keep|keep this luggage until p m': ['keep something until a set time', '把某物保管到指定时间'],
  'keep|keep a dictionary close at hand': ['keep something close at hand', '把某物放在手边'],
  "keep|keep someone's promise": ['keep a promise', '信守承诺'],
  'put|put a hand gently on something': ['put a hand on something', '把手放在某物上'],
  'put|put the chair in front': ['put something in front of something', '把某物放在另一物前面'],
  "put|put on someone's hat to go": ['put on a hat', '戴上帽子'],
  'put|put off for a week': ['put something off for a week', '把某事推迟一周'],
  'like|like cracking sunflower seeds with something': ['like doing something', '喜欢做某事'],
  'like|like dogs and someone sister likes': ['like one thing but not another', '喜欢一物而不喜欢另一物'],
  'like|like spring the best of something': ['like something best', '最喜欢某物'],
  "help|help yourself to anything you'd like": ['help yourself to something', '随意取用某物'],
  'help|help someone': ['help someone with something', '帮助某人做某事'],
  'help|help you lose weight': ['help someone do something', '帮助某人做某事'],
  'start|start until they arrive': ['not start until someone arrives', '等某人到达后再开始'],
  'start|start is the main problem': ['decide when to start', '决定何时开始'],
  'show|show someone': ['show someone something', '给某人看某物'],
  "show|show you something in someone's office": ['show someone something', '给某人看某物'],
  'bring|bring someone a glass of tea': ['bring someone a drink', '给某人拿一杯饮料'],
  'bring|bring you success': ['bring someone success', '给某人带来成功'],
  'bring|bring someone down': ['bring someone down', '击垮某人'],
  'love|love someone more': ['love someone deeply', '深爱某人'],
  'love|love you': ['love someone', '爱某人'],
  'lose|lose you again': ['lose someone', '失去某人'],
  'meet|meet with someone': ['meet with someone', '与某人会面'],
  'thank|thank you for agreeing to meet': ['thank someone for meeting', '感谢某人赴约'],
  'thank|thank you for always taking care': ['thank someone for taking care of something', '感谢某人一直照料某事'],
  'thank|thank you for drawing a bird': ['thank someone for doing something', '感谢某人做某事'],
  'stand|stand by you whatever happens': ['stand by someone whatever happens', '无论如何都支持某人'],
  'stand|stand by someone in case': ['stand by someone in trouble', '在某人遇到困难时支持他'],
  'speak|speak to you about something': ['speak to someone about something', '与某人谈论某事'],
  'speak|speak with you in private': ['speak with someone in private', '与某人私下交谈'],
  "allow|allow you to use someone's pen": ['allow someone to use something', '允许某人使用某物'],
  'allow|allow you to do that': ['allow someone to do something', '允许某人做某事'],
  'consider|consider you one of someone\'s closest': ['consider someone a close friend', '把某人视为亲密朋友'],
  'build|build a simple tool to track': ['build a tool to track something', '制作工具来跟踪某事'],
  'serve|serve it': ['serve a drink', '端上一杯饮料'],
  'listen|listen to others': ['listen to other people', '听取他人的意见'],
  'base|be based on mutual trust': ['be based on mutual trust', '建立在相互信任的基础上'],
  'hit|hit someone\'s head against a rock': ['hit your head against something', '头撞到某物上'],
  'discover|discover that she had run out': ['discover that something has run out', '发现某物已经用完'],
  'express|express someone deep sorrow': ['express deep sorrow', '表达深切悲伤'],
  'solve|solve the problem by checking each': ['solve a problem step by step', '逐步解决问题'],
  'open|open source': ['be open source', '采用开源方式'],
  'spend|spend your winter vacation': ['spend a vacation somewhere', '在某地度假'],
  'mean|mean to do that': ['mean to do something', '有意做某事'],
  "feel|feel any pain in someone's stomach": ['feel pain somewhere', '感到某处疼痛'],
  'run|run out': ['run out', '用完；耗尽'],
  'come|come to an end': ['come to an end', '结束'],
  'must|must come to an end': ['must come to an end', '必须结束'],
  'feel|feel any pain in your stomach': ['feel pain somewhere', '感到某处疼痛'],
  'put|put on someone hat to go': ['put on a hat', '戴上帽子'],
  'try|try to have a positive attitude': ['try to stay positive', '努力保持积极态度'],
  'stop|stop getting yourself worked up over': ['stop getting worked up over something', '不再为某事烦躁'],
  "look|look after someone's dog": ["look after someone's pet", '照顾某人的宠物'],
  'tell|tell someone how to use': ['tell someone how to use something', '告诉某人如何使用某物'],
  'call|call someone back a bit later': ['call someone back later', '稍后给某人回电话'],
  'call|call someone': ['call someone', '给某人打电话'],
  "talk|talk about someone's past": ["talk about someone's past", '谈论某人的过去'],
  'help|help someone find a job': ['help someone find a job', '帮助某人找工作'],
  'help|help someone wash these dishes': ['help someone wash the dishes', '帮助某人洗餐具'],
  "help|help someone find someone's dog": ['help someone find a pet', '帮助某人寻找宠物'],
  'show|show someone on the map': ['show someone something on a map', '在地图上给某人指出某地'],
  'show|show you something in someone\'s office': ['show someone something', '给某人看某物'],
  "hear|hear someone's son play the violin": ['hear someone play an instrument', '听见某人演奏乐器'],
  'hear|hear someone': ['hear someone', '听见某人'],
  'hear|hear someone sobbing in someone bedroom': ['hear someone sobbing', '听见某人在抽泣'],
  "move|move someone's furniture": ["move someone's furniture", '搬运某人的家具'],
  'love|love someone': ['love someone', '爱某人'],
  'hold|hold this seat for someone': ['hold a seat for someone', '为某人留座'],
  "pay|pay more attention to someone's warnings": ["pay attention to someone's warning", '留意某人的警告'],
  'meet|meet someone requirements': ["meet someone's requirements", '满足某人的要求'],
  'thank|thank you for inviting someone': ['thank someone for an invitation', '感谢某人的邀请'],
  "change|change someone's plans": ["change someone's plans", '改变某人的计划'],
  'kill|kill someone': ['kill someone', '杀死某人'],
  'follow|follow someone': ['follow someone', '跟随某人'],
  'follow|follow someone advice': ["follow someone's advice", '听从某人的建议'],
  "follow|follow someone's advice": ["follow someone's advice", '听从某人的建议'],
  'remember|remember someone\'s mother teaching someone': ['remember someone teaching you something', '记得某人教过自己的事'],
  'allow|allow someone to go abroad': ['allow someone to go abroad', '允许某人出国'],
  "continue|continue to do someone's jobs": ["continue doing someone's work", '继续完成某人的工作'],
  "add|add someone's name to the list": ["add someone's name to a list", '把某人的名字加入名单'],
  'send|send someone another ticket': ['send someone another ticket', '再寄给某人一张票'],
  'send|send it to someone by fax': ['send something to someone by fax', '把某物传真给某人'],
  'send|send someone a letter': ['send someone a letter', '给某人寄信'],
  "grow|grow strawberries in someone's greenhouse": ['grow something in a greenhouse', '在温室里种植某物'],
  "offer|offer someone's congratulations": ['offer congratulations to someone', '向某人表示祝贺'],
  'expect|expect someone back by six o\'clock': ['expect someone back by a set time', '预计某人在指定时间前回来'],
  'expect|expect a lot from someone': ['expect a lot from someone', '对某人抱有很高期望'],
  'serve|serve someone someone\'s meal first': ['serve someone a meal', '给某人上餐'],
  "listen|listen to someone's advice": ["listen to someone's advice", '听取某人的建议'],
  "agree|agree to someone's proposal": ["agree to someone's proposal", '同意某人的提议'],
  'agree|agree with someone on that point': ['agree with someone on a point', '在某一点上同意某人'],
  'pass|pass someone the maple syrup': ['pass someone something', '把某物递给某人'],
  'pass|pass someone the mashed potatoes': ['pass someone some food', '把食物递给某人'],
  'pass|pass someone the pepper': ['pass someone the pepper', '把胡椒递给某人'],
  "pass|pass someone's driving test": ['pass a driving test', '通过驾驶考试'],
  'sell|sell your car to someone': ['sell something to someone', '把某物卖给某人'],
  "sell|sell someone's house": ['sell a house', '出售房屋'],
  'pick|pick someone up': ['pick someone up', '接某人'],
  "drive|drive someone's car": ["drive someone's car", '驾驶某人的汽车'],
  'explain|explain to someone the difficult situation': ['explain a difficult situation to someone', '向某人解释困难处境'],
  "hit|hit the ball with someone's racket": ['hit a ball with a racket', '用球拍击球'],
  'pull|pull someone out of the mud': ['pull someone out of something', '把某人从某处拉出来'],
  "raise|raise someone's salary": ["raise someone's salary", '给某人加薪'],
  'return|return the book to someone': ['return something to someone', '把某物还给某人'],
  "join|join someone's party": ['join a party', '参加聚会'],
  'join|join someone for dinner': ['join someone for a meal', '与某人一起用餐'],
  "share|share a bedroom with someone's sister": ['share a room with someone', '与某人合住一间房'],
  'describe|describe someone as a detective': ['describe someone as something', '把某人描述为某种身份'],
  'protect|protect someone': ['protect someone', '保护某人'],
  "protect|protect someone's son": ["protect someone's child", '保护某人的孩子'],
  "accept|accept someone's offer": ["accept someone's offer", '接受某人的提议'],
  "accept|accept someone's apologies": ["accept someone's apology", '接受某人的道歉'],
  "accept|accept someone's invitation": ["accept someone's invitation", '接受某人的邀请'],
  'achieve|achieve great success in someone business': ['achieve success in business', '在事业上取得成功'],
  "express|express someone's thanks": ['express thanks', '表达谢意'],
  'express|express someone feeling': ["express someone's feelings", '表达某人的感受'],
  'encourage|encourage someone to apply for something': ['encourage someone to apply for something', '鼓励某人申请某项机会']
}));

function supplementalPhraseRows(item) {
  const seen = new Set();
  return supplementalExamplesFor(item.w).map((entry) => {
    const extractedPhrase = entry.phrase ?? extractTargetChunk(entry.english, item.w)
      .replace(/\b(?:me|him|her|us|them)\b/gi, 'someone')
      .replace(/\b(?:my|his|her|our|their)\b/gi, "someone's");
    const correction = supplementalPhraseCorrections.get(`${item.w}|${extractedPhrase.toLowerCase()}`);
    const phrase = correction?.[0] ?? extractedPhrase;
    return {
      ...entry,
      phrase,
      phraseChinese: correction?.[1] ?? concisePhraseChinese(item, phrase, entry.chinese, entry.phraseChinese)
    };
  }).filter((entry) => {
    const normalized = entry.phrase.toLowerCase().replace(/[^a-z']+/g, ' ').trim();
    const wordCount = wordsWithOffsets(entry.phrase).length;
    const sentenceWords = wordsWithOffsets(entry.english);
    const targetForms = inflectedForms(item.w.toLowerCase());
    const targetIndex = sentenceWords.findIndex((word) => targetForms.has(word.text.toLowerCase()));
    const dependsOnRelativeSubject = targetIndex > 0 && /^who$/i.test(sentenceWords[targetIndex - 1].text);
    if (wordCount < 2 || wordCount > 6 || /\b(?:a|an|the|my|your|his|her|our|their|to|of|for|with|on|in|at|from|by|as|about|until|wherever|what|who|why|how|when)$/.test(normalized)
      || dependsOnRelativeSubject
      || /^(?:can|could|do|will|would) do is\b/i.test(normalized)
      || /^(?:do|say|think)\s+is\b/i.test(normalized)
      || /^say\s+thin\b/i.test(normalized)
      || /\b(?:is|are|was|were|do|does|did|have|has|had|right|during|before|after|looking|new|same)$/i.test(normalized)
      || /\b(?:otherwise|you will|he will|she will|they will|we will)\b/i.test(normalized)
      || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

const reusablePhraseCompletions = new Map([
  ['write about', 'write about something'],
  ['read about', 'read about something'],
  ['provide information about', 'provide information about something'],
  ['understand why', 'understand why something happens'],
  ['understand how', 'understand how something works'],
  ['learn about', 'learn about something'],
  ['include information about', 'include information about something'],
  ['speak about', 'speak about something'],
  ['continue until', 'continue until something happens'],
  ['explain why', 'explain why something happens'],
  ['explain how', 'explain how to do something'],
  ['notice someone looking', 'notice someone doing something'],
  ['express concern about', 'express concern about something'],
  ['should not be confused with', 'should not be confused with something'],
  ['mean a lot to', 'mean a lot to someone'],
  ['become aware of', 'become aware of something'],
  ['become involved in', 'become involved in something'],
  ['what became of', 'what became of something'],
  ['does not seem to', 'does not seem to do something'],
  ['seem to be a little under', 'seem to be under the weather'],
  ['provide access to', 'provide access to something'],
  ['include a copy of', 'include a copy of something'],
  ['including but not limited to', 'including but not limited to something'],
  ['follow up on', 'follow up on something'],
  ['allow time for', 'allow time for something'],
  ['allow access to', 'allow access to something'],
  ['be allowed to', 'be allowed to do something'],
  ['spend money on', 'spend money on something'],
  ['spend the day with', 'spend the day with someone'],
  ['be expected to', 'be expected to do something'],
  ['be required to', 'be required to do something'],
  ['listen to', 'listen to someone or something'],
  ['listen for', 'listen for something'],
  ['decide against', 'decide against doing something'],
  ['reach out to', 'reach out to someone'],
  ['have no choice but to', 'have no choice but to do something'],
  ['choice of', 'choice of something'],
  ['develop an interest in', 'develop an interest in something'],
  ['describe something as', 'describe something as something'],
  ['increase the risk of', 'increase the risk of something'],
  ['an increase in', 'an increase in something'],
  ['protect someone from', 'protect someone from something'],
  ['be protected by', 'be protected by someone or something'],
  ['compared with', 'compared with something'],
  ['cannot compare with', 'cannot compare with something'],
  ['accept someone as', 'accept someone as something'],
  ['prepare someone for', 'prepare someone for something'],
  ['be prepared to', 'be prepared to do something'],
  ['be affected by', 'be affected by something'],
  ['get a handle on', 'get a handle on something'],
  ['depend on', 'depend on someone or something'],
  ['depend heavily on', 'depend heavily on something'],
  ['depending on', 'depending on something'],
  ['accept the fact that', 'accept the fact that + clause'],
  ['believe that', 'believe that + clause'],
  ['discover that', 'discover that + clause'],
  ['mean that', 'mean that + clause'],
  ['realize that', 'realize that + clause'],
  ['suggest that', 'suggest that + clause'],
  ['the fact remains that', 'the fact remains that + clause'],
  ['it seems that', 'it seems that + clause']
]);

// A corpus sentence may yield a useful English chunk while its source Chinese
// still describes the whole sentence. Keep this reviewed table in the builder
// so every regeneration emits a transferable phrase plus a phrase-only gloss.
const reviewedContextCorrections = new Map(Object.entries({
  'achieve|achieve anything': ['achieve something', '取得成就'],
  "achieve|achieve someone's goals in three years": ['achieve a goal within a set time', '在期限内达成目标'],
  'agree|agree with some of your opinions': ['agree with some points', '同意部分观点'],
  'agree|agree with you at all': ['not agree with someone at all', '完全不同意某人'],
  "ask|ask for your teacher's permission": ["ask for someone's permission", '征得某人许可'],
  'avoid|avoid a traffic jam': ['avoid a traffic jam', '避开交通拥堵'],
  'avoid|avoid discussing personal subjects with something': ['avoid discussing personal topics with someone', '避免与某人讨论私人话题'],
  'avoid|avoid making any more trouble': ['avoid causing more trouble', '避免再惹麻烦'],
  "base|base someone's estimate": ['base an estimate on something', '以某事为估算依据'],
  'base|base your decision on reliable evidence': ['base a decision on reliable evidence', '依据可靠证据作决定'],
  'base|be based on a true story': ['be based on a true story', '根据真实故事改编'],
  'become|become a teacher': ['become a teacher', '成为教师'],
  'break|break up with something': ['break up with someone', '与某人分手'],
  'call|call the police': ['call the police', '报警'],
  'cause|cause you all this trouble': ['cause someone trouble', '给某人添麻烦'],
  'cause|cause you any trouble': ['cause someone trouble', '给某人添麻烦'],
  'choose|choose any book': ['choose any book', '任选一本书'],
  'choose|choose any one from among these': ['choose one from several options', '从多个选项中挑一个'],
  'choose|choose the color': ['choose a color', '选择颜色'],
  'come|come tonight': ['come tonight', '今晚来'],
  'continue|continue the meeting': ['continue a meeting', '继续开会'],
  'consider|be considered very qualified for something': ['be considered qualified for something', '被认为胜任某事'],
  'consider|consider fruit to be the healthiest': ['consider something healthy', '认为某物健康'],
  'depend|depend on you': ['depend on someone', '依靠某人'],
  'depend|depend on your own efforts': ["depend on one's own efforts", '取决于自身努力'],
  'depend|you can depend on me': ['depend on someone', '依靠某人'],
  'describe|describe the process in simple terms': ['describe a process in simple terms', '用简单语言描述过程'],
  'develop|develop an android application': ['develop an application', '开发应用程序'],
  'develop|develop political awareness': ['develop political awareness', '培养政治意识'],
  'discover|have discovered some startling facts': ['discover surprising facts', '发现惊人事实'],
  'end|end in a fight': ['end in a fight', '以打斗收场'],
  'end|end well': ['end well', '有圆满结局'],
  'explain|explain the exact meaning of this': ['explain the exact meaning of something', '解释某事的确切含义'],
  'explain|explain wh- + clause': ['explain wh- + clause', '解释具体情况'],
  'fall|fall far from the tree': ['not fall far from the tree', '与父母很相像'],
  'find|find wh- + clause': ['find wh- + clause', '查明具体信息'],
  'give|give up smoking': ['give up smoking', '戒烟'],
  'give|give up the idea': ['give up an idea', '放弃一个想法'],
  'give|give up the plan': ['give up a plan', '放弃计划'],
  'grow|grow in this soil': ['grow in a type of soil', '在某种土壤中生长'],
  'grow|grow on trees': ['grow on trees', '长在树上'],
  'handle|handle children': ['handle children', '应对孩子'],
  'handle|handle this': ['handle something', '处理某事'],
  'hold|hold your tongue': ["hold one's tongue", '保持沉默'],
  'hope|hope everything will be fine': ['hope everything will be fine', '希望一切顺利'],
  'hope|hope for better weather': ['hope for better weather', '希望天气好转'],
  'hope|hope to hear': ['hope to hear from someone', '希望收到某人消息'],
  'hope|hope to see': ['hope to see someone again', '希望再次见到某人'],
  "increase|increase someone's lifespan": ["increase someone's lifespan", '延长某人寿命'],
  'kill|kill many people': ['kill many people', '造成多人死亡'],
  'lead|lead a hard life': ['lead a hard life', '过艰苦生活'],
  'learn|learn a language': ['learn a language', '学习一门语言'],
  'learn|learn about something': ['learn about something', '了解某事'],
  'learn|learn to hold your tongue': ["learn to hold one's tongue", '学会保持沉默'],
  'leave|leave the room': ['leave a room', '离开房间'],
  'leave|leave the room immediately': ['leave a room immediately', '立即离开房间'],
  'like|like someone to do something': ['would like someone to do something', '希望某人做某事'],
  'live|live beyond your income': ["live beyond one's means", '入不敷出'],
  'look|look more mature': ['look more mature', '显得更成熟'],
  'lose|lose weight': ['lose weight', '减重'],
  'love|love to sing with your band': ['love to sing with a band', '喜欢和乐队一起唱歌'],
  'love|love you more': ['love someone deeply', '深爱某人'],
  'may|may be that': ['may be that + clause', '可能……'],
  'may|may I do something': ['may I do something', '我可以做某事吗'],
  'meet|meet nice people like': ['meet nice people', '结识友善的人'],
  'meet|meet tomorrow morning at nine': ['meet at a set time', '在约定时间见面'],
  'might|might as well begin': ['might as well begin', '不妨开始'],
  'might|might think': ['might think something', '可能认为某事'],
  'move|move to a safer location': ['move to a safer place', '转移到更安全的地方'],
  'move|move your stuff to the other': ['move your things to another room', '把物品搬到另一个房间'],
  'need|need any help': ['need help', '需要帮助'],
  'notice|notice someone doing something': ['notice someone doing something', '注意到某人正在做某事'],
  'open|open an account here': ['open an account', '开设账户'],
  'pick|pick out any book': ['pick out a book', '挑选一本书'],
  'play|play chess': ['play chess', '下国际象棋'],
  'play|play guitar in a psychedelic rock': ['play guitar in a rock band', '在摇滚乐队弹吉他'],
  'play|play the piano': ['play the piano', '弹钢琴'],
  'play|play with friends': ['play with friends', '和朋友玩'],
  'pull|pull a cart': ['pull a cart', '拉车'],
  'pull|pull strings': ['pull strings', '托关系；暗中运作'],
  'pull|pull the weeds': ['pull weeds', '拔草'],
  'reach|reach a compromise': ['reach a compromise', '达成妥协'],
  'reach|reach that goal': ['reach a goal', '达成目标'],
  'reach|reach the park by either road': ['reach a place by either route', '经任一路线到达某地'],
  'read|read a lot': ['read a lot', '大量阅读'],
  'read|read the book from cover': ['read a book from cover to cover', '从头到尾读完一本书'],
  'reduce|reduce the price': ['reduce a price', '降低价格'],
  'reduce|reduce the price a bit': ['reduce a price slightly', '稍微降低价格'],
  'remember|remember the way': ['remember how someone did something', '记得某人做事的方式'],
  'remember|remember wh- + clause': ['remember wh- + clause', '记得具体情况'],
  'report|report the problem to your manager': ['report a problem to someone', '向某人报告问题'],
  'return|return this book to the library': ['return a book to the library', '把书还给图书馆'],
  'sell|sell your newly built house': ['sell a newly built house', '出售新建房屋'],
  'send|send for the doctor': ['send for a doctor', '派人去请医生'],
  'share|share certain characteristics with human beings': ['share characteristics with someone', '与某人具有共同特征'],
  'should|should concentrate on other things': ['should concentrate on something else', '应该专注于其他事情'],
  'should|should talk about this': ['should talk about something', '应该谈论某事'],
  'show|show it': ['show something', '展示某物'],
  'show|show it to your parents': ['show something to someone', '把某物给某人看'],
  'show|show you': ['show someone something', '给某人看某物'],
  'solve|solve the problem': ['solve a problem', '解决问题'],
  'solve|solve the problem by myself': ['solve a problem independently', '独立解决问题'],
  'spend|spend more time together': ['spend more time together', '花更多时间相处'],
  'spend|spend the night': ['spend the night somewhere', '在某地过夜'],
  'stay|stay a little longer': ['stay a little longer', '再多待一会'],
  'stay|stay in bed all day': ['stay in bed all day', '整天卧床'],
  'suggest|suggest anything': ['suggest something', '提出建议'],
  'suggest|suggest doing': ['suggest doing something', '建议做某事'],
  'suggest|suggest that + clause': ['suggest that + clause', '建议……；表明……'],
  'take|take shelter under a tree': ['take shelter under a tree', '在树下避雨'],
  'talk|talk about this': ['talk about something', '谈论某事'],
  'thank|thank you from the bottom': ['thank someone from the bottom of your heart', '衷心感谢某人'],
  'think|think about the problem': ['think about a problem', '思考问题'],
  'think|think highly of someone former teacher': ['think highly of someone', '对某人评价很高'],
  'try|try to make the most': ['try to make the most of something', '尽量充分利用某物'],
  'turn|turn down': ['turn down an offer', '拒绝提议'],
  'turn|turn off the lights': ['turn off the lights', '关灯'],
  'use|use some salt': ['use some salt', '加一些盐'],
  'use|use the washing machine': ['use a washing machine', '使用洗衣机'],
  'wait|wait any longer': ['wait any longer', '再等下去'],
  'wait|wait for a few minutes': ['wait for a few minutes', '等几分钟'],
  'wait|wait here': ['wait here', '在这里等候'],
  'watch|watch baseball games on TV': ['watch baseball games on TV', '在电视上看棒球比赛'],
  'watch|watch movies': ['watch movies', '看电影'],
  'watch|watch out for cars': ['watch out for cars', '当心车辆'],
  'wear|wear a helmet': ['wear a helmet', '戴头盔'],
  'wear|wear short sleeved shirts': ['wear short-sleeved shirts', '穿短袖衬衫'],
  'wear|wear this': ['wear something', '穿戴某物'],
  'win|win broad support from local residents': ['win broad local support', '赢得当地广泛支持'],
  'write|write a poem': ['write a poem', '写诗'],
  "hold|hold a meeting at o'clock this": ['hold a meeting at a set time', '在约定时间开会'],
  'pay|pay for that': ['pay for something', '为某物付款'],
  'receive|receive quite a few letters this': ['receive many letters', '收到许多信件'],
  'solve|solve this': ['solve something', '解决某事'],
  'speak|speak to someone like that': ['speak to someone that way', '以那种方式和某人说话'],
  'wait|wait until the end of this': ['wait until the end of something', '等到某事结束'],
  'win|win this': ['win something', '赢得某事物']
}).map(([key, value]) => [key.toLowerCase(), value]));

function reviewedContextEntry(item, phrase, chinese) {
  const reusablePhrase = normalizeReusablePhrase(phrase);
  const correction = reviewedContextCorrections.get(`${item.w}|${reusablePhrase.toLowerCase()}`)
    ?? reviewedContextCorrections.get(`${item.w}|${phrase.trim().toLowerCase()}`);
  return {
    phrase: correction?.[0] ?? reusablePhrase,
    chinese: normalizePhraseGloss(correction?.[1] ?? chinese)
  };
}

function normalizeReusablePhrase(phrase) {
  const value = phrase.trim();
  return reusablePhraseCompletions.get(value.toLowerCase()) ?? value;
}

function normalizePhraseGloss(chinese) {
  return chinese.trim().replace(/[。！？!?；;]+$/g, '');
}

function compactContextGloss(item, chinese, prefix = '') {
  const cleaned = normalizePhraseGloss(String(chinese ?? ''))
    .replace(/^(?:我|我们|你|你们|他|她|他们|她们|这个|这项|该)\s*/u, '')
    .replace(/[，,。！？!?].*$/u, '')
    .trim();
  const shortestUseful = cleaned.split(/[；;]/).map((part) => part.trim()).find((part) => part && [...part].length <= 12)
    ?? firstMeaning(item.zh);
  const result = `${prefix}${shortestUseful}`.replace(/；+/g, '；').replace(/[。！？!?；;]+$/g, '');
  return [...result].length <= 14 ? result : firstMeaning(item.zh).slice(0, 14);
}

function contextCategoryFor(phrase, sourceCategory = '') {
  if (sourceCategory && !/^(?:核心动作与结构|核心名词搭配|核心用法|日常与工作语境|高频扩展表达|补充常用语境)$/.test(sourceCategory)) {
    return sourceCategory;
  }
  if (/\b(?:never|not|no longer|hardly|without|unable|cannot|can't|couldn't|won't|wouldn't|mustn't|shouldn't)\b/i.test(phrase)) return '否定与限制';
  if (/\b(?:always|often|usually|sometimes|still|already|yet|again|daily|every|soon|later|time|day|week|year)\b/i.test(phrase)) return '时间与频率';
  if (/\b(?:can|could|may|might|must|should|will|would|need to|have to)\b/i.test(phrase)) return '情态与必要性';
  if (/\b(?:that \+ clause|wh- \+ clause|whether|if)\b/i.test(phrase)) return '从句与判断';
  if (/\b(?:someone|people|person|team|family|friend|customer|student)\b/i.test(phrase)) return '人际互动';
  if (/\b(?:to do|doing something|do something)\b/i.test(phrase)) return '动词补语结构';
  if (/\b(?:about|against|as|at|by|for|from|in|into|of|on|over|through|to|with|without)\b/i.test(phrase)) return '介词与延伸';
  return classifyContextPhrase({ phrase }, 'v.');
}

function sentenceContextChunk(item, sentence) {
  const words = wordsWithOffsets(String(sentence ?? ''));
  const forms = inflectedForms(item.w.toLowerCase());
  const targetIndex = words.findIndex((entry) => forms.has(entry.text.toLowerCase()));
  if (targetIndex < 0) return '';
  let start = targetIndex;
  const previous = words[targetIndex - 1]?.text.toLowerCase();
  const twoBack = words[targetIndex - 2]?.text.toLowerCase();
  if (/^(?:always|often|usually|sometimes|never|still|already|also|can|could|may|might|must|should|will|would|to)$/i.test(previous ?? '')) start -= 1;
  if (previous === 'to' && /^(?:need|want|try|plan|learn|decide|continue|begin|start|help)$/i.test(twoBack ?? '')) start -= 2;
  const selected = words.slice(start, Math.min(words.length, start + 8));
  while (selected.length > 2 && /^(?:a|an|the|my|your|his|her|our|their|to|of|for|with|on|in|at|from|by|as|and|or)$/i.test(selected.at(-1).text)) selected.pop();
  return selected.map((entry) => entry.text).join(' ').replace(/[.,;:!?]+$/g, '').trim();
}

function contextualVariant(item, phrase, modifier) {
  const forms = inflectedForms(item.w.toLowerCase());
  const words = phrase.split(/\s+/);
  let targetIndex = words.findIndex((word) => forms.has(word.toLowerCase().replace(/[^a-z']/g, '')));
  if (targetIndex < 0) return '';
  const modals = new Set(['can', 'could', 'may', 'might', 'must', 'should', 'will', 'would']);
  if (modals.has(item.w)) {
    words.splice(targetIndex + 1, 0, modifier);
    return words.join(' ');
  }
  const startsWithTarget = targetIndex === 0;
  const startsWithToTarget = targetIndex === 1 && words[0].toLowerCase() === 'to';
  if (!startsWithTarget && !startsWithToTarget) return '';
  if (startsWithToTarget) {
    words.shift();
    targetIndex -= 1;
  }
  words[targetIndex] = item.w;
  if (modifier === 'not') return ['do', 'not', ...words].join(' ');
  if (modifier === 'can') return ['can', ...words].join(' ');
  if (modifier === 'need to') return ['need', 'to', ...words].join(' ');
  return [modifier, ...words].join(' ');
}

function normalizeContexts(item, override, tuples, fixedPhrases) {
  if (override?.contexts) {
    if (item.w === 'work') {
      return override.contexts.filter(([, items]) => items.length).map(([category, items]) => ({
        category,
        items: items.map(([phrase, chinese]) => ({
          phrase,
          phonetic: ipaFor(phrase, item.w, item.ipa),
          chinese
        }))
      }));
    }
    const fixedKeys = new Set(fixedPhrases.map((entry) => entry.phrase.toLowerCase().replace(/[^a-z']+/g, ' ').trim()));
    const seen = new Set();
    const groups = override.contexts.map(([category, items]) => {
      if (!category || /^(?:核心动作与结构|日常与工作语境|高频扩展表达|补充常用语境|其他|综合)$/.test(category)) {
        throw new Error(`${item.w}: curated context category must name a concrete usage setting: ${category}`);
      }
      return {
        category,
        items: items.map(([rawPhrase, rawChinese]) => {
          const { phrase, chinese } = override.manualSemanticPack
            ? { phrase: rawPhrase.trim(), chinese: normalizePhraseGloss(rawChinese) }
            : reviewedContextEntry(item, rawPhrase, rawChinese);
          const key = phrase.toLowerCase().replace(/[^a-z']+/g, ' ').trim();
          if (!key || seen.has(key) || fixedKeys.has(key)) {
            throw new Error(`${item.w}: curated context phrase is duplicate or repeats fixedPhrases: ${phrase}`);
          }
          if (!phraseContainsTarget(phrase, item.w) || reusablePhraseIssue(phrase)) {
            throw new Error(`${item.w}: curated context phrase is incomplete or misses the target: ${phrase}`);
          }
          if (!isConcisePhraseGloss(chinese, 14)) {
            throw new Error(`${item.w}: curated context gloss is not a concise phrase meaning: ${chinese}`);
          }
          if (mechanicalContextIssue(phrase, item.w)) {
            throw new Error(`${item.w}: curated contexts must not use mechanical modal, frequency, or negative padding: ${phrase}`);
          }
          seen.add(key);
          return { phrase, phonetic: ipaFor(phrase, item.w, item.ipa), chinese };
        })
      };
    });
    const itemCount = groups.reduce((sum, group) => sum + group.items.length, 0);
    if (groups.length < 4 || itemCount < 16) {
      throw new Error(`${item.w}: curated contexts need at least 4 concrete categories and 16 independent phrases.`);
    }
    return groups;
  }
  const fixedKeys = new Set(fixedPhrases.map((entry) => entry.phrase.toLowerCase().replace(/[^a-z']+/g, ' ').trim()));
  const candidates = [];
  if (override?.contexts) {
    for (const [category, items] of override.contexts) {
      for (const [phrase, chinese] of items) candidates.push({ phrase, chinese, sourceCategory: category });
    }
  }
  for (const entry of fixedPhrases) {
    candidates.push({ phrase: sentenceContextChunk(item, entry.example), chinese: entry.chinese });
  }
  const exampleRows = priorityEntries[item.w]?.uses
    ?? (curatedExamples[item.w] ?? [[item.ex, item.exZh]]).map(([example, translation], index) => [tuples[index]?.[0] ?? item.coll, tuples[index]?.[1] ?? item.collZh, example, translation]);
  for (const [phrase, chinese, example] of exampleRows) {
    candidates.push({ phrase: sentenceContextChunk(item, example), chinese });
    candidates.push({ phrase, chinese });
  }
  const seen = new Set();
  const accepted = [];
  const add = ({ phrase, chinese, sourceCategory, prefix = '' }) => {
    const normalized = reviewedContextEntry(item, phrase ?? '', chinese ?? firstMeaning(item.zh));
    const key = normalized.phrase.toLowerCase().replace(/[^a-z']+/g, ' ').trim();
    if (!key || fixedKeys.has(key) || seen.has(key) || !wordsWithOffsets(normalized.phrase).some((word) => inflectedForms(item.w).has(word.text.toLowerCase()))) return;
    const wordCount = normalized.phrase.split(/\s+/).length;
    if (wordCount > 8 || reusablePhraseIssue(normalized.phrase)) return;
    if (wordCount > 6 && /^(?:i|you|we|they|he|she|the|a|an)\b/i.test(normalized.phrase)) return;
    const finalChinese = compactContextGloss(item, normalized.chinese, prefix);
    if (!isConcisePhraseGloss(finalChinese, 24)) return;
    let phonetic;
    try {
      phonetic = ipaFor(normalized.phrase, item.w, item.ipa);
    } catch {
      return;
    }
    seen.add(key);
    accepted.push({
      phrase: normalized.phrase,
      phonetic,
      chinese: finalChinese,
      category: contextCategoryFor(normalized.phrase, sourceCategory)
    });
  };
  candidates.forEach(add);
  const bases = fixedPhrases.map((entry) => ({ phrase: entry.phrase, chinese: entry.chinese }));
  const modifiers = new Set(['can', 'could', 'may', 'might', 'must', 'should', 'will', 'would']).has(item.w)
    ? [['still', '仍然', '时间与频率'], ['not', '不', '否定与限制'], ['also', '也', '并列与补充'], ['always', '始终', '时间与频率']]
    : [['often', '经常', '时间与频率'], ['usually', '通常', '时间与频率'], ['can', '可以', '情态与必要性'], ['need to', '需要', '情态与必要性'], ['not', '不', '否定与限制']];
  for (const [modifier, chinesePrefix, sourceCategory] of modifiers) {
    for (const base of bases) {
      add({ phrase: contextualVariant(item, base.phrase, modifier), chinese: base.chinese, prefix: chinesePrefix, sourceCategory });
    }
  }
  if (accepted.length < 12) throw new Error(`${item.w}: only ${accepted.length}/12 independent context phrases survived review.`);
  const availableGroups = new Map();
  for (const entry of accepted) {
    if (!availableGroups.has(entry.category)) availableGroups.set(entry.category, []);
    availableGroups.get(entry.category).push(entry);
  }
  if (availableGroups.size < 4) throw new Error(`${item.w}: only ${availableGroups.size}/4 concrete context categories survived review.`);
  const selectedGroups = [...availableGroups].map(([category]) => ({ category, items: [] }));
  let remaining = 12;
  let itemIndex = 0;
  while (remaining > 0) {
    let added = false;
    for (let groupIndex = 0; groupIndex < selectedGroups.length && remaining > 0; groupIndex += 1) {
      const entry = availableGroups.get(selectedGroups[groupIndex].category)[itemIndex];
      if (!entry) continue;
      selectedGroups[groupIndex].items.push({ phrase: entry.phrase, phonetic: entry.phonetic, chinese: entry.chinese });
      remaining -= 1;
      added = true;
    }
    if (!added) break;
    itemIndex += 1;
  }
  return selectedGroups.filter((group) => group.items.length);
}

function normalizeFixedPhrases(item, override, tuples) {
  if (item.w === 'work' && override?.phrases) {
    return override.phrases.map(([phrase, chinese, example, translation]) => ({
      phrase,
      phonetic: ipaFor(phrase, item.w, item.ipa),
      chinese,
      example,
      translation
    }));
  }
  if (override?.manualSemanticPack) {
    const source = override.phrases.map(([phrase, chinese, example, translation]) => ({
      phrase: phrase.trim(),
      chinese: normalizePhraseGloss(chinese),
      example: example.trim(),
      translation: translation.trim(),
      phonetic: ipaFor(phrase, item.w, item.ipa)
    }));
    const result = buildFixedPhrases({
      word: item.w,
      candidates: source,
      ipaFor: (phrase) => ipaFor(phrase, item.w, item.ipa),
      minimumItems: 12,
      maximumItems: source.length
    });
    if (result.length !== source.length) {
      throw new Error(`${item.w}: every manual fixed phrase must survive unchanged; ${result.length}/${source.length} passed.`);
    }
    return result;
  }
  const priorityExamples = priorityEntries[item.w]?.uses?.map((entry) => [entry[2], entry[3]]);
  const examples = priorityExamples ?? curatedExamples[item.w] ?? [[item.ex, item.exZh]];
  const source = (override?.phrases ?? tuples.slice(0, examples.length).map(([phrase, chinese], index) => [
    phrase, chinese, examples[index][0], examples[index][1]
  ])).map(([phrase, chinese, example, translation]) => {
    const normalized = reviewedContextEntry(item, phrase, chinese);
    return {
      phrase: normalized.phrase,
      chinese: compactContextGloss(item, normalized.chinese),
      example,
      translation
    };
  });
  for (const entry of supplementalPhraseRows(item)) {
    const normalized = reviewedContextEntry(item, entry.phrase, entry.phraseChinese);
    source.push({
      phrase: normalized.phrase,
      chinese: compactContextGloss(item, normalized.chinese),
      example: entry.english,
      translation: entry.chinese
    });
  }
  const pronounceableSource = source.flatMap((entry) => {
    try {
      return [{ ...entry, phonetic: ipaFor(entry.phrase, item.w, item.ipa) }];
    } catch {
      return [];
    }
  });
  return buildFixedPhrases({
    word: item.w,
    candidates: pronounceableSource,
    ipaFor: (phrase) => ipaFor(phrase, item.w, item.ipa),
    minimumItems: 12,
    maximumItems: 12
  });
}

function normalizeRelations(item, override, key) {
  if (override?.[key]) {
    const noteKey = key === 'synonyms' || key === 'confusables' ? 'difference' : key === 'antonyms' ? 'usage' : 'note';
    return override[key].map(([word, partOfSpeech, chinese, note]) => ({
      word,
      phonetic: ipaFor(word, '', '', { partOfSpeech, chinese }),
      partOfSpeech,
      chinese,
      [noteKey]: note
    }));
  }
  const noteKey = key === 'synonyms' ? 'difference' : 'usage';
  const direct = directRelationPacks[item.w]?.[key]
    ?? (key === 'synonyms'
      ? [[item.syn, item.syn.includes(' ') ? 'phr.' : item.p.split('/')[0].trim(), item.synZh, '']]
      : [[item.ant, item.ant.includes(' ') ? 'phr.' : item.p.split('/')[0].trim(), item.antZh, '']]);
  const fallback = key === 'synonyms' ? (semanticFallbackSynonyms[item.w] ?? []) : [];
  const anchors = [...direct, ...fallback].map(([word, partOfSpeech, chinese, note]) => ({
    word,
    phonetic: ipaFor(word, '', '', { partOfSpeech, chinese }),
    partOfSpeech,
    chinese: chinese || conciseChinese(word, key === 'synonyms' ? '相近表达' : '相反表达'),
    [noteKey]: key === 'synonyms'
      ? `${word} 表示“${chinese || conciseChinese(word, '相近含义')}”，与 ${item.w} 的“${firstMeaning(item.zh)}”义相近。${note || `两词只有在这一义项重合时才能互换；${item.w} 的其他常用义不一定适用。`}`
      : `${word} 表示“${chinese || conciseChinese(word, '相反含义')}”，与 ${item.w} 的“${firstMeaning(item.zh)}”义形成对比。${note || '这种反义关系只适用于上述明确义项。'}`
  }));
  const supplemental = key === 'synonyms'
    ? (curatedSynonymWords[item.w] ?? []).map((word) => {
      const partOfSpeech = word.includes(' ') ? 'phr.' : ecdictPartOfSpeech(word, 'v.');
      const chinese = semanticPhraseChinese[word] ?? conciseChineseForPartOfSpeech(word, partOfSpeech, '相近的常用表达');
      return {
        word,
        phonetic: ipaFor(word, '', '', { partOfSpeech, chinese }),
        partOfSpeech,
        chinese,
        difference: `${word} 常表示“${chinese}”，与 ${item.w} 的“${firstMeaning(item.zh)}”义有重合。${word} 只覆盖其中一个义项；是否能够替换取决于两词各自的宾语、介词和语体。`
      };
    })
    : [];
  const seenRelations = new Set();
  const targetCount = key === 'synonyms' ? 4 : Math.max(1, direct.length);
  return [...anchors, ...supplemental]
    .filter((entry) => {
      const normalized = entry.word.toLowerCase();
      if (!normalized || normalized === item.w.toLowerCase() || seenRelations.has(normalized)) return false;
      seenRelations.add(normalized);
      return true;
    })
    .slice(0, targetCount);
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
      phonetic: entry.phonetic ?? ipaFor(entry.word, '', '', { partOfSpeech: entry.partOfSpeech, chinese: entry.chinese }),
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
      .map(([word, partOfSpeech, chinese, note, phonetic]) => ({
        word,
        phonetic: phonetic ?? ipaFor(word, '', '', { partOfSpeech, chinese }),
        partOfSpeech,
        chinese,
        note
      })));
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

function normalizeConfusables(item, override, synonyms = [], antonyms = []) {
  if (override?.confusables) {
    return normalizeRelations(item, override, 'confusables');
  }
  const legacy = confusables[item.w] ? [confusables[item.w].word] : [];
  const reviewed = [...legacy, ...(manualConfusableWords[item.w] ?? [])];
  const candidates = reviewed.map((word) => ({ word }));
  const otherRelationWords = new Set([...synonyms, ...antonyms].map((entry) => entry.word.toLowerCase()));
  const specialChinese = {
    'believe in': '信仰；信任', 'there is': '有；存在', 'go back': '回去；返回',
    'look like': '看起来像；与……相似', 'appear to': '似乎；看起来',
    'used to': '过去常常', 'would not': '不会；不愿意', 'could not': '不能；不可能',
    'may not': '可能不；不可以', 'should not': '不应该', 'be unable to': '无法做某事'
  };
  const seen = new Set();
  return candidates.filter((entry) => {
    const normalized = entry.word.toLowerCase();
    if (seen.has(normalized) || otherRelationWords.has(normalized)) return false;
    seen.add(normalized);
    return normalized !== item.w.toLowerCase();
  }).slice(0, 4).map((entry) => {
    const word = entry.word;
    const partOfSpeech = entry.partOfSpeech ?? (word.includes(' ') ? 'phr.' : ecdictPartOfSpeech(word, item.p.split('/')[0].trim()));
    const manualEntry = (manualRelatedPacks[item.w] ?? []).find(([candidate]) => candidate.toLowerCase() === word.toLowerCase());
    const chinese = specialChinese[word] ?? manualEntry?.[2] ?? conciseChineseForPartOfSpeech(word, partOfSpeech, `与 ${item.w} 容易混淆的表达`);
    return {
      word,
      phonetic: ipaFor(word, '', '', { partOfSpeech, chinese }),
      partOfSpeech,
      chinese,
      difference: `${word} 表示“${chinese}”，而 ${item.w} 在“${item.coll}”中表示“${firstMeaning(item.zh)}”。两者容易因拼写、发音或相近语境而混淆，使用时要根据完整句义和固定搭配区分。`
    };
  });
}

function normalizeRelated(item, index, override, derivatives, synonyms, antonyms, confusableItems) {
  const excluded = [...synonyms, ...antonyms, ...derivatives, ...confusableItems].map((entry) => entry.word);
  const existingGroups = (override?.related ?? []).map(([category, items]) => ({
    category,
    items: items.map(([word, partOfSpeech, chinese]) => ({ word, partOfSpeech, chinese }))
  }));
  if (override?.related) {
    return buildSemanticRelatedVocabulary({
      word: item.w,
      groups: existingGroups,
      semanticCandidates: [],
      relationWords: [synonyms, antonyms, derivatives, confusableItems],
      ipaFor: (word, partOfSpeech, chinese) => ipaFor(word, '', '', { partOfSpeech, chinese }),
      minimumItems: 12,
      minimumCategories: 3,
      maximumItems: item.w === 'work' ? 12 : 12
    });
  }
  const reviewedRelated = (manualRelatedPacks[item.w] ?? []).map(([word, partOfSpeech, chinese]) => ({
    word,
    partOfSpeech,
    chinese,
    categoryHint: /n\./.test(partOfSpeech) ? '相关事物与概念'
      : /(?:adj|adv)\./.test(partOfSpeech) ? '相关特征与方式'
        : '关联动作'
  }));
  const wordnet = wordnetEntries[item.w] ?? {};
  const wordnetCandidates = selectCommonCandidates([
    ...(wordnet.hypernyms ?? []),
    ...(wordnet.hyponyms ?? []),
    ...(wordnet.related ?? [])
  ], excluded, 80).flatMap((entry) => {
    const partOfSpeech = entry.partOfSpeech ?? ecdictPartOfSpeech(entry.word, 'v.');
    const chinese = conciseChineseForPartOfSpeech(entry.word, partOfSpeech);
    if (!chinese) return [];
    let phonetic;
    try {
      phonetic = ipaFor(entry.word, '', '', { partOfSpeech, chinese });
    } catch {
      return [];
    }
    return [{
      ...entry,
      phonetic,
      partOfSpeech,
      chinese,
      categoryHint: `${classifyContextPhrase({ phrase: `${entry.sourceDefinition ?? ''} ${entry.definition ?? ''}` }, partOfSpeech)} · ${entry.relation === '@' ? '上位概念' : entry.relation === '~' ? '具体表达' : '语义关联'}`,
      cocaRank: Math.min(...(cocaRankData[entry.word] ?? []).map((rank) => rank.rank), Number.MAX_SAFE_INTEGER)
    }];
  });
  const semanticCandidates = [
    ...(semanticRelatedPacks[item.w] ?? []),
    ...reviewedRelated,
    ...wordnetCandidates
  ];
  return buildSemanticRelatedVocabulary({
    word: item.w,
    groups: existingGroups,
    semanticCandidates,
    relationWords: [synonyms, antonyms, derivatives, confusableItems],
    ipaFor: (word, partOfSpeech, chinese) => ipaFor(word, '', '', { partOfSpeech, chinese }),
    minimumItems: 12,
    minimumCategories: 3,
    maximumItems: 12
  });
}

function normalizeExamples(item, override, fixedPhrases = []) {
  if (item.w === 'work' && override?.examples) {
    return override.examples.map(([scene, english, chinese]) => ({ scene, english, chinese }));
  }
  const reviewedExamples = override?.examples?.map(([scene, english, chinese]) => ({ scene, english, chinese })) ?? [];
  const priorityExamples = priorityEntries[item.w]?.uses?.map((entry) => [entry[2], entry[3]]);
  const generated = (priorityExamples ?? curatedExamples[item.w] ?? []).map(([english, chinese], index) => ({
    scene: ['日常使用', '工作或学习', '常见搭配', '真实语境', '易错结构', '主动表达'][index] ?? '高频表达',
    english,
    chinese
  }));
  const result = [];
  const seen = new Set();
  const add = (entry) => {
    const key = entry.english.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!entry.chinese?.trim() || seen.has(key) || !phraseContainsTarget(entry.english, item.w)) return;
    result.push(entry);
    seen.add(key);
  };
  add({ scene: '核心真实用法', english: item.ex, chinese: item.exZh });
  reviewedExamples.forEach(add);
  fixedPhrases.forEach((entry, index) => add({
    scene: ['日常交流', '工作沟通', '学习表达', '书面表达'][index % 4],
    english: entry.example,
    chinese: entry.translation
  }));
  generated.forEach(add);
  const sceneLabels = ['日常交流', '工作沟通', '学习表达', '书面表达', '常见场景'];
  for (const entry of supplementalExamplesFor(item.w)) {
    add({ scene: sceneLabels[Math.max(0, result.length - 6) % sceneLabels.length], english: entry.english, chinese: entry.chinese });
    if (result.length >= 12) break;
  }
  if (result.length < 12) throw new Error(`${item.w}: only ${result.length}/12 target-bearing bilingual examples survived review.`);
  return result.slice(0, 12);
}

function deduplicateRelationSections(relations) {
  const used = new Set();
  const takeUnique = (entries) => entries.filter((entry) => {
    const key = entry.word.toLowerCase().replace(/[^a-z']+/g, ' ').trim();
    if (!key || used.has(key)) return false;
    used.add(key);
    return true;
  });
  const derivatives = takeUnique(relations.derivatives);
  const synonyms = takeUnique(relations.synonyms);
  const antonyms = takeUnique(relations.antonyms);
  const confusables = takeUnique(relations.confusables);
  return { synonyms, antonyms, derivatives, confusables };
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

function teachingRelationOptions(answer, relationEntries, candidates, index) {
  const distractors = selectTeachingDistractors({
    answer,
    candidates,
    count: 3,
    excluded: relationEntries
  });
  return rotateOptions([answer.word, ...distractors.map((entry) => entry.word)], index);
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
    prompt: promptPrefix + blankWord(text, matched) + '（填写 ' + targetWord + ' 的正确形式）' + slotGuidance(text, {
      targetWord,
      isTemplate: !/[.!?]/.test(text)
    }),
    answer: matched.text,
    stage,
    ai: false
  };
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

function contextualCompanionQuestion(id, english, chinese, targetWord, _distractors, stage, _index) {
  const selected = contextualCompanionWord(english, targetWord);
  if (!selected) throw new Error(id + ': example needs a meaningful non-target context word');
  return {
    id,
    type: 'collocation',
    prompt: '根据完整句意和中文提示补全原句：' + blankWord(english, selected) + '（中文：' + chinese + '）',
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
  const semanticPack = manualCardPacks[item.w];
  if (item.w !== 'work') {
    if (!semanticPack) throw new Error(`${item.w}: no human-reviewed semantic pack; publication fallback is forbidden.`);
    const requiredPackKeys = ['meanings', 'fixedPhrases', 'contexts', 'synonyms', 'antonyms', 'derivatives', 'confusables', 'related', 'commonErrors'];
    const missingKeys = requiredPackKeys.filter((key) => !Object.hasOwn(semanticPack, key) || !Array.isArray(semanticPack[key]));
    if (missingKeys.length) throw new Error(`${item.w}: semantic pack is missing explicit review fields: ${missingKeys.join(', ')}`);
    const manualContextCount = semanticPack.contexts.flatMap(([, entries]) => entries).length;
    const manualRelatedCount = semanticPack.related.flatMap(([, entries]) => entries).length;
    const incompleteFloor = [];
    if (semanticPack.meanings.length < 1) incompleteFloor.push('meanings < 1');
    if (semanticPack.fixedPhrases.length < 12) incompleteFloor.push('fixedPhrases < 12');
    if (semanticPack.contexts.length < 4 || manualContextCount < 16) incompleteFloor.push('contexts < 4 categories/16 items');
    if (semanticPack.synonyms.length < 5) incompleteFloor.push('synonyms < 5');
    if (semanticPack.antonyms.length < minimumAntonyms) incompleteFloor.push(`antonyms < ${minimumAntonyms}`);
    if (semanticPack.confusables.length < minimumConfusables) incompleteFloor.push(`confusables < ${minimumConfusables}`);
    if (semanticPack.related.length < 3 || manualRelatedCount < 12) incompleteFloor.push('related < 3 categories/12 items');
    if (semanticPack.commonErrors.length < 2) incompleteFloor.push('commonErrors < 2');
    if (incompleteFloor.length) throw new Error(`${item.w}: manual semantic pack is below the locked detail floor: ${incompleteFloor.join(', ')}`);
  }
  const override = item.w === 'work' ? cardOverrides.work : {
    ...(cardOverrides[item.w] ?? {}),
    ...semanticPack,
    phrases: semanticPack.fixedPhrases,
    errors: semanticPack.commonErrors,
    structures: semanticPack.structures ?? semanticPack.fixedPhrases.slice(0, 4).map(([phrase, chinese]) => [phrase, chinese]),
    focus: semanticPack.focus,
    manualSemanticPack: true
  };
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
  const fixedPhrases = normalizeFixedPhrases(item, override, tuples);
  const contextPhrases = normalizeContexts(item, override, tuples, fixedPhrases);
  const rawSynonyms = normalizeRelations(item, override, 'synonyms');
  const rawAntonyms = normalizeRelations(item, override, 'antonyms');
  const rawDerivatives = normalizeDerivatives(item, override);
  const rawConfusableItems = normalizeConfusables(item, override, rawSynonyms, rawAntonyms);
  const normalizedRelations = {
    synonyms: rawSynonyms,
    antonyms: rawAntonyms,
    derivatives: rawDerivatives,
    confusables: rawConfusableItems
  };
  const {
    synonyms,
    antonyms,
    derivatives,
    confusables: confusableItems
  } = normalizedRelations;
  const relatedVocabulary = normalizeRelated(item, index, override, derivatives, synonyms, antonyms, confusableItems);
  const examples = normalizeExamples(item, override, fixedPhrases);
  const referenceShape = templateLock.referenceCard?.recordedShape ?? {};
  const requiredAntonyms = item.w === templateLock.referenceCard?.word
    ? Math.max(minimumAntonyms, CODE_REFERENCE_RELATION_MINIMUMS.antonyms, referenceShape.antonyms)
    : minimumAntonyms;
  const requiredConfusables = item.w === templateLock.referenceCard?.word
    ? Math.max(minimumConfusables, CODE_REFERENCE_RELATION_MINIMUMS.confusables, referenceShape.confusables)
    : minimumConfusables;
  if (antonyms.length < requiredAntonyms || confusableItems.length < requiredConfusables) {
    detailFloorFailures.push(`${item.w}: ${antonyms.length} antonyms/${requiredAntonyms} required, ${confusableItems.length} confusables/${requiredConfusables} required`);
  }
  if (item.w !== 'work') {
    const contextItemCount = contextPhrases.reduce((sum, group) => sum + group.items.length, 0);
    const relatedItemCount = relatedVocabulary.reduce((sum, group) => sum + group.items.length, 0);
    if (contextPhrases.length < 4 || contextItemCount < 16 || fixedPhrases.length < 12
      || synonyms.length < 5
      || relatedVocabulary.length < 3 || relatedItemCount < 12 || examples.length < 12) {
      detailFloorFailures.push(`${item.w}: ${contextPhrases.length} context groups/${contextItemCount} contexts, ${fixedPhrases.length} fixed phrases, ${synonyms.length} synonyms, ${antonyms.length} antonyms, ${confusableItems.length} confusables, ${relatedVocabulary.length} related groups/${relatedItemCount} related words, ${examples.length} examples`);
    }
  }
  const wordFamily = derivatives.map((entry) => entry.word);
  const additionalMeaningFocus = meanings.length > 1
    ? `再对比另外 ${meanings.length - 1} 个常用义项，辨别不同语境。`
    : '再用高频固定搭配和真实例句巩固这个义项。';
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
  const allRelationEntries = [...synonyms, ...antonyms, ...derivatives, ...confusableItems];
  // Keep the locked work card on its core “工作；任职” sense. Composite POS
  // labels such as `v. / n.` remain eligible rather than being skipped by an
  // exact single-label regular expression.
  const synonymAnswerEntry = selectRelationQuestionAnswer(synonyms, {
    preferredWord: item.w === 'work'
      ? 'labor'
      : item.w === 'could'
        ? 'was able to'
        : item.w === 'would'
          ? 'was willing to'
          : item.w === 'may'
            ? 'be allowed to'
            : ''
  });
  const antonymAnswerEntry = selectRelationQuestionAnswer(antonyms, {
    preferredWord: item.w === 'work' ? 'rest' : ''
  });
  const synonymAnswer = synonymAnswerEntry.word;
  const antonymAnswer = antonymAnswerEntry?.word;
  const synonymOptions = relationOptions(synonymAnswer, allRelationEntries.map((entry) => entry.word), index + 3);
  const antonymOptions = antonymAnswer ? relationOptions(antonymAnswer, allRelationEntries.map((entry) => entry.word), index + 4) : [];
  const secondarySynonymAnswerEntry = selectSecondaryRelationQuestionAnswer(synonyms, synonymAnswerEntry);
  const secondarySynonymAnswer = secondarySynonymAnswerEntry?.word;
  const secondarySynonymOptions = secondarySynonymAnswerEntry
    ? relationOptions(secondarySynonymAnswerEntry.word, allRelationEntries.map((entry) => entry.word), index + 4)
    : [];
  const quizReadyConfusables = confusableItems.filter((entry) => /^(?:aux|v|n|adj|adv)\.$/.test(entry.partOfSpeech));
  const contrastSource = quizReadyConfusables.length ? quizReadyConfusables : derivatives;
  const contrast = contrastSource.length ? selectRelationQuestionAnswer(contrastSource) : undefined;
  const contrastKind = quizReadyConfusables.length ? '易混词' : '派生词';
  const contrastOptions = contrast ? relationOptions(contrast.word, allRelationEntries.map((entry) => entry.word), index + 5) : [];
  const firstContextEntry = contextPhrases
    .flatMap((group) => group.items)
    .find((entry) => hasConcreteContextWord(entry.phrase, item.w))
    ?? contextPhrases[0]?.items[0]
    ?? { phrase: item.coll, chinese: item.collZh };
  const firstContextPhrase = firstContextEntry.phrase;
  const objectiveStructure = structures.slice(1).find((entry) => hasObjectiveStructureWord(entry.phrase, item.w))
    ?? structures[1]
    ?? structures[0];
  // Core structures already get two dedicated questions.  Pull the fixed-
  // phrase questions from different entries so a large card never spends
  // four question slots testing the same two chunks under different labels.
  const structurePhraseKeys = new Set(structures.map((entry) => entry.phrase.toLowerCase().replace(/\s+/g, ' ').trim()));
  const fixedQuestionCandidates = fixedPhrases.filter((entry) => !structurePhraseKeys.has(entry.phrase.toLowerCase().replace(/\s+/g, ' ').trim()));
  const firstFixedEntry = fixedQuestionCandidates[0]
    ?? fixedPhrases.find((entry) => entry.phrase !== structures[0]?.phrase)
    ?? fixedPhrases[0]
    ?? { phrase: item.coll, chinese: item.collZh };
  const firstFixedPhrase = firstFixedEntry.phrase;
  const secondFixedEntry = fixedQuestionCandidates.find((entry) => entry.phrase !== firstFixedPhrase)
    ?? fixedPhrases.find((entry) => entry.phrase !== firstFixedPhrase && entry.phrase !== structures[0]?.phrase)
    ?? { phrase: structures[1]?.phrase ?? item.coll, chinese: structures[1]?.chinese ?? item.collZh };
  const targetForms = inflectedForms(item.w.toLowerCase());
  const additionalExampleEntry = fixedPhrases.find((entry) => (
    entry.example.trim().toLowerCase() !== item.ex.trim().toLowerCase()
    && wordsWithOffsets(entry.example).some((word) => targetForms.has(word.text.toLowerCase()))
  ));
  if (!additionalExampleEntry) throw new Error(`${item.w}: a distinct fixed-phrase example is required for the second cloze question.`);
  const additionalExampleQuestion = clozeTargetQuestion(
    id + '-example-cloze',
    '根据句意和中文提示补全另一个常用例句：',
    additionalExampleEntry.example,
    item.w,
    'T3'
  );
  additionalExampleQuestion.prompt += `（中文：${additionalExampleEntry.translation}）`;
  const contextualDistractors = [next, nextTwo, orderedLexicon[(index + 67) % orderedLexicon.length]]
    .map((candidate) => contextualCompanionWord(candidate.ex, candidate.w)?.text ?? candidate.w);
  const rawQuestions = [
    { id: id + '-meaning-core', type: 'meaning_choice', prompt: '“' + item.w + '”最核心的中文含义是？', options: meaningOptions, answer: meanings[0].chinese, stage: 'T0', ai: false },
    { id: id + '-meaning-english', type: 'meaning_choice', prompt: '哪一项英文释义最符合词卡中的 “' + item.w + '”？', options: englishMeaningOptions, answer: meanings[0].english, stage: 'T0', ai: false },
    ...(item.w === 'would'
      ? [buildSecondaryMeaningChoiceQuestion({ id: id + '-meaning-secondary', word: item.w, meanings, stage: 'T1', seed: index + 11 })].filter(Boolean)
      : []),
    { id: id + '-structure-choice-v3', type: 'meaning_choice', prompt: structurePrompt(structures[0], '核心结构辨析'), options: structureOptions, answer: structures[0].phrase, stage: 'T1', ai: false },
    { id: id + '-synonym-choice', type: 'meaning_choice', prompt: '哪个词是词卡中列出的 “' + item.w + '” 最直接近义词？', options: synonymOptions, answer: synonymAnswer, stage: 'T2', ai: false },
    ...(antonymAnswer
      ? [{ id: id + '-antonym-choice', type: 'meaning_choice', prompt: '哪个词与 “' + item.w + '” 的当前义项形成直接反义？', options: antonymOptions, answer: antonymAnswer, stage: 'T2', ai: false }]
      : secondarySynonymAnswer
        ? [{ id: id + '-synonym-choice-2', type: 'meaning_choice', prompt: '除 “' + synonymAnswer + '” 外，哪个词也与 “' + item.w + '” 的当前义项接近？', options: secondarySynonymOptions, answer: secondarySynonymAnswer, stage: 'T2', ai: false }]
        : []),
    ...(contrast ? [{ id: id + '-contrast-choice', type: 'meaning_choice', prompt: '根据词义和用法，哪个词是 “' + item.w + '” 的' + contrastKind + '？', options: contrastOptions, answer: contrast.word, stage: 'T3', ai: false }] : []),
    { id: id + '-recall-definition', type: 'recall', prompt: '根据英文释义写出目标词：' + meanings[0].english, answer: item.w, stage: 'T1', ai: false },
    { id: id + '-recall-chinese', type: 'recall', prompt: '写出符合“' + meanings[0].chinese + '”（' + meanings[0].partOfSpeech + '）的本课目标词。', answer: item.w, stage: 'T1', ai: false },
    clozeTargetQuestion(id + '-collocation-core', '补全高频搭配：', item.coll, item.w, 'T0'),
    structureMeaningQuestion(id + '-collocation-structure-meaning-v3', objectiveStructure, structures, 'T1', index + 8),
    contextualCompanionQuestion(id + '-collocation-example-context-v3', item.ex, item.exZh, item.w, contextualDistractors, 'T2', index + 9),
    phraseMeaningQuestion(id + '-collocation-fixed-1-v3', firstFixedEntry, fixedPhrases, 'T2', index + 6),
    phraseMeaningQuestion(id + '-collocation-fixed-2-v3', secondFixedEntry, fixedPhrases, 'T3', index + 7),
    additionalExampleQuestion,
    { id: id + '-sentence-core', type: 'free_sentence', prompt: '请用 “' + item.w + '” 写一个自然、真实的英文句子，含义必须符合词卡核心义“' + meanings[0].chinese + '”。', answer: '', stage: 'T2', ai: true },
    { id: id + '-sentence-phrase', type: 'free_sentence', prompt: '请使用 “' + firstFixedPhrase + '” 结构写一个与自己有关的自然英文句子' + slotGuidance(firstFixedPhrase, { targetWord: item.w }) + '。', answer: '', stage: 'T3', ai: true },
    { id: id + '-dialogue', type: 'dialogue', prompt: '写一段 2–4 轮真实对话，自然使用 “' + item.w + '” 和 “' + firstContextPhrase + '” 结构，并避免中文直译' + slotGuidance(firstContextPhrase, { targetWord: item.w }) + '。', answer: '', stage: 'T4', ai: true }
  ];
  const questions = rewriteLearnerQuestionPrompts(rawQuestions, {
    word: item.w,
    coreMeaning: meanings[0].chinese,
    partOfSpeech: meanings[0].partOfSpeech,
    synonymMeaning: synonymAnswerEntry.chinese,
    secondarySynonymMeaning: secondarySynonymAnswerEntry?.chinese,
    antonymMeaning: item.w === 'mean'
      ? '刻薄的；吝啬的'
      : item.w === 'ask'
        ? '问；询问'
        : meanings[0].chinese
  });

  return {
    id,
    word: item.w,
    lemma: item.w,
    cocaRanks: ranks,
    cocaRankLabel,
    learningPriority: learningPriority(item, index + 1, cocaRankData),
    phonetic: publishedHeadwordIpaOverrides[item.w] ?? item.ipa,
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
    detailLevel: item.w === 'work' ? 'template-reference' : 'template-curated',
    templateVersion,
    contentVersion,
    reviewed: true,
    curationSource: item.w === 'work' ? 'locked-reference-example' : `manual-semantic-pack-${release.templateLockVersion}`,
    sourceNote: '词条来自 COCA 高频词表，释义、搭配和例句按实际学习场景整理，音标按美式发音展示。'
  };
}

function finalizeRelationQuestionOptions(cards) {
  const canonicalPool = cards.flatMap((card) => [
    {
      word: card.word,
      partOfSpeech: card.partOfSpeech,
      chinese: card.coreMemory.chinese,
      cocaRank: Math.min(...card.cocaRanks.map((entry) => entry.rank), Number.MAX_SAFE_INTEGER)
    },
    ...card.synonyms,
    ...card.antonyms,
    ...card.derivatives,
    ...card.confusables,
    ...card.relatedVocabulary.flatMap((group) => group.items.map((item) => ({
      ...item,
      semanticField: group.category
    })))
  ]);
  cards.forEach((card, cardIndex) => {
    const ownRelations = [...card.synonyms, ...card.antonyms, ...card.derivatives, ...card.confusables];
    card.questions = card.questions.map((question, questionIndex) => {
      if (!/(?:synonym|antonym|contrast)-choice/.test(question.id)) return question;
      const answer = ownRelations.find((entry) => entry.word.toLowerCase() === question.answer.toLowerCase());
      if (!answer) throw new Error(`${card.word}: ${question.id} answer is not present in a relation section.`);
      return {
        ...question,
        options: teachingRelationOptions(
          answer,
          [{ word: card.word }, ...ownRelations],
          canonicalPool,
          cardIndex * 17 + questionIndex
        )
      };
    });
  });
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

const generationFailures = [];
const cards = [];
orderedLexicon.forEach((item, index) => {
  try {
    cards.push(makeCard(item, index));
  } catch (error) {
    generationFailures.push(`${item.w}: ${error instanceof Error ? error.message : String(error)}`);
  }
});
if (generationFailures.length) {
  throw new Error(`Card generation failed for ${generationFailures.length}/${orderedLexicon.length} cards:\n${generationFailures.join('\n')}`);
}
finalizeRelationQuestionOptions(cards);
if (detailFloorFailures.length) {
  throw new Error(`Published detail floor failed:\n${detailFloorFailures.join('\n')}`);
}

// Never destroy the last valid catalog before the complete replacement has
// been generated and passed every in-memory quality gate above.
await fs.mkdir(contentCardsDir, { recursive: true });
await fs.mkdir(publicDailyDir, { recursive: true });
for (const directory of [contentCardsDir, publicDailyDir]) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  await Promise.all(entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => fs.unlink(path.join(directory, entry.name))));
}
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

const catalogJson = JSON.stringify({ contentVersion, templateVersion, total: cards.length, cards }, null, 2) + '\n';
const catalogHash = createHash('sha256').update(catalogJson).digest('hex').toUpperCase();
const releaseId = release.releaseVersion;
await fs.writeFile(path.join(publicDataDir, 'all-cards.json'), catalogJson, 'utf8');
await fs.writeFile(path.join(publicDataDir, 'manifest.json'), JSON.stringify({
  appName: '每日英语', contentVersion, templateVersion, catalogHash, releaseId,
  totalCards: cards.length, totalDays: dailyFiles.length,
  cardsPerDay: 5, scheduleStart: formatDate(launchDate), dailyFiles
}, null, 2) + '\n', 'utf8');
await fs.writeFile(path.join(root, 'content', 'content-manifest.json'), JSON.stringify({
  source: 'COCA词频单词表.xlsx', generatedAt: '2026-09-11', contentVersion, templateVersion, catalogHash, releaseId,
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
