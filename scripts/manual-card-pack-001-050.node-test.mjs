import assert from "node:assert/strict";
import test from "node:test";
import { manualCardPacks001050 } from "./manual-card-pack-001-050.mjs";

const expectedWords = [
  "be", "have", "do", "say", "go", "get", "can", "know", "will", "would",
  "make", "think", "see", "come", "take", "want", "could", "look", "use", "tell",
  "find", "give", "need", "should", "try", "let", "call", "may", "mean", "feel",
  "ask", "talk", "keep", "leave", "put", "like", "help", "start", "become", "happen",
  "show", "seem", "might", "hear", "believe", "play", "turn", "run", "live",
];

const mandatoryKeys = [
  "meanings", "fixedPhrases", "contexts", "derivatives", "synonyms",
  "antonyms", "confusables", "related", "commonErrors",
];
const relationKeys = ["derivatives", "synonyms", "antonyms", "confusables"];
const bannedText = /no placeholder|wordnet|相近的常用表达|上位概念|具体表达|this phrase is useful/i;
const norm = (value) => String(value).trim().toLocaleLowerCase("en-US").replace(/[’]/g, "'");

const assertRows = (word, field, rows, length) => {
  const allowedLengths = Array.isArray(length) ? length : [length];
  assert.ok(Array.isArray(rows), `${word}.${field} must be an array`);
  rows.forEach((row, index) => {
    assert.ok(Array.isArray(row), `${word}.${field}[${index}] must be an array`);
    assert.ok(
      allowedLengths.includes(row.length),
      `${word}.${field}[${index}] must have ${allowedLengths.join(" or ")} cells`,
    );
    row.forEach((cell, cellIndex) => {
      assert.equal(typeof cell, "string", `${word}.${field}[${index}][${cellIndex}] must be text`);
      assert.ok(cell.trim(), `${word}.${field}[${index}][${cellIndex}] must not be blank`);
      assert.doesNotMatch(cell, bannedText, `${word}.${field}[${index}] contains placeholder/template language`);
    });
  });
};

test("pack covers exactly sequences 1-50 except locked work", () => {
  assert.deepEqual(Object.keys(manualCardPacks001050), expectedWords);
  assert.equal(Object.hasOwn(manualCardPacks001050, "work"), false);
});

test("every card meets the locked visible-completeness contract", () => {
  for (const [word, card] of Object.entries(manualCardPacks001050)) {
    mandatoryKeys.forEach((key) => assert.ok(Array.isArray(card[key]), `${word}.${key} missing`));

    assert.ok(card.meanings.length >= 1, `${word}: at least one meaning required`);
    assertRows(word, "meanings", card.meanings, 5);

    assert.equal(card.fixedPhrases.length, 12, `${word}: fixedPhrases must be exactly 12`);
    assertRows(word, "fixedPhrases", card.fixedPhrases, 4);
    assert.equal(new Set(card.fixedPhrases.map((row) => norm(row[0]))).size, 12, `${word}: duplicate fixed phrase`);
    assert.equal(new Set(card.fixedPhrases.map((row) => norm(row[2]))).size, 12, `${word}: duplicate fixed example`);

    assert.equal(card.contexts.length, 4, `${word}: contexts must have exactly four concrete categories`);
    const contextRows = [];
    const contextCategories = new Set();
    card.contexts.forEach(([category, rows], groupIndex) => {
      assert.equal(typeof category, "string", `${word}.contexts[${groupIndex}] category must be text`);
      assert.ok(category.trim(), `${word}.contexts[${groupIndex}] category is blank`);
      assert.equal(rows.length, 4, `${word}.${category}: exactly four context phrases required`);
      assertRows(word, `contexts.${category}`, rows, 2);
      contextCategories.add(norm(category));
      contextRows.push(...rows);
    });
    assert.equal(contextCategories.size, 4, `${word}: context category names must be unique`);
    assert.equal(contextRows.length, 16, `${word}: contexts must total 16`);
    assert.equal(new Set(contextRows.map((row) => norm(row[0]))).size, 16, `${word}: duplicate context phrase`);
    const fixedSet = new Set(card.fixedPhrases.map((row) => norm(row[0])));
    contextRows.forEach(([phrase]) => assert.equal(fixedSet.has(norm(phrase)), false, `${word}: context duplicates fixed phrase: ${phrase}`));

    assertRows(word, "derivatives", card.derivatives, [4, 5]);
    ["synonyms", "antonyms", "confusables"].forEach((key) => assertRows(word, key, card[key], 4));
    assert.ok(card.synonyms.length >= 5, `${word}: at least five sense-specific synonyms required`);
    assert.ok(card.antonyms.length >= 3, `${word}: at least three sense-specific antonyms required`);
    assert.ok(card.confusables.length >= 2, `${word}: at least two useful confusables required`);
    assert.equal(new Set(card.synonyms.map((row) => norm(row[0]))).size, card.synonyms.length, `${word}: duplicate synonym`);

    assert.ok(card.related.length >= 3, `${word}: related needs at least three categories`);
    const relatedRows = [];
    const relatedCategories = new Set();
    card.related.forEach(([category, rows], groupIndex) => {
      assert.equal(typeof category, "string", `${word}.related[${groupIndex}] category must be text`);
      assert.ok(category.trim(), `${word}.related[${groupIndex}] category is blank`);
      assertRows(word, `related.${category}`, rows, 3);
      relatedCategories.add(norm(category));
      relatedRows.push(...rows);
    });
    assert.ok(relatedCategories.size >= 3, `${word}: related category names must be unique`);
    assert.equal(relatedRows.length, 12, `${word}: related must total exactly 12`);
    assert.equal(new Set(relatedRows.map((row) => norm(row[0]))).size, 12, `${word}: duplicate related word`);

    const relationshipWords = new Set(relationKeys.flatMap((key) => card[key].map((row) => norm(row[0]))));
    relatedRows.forEach(([relatedWord]) => {
      assert.equal(relationshipWords.has(norm(relatedWord)), false, `${word}: related word duplicates a relation: ${relatedWord}`);
      assert.notEqual(norm(relatedWord), norm(word), `${word}: related list contains the headword itself`);
    });

    assert.ok(card.commonErrors.length >= 2, `${word}: at least two word-specific errors required`);
    assertRows(word, "commonErrors", card.commonErrors, 3);
    card.commonErrors.forEach(([wrong, right]) => assert.notEqual(norm(wrong), norm(right), `${word}: error correction changes nothing`));

    assert.doesNotMatch(JSON.stringify(card), bannedText, `${word}: card contains banned filler/template language`);
  }
});

test("cross-review regressions stay fixed", () => {
  const packs = manualCardPacks001050;
  assert.deepEqual({
    fixed: packs.go.fixedPhrases.length,
    contexts: packs.go.contexts.flatMap(([, rows]) => rows).length,
    derivatives: packs.go.derivatives.length,
    synonyms: packs.go.synonyms.length,
    related: packs.go.related.flatMap(([, rows]) => rows).length,
  }, { fixed: 12, contexts: 16, derivatives: 4, synonyms: 5, related: 12 });
  assert.doesNotMatch(packs.be.synonyms[3][3], /；，/);
  assert.equal(packs.will.fixedPhrases[7][0], "a strong will to succeed");
  assert.match(packs.use.meanings[1][3], /uses/);
  assert.equal(packs.take.fixedPhrases[1][0], "take something into account");
  assert.match(packs.try.fixedPhrases[9][0], /different approach/);
  assert.match(packs.call.fixedPhrases[2][1], /虚张声势/);
  assert.match(packs.help.fixedPhrases[11][0], /God/);
  assert.equal(packs.start.fixedPhrases[3][2].includes("upload"), true);
  assert.equal(packs.like.fixedPhrases.some(([phrase]) => phrase === "as likely as not"), false);
  assert.match(packs.put.fixedPhrases[0][3], /晚归时间/);
  assert.match(packs.play.fixedPhrases[11][2], /brought/);
  assert.equal(packs.talk.fixedPhrases[0][0], 'talk some sense into someone');
  assert.equal(packs.could.fixedPhrases.at(-1)[0], 'as fast as someone could');
  assert.equal(packs.become.fixedPhrases[8][0], 'what becomes of someone');
  assert.equal(packs.might.fixedPhrases.at(-1)[0], 'might be expected to do something');
  assert.ok(packs.might.meanings.some(([partOfSpeech, english, chinese]) => partOfSpeech === 'n.' && /strength|power/i.test(english) && /力量/.test(chinese)));
  assert.equal(packs.play.commonErrors[0][0], 'She plays the piano good.');
  assert.match(packs.live.commonErrors[0][0], /since last year/);
  assert.doesNotMatch(packs.live.commonErrors[0][0], /\d/);
  assert.equal(packs.feel.contexts[3][1][3][0], "feel an atmosphere of quiet confidence");

  assert.ok(packs.get.meanings.length >= 5);
  assert.ok(packs.make.meanings.length >= 5);
  assert.ok(packs.see.meanings.length >= 5);
  assert.ok(packs.will.meanings.some(([, en]) => en.includes("legal document")));
  assert.ok(packs.mean.meanings.some(([, en]) => en.includes("particular consequence")));
  assert.ok(packs.mean.meanings.some(([, en]) => en.includes("unwilling to spend")));
  assert.ok(packs.mean.meanings.some(([, en]) => en.includes("method or way")));
  assert.ok(packs.help.meanings.some(([, en]) => en.includes("prevent or reduce")));
  assert.ok(packs.play.meanings.some(([, en]) => en.includes("role, influence, or effect")));
});
