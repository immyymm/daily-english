import { manualCardPacks001050 } from './manual-card-pack-001-050.mjs';
import { manualCardPacks051100 } from './manual-card-pack-051-100.mjs';
import { manualCardPacks101150 } from './manual-card-pack-101-150.mjs';

const sources = [manualCardPacks001050, manualCardPacks051100, manualCardPacks101150];
const duplicateWords = [];
const merged = {};

for (const source of sources) {
  for (const [word, pack] of Object.entries(source)) {
    if (Object.hasOwn(merged, word)) duplicateWords.push(word);
    merged[word] = pack;
  }
}

if (duplicateWords.length) {
  throw new Error(`Manual semantic packs contain duplicate words: ${[...new Set(duplicateWords)].sort().join(', ')}`);
}

export const manualCardPacks = Object.freeze(merged);
