import { describe, expect, it } from 'vitest';
import { commonNounSensePacks, finalizeMeaningRows } from './common-noun-senses.mjs';

const splitNounWords = ['use', 'talk', 'base', 'fall', 'run', 'return', 'turn', 'drive', 'cut', 'pass', 'reach'];
const seedVerbMeaning = {
  partOfSpeech: 'v.',
  english: 'a seed verb definition',
  chinese: '动词释义',
  example: 'This is a seed verb example.',
  translation: '这是一个动词例句。'
};

describe('common noun sense packs', () => {
  it('keeps every noun row structurally complete with distinct example evidence', () => {
    for (const [word, pack] of Object.entries(commonNounSensePacks)) {
      expect(pack.length, `${word} should have at least one noun sense`).toBeGreaterThan(0);

      for (const row of pack) {
        expect(row.length, `${word} has an unexpected tuple shape`).toBeGreaterThanOrEqual(5);
        expect(row.length, `${word} has an unexpected tuple shape`).toBeLessThanOrEqual(6);
        for (const field of row.slice(0, 5)) {
          expect(typeof field, `${word} has a non-string required field`).toBe('string');
          expect(field.trim(), `${word} has an empty required field`).not.toBe('');
        }
      }

      const examples = pack.map(([, , , example]) => example.toLowerCase());
      expect(new Set(examples).size, `${word} reuses an example across noun senses`).toBe(examples.length);
    }
  });

  it.each(splitNounWords)('gives each common noun sense of %s its own row', (word) => {
    const pack = commonNounSensePacks[word];
    expect(pack).toHaveLength(2);
    expect(new Set(pack.map(([, english]) => english)).size).toBe(2);
    expect(new Set(pack.map(([, , chinese]) => chinese)).size).toBe(2);
    expect(new Set(pack.map(([, , , example]) => example)).size).toBe(2);
    expect(new Set(pack.map(([, , , , translation]) => translation)).size).toBe(2);
  });

  it('emits sense-level pronunciations for heteronyms', () => {
    const useNounRows = finalizeMeaningRows('use', [seedVerbMeaning]).filter(({ partOfSpeech }) => partOfSpeech === 'n.');
    expect(useNounRows).toHaveLength(2);
    expect(useNounRows.every(({ phonetic }) => phonetic === '/juːs/')).toBe(true);

    const liveAdjectiveRows = finalizeMeaningRows('live', [seedVerbMeaning]).filter(({ partOfSpeech }) => partOfSpeech === 'adj.');
    expect(liveAdjectiveRows).toEqual([
      expect.objectContaining({
        chinese: '现场直播的；现场演出的',
        phonetic: '/laɪv/'
      })
    ]);
  });

  it('retains the common noun reading of share after reviewed verb replacements', () => {
    const shareRows = finalizeMeaningRows('share', [seedVerbMeaning]);
    expect(shareRows).toEqual(expect.arrayContaining([
      expect.objectContaining({
        partOfSpeech: 'n.',
        chinese: '一份；份额',
        example: 'Everyone paid an equal share of the cost.'
      })
    ]));
  });

  it('preserves every authored manual-pack row when the caller marks it authoritative', () => {
    const manualRows = [
      { partOfSpeech: 'v.', english: 'to listen to advice and act on it', chinese: '听从；听取', example: 'He listened to his doctor.', translation: '他听从了医生的建议。' },
      { partOfSpeech: 'n.', english: 'one divided part', chinese: '份额', example: 'She paid her share.', translation: '她付了自己的份额。' }
    ];
    expect(finalizeMeaningRows('listen', manualRows, { authoritative: true })).toEqual(manualRows);
  });

  it('uses the reviewed wording and unambiguous prediction evidence', () => {
    expect(commonNounSensePacks.show[0][1]).toContain('program');
    expect(commonNounSensePacks.show[0][1]).not.toContain('programme');

    const [development] = finalizeMeaningRows('develop', [seedVerbMeaning]);
    expect(development.english).toBe('to grow, change, or become more advanced over time');

    const [prediction] = finalizeMeaningRows('expect', [seedVerbMeaning]);
    expect(prediction.example).toBe('We expect the train to arrive at six, according to the timetable.');
    expect(prediction.translation).toBe('根据时刻表，我们预计火车六点到达。');
  });
});
