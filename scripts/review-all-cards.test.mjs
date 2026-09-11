import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  checkReviewReportFreshness,
  computeReviewSourceDigests,
  DEFAULT_REVIEW_PATHS,
  EXPECTED_CARD_COUNT,
  exitCodeForReport,
  projectRoot,
  reviewCatalog,
  resolveReviewMinimums,
  runCardReview
} from './review-all-cards.mjs';

const temporaryDirectories = [];
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex').toUpperCase();

const templateText = [
  '### 1. 核心记忆',
  '### 2. 固定搭配和短语',
  '### 3. 常用语境词组',
  '### 4. 派生词',
  '### 5. 近义词',
  '### 6. 反义词',
  '### 7. 易混词',
  '### 8. 同类词汇分类',
  '## 后台例句与练习数据',
  '## 禁止内容'
].join('\n\n');

function makeQuestions(word) {
  const questions = [];
  for (let index = 0; index < 5; index += 1) {
    questions.push({
      id: `${word}-meaning-${index}`,
      type: 'meaning_choice',
      prompt: `Choose the correct meaning for ${word}, version ${index}.`,
      options: [`meaning-${index}`, `distractor-a-${index}`, `distractor-b-${index}`],
      answer: `meaning-${index}`,
      stage: 'T0',
      ai: false
    });
  }
  for (let index = 0; index < 5; index += 1) {
    questions.push({
      id: `${word}-collocation-${index}`,
      type: 'collocation',
      prompt: `Complete natural expression ${index} with ${word}.`,
      answer: word,
      stage: 'T1',
      ai: false
    });
  }
  questions.push(
    { id: `${word}-recall-0`, type: 'recall', prompt: `Write ${word} from its English definition.`, answer: word, stage: 'T1', ai: false },
    { id: `${word}-recall-1`, type: 'recall', prompt: `Write ${word} from its Chinese meaning.`, answer: word, stage: 'T1', ai: false },
    { id: `${word}-sentence-0`, type: 'free_sentence', prompt: `Write a natural sentence using ${word}.`, answer: '', stage: 'T2', ai: true },
    { id: `${word}-sentence-1`, type: 'free_sentence', prompt: `Write a workplace sentence using ${word}.`, answer: '', stage: 'T3', ai: true },
    { id: `${word}-dialogue`, type: 'dialogue', prompt: `Write a short dialogue using ${word}.`, answer: '', stage: 'T4', ai: true }
  );
  return questions;
}

function makeCard(index) {
  const word = `reviewword${index + 1}`;
  const id = `${word}-v`;
  const contextPhrases = Array.from({ length: 4 }, (_, groupIndex) => ({
    category: `真实语境${groupIndex + 1}`,
    items: Array.from({ length: 4 }, (_, itemIndex) => ({
      phrase: `${word} in context ${groupIndex + 1} ${itemIndex + 1}`,
      phonetic: '/ɹɪˈvjuː/',
      chinese: `语境${groupIndex + 1}-${itemIndex + 1}`
    }))
  }));
  const fixedPhrases = Array.from({ length: 12 }, (_, phraseIndex) => ({
    phrase: `${word} useful phrase ${phraseIndex + 1}`,
    phonetic: '/ɹɪˈvjuː/',
    chinese: `搭配${phraseIndex + 1}`,
    example: `People ${word} useful phrase ${phraseIndex + 1} every day.`,
    translation: `人们每天使用搭配${phraseIndex + 1}。`
  }));
  const synonyms = Array.from({ length: 5 }, (_, relationIndex) => ({
    word: `synonym${index + 1}-${relationIndex + 1}`,
    phonetic: '/ˈsɪnəˌnɪm/',
    partOfSpeech: 'v.',
    chinese: `近义动作${relationIndex + 1}`,
    difference: `synonym${index + 1}-${relationIndex + 1} 侧重具体方式；${word} 表示一般动作，两者的宾语范围不同。`
  }));
  const antonyms = Array.from({ length: index === 0 ? 4 : 3 }, (_, relationIndex) => ({
    word: `antonym${index + 1}-${relationIndex + 1}`,
    phonetic: '/ˈæntəˌnɪm/',
    partOfSpeech: 'v.',
    chinese: `反向动作${relationIndex + 1}`,
    usage: `${word} 表示完成第${relationIndex + 1}类动作；antonym${index + 1}-${relationIndex + 1} 表示该义项的相反结果，适用范围不同。`
  }));
  const confusables = Array.from({ length: index === 0 ? 4 : 2 }, (_, relationIndex) => ({
    word: `confusable${index + 1}-${relationIndex + 1}`,
    phonetic: '/kənˈfjuːzəbəl/',
    partOfSpeech: 'v.',
    chinese: `易混动作${relationIndex + 1}`,
    difference: `${word} 表示复核信息；confusable${index + 1}-${relationIndex + 1} 表示处理信息，二者的宾语和动作结果不同。`
  }));
  const relatedVocabulary = Array.from({ length: 3 }, (_, groupIndex) => ({
    category: `语义领域${groupIndex + 1}`,
    items: Array.from({ length: 4 }, (_, itemIndex) => ({
      word: `topic${index + 1}-${groupIndex + 1}-${itemIndex + 1}`,
      phonetic: '/ˈtɑpɪk/',
      partOfSpeech: 'n.',
      chinese: `领域词${groupIndex + 1}-${itemIndex + 1}`
    }))
  }));
  return {
    id,
    word,
    cocaRanks: [{ rank: index + 1, pos: 'v', frequency: 1000 - index, partOfSpeech: 'v.' }],
    cocaRankLabel: `v. 第 ${index + 1} 名`,
    learningPriority: {
      sequence: index + 1,
      group: 'verb',
      groupLabel: '动词',
      groupOrder: 1,
      primaryCocaRank: index + 1
    },
    phonetic: '/ɹɪˈvjuː/',
    syllables: `${word}（3 音节）`,
    partOfSpeech: 'v.',
    templateVersion: 'test-template-1',
    contentVersion: 'test-content-1',
    detailLevel: index === 0 ? 'template-reference' : 'template-curated',
    curationSource: index === 0 ? 'locked-reference-example' : 'manual-semantic-pack-test-template-1',
    reviewed: true,
    coreMemory: {
      chinese: '复核',
      english: 'to inspect something carefully',
      example: `We ${word} the material carefully.`,
      exampleChinese: '我们仔细复核这份材料。',
      structures: Array.from({ length: 3 }, (_, structureIndex) => ({
        phrase: `${word} structure ${structureIndex + 1}`,
        phonetic: '/ɹɪˈvjuː/',
        chinese: `核心结构${structureIndex + 1}`
      })),
      commonErrors: Array.from({ length: 2 }, (_, errorIndex) => ({
        wrong: `${word} wrong ${errorIndex + 1}`,
        wrongPhonetic: '/ɹɔŋ/',
        right: `${word} right ${errorIndex + 1}`,
        rightPhonetic: '/ɹaɪt/',
        note: `使用完整结构${errorIndex + 1}。`
      }))
    },
    meanings: [{
      partOfSpeech: 'v.',
      english: 'to inspect something carefully',
      chinese: '仔细复核',
      example: `We ${word} every detail.`,
      translation: '我们仔细复核每个细节。'
    }],
    contextPhrases,
    fixedPhrases,
    synonyms,
    antonyms,
    derivatives: [],
    confusables,
    relatedVocabulary,
    examples: Array.from({ length: 12 }, (_, exampleIndex) => ({
      scene: `场景${exampleIndex + 1}`,
      english: `Example ${exampleIndex + 1} shows how people ${word} information.`,
      chinese: `例句${exampleIndex + 1}展示人们如何复核信息。`
    })),
    studyFocus: {
      coreMeaning: '记住仔细复核的核心义。',
      keyCollocation: '记住介词与宾语范围。',
      commonMistake: '不要省略必要的介词。',
      mustUseExample: `We ${word} every detail.`
    },
    questions: makeQuestions(word)
  };
}

function makeFixture() {
  const cards = Array.from({ length: EXPECTED_CARD_COUNT }, (_, index) => makeCard(index));
  const cardIds = cards.map((card) => card.id);
  const templateLock = {
    lockVersion: 'test-template-1',
    immutable: true,
    appliedSpecification: { path: 'test-template-1.md', sha256: hash(templateText) },
    referenceCard: {
      cardId: cards[0].id,
      word: cards[0].word,
      recordedShape: {
        meaningRows: 1,
        contextCategories: 4,
        contextItems: 16,
        fixedPhrases: 12,
        synonyms: 5,
        antonyms: 4,
        derivatives: 0,
        confusables: 4,
        relatedCategories: 3,
        relatedItems: 12,
        highFrequencyExamples: 12
      }
    },
    publishedCardMinimums: {
      contextCategories: 4,
      contextItems: 16,
      fixedPhrases: 12,
      synonyms: 5,
      antonyms: 3,
      confusables: 2,
      relatedCategories: 3,
      relatedItems: 12,
      highFrequencyExamples: 12
    },
    curatedCardMinimums: {
      contextCategories: 4,
      contextItems: 16,
      fixedPhrases: 12,
      synonyms: 5,
      antonyms: 3,
      confusables: 2,
      relatedCategories: 3,
      relatedItems: 12,
      highFrequencyExamples: 12
    },
    qualityContract: {
      coreStructures: 3,
      commonErrorPairs: 2,
      minimumAntonymsPerCard: 3,
      minimumConfusablesPerCard: 2
    }
  };
  return {
    catalog: { contentVersion: 'test-content-1', templateVersion: 'test-template-1', total: cards.length, cards },
    release: {
      releaseVersion: 'test-content-1',
      contentVersion: 'test-content-1',
      templateVersion: 'test-template-1',
      templateLockVersion: 'test-template-1'
    },
    manifest: {
      contentVersion: 'test-content-1',
      templateVersion: 'test-template-1',
      cardIds,
      reviewedCardIds: [...cardIds]
    },
    templateLock,
    templateText
  };
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => fs.rm(directory, { recursive: true, force: true })));
});

describe('full 150-card review', () => {
  it('locks build, verify, and production deployment to the complete ordered review chain', async () => {
    const packageJson = JSON.parse(await fs.readFile(path.join(projectRoot, 'package.json'), 'utf8'));
    const release = JSON.parse(await fs.readFile(path.join(projectRoot, 'content', 'release.json'), 'utf8'));
    const runtimeRelease = await fs.readFile(path.join(projectRoot, 'src', 'config', 'release.ts'), 'utf8');
    const buildScript = await fs.readFile(path.join(projectRoot, 'scripts', 'build-content.mjs'), 'utf8');
    const validateScript = await fs.readFile(path.join(projectRoot, 'scripts', 'validate-content.mjs'), 'utf8');
    const versionedTemplates = (await fs.readdir(path.join(projectRoot, 'content', 'templates')))
      .filter((name) => /^learning-template-\d{4}\.\d{2}\.\d{2}\.\d+\.md$/.test(name));
    const requiredStages = [
      'pnpm run content:build',
      'pnpm run content:validate',
      'pnpm run content:review',
      'pnpm test',
      'tsc -b',
      'vite build'
    ];
    for (const scriptName of ['build', 'verify']) {
      const command = packageJson.scripts[scriptName];
      expect(command).toEqual(expect.any(String));
      let previousIndex = -1;
      for (const stage of requiredStages) {
        const stageIndex = command.indexOf(stage);
        expect(stageIndex, `${scriptName} must include ${stage}`).toBeGreaterThan(previousIndex);
        previousIndex = stageIndex;
      }
    }
    expect(packageJson.scripts['predeploy:production']).toBe('pnpm run verify');
    expect(release).toMatchObject({
      releaseVersion: '2026.09.11.1',
      contentVersion: '2026.09.11.1',
      templateVersion: 'learning-template-2026.09.11.1',
      templateLockVersion: '2026.09.11.1',
      catalogHash: '5FFC8AC4A300193486681AB1DE1134A96774C813AEDF8F90D8E42565121EDBED',
      evaluationRubricVersion: '2026.08.19.2',
      reviewScheduleVersion: '2026.08.19.2'
    });
    expect(versionedTemplates).toEqual(['learning-template-2026.09.11.1.md']);
    for (const source of [runtimeRelease, buildScript, validateScript]) {
      expect(source).toContain("releaseVersion: '2026.09.11.1'");
      expect(source).toContain("contentVersion: '2026.09.11.1'");
      expect(source).toContain("templateVersion: 'learning-template-2026.09.11.1'");
      expect(source).toContain("catalogHash: '5FFC8AC4A300193486681AB1DE1134A96774C813AEDF8F90D8E42565121EDBED'");
      expect(source).toContain("evaluationRubricVersion: '2026.08.19.2'");
      expect(source).toContain("reviewScheduleVersion: '2026.08.19.2'");
    }
  });

  it('keeps explicit floors while allowing omitted adaptive counts to resolve to zero', () => {
    const fixture = makeFixture();
    fixture.templateLock.publishedCardMinimums.contextItems = 14;
    fixture.templateLock.publishedCardMinimums.derivatives = 3;
    fixture.templateLock.publishedCardMinimums.contextCategories = 9;
    fixture.templateLock.curatedCardMinimums.contextItems = 10;
    delete fixture.templateLock.curatedCardMinimums.derivatives;
    fixture.templateLock.qualityContract.curatedContextCategories = 4;
    fixture.templateLock.adaptiveSections = {
      meaningRows: 'semantic',
      derivatives: 'semantic',
      antonyms: 'legacy-conflict-must-not-disable-an-explicit-floor',
      confusables: 'legacy-conflict-must-not-disable-an-explicit-floor'
    };
    const minimums = resolveReviewMinimums(fixture.templateLock);
    expect(minimums.published.contextItems).toBe(14);
    expect(minimums.curated.contextItems).toBe(10);
    expect(minimums.curated.contextCategories).toBe(4);
    expect(minimums.published.derivatives).toBe(3);
    expect(minimums.curated.derivatives).toBe(0);
    expect(minimums.curated.meaningRows).toBe(1);
    expect(minimums.published.antonyms).toBe(3);
    expect(minimums.curated.antonyms).toBe(3);
    expect(minimums.published.confusables).toBe(2);
    expect(minimums.curated.confusables).toBe(2);
  });

  it('emits one explicit passing row for each of 150 unique, complete cards', () => {
    const fixture = makeFixture();
    const report = reviewCatalog({ ...fixture, generatedAt: '2026-09-10T00:00:00.000Z' });
    expect(report.status).toBe('pass');
    expect(report.contract.contentVersion).toBe('test-content-1');
    expect(report.contract.templateLockVersion).toBe('test-template-1');
    expect(report.summary.reviewedCards).toBe(EXPECTED_CARD_COUNT);
    expect(report.cards).toHaveLength(EXPECTED_CARD_COUNT);
    expect(new Set(report.cards.map((card) => card.cardId)).size).toBe(EXPECTED_CARD_COUNT);
    expect(report.cards.every((card) => card.status === 'pass' && card.issues.length === 0)).toBe(true);
    expect(exitCodeForReport(report)).toBe(0);
  });

  it('fails a card when either mandatory relation section falls below the locked floor', () => {
    const fixture = makeFixture();
    fixture.catalog.cards[1].antonyms = fixture.catalog.cards[1].antonyms.slice(0, 2);
    fixture.catalog.cards[1].confusables = fixture.catalog.cards[1].confusables.slice(0, 1);

    const report = reviewCatalog({ ...fixture, generatedAt: '2026-09-11T00:00:00.000Z' });
    const reviewed = report.cards[1];
    expect(report.status).toBe('fail');
    expect(reviewed.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'SECTION_COUNT_BELOW_MINIMUM', path: 'antonyms' }),
      expect.objectContaining({ code: 'SECTION_COUNT_BELOW_MINIMUM', path: 'confusables' })
    ]));
  });

  it('rejects a coordinated lock downgrade and still enforces the immutable 3/2 relation floor', () => {
    const fixture = makeFixture();
    for (const shape of [
      fixture.templateLock.publishedCardMinimums,
      fixture.templateLock.curatedCardMinimums,
      fixture.templateLock.referenceCard.recordedShape
    ]) {
      shape.antonyms = 1;
      shape.confusables = 1;
    }
    fixture.templateLock.qualityContract.minimumAntonymsPerCard = 1;
    fixture.templateLock.qualityContract.minimumConfusablesPerCard = 1;
    fixture.catalog.cards[1].antonyms = fixture.catalog.cards[1].antonyms.slice(0, 1);
    fixture.catalog.cards[1].confusables = fixture.catalog.cards[1].confusables.slice(0, 1);

    const minimums = resolveReviewMinimums(fixture.templateLock);
    expect(minimums.published.antonyms).toBe(3);
    expect(minimums.curated.antonyms).toBe(3);
    expect(minimums.reference.antonyms).toBe(4);
    expect(minimums.published.confusables).toBe(2);
    expect(minimums.curated.confusables).toBe(2);
    expect(minimums.reference.confusables).toBe(4);

    const report = reviewCatalog({ ...fixture, generatedAt: '2026-09-11T00:00:00.000Z' });
    expect(report.status).toBe('fail');
    expect(report.collectionIssues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'QUALITY_CONTRACT_MISSING_OR_INVALID' }),
      expect.objectContaining({ code: 'TEMPLATE_MINIMUM_MISSING_OR_INVALID' })
    ]));
    expect(report.cards[1].issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'SECTION_COUNT_BELOW_MINIMUM', path: 'antonyms' }),
      expect.objectContaining({ code: 'SECTION_COUNT_BELOW_MINIMUM', path: 'confusables' })
    ]));
  });

  it('passes the card headword into relation review for concise two-sided distinctions', () => {
    const fixture = makeFixture();
    const card = fixture.catalog.cards[1];
    card.confusables = [{
      word: 'supply',
      phonetic: '/səˈplaɪ/',
      partOfSpeech: 'v.',
      chinese: '供应',
      difference: `${card.word} 是帮助或支撑，supply 是提供所需物品`
    }];

    const report = reviewCatalog({ ...fixture, generatedAt: '2026-09-10T00:00:00.000Z' });
    const reviewed = report.cards[1];
    expect(reviewed.issues.some((issue) => issue.code === 'RELATION_QUALITY_FAILURE')).toBe(false);
  });

  it('reports concrete per-card failures for review state, meanings, IPA, sections, duplicates, placeholders, and question meta copy', () => {
    const fixture = makeFixture();
    const card = fixture.catalog.cards[1];
    card.reviewed = false;
    card.meanings[0].translation = '';
    card.meanings[0].phonetic = '/meaning1/';
    card.contextPhrases[0].items[0].phrase = card.fixedPhrases[0].phrase;
    card.synonyms[0].chinese = '相近的常用表达';
    card.synonyms[0].difference = '只覆盖其中一个义项；是否能够替换取决于两词各自的宾语、介词和语体。';
    card.synonyms[1].word = card.synonyms[0].word;
    card.relatedVocabulary[0].items[0].word = card.synonyms[0].word;
    card.relatedVocabulary[0].items[1].word = card.word;
    card.questions = card.questions.slice(0, 14);
    card.questions[0].prompt = '根据本词卡找出目标词。';
    delete card.questions[0].options;
    card.questions[1].options[1] = '这个短语很实用';

    const report = reviewCatalog({ ...fixture, generatedAt: '2026-09-10T00:00:00.000Z' });
    const reviewed = report.cards[1];
    const codes = new Set(reviewed.issues.map((issue) => issue.code));
    expect(report.status).toBe('fail');
    expect(reviewed.status).toBe('fail');
    expect(codes.has('CARD_NOT_REVIEWED')).toBe(true);
    expect(codes.has('INCOMPLETE_MEANING')).toBe(true);
    expect(codes.has('INVALID_IPA')).toBe(true);
    expect(codes.has('CONTEXT_FIXED_OVERLAP')).toBe(true);
    expect(codes.has('RELATION_QUALITY_FAILURE')).toBe(true);
    expect(codes.has('DUPLICATE_RELATION_WORD')).toBe(true);
    expect(codes.has('CROSS_SECTION_WORD_DUPLICATE')).toBe(true);
    expect(codes.has('RELATED_SELF_REFERENCE')).toBe(true);
    expect(codes.has('SECTION_COUNT_BELOW_MINIMUM')).toBe(true);
    expect(codes.has('QUESTION_META_COPY')).toBe(true);
    expect(codes.has('INVALID_QUESTION_OPTIONS')).toBe(true);
    expect(codes.has('PLACEHOLDER_TEXT')).toBe(true);
    expect(codes.has('MECHANICAL_FILLER_TEXT')).toBe(true);
    expect(exitCodeForReport(report)).toBe(1);
  });

  it('fails the collection and both affected card rows when IDs and words are not 150 unique', () => {
    const fixture = makeFixture();
    fixture.catalog.cards[1].id = fixture.catalog.cards[0].id;
    fixture.catalog.cards[1].word = fixture.catalog.cards[0].word;
    fixture.manifest.cardIds[1] = fixture.catalog.cards[0].id;
    fixture.manifest.reviewedCardIds[1] = fixture.catalog.cards[0].id;
    const report = reviewCatalog({ ...fixture, generatedAt: '2026-09-10T00:00:00.000Z' });
    const collectionCodes = new Set(report.collectionIssues.map((issue) => issue.code));
    expect(collectionCodes.has('CARD_IDS_NOT_150_UNIQUE')).toBe(true);
    expect(collectionCodes.has('CARD_WORDS_NOT_150_UNIQUE')).toBe(true);
    expect(report.cards[0].issues.some((issue) => issue.code === 'DUPLICATE_CARD_ID')).toBe(true);
    expect(report.cards[0].issues.some((issue) => issue.code === 'DUPLICATE_CARD_WORD')).toBe(true);
    expect(report.cards[1].issues.some((issue) => issue.code === 'DUPLICATE_CARD_ID')).toBe(true);
    expect(report.cards[1].issues.some((issue) => issue.code === 'DUPLICATE_CARD_WORD')).toBe(true);
  });

  it('requires the real production catalog and saved review to prove all 150 cards pass', async () => {
    const catalog = JSON.parse(await fs.readFile(DEFAULT_REVIEW_PATHS.catalog, 'utf8'));
    const manifest = JSON.parse(await fs.readFile(DEFAULT_REVIEW_PATHS.manifest, 'utf8'));
    const release = JSON.parse(await fs.readFile(DEFAULT_REVIEW_PATHS.release, 'utf8'));
    const templateLock = JSON.parse(await fs.readFile(DEFAULT_REVIEW_PATHS.templateLock, 'utf8'));
    const appliedTemplatePath = path.resolve(projectRoot, templateLock.appliedSpecification.path);
    const appliedTemplate = await fs.readFile(appliedTemplatePath, 'utf8');
    const report = reviewCatalog({ catalog, manifest, release, templateLock, templateText: appliedTemplate });
    expect(report.status).toBe('pass');
    expect(report.summary.passed).toBe(EXPECTED_CARD_COUNT);
    expect(report.summary.failed).toBe(0);
    expect(report.summary.totalIssues).toBe(0);
    expect(report.cards).toHaveLength(EXPECTED_CARD_COUNT);
    expect(new Set(report.cards.map((card) => card.cardId)).size).toBe(EXPECTED_CARD_COUNT);
    expect(report.cards.every((card) => card.status === 'pass' && card.issues.length === 0)).toBe(true);

    const savedReport = JSON.parse(await fs.readFile(DEFAULT_REVIEW_PATHS.report, 'utf8'));
    expect(savedReport.status).toBe('pass');
    expect(savedReport.summary.passed).toBe(EXPECTED_CARD_COUNT);
    expect(savedReport.summary.failed).toBe(0);
    expect(savedReport.summary.totalIssues).toBe(0);
    const freshness = await checkReviewReportFreshness(savedReport, {
      paths: DEFAULT_REVIEW_PATHS,
      templatePath: appliedTemplatePath
    });
    expect(freshness.fresh, JSON.stringify(freshness.mismatches, null, 2)).toBe(true);
  });

  it('fingerprints every release input and becomes stale when a manual-pack dependency changes', async () => {
    const fixture = makeFixture();
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'daily-english-card-review-digests-'));
    temporaryDirectories.push(directory);
    const paths = {
      catalog: path.join(directory, 'all-cards.json'),
      manifest: path.join(directory, 'content-manifest.json'),
      release: path.join(directory, 'release.json'),
      templateLock: path.join(directory, 'template-lock.json'),
      template: path.join(directory, 'template.md'),
      manualPacks: path.join(directory, 'manual-card-packs.mjs'),
      report: path.join(directory, 'card-review-report.json')
    };
    const dependencyPath = path.join(directory, 'manual-card-pack-fixture.mjs');
    await Promise.all([
      fs.writeFile(paths.catalog, JSON.stringify(fixture.catalog), 'utf8'),
      fs.writeFile(paths.manifest, JSON.stringify(fixture.manifest), 'utf8'),
      fs.writeFile(paths.release, JSON.stringify(fixture.release), 'utf8'),
      fs.writeFile(paths.templateLock, JSON.stringify(fixture.templateLock), 'utf8'),
      fs.writeFile(paths.template, fixture.templateText, 'utf8'),
      fs.writeFile(paths.manualPacks, "export { fixturePack } from './manual-card-pack-fixture.mjs';\n", 'utf8'),
      fs.writeFile(dependencyPath, "export const fixturePack = { reviewword1: { reviewed: true } };\n", 'utf8')
    ]);

    const result = await runCardReview({ paths, generatedAt: '2026-09-10T00:00:00.000Z' });
    expect(result.exitCode).toBe(0);
    for (const key of ['allCards', 'manifest', 'release', 'templateLock', 'manualPacks', 'template']) {
      expect(result.report.sourceDigests[key].sha256).toMatch(/^[A-F0-9]{64}$/);
    }
    expect(result.report.sourceDigests.manualPacks.fileCount).toBe(2);
    const initiallyFresh = await checkReviewReportFreshness(result.report, {
      paths,
      templatePath: paths.template
    });
    expect(initiallyFresh.fresh).toBe(true);

    await fs.appendFile(dependencyPath, 'export const revision = 2;\n', 'utf8');
    const changedDigests = await computeReviewSourceDigests({ paths, templatePath: paths.template });
    expect(changedDigests.manualPacks.sha256).not.toBe(result.report.sourceDigests.manualPacks.sha256);
    const stale = await checkReviewReportFreshness(result.report, { paths, templatePath: paths.template });
    expect(stale.fresh).toBe(false);
    expect(stale.mismatches).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'manualPacks', reason: 'digest-mismatch' })
    ]));

    await fs.appendFile(paths.template, '\n<!-- changed -->\n', 'utf8');
    const staleTemplate = await checkReviewReportFreshness(result.report, { paths, templatePath: paths.template });
    expect(staleTemplate.fresh).toBe(false);
    expect(staleTemplate.mismatches).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'template', reason: 'digest-mismatch' })
    ]));

    await fs.appendFile(paths.release, '\n', 'utf8');
    const staleRelease = await checkReviewReportFreshness(result.report, { paths, templatePath: paths.template });
    expect(staleRelease.fresh).toBe(false);
    expect(staleRelease.mismatches).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'release', reason: 'digest-mismatch' })
    ]));
  });

  it('writes the requested JSON artifact and returns a nonzero exit code for a failed run', async () => {
    const fixture = makeFixture();
    fixture.catalog.cards[3].reviewed = false;
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'daily-english-card-review-'));
    temporaryDirectories.push(directory);
    const paths = {
      catalog: path.join(directory, 'all-cards.json'),
      manifest: path.join(directory, 'content-manifest.json'),
      release: path.join(directory, 'release.json'),
      templateLock: path.join(directory, 'template-lock.json'),
      template: path.join(directory, 'template.md'),
      manualPacks: path.join(directory, 'manual-card-packs.mjs'),
      report: path.join(directory, 'card-review-report.json')
    };
    await Promise.all([
      fs.writeFile(paths.catalog, JSON.stringify(fixture.catalog), 'utf8'),
      fs.writeFile(paths.manifest, JSON.stringify(fixture.manifest), 'utf8'),
      fs.writeFile(paths.release, JSON.stringify(fixture.release), 'utf8'),
      fs.writeFile(paths.templateLock, JSON.stringify(fixture.templateLock), 'utf8'),
      fs.writeFile(paths.template, fixture.templateText, 'utf8'),
      fs.writeFile(paths.manualPacks, 'export const manualCardPacks = {};\n', 'utf8')
    ]);
    const result = await runCardReview({ paths, generatedAt: '2026-09-10T00:00:00.000Z' });
    const written = JSON.parse(await fs.readFile(paths.report, 'utf8'));
    expect(result.exitCode).toBe(1);
    expect(written.status).toBe('fail');
    expect(written.cards[3].issues.some((issue) => issue.code === 'CARD_NOT_REVIEWED')).toBe(true);
  });
});
