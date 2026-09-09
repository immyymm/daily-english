import fs from 'node:fs';

const catalog = JSON.parse(fs.readFileSync(new URL('../public/data/all-cards.json', import.meta.url), 'utf8'));
const templateLock = JSON.parse(fs.readFileSync(new URL('../content/templates/template-lock.json', import.meta.url), 'utf8'));
const cards = catalog.cards;
const minimums = templateLock.publishedCardMinimums;
const metrics = (card) => ({
  word: card.word,
  meanings: card.meanings.length,
  contexts: card.contextPhrases.reduce((sum, group) => sum + group.items.length, 0),
  fixed: card.fixedPhrases.length,
  synonyms: card.synonyms.length,
  antonyms: card.antonyms.length,
  derivatives: card.derivatives.length,
  confusables: card.confusables.length,
  relatedGroups: card.relatedVocabulary.length,
  relatedItems: card.relatedVocabulary.reduce((sum, group) => sum + group.items.length, 0),
  examples: card.examples.length
});
const rows = cards.map(metrics);
const fields = ['meanings', 'contexts', 'fixed', 'synonyms', 'antonyms', 'derivatives', 'confusables', 'relatedGroups', 'relatedItems', 'examples'];
const summary = Object.fromEntries(fields.map((field) => [field, {
  min: Math.min(...rows.map((row) => row[field])),
  average: Number((rows.reduce((sum, row) => sum + row[field], 0) / rows.length).toFixed(2)),
  max: Math.max(...rows.map((row) => row[field]))
}]));
const failures = [];
for (const card of cards.filter((entry) => entry.detailLevel === 'template-complete')) {
  const row = metrics(card);
  if (card.contextPhrases.length < minimums.contextCategories || row.contexts < minimums.contextItems) failures.push(`${card.word}: context detail floor failed (${card.contextPhrases.length} groups/${row.contexts} items)`);
  if (row.fixed < minimums.fixedPhrases) failures.push(`${card.word}: fewer than ${minimums.fixedPhrases} fixed phrases`);
  if (row.synonyms < minimums.synonyms) failures.push(`${card.word}: fewer than ${minimums.synonyms} sense-specific synonyms`);
  if (row.relatedGroups < minimums.relatedCategories || row.relatedItems < minimums.relatedItems) failures.push(`${card.word}: related taxonomy is too small (${row.relatedGroups} groups/${row.relatedItems} items)`);
  if (row.examples < minimums.highFrequencyExamples) failures.push(`${card.word}: fewer than ${minimums.highFrequencyExamples} natural bilingual examples`);
  const relationEntries = [...card.synonyms, ...card.antonyms, ...card.confusables];
  if (relationEntries.some((entry) => !entry.chinese || !entry.partOfSpeech || !entry.phonetic)) failures.push(`${card.word}: incomplete relation metadata`);
  if (card.synonyms.some((entry) => !entry.difference || entry.difference.length < 35)) failures.push(`${card.word}: synonym distinction is too short`);
  if (card.antonyms.some((entry) => !entry.usage || entry.usage.length < 30)) failures.push(`${card.word}: antonym contrast is too short`);
  if (card.confusables.some((entry) => !entry.difference || entry.difference.length < 35)) failures.push(`${card.word}: confusable distinction is too short`);
}

console.log(JSON.stringify({ cards: cards.length, contentVersion: catalog.contentVersion, summary }, null, 2));
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Depth audit passed: every template-complete card meets the catalog-wide semantic detail floor.');
