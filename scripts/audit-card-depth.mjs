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
const incompletePhraseEnding = /\b(?:a|an|the|my|your|his|her|our|their|is|are|was|were|has|had|one more|about|until|wherever|what|who|why|how|when|looking|new)$/i;
const acceptedCompleteIdioms = new Set(['if you will', 'stay the same']);
const forbiddenLearnerCopy = /(?:本卡|目标词|答题时|词卡结构|人工精校|AI 生成|自动生成|JSON 对象|confidence:|vocabulary notebook|The phrase [“"].+[”"] is useful)/i;
for (const card of cards) {
  const row = metrics(card);
  if (card.contextPhrases.length < minimums.contextCategories || row.contexts < minimums.contextItems) failures.push(`${card.word}: context detail floor failed (${card.contextPhrases.length} groups/${row.contexts} items)`);
  if (row.fixed < minimums.fixedPhrases) failures.push(`${card.word}: fewer than ${minimums.fixedPhrases} fixed phrases`);
  if (row.synonyms < minimums.synonyms) failures.push(`${card.word}: fewer than ${minimums.synonyms} sense-specific synonyms`);
  if (row.relatedGroups < minimums.relatedCategories || row.relatedItems < minimums.relatedItems) failures.push(`${card.word}: related taxonomy is too small (${row.relatedGroups} groups/${row.relatedItems} items)`);
  if (row.examples < minimums.highFrequencyExamples) failures.push(`${card.word}: fewer than ${minimums.highFrequencyExamples} natural bilingual examples`);
  const relationEntries = [...card.synonyms, ...card.antonyms, ...card.confusables];
  if (relationEntries.some((entry) => !entry.chinese || !entry.partOfSpeech || !entry.phonetic)) failures.push(`${card.word}: incomplete relation metadata`);
  // The locked work example intentionally uses concise Chinese comparison notes.
  // Generated cards must clear the longer anti-filler floor; reviewed/reference
  // cards may be shorter, but still need an explicit semantic boundary marker.
  const generated = card.detailLevel === 'template-complete';
  const boundaryMarker = /(?:强调|表示|用于|常用|常指|多指|侧重|区别|相反|对应|不能|不一定|不表示|可以|要说|是|主动|直接|比|与|而|但|只|范围|结构|发音|拼写|词性)/;
  if (card.synonyms.some((entry) => !entry.difference || entry.difference.length < (generated ? 35 : 18) || !boundaryMarker.test(entry.difference))) failures.push(`${card.word}: synonym distinction is incomplete`);
  if (card.antonyms.some((entry) => !entry.usage || entry.usage.length < (generated ? 30 : 14) || !boundaryMarker.test(entry.usage))) failures.push(`${card.word}: antonym contrast is incomplete`);
  if (card.confusables.some((entry) => !entry.difference || entry.difference.length < (generated ? 35 : 24) || !boundaryMarker.test(entry.difference))) failures.push(`${card.word}: confusable distinction is incomplete`);
  if (card.coreMemory.structures.length < templateLock.qualityContract.coreStructures) failures.push(`${card.word}: too few core structures`);
  if (card.coreMemory.commonErrors.length < templateLock.qualityContract.commonErrorPairs) failures.push(`${card.word}: too few concrete error pairs`);
  if (card.fixedPhrases.some((entry) => !entry.phrase || !entry.chinese || !entry.phonetic || !entry.example || !entry.translation)) failures.push(`${card.word}: incomplete fixed phrase row`);
  const contexts = card.contextPhrases.flatMap((group) => group.items);
  if (contexts.some((entry) => !entry.phrase || !entry.chinese || !entry.phonetic || /[。！？!?；;]$/.test(entry.chinese.trim()))) failures.push(`${card.word}: context row is not a concise bilingual phrase`);
  if (contexts.some((entry) => [...entry.chinese.replace(/\s/g, '')].length > templateLock.qualityContract.contextChineseMaxCharacters)) failures.push(`${card.word}: context Chinese exceeds the locked phrase-gloss length limit`);
  if (contexts.some((entry) => !acceptedCompleteIdioms.has(entry.phrase.trim().toLowerCase()) && incompletePhraseEnding.test(entry.phrase.trim()))) failures.push(`${card.word}: context phrase ends before its complement`);
  const learnerFacing = JSON.stringify({ coreMemory: card.coreMemory, meanings: card.meanings, contextPhrases: card.contextPhrases, fixedPhrases: card.fixedPhrases, synonyms: card.synonyms, antonyms: card.antonyms, derivatives: card.derivatives, confusables: card.confusables, relatedVocabulary: card.relatedVocabulary, studyFocus: card.studyFocus });
  if (forbiddenLearnerCopy.test(learnerFacing)) failures.push(`${card.word}: internal, meta-learning, or mechanical filler leaked into learner content`);
}

console.log(JSON.stringify({ cards: cards.length, contentVersion: catalog.contentVersion, summary }, null, 2));
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Depth audit passed: all ${cards.length} published cards meet the catalog-wide structural and semantic detail contract.`);
