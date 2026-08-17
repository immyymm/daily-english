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
  const required = ['id', 'word', 'phonetic', 'syllables', 'partOfSpeech', 'coreMemory', 'meanings', 'fixedPhrases', 'examples', 'studyFocus', 'questions'];
  for (const field of required) {
    if (!card[field] || (Array.isArray(card[field]) && card[field].length === 0)) {
      errors.push(card.id + ': missing ' + field);
    }
  }
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
