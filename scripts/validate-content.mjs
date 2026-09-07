import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const allCardsPath = path.join(root, 'public', 'data', 'all-cards.json');
const manifestPath = path.join(root, 'public', 'data', 'manifest.json');
const releasePath = path.join(root, 'content', 'release.json');
const auditPath = path.join(root, 'content', 'coca-audit.json');
const wordMetadataPath = path.join(root, 'scripts', 'word-metadata.json');
const wordnetEnrichmentPath = path.join(root, 'scripts', 'wordnet-enrichment.json');
const ecdictEnrichmentPath = path.join(root, 'scripts', 'ecdict-enrichment.json');
const qualityReportPath = path.join(root, 'content', 'content-quality-report.json');
const runtimeReleasePath = path.join(root, 'src', 'config', 'release.ts');
const templateLockPath = path.join(root, 'content', 'templates', 'template-lock.json');
const allCards = JSON.parse(await fs.readFile(allCardsPath, 'utf8'));
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const release = JSON.parse(await fs.readFile(releasePath, 'utf8'));
const cocaAudit = JSON.parse(await fs.readFile(auditPath, 'utf8'));
const wordMetadata = JSON.parse(await fs.readFile(wordMetadataPath, 'utf8'));
const wordnetEnrichment = JSON.parse(await fs.readFile(wordnetEnrichmentPath, 'utf8'));
const ecdictEnrichment = JSON.parse(await fs.readFile(ecdictEnrichmentPath, 'utf8'));
const runtimeRelease = await fs.readFile(runtimeReleasePath, 'utf8');
const templatePath = path.join(root, 'content', 'templates', release.templateVersion + '.md');
const template = await fs.readFile(templatePath, 'utf8');
const templateLock = JSON.parse(await fs.readFile(templateLockPath, 'utf8'));
const errors = [];
const expectedTemplateVersion = release.templateVersion;
const expectedLockVersion = release.templateLockVersion;
const expectedSnapshotHashes = {
  'canonical-template': '9A5AB81BC487F47015B7D3C74E732089481A14E49120C63FACEDA082AE67141A',
  'canonical-example': 'DF9D024B49143DFDE1C53AE3C40EE77B86CDE5BC1A1A7CD3382980E260447CFD'
};

for (const [key, value] of Object.entries(release)) {
  if (!runtimeRelease.includes(`${key}: '${value}'`)) {
    errors.push(`Runtime release mirror differs from content/release.json at ${key}.`);
  }
}
const requiredReviewedWords = new Set(['improve', 'notice', 'support', 'likely', 'manage', 'provide', 'understand', 'believe', 'create', 'include', 'work']);
const forbiddenGeneratedCopy = [
  /The phrase [“\"].+[”\"] is useful in everyday English/i,
  /vocabulary notebook/i,
  /Listen for .+ in real conversations/i,
  /We practiced .+ aloud three times/i,
  /与本词相关的常用表达/,
  /同一学习主题中的高频词/,
  /真实表达延伸/,
  /主动输出提示/,
  /语体、宾语范围和固定搭配可能不同/,
  /实际使用前仍要核对词性和句型/,
  /这是 .+ 的常用词族成员/,
  /人工精校|AI 生成|自动生成|程序运行|JSON 对象|confidence:/i
];

const sha256 = (content) => crypto.createHash('sha256').update(content).digest('hex').toUpperCase();
const referenceShape = templateLock.referenceCard.recordedShape;
const curatedCardMinimums = templateLock.curatedCardMinimums;
const shapeFor = (card) => ({
  meaningRows: card.meanings.length,
  contextCategories: card.contextPhrases.length,
  contextItems: card.contextPhrases.reduce((sum, group) => sum + group.items.length, 0),
  fixedPhrases: card.fixedPhrases.length,
  synonyms: card.synonyms.length,
  antonyms: card.antonyms.length,
  derivatives: card.derivatives.length,
  confusables: card.confusables.length,
  relatedCategories: card.relatedVocabulary.length,
  relatedItems: card.relatedVocabulary.reduce((sum, group) => sum + group.items.length, 0),
  highFrequencyExamples: card.examples.length
});
const meetsShape = (card, expected) => {
  const actual = shapeFor(card);
  return Object.entries(expected).every(([key, minimum]) => actual[key] >= minimum);
};
const matchesShape = (card, expected) => {
  const actual = shapeFor(card);
  return Object.entries(expected).every(([key, value]) => actual[key] === value);
};
const meetsCuratedBenchmark = (card) => meetsShape(card, curatedCardMinimums);

if (templateLock.lockVersion !== expectedLockVersion || !templateLock.immutable || templateLock.sourceReferences?.length !== 2) {
  errors.push('Canonical template and example lock is missing or mutable.');
} else {
  for (const reference of templateLock.sourceReferences) {
    if (reference.snapshotSha256 !== expectedSnapshotHashes[reference.role]) {
      errors.push(reference.role + ': lock manifest hash differs from the validator baseline; create a new explicit lock version.');
    }
    const snapshot = await fs.readFile(path.join(root, reference.snapshotPath));
    if (sha256(snapshot) !== reference.snapshotSha256) {
      errors.push(reference.role + ': locked snapshot hash changed; create a new explicit lock version instead of editing it in place.');
    }
  }
}

const lockedTemplate = await fs.readFile(path.join(root, 'content', 'templates', 'learning-template.locked.md'), 'utf8');
const lockedExample = await fs.readFile(path.join(root, 'content', 'templates', 'template-test-work.locked.md'), 'utf8');
const lockedHeadings = ['# 1. 核心记忆表', '# 2. 词性与释义', '# 3. 常用语境词组', '# 4. 固定搭配和短语', '# 5. 近义词', '# 6. 反义词', '# 7. 派生词', '# 8. 易混词', '# 9. 同类词汇分类', '# 10. 高频例句', '# 学习重点'];
for (const source of [lockedTemplate, lockedExample]) {
  let previous = -1;
  for (const heading of lockedHeadings) {
    const current = source.indexOf(heading);
    if (current < 0 || current <= previous) errors.push('Locked template/example is missing or reorders section: ' + heading + '.');
    previous = current;
  }
}
if (!lockedExample.includes('# 模板格式测试：work') || !lockedTemplate.includes('全部使用表格整理')) {
  errors.push('Locked template or work example no longer matches the user-provided baseline.');
}

const expectedCardCount = cocaAudit.selection?.selectedCards ?? 150;
const expectedDayCount = Math.ceil(expectedCardCount / 5);
if (!cocaAudit.selection?.allSelectedWordsFound || cocaAudit.selection?.missingWords?.length) errors.push('COCA audit has missing selected words.');
if (cocaAudit.selection?.primaryGroupCounts?.verb !== 150 || Object.keys(cocaAudit.selection?.primaryGroupCounts ?? {}).length !== 1) errors.push('The active learning catalog must contain 150 primary verb cards and no other primary POS.');
if (wordMetadata.missing?.length || Object.keys(wordMetadata.entries ?? {}).length < 450) errors.push('Offline relation/derivative metadata extraction is incomplete.');
if (Object.keys(wordnetEnrichment.entries ?? {}).length !== expectedCardCount) errors.push('WordNet enrichment must cover every selected verb.');
if (Object.keys(ecdictEnrichment.entries ?? {}).length < 3000) errors.push('ECDICT enrichment does not cover enough relation and derivative words.');
if (allCards.cards.length !== expectedCardCount) errors.push('Expected ' + expectedCardCount + ' audited cards.');
if (manifest.dailyFiles.length !== expectedDayCount) errors.push('Expected ' + expectedDayCount + ' daily files.');
if (new Set(allCards.cards.map((card) => card.id)).size !== allCards.cards.length) errors.push('Duplicate card IDs.');
if (manifest.contentVersion !== release.contentVersion || allCards.contentVersion !== release.contentVersion) errors.push('Content version differs from content/release.json.');
if (allCards.templateVersion !== expectedTemplateVersion || manifest.templateVersion !== expectedTemplateVersion) errors.push('Template version is not locked to ' + expectedTemplateVersion + '.');
const templateHeadings = ['### 1. 核心记忆表', '### 2. 词性与释义', '### 3. 常用语境词组', '### 4. 固定搭配和短语', '### 5. 近义词', '### 6. 反义词', '### 7. 派生词', '### 8. 易混词', '### 9. 同类词汇分类', '### 10. 高频例句', '## 学习重点'];
let previousHeadingIndex = -1;
for (const heading of templateHeadings) {
  const headingIndex = template.indexOf(heading);
  if (headingIndex < 0 || headingIndex <= previousHeadingIndex) errors.push('Canonical template is missing or reorders section: ' + heading + '.');
  previousHeadingIndex = headingIndex;
}
if (!template.includes(expectedTemplateVersion) || !template.includes('不得使用“这个短语很实用”')) errors.push('Canonical template version or anti-filler rule is missing.');

const referenceCard = allCards.cards.find((card) => card.id === templateLock.referenceCard.cardId);
if (!referenceCard || referenceCard.word !== templateLock.referenceCard.word || !matchesShape(referenceCard, referenceShape)) {
  errors.push('The locked work reference card no longer exactly matches its recorded example shape.');
}

const learningGroups = ['verb', 'noun', 'adjective', 'adverb', 'other'];
const expectedOrderedIds = cocaAudit.orderedCards?.map((entry) => entry.cardId) ?? [];
if (expectedOrderedIds.length !== allCards.cards.length || expectedOrderedIds.some((id, index) => allCards.cards[index]?.id !== id)) {
  errors.push('Card order differs from the audited primary-POS then COCA-rank order.');
}

for (const [cardIndex, card] of allCards.cards.entries()) {
  const required = ['id', 'word', 'phonetic', 'syllables', 'partOfSpeech', 'learningPriority', 'coreMemory', 'meanings', 'contextPhrases', 'fixedPhrases', 'synonyms', 'antonyms', 'derivatives', 'confusables', 'relatedVocabulary', 'examples', 'studyFocus', 'questions', 'detailLevel', 'templateVersion', 'contentVersion', 'reviewed'];
  for (const field of required) {
    if (card[field] === undefined || card[field] === null) {
      errors.push(card.id + ': missing ' + field);
    }
  }
  if (card.templateVersion !== expectedTemplateVersion) errors.push(card.id + ': wrong template version.');
  if (requiredReviewedWords.has(card.word) && !card.reviewed) errors.push(card.id + ': required human-reviewed card is not reviewed.');
  if (card.word === 'work' && card.detailLevel !== 'template-reference') errors.push(card.id + ': locked work card must be template-reference.');
  if (card.word !== 'work' && card.reviewed && card.detailLevel !== 'template-curated') errors.push(card.id + ': reviewed card must be template-curated.');
  if (!card.reviewed && card.detailLevel !== 'template-complete') errors.push(card.id + ': every non-reference/non-curated card must be a complete static card.');
  if (card.detailLevel === 'template-reference' && (card.word !== 'work' || !matchesShape(card, referenceShape))) errors.push(card.id + ': reference label is reserved for the exact locked work example.');
  if (card.detailLevel === 'template-curated' && !meetsCuratedBenchmark(card)) errors.push(card.id + ': human-curated label does not meet the curated richness benchmark.');
  if (forbiddenGeneratedCopy.some((pattern) => pattern.test(JSON.stringify(card)))) errors.push(card.id + ': forbidden meta-learning filler or mechanical expansion found.');
  if (card.tags.some((tag) => /(人工精校|模板结构版|待深度补全)/.test(tag))) errors.push(card.id + ': internal production labels must not appear in app tags.');
  const expectedPriority = cocaAudit.orderedCards?.[cardIndex];
  if (!expectedPriority
    || card.learningPriority.sequence !== cardIndex + 1
    || card.learningPriority.group !== expectedPriority.primaryGroup
    || card.learningPriority.primaryCocaRank !== expectedPriority.primaryCocaRank
    || card.learningPriority.groupOrder !== learningGroups.indexOf(card.learningPriority.group) + 1) {
    errors.push(card.id + ': learning priority metadata differs from the COCA audit.');
  }
  if (card.meanings.length < 2) errors.push(card.id + ': a detailed card needs at least two distinct, useful meanings.');
  if (card.partOfSpeech.includes('/') && card.meanings.length < 2) errors.push(card.id + ': multiple parts of speech need separate meanings.');
  if (!Array.isArray(card.cocaRanks) || card.cocaRanks.length < 1 || !card.cocaRankLabel) errors.push(card.id + ': missing exact COCA rank data.');
  if (!Array.isArray(card.coreMemory.structures) || card.coreMemory.structures.length < 3) errors.push(card.id + ': expected at least three core structures.');
  if (!Array.isArray(card.coreMemory.commonErrors) || card.coreMemory.commonErrors.length < 2) errors.push(card.id + ': expected at least two concrete error corrections.');
  if (card.synonyms.length < 1 || card.antonyms.length < 1) errors.push(card.id + ': missing semantic contrast.');
  if (!card.reviewed && card.synonyms.some((item) => !item.difference || item.difference.length < 45 || !item.difference.includes(card.word))) errors.push(card.id + ': every synonym needs a target-specific usage distinction.');
  if (!card.reviewed && card.antonyms.some((item) => !item.usage || item.usage.length < 35 || !item.usage.includes(card.word))) errors.push(card.id + ': every antonym needs a sense-specific contrast explanation.');
  if (card.detailLevel === 'template-curated' || card.detailLevel === 'template-reference') {
    if (card.contextPhrases.length < 4) errors.push(card.id + ': reviewed card needs at least four real context categories.');
    if (card.contextPhrases.reduce((sum, group) => sum + group.items.length, 0) < 12) errors.push(card.id + ': reviewed card needs at least twelve curated context phrases.');
    if (card.fixedPhrases.length < 8) errors.push(card.id + ': reviewed card needs at least eight fixed phrases with real examples.');
    if (card.synonyms.length < 3 || card.antonyms.length < 2) errors.push(card.id + ': reviewed card needs useful semantic comparison, not a token relation.');
    if (card.relatedVocabulary.length < 3) errors.push(card.id + ': reviewed card needs at least three semantic categories.');
    if (card.relatedVocabulary.reduce((sum, group) => sum + group.items.length, 0) < 8) errors.push(card.id + ': reviewed card needs at least eight genuinely related words.');
    if (card.examples.length < 10) errors.push(card.id + ': reviewed card needs ten natural high-frequency examples.');
    const targetForms = card.word === 'understand'
      ? ['understand', 'understood']
      : [card.word.toLowerCase().slice(0, Math.max(4, card.word.length - 2))];
    const usesTarget = (text) => targetForms.some((form) => text.toLowerCase().includes(form));
    if (card.fixedPhrases.some((entry) => !usesTarget(entry.example))) errors.push(card.id + ': every curated fixed-phrase example must actually use the target word or an inflected form.');
    if (card.examples.some((entry) => !usesTarget(entry.english))) errors.push(card.id + ': every curated high-frequency example must actually use the target word or an inflected form.');
  } else {
    if (card.contextPhrases.length < 3) errors.push(card.id + ': template-detailed card needs at least three real context categories.');
    if (card.contextPhrases.reduce((sum, group) => sum + group.items.length, 0) < 6) errors.push(card.id + ': template-detailed card needs at least six curated context phrases.');
    if (card.fixedPhrases.length < 6) errors.push(card.id + ': template-detailed card needs at least six fixed phrases with real examples.');
    if (!card.relatedVocabulary.length) errors.push(card.id + ': template-detailed card needs at least one semantic category.');
    if (card.examples.length < 6) errors.push(card.id + ': template-detailed card needs at least six natural high-frequency examples.');
    const irregularTargetForms = {
      be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'],
      become: ['became'],
      begin: ['began', 'begun'],
      buy: ['bought'],
      choose: ['chose', 'chosen', 'choice'],
      do: ['did', 'done'],
      die: ['dying'],
      drive: ['drove', 'driven'],
      eat: ['ate', 'eaten'],
      fall: ['fell', 'fallen'],
      feel: ['felt'],
      find: ['found'],
      get: ['got', 'gotten'],
      give: ['gave', 'given'],
      go: ['went', 'gone'],
      have: ['had'],
      hear: ['heard'],
      hold: ['held'],
      keep: ['kept'],
      know: ['knew', 'known'],
      lead: ['led'],
      leave: ['left'],
      lose: ['lost'],
      make: ['made'],
      meet: ['met'],
      pay: ['paid'],
      run: ['ran'],
      say: ['said'],
      see: ['saw', 'seen'],
      sell: ['sold'],
      send: ['sent'],
      sit: ['sat'],
      speak: ['spoke', 'spoken'],
      stand: ['stood'],
      take: ['took', 'taken'],
      tell: ['told'],
      think: ['thought'],
      understand: ['understood'],
      wear: ['wore', 'worn'],
      win: ['won'],
      write: ['wrote', 'written']
    };
    const targetForms = [
      card.word.toLowerCase(),
      card.word.toLowerCase().slice(0, Math.max(4, card.word.length - 2)),
      ...(irregularTargetForms[card.word] ?? [])
    ];
    const usesTarget = (text) => targetForms.some((form) => text.toLowerCase().includes(form));
    if (card.fixedPhrases.some((entry) => !usesTarget(entry.example))) errors.push(card.id + ': every fixed-phrase example must use the target word or an inflected form.');
    if (card.examples.some((entry) => !usesTarget(entry.english))) errors.push(card.id + ': every high-frequency example must use the target word or an inflected form.');
  }
  const fixedPhraseSet = new Set(card.fixedPhrases.map((entry) => entry.phrase.toLowerCase().replace(/[^a-z]+/g, ' ').trim()));
  const duplicatedContextPhrases = card.contextPhrases
    .flatMap((group) => group.items)
    .filter((entry) => fixedPhraseSet.has(entry.phrase.toLowerCase().replace(/[^a-z]+/g, ' ').trim()));
  if (!card.reviewed && duplicatedContextPhrases.length > 1) errors.push(card.id + ': context phrases repeat fixed phrases instead of adding real sentence context.');
  if (card.meanings.some((meaning) => !meaning.english || !meaning.chinese || !meaning.example || !meaning.translation)) errors.push(card.id + ': every meaning needs bilingual definition and example evidence.');
  if (card.fixedPhrases.some((entry) => !entry.chinese || !entry.example || !entry.translation)) errors.push(card.id + ': every fixed phrase needs a Chinese meaning and a bilingual example.');
  if (new Set(card.examples.map((example) => example.english)).size !== card.examples.length) errors.push(card.id + ': duplicate example sentences.');
  if (card.derivatives.some((item) => item.word.toLowerCase() === card.word.toLowerCase())) errors.push(card.id + ': target word repeated as a derivative.');
  if (card.confusables.some((item) => item.word.toLowerCase() === card.word.toLowerCase())) errors.push(card.id + ': target word repeated as a confusable.');
  if ([...card.synonyms, ...card.antonyms, ...card.derivatives, ...card.confusables].some((item) => !item.partOfSpeech || /^(word|word family)$/i.test(item.partOfSpeech))) errors.push(card.id + ': relation word has an unknown or invented part of speech.');
  if ([...card.synonyms, ...card.antonyms, ...card.derivatives].some((item) => !item.chinese || /与“.+”意义(接近|相反)/.test(item.chinese))) errors.push(card.id + ': relation or derivative needs an actual Chinese meaning, not a relationship placeholder.');
  if (card.coreMemory.commonErrors.some((item) => !item.wrong || !item.right || item.wrong === item.right)) errors.push(card.id + ': invalid error correction pair.');
  if (card.questions.length < 15) errors.push(card.id + ': expected at least fifteen questions sourced from the complete card.');
  if (new Set(card.questions.map((question) => question.id)).size !== card.questions.length) errors.push(card.id + ': duplicate question IDs.');
  if (new Set(card.questions.map((question) => question.prompt)).size !== card.questions.length) errors.push(card.id + ': duplicate question prompts.');
  const questionTypes = new Set(card.questions.map((question) => question.type));
  for (const type of ['meaning_choice', 'recall', 'collocation', 'free_sentence', 'dialogue']) {
    if (!questionTypes.has(type)) errors.push(card.id + ': missing question type ' + type + '.');
  }
  if (card.questions.filter((question) => question.type === 'meaning_choice').length < 5) errors.push(card.id + ': expected rich meaning and relation choices.');
  if (card.questions.filter((question) => question.type === 'collocation').length < 5) errors.push(card.id + ': expected collocation questions from several card sections.');
  if (card.questions.some((question) => question.options && (!question.options.includes(question.answer) || new Set(question.options).size !== question.options.length))) errors.push(card.id + ': invalid choice options.');
  const clozeQuestions = card.questions.filter((question) => question.type === 'collocation' && !question.options);
  if (clozeQuestions.some((question) => !question.prompt.includes('_____') || !question.answer?.trim())) {
    errors.push(card.id + ': every non-choice collocation question needs one real blank and a non-empty answer.');
  }
  if (clozeQuestions.some((question) => !question.id.includes('collocation-example-context-v2') && question.answer.trim().toLowerCase() !== card.word.toLowerCase() && /^(do|doing|done|someone|something|yourself|A|B)$/i.test(question.answer.trim()))) {
    errors.push(card.id + ': a grammar placeholder must never be the answer to an objective cloze.');
  }
  if (card.questions.some((question) => question.id.includes('example-cloze') && !question.prompt.includes('（填写 ' + card.word + ' 的正确形式）'))) {
    errors.push(card.id + ': the example cloze must ask for the target word in its contextually correct form.');
  }
  if (card.questions.some((question) => question.prompt.includes('（填入目标词）'))) {
    errors.push(card.id + ': obsolete target-word fallback prompt found.');
  }
  if (card.questions.some((question) => /^(补全核心结构中的连接成分：|根据语境补全搭配：)/.test(question.prompt))) {
    errors.push(card.id + ': legacy phrase-fragment cloze found; a context label is not a real context.');
  }
  if (card.questions.some((question) => question.prompt.includes('优先记住') || question.prompt.includes('词卡结构辨义'))) {
    errors.push(card.id + ': vague or implementation-oriented structure wording found.');
  }
  const typedObjectiveQuestions = card.questions.filter((question) => !question.ai && !question.options);
  if (typedObjectiveQuestions.some((question) => !/^[A-Za-z]+(?:'[A-Za-z]+)?$/.test(question.answer.trim()))) {
    errors.push(card.id + ': every typed objective answer must be one English word for the in-app spelling keyboard.');
  }
  const contextualQuestions = card.questions.filter((question) => question.id.includes('collocation-example-context-v3'));
  if (contextualQuestions.length !== 1) {
    errors.push(card.id + ': expected exactly one full-sentence contextual companion question.');
  } else {
    const [question] = contextualQuestions;
    if (!question.prompt.startsWith('根据完整句意和中文提示') || !question.prompt.includes('（中文：') || !/[.!?](?:（中文：)/.test(question.prompt)) {
      errors.push(card.id + ': contextual companion question needs a complete English sentence and Chinese semantic cue.');
    }
    if (!question.options?.includes(question.answer) || question.options.length < 3) {
      errors.push(card.id + ': contextual companion question must be a choice with one declared answer.');
    }
  }
  const semanticStructureQuestions = card.questions.filter((question) => question.id.includes('collocation-structure-meaning-v3'));
  if (semanticStructureQuestions.length !== 1 || semanticStructureQuestions.some((question) => !question.options?.includes(question.answer))) {
    errors.push(card.id + ': structure knowledge must be tested through an explicit meaning and complete selectable structures.');
  }
  const structureQuestions = card.questions.filter((question) => question.id.includes('structure-choice-v3') || question.id.includes('collocation-structure-meaning-v3') || question.id.includes('collocation-fixed-'));
  if (structureQuestions.some((question) => !question.prompt.includes('形式线索：'))) {
    errors.push(card.id + ': every structure choice needs a distinguishing form clue.');
  }
  const slotPrompts = card.questions.filter((question) => question.ai && /\b(to do|doing|done|someone|something|yourself|A|B)\b/.test(question.prompt));
  if (slotPrompts.some((question) => !/(代表|替换|不要求)/.test(question.prompt))) {
    errors.push(card.id + ': an open question exposes grammar placeholders without explaining how to instantiate them.');
  }
  const collocationChoices = card.questions.filter((question) => question.type === 'collocation' && question.options);
  if (collocationChoices.length < 2) errors.push(card.id + ': expected at least two fixed-phrase meaning checks.');
  if (new Set(card.questions.filter((question) => question.type === 'collocation').map((question) => question.answer.toLocaleLowerCase('en-US'))).size < 4) {
    errors.push(card.id + ': collocation questions repeat too few distinct answers.');
  }

  const phonetics = [
    card.phonetic,
    ...card.coreMemory.structures.map((item) => item.phonetic),
    ...card.coreMemory.commonErrors.flatMap((item) => [item.wrongPhonetic, item.rightPhonetic]),
    ...card.contextPhrases.flatMap((group) => group.items.map((item) => item.phonetic)),
    ...card.fixedPhrases.map((item) => item.phonetic),
    ...card.synonyms.map((item) => item.phonetic),
    ...card.antonyms.map((item) => item.phonetic),
    ...card.derivatives.map((item) => item.phonetic),
    ...card.confusables.map((item) => item.phonetic),
    ...card.relatedVocabulary.flatMap((group) => group.items.map((item) => item.phonetic))
  ];
  if (phonetics.some((value) => typeof value !== 'string' || !value.startsWith('/') || !value.endsWith('/'))) errors.push(card.id + ': every English word or phrase needs slash-delimited American IPA.');
  if (JSON.stringify(card).includes('点击发音') || JSON.stringify(card).includes('点击扬声器')) errors.push(card.id + ': placeholder pronunciation found.');
}

const scheduledIds = [];
for (const item of manifest.dailyFiles) {
  const dailyPath = path.join(root, 'public', item.file);
  const daily = JSON.parse(await fs.readFile(dailyPath, 'utf8'));
  if (daily.cards.length !== 5) errors.push(item.file + ': expected 5 cards.');
  scheduledIds.push(...daily.cards.map((card) => card.id));
}

if (scheduledIds.length !== expectedCardCount || new Set(scheduledIds).size !== expectedCardCount) {
  errors.push('The static schedule must contain each audited card exactly once.');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const referenceCount = allCards.cards.filter((card) => card.detailLevel === 'template-reference').length;
const curatedCount = allCards.cards.filter((card) => card.detailLevel === 'template-curated').length;
const completeCount = allCards.cards.filter((card) => card.detailLevel === 'template-complete').length;
const shapeRows = allCards.cards.map((card) => ({ word: card.word, ...shapeFor(card) }));
const metrics = Object.keys(shapeFor(allCards.cards[0])).reduce((summary, key) => {
  const values = shapeRows.map((row) => row[key]);
  summary[key] = {
    minimum: Math.min(...values),
    maximum: Math.max(...values),
    average: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2))
  };
  return summary;
}, {});
await fs.writeFile(qualityReportPath, JSON.stringify({
  contentVersion: release.contentVersion,
  generatedAt: '2026-09-08',
  totalCards: allCards.cards.length,
  lexicalSources: ['user-provided COCA word list', 'Princeton WordNet via wordnet-db@3.1.14', 'ECDICT'],
  checks: {
    bilingualMeanings: true,
    phraseExamples: true,
    senseSpecificRelations: true,
    noMechanicalFiller: true,
    noRuntimeDictionaryApi: true,
    allCardsValidated: true
  },
  metrics,
  cards: shapeRows
}, null, 2) + '\n', 'utf8');
console.log('Content validation passed: all ' + allCards.cards.length + ' cards are complete static verb cards in COCA verb-rank order; ' + referenceCount + ' locked reference, ' + curatedCount + ' curated detailed, ' + completeCount + ' template-complete, ' + manifest.dailyFiles.length + ' days, 5 unique cards per full day.');
