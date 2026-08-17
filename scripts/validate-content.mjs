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
  if (card.contextPhrases.reduce((sum, group) => sum + group.items.length, 0) < 2) errors.push(card.id + ': expected at least two context phrases.');
  if (card.fixedPhrases.length < 1) errors.push(card.id + ': expected a fixed phrase.');
  if (card.synonyms.length < 1 || card.antonyms.length < 1) errors.push(card.id + ': missing semantic contrast.');
  if (card.relatedVocabulary.reduce((sum, group) => sum + group.items.length, 0) < 2) errors.push(card.id + ': expected a related vocabulary group.');
  if (card.examples.length < 5) errors.push(card.id + ': expected five learning-scene examples.');
  if (new Set(card.examples.map((example) => example.english)).size !== card.examples.length) errors.push(card.id + ': duplicate example sentences.');
  if (card.derivatives.some((item) => item.word.toLowerCase() === card.word.toLowerCase())) errors.push(card.id + ': target word repeated as a derivative.');

  const phonetics = [
    card.phonetic,
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

console.log('Content validation passed: 150 cards, 30 days, 5 unique cards per day.');
