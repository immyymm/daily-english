import { describe, expect, it } from 'vitest';
import { manualCardPacks } from './manual-card-packs.mjs';
import { containsForbiddenRelationText, isLowValueDerivative, relationNoteSpecificityIssue } from './quality-relations.mjs';
import { fixedExampleIssue, isConcisePhraseGloss, mechanicalContextIssue, phraseContainsTarget, reusablePhraseIssue } from './quality-sections.mjs';

const adaptiveKeys = ['derivatives'];
const mandatoryKeys = ['meanings', 'fixedPhrases', 'contexts', 'synonyms', 'antonyms', 'confusables', 'related', 'commonErrors'];
const normalize = (value) => String(value ?? '').toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9']+/g, ' ').trim();
const genericCategory = /^(?:相关|常用|其他|综合|补充|近义|对比|词族|同类)(?:词汇|表达|内容|分类|语境)?$/;

describe('manual semantic packs', () => {
  it('covers every non-reference COCA card exactly once', () => {
    const words = Object.keys(manualCardPacks);
    expect(words).toHaveLength(149);
    expect(words).not.toContain('work');
  });

  it('makes every mandatory section non-empty and keeps derivative review decisions explicit', () => {
    for (const [word, pack] of Object.entries(manualCardPacks)) {
      for (const key of mandatoryKeys) {
        expect(pack, `${word}.${key}`).toHaveProperty(key);
        expect(Array.isArray(pack[key]), `${word}.${key}`).toBe(true);
        expect(pack[key].length, `${word}.${key}`).toBeGreaterThan(0);
      }
      for (const key of adaptiveKeys) {
        expect(pack, `${word}.${key}`).toHaveProperty(key);
        expect(Array.isArray(pack[key]), `${word}.${key}`).toBe(true);
      }
    }
  });

  it('matches every locked visible-completeness floor without relation padding', () => {
    for (const [word, pack] of Object.entries(manualCardPacks)) {
      expect(pack.fixedPhrases.length, `${word}.fixedPhrases`).toBeGreaterThanOrEqual(12);
      expect(pack.contexts.length, `${word}.contexts categories`).toBeGreaterThanOrEqual(4);
      expect(pack.contexts.flatMap(([, items]) => items).length, `${word}.contexts items`).toBeGreaterThanOrEqual(16);
      expect(pack.synonyms.length, `${word}.synonyms`).toBeGreaterThanOrEqual(5);
      expect(pack.antonyms.length, `${word}.antonyms`).toBeGreaterThanOrEqual(3);
      expect(pack.confusables.length, `${word}.confusables`).toBeGreaterThanOrEqual(2);
      expect(pack.related.length, `${word}.related categories`).toBeGreaterThanOrEqual(3);
      expect(pack.related.flatMap(([, items]) => items).length, `${word}.related items`).toBeGreaterThanOrEqual(12);
      expect(pack.commonErrors.length, `${word}.commonErrors`).toBeGreaterThanOrEqual(2);
    }
  });

  it('contains complete, target-bearing bilingual meanings and fixed phrases', () => {
    for (const [word, pack] of Object.entries(manualCardPacks)) {
      const meaningExamples = new Set();
      for (const row of pack.meanings) {
        expect(row, `${word}.meanings row`).toHaveLength(5);
        row.forEach((value) => expect(String(value).trim(), `${word}.meanings value`).not.toBe(''));
        expect(phraseContainsTarget(row[3], word), `${word}.meaning example: ${row[3]}`).toBe(true);
        expect(meaningExamples.has(normalize(row[3])), `${word}.meaning duplicate: ${row[3]}`).toBe(false);
        meaningExamples.add(normalize(row[3]));
      }
      const fixed = new Set();
      for (const [phrase, chinese, example, translation] of pack.fixedPhrases) {
        expect([phrase, chinese, example, translation].every((value) => String(value).trim()), `${word}.fixedPhrases complete`).toBe(true);
        expect(phraseContainsTarget(phrase, word), `${word}.fixed phrase: ${phrase}`).toBe(true);
        expect(phraseContainsTarget(example, word), `${word}.fixed example: ${example}`).toBe(true);
        expect(reusablePhraseIssue(phrase), `${word}.fixed phrase: ${phrase}`).toBe('');
        expect(fixedExampleIssue(example, phrase), `${word}.mechanical fixed example: ${example}`).toBe('');
        expect(fixed.has(normalize(phrase)), `${word}.fixed duplicate: ${phrase}`).toBe(false);
        fixed.add(normalize(phrase));
      }
    }
  });

  it('keeps contexts independent, concrete, concise, and non-mechanical', () => {
    for (const [word, pack] of Object.entries(manualCardPacks)) {
      const fixed = new Set(pack.fixedPhrases.map(([phrase]) => normalize(phrase)));
      const contexts = new Set();
      const categories = new Set();
      for (const [category, items] of pack.contexts) {
        expect(String(category).trim(), `${word}.context category`).not.toBe('');
        expect(genericCategory.test(String(category).trim()), `${word}.context category: ${category}`).toBe(false);
        expect(categories.has(category), `${word}.duplicate context category: ${category}`).toBe(false);
        categories.add(category);
        for (const [phrase, chinese] of items) {
          const key = normalize(phrase);
          expect(phraseContainsTarget(phrase, word), `${word}.context: ${phrase}`).toBe(true);
          expect(reusablePhraseIssue(phrase), `${word}.context: ${phrase}`).toBe('');
          expect(isConcisePhraseGloss(chinese, 14), `${word}.context gloss: ${chinese}`).toBe(true);
          expect(mechanicalContextIssue(phrase, word), `${word}.mechanical context: ${phrase}`).toBe('');
          expect(fixed.has(key), `${word}.context repeats fixed phrase: ${phrase}`).toBe(false);
          expect(contexts.has(key), `${word}.duplicate context: ${phrase}`).toBe(false);
          contexts.add(key);
        }
      }
    }
  });

  it('uses explicit relation senses without placeholders or cross-section padding', () => {
    for (const [word, pack] of Object.entries(manualCardPacks)) {
      const seen = new Set();
      for (const key of ['derivatives', 'synonyms', 'antonyms', 'confusables']) {
        for (const [relatedWord, partOfSpeech, chinese, note] of pack[key]) {
          const relationKey = normalize(relatedWord);
          expect(relationKey, `${word}.${key} word`).not.toBe('');
          expect(String(partOfSpeech).trim(), `${word}.${key} POS`).not.toBe('');
          expect(String(chinese).trim(), `${word}.${key} Chinese`).not.toBe('');
          const minimumNoteLength = key === 'synonyms' ? 20 : key === 'derivatives' ? 12 : 16;
          expect(String(note).trim().length, `${word}.${key} note`).toBeGreaterThanOrEqual(minimumNoteLength);
          expect(containsForbiddenRelationText(`${chinese} ${note}`), `${word}.${key}: ${relatedWord}`).toBe(false);
          if (key === 'derivatives') expect(isLowValueDerivative(word, relatedWord), `${word}.low-value derivative: ${relatedWord}`).toBe(false);
          else expect(relationNoteSpecificityIssue({
            baseWord: word,
            relationWord: relatedWord,
            note,
            kind: key === 'synonyms' ? 'synonym' : key === 'antonyms' ? 'antonym' : 'confusable'
          }), `${word}.${key} vague note: ${relatedWord}: ${note}`).toBe('');
          expect(seen.has(relationKey), `${word}.relation repeated: ${relatedWord}`).toBe(false);
          seen.add(relationKey);
        }
      }
      const relatedSeen = new Set();
      for (const [category, items] of pack.related) {
        expect(genericCategory.test(String(category).trim()), `${word}.related category: ${category}`).toBe(false);
        for (const [relatedWord, partOfSpeech, chinese] of items) {
          const relationKey = normalize(relatedWord);
          expect([relatedWord, partOfSpeech, chinese].every((value) => String(value).trim()), `${word}.related complete`).toBe(true);
          expect(seen.has(relationKey), `${word}.related repeats relation section: ${relatedWord}`).toBe(false);
          expect(relatedSeen.has(relationKey), `${word}.related duplicate: ${relatedWord}`).toBe(false);
          relatedSeen.add(relationKey);
        }
      }
    }
  });

  it('uses two distinct word-specific error corrections per card', () => {
    for (const [word, pack] of Object.entries(manualCardPacks)) {
      const seen = new Set();
      for (const [wrong, right, note] of pack.commonErrors) {
        expect(String(wrong).trim(), `${word}.wrong`).not.toBe('');
        expect(String(right).trim(), `${word}.right`).not.toBe('');
        expect(normalize(wrong), `${word}.wrong/right`).not.toBe(normalize(right));
        expect(String(note).trim().length, `${word}.error note`).toBeGreaterThanOrEqual(12);
        expect(new RegExp(`^(?:can to ${word}|to ${word}(?:s|es))$`, 'i').test(String(wrong).trim()), `${word}.generic error: ${wrong}`).toBe(false);
        expect(seen.has(normalize(wrong)), `${word}.duplicate error: ${wrong}`).toBe(false);
        seen.add(normalize(wrong));
      }
    }
  });
});
