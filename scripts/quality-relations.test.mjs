import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { confusables as reviewedConfusables } from './content-overrides.mjs';
import { ipaFor as productionIpaFor } from './phonetics.mjs';
import {
  assertRelationEntryQuality,
  canonicalizePartOfSpeech,
  containsForbiddenRelationText,
  dictionaryGlossForPartOfSpeech,
  normalizeCardRelations,
  normalizeDerivativeEntries,
  normalizeRelationEntries,
  isAmericanIpa,
  isLowValueDerivative,
  hasMultiplePrimaryStressesForSingleWord,
  relationNoteSpecificityIssue
} from './quality-relations.mjs';

const dictionary = {
  settle: {
    translation: 'n. 有背长椅\\nvt. 决定, 整理, 安放, 使定居, 支付, 解决\\nvi. 停留, 沉淀, 定居'
  },
  acceptance: { translation: 'n. 接受, 接纳' },
  acceptable: { translation: 'a. 可接受的, 合意的' }
};

const ipa = {
  settle: '/ˈsɛtəl/',
  except: '/ɪkˈsɛpt/',
  job: '/ˈdʒɑb/',
  acceptance: '/ækˈsɛptəns/',
  acceptable: '/ækˈsɛptəbəl/'
};
const ipaFor = (word) => ipa[word];

describe('quality-relations', () => {
  it('selects the requested ECDICT part of speech instead of the first homograph sense', () => {
    expect(dictionaryGlossForPartOfSpeech('settle', 'v.', dictionary)).toBe('决定；整理；安放');
    expect(canonicalizePartOfSpeech('vt. / vi.')).toBe('v.');
  });

  it('repairs the settle noun leak and replaces the former generic synonym note', () => {
    const [entry] = normalizeRelationEntries({
      kind: 'synonym',
      baseWord: 'decide',
      basePartOfSpeech: 'v.',
      baseChinese: '决定；选择',
      baseCollocation: 'decide to do something',
      entries: [{
        word: 'settle',
        phonetic: '/settle/',
        partOfSpeech: 'n.',
        chinese: '有背长椅',
        difference: 'settle 只覆盖其中一个义项；是否能够替换取决于两词各自的宾语、介词和语体。'
      }],
      ecdictEntries: dictionary,
      ipaFor
    });
    expect(entry).toMatchObject({
      word: 'settle',
      partOfSpeech: 'v.',
      chinese: '决定；解决',
      phonetic: '/ˈsɛtəl/'
    });
    expect(entry.difference).toContain('settle 常强调最终解决争议');
    expect(containsForbiddenRelationText(entry.difference)).toBe(false);
  });

  it('preserves all reviewed confusable metadata and places it ahead of generated entries', () => {
    const reviewedExcept = {
      word: 'except',
      partOfSpeech: 'prep. / conj.',
      chinese: '除……之外',
      difference: 'accept /əkˈsept/ 是“接受”；except /ɪkˈsept/ 是“除外”。'
    };
    const result = normalizeRelationEntries({
      kind: 'confusable',
      baseWord: 'accept',
      basePartOfSpeech: 'v.',
      baseChinese: '接受',
      baseCollocation: 'accept responsibility',
      entries: [{
        word: 'except',
        partOfSpeech: 'v.',
        chinese: '与 accept 容易混淆的表达',
        difference: '两者容易因拼写、发音或相近语境而混淆。'
      }],
      curatedConfusable: reviewedExcept,
      ipaFor
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ ...reviewedExcept, phonetic: '/ɪkˈsɛpt/' });
  });

  it('keeps a genuinely reviewed noun relation instead of forcing every synonym to a verb', () => {
    const [entry] = normalizeRelationEntries({
      kind: 'synonym',
      baseWord: 'work',
      basePartOfSpeech: 'v.',
      baseChinese: '工作；运转',
      baseCollocation: 'work on a project',
      entries: [{
        word: 'job',
        phonetic: '/bad/',
        partOfSpeech: 'n.',
        chinese: '工作；职位',
        difference: '可数名词，常指一份具体职位或任务；work 表示一般“工作”时通常不可数。'
      }],
      ipaFor
    });
    expect(entry.partOfSpeech).toBe('n.');
    expect(entry.chinese).toBe('工作；职位');
    expect(entry.phonetic).toBe('/ˈdʒɑb/');
  });

  it('orders derivatives v/n/adj/adv, keeps translations, and recomputes IPA', () => {
    const result = normalizeDerivativeEntries({
      baseWord: 'accept',
      entries: [
        { word: 'acceptable', partOfSpeech: 'adj.', chinese: '可接受的', phonetic: '/wrong/', note: '作形容词表示“可接受的”，常修饰方案或结果。' },
        { word: 'acceptance', partOfSpeech: 'n.', chinese: '接受；接纳', phonetic: '/wrong/', note: '作名词表示“接受、接纳”，常指行为或状态。' }
      ],
      ecdictEntries: dictionary,
      ipaFor
    });
    expect(result.map((entry) => entry.partOfSpeech)).toEqual(['n.', 'adj.']);
    expect(result.map((entry) => entry.phonetic)).toEqual(['/ækˈsɛptəns/', '/ækˈsɛptəbəl/']);
  });

  it('preserves reviewed POS-labelled IPA variants for a heteronym derivative', () => {
    const [reuse] = normalizeDerivativeEntries({
      baseWord: 'use',
      entries: [{
        word: 'reuse',
        partOfSpeech: 'v. / n.',
        chinese: '重复使用',
        phonetic: '/ˌriːˈjuːz/（动词）；/ˌriːˈjuːs/（名词）',
        note: '作动词时表示再次使用，作名词时表示再次使用这一行为。'
      }],
      ipaFor: () => '/ˌriːˈjuːz/'
    });
    expect(reuse.phonetic).toBe('/ˌriːˈjuːz/（动词）；/ˌriːˈjuːs/（名词）');
  });

  it('rejects rare or misleading entries from the common-derivative section', () => {
    expect(isLowValueDerivative('offer', 'offeror')).toBe(true);
    expect(isLowValueDerivative('talk', 'talkatively')).toBe(true);
    expect(isLowValueDerivative('show', 'showiness')).toBe(false);
    expect(() => normalizeDerivativeEntries({
      baseWord: 'offer',
      entries: [{ word: 'offeror', partOfSpeech: 'n.', chinese: '要约人', note: '合同法律术语。' }],
      ecdictEntries: {},
      ipaFor: () => '/ˈɔːfərər/'
    })).toThrow('Low-value or misleading derivative');
  });

  it('rejects multiple primary stresses only for a single written word', () => {
    expect(hasMultiplePrimaryStressesForSingleWord('realization', '/ˈriːələˈzeɪʃən/')).toBe(true);
    expect(hasMultiplePrimaryStressesForSingleWord('realization', '/ˌriːələˈzeɪʃən/')).toBe(false);
    expect(hasMultiplePrimaryStressesForSingleWord('provide support', '/prəˈvaɪd səˈpɔːrt/')).toBe(false);
    expect(hasMultiplePrimaryStressesForSingleWord('self-control', '/ˌself kənˈtroʊl/')).toBe(false);
    expect(hasMultiplePrimaryStressesForSingleWord('handmade', '/ˈhændˈmeɪd/')).toBe(true);
    expect(hasMultiplePrimaryStressesForSingleWord('handmade goods', '/ˈhændˈmeɪd ˈɡʊdz/')).toBe(true);
    expect(hasMultiplePrimaryStressesForSingleWord('handmade goods', '/ˌhændˈmeɪd ˈɡʊdz/')).toBe(false);
    expect(isAmericanIpa('/ˌriːˈjuːz/（动词）；/ˌriːˈjuːs/（名词）')).toBe(true);
    expect(isAmericanIpa('/lɪv/（动词）；/laɪv/（形容词）')).toBe(true);
    expect(hasMultiplePrimaryStressesForSingleWord('reuse', '/ˌriːˈjuːz/（动词）；/ˌriːˈjuːs/（名词）')).toBe(false);
  });

  it('rejects reusable relation boilerplate but accepts concise concrete two-sided distinctions', () => {
    expect(relationNoteSpecificityIssue({
      baseWord: 'accept',
      relationWord: 'receive',
      note: 'accept 和 receive 意思接近，但具体用法和语境不同，需要注意区别。',
      kind: 'synonym'
    })).not.toBe('');
    for (const [baseWord, relationWord, note] of [
      ['say', 'speak', 'speak 强调说话行为或语言能力；say 强调说出的具体内容。'],
      ['get', 'fetch', 'fetch 表示去取并带回；get 还可表示收到、变得、到达或理解。'],
      ['do', 'accomplish', '强调取得预期成果，而 do 只说明进行活动。']
    ]) {
      expect(relationNoteSpecificityIssue({ baseWord, relationWord, note, kind: 'synonym' }), `${baseWord}/${relationWord}`).toBe('');
    }
  });

  it('normalizes the four sections through one deterministic card API', () => {
    const card = {
      word: 'decide',
      partOfSpeech: 'v.',
      coreMemory: { chinese: '决定；选择' },
      fixedPhrases: [{ phrase: 'decide to do something' }],
      synonyms: [{ word: 'settle', partOfSpeech: 'n.', chinese: '有背长椅', difference: '只覆盖其中一个义项' }],
      antonyms: [], confusables: [], derivatives: []
    };
    const first = normalizeCardRelations({ card, ecdictEntries: dictionary, ipaFor });
    const second = normalizeCardRelations({ card, ecdictEntries: dictionary, ipaFor });
    expect(first).toEqual(second);
    expect(first.synonyms[0].partOfSpeech).toBe('v.');
  });

  it('fails closed when a relation still contains forbidden content or invalid IPA', () => {
    expect(() => assertRelationEntryQuality({
      word: 'settle', phonetic: '/settle1/', partOfSpeech: 'v.', chinese: '决定', difference: '只覆盖其中一个义项'
    }, 'synonym', 'decide -> settle')).toThrow();
  });

  it('normalizes every relation section across all 150 production cards', async () => {
    const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
    const root = path.resolve(scriptDirectory, '..');
    const dictionaryData = JSON.parse(await fs.readFile(path.join(scriptDirectory, 'ecdict-enrichment.json'), 'utf8'));
    const cardDirectory = path.join(root, 'content', 'cards');
    const files = (await fs.readdir(cardDirectory)).filter((file) => file.endsWith('.json')).sort();
    expect(files).toHaveLength(150);

    const normalizedCards = [];
    for (const file of files) {
      const card = JSON.parse(await fs.readFile(path.join(cardDirectory, file), 'utf8'));
      const relations = normalizeCardRelations({
        card,
        ecdictEntries: dictionaryData.entries,
        curatedConfusable: reviewedConfusables[card.word],
        ipaFor: productionIpaFor
      });
      normalizedCards.push({ word: card.word, ...relations });
      for (const [kind, key] of [['synonyms', 'difference'], ['antonyms', 'usage'], ['confusables', 'difference'], ['derivatives', 'note']]) {
        for (const entry of relations[kind]) {
          expect(containsForbiddenRelationText(entry.chinese), `${card.word}/${kind}/${entry.word} gloss`).toBe(false);
          expect(containsForbiddenRelationText(entry[key]), `${card.word}/${kind}/${entry.word} note`).toBe(false);
          expect(isAmericanIpa(entry.phonetic), `${card.word}/${kind}/${entry.word} IPA`).toBe(true);
        }
      }
    }

    const byWord = Object.fromEntries(normalizedCards.map((card) => [card.word, card]));
    expect(byWord.accept.confusables.find((entry) => entry.word === 'except')).toMatchObject({
      partOfSpeech: 'prep. / conj.', chinese: '除……之外'
    });
    expect(byWord.may.synonyms.find((entry) => entry.word === 'can')).toMatchObject({
      partOfSpeech: 'aux.', chinese: '能；可以'
    });
    expect(byWord.can.confusables.find((entry) => entry.word === 'could').partOfSpeech).toBe('aux.');
    expect(byWord.would.confusables.find((entry) => entry.word === 'could').partOfSpeech).toBe('aux.');
    expect(byWord.decide.synonyms.find((entry) => entry.word === 'settle')).toMatchObject({
      partOfSpeech: 'v.', chinese: '决定；解决'
    });
    expect(byWord.wear.synonyms.find((entry) => entry.word === 'bear')).toMatchObject({
      partOfSpeech: 'v.', chinese: '承受；带有'
    });
    expect(byWord.wear.synonyms.find((entry) => entry.word === 'display')).toMatchObject({
      partOfSpeech: 'v.', chinese: '展示；显示'
    });
    expect(byWord.accept.synonyms.find((entry) => entry.word === 'approve')).toMatchObject({
      partOfSpeech: 'v.', chinese: '赞同；批准'
    });
    expect(byWord.accept.synonyms.find((entry) => entry.word === 'approve').chinese).not.toContain('提供证据');

    const nounSynonyms = normalizedCards.flatMap((card) => card.synonyms
      .filter((entry) => entry.partOfSpeech.startsWith('n.'))
      .map((entry) => `${card.word}|${entry.word}`));
    expect(nounSynonyms.sort()).toEqual(['work|employment', 'work|job']);
  }, 30_000);
});
