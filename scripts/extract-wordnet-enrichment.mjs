import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const dictDir = process.argv[2];

if (!dictDir) {
  throw new Error('Usage: node scripts/extract-wordnet-enrichment.mjs <WordNet dict directory>');
}

const activeCards = JSON.parse(await fs.readFile(path.join(root, 'public', 'data', 'all-cards.json'), 'utf8')).cards;
const targets = activeCards.map((card) => card.word);

function normalizeLemma(value) {
  return value.replaceAll('_', ' ').replaceAll('(', '').replaceAll(')', '').trim();
}

function parseIndex(text) {
  const result = new Map();
  for (const line of text.split(/\r?\n/)) {
    if (!line || /^\s/.test(line)) continue;
    const parts = line.trim().split(/\s+/);
    if (parts.length < 6) continue;
    const lemma = normalizeLemma(parts[0]);
    const synsetCount = Number(parts[2]);
    const pointerCount = Number(parts[3]);
    const offsetStart = 6 + pointerCount;
    result.set(lemma, parts.slice(offsetStart, offsetStart + synsetCount));
  }
  return result;
}

function parseData(text, partOfSpeech) {
  const result = new Map();
  for (const line of text.split(/\r?\n/)) {
    if (!/^\d/.test(line)) continue;
    const [raw, glossText = ''] = line.split('|');
    const parts = raw.trim().split(/\s+/);
    const offset = parts[0];
    const wordCount = Number.parseInt(parts[3], 16);
    const words = [];
    let cursor = 4;
    for (let index = 0; index < wordCount; index += 1) {
      words.push(normalizeLemma(parts[cursor]));
      cursor += 2;
    }
    const pointerCount = Number(parts[cursor]);
    cursor += 1;
    const pointers = [];
    for (let index = 0; index < pointerCount; index += 1) {
      pointers.push({
        symbol: parts[cursor],
        offset: parts[cursor + 1],
        pos: parts[cursor + 2],
        sourceTarget: parts[cursor + 3]
      });
      cursor += 4;
    }
    const gloss = glossText.trim();
    const quotedExamples = [...gloss.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
    const definition = gloss.split(';')[0].trim();
    result.set(offset, { offset, partOfSpeech, words, pointers, definition, examples: quotedExamples });
  }
  return result;
}

const indexes = {};
const dataMaps = {};
for (const [suffix, partOfSpeech] of [['verb', 'v.'], ['noun', 'n.'], ['adj', 'adj.'], ['adv', 'adv.']]) {
  indexes[suffix] = parseIndex(await fs.readFile(path.join(dictDir, `index.${suffix}`), 'utf8'));
  dataMaps[suffix[0] === 'a' && suffix === 'adj' ? 'a' : suffix[0]] = parseData(
    await fs.readFile(path.join(dictDir, `data.${suffix}`), 'utf8'),
    partOfSpeech
  );
}

function uniqueByWord(items, excluded = new Set()) {
  const seen = new Set([...excluded].map((word) => word.toLowerCase()));
  return items.filter((item) => {
    const key = item.word.toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function pointedWords(synset, symbols) {
  const items = [];
  for (const pointer of synset.pointers.filter((entry) => symbols.has(entry.symbol))) {
    const targetMap = dataMaps[pointer.pos === 's' ? 'a' : pointer.pos];
    const target = targetMap?.get(pointer.offset);
    if (!target) continue;
    const targetWordIndex = Number.parseInt(pointer.sourceTarget.slice(2), 16) - 1;
    const selectedWords = targetWordIndex >= 0 ? [target.words[targetWordIndex]] : target.words;
    for (const word of selectedWords.filter(Boolean)) {
      items.push({ word, partOfSpeech: target.partOfSpeech, definition: target.definition, relation: pointer.symbol });
    }
  }
  return items;
}

const entries = {};
for (const word of targets) {
  const offsets = indexes.verb.get(word) ?? [];
  const synsets = offsets.map((offset) => dataMaps.v.get(offset)).filter(Boolean);
  const meanings = synsets
    .filter((synset, index, source) => synset.definition && source.findIndex((candidate) => candidate.definition === synset.definition) === index)
    .slice(0, 5)
    .map((synset) => ({
      definition: synset.definition,
      example: synset.examples[0] ?? '',
      senseWords: synset.words.slice(0, 6)
    }));
  const synonyms = uniqueByWord(synsets.flatMap((synset) => synset.words
    .filter((candidate) => candidate.toLowerCase() !== word.toLowerCase())
    .map((candidate) => ({ word: candidate, partOfSpeech: 'v.', definition: synset.definition }))
  ), new Set([word])).slice(0, 12);
  const antonyms = uniqueByWord(synsets.flatMap((synset) => pointedWords(synset, new Set(['!']))), new Set([word])).slice(0, 8);
  const derivatives = uniqueByWord(synsets.flatMap((synset) => pointedWords(synset, new Set(['+']))), new Set([word])).slice(0, 12);
  const hypernyms = uniqueByWord(synsets.flatMap((synset) => pointedWords(synset, new Set(['@']))), new Set([word])).slice(0, 16);
  const hyponyms = uniqueByWord(synsets.flatMap((synset) => pointedWords(synset, new Set(['~']))), new Set([word])).slice(0, 24);
  const related = uniqueByWord([...hypernyms, ...hyponyms], new Set([word])).slice(0, 24);
  entries[word] = { meanings, synonyms, antonyms, derivatives, hypernyms, hyponyms, related };
}

await fs.writeFile(
  path.join(root, 'scripts', 'wordnet-enrichment.json'),
  JSON.stringify({ source: 'Princeton WordNet via wordnet-db@3.1.14', generatedFor: targets.length, entries }, null, 2) + '\n',
  'utf8'
);

console.log(`Extracted WordNet enrichment for ${targets.length} cards.`);
