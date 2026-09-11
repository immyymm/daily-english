import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { semanticRelatedPacks } from './semantic-related-packs.mjs';

const targetWords = [
  'would', 'could', 'should', 'may', 'might', 'must',
  'thank', 'hope', 'base', 'wear', 'increase', 'depend',
  'like', 'grow', 'report', 'lose', 'compare', 'prefer'
];
const requiredFields = ['categoryHint', 'chinese', 'partOfSpeech', 'word'];
const placeholderCopy = /(?:相关词汇|常用词|补充表达|相近表达|同一语义场|与\s*.+\s*相关)/;
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));

async function readPublishedCard(word) {
  const cardPath = path.join(scriptDirectory, '..', 'content', 'cards', `${word}-v.json`);
  try {
    return JSON.parse(await fs.readFile(cardPath, 'utf8'));
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
    const catalogPath = path.join(scriptDirectory, '..', 'public', 'data', 'all-cards.json');
    const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'));
    const card = catalog.cards.find((candidate) => candidate.word === word);
    if (!card) throw new Error(`Published card not found for ${word}`);
    return card;
  }
}

// Best positive BNC/ECDICT frequency rank in the audited ECDICT snapshot.
// Keeping the evidence beside the test makes the commonness gate portable;
// the full source CSV is intentionally not a repository/runtime dependency.
const auditedEcdictCommonnessRank = {
  like: {
    preference: 2642, taste: 2031, interest: 231, enthusiasm: 2678,
    similarity: 3998, resemblance: 6479, comparison: 1968, match: 1097,
    approval: 2223, support: 481, acceptance: 2899, popularity: 3974
  },
  grow: {
    seed: 1919, soil: 1791, plant: 623, crop: 2461,
    amount: 584, rate: 297, population: 642, demand: 723,
    business: 215, economy: 645, market: 253, capacity: 1507
  },
  report: {
    fact: 201, evidence: 456, data: 552, source: 597,
    newspaper: 1064, television: 794, website: 4950, press: 961,
    incident: 1785, crime: 828, problem: 154, progress: 1265
  },
  lose: {
    property: 597, wallet: 5587, key: 1093, luggage: 7156,
    game: 273, match: 1097, score: 1070, championship: 1874,
    weight: 954, memory: 891, hearing: 1711, balance: 1176
  },
  compare: {
    criterion: 1799, standard: 653, reference: 1016, baseline: 5972,
    similarity: 3998, difference: 496, feature: 741, pattern: 676,
    data: 552, figure: 325, result: 264, performance: 675
  },
  prefer: {
    choice: 630, option: 1086, alternative: 1752, priority: 1729,
    quality: 536, cost: 342, convenience: 4892, value: 367,
    taste: 2031, interest: 231, need: 132, comfort: 2827
  }
};

describe('semantic related packs', () => {
  it('covers every reviewed WordNet/category gap', () => {
    expect(Object.keys(semanticRelatedPacks).sort()).toEqual([...targetWords].sort());
  });

  it.each(targetWords)('gives %s exactly 12 unique, classified, complete entries', (word) => {
    const pack = semanticRelatedPacks[word];
    expect(pack.length, `${word} needs exactly 12 reviewed items`).toBe(12);

    const normalizedWords = pack.map((entry) => entry.word.toLowerCase().trim());
    expect(new Set(normalizedWords).size, `${word} repeats a related word`).toBe(pack.length);
    expect(normalizedWords, `${word} must not refer to itself`).not.toContain(word);
    expect(new Set(pack.map((entry) => entry.categoryHint.trim())).size, `${word} needs at least three concrete categories`).toBeGreaterThanOrEqual(3);

    for (const entry of pack) {
      expect(Object.keys(entry).sort(), `${word}/${entry.word} has an unexpected shape`).toEqual(requiredFields);
      for (const field of requiredFields) {
        expect(typeof entry[field], `${word}/${entry.word}.${field} must be a string`).toBe('string');
        expect(entry[field].trim(), `${word}/${entry.word}.${field} must not be empty`).not.toBe('');
      }
      expect(entry.partOfSpeech, `${word}/${entry.word} needs a learner-facing part of speech`).toMatch(/^(?:n|v|adj|adv)\.$/);
      expect(entry.chinese, `${word}/${entry.word} uses placeholder copy`).not.toMatch(placeholderCopy);
      expect(entry.categoryHint, `${word}/${entry.word} uses a generic category`).not.toMatch(placeholderCopy);
    }
  });

  it.each(Object.entries(auditedEcdictCommonnessRank))('keeps %s within the audited common ECDICT vocabulary', (word, ranks) => {
    const packWords = semanticRelatedPacks[word].map((entry) => entry.word.toLowerCase().trim()).sort();
    expect(packWords).toEqual(Object.keys(ranks).sort());
    for (const [candidate, rank] of Object.entries(ranks)) {
      expect(rank, `${word}/${candidate} needs positive frequency evidence`).toBeGreaterThan(0);
      expect(rank, `${word}/${candidate} is outside the reviewed commonness ceiling`).toBeLessThanOrEqual(8000);
    }
  });

  it.each(targetWords)('does not repeat %s relation-section entries', async (word) => {
    const card = await readPublishedCard(word);
    const relationWords = new Set([
      ...card.synonyms,
      ...card.antonyms,
      ...card.derivatives,
      ...card.confusables
    ].map((entry) => entry.word.toLowerCase().trim()));

    for (const entry of semanticRelatedPacks[word]) {
      expect(relationWords.has(entry.word.toLowerCase().trim()), `${word}/${entry.word} repeats another relation section`).toBe(false);
    }
  });
});
