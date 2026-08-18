import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const allCardsPath = path.join(root, 'public', 'data', 'all-cards.json');
const manifestPath = path.join(root, 'public', 'data', 'manifest.json');
const allCards = JSON.parse(await fs.readFile(allCardsPath, 'utf8'));
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const errors = [];

if (allCards.cards.length !== 150) errors.push('Expected 150 cards.');
if (manifest.dailyFiles.length !== 30) errors.push('Expected 30 daily files.');
if (new Set(allCards.cards.map((card) => card.id)).size !== allCards.cards.length) errors.push('Duplicate card IDs.');

for (const card of allCards.cards) {
  const required = ['id', 'word', 'phonetic', 'syllables', 'partOfSpeech', 'coreMemory', 'meanings', 'contextPhrases', 'fixedPhrases', 'synonyms', 'antonyms', 'derivatives', 'confusables', 'relatedVocabulary', 'examples', 'studyFocus', 'questions'];
  for (const field of required) {
    if (card[field] === undefined || card[field] === null) {
      errors.push(card.id + ': missing ' + field);
    }
  }
  if (card.meanings.length < 1) errors.push(card.id + ': expected at least one meaning.');
  if (card.partOfSpeech.includes('/') && card.meanings.length < 2) errors.push(card.id + ': multiple parts of speech need separate meanings.');
  if (card.detailLevel !== 'template-complete') errors.push(card.id + ': card is not marked template-complete.');
  if (!Array.isArray(card.cocaRanks) || card.cocaRanks.length < 1 || !card.cocaRankLabel) errors.push(card.id + ': missing exact COCA rank data.');
  if (!Array.isArray(card.coreMemory.structures) || card.coreMemory.structures.length < 3) errors.push(card.id + ': expected at least three core structures.');
  if (!Array.isArray(card.coreMemory.commonErrors) || card.coreMemory.commonErrors.length < 2) errors.push(card.id + ': expected at least two concrete error corrections.');
  if (card.contextPhrases.length < 4) errors.push(card.id + ': expected four context categories.');
  if (card.contextPhrases.reduce((sum, group) => sum + group.items.length, 0) < 12) errors.push(card.id + ': expected at least twelve context phrases.');
  if (card.fixedPhrases.length < 8) errors.push(card.id + ': expected at least eight fixed phrases or usage frames.');
  if (card.synonyms.length < 1 || card.antonyms.length < 1) errors.push(card.id + ': missing semantic contrast.');
  if (card.relatedVocabulary.length < 3) errors.push(card.id + ': expected at least three related-vocabulary categories.');
  if (card.relatedVocabulary.reduce((sum, group) => sum + group.items.length, 0) < 8) errors.push(card.id + ': expected at least eight related words.');
  if (card.examples.length < 10) errors.push(card.id + ': expected ten learning-scene examples.');
  if (new Set(card.examples.map((example) => example.english)).size !== card.examples.length) errors.push(card.id + ': duplicate example sentences.');
  if (card.derivatives.some((item) => item.word.toLowerCase() === card.word.toLowerCase())) errors.push(card.id + ': target word repeated as a derivative.');
  if (card.confusables.some((item) => item.word.toLowerCase() === card.word.toLowerCase())) errors.push(card.id + ': target word repeated as a confusable.');
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
  if (clozeQuestions.some((question) => /^(do|doing|done|someone|something|yourself|A|B)$/i.test(question.answer.trim()))) {
    errors.push(card.id + ': a grammar placeholder must never be the answer to an objective cloze.');
  }
  if (card.questions.some((question) => question.id.includes('example-cloze') && !question.prompt.includes('（填写 ' + card.word + ' 的正确形式）'))) {
    errors.push(card.id + ': the example cloze must ask for the target word in its contextually correct form.');
  }
  if (card.questions.some((question) => question.prompt.includes('（填入目标词）'))) {
    errors.push(card.id + ': obsolete target-word fallback prompt found.');
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

console.log('Content validation passed: 150 template-complete cards, 30 days, 5 unique cards per day.');
