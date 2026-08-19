import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const allCardsPath = path.join(root, 'public', 'data', 'all-cards.json');
const manifestPath = path.join(root, 'public', 'data', 'manifest.json');
const templatePath = path.join(root, 'content', 'templates', 'learning-template-2026.08.19.1.md');
const allCards = JSON.parse(await fs.readFile(allCardsPath, 'utf8'));
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const template = await fs.readFile(templatePath, 'utf8');
const errors = [];
const expectedTemplateVersion = 'learning-template-2026.08.19.1';
const requiredReviewedWords = new Set(['improve', 'notice', 'support', 'likely', 'manage', 'provide', 'understand', 'believe', 'create', 'include', 'work']);
const forbiddenGeneratedCopy = [
  /The phrase [“\"].+[”\"] is useful in everyday English/i,
  /vocabulary notebook/i,
  /Listen for .+ in real conversations/i,
  /We practiced .+ aloud three times/i,
  /与本词相关的常用表达/,
  /同一学习主题中的高频词/,
  /真实表达延伸/,
  /主动输出提示/
];

if (allCards.cards.length !== 150) errors.push('Expected 150 cards.');
if (manifest.dailyFiles.length !== 30) errors.push('Expected 30 daily files.');
if (new Set(allCards.cards.map((card) => card.id)).size !== allCards.cards.length) errors.push('Duplicate card IDs.');
if (allCards.templateVersion !== expectedTemplateVersion || manifest.templateVersion !== expectedTemplateVersion) errors.push('Template version is not locked to ' + expectedTemplateVersion + '.');
const templateHeadings = ['### 1. 核心记忆表', '### 2. 词性与释义', '### 3. 常用语境词组', '### 4. 固定搭配和短语', '### 5. 近义词', '### 6. 反义词', '### 7. 派生词', '### 8. 易混词', '### 9. 同类词汇分类', '### 10. 高频例句', '## 学习重点'];
let previousHeadingIndex = -1;
for (const heading of templateHeadings) {
  const headingIndex = template.indexOf(heading);
  if (headingIndex < 0 || headingIndex <= previousHeadingIndex) errors.push('Canonical template is missing or reorders section: ' + heading + '.');
  previousHeadingIndex = headingIndex;
}
if (!template.includes(expectedTemplateVersion) || !template.includes('不得使用“这个短语很实用”')) errors.push('Canonical template version or anti-filler rule is missing.');

for (const card of allCards.cards) {
  const required = ['id', 'word', 'phonetic', 'syllables', 'partOfSpeech', 'coreMemory', 'meanings', 'contextPhrases', 'fixedPhrases', 'synonyms', 'antonyms', 'derivatives', 'confusables', 'relatedVocabulary', 'examples', 'studyFocus', 'questions', 'templateVersion', 'contentVersion', 'reviewed'];
  for (const field of required) {
    if (card[field] === undefined || card[field] === null) {
      errors.push(card.id + ': missing ' + field);
    }
  }
  if (card.templateVersion !== expectedTemplateVersion) errors.push(card.id + ': wrong template version.');
  if (requiredReviewedWords.has(card.word) && (!card.reviewed || card.detailLevel !== 'template-complete')) errors.push(card.id + ': required human-reviewed card is not template-complete.');
  if (card.detailLevel !== 'template-complete') errors.push(card.id + ': every published card must be template-complete.');
  if (forbiddenGeneratedCopy.some((pattern) => pattern.test(JSON.stringify(card)))) errors.push(card.id + ': forbidden meta-learning filler or mechanical expansion found.');
  if (card.tags.includes('人工精校') !== card.reviewed) errors.push(card.id + ': review tag does not match reviewed status.');
  if (!card.reviewed && !card.tags.includes('模板详卡')) errors.push(card.id + ': detailed template card tag is missing.');
  if (card.meanings.length < 1) errors.push(card.id + ': expected at least one meaning.');
  if (card.partOfSpeech.includes('/') && card.meanings.length < 2) errors.push(card.id + ': multiple parts of speech need separate meanings.');
  if (!Array.isArray(card.cocaRanks) || card.cocaRanks.length < 1 || !card.cocaRankLabel) errors.push(card.id + ': missing exact COCA rank data.');
  if (!Array.isArray(card.coreMemory.structures) || card.coreMemory.structures.length < 3) errors.push(card.id + ': expected at least three core structures.');
  if (!Array.isArray(card.coreMemory.commonErrors) || card.coreMemory.commonErrors.length < 2) errors.push(card.id + ': expected at least two concrete error corrections.');
  if (card.synonyms.length < 1 || card.antonyms.length < 1) errors.push(card.id + ': missing semantic contrast.');
  if (card.reviewed) {
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
      become: ['became'],
      choose: ['chose', 'chosen', 'choice'],
      speak: ['spoke', 'spoken'],
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
  if (new Set(card.examples.map((example) => example.english)).size !== card.examples.length) errors.push(card.id + ': duplicate example sentences.');
  if (card.derivatives.some((item) => item.word.toLowerCase() === card.word.toLowerCase())) errors.push(card.id + ': target word repeated as a derivative.');
  if (card.confusables.some((item) => item.word.toLowerCase() === card.word.toLowerCase())) errors.push(card.id + ': target word repeated as a confusable.');
  if ([...card.synonyms, ...card.antonyms, ...card.derivatives, ...card.confusables].some((item) => !item.partOfSpeech || /^(word|word family)$/i.test(item.partOfSpeech))) errors.push(card.id + ': relation word has an unknown or invented part of speech.');
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
  if (clozeQuestions.some((question) => !question.id.includes('collocation-example-context-v2') && /^(do|doing|done|someone|something|yourself|A|B)$/i.test(question.answer.trim()))) {
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

if (scheduledIds.length !== 150 || new Set(scheduledIds).size !== 150) {
  errors.push('The 30-day schedule must contain each card exactly once.');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Content validation passed: all ' + allCards.cards.length + ' cards are template-complete (' + allCards.cards.filter((card) => card.reviewed).length + ' manually curated, ' + allCards.cards.filter((card) => !card.reviewed).length + ' template-detailed), 30 days, 5 unique cards per day.');
