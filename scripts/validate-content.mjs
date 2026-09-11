import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { directRelationPacks } from './relation-packs.mjs';
import { manualDerivativePacks, manualMeaningPacks } from './deep-card-rules.mjs';
import { fixedExampleIssue, mechanicalContextIssue, phraseContainsTarget, reusablePhraseIssue } from './quality-sections.mjs';
import { manualCardPacks } from './manual-card-packs.mjs';
import { finalizeMeaningRows } from './common-noun-senses.mjs';
import { hasMultiplePrimaryStressesForSingleWord, isAmericanIpa, isLowValueDerivative, relationNoteSpecificityIssue } from './quality-relations.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const allCardsPath = path.join(root, 'public', 'data', 'all-cards.json');
const manifestPath = path.join(root, 'public', 'data', 'manifest.json');
const contentManifestPath = path.join(root, 'content', 'content-manifest.json');
const releasePath = path.join(root, 'content', 'release.json');
const auditPath = path.join(root, 'content', 'coca-audit.json');
const wordMetadataPath = path.join(root, 'scripts', 'word-metadata.json');
const wordnetEnrichmentPath = path.join(root, 'scripts', 'wordnet-enrichment.json');
const ecdictEnrichmentPath = path.join(root, 'scripts', 'ecdict-enrichment.json');
const tatoebaExamplesPath = path.join(root, 'scripts', 'tatoeba-examples.json');
const qualityReportPath = path.join(root, 'content', 'content-quality-report.json');
const runtimeReleasePath = path.join(root, 'src', 'config', 'release.ts');
const templateLockPath = path.join(root, 'content', 'templates', 'template-lock.json');
const allCardsRaw = await fs.readFile(allCardsPath, 'utf8');
const allCards = JSON.parse(allCardsRaw);
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const contentManifest = JSON.parse(await fs.readFile(contentManifestPath, 'utf8'));
const release = JSON.parse(await fs.readFile(releasePath, 'utf8'));
const cocaAudit = JSON.parse(await fs.readFile(auditPath, 'utf8'));
const wordMetadata = JSON.parse(await fs.readFile(wordMetadataPath, 'utf8'));
const wordnetEnrichment = JSON.parse(await fs.readFile(wordnetEnrichmentPath, 'utf8'));
const ecdictEnrichment = JSON.parse(await fs.readFile(ecdictEnrichmentPath, 'utf8'));
const tatoebaExamples = JSON.parse(await fs.readFile(tatoebaExamplesPath, 'utf8'));
const runtimeRelease = await fs.readFile(runtimeReleasePath, 'utf8');
const templatePath = path.join(root, 'content', 'templates', release.templateVersion + '.md');
const template = await fs.readFile(templatePath, 'utf8');
const templateLock = JSON.parse(await fs.readFile(templateLockPath, 'utf8'));
const errors = [];
const strictQualityFailureCounts = new Map();
const compactValue = (value, maximum = 180) => {
  const rendered = JSON.stringify(value);
  if (rendered === undefined) return String(value);
  return rendered.length > maximum ? rendered.slice(0, maximum - 1) + '…' : rendered;
};
const strictQualityError = (card, rule, field, message, value, count = 1) => {
  strictQualityFailureCounts.set(rule, (strictQualityFailureCounts.get(rule) ?? 0) + count);
  const location = `${card.id}.${field}`;
  const evidence = value === undefined ? '' : ` Received ${compactValue(value)}.`;
  errors.push(`[${rule}] ${location}: ${message}${evidence}`);
};
const normalizeLexicalText = (value) => String(value ?? '')
  .normalize('NFKC')
  .toLocaleLowerCase('en-US')
  .replace(/[‘’]/g, "'")
  .replace(/\s+/g, ' ')
  .replace(/[.!?。！？]+$/g, '')
  .trim();
const canonicalLearnerText = (value) => String(value ?? '')
  .normalize('NFKC')
  .replace(/\s+/g, ' ')
  .trim();
const canonicalLearnerValue = (value) => {
  if (Array.isArray(value)) return value.map(canonicalLearnerValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, canonicalLearnerValue(entry)]));
  }
  return typeof value === 'string' ? canonicalLearnerText(value) : value;
};
const sameLearnerValue = (expected, actual) => JSON.stringify(canonicalLearnerValue(expected)) === JSON.stringify(canonicalLearnerValue(actual));
const normalizedPackGloss = (value) => String(value ?? '').trim().replace(/[。！？!?;；]+$/g, '');
const derivativePartOfSpeechRankForPack = (value = '') => Math.min(...['v.', 'n.', 'adj.', 'adv.']
  .map((part, index) => String(value).toLowerCase().split(/\s*\/\s*/).includes(part) ? index : 99));
const splitChineseGloss = (value) => String(value ?? '')
  .split(/[；;,，、/]+/)
  .map((part) => part.replace(/[\s…‥.]/g, '').trim())
  .filter(Boolean);
const ecdictTranslationGroups = (word) => {
  const translation = ecdictEnrichment.entries?.[word.toLocaleLowerCase('en-US')]?.translation ?? '';
  const groups = { verb: [], nonVerb: [] };
  for (const line of translation.split(/\r?\n|\\n/)) {
    const match = line.trim().match(/^([a-z]+)\.\s*(.+)$/i);
    if (!match) continue;
    const destination = /^(?:v|vt|vi|aux)$/i.test(match[1]) ? groups.verb : groups.nonVerb;
    destination.push(...splitChineseGloss(match[2]));
  }
  return groups;
};
const chineseGlossesOverlap = (left, right) => left.some((first) => right.some((second) => {
  if (first === second) return true;
  const shortest = Math.min(first.length, second.length);
  return shortest >= 2 && (first.includes(second) || second.includes(first));
}));
const allowedNonVerbSynonymPairs = new Set([
  'work:job',
  'work:employment',
  'may:possibly',
  'may:perhaps',
  'might:perhaps',
  'might:possibly'
]);
const reviewedVerbSenseExceptionPairs = new Set([
  'see:view',
  'watch:view',
  'give:grant',
  'lead:guide',
  'offer:bid',
  // WordNet records tender as a verb meaning "make a tender of"; ECDICT's
  // Chinese verb gloss omits the formal “递交/正式提出” sense used here.
  'offer:tender',
  'fall:plunge',
  'serve:supply',
  'cut:slice',
  'reduce:cut',
  'feel:touch',
  'affect:touch',
  'handle:touch'
]);
const genericRelatedCategoryNames = new Set([
  '同一语义场的高频词',
  '近义表达分类',
  '对比与易混表达分类',
  '常用词族分类',
  '相关表达分类',
  '其他词汇',
  '常用词汇',
  '同类词汇'
]);
const learnerFacingMetaPattern = /(?:目标词|本词卡|词卡(?:中|内容|结构|规则|模板)|这张词卡|本卡(?:中|片)?)/;
const synonymPlaceholderPattern = /(?:相近的常用表达|与["“]?.+["”]?意义(?:接近|相近)|^(?:近义词|近义表达)$)/;
const confusablePlaceholderPattern = /(?:^与\s*.+\s*容易混淆的(?:表达|词)$|^(?:易混词|相似表达)$)/;
const genericSynonymDifferencePattern = /(?:只覆盖其中一个义项|是否能够替换取决于两词各自的宾语、介词和语体|使用范围更具体，替换时要核对宾语、介词和语境|在本卡的一个常用义项下意思接近|只有在两词都取这个动作义且句型相容时才能替换|两词只有在这一义项重合时才能互换)/;
const genericConfusableDifferencePattern = /(?:两者容易因拼写、发音或相近语境而混淆|使用时要根据完整句义和固定搭配区分)/;
const ipaAsciiPlaceholderPattern = /\b(?:someone|somebody|something|somewhere|doing|done|clause|noun|verb|adjective|adverb|word|words)\b|(?:^|[\s/+])(?:A|B)(?=$|[\s/])/i;
const phraseChineseLooksLikeSentence = (value) => {
  const text = String(value ?? '').trim();
  return /[。！？!?]/.test(text)
    || /(?:吗|呢|吧|嘛|呀|啊)$/.test(text)
    || /^(?:我|你|他|她|它|我们|你们|他们|她们|它们)(?:该|能|可以|愿意|想|觉得|认为|知道|明白|相信|简直|或许|怎么|如何|是否|是|要|会|应该|不|没|有|已经)/.test(text)
    || /^(?:大家|人们)都/.test(text);
};
const summarizeChineseMeanings = (meanings) => {
  const seen = new Set();
  return meanings
    .flatMap((meaning) => meaning.chinese.split('；'))
    .map((gloss) => gloss.trim())
    .filter((gloss) => gloss && !seen.has(gloss) && seen.add(gloss))
    .join('；');
};
const expectedTemplateVersion = release.templateVersion;
const expectedLockVersion = release.templateLockVersion;
const expectedSnapshotHashes = {
  'canonical-template': '9A5AB81BC487F47015B7D3C74E732089481A14E49120C63FACEDA082AE67141A',
  'canonical-example': 'DF9D024B49143DFDE1C53AE3C40EE77B86CDE5BC1A1A7CD3382980E260447CFD'
};
const expectedAppliedSpecificationHash = 'B8321515077C1942009C865975F24D2E7CB067A827EF30D3E4C84A82D1CCA189';

for (const [key, value] of Object.entries(release)) {
  if (!runtimeRelease.includes(`${key}: '${value}'`)) {
    errors.push(`Runtime release mirror differs from content/release.json at ${key}.`);
  }
}
const requiredReviewedWords = new Set(['improve', 'notice', 'support', 'likely', 'manage', 'provide', 'understand', 'believe', 'create', 'include', 'work']);
const forbiddenGeneratedCopy = [
  /The phrase [“\"].+[”\"] is useful in everyday English/i,
  /vocabulary notebook/i,
  /Listen for .+ in real conversations/i,
  /We practiced .+ aloud three times/i,
  /与本词相关的常用表达/,
  /同一学习主题中的高频词/,
  /真实表达延伸/,
  /主动输出提示/,
  /语体、宾语范围和固定搭配可能不同/,
  /实际使用前仍要核对词性和句型/,
  /这是 .+ 的常用词族成员/,
  /对应的常用英文义是/,
  /原句语境：/,
  /\b(?:review mode|cloud sync|sync failure|saved progress|search box|the app)\b/i,
  /人工精校|AI 生成|自动生成|程序运行|JSON 对象|confidence:/i
];

const sha256 = (content) => crypto.createHash('sha256').update(content).digest('hex').toUpperCase();
const catalogHash = sha256(allCardsRaw);
if (manifest.catalogHash !== catalogHash) errors.push('Public manifest catalogHash does not match the exact all-cards.json bytes.');
if (contentManifest.catalogHash !== catalogHash) errors.push('Content manifest catalogHash does not match the exact all-cards.json bytes.');
if (manifest.releaseId !== release.releaseVersion) errors.push('Public manifest releaseId differs from content/release.json.');
if (contentManifest.releaseId !== release.releaseVersion) errors.push('Content manifest releaseId differs from content/release.json.');
if (contentManifest.catalogHash !== manifest.catalogHash || contentManifest.releaseId !== manifest.releaseId) {
  errors.push('Public and content manifests do not identify the same immutable catalog release.');
}
const referenceShape = templateLock.referenceCard.recordedShape;
const curatedCardMinimums = templateLock.curatedCardMinimums;
const publishedCardMinimums = templateLock.publishedCardMinimums;
const expectedCuratedCardMinimums = {
  contextItems: 16,
  fixedPhrases: 12,
  synonyms: 5,
  relatedItems: 12,
  highFrequencyExamples: 12
};
const shapeFor = (card) => ({
  meaningRows: card.meanings.length,
  contextCategories: card.contextPhrases.length,
  contextItems: card.contextPhrases.reduce((sum, group) => sum + group.items.length, 0),
  fixedPhrases: card.fixedPhrases.length,
  synonyms: card.synonyms.length,
  antonyms: card.antonyms.length,
  derivatives: card.derivatives.length,
  confusables: card.confusables.length,
  relatedCategories: card.relatedVocabulary.length,
  relatedItems: card.relatedVocabulary.reduce((sum, group) => sum + group.items.length, 0),
  highFrequencyExamples: card.examples.length
});
const meetsShape = (card, expected) => {
  const actual = shapeFor(card);
  return Object.entries(expected).every(([key, minimum]) => actual[key] >= minimum);
};
const matchesShape = (card, expected) => {
  const actual = shapeFor(card);
  return Object.entries(expected).every(([key, value]) => actual[key] === value);
};
const meetsCuratedBenchmark = (card) => meetsShape(card, curatedCardMinimums);

if (templateLock.lockVersion !== expectedLockVersion || !templateLock.immutable || templateLock.sourceReferences?.length !== 2) {
  errors.push('Canonical template and example lock is missing or mutable.');
} else {
  for (const reference of templateLock.sourceReferences) {
    if (reference.snapshotSha256 !== expectedSnapshotHashes[reference.role]) {
      errors.push(reference.role + ': lock manifest hash differs from the validator baseline; create a new explicit lock version.');
    }
    const snapshot = await fs.readFile(path.join(root, reference.snapshotPath));
    if (sha256(snapshot) !== reference.snapshotSha256) {
      errors.push(reference.role + ': locked snapshot hash changed; create a new explicit lock version instead of editing it in place.');
    }
  }
}
if (templateLock.appliedSpecification?.path !== `content/templates/${expectedTemplateVersion}.md`
  || templateLock.appliedSpecification?.sha256 !== expectedAppliedSpecificationHash
  || sha256(await fs.readFile(templatePath)) !== expectedAppliedSpecificationHash) {
  errors.push('Applied eight-section specification is not hash-locked to the approved release.');
}
if (JSON.stringify(curatedCardMinimums) !== JSON.stringify(expectedCuratedCardMinimums)) {
  errors.push('Curated-card minima must match the locked structural floor and must not impose counts on adaptive sections.');
}
if (!publishedCardMinimums || publishedCardMinimums.contextItems < 16 || publishedCardMinimums.fixedPhrases < 12 || publishedCardMinimums.synonyms < 5 || publishedCardMinimums.relatedItems < 12 || publishedCardMinimums.highFrequencyExamples < 12) {
  errors.push('Published-card detail floor is missing or weaker than the approved complete-card benchmark.');
}
const expectedLearnerOrder = ['核心记忆', '固定搭配和短语', '常用语境词组', '派生词', '近义词', '反义词', '易混词', '同类词汇分类'];
if (JSON.stringify(templateLock.learnerFacingSectionOrder) !== JSON.stringify(expectedLearnerOrder)) {
  errors.push('Learner-facing section order differs from the approved eight-section layout.');
}
if (!templateLock.qualityContract?.allPublishedCardsReviewed
  || templateLock.qualityContract?.curatedContextCategories !== 4
  || templateLock.qualityContract?.curatedRelatedCategories !== 3
  || !templateLock.qualityContract?.contextChineseMustBePhraseGloss
  || templateLock.qualityContract?.contextChineseMaxCharacters !== 14
  || !templateLock.qualityContract?.fixedPhraseRequiresBilingualExample
  || !templateLock.qualityContract?.coreMeaningFirst
  || !templateLock.qualityContract?.allEnglishItemsRequireAmericanIpa
  || !templateLock.qualityContract?.forbidMetaOrProductCopy
  || !templateLock.qualityContract?.forbidMechanicalFiller
  || !templateLock.qualityContract?.forbidSentenceFragmentsAsPhrases
  || !templateLock.qualityContract?.forbidCrossSectionDuplicates
  || !templateLock.qualityContract?.forbidFakeAdaptiveSectionPadding
  || !templateLock.qualityContract?.forbidQuestionMetaLanguage
  || !templateLock.qualityContract?.forbidPseudoIpa
  || !templateLock.qualityContract?.allCardsRequireManualSemanticPack
  || !templateLock.qualityContract?.forbidAutomaticContextPadding
  || !templateLock.qualityContract?.forbidWordNetRelatedFallback
  || !templateLock.qualityContract?.requireWordSpecificCommonErrors
  || !templateLock.qualityContract?.requireManualRelationNotes
  || !templateLock.qualityContract?.forbidGenericFixedExampleCarriers) {
  errors.push('The immutable semantic-quality contract is incomplete.');
}
if (tatoebaExamples.source?.license !== 'CC BY 2.0 France'
  || !tatoebaExamples.source?.attribution?.includes('tatoeba.org')
  || Object.keys(tatoebaExamples.entries ?? {}).length !== 150) {
  errors.push('Supplementary bilingual corpus metadata or card coverage is incomplete.');
}

const lockedTemplate = await fs.readFile(path.join(root, 'content', 'templates', 'learning-template.locked.md'), 'utf8');
const lockedExample = await fs.readFile(path.join(root, 'content', 'templates', 'template-test-work.locked.md'), 'utf8');
const lockedHeadings = ['# 1. 核心记忆表', '# 2. 词性与释义', '# 3. 常用语境词组', '# 4. 固定搭配和短语', '# 5. 近义词', '# 6. 反义词', '# 7. 派生词', '# 8. 易混词', '# 9. 同类词汇分类', '# 10. 高频例句', '# 学习重点'];
for (const source of [lockedTemplate, lockedExample]) {
  let previous = -1;
  for (const heading of lockedHeadings) {
    const current = source.indexOf(heading);
    if (current < 0 || current <= previous) errors.push('Locked template/example is missing or reorders section: ' + heading + '.');
    previous = current;
  }
}
if (!lockedExample.includes('# 模板格式测试：work') || !lockedTemplate.includes('全部使用表格整理')) {
  errors.push('Locked template or work example no longer matches the user-provided baseline.');
}

const expectedCardCount = cocaAudit.selection?.selectedCards ?? 150;
const expectedDayCount = Math.ceil(expectedCardCount / 5);
if (!cocaAudit.selection?.allSelectedWordsFound || cocaAudit.selection?.missingWords?.length) errors.push('COCA audit has missing selected words.');
if (cocaAudit.selection?.primaryGroupCounts?.verb !== 150 || Object.keys(cocaAudit.selection?.primaryGroupCounts ?? {}).length !== 1) errors.push('The active learning catalog must contain 150 primary verb cards and no other primary POS.');
if (wordMetadata.missing?.length || Object.keys(wordMetadata.entries ?? {}).length < 450) errors.push('Offline relation/derivative metadata extraction is incomplete.');
if (Object.keys(wordnetEnrichment.entries ?? {}).length !== expectedCardCount) errors.push('WordNet enrichment must cover every selected verb.');
if (Object.keys(ecdictEnrichment.entries ?? {}).length < 3000) errors.push('ECDICT enrichment does not cover enough relation and derivative words.');
if (allCards.cards.length !== expectedCardCount) errors.push('Expected ' + expectedCardCount + ' audited cards.');
if (Object.keys(manualCardPacks).length !== expectedCardCount - 1 || Object.hasOwn(manualCardPacks, 'work')) {
  errors.push('Manual semantic packs must cover all 149 non-reference cards exactly once.');
}
if (manifest.dailyFiles.length !== expectedDayCount) errors.push('Expected ' + expectedDayCount + ' daily files.');
if (new Set(allCards.cards.map((card) => card.id)).size !== allCards.cards.length) errors.push('Duplicate card IDs.');
if (manifest.contentVersion !== release.contentVersion || allCards.contentVersion !== release.contentVersion) errors.push('Content version differs from content/release.json.');
if (allCards.templateVersion !== expectedTemplateVersion || manifest.templateVersion !== expectedTemplateVersion) errors.push('Template version is not locked to ' + expectedTemplateVersion + '.');
const templateHeadings = ['### 1. 核心记忆', '### 2. 固定搭配和短语', '### 3. 常用语境词组', '### 4. 派生词', '### 5. 近义词', '### 6. 反义词', '### 7. 易混词', '### 8. 同类词汇分类', '## 后台例句与练习数据', '## 禁止内容'];
let previousHeadingIndex = -1;
for (const heading of templateHeadings) {
  const headingIndex = template.indexOf(heading);
  if (headingIndex < 0 || headingIndex <= previousHeadingIndex) errors.push('Canonical template is missing or reorders section: ' + heading + '.');
  previousHeadingIndex = headingIndex;
}
if (!template.includes(expectedTemplateVersion) || !template.includes('不得使用“这个短语很实用”')) errors.push('Canonical template version or anti-filler rule is missing.');

const referenceCard = allCards.cards.find((card) => card.id === templateLock.referenceCard.cardId);
if (!referenceCard || referenceCard.word !== templateLock.referenceCard.word || !matchesShape(referenceCard, referenceShape)) {
  errors.push('The locked work reference card no longer exactly matches its recorded example shape.');
}

const learningGroups = ['verb', 'noun', 'adjective', 'adverb', 'other'];
const expectedOrderedIds = cocaAudit.orderedCards?.map((entry) => entry.cardId) ?? [];
if (expectedOrderedIds.length !== allCards.cards.length || expectedOrderedIds.some((id, index) => allCards.cards[index]?.id !== id)) {
  errors.push('Card order differs from the audited primary-POS then COCA-rank order.');
}

for (const [cardIndex, card] of allCards.cards.entries()) {
  const required = ['id', 'word', 'phonetic', 'syllables', 'partOfSpeech', 'learningPriority', 'coreMemory', 'meanings', 'contextPhrases', 'fixedPhrases', 'synonyms', 'antonyms', 'derivatives', 'confusables', 'relatedVocabulary', 'examples', 'studyFocus', 'questions', 'detailLevel', 'templateVersion', 'contentVersion', 'reviewed', 'curationSource'];
  for (const field of required) {
    if (card[field] === undefined || card[field] === null) {
      errors.push(card.id + ': missing ' + field);
    }
  }
  if (card.templateVersion !== expectedTemplateVersion) errors.push(card.id + ': wrong template version.');
  if (card.reviewed !== true) {
    strictQualityError(card, 'PUBLISH_REVIEWED', 'reviewed', 'an unreviewed card cannot enter the published catalog; complete the per-card review before release', card.reviewed);
  }
  if (requiredReviewedWords.has(card.word) && !card.reviewed) errors.push(card.id + ': required human-reviewed card is not reviewed.');
  if (card.word === 'work' && card.detailLevel !== 'template-reference') errors.push(card.id + ': locked work card must be template-reference.');
  if (card.word !== 'work' && card.detailLevel !== 'template-curated') errors.push(card.id + ': every non-reference card must be template-curated after per-card review.');
  if (card.word === 'work' && card.curationSource !== 'locked-reference-example') errors.push(card.id + ': reference card must retain locked-example provenance.');
  if (card.word !== 'work' && card.curationSource !== 'manual-semantic-pack-2026.09.10.4') errors.push(card.id + ': published card does not prove manual semantic-pack provenance.');
  const semanticPack = manualCardPacks[card.word];
  if (card.word !== 'work' && !semanticPack) {
    errors.push(card.id + ': no manual semantic pack exists; automatic publication fallback is forbidden.');
  } else if (semanticPack) {
    const expectedPackKeys = ['meanings', 'fixedPhrases', 'contexts', 'synonyms', 'antonyms', 'derivatives', 'confusables', 'related', 'commonErrors'];
    const missingPackKeys = expectedPackKeys.filter((key) => !Object.hasOwn(semanticPack, key) || !Array.isArray(semanticPack[key]));
    if (missingPackKeys.length) errors.push(card.id + ': manual semantic pack omits explicit review fields: ' + missingPackKeys.join(', ') + '.');
    const comparePackSection = (field, expected, actual) => {
      if (!sameLearnerValue(expected, actual)) {
        strictQualityError(card, 'MANUAL_PACK_DIVERGENCE', field, 'published learner-facing content, ordering, or reviewed wording differs from the manual semantic pack', { expected, actual });
      }
    };
    const expectedMeanings = finalizeMeaningRows(card.word, (semanticPack.meanings ?? []).map(([partOfSpeech, english, chinese, example, translation]) => ({
      partOfSpeech, english, chinese, example, translation
    })), { authoritative: true }).map(({ partOfSpeech, english, chinese, example, translation }) => ({ partOfSpeech, english, chinese, example, translation }));
    const actualMeanings = card.meanings.map(({ partOfSpeech, english, chinese, example, translation }) => ({ partOfSpeech, english, chinese, example, translation }));
    comparePackSection('meanings', expectedMeanings, actualMeanings);

    const expectedFixed = (semanticPack.fixedPhrases ?? []).map(([phrase, chinese, example, translation]) => ({
      phrase: phrase.trim(),
      chinese: normalizedPackGloss(chinese),
      example: example.trim(),
      translation: translation.trim()
    }));
    const actualFixed = card.fixedPhrases.map(({ phrase, chinese, example, translation }) => ({ phrase, chinese, example, translation }));
    comparePackSection('fixedPhrases', expectedFixed, actualFixed);

    const expectedContexts = (semanticPack.contexts ?? []).map(([category, items]) => ({
      category,
      items: items.map(([phrase, chinese]) => ({ phrase: phrase.trim(), chinese: normalizedPackGloss(chinese) }))
    }));
    const actualContexts = card.contextPhrases.map(({ category, items }) => ({
      category,
      items: items.map(({ phrase, chinese }) => ({ phrase, chinese }))
    }));
    comparePackSection('contextPhrases', expectedContexts, actualContexts);

    for (const [packKey, cardKey, noteKey] of [
      ['synonyms', 'synonyms', 'difference'],
      ['antonyms', 'antonyms', 'usage'],
      ['confusables', 'confusables', 'difference']
    ]) {
      const expectedRelations = (semanticPack[packKey] ?? []).map(([word, partOfSpeech, chinese, note]) => ({
        word, partOfSpeech, chinese, [noteKey]: note
      }));
      const actualRelations = (card[cardKey] ?? []).map(({ word, partOfSpeech, chinese, [noteKey]: note }) => ({
        word, partOfSpeech, chinese, [noteKey]: note
      }));
      comparePackSection(cardKey, expectedRelations, actualRelations);
    }

    const seenDerivatives = new Set();
    const expectedDerivatives = (semanticPack.derivatives ?? [])
      .map(([word, partOfSpeech, chinese, note]) => ({ word, partOfSpeech, chinese, note }))
      .filter((entry) => entry.word && entry.word.toLocaleLowerCase('en-US') !== card.word.toLocaleLowerCase('en-US'))
      .filter((entry) => /(?:^|[\s/])(v\.|n\.|adj\.|adv\.)(?:$|[\s/])/i.test(entry.partOfSpeech))
      .filter((entry) => {
        const key = entry.word.toLocaleLowerCase('en-US');
        if (seenDerivatives.has(key)) return false;
        seenDerivatives.add(key);
        return true;
      })
      .sort((left, right) => derivativePartOfSpeechRankForPack(left.partOfSpeech) - derivativePartOfSpeechRankForPack(right.partOfSpeech))
      .slice(0, 8);
    const actualDerivatives = card.derivatives.map(({ word, partOfSpeech, chinese, note }) => ({ word, partOfSpeech, chinese, note }));
    comparePackSection('derivatives', expectedDerivatives, actualDerivatives);

    const expectedRelated = (semanticPack.related ?? []).map(([category, items]) => ({
      category,
      items: items.map(([word, partOfSpeech, chinese]) => ({ word, partOfSpeech, chinese }))
    }));
    const actualRelated = card.relatedVocabulary.map(({ category, items }) => ({
      category,
      items: items.map(({ word, partOfSpeech, chinese }) => ({ word, partOfSpeech, chinese }))
    }));
    comparePackSection('relatedVocabulary', expectedRelated, actualRelated);

    const expectedErrors = (semanticPack.commonErrors ?? []).map(([wrong, right, note]) => ({ wrong, right, note }));
    const actualErrors = card.coreMemory.commonErrors.map(({ wrong, right, note }) => ({ wrong, right, note }));
    comparePackSection('coreMemory.commonErrors', expectedErrors, actualErrors);
  }
  if (card.detailLevel === 'template-reference' && (card.word !== 'work' || !matchesShape(card, referenceShape))) errors.push(card.id + ': reference label is reserved for the exact locked work example.');
  if (card.detailLevel === 'template-curated' && !meetsCuratedBenchmark(card)) errors.push(card.id + ': human-curated label does not meet the curated richness benchmark.');
  if (forbiddenGeneratedCopy.some((pattern) => pattern.test(JSON.stringify(card)))) errors.push(card.id + ': forbidden meta-learning filler or mechanical expansion found.');
  const visibleContent = [
    card.coreMemory.example,
    card.coreMemory.exampleChinese,
    ...card.meanings.flatMap((item) => [item.english, item.chinese, item.example, item.translation]),
    ...card.contextPhrases.flatMap((group) => group.items.flatMap((item) => [item.phrase, item.chinese])),
    ...card.fixedPhrases.flatMap((item) => [item.phrase, item.chinese, item.example, item.translation]),
    ...card.synonyms.flatMap((item) => [item.word, item.chinese, item.difference]),
    ...card.antonyms.flatMap((item) => [item.word, item.chinese, item.usage]),
    ...card.derivatives.flatMap((item) => [item.word, item.chinese, item.note]),
    ...card.confusables.flatMap((item) => [item.word, item.chinese, item.difference]),
    ...card.relatedVocabulary.flatMap((group) => group.items.flatMap((item) => [item.word, item.chinese])),
    ...card.examples.flatMap((item) => [item.english, item.chinese]),
    ...Object.values(card.studyFocus),
    ...card.questions.flatMap((question) => [question.prompt, ...(question.options ?? []), question.answer])
  ].filter(Boolean).join('\n');
  // Block actual product/deployment diagnostics, not ordinary English senses of
  // words such as “server”, “support”, “report”, “handle”, “try”, or “wait”.
  // The latter are valid vocabulary and commonly occur in natural examples.
  if (/\b(?:the app|mobile app|web app|in-app browser|browser cache|production deployment|deployment (?:failed|status|preview)|cloud sync|sync (?:failed|failure|status)|cached version|saved (?:answer|progress))\b/i.test(visibleContent)) {
    errors.push(card.id + ': product, deployment, or synchronization diagnostics leaked into learner-facing card content.');
  }
  if (/\b(?:search box|old cards?|saved position|progress (?:is|was) saved|record returned|new interface)\b/i.test(visibleContent)) {
    errors.push(card.id + ': product-interface state leaked into learner-facing card content.');
  }
  if (/\b(?:JSON|confidence:)\b|The assistant's final|I(?:'|’)ll output|system text|程序运行|自动生成|人工精校/i.test(visibleContent)) {
    errors.push(card.id + ': model reasoning, serialization text, or internal production labels leaked into learner-facing content.');
  }
  if (/(?:本卡|目标词|答题时|词卡结构|核心搭配“|这个例句与上面|要学的短语是|练习短语是)/.test(visibleContent)) {
    errors.push(card.id + ': authoring or assessment language leaked into learner-facing explanations.');
  }
  const questionMetaHits = [];
  card.questions.forEach((question, questionIndex) => {
    const fields = [
      [`questions[${questionIndex}].prompt`, question.prompt],
      ...((question.options ?? []).map((option, optionIndex) => [`questions[${questionIndex}].options[${optionIndex}]`, option])),
      [`questions[${questionIndex}].answer`, question.answer]
    ];
    for (const [field, value] of fields) {
      if (learnerFacingMetaPattern.test(String(value ?? ''))) questionMetaHits.push({ field, value });
    }
  });
  if (questionMetaHits.length) {
    strictQualityError(
      card,
      'QUESTION_META_COPY',
      questionMetaHits.map((hit) => hit.field).join(', '),
      `learner-facing questions contain ${questionMetaHits.length} authoring term(s) such as “目标词” or “词卡中”; write the task directly`,
      questionMetaHits.slice(0, 4).map((hit) => hit.value),
      questionMetaHits.length
    );
  }
  if (/\b0 个常用义项\b/.test(visibleContent)) errors.push(card.id + ': single-sense focus text must not claim there are zero additional meanings.');
  if (card.tags.some((tag) => /(人工精校|模板结构版|待深度补全)/.test(tag))) errors.push(card.id + ': internal production labels must not appear in app tags.');
  const expectedPriority = cocaAudit.orderedCards?.[cardIndex];
  if (!expectedPriority
    || card.learningPriority.sequence !== cardIndex + 1
    || card.learningPriority.group !== expectedPriority.primaryGroup
    || card.learningPriority.primaryCocaRank !== expectedPriority.primaryCocaRank
    || card.learningPriority.groupOrder !== learningGroups.indexOf(card.learningPriority.group) + 1) {
    errors.push(card.id + ': learning priority metadata differs from the COCA audit.');
  }
  if (card.meanings.length < 1) errors.push(card.id + ': a detailed card needs at least one fully evidenced meaning.');
  if (card.partOfSpeech.includes('/') && card.meanings.length < 2) errors.push(card.id + ': multiple parts of speech need separate meanings.');
  if (!Array.isArray(card.cocaRanks) || card.cocaRanks.length < 1 || !card.cocaRankLabel) errors.push(card.id + ': missing exact COCA rank data.');
  if (!Array.isArray(card.coreMemory.structures) || card.coreMemory.structures.length < templateLock.qualityContract.coreStructures) errors.push(card.id + ': expected at least three core structures.');
  if (!Array.isArray(card.coreMemory.commonErrors) || card.coreMemory.commonErrors.length < templateLock.qualityContract.commonErrorPairs) errors.push(card.id + ': expected at least two concrete error corrections.');
  if (card.synonyms.some((item) => !item.difference || item.difference.length < 20 || genericSynonymDifferencePattern.test(item.difference))) errors.push(card.id + ': every synonym needs a concrete, non-template usage distinction.');
  if (card.antonyms.some((item) => !item.usage || item.usage.length < 16 || genericSynonymDifferencePattern.test(item.usage))) errors.push(card.id + ': every antonym needs a concrete sense-specific contrast explanation.');
  if (card.confusables.some((item) => !item.difference || item.difference.length < 16 || genericConfusableDifferencePattern.test(item.difference))) errors.push(card.id + ': every confusable needs a concrete, non-template distinction.');
  if (card.coreMemory.commonErrors.some((entry) => new RegExp(`^(?:can to ${card.word}|to ${card.word}(?:s|es))$`, 'i').test(entry.wrong.trim()))) errors.push(card.id + ': generic conjugation padding is not a word-specific common error.');
  if (card.detailLevel === 'template-curated' || card.detailLevel === 'template-reference') {
    if (card.contextPhrases.length < templateLock.qualityContract.curatedContextCategories) errors.push(card.id + ': reviewed card needs at least ' + templateLock.qualityContract.curatedContextCategories + ' real context categories.');
    if (card.contextPhrases.reduce((sum, group) => sum + group.items.length, 0) < curatedCardMinimums.contextItems) errors.push(card.id + ': reviewed card needs at least ' + curatedCardMinimums.contextItems + ' curated context phrases.');
    if (card.fixedPhrases.length < curatedCardMinimums.fixedPhrases) errors.push(card.id + ': reviewed card needs at least ' + curatedCardMinimums.fixedPhrases + ' fixed phrases with real examples.');
    if (card.synonyms.length < curatedCardMinimums.synonyms) errors.push(card.id + ': reviewed card needs at least ' + curatedCardMinimums.synonyms + ' useful semantic comparisons.');
    if (card.relatedVocabulary.length < templateLock.qualityContract.curatedRelatedCategories) errors.push(card.id + ': reviewed card needs at least ' + templateLock.qualityContract.curatedRelatedCategories + ' semantic categories.');
    if (card.relatedVocabulary.reduce((sum, group) => sum + group.items.length, 0) < curatedCardMinimums.relatedItems) errors.push(card.id + ': reviewed card needs at least ' + curatedCardMinimums.relatedItems + ' genuinely related words.');
    if (card.examples.length < curatedCardMinimums.highFrequencyExamples) errors.push(card.id + ': reviewed card needs at least ' + curatedCardMinimums.highFrequencyExamples + ' natural high-frequency examples.');
    if (card.fixedPhrases.some((entry) => !phraseContainsTarget(entry.example, card.word))) errors.push(card.id + ': every curated fixed-phrase example must actually use the target word or an inflected form.');
    if (card.examples.some((entry) => !phraseContainsTarget(entry.english, card.word))) errors.push(card.id + ': every curated high-frequency example must actually use the target word or an inflected form.');
  } else {
    if (card.contextPhrases.length < publishedCardMinimums.contextCategories) errors.push(card.id + ': template-detailed card needs four real context categories.');
    if (card.contextPhrases.reduce((sum, group) => sum + group.items.length, 0) < publishedCardMinimums.contextItems) errors.push(card.id + ': template-detailed card needs at least sixteen evidence-backed context phrases.');
    if (card.fixedPhrases.length < publishedCardMinimums.fixedPhrases) errors.push(card.id + ': template-detailed card needs at least twelve fixed phrases with real examples.');
    if (card.examples.length < publishedCardMinimums.highFrequencyExamples) errors.push(card.id + ': template-detailed card needs at least twelve natural bilingual examples.');
    if (card.fixedPhrases.some((entry) => !phraseContainsTarget(entry.example, card.word))) errors.push(card.id + ': every fixed-phrase example must use the target word or an inflected form.');
    if (card.examples.some((entry) => !phraseContainsTarget(entry.english, card.word))) errors.push(card.id + ': every high-frequency example must use the target word or an inflected form.');
  }
  if (card.meanings.some((meaning) => !meaning.english || !meaning.chinese || !meaning.example || !meaning.translation)) errors.push(card.id + ': every meaning needs bilingual definition and example evidence.');
  if (card.meanings.some((meaning) => !phraseContainsTarget(meaning.example, card.word))) errors.push(card.id + ': every meaning example must use the target word or an inflected form.');
  const normalizedEnglishMeanings = card.meanings.map((meaning) => meaning.english.toLowerCase().replace(/[^a-z]+/g, ' ').trim());
  const normalizedChineseMeanings = card.meanings.map((meaning) => `${meaning.partOfSpeech}:${meaning.chinese.replace(/[\s，,]/g, '').trim()}`);
  if (new Set(normalizedEnglishMeanings).size !== card.meanings.length) errors.push(card.id + ': duplicate English meaning rows create false detail.');
  if (new Set(normalizedChineseMeanings).size !== card.meanings.length) errors.push(card.id + ': different English definitions must not reuse the same Chinese meaning.');
  const expectedCoreChinese = summarizeChineseMeanings(card.meanings);
  if (card.coreMemory.chinese !== expectedCoreChinese) errors.push(card.id + ': core Chinese summary must be derived from the visible bilingual meaning rows.');
  const expectedHeadwordIpa = {
    use: '/juːz/（动词）；/juːs/（名词）',
    live: '/lɪv/（动词）；/laɪv/（形容词/副词）',
    increase: '/ɪnˈkriːs/（动词）；/ˈɪnkriːs/（名词）',
    lead: '/liːd/'
  }[card.word];
  if (expectedHeadwordIpa && card.phonetic !== expectedHeadwordIpa) errors.push(card.id + ': homographic headword has the wrong POS-specific pronunciation.');
  if (new Set(card.meanings.map((meaning) => meaning.example.trim().toLowerCase())).size !== card.meanings.length) errors.push(card.id + ': meaning rows must use distinct example evidence.');
  if (!card.reviewed && manualMeaningPacks[card.word] && card.meanings.length !== manualMeaningPacks[card.word].length) {
    errors.push(card.id + ': human-reviewed common-sense meaning pack was not preserved exactly.');
  }
  if (card.fixedPhrases.some((entry) => !entry.chinese || !entry.example || !entry.translation)) errors.push(card.id + ': every fixed phrase needs a Chinese meaning and a bilingual example.');
  const incompletePhraseEnding = /\b(?:a|an|the|any|some|my|your|his|her|our|their|is|are|was|were|has|had|one more|about|until|wherever|what|who|why|how|when|looking|new|same)$/i;
  const acceptedCompleteIdioms = new Set(['if you will', 'stay the same']);
  const phraseLooksTruncated = (phrase) => {
    const text = phrase.trim();
    if (acceptedCompleteIdioms.has(text.toLocaleLowerCase('en-US'))
      || /^(?:would you mind if|seem as if|remember where (?:someone|something) is)$/i.test(text)) return false;
    const openParentheses = (text.match(/\(/g) ?? []).length;
    const closeParentheses = (text.match(/\)/g) ?? []).length;
    return !text
      || incompletePhraseEnding.test(text)
      || /(?:\.{2,}|…)/.test(text)
      || /\b(?:be\s+(?:widely\s+)?(?:able|allowed|asked|expected|likely|supposed|understood)|(?:appear|seem)\s+likely|cannot\s+wait|must\s+be\s+able|win\s+the\s+right|would\s+love|might\s+be\s+expected)\s+to$/i.test(text)
      || /\b(?:at|in|on|by|from|with|for|to|of)\s+(?:a|an|the|any|some|my|your|his|her|our|their)$/i.test(text)
      || /\b(?:and|or|but|because|although|while)$/i.test(text)
      || /(?:\.{2,}|…|[,:;+\/-])$/.test(text)
      || openParentheses !== closeParentheses;
  };
  if (card.fixedPhrases.some((entry) => entry.phrase.trim().split(/\s+/).length > 8)) errors.push(card.id + ': fixed phrase is an overlong sentence fragment rather than a reusable chunk.');
  card.fixedPhrases.forEach((entry, index) => {
    if (phraseLooksTruncated(entry.phrase)) {
      strictQualityError(card, 'PHRASE_TRUNCATED', `fixedPhrases[${index}].phrase`, 'fixed phrase is cut off, unbalanced, or ends before its required complement', entry.phrase);
    }
    if (phraseChineseLooksLikeSentence(entry.chinese)) {
      strictQualityError(card, 'PHRASE_CHINESE_SENTENCE', `fixedPhrases[${index}].chinese`, 'Chinese must be a concise phrase gloss, not a copied sentence or conversational utterance', entry.chinese);
    }
  });
  const genericFixedExamples = card.fixedPhrases
    .map((entry, index) => ({ index, entry, issue: fixedExampleIssue(entry.example, entry.phrase) }))
    .filter(({ issue }) => issue);
  if (genericFixedExamples.length) {
    strictQualityError(
      card,
      'FIXED_EXAMPLE_TEMPLATE',
      'fixedPhrases',
      'a fixed-phrase example merely wraps its phrase in a reusable carrier; every example must provide a concrete natural context',
      genericFixedExamples.slice(0, 4).map(({ index, entry, issue }) => ({ index, example: entry.example, issue })),
      genericFixedExamples.length
    );
  }
  if (new Set(card.examples.map((example) => example.english)).size !== card.examples.length) errors.push(card.id + ': duplicate example sentences.');
  if (card.derivatives.some((item) => item.word.toLowerCase() === card.word.toLowerCase())) errors.push(card.id + ': target word repeated as a derivative.');
  if (card.derivatives.some((item) => isLowValueDerivative(card.word, item.word))) errors.push(card.id + ': semantically misleading or low-value derivative found.');
  if (card.derivatives.some((item) => !/(?:^|[\s/])(v\.|n\.|adj\.|adv\.)(?:$|[\s/])/i.test(item.partOfSpeech))) errors.push(card.id + ': derivative must use a learnable verb, noun, adjective, or adverb part of speech.');
  const derivativePosRank = (value) => Math.min(...['v.', 'n.', 'adj.', 'adv.'].map((part, index) => value.toLowerCase().split(/\s*\/\s*/).includes(part) ? index : 99));
  if (card.derivatives.some((item, index) => index > 0 && derivativePosRank(card.derivatives[index - 1].partOfSpeech) > derivativePosRank(item.partOfSpeech))) {
    errors.push(card.id + ': derivatives must be ordered as verb, noun, adjective, then adverb.');
  }
  if (!card.reviewed && Object.hasOwn(manualDerivativePacks, card.word)) {
    const expectedDerivatives = manualDerivativePacks[card.word].map(([word, partOfSpeech, chinese]) => `${word}|${partOfSpeech}|${chinese}`);
    const actualDerivatives = card.derivatives.map((item) => `${item.word}|${item.partOfSpeech}|${item.chinese}`);
    if (expectedDerivatives.length !== actualDerivatives.length || expectedDerivatives.some((item, index) => item !== actualDerivatives[index])) {
      errors.push(card.id + ': locked high-value derivative pack changed or received automatic padding.');
    }
  }
  if (card.confusables.some((item) => item.word.toLowerCase() === card.word.toLowerCase())) errors.push(card.id + ': target word repeated as a confusable.');
  if ([...card.synonyms, ...card.antonyms, ...card.derivatives, ...card.confusables].some((item) => !item.partOfSpeech || /^(word|word family)$/i.test(item.partOfSpeech))) errors.push(card.id + ': relation word has an unknown or invented part of speech.');
  if ([...card.synonyms, ...card.antonyms, ...card.derivatives].some((item) => !item.chinese || /与“.+”意义(接近|相反)/.test(item.chinese))) errors.push(card.id + ': relation or derivative needs an actual Chinese meaning, not a relationship placeholder.');
  const relationWordLocations = new Map();
  for (const section of ['derivatives', 'synonyms', 'antonyms', 'confusables']) {
    card[section].forEach((item, index) => {
      const wordKey = normalizeLexicalText(item.word);
      const previous = relationWordLocations.get(wordKey);
      if (previous) {
        strictQualityError(
          card,
          'CROSS_SECTION_WORD_DUPLICATE',
          `${section}[${index}].word`,
          `“${item.word}” already appears at ${previous}; one lexical item may appear in only one relation section`,
          item.word
        );
      } else {
        relationWordLocations.set(wordKey, `${section}[${index}].word`);
      }
    });
  }
  card.synonyms.forEach((item, index) => {
    const relationPath = `synonyms[${index}]`;
    if (synonymPlaceholderPattern.test(item.chinese ?? '')) {
      strictQualityError(card, 'SYNONYM_PLACEHOLDER', `${relationPath}.chinese`, 'synonym needs a real sense-specific Chinese gloss, not a relationship placeholder', item.chinese);
    }
    if (genericSynonymDifferencePattern.test(item.difference ?? '')) {
      strictQualityError(card, 'SYNONYM_GENERIC_DIFFERENCE', `${relationPath}.difference`, 'replace the reusable fallback with a concrete difference in meaning, object, construction, register, or scope', item.difference);
    }
    const specificityIssue = relationNoteSpecificityIssue({
      baseWord: card.word,
      relationWord: item.word,
      note: item.difference,
      kind: 'synonym'
    });
    if (specificityIssue) {
      strictQualityError(card, 'RELATION_NOTE_SPECIFICITY', `${relationPath}.difference`, `synonym note needs a concrete two-sided semantic, grammatical, construction, register, or scope contrast (${specificityIssue})`, item.difference);
    }
    if (card.learningPriority.group === 'verb') {
      const pair = `${card.word.toLocaleLowerCase('en-US')}:${item.word.toLocaleLowerCase('en-US')}`;
      const isSingleWord = /^[A-Za-z]+(?:'[A-Za-z]+)?$/.test(item.word.trim());
      const hasVerbCompatiblePos = /(?:^|[\s/])(?:v\.|aux\.|phr\.)(?:$|[\s/])/i.test(item.partOfSpeech ?? '');
      if (isSingleWord && !allowedNonVerbSynonymPairs.has(pair) && !hasVerbCompatiblePos) {
        strictQualityError(card, 'VERB_SYNONYM_POS', `${relationPath}.partOfSpeech`, 'a synonym for the card\'s verb sense must use a verb/auxiliary sense; only documented sense-safe noun or adverb exceptions are allowed', `${item.word}: ${item.partOfSpeech}`);
      }
      if (isSingleWord && !allowedNonVerbSynonymPairs.has(pair) && !reviewedVerbSenseExceptionPairs.has(pair)) {
        const dictionaryGlosses = ecdictTranslationGroups(item.word);
        const relationGlosses = splitChineseGloss(item.chinese);
        if (dictionaryGlosses.verb.length
          && chineseGlossesOverlap(relationGlosses, dictionaryGlosses.nonVerb)
          && !chineseGlossesOverlap(relationGlosses, dictionaryGlosses.verb)) {
          strictQualityError(
            card,
            'VERB_SYNONYM_SENSE',
            `${relationPath}.chinese`,
            `Chinese gloss matches a non-verb dictionary sense of “${item.word}” but none of its verb senses`,
            { gloss: item.chinese, availableVerbGlosses: dictionaryGlosses.verb.slice(0, 6) }
          );
        }
      }
    }
  });
  card.antonyms.forEach((item, index) => {
    const specificityIssue = relationNoteSpecificityIssue({
      baseWord: card.word,
      relationWord: item.word,
      note: item.usage,
      kind: 'antonym'
    });
    if (specificityIssue) {
      strictQualityError(card, 'RELATION_NOTE_SPECIFICITY', `antonyms[${index}].usage`, `antonym note needs a concrete two-sided sense boundary (${specificityIssue})`, item.usage);
    }
  });
  card.confusables.forEach((item, index) => {
    const relationPath = `confusables[${index}]`;
    if (confusablePlaceholderPattern.test(item.chinese ?? '')) {
      strictQualityError(card, 'CONFUSABLE_PLACEHOLDER', `${relationPath}.chinese`, 'confusable needs its actual part-of-speech meaning, not “easily confused with ...”', item.chinese);
    }
    if (genericConfusableDifferencePattern.test(item.difference ?? '')) {
      strictQualityError(card, 'CONFUSABLE_GENERIC_DIFFERENCE', `${relationPath}.difference`, 'state the exact spelling, pronunciation, grammar, or meaning contrast instead of the reusable fallback', item.difference);
    }
    const specificityIssue = relationNoteSpecificityIssue({
      baseWord: card.word,
      relationWord: item.word,
      note: item.difference,
      kind: 'confusable'
    });
    if (specificityIssue) {
      strictQualityError(card, 'RELATION_NOTE_SPECIFICITY', `${relationPath}.difference`, `confusable note needs an exact spelling, pronunciation, grammar, or meaning contrast (${specificityIssue})`, item.difference);
    }
  });
  if (card.coreMemory.commonErrors.some((item) => !item.wrong || !item.right || item.wrong === item.right)) errors.push(card.id + ': invalid error correction pair.');
  if (card.coreMemory.commonErrors.some((item) => /这个结构要用\s+\w+\s*\+\s*to/.test(item.note))) {
    errors.push(card.id + ': grammar note incorrectly attributes an embedded infinitive to the target word.');
  }
  if (card.coreMemory.commonErrors.some((item) => /^(can|could|may|might|must|should|will|would)\s+to\s+\1$/i.test(item.wrong))) {
    errors.push(card.id + ': mechanically generated modal error is not a meaningful correction pair.');
  }
  if (card.coreMemory.commonErrors.some((item) => item.wrong.toLowerCase() === 'sell someone an idea')) errors.push(card.id + ': a valid double-object sell construction must not be labelled wrong.');
  const contextEntries = card.contextPhrases.flatMap((group) => group.items);
  if (new Set(contextEntries.map((entry) => entry.phrase.toLowerCase().replace(/[^a-z']+/g, ' ').trim())).size !== contextEntries.length) {
    errors.push(card.id + ': duplicate context phrases create false detail.');
  }
  if (contextEntries.some((entry) => !entry.chinese.trim() || /[。！？!?；;]$/.test(entry.chinese.trim()))) {
    errors.push(card.id + ': context Chinese must be a concise phrase gloss, not a copied sentence translation.');
  }
  if (contextEntries.some((entry) => [...entry.chinese.replace(/\s/g, '')].length > templateLock.qualityContract.contextChineseMaxCharacters)) {
    errors.push(card.id + ': context Chinese exceeds the locked phrase-gloss length limit.');
  }
  if (contextEntries.some((entry) => reusablePhraseIssue(entry.phrase))) {
    errors.push(card.id + ': context phrase is a sentence fragment, copied sentence opening, or incomplete reusable chunk.');
  }
  if (card.word !== 'work' && contextEntries.some((entry) => mechanicalContextIssue(entry.phrase, card.word))) {
    strictQualityError(card, 'CONTEXT_MECHANICAL_PADDING', 'contextPhrases', 'context rows must be independently curated, not a fixed phrase with an automatic modal, frequency adverb, or negation prefix', contextEntries.filter((entry) => mechanicalContextIssue(entry.phrase, card.word)).slice(0, 4).map((entry) => entry.phrase));
  }
  if (card.word !== 'work' && contextEntries.some((entry) => normalizeLexicalText(entry.phrase).split(' ').length < 2)) {
    strictQualityError(card, 'CONTEXT_BARE_WORD', 'contextPhrases', 'a context row must be a reusable multiword expression, not a bare inflected target', contextEntries.filter((entry) => normalizeLexicalText(entry.phrase).split(' ').length < 2).slice(0, 4).map((entry) => entry.phrase));
  }
  card.contextPhrases.forEach((group, groupIndex) => {
    group.items.forEach((entry, itemIndex) => {
      if (phraseLooksTruncated(entry.phrase)) {
        strictQualityError(card, 'PHRASE_TRUNCATED', `contextPhrases[${groupIndex}].items[${itemIndex}].phrase`, 'context chunk is cut off, unbalanced, or ends before its required complement', entry.phrase);
      }
      if (phraseChineseLooksLikeSentence(entry.chinese)) {
        strictQualityError(card, 'PHRASE_CHINESE_SENTENCE', `contextPhrases[${groupIndex}].items[${itemIndex}].chinese`, 'Chinese must be a concise phrase gloss, not a copied sentence or conversational utterance', entry.chinese);
      }
    });
  });
  const normalizedContextPhrases = new Set(contextEntries.map((entry) => normalizeLexicalText(entry.phrase)));
  const normalizedFixedPhrases = [...new Set(card.fixedPhrases.map((entry) => normalizeLexicalText(entry.phrase)))];
  const overlappingPhrases = normalizedFixedPhrases.filter((phrase) => normalizedContextPhrases.has(phrase));
  const overlapDenominator = Math.min(normalizedContextPhrases.size, normalizedFixedPhrases.length);
  const overlapRatio = overlapDenominator ? overlappingPhrases.length / overlapDenominator : 0;
  if (overlapDenominator && overlapRatio >= 0.5) {
    strictQualityError(
      card,
      'SECTION_PHRASE_OVERLAP',
      'fixedPhrases/contextPhrases',
      `fixed phrases and context chunks overlap in ${overlappingPhrases.length}/${overlapDenominator} normalized entries (${Math.round(overlapRatio * 100)}%); the sections need materially different learning content`,
      overlappingPhrases.slice(0, 10)
    );
  }
  if (card.synonyms.some((entry) => /使用范围更具体，替换时要核对宾语、介词和语境|在本卡的一个常用义项下意思接近/.test(entry.difference))) {
    errors.push(card.id + ': generic synonym filler survived the semantic audit.');
  }
  if (card.antonyms.some((entry) => /其他义项下不能一概视为反义|在本卡的一个明确义项下形成对比/.test(entry.usage))) {
    errors.push(card.id + ': generic antonym filler survived the semantic audit.');
  }
  if (card.relatedVocabulary.some((group) => /例句中常与本词同现|真实语境/.test(group.category))) {
    errors.push(card.id + ': arbitrary words copied from examples are not semantic related vocabulary.');
  }
  const relatedWordLocations = new Map();
  card.relatedVocabulary.forEach((group, groupIndex) => {
    if (genericRelatedCategoryNames.has(group.category.trim()) || /(?:上位概念|具体表达|语义关联|相关动作与概念|相关事物与概念|相关特征与方式)$/.test(group.category.trim())) {
      strictQualityError(card, 'RELATED_GENERIC_CATEGORY', `relatedVocabulary[${groupIndex}].category`, 'category title must name a concrete semantic domain, function, scenario, or degree', group.category);
    }
    group.items.forEach((item, itemIndex) => {
      const normalizedWord = normalizeLexicalText(item.word);
      const currentPath = `relatedVocabulary[${groupIndex}].items[${itemIndex}].word`;
      const previous = relatedWordLocations.get(normalizedWord);
      if (previous && previous.groupIndex !== groupIndex) {
        strictQualityError(card, 'RELATED_CROSS_CATEGORY_DUPLICATE', currentPath, `“${item.word}” already appears in category ${previous.groupIndex + 1} at ${previous.path}; one item may belong to only one related-vocabulary category`, item.word);
      } else if (!previous) {
        relatedWordLocations.set(normalizedWord, { groupIndex, path: currentPath });
      }
    });
  });
  // Related-vocabulary candidates are now selected by the semantic builder and
  // must remain disjoint from all relation sections. Legacy source-pack anchors
  // are intentionally not required verbatim because they can collide with a
  // more useful derivative, synonym, antonym, or confusable entry.
  if (!card.reviewed && directRelationPacks[card.word]) {
    for (const key of ['synonyms', 'antonyms']) {
      const expectedRelations = directRelationPacks[card.word][key].map(([word, partOfSpeech, chinese]) => `${word}|${partOfSpeech}|${chinese}`);
      const actualRelations = card[key].map((item) => `${item.word}|${item.partOfSpeech}|${item.chinese}`);
      if (expectedRelations.some((item) => !actualRelations.includes(item))) {
        errors.push(card.id + ': a reviewed current-sense ' + key + ' anchor was removed or changed.');
      }
    }
  }
  if (card.derivatives.some((item) => /(较少见|不常用|生僻)/.test(item.note ?? ''))) errors.push(card.id + ': rare derivatives must not be included just to fill the section.');
  if (card.questions.length < 15) errors.push(card.id + ': expected at least fifteen questions sourced from the complete card.');
  if (new Set(card.questions.map((question) => question.id)).size !== card.questions.length) errors.push(card.id + ': duplicate question IDs.');
  if (new Set(card.questions.map((question) => question.prompt)).size !== card.questions.length) errors.push(card.id + ': duplicate question prompts.');
  const questionTypes = new Set(card.questions.map((question) => question.type));
  for (const type of ['meaning_choice', 'recall', 'collocation', 'free_sentence', 'dialogue']) {
    if (!questionTypes.has(type)) errors.push(card.id + ': missing question type ' + type + '.');
  }
  if (card.questions.filter((question) => question.type === 'meaning_choice').length < 5) errors.push(card.id + ': expected rich meaning and relation choices.');
  if (card.questions.filter((question) => question.type === 'collocation').length < 5) errors.push(card.id + ': expected collocation questions from several card sections.');
  if (card.questions.some((question) => question.options && (!question.options.includes(question.answer) || new Set(question.options).size !== question.options.length))) errors.push(card.id + ': invalid choice options.');
  const coreMeaningQuestion = card.questions.find((question) => question.id.endsWith('-meaning-core'));
  if (!coreMeaningQuestion || coreMeaningQuestion.answer !== card.meanings[0].chinese) {
    errors.push(card.id + ': core-meaning question must test the first highlighted meaning, not an aggregated gloss.');
  }
  const clozeQuestions = card.questions.filter((question) => question.type === 'collocation' && !question.options);
  if (clozeQuestions.some((question) => !question.prompt.includes('_____') || !question.answer?.trim())) {
    errors.push(card.id + ': every non-choice collocation question needs one real blank and a non-empty answer.');
  }
  if (clozeQuestions.some((question) => !question.id.includes('collocation-example-context-v2') && question.answer.trim().toLowerCase() !== card.word.toLowerCase() && /^(do|doing|done|someone|something|yourself|A|B)$/i.test(question.answer.trim()))) {
    errors.push(card.id + ': a grammar placeholder must never be the answer to an objective cloze.');
  }
  if (card.questions.some((question) => question.id.includes('example-cloze') && !question.prompt.includes('（填写 ' + card.word + ' 的正确形式）'))) {
    errors.push(card.id + ': the example cloze must ask for the target word in its contextually correct form.');
  }
  if (card.questions.some((question) => question.prompt.includes('（填入目标词）'))) {
    errors.push(card.id + ': obsolete target-word fallback prompt found.');
  }
  if (card.questions.some((question) => /^(补全核心结构中的连接成分：|根据语境补全搭配：)/.test(question.prompt))) {
    errors.push(card.id + ': legacy phrase-fragment cloze found; a context label is not a real context.');
  }
  if (card.questions.some((question) => question.prompt.includes('优先记住') || question.prompt.includes('词卡结构辨义'))) {
    errors.push(card.id + ': vague or implementation-oriented structure wording found.');
  }
  if (card.coreMemory.commonErrors.some((entry) => /\b(?:discoverring|happenning|openning|offerring|listenning|visitting)\b/i.test(entry.wrong))) {
    errors.push(card.id + ': generated error contains a fake English -ing spelling.');
  }
  if (card.coreMemory.commonErrors.some((entry) => /^\w+ something$/i.test(entry.wrong) && /that \+ clause/i.test(entry.right))) {
    errors.push(card.id + ': a valid transitive pattern is mislabeled as the error for a that-clause.');
  }
  const typedObjectiveQuestions = card.questions.filter((question) => !question.ai && !question.options);
  if (typedObjectiveQuestions.some((question) => !/^[A-Za-z]+(?:'[A-Za-z]+)?$/.test(question.answer.trim()))) {
    errors.push(card.id + ': every typed objective answer must be one English word for the in-app spelling keyboard.');
  }
  const contextualQuestions = card.questions.filter((question) => question.id.includes('collocation-example-context-v3'));
  if (contextualQuestions.length !== 1) {
    errors.push(card.id + ': expected exactly one full-sentence contextual companion question.');
  } else {
    const [question] = contextualQuestions;
    if (!question.prompt.startsWith('根据完整句意和中文提示') || !question.prompt.includes('（中文：') || !/[.!?](?:（中文：)/.test(question.prompt)) {
      errors.push(card.id + ': contextual companion question needs a complete English sentence and Chinese semantic cue.');
    }
    const contextualAnswer = String(question.answer ?? '').trim();
    const blankCount = (question.prompt.match(/_{2,}/g) ?? []).length;
    if (!contextualAnswer || blankCount !== 1 || /^(?:someone|something|doing|done|A|B)$/i.test(contextualAnswer)) {
      errors.push(card.id + ': contextual companion question must contain one unambiguous blank and one concrete declared answer.');
    }
    if (Array.isArray(question.options) && (!question.options.includes(question.answer) || question.options.length < 3)) {
      errors.push(card.id + ': a choice-based contextual companion must contain its declared answer and at least three options.');
    }
  }
  const semanticStructureQuestions = card.questions.filter((question) => question.id.includes('collocation-structure-meaning-v3'));
  if (semanticStructureQuestions.length !== 1 || semanticStructureQuestions.some((question) => !question.options?.includes(question.answer))) {
    errors.push(card.id + ': structure knowledge must be tested through an explicit meaning and complete selectable structures.');
  }
  const structureQuestions = card.questions.filter((question) => question.id.includes('structure-choice-v3') || question.id.includes('collocation-structure-meaning-v3') || question.id.includes('collocation-fixed-'));
  if (structureQuestions.some((question) => !question.prompt.includes('形式线索：'))) {
    errors.push(card.id + ': every structure choice needs a distinguishing form clue.');
  }
  if (structureQuestions.some((question) => /目标词后接\s+to\s*\+/.test(question.prompt))) {
    errors.push(card.id + ': structure question wrongly claims every embedded infinitive follows the target word directly.');
  }
  if (structureQuestions.some((question) => /目标词后直接接事物宾语/.test(question.prompt))) {
    errors.push(card.id + ': obsolete blanket direct-object clue found.');
  }
  const slotPrompts = card.questions.filter((question) => question.ai && /\b(to do|doing|done|someone|something|yourself|A|B)\b/.test(question.prompt));
  if (slotPrompts.some((question) => !/(代表|替换|不要求)/.test(question.prompt))) {
    errors.push(card.id + ': an open question exposes grammar placeholders without explaining how to instantiate them.');
  }
  const collocationChoices = card.questions.filter((question) => question.type === 'collocation' && question.options);
  if (collocationChoices.length < 2) errors.push(card.id + ': expected at least two fixed-phrase meaning checks.');
  if (new Set(card.questions.filter((question) => question.type === 'collocation').map((question) => question.answer.toLocaleLowerCase('en-US'))).size < 4) {
    errors.push(card.id + ': collocation questions repeat too few distinct answers.');
  }

  const phoneticFields = [
    { field: 'phonetic', value: card.phonetic, spoken: card.word },
    ...card.coreMemory.structures.map((item, index) => ({ field: `coreMemory.structures[${index}].phonetic`, value: item.phonetic, spoken: item.phrase })),
    ...card.coreMemory.commonErrors.flatMap((item, index) => [
      { field: `coreMemory.commonErrors[${index}].wrongPhonetic`, value: item.wrongPhonetic, spoken: item.wrong },
      { field: `coreMemory.commonErrors[${index}].rightPhonetic`, value: item.rightPhonetic, spoken: item.right }
    ]),
    ...card.contextPhrases.flatMap((group, groupIndex) => group.items.map((item, itemIndex) => ({
      field: `contextPhrases[${groupIndex}].items[${itemIndex}].phonetic`,
      value: item.phonetic,
      spoken: item.phrase
    }))),
    ...card.fixedPhrases.map((item, index) => ({ field: `fixedPhrases[${index}].phonetic`, value: item.phonetic, spoken: item.phrase })),
    ...card.synonyms.map((item, index) => ({ field: `synonyms[${index}].phonetic`, value: item.phonetic, spoken: item.word })),
    ...card.antonyms.map((item, index) => ({ field: `antonyms[${index}].phonetic`, value: item.phonetic, spoken: item.word })),
    ...card.derivatives.map((item, index) => ({ field: `derivatives[${index}].phonetic`, value: item.phonetic, spoken: item.word })),
    ...card.confusables.map((item, index) => ({ field: `confusables[${index}].phonetic`, value: item.phonetic, spoken: item.word })),
    ...card.relatedVocabulary.flatMap((group, groupIndex) => group.items.map((item, itemIndex) => ({
      field: `relatedVocabulary[${groupIndex}].items[${itemIndex}].phonetic`,
      value: item.phonetic,
      spoken: item.word
    })))
  ];
  const phonetics = phoneticFields.map((entry) => entry.value);
  if (phonetics.some((value) => typeof value !== 'string' || !isAmericanIpa(value))) errors.push(card.id + ': every English word or phrase needs valid slash-delimited American IPA.');
  for (const entry of phoneticFields) {
    const value = String(entry.value ?? '');
    if (/\d/.test(String(entry.spoken ?? ''))) {
      strictQualityError(card, 'IPA_UNSPOKEN_NUMERAL', entry.field, 'spell numerals out in every learner-facing source that has IPA; numeric glyphs must not silently disappear from pronunciation', { spoken: entry.spoken, phonetic: entry.value });
    }
    if (ipaAsciiPlaceholderPattern.test(value)) {
      strictQualityError(card, 'IPA_ASCII_PLACEHOLDER', entry.field, 'IPA contains an untranslated English placeholder or ASCII source word; transcribe every spoken token and omit grammar-only A/B slots', entry.value);
    }
    if (hasMultiplePrimaryStressesForSingleWord(entry.spoken, value)) {
      strictQualityError(card, 'IPA_MULTIPLE_PRIMARY_STRESS', entry.field, 'a single written word may contain at most one primary-stress mark; use secondary stress for any earlier stress', { spoken: entry.spoken, phonetic: entry.value });
    }
  }
  if (JSON.stringify(card).includes('点击发音') || JSON.stringify(card).includes('点击扬声器')) errors.push(card.id + ': placeholder pronunciation found.');
}

const scheduledIds = [];
for (const item of manifest.dailyFiles) {
  const dailyPath = path.join(root, 'public', item.file);
  const daily = JSON.parse(await fs.readFile(dailyPath, 'utf8'));
  if (daily.cards.length !== 5) errors.push(item.file + ': expected 5 cards.');
  scheduledIds.push(...daily.cards.map((card) => card.id));
}

if (scheduledIds.length !== expectedCardCount || new Set(scheduledIds).size !== expectedCardCount) {
  errors.push('The static schedule must contain each audited card exactly once.');
}

if (errors.length) {
  if (strictQualityFailureCounts.size) {
    const strictFindingCount = [...strictQualityFailureCounts.values()].reduce((sum, count) => sum + count, 0);
    const strictSummary = [...strictQualityFailureCounts.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([rule, count]) => `${rule}=${count}`)
      .join(', ');
    console.error(`Strict publication gate failed with ${strictFindingCount} finding(s): ${strictSummary}`);
  }
  console.error(errors.join('\n'));
  process.exit(1);
}

const referenceCount = allCards.cards.filter((card) => card.detailLevel === 'template-reference').length;
const curatedCount = allCards.cards.filter((card) => card.detailLevel === 'template-curated').length;
const completeCount = allCards.cards.filter((card) => card.detailLevel === 'template-complete').length;
const shapeRows = allCards.cards.map((card) => ({ word: card.word, ...shapeFor(card) }));
const metrics = Object.keys(shapeFor(allCards.cards[0])).reduce((summary, key) => {
  const values = shapeRows.map((row) => row[key]);
  summary[key] = {
    minimum: Math.min(...values),
    maximum: Math.max(...values),
    average: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2))
  };
  return summary;
}, {});
await fs.writeFile(qualityReportPath, JSON.stringify({
  contentVersion: release.contentVersion,
  generatedAt: '2026-09-10',
  totalCards: allCards.cards.length,
  lexicalSources: ['user-provided COCA word list', 'Princeton WordNet via wordnet-db@3.1.14', 'ECDICT', 'Tatoeba Mandarin Chinese-English selected export via ManyThings (CC BY 2.0 France)'],
  checks: {
    bilingualMeanings: true,
    distinctBilingualMeanings: true,
    phraseExamples: true,
    reusableContextChunks: true,
    senseSpecificRelations: true,
    commonDerivativesOnly: true,
    reviewedRelatedPacks: true,
    noMechanicalFiller: true,
    noProductDiagnostics: true,
    noRuntimeDictionaryApi: true,
    corpusAttributionRetained: true,
    allCardsValidated: true
  },
  metrics,
  cards: shapeRows
}, null, 2) + '\n', 'utf8');
console.log('Content validation passed: all ' + allCards.cards.length + ' cards are complete static verb cards in COCA verb-rank order; ' + referenceCount + ' locked reference, ' + curatedCount + ' curated detailed, ' + completeCount + ' template-complete, ' + manifest.dailyFiles.length + ' days, 5 unique cards per full day.');
