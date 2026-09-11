import test from 'node:test';
import assert from 'node:assert/strict';

import { manualCardPacks101150 } from './manual-card-pack-101-150.mjs';

const expectedWords = [
  'end', 'require', 'listen', 'agree', 'cut', 'decide', 'pass', 'eat',
  'report', 'suggest', 'sell', 'support', 'receive', 'base', 'pick',
  'drive', 'reach', 'remain', 'explain', 'hit', 'pull', 'raise', 'wear',
  'return', 'choose', 'cause', 'join', 'develop', 'share', 'realize',
  'describe', 'increase', 'protect', 'compare', 'reduce', 'accept',
  'prepare', 'avoid', 'notice', 'affect', 'manage', 'improve', 'discover',
  'handle', 'achieve', 'express', 'encourage', 'depend', 'prefer', 'solve'
];

const requiredKeys = [
  'meanings', 'fixedPhrases', 'contexts', 'derivatives', 'synonyms',
  'antonyms', 'confusables', 'related', 'commonErrors'
];

const assertTupleStrings = (word, field, rows, width) => {
  for (const [index, row] of rows.entries()) {
    assert.equal(row.length, width, `${word}.${field}[${index}] tuple width`);
    for (const value of row) {
      assert.equal(typeof value, 'string', `${word}.${field}[${index}] value type`);
      assert.ok(value.trim(), `${word}.${field}[${index}] has an empty value`);
    }
  }
};

test('101-150 pack contains the exact reviewed batch', () => {
  assert.deepEqual(Object.keys(manualCardPacks101150), expectedWords);
});

test('every card explicitly satisfies the complete-detail contract', () => {
  for (const [word, card] of Object.entries(manualCardPacks101150)) {
    for (const key of requiredKeys) {
      assert.ok(Object.hasOwn(card, key), `${word} omits ${key}`);
      assert.ok(Array.isArray(card[key]), `${word}.${key} must be an array`);
    }

    assert.ok(card.meanings.length >= 1, `${word} has no reviewed meaning`);
    assert.equal(card.fixedPhrases.length, 12, `${word} must have 12 fixed phrases`);
    assert.equal(card.contexts.length, 4, `${word} must have 4 context categories`);
    assert.equal(card.contexts.flatMap(([, rows]) => rows).length, 16,
      `${word} must have 16 context phrases`);
    assert.ok(card.synonyms.length >= 5, `${word} must have at least 5 synonyms`);
    assert.ok(card.antonyms.length >= 3, `${word} must have at least 3 sense-scoped antonyms`);
    assert.ok(card.confusables.length >= 2, `${word} must have at least 2 concrete confusables`);
    assert.ok(card.related.length >= 3, `${word} must have at least 3 related categories`);
    assert.equal(card.related.flatMap(([, rows]) => rows).length, 12,
      `${word} must have 12 related words`);
    assert.ok(card.commonErrors.length >= 2, `${word} must have 2 common errors`);

    assertTupleStrings(word, 'meanings', card.meanings, 5);
    assertTupleStrings(word, 'fixedPhrases', card.fixedPhrases, 4);
    assertTupleStrings(word, 'derivatives', card.derivatives, 4);
    assertTupleStrings(word, 'synonyms', card.synonyms, 4);
    assertTupleStrings(word, 'antonyms', card.antonyms, 4);
    assertTupleStrings(word, 'confusables', card.confusables, 4);
    assertTupleStrings(word, 'commonErrors', card.commonErrors, 3);

    for (const [category, rows] of card.contexts) {
      assert.ok(category.trim(), `${word} has an empty context category`);
      assert.equal(rows.length, 4, `${word}.${category} must contain 4 phrases`);
      assertTupleStrings(word, `contexts.${category}`, rows, 2);
    }
    for (const [category, rows] of card.related) {
      assert.ok(category.trim(), `${word} has an empty related category`);
      assertTupleStrings(word, `related.${category}`, rows, 3);
    }
  }
});

test('independent sections contain no exact duplicates or fixed/context reuse', () => {
  for (const [word, card] of Object.entries(manualCardPacks101150)) {
    const fixed = card.fixedPhrases.map(([phrase]) => phrase.toLowerCase());
    const contexts = card.contexts.flatMap(([, rows]) =>
      rows.map(([phrase]) => phrase.toLowerCase()));
    const related = card.related.flatMap(([, rows]) =>
      rows.map(([entry]) => entry.toLowerCase()));

    assert.equal(new Set(fixed).size, fixed.length, `${word} repeats a fixed phrase`);
    assert.equal(new Set(contexts).size, contexts.length, `${word} repeats a context phrase`);
    assert.equal(new Set(related).size, related.length, `${word} repeats a related word`);
    assert.deepEqual(contexts.filter((phrase) => fixed.includes(phrase)), [],
      `${word} reuses a fixed phrase as a context phrase`);

    const relationWords = [...card.derivatives, ...card.synonyms, ...card.antonyms, ...card.confusables]
      .map(([entry]) => entry.toLowerCase());
    assert.equal(new Set(relationWords).size, relationWords.length,
      `${word} repeats an entry across relation sections`);
    assert.deepEqual(related.filter((entry) => relationWords.includes(entry)), [],
      `${word} reuses a relation word in related vocabulary`);
  }
});

test('all 600 fixed-phrase examples are independent and non-mechanical', () => {
  const examples = Object.values(manualCardPacks101150)
    .flatMap((card) => card.fixedPhrases.map(([, , example]) => example));
  const genericFrame = /^(We will|They can|Please(?:\s|$)|You should|The team plans to|It may help to|We decided to|They were able to|It is important to|She learned to|We can|They agreed to)/;

  assert.equal(examples.length, 600);
  assert.equal(new Set(examples).size, examples.length,
    'fixed-phrase examples must not be copied across cards');
  for (const example of examples) {
    assert.doesNotMatch(example, genericFrame, `mechanical example frame: ${example}`);
  }
});

test('reviewed text contains no known placeholders or system-facing labels', () => {
  const forbidden = /相近的常用表达|容易混淆的表达|目标词|本词卡|人工精校|reviewed\s*:/i;
  for (const [word, card] of Object.entries(manualCardPacks101150)) {
    assert.doesNotMatch(JSON.stringify(card), forbidden, `${word} contains placeholder text`);
  }
});

test('mobile screenshot regressions for avoid and encourage stay fully populated', () => {
  const sectionCounts = (card) => ({
    fixed: card.fixedPhrases.length,
    contexts: card.contexts.flatMap(([, rows]) => rows).length,
    derivatives: card.derivatives.length,
    synonyms: card.synonyms.length,
    related: card.related.flatMap(([, rows]) => rows).length
  });

  assert.deepEqual(sectionCounts(manualCardPacks101150.avoid), {
    fixed: 12, contexts: 16, derivatives: 4, synonyms: 5, related: 12
  });
  assert.deepEqual(sectionCounts(manualCardPacks101150.encourage), {
    fixed: 12, contexts: 16, derivatives: 7, synonyms: 5, related: 12
  });
});

test('final semantic audit keeps relation notes specific and removes padded word-family forms', () => {
  for (const [word, card] of Object.entries(manualCardPacks101150)) {
    for (const [field, minimum] of [
      ['derivatives', 12],
      ['synonyms', 20],
      ['antonyms', 16],
      ['confusables', 16]
    ]) {
      for (const [index, row] of card[field].entries()) {
        assert.ok(row[3].trim().length >= minimum,
          `${word}.${field}[${index}] needs a concrete usage boundary`);
      }
    }
    assert.equal(new Set(card.synonyms.map(([, , , note]) => note)).size,
      card.synonyms.length, `${word} repeats a synonym distinction`);
  }

  assert.equal(
    manualCardPacks101150.pass.contexts[3][1][0][1],
    '与好友相处时光飞逝'
  );
  assert.equal(
    manualCardPacks101150.solve.contexts[3][1][3][1],
    '自动化解决排程问题'
  );
  assert.equal(
    manualCardPacks101150.realize.fixedPhrases[1][0],
    'realize the importance of something'
  );
  assert.equal(
    manualCardPacks101150.prefer.fixedPhrases[7][0],
    'prefer doing something to doing something else'
  );

  const excludedLowValueForms = new Set([
    'agreeably', 'chooser', 'descriptively', 'reducer', 'solvability'
  ]);
  const visibleDerivatives = Object.values(manualCardPacks101150)
    .flatMap((card) => card.derivatives.map(([word]) => word));
  assert.deepEqual(
    visibleDerivatives.filter((word) => excludedLowValueForms.has(word)),
    []
  );
  const spokenSources = Object.values(manualCardPacks101150).flatMap((card) => [
    ...card.fixedPhrases.map(([phrase]) => phrase),
    ...card.contexts.flatMap(([, items]) => items.map(([phrase]) => phrase)),
    ...card.commonErrors.flatMap(([wrong, right]) => [wrong, right])
  ]);
  assert.deepEqual(spokenSources.filter((source) => /\d/.test(source)), [],
    'learner-facing sources with IPA must spell numbers out instead of silently dropping digits');
  assert.ok(manualCardPacks101150.encourage.derivatives.length >= 7,
    'encourage must retain its evidence-backed verb/noun/adjective/adverb family');
  assert.ok(manualCardPacks101150.avoid.derivatives.length >= 4,
    'avoid must retain its evidence-backed common word family');
  assert.ok(manualCardPacks101150.encourage.antonyms.length >= 1);
  assert.ok(manualCardPacks101150.avoid.antonyms.length >= 1);
  assert.ok(manualCardPacks101150.encourage.confusables.length >= 1);
  assert.ok(manualCardPacks101150.avoid.confusables.length >= 1);
  for (const [word, derivativeWord] of [
    ['base', 'based'], ['report', 'reportable'], ['report', 'reportedly'],
    ['raise', 'raised'], ['increase', 'increased'], ['cut', 'uncut']
  ]) assert.ok(manualCardPacks101150[word].derivatives.some(([candidate]) => candidate === derivativeWord),
    `${word} must retain common derivative ${derivativeWord}`);
  assert.ok(manualCardPacks101150.cut.antonyms.some(([word]) => word === 'join'));
  assert.ok(manualCardPacks101150.cut.antonyms.some(([word]) => word === 'increase'));
});

test('final human review preserves audited sense and phrase corrections', () => {
  const hasSense = (word, partOfSpeech, chineseFragment) =>
    manualCardPacks101150[word].meanings.some(([pos, , chinese]) =>
      pos === partOfSpeech && chinese.includes(chineseFragment));

  for (const [word, chineseFragment] of [
    ['support', '支持'],
    ['pick', '首选'],
    ['increase', '增加'],
    ['notice', '通知'],
    ['handle', '把手']
  ]) {
    assert.ok(hasSense(word, 'n.', chineseFragment),
      `${word} must retain its common noun sense`);
  }

  assert.equal(
    manualCardPacks101150.develop.meanings
      .filter(([, english]) => /photographic|film/i.test(english)).length,
    1,
    'develop must contain one non-duplicated photographic-film sense'
  );
  assert.equal(manualCardPacks101150.report.fixedPhrases[8][1], '报告亏损');
  assert.equal(manualCardPacks101150.reduce.fixedPhrases[9][2],
    'Reduce the sauce by one third over low heat.');
  assert.equal(manualCardPacks101150.manage.fixedPhrases[10][0],
    'manage well under pressure');
  assert.equal(manualCardPacks101150.improve.fixedPhrases[8][0],
    'improve by ten percent');
  assert.equal(manualCardPacks101150.achieve.commonErrors[1][1],
    'The project made great progress.');
  assert.equal(manualCardPacks101150.support.derivatives[1][2],
    '给予支持的；支持性的');
  assert.ok(manualCardPacks101150.depend.derivatives.some(([word, pos]) =>
    word === 'dependable' && pos === 'adj.'),
  'depend must retain the common adjective dependable');

  assert.deepEqual(
    manualCardPacks101150.share.confusables[0].slice(0, 3),
    ['shear', 'v.', '剪羊毛；剪切']
  );
  assert.deepEqual(
    manualCardPacks101150.depend.antonyms[0].slice(0, 3),
    ['do without', 'phr.v.', '无需；没有……也能应付']
  );
});
