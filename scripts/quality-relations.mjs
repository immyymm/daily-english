/**
 * Deterministic learner-facing relation normalization.
 *
 * This module deliberately has no dependency on build-content.mjs.  The
 * generator can pass its dictionary and phonetic renderer in, which keeps the
 * policy reusable in tests and in future content pipelines.
 */

export const FORBIDDEN_RELATION_TEXT_PATTERNS = Object.freeze([
  /相近的常用表达/,
  /相近表达/,
  /相反表达/,
  /与\s*[^，。；]+\s*容易混淆的表达/,
  /只覆盖其中一个义项/,
  /只有在两词都取这个动作义且句型相容时才能替换/,
  /两词只有在这一义项重合时才能互换/,
  /二者只在这一明确义项上构成反向对比/,
  /两者容易因拼写、发音或相近语境而混淆/,
  /是否能够替换取决于两词各自的宾语、介词和语体/,
  /使用时要根据完整句义和固定搭配区分/
]);

// These pairs are real English words, but they are not useful members of a
// general-purpose learner's "common derivatives" section. Keeping the base
// word in the key prevents a legitimate use elsewhere from being rejected.
export const LOW_VALUE_DERIVATIVE_PAIRS = new Set([
  'affect:effect', 'affect:effective', 'bring:bringing', 'come:comer',
  'eat:edible', 'end:finally', 'feel:felt', 'get:getter', 'join:joint',
  'leave:leaving', 'let:letter', 'like:looking', 'live:liver', 'look:looker',
  'notice:noticeability', 'offer:offeror', 'pass:passenger', 'put:putting',
  'reduce:reducer', 'set:settlement', 'show:showily',
  'solve:solvent', 'talk:talkatively', 'watch:watchfully'
]);

export function isLowValueDerivative(baseWord, derivativeWord) {
  return LOW_VALUE_DERIVATIVE_PAIRS.has(`${compact(baseWord).toLowerCase()}:${compact(derivativeWord).toLowerCase()}`);
}

// ECDICT often lists the noun reading first.  These are common verbs used by
// the 150-card verb curriculum; keeping the intended verb gloss here prevents
// homographs such as settle, bear, match, present, and fix from leaking a noun
// sense into a verb relation.
export const VERB_GLOSS_OVERRIDES = Object.freeze({
  abandon: '离开；抛弃',
  address: '处理；向……致辞',
  aid: '帮助；援助',
  answer: '回答；回应',
  approach: '接近；靠近',
  approve: '赞同；批准',
  attach: '附加；连接',
  authorize: '授权；批准',
  bear: '承受；忍受；带有',
  catch: '接住；听清；理解',
  characterize: '描述……的特征；使具有特点',
  chat: '聊天；交谈',
  chop: '切碎；砍',
  collect: '收集；采集',
  contact: '联系；联络',
  converse: '交谈；谈话',
  control: '控制；管理',
  damage: '损坏；损害',
  decline: '下降；衰退',
  delay: '推迟；耽搁',
  desire: '渴望；想要',
  devour: '吞食；狼吞虎咽地吃',
  discuss: '讨论；商议',
  display: '展示；显示',
  divide: '分开；分配',
  draw: '拉；牵引；画',
  escape: '避开；逃脱',
  emerge: '出现；显现',
  enable: '使能够；使可行',
  exit: '离开；退出',
  experience: '经历；体验',
  favor: '偏爱；赞同',
  fetch: '取来；拿来',
  fix: '修理；解决；确定',
  force: '迫使；强迫',
  form: '形成；制作',
  forward: '转发；转寄',
  found: '建立；创立',
  function: '运转；起作用',
  gain: '得到；增加',
  gather: '聚集；收集',
  grab: '抓住；夺取',
  grant: '授与；允许',
  guard: '保卫；防止',
  hand: '递给；交给',
  head: '带领；率领',
  hinge: '取决于；以……为转移',
  impact: '影响；冲击',
  initiate: '发起；开始',
  interrupt: '打断；中断',
  jog: '慢跑；轻推',
  launch: '发起；启动；发射',
  link: '连接；联系',
  mail: '邮寄；发送',
  market: '推销；销售',
  match: '相配；匹配；一致',
  mention: '提到；说起',
  monitor: '监测；观察',
  murder: '谋杀；杀害',
  name: '命名；称呼',
  perch: '栖息；坐在高处',
  permit: '允许；准许',
  participate: '参加；参与',
  peruse: '仔细阅读；研读',
  plan: '计划；打算',
  pluck: '摘；采；拔',
  position: '放置；安置',
  power: '驱动；为……提供动力',
  present: '提出；呈现；展示',
  preserve: '保存；保护；维持',
  produce: '生产；制作；产生',
  pursue: '追随；追求',
  question: '询问；质疑',
  record: '记录；录制',
  regard: '认为；看待',
  request: '请求；要求',
  relocate: '搬迁；重新安置',
  reverse: '颠倒；逆转',
  restore: '恢复；归还',
  scan: '扫视；浏览；扫描',
  seek: '寻找；寻求',
  slice: '切；切成薄片',
  slay: '杀死；残杀',
  split: '分开；分裂',
  sprint: '冲刺；短距离快跑',
  settle: '解决；决定；安顿',
  state: '陈述；说明',
  study: '学习；研究',
  surrender: '放弃；投降；交出',
  steer: '驾驶；操纵',
  switch: '转换；更换',
  test: '测试；检验',
  trade: '交易；买卖',
  transfer: '转移；转让',
  travel: '移动；旅行',
  trim: '修剪；削减',
  tug: '用力拉；拖',
  view: '查看；观看；看待',
  vend: '出售；贩卖',
  volunteer: '自愿做；主动提出',
  draft: '起草；拟稿',
  notify: '通知；告知',
  wish: '希望；想要'
});

export const RELATION_SENSE_OVERRIDES = Object.freeze({
  'accept|synonym|admit': {
    chinese: '承认；准许进入',
    note: 'admit 常指承认事实或允许进入；accept 更常指接受提议、责任或某个事实。'
  },
  'accept|synonym|approve': {
    chinese: '赞同；批准',
    note: 'approve 表示认可或正式批准；accept 表示接纳、接受或承担，不一定含“批准”。'
  },
  'accept|synonym|take': {
    chinese: '接受；采取；拿取',
    note: 'take 只在 take an offer/a job 等特定表达中可对应“接受”；accept 直接表示愿意接纳。'
  },
  'agree|synonym|match': {
    chinese: '相配；匹配；一致',
    note: 'match 强调事物相配或信息吻合；agree 主要表示人的意见一致，也可表示事实相符。'
  },
  'call|synonym|name': {
    chinese: '命名；称呼',
    note: 'name 强调命名或说出名称；call 可表示称呼，还常表示打电话或呼喊。'
  },
  'decide|synonym|settle': {
    chinese: '决定；解决',
    note: 'settle 常强调最终解决争议或确定安排；decide 更一般地表示作出选择或决定。'
  },
  'offer|synonym|present': {
    chinese: '提出；呈交；展示',
    note: 'present 较正式，常指呈交、介绍或展示；offer 强调主动提出给予或做某事。'
  },
  'pay|synonym|settle': {
    chinese: '结清；付清',
    note: 'settle a bill/debt 强调把账单或债务结清；pay 可泛指支付任何款项。'
  },
  'show|synonym|present': {
    chinese: '呈现；展示',
    note: 'present 较正式，常用于展示信息或做演示；show 更常用，可泛指给人看或表明。'
  },
  'sit|synonym|settle': {
    chinese: '坐定；安顿下来',
    note: 'settle down/into a seat 强调安顿下来或坐定；sit 只直接描述坐着的姿势。'
  },
  'solve|synonym|fix': {
    chinese: '修好；解决',
    note: 'fix 常指修好故障或处理具体问题；solve 强调找到问题、谜题或方程的答案。'
  },
  'wear|synonym|bear': {
    chinese: '承受；带有',
    note: 'bear 可指承受重量或带有标记；wear 主要指穿戴或因使用而磨损，只在极少数语境中相关。'
  },
  'may|synonym|can': {
    partOfSpeech: 'aux.',
    chinese: '能；可以',
    note: 'can 常表示能力或非正式许可；may 在“可能性”义项中不与 can 互换，只在许可语境中部分重合。'
  },
  'can|confusable|could': {
    partOfSpeech: 'aux.', chinese: '能；可以；可能',
    note: 'can 常表示当前能力或许可；could 可表示过去能力、较委婉的请求或较弱的可能性。'
  },
  'can|confusable|may': {
    partOfSpeech: 'aux.', chinese: '可能；可以',
    note: 'can 优先表示能力，也可非正式地表许可；may 优先表示可能性，表许可时较正式。'
  },
  'may|confusable|must': {
    partOfSpeech: 'aux.', chinese: '必须；一定',
    note: 'may 表示事情可能发生；must 表示必须做某事，或根据证据作出把握很高的推断。'
  },
  'would|confusable|will': {
    partOfSpeech: 'aux.', chinese: '将；会；愿意',
    note: 'will 通常表示未来或当下意愿；would 常表示假设结果、过去习惯或更委婉的意愿。'
  },
  'would|confusable|could': {
    partOfSpeech: 'aux.', chinese: '能；可以；可能',
    note: 'could 主要表示能力、可能性或委婉请求；would 主要表示假设结果、过去习惯或愿意。'
  }
});

export const CONFUSABLE_METADATA_OVERRIDES = Object.freeze({
  'accept|except': { word: 'except', partOfSpeech: 'prep. / conj.', chinese: '除……之外', difference: 'accept /əkˈsept/ 是动词“接受”；except /ɪkˈsept/ 是介词或连词“除外”。' },
  'choose|choice': { word: 'choice', partOfSpeech: 'n.', chinese: '选择；选项', difference: 'choose 是动词，可接名词或 to do；choice 是名词，常用 make a choice。' },
  'choose|chose': { word: 'chose', partOfSpeech: 'v.', chinese: '选择（choose 的过去式）', difference: 'choose /tʃuːz/ 是原形；chose /tʃoʊz/ 是过去式，只用于过去时。' },
  'continue|continuous': { word: 'continuous', partOfSpeech: 'adj.', chinese: '连续不断的', difference: 'continue 是动词“继续”；continuous 是形容词，强调过程中没有中断。' },
  'discover|invent': { word: 'invent', partOfSpeech: 'v.', chinese: '发明；创造', difference: 'discover 指发现原本已存在的事物；invent 指创造以前不存在的事物。' },
  'encourage|courage': { word: 'courage', partOfSpeech: 'n.', chinese: '勇气', difference: 'encourage 是动词“鼓励”；courage 是不可数名词“勇气”。' },
  'lose|loose': { word: 'loose', partOfSpeech: 'adj. / v.', chinese: '松的；释放', difference: 'lose /luːz/ 是动词“丢失”；loose /luːs/ 通常是形容词“松的”，元音相同但辅音不同。' },
  'meet|meat': { word: 'meat', partOfSpeech: 'n.', chinese: '肉', difference: 'meet 是动词“见面；满足”；meat 是名词“肉”，两词同音但拼写和词性不同。' },
  'pass|past': { word: 'past', partOfSpeech: 'prep. / adj. / n.', chinese: '经过；过去的；过去', difference: 'pass 是动词“经过；通过”；past 可作介词、形容词或名词，本身不是 pass 的过去式。' },
  'prefer|rather': { word: 'rather', partOfSpeech: 'adv.', chinese: '宁可；相当', difference: 'prefer 是动词，常用 prefer A to B；rather 是副词，常用 would rather do than do。' },
  'remember|remind': { word: 'remind', partOfSpeech: 'v.', chinese: '提醒；使想起', difference: 'remember 表示自己记得；remind 表示某人或某事使人想起，常用 remind someone to do/of something。' },
  'wear|where': { word: 'where', partOfSpeech: 'adv. / conj.', chinese: '在哪里；……的地方', difference: 'wear /wer/ 是动词“穿戴；磨损”；where /wer/ 是疑问副词或连词“在哪里”，两词同音。' },
  'write|right': { word: 'right', partOfSpeech: 'adj. / n. / adv.', chinese: '正确的；右边；向右', difference: 'write /raɪt/ 是动词“写”；right /raɪt/ 常表示“正确的”或“右边”，两词同音。' }
});

const POS_ALIASES = Object.freeze({
  v: 'v.', vt: 'v.', vi: 'v.', verb: 'v.',
  n: 'n.', noun: 'n.',
  a: 'adj.', adj: 'adj.', adjective: 'adj.',
  adv: 'adv.', adverb: 'adv.',
  prep: 'prep.', preposition: 'prep.',
  conj: 'conj.', conjunction: 'conj.',
  pron: 'pron.', pronoun: 'pron.',
  aux: 'aux.', auxiliary: 'aux.',
  phrase: 'phr.', phr: 'phr.'
});

const DERIVATIVE_POS_ORDER = Object.freeze(['v.', 'n.', 'adj.', 'adv.']);
const MODAL_AUXILIARIES = new Set(['can', 'could', 'may', 'might', 'must', 'shall', 'should', 'will', 'would']);
const MODAL_GLOSSES = Object.freeze({
  can: '能；可以', could: '能；可以；可能', may: '可能；可以', might: '可能；也许',
  must: '必须；一定', shall: '将；应当', should: '应该；可能', will: '将；会；愿意', would: '会；愿意'
});

const compact = (value = '') => String(value).replace(/\s+/g, ' ').trim();
const firstMeaning = (value = '') => compact(String(value).split(/[；;]/)[0]);

export function canonicalizePartOfSpeech(value = '') {
  const parts = String(value)
    .toLowerCase()
    .split(/\s*\/\s*|\s*,\s*/)
    .map((part) => part.replace(/\.$/, '').trim())
    .filter(Boolean)
    .map((part) => POS_ALIASES[part] ?? `${part}.`);
  return [...new Set(parts)].join(' / ');
}

function parseDictionaryLines(entry = {}) {
  return String(entry.translation ?? '')
    .replace(/\\n/g, '\n')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(vt|vi|v|n|a|adj|adv|prep|conj|pron|aux)\.\s*(.+)$/i);
      return match
        ? { partOfSpeech: canonicalizePartOfSpeech(match[1]), text: match[2].trim() }
        : null;
    })
    .filter(Boolean);
}

function conciseGloss(value = '', limit = 3) {
  const seen = new Set();
  return String(value)
    .replace(/\.\.\./g, '……')
    .split(/[；;，,]/)
    .map((part) => part.trim())
    .filter((part) => part && !/^\[[^\]]+\]$/.test(part))
    .filter((part) => !seen.has(part) && seen.add(part))
    .slice(0, limit)
    .join('；');
}

export function dictionaryGlossForPartOfSpeech(word, partOfSpeech, ecdictEntries = {}, fallback = '') {
  const normalizedWord = String(word).toLowerCase().trim();
  const wanted = canonicalizePartOfSpeech(partOfSpeech);
  const lines = parseDictionaryLines(ecdictEntries[normalizedWord]);
  const matching = lines.filter((line) => wanted.split(' / ').includes(line.partOfSpeech));
  const selected = matching.length ? matching : lines;
  const dictionaryGloss = conciseGloss(selected.map((line) => line.text).join('；'));
  return dictionaryGloss || conciseGloss(fallback);
}

function dictionaryHasPartOfSpeech(word, partOfSpeech, ecdictEntries = {}) {
  const wanted = canonicalizePartOfSpeech(partOfSpeech).split(' / ');
  return parseDictionaryLines(ecdictEntries[String(word).toLowerCase().trim()])
    .some((line) => wanted.includes(line.partOfSpeech));
}

export function containsForbiddenRelationText(value = '') {
  return FORBIDDEN_RELATION_TEXT_PATTERNS.some((pattern) => pattern.test(String(value)));
}

const VAGUE_RELATION_NOTE_PATTERNS = Object.freeze([
  /^(?:两词|二者|两者).*(?:含义|意思).*(?:接近|相近|相反|不同).*(?:用法|语境|搭配).*(?:不同|区别|注意)/,
  /^(?:两词|二者|两者).*(?:需要|应该|要).*(?:根据|结合).*(?:语境|用法|搭配).*(?:区分|辨别)/,
  /^(?:意思|含义).*(?:接近|相反|不同).*(?:但|不过).*(?:用法|语境|搭配).*(?:不同|有别)/,
  /^[A-Za-z][^,，。；;]{0,50}(?:意思|含义).*(?:接近|相近|相反).*(?:用法|语境|搭配).*(?:不同|有别|区分|注意)/i,
  /^[A-Za-z].*(?:和|与).*(?:接近|相近|相似|很像).*(?:用法|语境|搭配).*(?:不同|有别|区分|注意)/i
]);

// A useful comparison names a concrete boundary rather than merely telling the
// learner that two words are "different".  The relation word is already the
// heading of its row, so a legacy reviewed note may omit that literal spelling
// when it still supplies strong construction/register/sense evidence.
const CONCRETE_RELATION_DIMENSION = /(?:宾语|介词|主语|及物|不及物|可数|不可数|句型|结构|连用|搭配|后接|直接接|常接|可接|常与|正式|口语|书面|技术|法律|礼貌|委婉|语气|拼写|发音|同音|元音|词性|动词|名词|形容词|副词|时态|过去式|原形|只对应|仅对应|不表示|不能|不用于|不覆盖|不含|不一定|范围|程度|结果|过程|状态|方向|时间|原因|目的|对象|持续|变化|主动|被动|(?:^|\s)-ing\b|\bto do\b|\b(?:than|from|into|with|without|for|of|on|upon|about)\b)/i;
const RELATION_SEMANTIC_PREDICATE = /(?:强调|侧重|着重|表示|指|说明|用于|常指|多指|适用于|要求|后接|直接接|常与|搭配)/g;

export function relationNoteSpecificityIssue({ baseWord = '', relationWord = '', note = '', kind = 'synonym' } = {}) {
  if (kind === 'derivative') return '';
  const text = compact(note);
  if (!text) return 'missing-relation-note';
  if (VAGUE_RELATION_NOTE_PATTERNS.some((pattern) => pattern.test(text))) return 'vague-relation-note';

  const normalized = text.toLocaleLowerCase('en-US');
  const base = compact(baseWord).toLocaleLowerCase('en-US');
  const relation = compact(relationWord).toLocaleLowerCase('en-US');
  const bilateralAnchor = /(?:两词|二者|两者|前者|后者)/.test(text);
  const baseAnchor = Boolean(base && normalized.includes(base));
  const relationAnchor = Boolean(relation && normalized.includes(relation));
  const semanticPredicates = text.match(RELATION_SEMANTIC_PREDICATE) ?? [];
  const explicitGlossContrast = baseAnchor && relationAnchor
    && (text.match(/(?:是|表示|意为|指)/g) ?? []).length >= 2;
  const specificCollocationEvidence = /(?:对应|常接|可接|常用|常配).{0,28}[A-Za-z]/i.test(text);
  const anchoredConcreteContrast = baseAnchor && relationAnchor && text.length >= 12;
  const directSenseBoundary = /(?:对应).{2,36}(?:义|义项)|(?:相反|相对|对比).{0,20}(?:义|义项)|(?:义|义项).{0,20}(?:相反|相对|形成(?:直接)?(?:否定)?对比|构成对比)|(?:不确定|确定).{0,16}相对/.test(text);
  const twoClauseContrast = /[；;]/.test(text)
    && /(?:只|仅|不只|不仅|通常|可|而非|不是|不作|不同|相反|相对)/.test(text)
    && text.length >= 16;
  const concreteDimension = CONCRETE_RELATION_DIMENSION.test(text)
    || /(?:只|仅|常|多|更|较|强调|侧重).{0,18}(?:义|意义|含义|表示|指)/.test(text)
    || /(?:义|义项|用途|角色|功能).{0,12}(?:相反|相对|形成对比|构成对比)/.test(text)
    || (semanticPredicates.length >= 1 && text.length >= 12)
    || explicitGlossContrast
    || specificCollocationEvidence
    || anchoredConcreteContrast
    || directSenseBoundary
    || twoClauseContrast
    || /(?:强调|侧重|着重|表示|指|说明).{2,30}(?:而|但|却|；|;).{0,30}(?:只|仅|更|还|常|多|强调|侧重|着重|表示|指|说明)/.test(text);

  if (!concreteDimension) return 'missing-concrete-relation-dimension';
  // Prefer an explicit two-sided comparison. Precise legacy notes are accepted
  // when the concrete dimension itself makes the row-specific contrast clear.
  if (!baseAnchor && !relationAnchor && !bilateralAnchor && text.length < 12) return 'missing-relation-anchors';
  return '';
}

export function isAmericanIpa(value = '') {
  const text = String(value).trim();
  const isSingleIpa = (candidate) => {
    if (!/^\/[^/]+\/$/.test(candidate)) return false;
    const body = candidate.slice(1, -1);
    if (/[A-Z0-9_]/.test(body)) return false;
    return /^[a-zɑæʌɔəɚɝɛɜɪʊθðʃʒŋɡɹɾʔːˈˌ.\s/-]+$/u.test(body);
  };
  if (isSingleIpa(text)) return true;
  // A heteronym with one spelling may need separate POS-labelled readings.
  // Keep this deliberately narrow so prose cannot masquerade as IPA.
  const posLabel = '(?:动词|名词|形容词|副词)(?:/(?:动词|名词|形容词|副词))*';
  const variants = text.match(new RegExp(`^(\\/[^/]+\\/)（${posLabel}）；(\\/[^/]+\\/)（${posLabel}）$`, 'u'));
  return Boolean(variants && isSingleIpa(variants[1]) && isSingleIpa(variants[2]));
}

export function hasMultiplePrimaryStressesForSingleWord(spoken = '', ipa = '') {
  // A phrase may carry one primary stress per space-delimited word, but no
  // individual word/compound token should carry two primary marks. Earlier
  // component stress in compounds must be secondary.
  const variants = String(ipa).match(/\/[^/]+\//g) ?? [String(ipa)];
  return variants.some((variant) => variant
    .replace(/^\/|\/$/g, '')
    .split(/\s+/)
    .some((token) => (token.match(/ˈ/g) ?? []).length > 1));
}

function renderAmericanIpa(word, ipaFor, fallback = '') {
  // The content uses typographic apostrophes in learner-facing placeholders
  // (someone’s/one’s).  The CMU renderer expects ASCII apostrophes.
  const pronunciationText = String(word).replace(/[‘’]/g, "'");
  const rendered = isAmericanIpa(fallback) && /（(?:动词|名词)）/.test(fallback)
    ? fallback
    : typeof ipaFor === 'function' ? ipaFor(pronunciationText) : fallback;
  if (!isAmericanIpa(rendered)) {
    throw new Error(`Missing or invalid American IPA for relation word "${word}": ${rendered || '(empty)'}`);
  }
  return rendered;
}

function relationNoteKey(kind) {
  return kind === 'synonym' || kind === 'confusable' ? 'difference' : kind === 'antonym' ? 'usage' : 'note';
}

function isReviewedText(value = '') {
  return compact(value).length >= 12 && !containsForbiddenRelationText(value);
}

function baseContext(baseCollocation, baseWord) {
  const value = compact(baseCollocation);
  return value && !containsForbiddenRelationText(value) ? value : baseWord;
}

function generatedRelationNote({ kind, baseWord, baseChinese, baseCollocation, entry }) {
  const alternativeMeaning = firstMeaning(entry.chinese);
  const targetMeaning = firstMeaning(baseChinese);
  const context = baseContext(baseCollocation, baseWord);
  if (kind === 'synonym') {
    throw new Error(`Missing manually reviewed synonym distinction for ${baseWord} -> ${entry.word} (${alternativeMeaning}; ${targetMeaning}; ${context})`);
  }
  if (kind === 'antonym') {
    throw new Error(`Missing manually reviewed antonym explanation for ${baseWord} -> ${entry.word} (${alternativeMeaning}; ${targetMeaning}; ${context})`);
  }
  throw new Error(`Missing manually reviewed confusable distinction for ${baseWord} -> ${entry.word}`);
}

function normalizedRelationPartOfSpeech({ kind, basePartOfSpeech, entry, reviewed, ecdictEntries }) {
  const pairOverride = entry.pairOverride;
  if (pairOverride?.partOfSpeech) return canonicalizePartOfSpeech(pairOverride.partOfSpeech);
  const current = canonicalizePartOfSpeech(entry.partOfSpeech);
  const isPhrase = /\s/.test(entry.word.trim());
  if (isPhrase) return 'phr.';
  if (canonicalizePartOfSpeech(basePartOfSpeech).includes('aux.') && MODAL_AUXILIARIES.has(entry.word.toLowerCase())) return 'aux.';
  if (kind === 'confusable' && reviewed && current) return current;
  if (reviewed && current) return current;
  if (canonicalizePartOfSpeech(basePartOfSpeech).includes('v.') && dictionaryHasPartOfSpeech(entry.word, 'v.', ecdictEntries)) {
    return 'v.';
  }
  return current || (kind === 'synonym' || kind === 'antonym' ? 'v.' : 'word');
}

function relationGloss({ kind, baseWord, entry, partOfSpeech, reviewed, ecdictEntries }) {
  const override = entry.pairOverride ?? RELATION_SENSE_OVERRIDES[`${baseWord}|${kind}|${entry.word.toLowerCase()}`];
  if (override?.chinese) return override.chinese;
  if (partOfSpeech.includes('aux.') && MODAL_GLOSSES[entry.word.toLowerCase()]) return MODAL_GLOSSES[entry.word.toLowerCase()];
  if (kind !== 'confusable' && partOfSpeech.includes('v.') && VERB_GLOSS_OVERRIDES[entry.word.toLowerCase()]) {
    return VERB_GLOSS_OVERRIDES[entry.word.toLowerCase()];
  }
  if (reviewed && entry.chinese && !containsForbiddenRelationText(entry.chinese)) return compact(entry.chinese);
  return dictionaryGlossForPartOfSpeech(entry.word, partOfSpeech, ecdictEntries, entry.chinese);
}

/**
 * Normalize one relation array.  A curated confusable entry, when supplied,
 * wins field-by-field over generated content for the same word.
 */
export function normalizeRelationEntries({
  kind,
  baseWord,
  basePartOfSpeech = 'v.',
  baseChinese = '',
  baseCollocation = '',
  entries = [],
  ecdictEntries = {},
  curatedConfusable,
  ipaFor
}) {
  if (!['synonym', 'antonym', 'confusable'].includes(kind)) {
    throw new Error(`Unsupported relation kind: ${kind}`);
  }
  const curated = kind === 'confusable' && curatedConfusable?.word
    ? { ...curatedConfusable, word: curatedConfusable.word.trim() }
    : null;
  const builtInCurated = kind === 'confusable'
    ? Object.entries(CONFUSABLE_METADATA_OVERRIDES)
      .filter(([key]) => key.startsWith(`${baseWord.toLowerCase()}|`))
      .map(([, value]) => value)
    : [];
  const reviewedByWord = new Map(builtInCurated.map((entry) => [entry.word.toLowerCase(), entry]));
  if (curated) reviewedByWord.set(curated.word.toLowerCase(), curated);
  const reviewedCandidates = [...reviewedByWord.values()];
  const candidates = [
    ...reviewedCandidates,
    ...entries.filter((entry) => !reviewedByWord.has(entry.word?.toLowerCase()))
  ];
  const seen = new Set();
  const normalized = candidates
    .filter((entry) => entry?.word && entry.word.toLowerCase() !== baseWord.toLowerCase())
    .filter((entry) => {
      const word = entry.word.toLowerCase().trim();
      if (seen.has(word)) return false;
      seen.add(word);
      return true;
    })
    .map((rawEntry) => {
      const curatedEntry = reviewedByWord.get(rawEntry.word.toLowerCase());
      const isCurated = Boolean(curatedEntry);
      const pairOverride = RELATION_SENSE_OVERRIDES[`${baseWord}|${kind}|${rawEntry.word.toLowerCase()}`];
      const merged = curatedEntry ? { ...rawEntry, ...curatedEntry, pairOverride } : { ...rawEntry, pairOverride };
      const noteKey = relationNoteKey(kind);
      const reviewed = isCurated || isReviewedText(merged[noteKey]);
      const partOfSpeech = normalizedRelationPartOfSpeech({
        kind,
        basePartOfSpeech,
        entry: merged,
        reviewed,
        ecdictEntries
      });
      const chinese = relationGloss({
        kind,
        baseWord,
        entry: merged,
        partOfSpeech,
        reviewed: isCurated || (reviewed && !containsForbiddenRelationText(merged.chinese)),
        ecdictEntries
      });
      if (!chinese || containsForbiddenRelationText(chinese)) {
        throw new Error(`Missing reviewed ${kind} gloss for ${baseWord} -> ${merged.word}`);
      }
      const override = RELATION_SENSE_OVERRIDES[`${baseWord}|${kind}|${merged.word.toLowerCase()}`];
      const note = override?.note
        ?? (reviewed ? compact(merged[noteKey]) : generatedRelationNote({
          kind,
          baseWord,
          baseChinese,
          baseCollocation,
          entry: { ...merged, chinese, partOfSpeech, basePartOfSpeech: canonicalizePartOfSpeech(basePartOfSpeech) }
        }));
      const result = {
        word: merged.word.trim(),
        phonetic: renderAmericanIpa(merged.word, ipaFor, merged.phonetic),
        partOfSpeech,
        chinese,
        [noteKey]: note
      };
      assertRelationEntryQuality(result, kind, `${baseWord} -> ${result.word}`, baseWord);
      return result;
    });
  return normalized;
}

function derivativeRank(partOfSpeech = '') {
  const parts = canonicalizePartOfSpeech(partOfSpeech).split(' / ');
  const ranks = DERIVATIVE_POS_ORDER.map((part, index) => parts.includes(part) ? index : 99);
  return Math.min(...ranks);
}

export function normalizeDerivativeEntries({
  baseWord,
  entries = [],
  ecdictEntries = {},
  ipaFor
}) {
  const lowValue = entries.find((entry) => entry?.word && isLowValueDerivative(baseWord, entry.word));
  if (lowValue) throw new Error(`Low-value or misleading derivative: ${baseWord} -> ${lowValue.word}`);
  const seen = new Set();
  return entries
    .filter((entry) => entry?.word && entry.word.toLowerCase() !== baseWord.toLowerCase())
    .map((entry) => ({ ...entry, partOfSpeech: canonicalizePartOfSpeech(entry.partOfSpeech) }))
    .filter((entry) => derivativeRank(entry.partOfSpeech) < 99)
    .filter((entry) => {
      const word = entry.word.toLowerCase().trim();
      if (seen.has(word)) return false;
      seen.add(word);
      return true;
    })
    .map((entry) => {
      const chinese = entry.chinese && !containsForbiddenRelationText(entry.chinese)
        ? compact(entry.chinese)
        : dictionaryGlossForPartOfSpeech(entry.word, entry.partOfSpeech, ecdictEntries, '');
      if (!chinese) throw new Error(`Missing derivative gloss for ${baseWord} -> ${entry.word}`);
      const note = isReviewedText(entry.note)
        ? compact(entry.note)
        : `${entry.word} 是 ${baseWord} 的常用词族形式；作 ${entry.partOfSpeech} 时表示“${chinese}”。`;
      const result = {
        word: entry.word.trim(),
        phonetic: renderAmericanIpa(entry.word, ipaFor, entry.phonetic),
        partOfSpeech: entry.partOfSpeech,
        chinese,
        note
      };
      assertRelationEntryQuality(result, 'derivative', `${baseWord} -> ${result.word}`, baseWord);
      return result;
    })
    .sort((left, right) => derivativeRank(left.partOfSpeech) - derivativeRank(right.partOfSpeech));
}

export function assertRelationEntryQuality(entry, kind, label = entry.word, baseWord = '') {
  const noteKey = relationNoteKey(kind);
  const fields = [entry.chinese, entry[noteKey]];
  if (!entry.word || !entry.partOfSpeech || fields.some((value) => !compact(value))) {
    throw new Error(`Incomplete ${kind} relation: ${label}`);
  }
  if (fields.some(containsForbiddenRelationText)) {
    throw new Error(`Forbidden placeholder/generic relation text: ${label}`);
  }
  if (!isAmericanIpa(entry.phonetic)) {
    throw new Error(`Invalid American IPA: ${label} (${entry.phonetic})`);
  }
  const specificityIssue = relationNoteSpecificityIssue({
    baseWord,
    relationWord: entry.word,
    note: entry[noteKey],
    kind
  });
  if (specificityIssue) {
    throw new Error(`Relation note lacks a two-sided concrete distinction (${specificityIssue}): ${label}`);
  }
  return entry;
}

/** Normalize all four learner-facing relation sections of one card. */
export function normalizeCardRelations({
  card,
  sourceItem = {},
  ecdictEntries = {},
  curatedConfusable,
  ipaFor
}) {
  const baseWord = card.word ?? sourceItem.w;
  const basePartOfSpeech = card.partOfSpeech ?? sourceItem.p ?? 'v.';
  const baseChinese = card.coreMemory?.chinese ?? sourceItem.zh ?? '';
  const baseCollocation = card.fixedPhrases?.[0]?.phrase ?? sourceItem.coll ?? '';
  const common = { baseWord, basePartOfSpeech, baseChinese, baseCollocation, ecdictEntries, ipaFor };
  return {
    synonyms: normalizeRelationEntries({ ...common, kind: 'synonym', entries: card.synonyms ?? [] }),
    antonyms: normalizeRelationEntries({ ...common, kind: 'antonym', entries: card.antonyms ?? [] }),
    confusables: normalizeRelationEntries({
      ...common,
      kind: 'confusable',
      entries: card.confusables ?? [],
      curatedConfusable
    }),
    derivatives: normalizeDerivativeEntries({
      baseWord,
      entries: card.derivatives ?? [],
      ecdictEntries,
      ipaFor
    })
  };
}
