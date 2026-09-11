import test from "node:test";
import assert from "node:assert/strict";
import { manualCardPacks051100 } from "./manual-card-pack-051-100.mjs";
import { ipaFor } from "./phonetics.mjs";
import { lexicon } from "./lexicon.mjs";

const expectedWords = "write bring move must begin love hold read stop pay provide lose understand wait meet thank change watch sit create learn kill include stand follow remember speak set allow win lead continue spend stay add die buy send walk grow open consider hope offer build expect fall appear serve break".split(" ");
const requiredKeys = ["meanings", "fixedPhrases", "contexts", "derivatives", "synonyms", "antonyms", "confusables", "related", "commonErrors"];
const normalized = (value) => String(value).trim().toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ");
const assertTuple = (word, path, item, length) => {
  assert.ok(Array.isArray(item), `${word}.${path} must contain arrays`);
  assert.equal(item.length, length, `${word}.${path} tuple width`);
  item.forEach((value, index) => assert.ok(typeof value === "string" && value.trim(), `${word}.${path}[${index}] must be non-empty text`));
};

test("batch contains exactly learningPriority.sequence 51-100 words", () => {
  assert.deepEqual(Object.keys(manualCardPacks051100), expectedWords);
});

test("every card explicitly supplies the nine reviewed fields", () => {
  for (const [word, pack] of Object.entries(manualCardPacks051100)) {
    for (const key of requiredKeys) assert.ok(Object.hasOwn(pack, key), `${word}.${key} is missing`);
    assert.ok(pack.meanings.length >= 1, `${word}.meanings must not be empty`);
    pack.meanings.forEach((item) => assertTuple(word, "meanings", item, 5));
    pack.derivatives.forEach((item) => assertTuple(word, "derivatives", item, 4));
    pack.antonyms.forEach((item) => assertTuple(word, "antonyms", item, 4));
    pack.confusables.forEach((item) => assertTuple(word, "confusables", item, 4));
  }
});

test("fixed phrases meet the 12-item bilingual-example hard line", () => {
  for (const [word, pack] of Object.entries(manualCardPacks051100)) {
    assert.equal(pack.fixedPhrases.length, 12, `${word}.fixedPhrases must contain 12 items`);
    pack.fixedPhrases.forEach((item) => assertTuple(word, "fixedPhrases", item, 4));
    const phrases = pack.fixedPhrases.map((item) => normalized(item[0]));
    const examples = pack.fixedPhrases.map((item) => normalized(item[2]));
    assert.equal(new Set(phrases).size, 12, `${word}.fixedPhrases contains duplicate phrases`);
    assert.equal(new Set(examples).size, 12, `${word}.fixedPhrases contains duplicate examples`);
  }
});

test("contexts contain four concrete categories and sixteen independent phrases", () => {
  for (const [word, pack] of Object.entries(manualCardPacks051100)) {
    assert.equal(pack.contexts.length, 4, `${word}.contexts must contain 4 categories`);
    const categoryNames = pack.contexts.map((group) => normalized(group[0]));
    assert.equal(new Set(categoryNames).size, 4, `${word}.contexts category names must be distinct`);
    const items = [];
    for (const group of pack.contexts) {
      assert.ok(Array.isArray(group) && group.length === 2, `${word}.contexts group must be [category, items]`);
      assert.ok(typeof group[0] === "string" && group[0].trim(), `${word}.contexts category must be non-empty text`);
      assert.ok(Array.isArray(group[1]), `${word}.contexts items must be an array`);
      assert.equal(group[1].length, 4, `${word}.contexts.${group[0]} must contain 4 phrases`);
      group[1].forEach((item) => { assertTuple(word, `contexts.${group[0]}`, item, 2); items.push(item); });
    }
    const phrases = items.map((item) => normalized(item[0]));
    assert.equal(new Set(phrases).size, 16, `${word}.contexts contains duplicate phrases`);
    const fixed = new Set(pack.fixedPhrases.map((item) => normalized(item[0])));
    assert.deepEqual(phrases.filter((phrase) => fixed.has(phrase)), [], `${word}.contexts must not copy fixedPhrases verbatim`);
  }
});

test("relations are precise, sufficient, and not count padding", () => {
  for (const [word, pack] of Object.entries(manualCardPacks051100)) {
    assert.ok(pack.synonyms.length >= 5, `${word}.synonyms must contain at least 5 reviewed items`);
    pack.synonyms.forEach((item) => assertTuple(word, "synonyms", item, 4));
    assert.equal(new Set(pack.synonyms.map((item) => normalized(item[0]))).size, pack.synonyms.length, `${word}.synonyms contains duplicates`);
    const vagueNotes = /^(?:近义词|意思接近|与.+意思接近|可替换|含义相近)$/;
    for (const item of [...pack.synonyms, ...pack.antonyms, ...pack.confusables]) {
      assert.ok(!vagueNotes.test(item[3].trim()), `${word} has a template-like relation note: ${item[3]}`);
    }
  }
});

test("related vocabulary has at least three real categories and twelve unique non-relation words", () => {
  for (const [word, pack] of Object.entries(manualCardPacks051100)) {
    assert.ok(pack.related.length >= 3, `${word}.related must contain at least 3 categories`);
    const relatedItems = [];
    for (const group of pack.related) {
      assert.ok(Array.isArray(group) && group.length === 2, `${word}.related group must be [category, items]`);
      assert.ok(typeof group[0] === "string" && group[0].trim(), `${word}.related category must be non-empty text`);
      assert.ok(Array.isArray(group[1]), `${word}.related items must be an array`);
      assert.ok(group[1].length >= 1, `${word}.related.${group[0]} is empty`);
      group[1].forEach((item) => { assertTuple(word, `related.${group[0]}`, item, 3); relatedItems.push(item); });
    }
    assert.ok(relatedItems.length >= 12, `${word}.related must contain at least 12 words`);
    const relatedWords = relatedItems.map((item) => normalized(item[0]));
    assert.equal(new Set(relatedWords).size, relatedWords.length, `${word}.related contains duplicates`);
    const relationWords = new Set([...pack.derivatives, ...pack.synonyms, ...pack.antonyms, ...pack.confusables].map((item) => normalized(item[0])));
    assert.deepEqual(relatedWords.filter((item) => relationWords.has(item)), [], `${word}.related repeats a derivative/synonym/antonym/confusable`);
  }
});

test("common errors are word-specific correction pairs", () => {
  const generic = /^(?:can to|to \w+s$)/i;
  for (const [word, pack] of Object.entries(manualCardPacks051100)) {
    assert.ok(pack.commonErrors.length >= 2, `${word}.commonErrors must contain at least 2 items`);
    for (const item of pack.commonErrors) {
      assertTuple(word, "commonErrors", item, 3);
      assert.notEqual(normalized(item[0]), normalized(item[1]), `${word}.commonErrors wrong/right are identical`);
      assert.ok(!generic.test(item[0].trim()), `${word}.commonErrors contains a generic generated error`);
      assert.ok(item[2].includes(word) || item[2].length >= 18, `${word}.commonErrors explanation is too vague`);
    }
  }
});

test("reviewed strings contain no hidden or malformed generation residue", () => {
  const serialized = JSON.stringify(manualCardPacks051100);
  assert.ok(!/[\u200B-\u200D\uFEFF]/u.test(serialized), "hidden zero-width character found");
  assert.ok(!/WordNet|人工精校|机械生成|占位|TODO|TBD/i.test(serialized), "internal/generation label leaked into card content");
  assert.ok(!/confidence\s*:|valid JSON|assistant's final/i.test(serialized), "model chatter leaked into card content");
});

test("every spoken source item has upstream American IPA coverage", () => {
  const headwordIpa = new Map(lexicon.map((item) => [item.w, item.ipa]));
  const assertIpa = (word, path, text, useHeadword = false) => {
    const ipa = useHeadword ? ipaFor(text, word, headwordIpa.get(word) ?? "") : ipaFor(text);
    assert.match(ipa, /^\/.+\/$/u, `${word}.${path} has no usable IPA: ${text}`);
    assert.ok(!/[?]/u.test(ipa), `${word}.${path} IPA contains an unresolved token: ${text} -> ${ipa}`);
  };

  for (const [word, pack] of Object.entries(manualCardPacks051100)) {
    const targetIpa = headwordIpa.get(word) ?? ipaFor(word);
    for (const item of pack.meanings) {
      const definitionIpa = ipaFor(item[1], word, targetIpa);
      const exampleIpa = ipaFor(item[3], word, targetIpa);
      assert.match(definitionIpa, /^\/.+\/$/u, `${word}.meanings.definition has no usable IPA: ${item[1]}`);
      assert.match(exampleIpa, /^\/.+\/$/u, `${word}.meanings.example has no usable IPA: ${item[3]}`);
    }
    for (const [groupName, items] of pack.contexts) {
      for (const item of items) {
        const ipa = ipaFor(item[0], word, targetIpa);
        assert.match(ipa, /^\/.+\/$/u, `${word}.contexts.${groupName} has no usable IPA: ${item[0]}`);
      }
    }
    for (const item of pack.fixedPhrases) {
      const phraseIpa = ipaFor(item[0], word, targetIpa);
      const exampleIpa = ipaFor(item[2], word, targetIpa);
      assert.match(phraseIpa, /^\/.+\/$/u, `${word}.fixedPhrases.phrase has no usable IPA: ${item[0]}`);
      assert.match(exampleIpa, /^\/.+\/$/u, `${word}.fixedPhrases.example has no usable IPA: ${item[2]}`);
    }
    for (const [field, items] of Object.entries({
      derivatives: pack.derivatives,
      synonyms: pack.synonyms,
      antonyms: pack.antonyms,
      confusables: pack.confusables,
    })) {
      for (const item of items) assertIpa(word, field, item[0]);
    }
    for (const [groupName, items] of pack.related) {
      for (const item of items) assertIpa(word, `related.${groupName}`, item[0]);
    }
    for (const item of pack.commonErrors) {
      const wrongIpa = ipaFor(item[0], word, targetIpa);
      const correctionIpa = ipaFor(item[1], word, targetIpa);
      assert.match(wrongIpa, /^\/.+\/$/u, `${word}.commonErrors.wrong has no usable IPA: ${item[0]}`);
      assert.match(correctionIpa, /^\/.+\/$/u, `${word}.commonErrors.correction has no usable IPA: ${item[1]}`);
    }
  }
});

test("reviewed semantic and pronunciation regressions stay fixed", () => {
  const serialized = JSON.stringify(manualCardPacks051100);
  assert.ok(!/早饭前運狗|tables waiting to be served|an opportunity waiting to happen|have luck to thank|lead electricity safely to ground/u.test(serialized));

  assert.deepEqual(
    manualCardPacks051100.set.meanings.find((item) => item[2].includes("落山"))?.slice(0, 3),
    ["v.", "to move below the horizon", "落下；落山"],
  );
  assert.equal(manualCardPacks051100.love.contexts.flatMap((group) => group[1]).find((item) => item[0].startsWith("love a partner"))?.[1], "爱伴侣而不试图改变对方");
  for (const [word, expected] of Object.entries({
    must: 'must be able to do something',
    love: 'would love to do something',
    understand: 'be understood to have done something',
    wait: 'cannot wait to do something',
    win: 'win the right to do something',
    expect: 'be widely expected to do something',
    appear: 'appear likely to do something'
  })) assert.ok(manualCardPacks051100[word].fixedPhrases.some(([phrase]) => phrase === expected), `${word}: missing complete infinitive fixed phrase`);

  const unsupportedHeteronyms = new Set([
    "conduct|v.",
    "learned|adj.",
    "lead|v.",
    "use|v.",
    "live|v.",
    "close|v.",
    "present|v.",
  ]);
  for (const [word, pack] of Object.entries(manualCardPacks051100)) {
    for (const [field, items] of Object.entries({
      derivatives: pack.derivatives,
      synonyms: pack.synonyms,
      antonyms: pack.antonyms,
      confusables: pack.confusables,
    })) {
      for (const item of items) {
        assert.ok(!unsupportedHeteronyms.has(`${normalized(item[0])}|${normalized(item[1])}`), `${word}.${field} relies on an ambiguous bare-form IPA: ${item[0]} ${item[1]}`);
      }
    }
  }
});
