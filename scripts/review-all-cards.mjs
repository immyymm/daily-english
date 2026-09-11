import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  FORBIDDEN_QUESTION_META,
  auditCardCollection,
  fixedExampleIssue,
  isConcisePhraseGloss,
  normalizeLearningKey,
  partOfSpeechClasses,
  reusablePhraseIssue
} from './quality-sections.mjs';
import {
  assertRelationEntryQuality,
  containsForbiddenRelationText,
  isLowValueDerivative,
  isAmericanIpa
} from './quality-relations.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
export const projectRoot = path.resolve(scriptDirectory, '..');

export const DEFAULT_REVIEW_PATHS = Object.freeze({
  catalog: path.join(projectRoot, 'public', 'data', 'all-cards.json'),
  manifest: path.join(projectRoot, 'content', 'content-manifest.json'),
  release: path.join(projectRoot, 'content', 'release.json'),
  templateLock: path.join(projectRoot, 'content', 'templates', 'template-lock.json'),
  manualPacks: path.join(projectRoot, 'scripts', 'manual-card-packs.mjs'),
  report: path.join(projectRoot, 'content', 'card-review-report.json')
});

export const EXPECTED_CARD_COUNT = 150;

const BASE_MINIMUMS = Object.freeze({
  meaningRows: 1,
  contextCategories: 4,
  contextItems: 16,
  fixedPhrases: 12,
  synonyms: 5,
  antonyms: 3,
  derivatives: 0,
  confusables: 2,
  relatedCategories: 3,
  relatedItems: 8,
  highFrequencyExamples: 12,
  questions: 15,
  meaningChoiceQuestions: 5,
  collocationQuestions: 5,
  coreStructures: 3,
  commonErrorPairs: 2
});
const BASE_REFERENCE_RELATION_MINIMUMS = Object.freeze({ antonyms: 4, confusables: 4 });

const REQUIRED_QUESTION_TYPES = Object.freeze([
  'meaning_choice',
  'recall',
  'collocation',
  'free_sentence',
  'dialogue'
]);

const TEMPLATE_HEADINGS = Object.freeze([
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
]);

const QUESTION_META_PATTERN = /(?:目标词|本课目标词|本词卡|词卡(?:中|核心|内容|结构|规则|模板)|根据本卡|卡片中|这张卡|答题时|人工精校|AI\s*生成|自动生成|JSON)/i;
const IPA_ASCII_PLACEHOLDER = /\b(?:someone|somebody|something|somewhere|one['’]s|doing|done|clause|noun|verb|adjective|adverb|word|words)\b|(?:^|[\s/+])(?:A|B)(?=$|[\s/])/i;

const FORBIDDEN_TEXT_RULES = Object.freeze([
  {
    code: 'PLACEHOLDER_TEXT',
    pattern: /(?:相近的常用表达|相反的常用表达|相近表达|相反表达|与\s*[^,，。；;]+\s*(?:处于同一常用语义场|容易混淆的表达)|补充表达|相关词汇)/,
    message: 'Placeholder copy must be replaced with a concrete learner-facing meaning.'
  },
  {
    code: 'GENERIC_RELATION_TEXT',
    pattern: /(?:只覆盖其中一个义项|是否能够替换取决于两词各自的宾语、介词和语体|使用范围更具体，替换时要核对宾语、介词和语境|两者容易因拼写、发音或相近语境而混淆|使用时要根据完整句义和固定搭配区分)/,
    message: 'Generic relation boilerplate must state a concrete semantic or grammatical distinction.'
  },
  {
    code: 'MECHANICAL_FILLER_TEXT',
    pattern: /(?:这个短语很实用|记进词汇本|大声练三遍|与本词相关的常用表达|同一学习主题中的高频词|真实表达延伸|主动输出提示|语体、宾语范围和固定搭配可能不同|实际使用前仍要核对词性和句型|这是\s*.+\s*的常用词族成员)/,
    message: 'Mechanical expansion or learning-process filler is not card content.'
  },
  {
    code: 'AUTHORING_META_TEXT',
    pattern: /(?:目标词|本词卡|本卡(?:中|片)?|词卡(?:中|内容|结构|规则|模板)|答题时|人工精校|AI\s*生成|自动生成|JSON\s*对象|confidence:)/i,
    message: 'Authoring, review, or generation terminology leaked into learner-facing content.'
  },
  {
    code: 'PRODUCT_OR_SYSTEM_TEXT',
    pattern: /\b(?:review mode|cloud sync|sync failure|saved progress|search box|this button|the app|deployment|cached version)\b/i,
    message: 'Product or system diagnostics leaked into learner-facing content.'
  }
]);

const SECTION_ISSUE_PATHS = Object.freeze({
  CONTEXT_FIXED_OVERLAP: 'fixedPhrases/contextPhrases',
  CONTEXT_INCOMPLETE_OR_SENTENCE_GLOSS: 'contextPhrases',
  CONTEXT_MECHANICAL_PADDING: 'contextPhrases',
  CONTEXT_NOT_A_REUSABLE_PHRASE: 'contextPhrases',
  CONTEXT_GENERIC_CATEGORY: 'contextPhrases',
  FIXED_DUPLICATE: 'fixedPhrases',
  FIXED_INCOMPLETE_OR_SENTENCE_GLOSS: 'fixedPhrases',
  RELATED_DUPLICATE_ACROSS_CATEGORIES: 'relatedVocabulary',
  RELATED_REPEATS_RELATION_SECTION: 'relatedVocabulary',
  RELATED_GENERIC_CATEGORY: 'relatedVocabulary',
  QUESTION_META_COPY: 'questions',
  QUESTION_OPTION_POS_UNKNOWN: 'questions',
  QUESTION_OPTION_POS_MISMATCH: 'questions'
});

const SECTION_ISSUE_MESSAGES = Object.freeze({
  CONTEXT_FIXED_OVERLAP: 'A context phrase duplicates a fixed phrase; the two sections must be independent.',
  CONTEXT_INCOMPLETE_OR_SENTENCE_GLOSS: 'A context row is truncated, overlong, incomplete, or uses a sentence instead of a concise gloss.',
  CONTEXT_MECHANICAL_PADDING: 'Context phrases must not be padded by mechanically adding a modal, frequency adverb, or negation.',
  CONTEXT_NOT_A_REUSABLE_PHRASE: 'A context row must be a reusable multiword expression rather than a bare inflected target word.',
  CONTEXT_GENERIC_CATEGORY: 'A context category is generic rather than a real usage setting.',
  FIXED_DUPLICATE: 'The fixed-phrase section contains a duplicate phrase.',
  FIXED_INCOMPLETE_OR_SENTENCE_GLOSS: 'A fixed-phrase row is incomplete, truncated, or uses an invalid gloss.',
  RELATED_DUPLICATE_ACROSS_CATEGORIES: 'The same related word appears in more than one category.',
  RELATED_REPEATS_RELATION_SECTION: 'Related vocabulary repeats a derivative, synonym, antonym, or confusable.',
  RELATED_GENERIC_CATEGORY: 'A related-vocabulary category is generic rather than semantic.',
  QUESTION_META_COPY: 'A question contains card-authoring meta language.',
  QUESTION_OPTION_POS_UNKNOWN: 'A relation-choice answer has no known part of speech.',
  QUESTION_OPTION_POS_MISMATCH: 'A relation-choice distractor has an incompatible or unknown part of speech.'
});

const compact = (value = '') => String(value ?? '').replace(/\s+/g, ' ').trim();
const nonEmpty = (value) => typeof value === 'string' && compact(value).length > 0;
const safeArray = (value) => Array.isArray(value) ? value : [];
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
const REQUIRED_SOURCE_DIGESTS = Object.freeze(['allCards', 'manifest', 'release', 'templateLock', 'manualPacks', 'template']);
const LOCAL_MODULE_SPECIFIER = /\b(?:import|export)\s+(?:(?:[^'\"]*?\sfrom\s*)?)['\"](\.{1,2}\/[^'\"]+)['\"]/g;

async function resolveLocalModulePath(importerPath, specifier) {
  const basePath = path.resolve(path.dirname(importerPath), specifier);
  const candidates = path.extname(basePath)
    ? [basePath]
    : [basePath, `${basePath}.mjs`, `${basePath}.js`, path.join(basePath, 'index.mjs'), path.join(basePath, 'index.js')];
  for (const candidate of candidates) {
    try {
      const stats = await fs.stat(candidate);
      if (stats.isFile()) return candidate;
    } catch {
      // Continue through the supported local-module candidates.
    }
  }
  throw new Error(`Unable to resolve local manual-pack dependency ${specifier} from ${importerPath}.`);
}

async function collectLocalModuleGraph(entryPath, collected = new Map()) {
  const resolvedEntry = path.resolve(entryPath);
  if (collected.has(resolvedEntry)) return collected;
  const source = await fs.readFile(resolvedEntry);
  collected.set(resolvedEntry, source);
  const text = source.toString('utf8');
  LOCAL_MODULE_SPECIFIER.lastIndex = 0;
  const specifiers = [];
  let match;
  while ((match = LOCAL_MODULE_SPECIFIER.exec(text)) !== null) specifiers.push(match[1]);
  for (const specifier of specifiers) {
    const dependencyPath = await resolveLocalModulePath(resolvedEntry, specifier);
    await collectLocalModuleGraph(dependencyPath, collected);
  }
  return collected;
}

async function digestFile(filePath) {
  const resolvedPath = path.resolve(filePath);
  const contents = await fs.readFile(resolvedPath);
  return {
    path: resolvedPath,
    sha256: sha256(contents),
    bytes: contents.byteLength
  };
}

async function digestManualPackGraph(entryPath) {
  const resolvedEntry = path.resolve(entryPath);
  const graph = await collectLocalModuleGraph(resolvedEntry);
  const files = [...graph.entries()]
    .map(([filePath, contents]) => ({
      path: filePath,
      relativePath: path.relative(projectRoot, filePath).replace(/\\/g, '/'),
      sha256: sha256(contents),
      bytes: contents.byteLength,
      contents
    }))
    .sort((left, right) => left.relativePath.localeCompare(right.relativePath));
  const aggregate = crypto.createHash('sha256');
  for (const file of files) {
    aggregate.update(file.relativePath);
    aggregate.update('\0');
    aggregate.update(file.contents);
    aggregate.update('\0');
  }
  return {
    path: resolvedEntry,
    sha256: aggregate.digest('hex').toUpperCase(),
    bytes: files.reduce((total, file) => total + file.bytes, 0),
    fileCount: files.length,
    files: files.map(({ contents: _contents, ...file }) => file)
  };
}

export async function computeReviewSourceDigests({ paths = DEFAULT_REVIEW_PATHS, templatePath } = {}) {
  const resolvedTemplate = templatePath ?? paths.template;
  const [allCards, manifest, release, templateLock, manualPacks, template] = await Promise.all([
    digestFile(paths.catalog ?? DEFAULT_REVIEW_PATHS.catalog),
    digestFile(paths.manifest ?? DEFAULT_REVIEW_PATHS.manifest),
    digestFile(paths.release ?? DEFAULT_REVIEW_PATHS.release),
    digestFile(paths.templateLock ?? DEFAULT_REVIEW_PATHS.templateLock),
    digestManualPackGraph(paths.manualPacks ?? DEFAULT_REVIEW_PATHS.manualPacks),
    resolvedTemplate ? digestFile(resolvedTemplate) : Promise.resolve(undefined)
  ]);
  return {
    allCards,
    manifest,
    release,
    templateLock,
    manualPacks,
    ...(template ? { template } : {})
  };
}

export function compareReviewSourceDigests(report, currentDigests) {
  const recorded = report?.sourceDigests ?? {};
  const mismatches = [];
  for (const key of REQUIRED_SOURCE_DIGESTS) {
    const expected = recorded?.[key]?.sha256;
    const actual = currentDigests?.[key]?.sha256;
    if (!/^[A-F0-9]{64}$/.test(String(expected ?? ''))) {
      mismatches.push({ key, reason: 'missing-or-invalid-recorded-digest', expected: expected ?? null, actual: actual ?? null });
    } else if (expected !== actual) {
      mismatches.push({ key, reason: 'digest-mismatch', expected, actual: actual ?? null });
    }
  }
  return { fresh: mismatches.length === 0, mismatches };
}

export async function checkReviewReportFreshness(report, { paths = DEFAULT_REVIEW_PATHS, templatePath } = {}) {
  const currentDigests = await computeReviewSourceDigests({ paths, templatePath });
  return {
    ...compareReviewSourceDigests(report, currentDigests),
    currentDigests
  };
}

function excerpt(value, maximum = 220) {
  if (value === undefined) return undefined;
  const rendered = typeof value === 'string' ? compact(value) : JSON.stringify(value);
  if (rendered === undefined) return String(value);
  return rendered.length > maximum ? `${rendered.slice(0, maximum - 1)}…` : rendered;
}

function pushIssue(issues, { code, path: issuePath = '', message, evidence, source = 'full-review', severity = 'error' }) {
  const issue = { code, severity, source, path: issuePath, message };
  const renderedEvidence = excerpt(evidence);
  if (renderedEvidence !== undefined && renderedEvidence !== '') issue.evidence = renderedEvidence;
  issues.push(issue);
}

function deduplicateIssues(issues) {
  const seen = new Set();
  return issues.filter((issue) => {
    const key = [issue.code, issue.path, issue.message, issue.evidence ?? ''].join('\u0000');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function numericMinimum(candidate, fallback) {
  return Number.isFinite(candidate) && candidate >= 0 ? candidate : fallback;
}

export function resolveReviewMinimums(templateLock = {}) {
  const published = templateLock.publishedCardMinimums ?? {};
  const curated = templateLock.curatedCardMinimums ?? {};
  const quality = templateLock.qualityContract ?? {};
  const adaptive = new Set(Object.keys(templateLock.adaptiveSections ?? {}));
  const questions = templateLock.questionMinimums ?? {};
  const relationFloors = {
    antonyms: Math.max(BASE_MINIMUMS.antonyms, numericMinimum(quality.minimumAntonymsPerCard, BASE_MINIMUMS.antonyms)),
    confusables: Math.max(BASE_MINIMUMS.confusables, numericMinimum(quality.minimumConfusablesPerCard, BASE_MINIMUMS.confusables))
  };
  const fromShape = (shape = {}, fallback = BASE_MINIMUMS) => ({
    meaningRows: numericMinimum(shape.meaningRows, fallback.meaningRows),
    contextCategories: numericMinimum(shape.contextCategories, fallback.contextCategories),
    contextItems: numericMinimum(shape.contextItems, fallback.contextItems),
    fixedPhrases: numericMinimum(shape.fixedPhrases, fallback.fixedPhrases),
    synonyms: numericMinimum(shape.synonyms, fallback.synonyms),
    antonyms: Math.max(numericMinimum(shape.antonyms, fallback.antonyms), relationFloors.antonyms),
    derivatives: numericMinimum(shape.derivatives, fallback.derivatives),
    confusables: Math.max(numericMinimum(shape.confusables, fallback.confusables), relationFloors.confusables),
    relatedCategories: numericMinimum(shape.relatedCategories, fallback.relatedCategories),
    relatedItems: numericMinimum(shape.relatedItems, fallback.relatedItems),
    highFrequencyExamples: numericMinimum(shape.highFrequencyExamples, fallback.highFrequencyExamples),
    questions: numericMinimum(questions.total, fallback.questions),
    meaningChoiceQuestions: numericMinimum(questions.meaningChoice, fallback.meaningChoiceQuestions),
    collocationQuestions: numericMinimum(questions.collocation, fallback.collocationQuestions),
    coreStructures: numericMinimum(quality.coreStructures, fallback.coreStructures),
    commonErrorPairs: numericMinimum(quality.commonErrorPairs, fallback.commonErrorPairs)
  });
  const publishedMinimums = fromShape(published);
  const curatedShape = {
    ...curated,
    contextCategories: numericMinimum(curated.contextCategories, quality.curatedContextCategories),
    relatedCategories: numericMinimum(curated.relatedCategories, quality.curatedRelatedCategories)
  };
  const curatedMinimums = fromShape(curatedShape, {
    ...publishedMinimums,
    derivatives: 0
  });
  // Adaptive sections may omit a count only when the applicable shape does not
  // define an explicit floor. This prevents an adaptive label from silently
  // disabling a published relation threshold.
  for (const field of adaptive) {
    if (Object.hasOwn(publishedMinimums, field) && !Object.hasOwn(published, field)) {
      publishedMinimums[field] = Math.max(field === 'meaningRows' ? 1 : 0, relationFloors[field] ?? 0);
    }
    if (Object.hasOwn(curatedMinimums, field) && !Object.hasOwn(curated, field)) {
      curatedMinimums[field] = Math.max(field === 'meaningRows' ? 1 : 0, relationFloors[field] ?? 0);
    }
  }
  const referenceMinimums = fromShape(templateLock.referenceCard?.recordedShape ?? {}, curatedMinimums);
  referenceMinimums.antonyms = Math.max(referenceMinimums.antonyms, BASE_REFERENCE_RELATION_MINIMUMS.antonyms);
  referenceMinimums.confusables = Math.max(referenceMinimums.confusables, BASE_REFERENCE_RELATION_MINIMUMS.confusables);
  return { published: publishedMinimums, curated: curatedMinimums, reference: referenceMinimums };
}

function thresholdsForCard(card, minimums, templateLock) {
  if (card?.id === templateLock.referenceCard?.cardId) return minimums.reference;
  // This is a publication review: every non-reference card is expected to be
  // reviewed and curated, even when its current (failing) metadata says not to.
  return minimums.curated;
}

function sanitizedCardForSectionAudit(card, index) {
  const value = card && typeof card === 'object' ? card : {};
  return {
    ...value,
    id: value.id ?? `invalid-card-${index + 1}`,
    word: value.word ?? `invalid-card-${index + 1}`,
    partOfSpeech: value.partOfSpeech ?? '',
    fixedPhrases: safeArray(value.fixedPhrases),
    contextPhrases: safeArray(value.contextPhrases)
      .filter((group) => group && typeof group === 'object')
      .map((group) => ({ ...group, items: safeArray(group.items) })),
    synonyms: safeArray(value.synonyms),
    antonyms: safeArray(value.antonyms),
    derivatives: safeArray(value.derivatives),
    confusables: safeArray(value.confusables),
    relatedVocabulary: safeArray(value.relatedVocabulary)
      .filter((group) => group && typeof group === 'object')
      .map((group) => ({ ...group, items: safeArray(group.items) })),
    questions: safeArray(value.questions)
  };
}

function sectionAuditReports(cards, collectionIssues) {
  try {
    return auditCardCollection(cards.map(sanitizedCardForSectionAudit));
  } catch (error) {
    pushIssue(collectionIssues, {
      code: 'QUALITY_SECTIONS_INTERFACE_ERROR',
      path: 'cards',
      source: 'quality-sections',
      message: 'The reusable section-quality audit could not inspect the collection.',
      evidence: error instanceof Error ? error.message : String(error)
    });
    return cards.map((card, index) => ({
      cardId: card?.id ?? `invalid-card-${index + 1}`,
      word: card?.word ?? '',
      issues: []
    }));
  }
}

function addSectionIssues(issues, sectionReport = {}) {
  for (const issue of safeArray(sectionReport.issues)) {
    // The full review records question meta-copy at the exact array index with
    // a broader policy. Avoid adding a second aggregate row for the same text.
    if (issue.code === 'QUESTION_META_COPY') continue;
    pushIssue(issues, {
      code: issue.code ?? 'QUALITY_SECTION_FAILURE',
      path: issue.questionId ? `questions.${issue.questionId}` : (SECTION_ISSUE_PATHS[issue.code] ?? ''),
      source: 'quality-sections',
      message: SECTION_ISSUE_MESSAGES[issue.code] ?? 'The reusable section-quality audit reported a failure.',
      evidence: issue.samples ?? issue.sample ?? (issue.count === undefined ? undefined : { count: issue.count })
    });
  }
}

function requireArray(issues, card, field) {
  if (!Array.isArray(card?.[field])) {
    pushIssue(issues, {
      code: 'MISSING_SECTION_ARRAY',
      path: field,
      message: `Expected ${field} to be an array.`,
      evidence: card?.[field]
    });
  }
  return safeArray(card?.[field]);
}

function requireTextFields(issues, entry, fields, basePath, code = 'INCOMPLETE_ROW') {
  for (const field of fields) {
    if (!nonEmpty(entry?.[field])) {
      pushIssue(issues, {
        code,
        path: basePath ? `${basePath}.${field}` : field,
        message: `Required learner-facing field ${field} is empty.`,
        evidence: entry?.[field]
      });
    }
  }
}

function validateIpa(issues, value, issuePath, { optional = false } = {}) {
  if (optional && value === undefined) return;
  if (!nonEmpty(value)) {
    pushIssue(issues, {
      code: 'MISSING_IPA',
      path: issuePath,
      message: 'Required American IPA is missing.',
      evidence: value
    });
    return;
  }
  if (!isAmericanIpa(value) || IPA_ASCII_PLACEHOLDER.test(value)) {
    pushIssue(issues, {
      code: 'INVALID_IPA',
      path: issuePath,
      message: 'IPA must be slash-delimited, use valid phonetic symbols, and contain no untranslated English placeholders.',
      evidence: value
    });
  }
}

function addCountIssue(issues, section, actual, minimum) {
  if (actual < minimum) {
    pushIssue(issues, {
      code: 'SECTION_COUNT_BELOW_MINIMUM',
      path: section,
      message: `${section} has ${actual} item(s); the active template requires at least ${minimum}.`,
      evidence: { actual, minimum }
    });
  }
}

function normalizeFullText(value = '') {
  return String(value ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase('en-US')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function duplicateValues(entries, valueFor, normalize = normalizeLearningKey) {
  const locations = new Map();
  entries.forEach((entry, index) => {
    const key = normalize(valueFor(entry));
    if (!key) return;
    const current = locations.get(key) ?? [];
    current.push(index);
    locations.set(key, current);
  });
  return [...locations.entries()].filter(([, indexes]) => indexes.length > 1);
}

function checkCardMetadata(issues, card, templateLock, activeTemplateVersion, activeContentVersion, index) {
  requireTextFields(
    issues,
    card,
    ['id', 'word', 'syllables', 'partOfSpeech', 'cocaRankLabel', 'templateVersion', 'contentVersion'],
    '',
    'MISSING_CARD_FIELD'
  );
  validateIpa(issues, card?.phonetic, 'phonetic');
  if (!partOfSpeechClasses(card?.partOfSpeech).length) {
    pushIssue(issues, {
      code: 'INVALID_PART_OF_SPEECH',
      path: 'partOfSpeech',
      message: 'Card part of speech is empty or not a supported template abbreviation.',
      evidence: card?.partOfSpeech
    });
  }
  if (!Array.isArray(card?.cocaRanks) || card.cocaRanks.length < 1) {
    pushIssue(issues, {
      code: 'INVALID_COCA_RANKS',
      path: 'cocaRanks',
      message: 'Every card must retain at least one exact COCA rank row.',
      evidence: card?.cocaRanks
    });
  } else {
    card.cocaRanks.forEach((rank, rankIndex) => {
      if (!Number.isInteger(rank?.rank) || rank.rank < 1 || !nonEmpty(rank?.pos) || !nonEmpty(rank?.partOfSpeech)) {
        pushIssue(issues, {
          code: 'INVALID_COCA_RANKS',
          path: `cocaRanks[${rankIndex}]`,
          message: 'COCA rank row needs a positive integer rank, source POS, and learner-facing part of speech.',
          evidence: rank
        });
      }
    });
  }
  if (!card?.learningPriority || typeof card.learningPriority !== 'object' || Array.isArray(card.learningPriority)) {
    pushIssue(issues, {
      code: 'INVALID_LEARNING_PRIORITY',
      path: 'learningPriority',
      message: 'Every card needs learning-priority metadata.'
    });
  } else {
    requireTextFields(issues, card.learningPriority, ['group', 'groupLabel'], 'learningPriority', 'INVALID_LEARNING_PRIORITY');
    if (!Number.isInteger(card.learningPriority.sequence) || card.learningPriority.sequence !== index + 1) {
      pushIssue(issues, {
        code: 'INVALID_LEARNING_PRIORITY',
        path: 'learningPriority.sequence',
        message: 'Learning-priority sequence must match the card position in the audited catalog.',
        evidence: { actual: card.learningPriority.sequence, expected: index + 1 }
      });
    }
    if (!Number.isInteger(card.learningPriority.primaryCocaRank) || card.learningPriority.primaryCocaRank < 1) {
      pushIssue(issues, {
        code: 'INVALID_LEARNING_PRIORITY',
        path: 'learningPriority.primaryCocaRank',
        message: 'Learning priority needs a positive primary COCA rank.',
        evidence: card.learningPriority.primaryCocaRank
      });
    }
  }
  if (card?.reviewed !== true) {
    pushIssue(issues, {
      code: 'CARD_NOT_REVIEWED',
      path: 'reviewed',
      message: 'Every published card must be explicitly marked reviewed: true.',
      evidence: card?.reviewed
    });
  }
  const referenceId = templateLock.referenceCard?.cardId;
  const expectedDetailLevel = card?.id === referenceId ? 'template-reference' : 'template-curated';
  const expectedCurationSource = card?.id === referenceId ? 'locked-reference-example' : `manual-semantic-pack-${templateLock.lockVersion}`;
  if (card?.reviewed === true && card?.detailLevel !== expectedDetailLevel) {
    pushIssue(issues, {
      code: 'REVIEWED_DETAIL_LEVEL_MISMATCH',
      path: 'detailLevel',
      message: `A reviewed ${card?.id === referenceId ? 'reference' : 'non-reference'} card must use ${expectedDetailLevel}.`,
      evidence: card?.detailLevel
    });
  }
  if (card?.curationSource !== expectedCurationSource) {
    pushIssue(issues, {
      code: 'CURATION_SOURCE_MISMATCH',
      path: 'curationSource',
      message: 'Published cards must prove locked-reference or per-word manual semantic-pack provenance.',
      evidence: { actual: card?.curationSource, expected: expectedCurationSource }
    });
  }
  if (activeTemplateVersion && card?.templateVersion !== activeTemplateVersion) {
    pushIssue(issues, {
      code: 'CARD_TEMPLATE_VERSION_MISMATCH',
      path: 'templateVersion',
      message: 'Card templateVersion differs from the active catalog/template specification.',
      evidence: { card: card?.templateVersion, active: activeTemplateVersion }
    });
  }
  if (activeContentVersion && card?.contentVersion !== activeContentVersion) {
    pushIssue(issues, {
      code: 'CARD_CONTENT_VERSION_MISMATCH',
      path: 'contentVersion',
      message: 'Card contentVersion differs from the audited catalog and manifest.',
      evidence: { card: card?.contentVersion, active: activeContentVersion }
    });
  }
}

function checkReferenceShape(issues, card, templateLock) {
  if (card?.id !== templateLock.referenceCard?.cardId) return;
  const expected = templateLock.referenceCard?.recordedShape;
  if (!expected || typeof expected !== 'object') return;
  const actual = cardMetrics(card);
  const metricNames = [
    'meaningRows', 'contextCategories', 'contextItems', 'fixedPhrases',
    'synonyms', 'antonyms', 'derivatives', 'confusables',
    'relatedCategories', 'relatedItems', 'highFrequencyExamples'
  ];
  const metricAliases = {
    meaningRows: 'meanings',
    highFrequencyExamples: 'examples'
  };
  for (const metric of metricNames) {
    if (expected[metric] === undefined) continue;
    const actualMetric = metricAliases[metric] ?? metric;
    if (actual[actualMetric] !== expected[metric]) {
      pushIssue(issues, {
        code: 'REFERENCE_SHAPE_MISMATCH',
        path: metric,
        message: 'The locked reference card must preserve its exact recorded shape.',
        evidence: { actual: actual[actualMetric], expected: expected[metric] }
      });
    }
  }
}

function checkCoreMemory(issues, card, thresholds) {
  const core = card?.coreMemory;
  if (!core || typeof core !== 'object' || Array.isArray(core)) {
    pushIssue(issues, {
      code: 'MISSING_CORE_MEMORY',
      path: 'coreMemory',
      message: 'Core memory must be a complete object.'
    });
    return;
  }
  requireTextFields(issues, core, ['chinese', 'english', 'example', 'exampleChinese'], 'coreMemory');
  const structures = safeArray(core.structures);
  const commonErrors = safeArray(core.commonErrors);
  addCountIssue(issues, 'coreMemory.structures', structures.length, thresholds.coreStructures);
  addCountIssue(issues, 'coreMemory.commonErrors', commonErrors.length, thresholds.commonErrorPairs);
  structures.forEach((entry, index) => {
    const basePath = `coreMemory.structures[${index}]`;
    requireTextFields(issues, entry, ['phrase', 'phonetic', 'chinese'], basePath);
    validateIpa(issues, entry?.phonetic, `${basePath}.phonetic`);
  });
  commonErrors.forEach((entry, index) => {
    const basePath = `coreMemory.commonErrors[${index}]`;
    requireTextFields(issues, entry, ['wrong', 'wrongPhonetic', 'right', 'rightPhonetic', 'note'], basePath);
    validateIpa(issues, entry?.wrongPhonetic, `${basePath}.wrongPhonetic`);
    validateIpa(issues, entry?.rightPhonetic, `${basePath}.rightPhonetic`);
    if (compact(entry?.wrong) && compact(entry?.wrong) === compact(entry?.right)) {
      pushIssue(issues, {
        code: 'INVALID_COMMON_ERROR_PAIR',
        path: basePath,
        message: 'The wrong and corrected structures must be different.',
        evidence: entry?.wrong
      });
    }
  });
}

function checkMeanings(issues, card, thresholds) {
  const meanings = requireArray(issues, card, 'meanings');
  addCountIssue(issues, 'meanings', meanings.length, thresholds.meaningRows);
  meanings.forEach((meaning, index) => {
    const basePath = `meanings[${index}]`;
    requireTextFields(issues, meaning, ['partOfSpeech', 'english', 'chinese', 'example', 'translation'], basePath, 'INCOMPLETE_MEANING');
    if (!partOfSpeechClasses(meaning?.partOfSpeech).length) {
      pushIssue(issues, {
        code: 'INVALID_PART_OF_SPEECH',
        path: `${basePath}.partOfSpeech`,
        message: 'Meaning part of speech is empty or not a supported template abbreviation.',
        evidence: meaning?.partOfSpeech
      });
    }
    if (meaning && Object.hasOwn(meaning, 'phonetic')) validateIpa(issues, meaning.phonetic, `${basePath}.phonetic`, { optional: true });
  });
  for (const [key, indexes] of duplicateValues(
    meanings,
    (entry) => `${entry?.partOfSpeech ?? ''}|${entry?.english ?? ''}|${entry?.chinese ?? ''}`,
    normalizeFullText
  )) {
    pushIssue(issues, {
      code: 'DUPLICATE_MEANING',
      path: 'meanings',
      message: 'Two or more meaning rows repeat the same part of speech and bilingual definition.',
      evidence: { key, indexes }
    });
  }
  for (const [example, indexes] of duplicateValues(meanings, (entry) => entry?.example)) {
    pushIssue(issues, {
      code: 'DUPLICATE_MEANING_EXAMPLE',
      path: 'meanings',
      message: 'Each meaning needs its own example evidence.',
      evidence: { example, indexes }
    });
  }
}

function checkContextPhrases(issues, card, thresholds) {
  const groups = requireArray(issues, card, 'contextPhrases');
  const items = [];
  addCountIssue(issues, 'contextPhrases.categories', groups.length, thresholds.contextCategories);
  groups.forEach((group, groupIndex) => {
    const groupPath = `contextPhrases[${groupIndex}]`;
    requireTextFields(issues, group, ['category'], groupPath);
    safeArray(group?.items).forEach((entry, itemIndex) => {
      const basePath = `${groupPath}.items[${itemIndex}]`;
      items.push(entry);
      requireTextFields(issues, entry, ['phrase', 'phonetic', 'chinese'], basePath);
      validateIpa(issues, entry?.phonetic, `${basePath}.phonetic`);
      const phraseIssue = reusablePhraseIssue(entry?.phrase);
      if (phraseIssue) {
        pushIssue(issues, {
          code: 'INVALID_CONTEXT_PHRASE',
          path: `${basePath}.phrase`,
          message: `Context phrase is not a complete reusable chunk (${phraseIssue}).`,
          evidence: entry?.phrase
        });
      }
      if (!isConcisePhraseGloss(entry?.chinese)) {
        pushIssue(issues, {
          code: 'INVALID_CONTEXT_GLOSS',
          path: `${basePath}.chinese`,
          message: 'Context Chinese must be a concise phrase gloss within the template limit.',
          evidence: entry?.chinese
        });
      }
    });
  });
  addCountIssue(issues, 'contextPhrases.items', items.length, thresholds.contextItems);
  for (const [phrase, indexes] of duplicateValues(items, (entry) => entry?.phrase)) {
    pushIssue(issues, {
      code: 'DUPLICATE_CONTEXT_PHRASE',
      path: 'contextPhrases',
      message: 'A context phrase is repeated within the section.',
      evidence: { phrase, indexes }
    });
  }
}

function checkFixedPhrases(issues, card, thresholds) {
  const entries = requireArray(issues, card, 'fixedPhrases');
  addCountIssue(issues, 'fixedPhrases', entries.length, thresholds.fixedPhrases);
  entries.forEach((entry, index) => {
    const basePath = `fixedPhrases[${index}]`;
    requireTextFields(issues, entry, ['phrase', 'phonetic', 'chinese', 'example', 'translation'], basePath);
    validateIpa(issues, entry?.phonetic, `${basePath}.phonetic`);
    const phraseIssue = reusablePhraseIssue(entry?.phrase);
    if (phraseIssue) {
      pushIssue(issues, {
        code: 'INVALID_FIXED_PHRASE',
        path: `${basePath}.phrase`,
        message: `Fixed phrase is not a complete reusable chunk (${phraseIssue}).`,
        evidence: entry?.phrase
      });
    }
    if (!isConcisePhraseGloss(entry?.chinese, 24)) {
      pushIssue(issues, {
        code: 'INVALID_FIXED_GLOSS',
        path: `${basePath}.chinese`,
        message: 'Fixed-phrase Chinese must be a concise phrase gloss, not a copied sentence.',
        evidence: entry?.chinese
      });
    }
  });
  const genericExamples = entries
    .map((entry, index) => ({ index, entry, issue: fixedExampleIssue(entry?.example, entry?.phrase) }))
    .filter(({ issue }) => issue);
  if (genericExamples.length >= 3) {
    pushIssue(issues, {
      code: 'FIXED_EXAMPLE_TEMPLATE',
      path: 'fixedPhrases',
      message: 'Three or more examples merely wrap their phrase in a reusable carrier; use concrete natural contexts.',
      evidence: genericExamples.slice(0, 4).map(({ index, entry, issue }) => ({ index, example: entry?.example, issue }))
    });
  }
}

function relationRows(card) {
  return [
    ['synonyms', 'synonym', safeArray(card?.synonyms)],
    ['antonyms', 'antonym', safeArray(card?.antonyms)],
    ['derivatives', 'derivative', safeArray(card?.derivatives)],
    ['confusables', 'confusable', safeArray(card?.confusables)]
  ];
}

function checkRelations(issues, card, thresholds) {
  const sections = relationRows(card);
  for (const [section] of sections) requireArray(issues, card, section);
  addCountIssue(issues, 'synonyms', safeArray(card?.synonyms).length, thresholds.synonyms);
  addCountIssue(issues, 'antonyms', safeArray(card?.antonyms).length, thresholds.antonyms);
  addCountIssue(issues, 'derivatives', safeArray(card?.derivatives).length, thresholds.derivatives);
  addCountIssue(issues, 'confusables', safeArray(card?.confusables).length, thresholds.confusables);

  for (const [section, kind, entries] of sections) {
    entries.forEach((entry, index) => {
      const basePath = `${section}[${index}]`;
      if (normalizeLearningKey(entry?.word) === normalizeLearningKey(card?.word)) {
        pushIssue(issues, {
          code: 'RELATION_SELF_REFERENCE',
          path: `${basePath}.word`,
          message: 'A card cannot list its own headword as a derivative, synonym, antonym, or confusable.',
          evidence: entry?.word
        });
      }
      if (kind === 'derivative' && isLowValueDerivative(card?.word, entry?.word)) {
        pushIssue(issues, {
          code: 'LOW_VALUE_DERIVATIVE',
          path: `${basePath}.word`,
          message: 'The derivative is rare, merely inflectional, misleading, or too specialized for a common-derivative section.',
          evidence: entry?.word
        });
      }
      try {
        assertRelationEntryQuality(
          entry ?? {},
          kind,
          `${card?.word ?? card?.id ?? 'unknown'} -> ${entry?.word ?? `row ${index}`}`,
          card?.word ?? ''
        );
      } catch (error) {
        pushIssue(issues, {
          code: 'RELATION_QUALITY_FAILURE',
          path: basePath,
          source: 'quality-relations',
          message: error instanceof Error ? error.message : String(error),
          evidence: entry
        });
      }
      if (!partOfSpeechClasses(entry?.partOfSpeech).length) {
        pushIssue(issues, {
          code: 'INVALID_PART_OF_SPEECH',
          path: `${basePath}.partOfSpeech`,
          message: 'Relation part of speech is empty or not one of the supported template abbreviations.',
          evidence: entry?.partOfSpeech
        });
      }
    });
    for (const [word, indexes] of duplicateValues(entries, (entry) => entry?.word)) {
      pushIssue(issues, {
        code: 'DUPLICATE_RELATION_WORD',
        path: section,
        message: `The ${section} section repeats the same lexical item.`,
        evidence: { word, indexes }
      });
    }
  }
}

function checkRelatedVocabulary(issues, card, thresholds) {
  const groups = requireArray(issues, card, 'relatedVocabulary');
  const items = [];
  addCountIssue(issues, 'relatedVocabulary.categories', groups.length, thresholds.relatedCategories);
  groups.forEach((group, groupIndex) => {
    const groupPath = `relatedVocabulary[${groupIndex}]`;
    requireTextFields(issues, group, ['category'], groupPath);
    safeArray(group?.items).forEach((entry, itemIndex) => {
      const basePath = `${groupPath}.items[${itemIndex}]`;
      items.push(entry);
      requireTextFields(issues, entry, ['word', 'phonetic', 'partOfSpeech', 'chinese'], basePath);
      if (normalizeLearningKey(entry?.word) === normalizeLearningKey(card?.word)) {
        pushIssue(issues, {
          code: 'RELATED_SELF_REFERENCE',
          path: `${basePath}.word`,
          message: 'Related vocabulary cannot repeat the card headword.',
          evidence: entry?.word
        });
      }
      validateIpa(issues, entry?.phonetic, `${basePath}.phonetic`);
      if (!partOfSpeechClasses(entry?.partOfSpeech).length) {
        pushIssue(issues, {
          code: 'INVALID_PART_OF_SPEECH',
          path: `${basePath}.partOfSpeech`,
          message: 'Related-vocabulary part of speech is empty or unsupported.',
          evidence: entry?.partOfSpeech
        });
      }
    });
  });
  addCountIssue(issues, 'relatedVocabulary.items', items.length, thresholds.relatedItems);
}

function checkExamples(issues, card, thresholds) {
  const examples = requireArray(issues, card, 'examples');
  addCountIssue(issues, 'examples', examples.length, thresholds.highFrequencyExamples);
  examples.forEach((entry, index) => requireTextFields(issues, entry, ['scene', 'english', 'chinese'], `examples[${index}]`));
  for (const [example, indexes] of duplicateValues(examples, (entry) => entry?.english)) {
    pushIssue(issues, {
      code: 'DUPLICATE_HIGH_FREQUENCY_EXAMPLE',
      path: 'examples',
      message: 'High-frequency example sentences must be unique within a card.',
      evidence: { example, indexes }
    });
  }
}

function checkQuestions(issues, card, thresholds) {
  const questions = requireArray(issues, card, 'questions');
  addCountIssue(issues, 'questions', questions.length, thresholds.questions);
  const typeCounts = new Map();
  questions.forEach((question, index) => {
    const basePath = `questions[${index}]`;
    requireTextFields(issues, question, ['id', 'type', 'prompt'], basePath, 'INCOMPLETE_QUESTION');
    typeCounts.set(question?.type, (typeCounts.get(question?.type) ?? 0) + 1);
    if (question?.ai !== true && !nonEmpty(question?.answer)) {
      pushIssue(issues, {
        code: 'INCOMPLETE_QUESTION',
        path: `${basePath}.answer`,
        message: 'A non-AI question needs a concrete answer.',
        evidence: question?.answer
      });
    }
    const questionTextFields = [
      ['prompt', question?.prompt],
      ...safeArray(question?.options).map((option, optionIndex) => [`options[${optionIndex}]`, option]),
      ['answer', question?.answer]
    ];
    for (const [field, value] of questionTextFields) {
      const text = String(value ?? '');
      if (FORBIDDEN_QUESTION_META.test(text) || QUESTION_META_PATTERN.test(text)) {
        pushIssue(issues, {
          code: 'QUESTION_META_COPY',
          path: `${basePath}.${field}`,
          message: 'Question content contains authoring or card-meta language; ask the learning task directly.',
          evidence: text
        });
      }
    }
    const requiresOptions = question?.type === 'meaning_choice';
    if (requiresOptions && question?.options === undefined) {
      pushIssue(issues, {
        code: 'INVALID_QUESTION_OPTIONS',
        path: `${basePath}.options`,
        message: 'A meaning-choice question needs at least three options and must include its answer.'
      });
    } else if (question?.options !== undefined) {
      if (!Array.isArray(question.options) || question.options.length < 3) {
        pushIssue(issues, {
          code: 'INVALID_QUESTION_OPTIONS',
          path: `${basePath}.options`,
          message: 'A choice question needs at least three options.',
          evidence: question?.options
        });
      } else {
        const normalized = question.options.map((option) => compact(option));
        if (new Set(normalized).size !== normalized.length || !normalized.includes(compact(question.answer))) {
          pushIssue(issues, {
            code: 'INVALID_QUESTION_OPTIONS',
            path: `${basePath}.options`,
            message: 'Choice options must be unique and contain the answer exactly once.',
            evidence: { options: question.options, answer: question.answer }
          });
        }
      }
    }
  });
  for (const requiredType of REQUIRED_QUESTION_TYPES) {
    if (!(typeCounts.get(requiredType) > 0)) {
      pushIssue(issues, {
        code: 'MISSING_QUESTION_TYPE',
        path: 'questions',
        message: `Question set is missing required type ${requiredType}.`,
        evidence: [...typeCounts.keys()].filter(Boolean)
      });
    }
  }
  addCountIssue(issues, 'questions.meaning_choice', typeCounts.get('meaning_choice') ?? 0, thresholds.meaningChoiceQuestions);
  addCountIssue(issues, 'questions.collocation', typeCounts.get('collocation') ?? 0, thresholds.collocationQuestions);
  for (const [id, indexes] of duplicateValues(questions, (question) => question?.id)) {
    pushIssue(issues, {
      code: 'DUPLICATE_QUESTION_ID',
      path: 'questions',
      message: 'Question IDs must be unique within a card.',
      evidence: { id, indexes }
    });
  }
  for (const [prompt, indexes] of duplicateValues(questions, (question) => question?.prompt, normalizeFullText)) {
    pushIssue(issues, {
      code: 'DUPLICATE_QUESTION_PROMPT',
      path: 'questions',
      message: 'Question prompts must be unique within a card.',
      evidence: { prompt, indexes }
    });
  }
}

function checkCrossSectionDuplicates(issues, card) {
  const locations = new Map();
  const add = (value, section, issuePath) => {
    const key = normalizeLearningKey(value);
    if (!key) return;
    const current = locations.get(key) ?? [];
    current.push({ section, path: issuePath, value });
    locations.set(key, current);
  };
  relationRows(card).forEach(([section, , entries]) => {
    entries.forEach((entry, index) => add(entry?.word, section, `${section}[${index}].word`));
  });
  safeArray(card?.relatedVocabulary).forEach((group, groupIndex) => {
    safeArray(group?.items).forEach((entry, itemIndex) => add(entry?.word, 'relatedVocabulary', `relatedVocabulary[${groupIndex}].items[${itemIndex}].word`));
  });
  for (const [word, entries] of locations) {
    const sectionNames = new Set(entries.map((entry) => entry.section));
    if (sectionNames.size < 2) continue;
    pushIssue(issues, {
      code: 'CROSS_SECTION_WORD_DUPLICATE',
      path: entries.map((entry) => entry.path).join(' | '),
      message: 'The same lexical item appears in more than one derivative/relation/related-vocabulary section.',
      evidence: { word, sections: [...sectionNames] }
    });
  }
}

function visitText(value, visitor, currentPath = '') {
  if (typeof value === 'string') {
    visitor(value, currentPath);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => visitText(entry, visitor, `${currentPath}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, entry] of Object.entries(value)) {
    visitText(entry, visitor, currentPath ? `${currentPath}.${key}` : key);
  }
}

function checkForbiddenText(issues, card) {
  const learnerFacingSections = {
    coreMemory: card?.coreMemory,
    meanings: card?.meanings,
    contextPhrases: card?.contextPhrases,
    fixedPhrases: card?.fixedPhrases,
    synonyms: card?.synonyms,
    antonyms: card?.antonyms,
    derivatives: card?.derivatives,
    confusables: card?.confusables,
    relatedVocabulary: card?.relatedVocabulary,
    examples: card?.examples,
    studyFocus: card?.studyFocus,
    questions: card?.questions
  };
  visitText(learnerFacingSections, (text, issuePath) => {
    for (const rule of FORBIDDEN_TEXT_RULES) {
      if (issuePath.startsWith('questions') && rule.code === 'AUTHORING_META_TEXT') continue;
      if (rule.pattern.test(text)) {
        pushIssue(issues, {
          code: rule.code,
          path: issuePath,
          message: rule.message,
          evidence: text
        });
      }
    }
    if (/^(?:synonyms|antonyms|derivatives|confusables)\[/.test(issuePath) && containsForbiddenRelationText(text)) {
      pushIssue(issues, {
        code: 'FORBIDDEN_RELATION_TEXT',
        path: issuePath,
        source: 'quality-relations',
        message: 'The reusable relation-quality policy rejects this placeholder or generic wording.',
        evidence: text
      });
    }
  });
}

function cardMetrics(card) {
  const contextGroups = safeArray(card?.contextPhrases);
  const relatedGroups = safeArray(card?.relatedVocabulary);
  const questions = safeArray(card?.questions);
  return {
    meanings: safeArray(card?.meanings).length,
    contextCategories: contextGroups.length,
    contextItems: contextGroups.reduce((sum, group) => sum + safeArray(group?.items).length, 0),
    fixedPhrases: safeArray(card?.fixedPhrases).length,
    derivatives: safeArray(card?.derivatives).length,
    synonyms: safeArray(card?.synonyms).length,
    antonyms: safeArray(card?.antonyms).length,
    confusables: safeArray(card?.confusables).length,
    relatedCategories: relatedGroups.length,
    relatedItems: relatedGroups.reduce((sum, group) => sum + safeArray(group?.items).length, 0),
    examples: safeArray(card?.examples).length,
    questions: questions.length
  };
}

export function reviewCard(card, {
  index = 0,
  minimums = resolveReviewMinimums(),
  templateLock = {},
  activeTemplateVersion = '',
  activeContentVersion = '',
  sectionReport = { issues: [] },
  duplicateCardIds = new Set(),
  duplicateWords = new Set()
} = {}) {
  const issues = [];
  if (!card || typeof card !== 'object' || Array.isArray(card)) {
    pushIssue(issues, {
      code: 'INVALID_CARD_RECORD',
      path: `cards[${index}]`,
      message: 'Card entry must be an object.',
      evidence: card
    });
  }
  const safeCard = card && typeof card === 'object' && !Array.isArray(card) ? card : {};
  const thresholds = thresholdsForCard(safeCard, minimums, templateLock);
  addSectionIssues(issues, sectionReport);
  checkCardMetadata(issues, safeCard, templateLock, activeTemplateVersion, activeContentVersion, index);
  checkCoreMemory(issues, safeCard, thresholds);
  checkMeanings(issues, safeCard, thresholds);
  checkContextPhrases(issues, safeCard, thresholds);
  checkFixedPhrases(issues, safeCard, thresholds);
  checkRelations(issues, safeCard, thresholds);
  checkRelatedVocabulary(issues, safeCard, thresholds);
  checkExamples(issues, safeCard, thresholds);
  checkQuestions(issues, safeCard, thresholds);
  checkCrossSectionDuplicates(issues, safeCard);
  checkForbiddenText(issues, safeCard);
  checkReferenceShape(issues, safeCard, templateLock);
  if (duplicateCardIds.has(compact(safeCard.id))) {
    pushIssue(issues, {
      code: 'DUPLICATE_CARD_ID',
      path: 'id',
      message: 'Card ID is duplicated elsewhere in the catalog.',
      evidence: safeCard.id
    });
  }
  if (duplicateWords.has(normalizeLearningKey(safeCard.word))) {
    pushIssue(issues, {
      code: 'DUPLICATE_CARD_WORD',
      path: 'word',
      message: 'Card headword is duplicated elsewhere in the catalog.',
      evidence: safeCard.word
    });
  }
  const uniqueIssues = deduplicateIssues(issues);
  return {
    index: index + 1,
    cardId: compact(safeCard.id) || null,
    word: compact(safeCard.word) || null,
    status: uniqueIssues.length ? 'fail' : 'pass',
    metrics: cardMetrics(safeCard),
    thresholds,
    issueCount: uniqueIssues.length,
    issues: uniqueIssues
  };
}

function duplicateSet(values, normalize = compact) {
  const counts = new Map();
  for (const value of values) {
    const key = normalize(value);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return new Set([...counts.entries()].filter(([, count]) => count > 1).map(([key]) => key));
}

function checkTemplateAndManifest(collectionIssues, { catalog, manifest, release, templateLock, templateText, catalogDigest }) {
  const cards = safeArray(catalog?.cards);
  const cardIds = cards.map((card) => compact(card?.id));
  const manifestIds = safeArray(manifest?.cardIds).map(compact);
  const reviewedIds = cards.filter((card) => card?.reviewed === true).map((card) => compact(card?.id));
  const manifestReviewedIds = safeArray(manifest?.reviewedCardIds).map(compact);
  const requiredMinimumFields = [
    'contextCategories',
    'contextItems',
    'fixedPhrases',
    'synonyms',
    'antonyms',
    'confusables',
    'relatedCategories',
    'relatedItems',
    'highFrequencyExamples'
  ];
  const referenceShapeFields = [
    'meaningRows',
    ...requiredMinimumFields,
    'antonyms',
    'derivatives',
    'confusables'
  ];
  if (templateLock?.immutable !== true || !nonEmpty(templateLock?.lockVersion)) {
    pushIssue(collectionIssues, {
      code: 'INVALID_TEMPLATE_LOCK_METADATA',
      path: 'templateLock',
      message: 'Template lock must be immutable and have a non-empty lockVersion.',
      evidence: { immutable: templateLock?.immutable, lockVersion: templateLock?.lockVersion }
    });
  }
  for (const field of ['antonyms', 'confusables']) {
    if (Object.hasOwn(templateLock?.adaptiveSections ?? {}, field)) {
      pushIssue(collectionIssues, {
        code: 'MANDATORY_RELATION_MARKED_ADAPTIVE',
        path: `templateLock.adaptiveSections.${field}`,
        message: 'Mandatory relation sections cannot be disabled through adaptive-section metadata.',
        evidence: templateLock.adaptiveSections[field]
      });
    }
  }
  if (!nonEmpty(templateLock?.appliedSpecification?.path)
    || !/^[A-F0-9]{64}$/i.test(String(templateLock?.appliedSpecification?.sha256 ?? ''))) {
    pushIssue(collectionIssues, {
      code: 'INVALID_APPLIED_TEMPLATE_LOCK',
      path: 'templateLock.appliedSpecification',
      message: 'Applied template lock needs a path and a 64-character SHA-256 hash.',
      evidence: templateLock?.appliedSpecification
    });
  }
  for (const field of requiredMinimumFields) {
    const value = templateLock?.publishedCardMinimums?.[field];
    const hardFloor = field === 'antonyms'
      ? Math.max(BASE_MINIMUMS.antonyms, templateLock?.qualityContract?.minimumAntonymsPerCard ?? 0)
      : field === 'confusables'
        ? Math.max(BASE_MINIMUMS.confusables, templateLock?.qualityContract?.minimumConfusablesPerCard ?? 0)
        : 0;
    if (!Number.isInteger(value) || value < hardFloor) {
      pushIssue(collectionIssues, {
        code: 'TEMPLATE_MINIMUM_MISSING_OR_INVALID',
        path: `templateLock.publishedCardMinimums.${field}`,
        message: 'Required published-card count floor must be explicit and no weaker than its quality-contract floor.',
        evidence: value
      });
    }
  }
  const curatedMinimumSources = {
    contextCategories: templateLock?.curatedCardMinimums?.contextCategories
      ?? templateLock?.qualityContract?.curatedContextCategories
      ?? templateLock?.publishedCardMinimums?.contextCategories,
    contextItems: templateLock?.curatedCardMinimums?.contextItems,
    fixedPhrases: templateLock?.curatedCardMinimums?.fixedPhrases,
    synonyms: templateLock?.curatedCardMinimums?.synonyms,
    antonyms: templateLock?.curatedCardMinimums?.antonyms,
    confusables: templateLock?.curatedCardMinimums?.confusables,
    relatedCategories: templateLock?.curatedCardMinimums?.relatedCategories
      ?? templateLock?.qualityContract?.curatedRelatedCategories
      ?? templateLock?.publishedCardMinimums?.relatedCategories,
    relatedItems: templateLock?.curatedCardMinimums?.relatedItems,
    highFrequencyExamples: templateLock?.curatedCardMinimums?.highFrequencyExamples
  };
  for (const [field, value] of Object.entries(curatedMinimumSources)) {
      const hardFloor = field === 'antonyms'
        ? Math.max(BASE_MINIMUMS.antonyms, templateLock?.qualityContract?.minimumAntonymsPerCard ?? 0)
        : field === 'confusables'
          ? Math.max(BASE_MINIMUMS.confusables, templateLock?.qualityContract?.minimumConfusablesPerCard ?? 0)
          : 0;
      if (!Number.isInteger(value) || value < hardFloor) {
        pushIssue(collectionIssues, {
          code: 'TEMPLATE_MINIMUM_MISSING_OR_INVALID',
          path: `templateLock.curatedCardMinimums.${field}`,
          message: 'Required curated-card count floor must resolve to a value no weaker than the quality-contract floor.',
          evidence: value
        });
      }
  }
  for (const field of referenceShapeFields) {
    const value = templateLock?.referenceCard?.recordedShape?.[field];
    const hardFloor = field === 'antonyms'
      ? BASE_REFERENCE_RELATION_MINIMUMS.antonyms
      : field === 'confusables'
        ? BASE_REFERENCE_RELATION_MINIMUMS.confusables
        : 0;
    if (!Number.isInteger(value) || value < hardFloor) {
      pushIssue(collectionIssues, {
        code: 'REFERENCE_SHAPE_MISSING_OR_INVALID',
        path: `templateLock.referenceCard.recordedShape.${field}`,
        message: `Reference-card shape must explicitly record every learner-facing section count and preserve the ${hardFloor} floor.`,
        evidence: value
      });
    }
  }
  for (const field of ['coreStructures', 'commonErrorPairs', 'minimumAntonymsPerCard', 'minimumConfusablesPerCard']) {
    const value = templateLock?.qualityContract?.[field];
    const hardFloor = field === 'minimumAntonymsPerCard'
      ? BASE_MINIMUMS.antonyms
      : field === 'minimumConfusablesPerCard'
        ? BASE_MINIMUMS.confusables
        : 1;
    if (!Number.isInteger(value) || value < hardFloor) {
      pushIssue(collectionIssues, {
        code: 'QUALITY_CONTRACT_MISSING_OR_INVALID',
        path: `templateLock.qualityContract.${field}`,
        message: `Core template quality floor must be an explicit integer no lower than ${hardFloor}.`,
        evidence: value
      });
    }
  }

  if (catalog?.total !== EXPECTED_CARD_COUNT) {
    pushIssue(collectionIssues, {
      code: 'CATALOG_TOTAL_MISMATCH',
      path: 'catalog.total',
      message: `Catalog total must equal ${EXPECTED_CARD_COUNT}.`,
      evidence: catalog?.total
    });
  }
  if (cards.length !== EXPECTED_CARD_COUNT) {
    pushIssue(collectionIssues, {
      code: 'CARD_COUNT_MISMATCH',
      path: 'catalog.cards',
      message: `Catalog must contain exactly ${EXPECTED_CARD_COUNT} cards.`,
      evidence: cards.length
    });
  }
  if (new Set(cardIds.filter(Boolean)).size !== EXPECTED_CARD_COUNT) {
    pushIssue(collectionIssues, {
      code: 'CARD_IDS_NOT_150_UNIQUE',
      path: 'catalog.cards[].id',
      message: `Catalog must contain ${EXPECTED_CARD_COUNT} non-empty unique card IDs.`,
      evidence: { cards: cards.length, uniqueIds: new Set(cardIds.filter(Boolean)).size }
    });
  }
  const normalizedWords = cards.map((card) => normalizeLearningKey(card?.word)).filter(Boolean);
  if (new Set(normalizedWords).size !== EXPECTED_CARD_COUNT) {
    pushIssue(collectionIssues, {
      code: 'CARD_WORDS_NOT_150_UNIQUE',
      path: 'catalog.cards[].word',
      message: `Catalog must contain ${EXPECTED_CARD_COUNT} non-empty unique headwords.`,
      evidence: { cards: cards.length, uniqueWords: new Set(normalizedWords).size }
    });
  }
  if (manifestIds.length !== EXPECTED_CARD_COUNT || manifestIds.some((id, index) => id !== cardIds[index])) {
    pushIssue(collectionIssues, {
      code: 'MANIFEST_CARD_IDS_MISMATCH',
      path: 'manifest.cardIds',
      message: 'Content manifest card IDs must exactly match the catalog in order and coverage.',
      evidence: { manifestCount: manifestIds.length, catalogCount: cardIds.length }
    });
  }
  if (manifestReviewedIds.length !== reviewedIds.length
    || manifestReviewedIds.some((id, index) => id !== reviewedIds[index])) {
    pushIssue(collectionIssues, {
      code: 'MANIFEST_REVIEWED_IDS_MISMATCH',
      path: 'manifest.reviewedCardIds',
      message: 'Manifest reviewedCardIds must exactly match cards marked reviewed: true.',
      evidence: { manifestCount: manifestReviewedIds.length, catalogCount: reviewedIds.length }
    });
  }
  if (catalog?.contentVersion !== manifest?.contentVersion) {
    pushIssue(collectionIssues, {
      code: 'CONTENT_VERSION_MISMATCH',
      path: 'catalog.contentVersion/manifest.contentVersion',
      message: 'Catalog and content manifest use different content versions.',
      evidence: { catalog: catalog?.contentVersion, manifest: manifest?.contentVersion }
    });
  }
  if (!release || typeof release !== 'object' || Array.isArray(release)
    || release.contentVersion !== catalog?.contentVersion
    || release.contentVersion !== manifest?.contentVersion
    || release.templateVersion !== catalog?.templateVersion
    || release.templateVersion !== manifest?.templateVersion
    || release.templateLockVersion !== templateLock?.lockVersion
    || (release.catalogHash && release.catalogHash !== manifest?.catalogHash)
    || (release.catalogHash && catalogDigest && release.catalogHash !== catalogDigest)) {
    pushIssue(collectionIssues, {
      code: 'RELEASE_VERSION_MISMATCH',
      path: 'release/catalog/manifest/templateLock',
      message: 'Release, catalog, manifest, and template lock versions must form one immutable publication unit.',
      evidence: {
        releaseContent: release?.contentVersion,
        catalogContent: catalog?.contentVersion,
        manifestContent: manifest?.contentVersion,
        releaseTemplate: release?.templateVersion,
        catalogTemplate: catalog?.templateVersion,
        manifestTemplate: manifest?.templateVersion,
        releaseLock: release?.templateLockVersion,
        lockVersion: templateLock?.lockVersion,
        releaseCatalogHash: release?.catalogHash,
        manifestCatalogHash: manifest?.catalogHash,
        catalogDigest
      }
    });
  }
  const appliedTemplateVersion = templateLock?.appliedSpecification?.path
    ? path.basename(templateLock.appliedSpecification.path, path.extname(templateLock.appliedSpecification.path))
    : '';
  if (catalog?.templateVersion !== manifest?.templateVersion
    || (appliedTemplateVersion && catalog?.templateVersion !== appliedTemplateVersion)) {
    pushIssue(collectionIssues, {
      code: 'TEMPLATE_VERSION_MISMATCH',
      path: 'catalog.templateVersion/manifest.templateVersion/templateLock.appliedSpecification.path',
      message: 'Catalog, manifest, and applied template specification must use the same template version.',
      evidence: {
        catalog: catalog?.templateVersion,
        manifest: manifest?.templateVersion,
        appliedSpecification: appliedTemplateVersion
      }
    });
  }
  if (!nonEmpty(templateText)) {
    pushIssue(collectionIssues, {
      code: 'TEMPLATE_SPECIFICATION_EMPTY',
      path: 'template',
      message: 'The applied template specification is empty.'
    });
  } else {
    let previous = -1;
    for (const heading of TEMPLATE_HEADINGS) {
      const current = templateText.indexOf(heading);
      if (current < 0 || current <= previous) {
        pushIssue(collectionIssues, {
          code: 'TEMPLATE_SECTION_MISSING_OR_REORDERED',
          path: 'template',
          message: `Template is missing or reorders required heading ${heading}.`,
          evidence: heading
        });
      }
      previous = current;
    }
    const expectedHash = templateLock?.appliedSpecification?.sha256;
    if (expectedHash && sha256(templateText) !== expectedHash) {
      pushIssue(collectionIssues, {
        code: 'TEMPLATE_HASH_MISMATCH',
        path: 'templateLock.appliedSpecification.sha256',
        message: 'Applied template content does not match the hash recorded in template-lock.json.',
        evidence: { expected: expectedHash, actual: sha256(templateText) }
      });
    }
  }
}

function summarizeIssues(cardReports, collectionIssues) {
  const issueCountsByCode = {};
  for (const issue of [...collectionIssues, ...cardReports.flatMap((card) => card.issues)]) {
    issueCountsByCode[issue.code] = (issueCountsByCode[issue.code] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(issueCountsByCode).sort(([left], [right]) => left.localeCompare(right)));
}

export function reviewCatalog({
  catalog,
  manifest,
  release,
  templateLock,
  templateText,
  generatedAt = new Date().toISOString(),
  inputs = {},
  sourceDigests = {}
}) {
  const collectionIssues = [];
  if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog)) {
    pushIssue(collectionIssues, {
      code: 'INVALID_CATALOG',
      path: 'catalog',
      message: 'all-cards.json must contain a JSON object.'
    });
  }
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    pushIssue(collectionIssues, {
      code: 'INVALID_MANIFEST',
      path: 'manifest',
      message: 'content-manifest.json must contain a JSON object.'
    });
  }
  if (!templateLock || typeof templateLock !== 'object' || Array.isArray(templateLock)) {
    pushIssue(collectionIssues, {
      code: 'INVALID_TEMPLATE_LOCK',
      path: 'templateLock',
      message: 'template-lock.json must contain a JSON object.'
    });
  }
  const safeCatalog = catalog && typeof catalog === 'object' && !Array.isArray(catalog) ? catalog : {};
  const safeManifest = manifest && typeof manifest === 'object' && !Array.isArray(manifest) ? manifest : {};
  const safeTemplateLock = templateLock && typeof templateLock === 'object' && !Array.isArray(templateLock) ? templateLock : {};
  const cards = safeArray(safeCatalog.cards);
  checkTemplateAndManifest(collectionIssues, {
    catalog: safeCatalog,
    manifest: safeManifest,
    release,
    templateLock: safeTemplateLock,
    templateText: String(templateText ?? ''),
    catalogDigest: sourceDigests?.allCards?.sha256
  });
  const minimums = resolveReviewMinimums(safeTemplateLock);
  const duplicateCardIds = duplicateSet(cards.map((card) => card?.id));
  const duplicateWords = duplicateSet(cards.map((card) => card?.word), normalizeLearningKey);
  const reusableReports = sectionAuditReports(cards, collectionIssues);
  const cardReports = cards.map((card, index) => reviewCard(card, {
    index,
    minimums,
    templateLock: safeTemplateLock,
    activeTemplateVersion: safeCatalog.templateVersion,
    activeContentVersion: safeCatalog.contentVersion,
    sectionReport: reusableReports[index],
    duplicateCardIds,
    duplicateWords
  }));
  const uniqueCollectionIssues = deduplicateIssues(collectionIssues);
  const failedCards = cardReports.filter((card) => card.status === 'fail').length;
  const issueCountsByCode = summarizeIssues(cardReports, uniqueCollectionIssues);
  const totalIssues = uniqueCollectionIssues.length + cardReports.reduce((sum, card) => sum + card.issueCount, 0);
  const status = totalIssues ? 'fail' : 'pass';
  return {
    schemaVersion: '1.1.0',
    generatedAt,
    status,
    inputs,
    sourceDigests,
    contract: {
      expectedCardCount: EXPECTED_CARD_COUNT,
      contentVersion: safeCatalog.contentVersion ?? null,
      templateVersion: safeCatalog.templateVersion ?? null,
      templateLockVersion: safeTemplateLock.lockVersion ?? null,
      minimums,
      requiredQuestionTypes: [...REQUIRED_QUESTION_TYPES]
    },
    summary: {
      cards: cardReports.length,
      reviewedCards: cards.filter((card) => card?.reviewed === true).length,
      passed: cardReports.length - failedCards,
      failed: failedCards,
      passedCards: cardReports.length - failedCards,
      failedCards,
      collectionIssueCount: uniqueCollectionIssues.length,
      cardIssueCount: cardReports.reduce((sum, card) => sum + card.issueCount, 0),
      totalIssues,
      issueCountsByCode
    },
    collectionIssues: uniqueCollectionIssues,
    cards: cardReports
  };
}

async function readJson(filePath, label) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    const cause = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to read ${label} at ${filePath}: ${cause}`);
  }
}

async function writeReport(reportPath, report) {
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

function failureReport({ generatedAt, inputs, sourceDigests = {}, message }) {
  const issue = {
    code: 'REVIEW_INPUT_FAILURE',
    severity: 'error',
    source: 'full-review',
    path: 'inputs',
    message: 'The full-card review could not load its required catalog, manifest, or template input.',
    evidence: excerpt(message)
  };
  return {
    schemaVersion: '1.1.0',
    generatedAt,
    status: 'fail',
    inputs,
    sourceDigests,
    contract: { expectedCardCount: EXPECTED_CARD_COUNT },
    summary: {
      cards: 0,
      reviewedCards: 0,
      passed: 0,
      failed: 0,
      passedCards: 0,
      failedCards: 0,
      collectionIssueCount: 1,
      cardIssueCount: 0,
      totalIssues: 1,
      issueCountsByCode: { REVIEW_INPUT_FAILURE: 1 }
    },
    collectionIssues: [issue],
    cards: []
  };
}

export function exitCodeForReport(report) {
  return report?.status === 'pass' ? 0 : 1;
}

export async function runCardReview({
  paths = DEFAULT_REVIEW_PATHS,
  generatedAt = new Date().toISOString()
} = {}) {
  const resolvedPaths = {
    catalog: path.resolve(paths.catalog ?? DEFAULT_REVIEW_PATHS.catalog),
    manifest: path.resolve(paths.manifest ?? DEFAULT_REVIEW_PATHS.manifest),
    release: path.resolve(paths.release ?? DEFAULT_REVIEW_PATHS.release),
    templateLock: path.resolve(paths.templateLock ?? DEFAULT_REVIEW_PATHS.templateLock),
    manualPacks: path.resolve(paths.manualPacks ?? DEFAULT_REVIEW_PATHS.manualPacks),
    report: path.resolve(paths.report ?? DEFAULT_REVIEW_PATHS.report)
  };
  const inputs = { ...resolvedPaths };
  let sourceDigests = {};
  let report;
  try {
    const [catalog, manifest, release, templateLock] = await Promise.all([
      readJson(resolvedPaths.catalog, 'catalog'),
      readJson(resolvedPaths.manifest, 'content manifest'),
      readJson(resolvedPaths.release, 'release manifest'),
      readJson(resolvedPaths.templateLock, 'template lock')
    ]);
    const templatePath = paths.template
      ? path.resolve(paths.template)
      : path.resolve(projectRoot, templateLock.appliedSpecification?.path ?? '');
    if (!templateLock.appliedSpecification?.path && !paths.template) {
      throw new Error('template-lock.json does not identify appliedSpecification.path.');
    }
    inputs.template = templatePath;
    const templateText = await fs.readFile(templatePath, 'utf8');
    sourceDigests = await computeReviewSourceDigests({ paths: resolvedPaths, templatePath });
    report = reviewCatalog({
      catalog,
      manifest,
      release,
      templateLock,
      templateText,
      generatedAt,
      inputs,
      sourceDigests
    });
  } catch (error) {
    report = failureReport({
      generatedAt,
      inputs,
      sourceDigests,
      message: error instanceof Error ? error.message : String(error)
    });
  }
  try {
    await writeReport(resolvedPaths.report, report);
  } catch (error) {
    const cause = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to write card review report at ${resolvedPaths.report}: ${cause}`);
  }
  return { report, reportPath: resolvedPaths.report, exitCode: exitCodeForReport(report) };
}

export function renderConsoleReport(report, reportPath) {
  const lines = [];
  for (const card of report.cards) {
    lines.push(`[${card.status.toUpperCase()}] ${String(card.index).padStart(3, '0')} ${card.cardId ?? '(missing id)'}${card.word ? ` (${card.word})` : ''} - ${card.issueCount} issue(s)`);
    for (const issue of card.issues) {
      const location = issue.path ? ` ${issue.path}` : '';
      const evidence = issue.evidence ? ` Received: ${issue.evidence}` : '';
      lines.push(`  - [${issue.code}]${location}: ${issue.message}${evidence}`);
    }
  }
  for (const issue of report.collectionIssues) {
    const location = issue.path ? ` ${issue.path}` : '';
    const evidence = issue.evidence ? ` Received: ${issue.evidence}` : '';
    lines.push(`[COLLECTION FAIL] [${issue.code}]${location}: ${issue.message}${evidence}`);
  }
  lines.push(`Card review ${report.status.toUpperCase()}: ${report.summary.passedCards}/${report.summary.cards} cards passed; ${report.summary.totalIssues} total issue(s).`);
  lines.push(`JSON report: ${reportPath}`);
  return lines.join('\n');
}

function parseArguments(argv) {
  const paths = { ...DEFAULT_REVIEW_PATHS };
  const keys = new Map([
    ['--catalog', 'catalog'],
    ['--manifest', 'manifest'],
    ['--release', 'release'],
    ['--template-lock', 'templateLock'],
    ['--manual-packs', 'manualPacks'],
    ['--template', 'template'],
    ['--report', 'report']
  ]);
  for (let index = 0; index < argv.length; index += 1) {
    const key = keys.get(argv[index]);
    if (!key) throw new Error(`Unknown argument: ${argv[index]}`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${argv[index]}`);
    paths[key] = value;
    index += 1;
  }
  return paths;
}

function isMainModule() {
  if (!process.argv[1]) return false;
  return import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
}

if (isMainModule()) {
  try {
    const paths = parseArguments(process.argv.slice(2));
    const result = await runCardReview({ paths });
    const output = renderConsoleReport(result.report, result.reportPath);
    if (result.exitCode) console.error(output);
    else console.log(output);
    process.exitCode = result.exitCode;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
