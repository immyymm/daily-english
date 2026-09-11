import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  FORBIDDEN_QUESTION_META,
  SectionQualityError,
  auditCardCollection,
  buildSecondaryMeaningChoiceQuestion,
  buildFixedPhrases,
  buildIndependentContextGroups,
  buildSemanticRelatedVocabulary,
  deduplicateRelatedVocabulary,
  fixedExampleIssue,
  mechanicalContextIssue,
  partOfSpeechCompatible,
  reusablePhraseIssue,
  rewriteLearnerQuestionPrompts,
  selectRelationQuestionAnswer,
  selectSecondaryRelationQuestionAnswer,
  selectTeachingDistractors,
  slotGuidance,
  structureFormClue
} from './quality-sections.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const cardsDir = path.resolve(scriptDir, '..', 'content', 'cards');

async function loadAllCards() {
  const names = (await fs.readdir(cardsDir)).filter((name) => name.endsWith('.json')).sort();
  return Promise.all(names.map(async (name) => JSON.parse(await fs.readFile(path.join(cardsDir, name), 'utf8'))));
}

describe('quality section helpers', () => {
  it('rejects fixed-phrase examples made from reusable carrier templates', () => {
    expect(fixedExampleIssue('They can avoid an accident.', 'avoid an accident')).toBe('generic-carrier-template');
    expect(fixedExampleIssue('Regular maintenance can help us avoid an accident.', 'avoid an accident')).toBe('');
  });

  it('fails the fixed-phrase builder when even one selected example is a mechanical carrier', () => {
    expect(() => buildFixedPhrases({
      word: 'avoid',
      candidates: [{
        phrase: 'avoid an accident',
        chinese: '避免事故',
        example: 'They can avoid an accident.',
        translation: '他们可以避免事故。',
        phonetic: '/əˈvɔɪd ən ˈæksɪdənt/'
      }],
      minimumItems: 1,
      maximumItems: 1
    })).toThrow(SectionQualityError);
  });

  it('keeps legitimate time and established modal constructions while rejecting padding', () => {
    expect(reusablePhraseIssue('start production next month')).toBe('');
    expect(reusablePhraseIssue('fall ill during the trip')).toBe('');
    expect(reusablePhraseIssue('look exactly the same')).toBe('');
    expect(reusablePhraseIssue('love someone for who they are')).toBe('');
    expect(reusablePhraseIssue('remember where the key is')).toBe('');
    expect(reusablePhraseIssue('wait until')).toBe('incomplete-ending');
    expect(reusablePhraseIssue('as ... as someone could')).toBe('ellipsis-placeholder');
    for (const phrase of [
      'would love to',
      'cannot wait to',
      'be understood to',
      'must be able to',
      'win the right to',
      'be widely expected to',
      'appear likely to',
      'might be expected to'
    ]) expect(reusablePhraseIssue(phrase), phrase).toBe('missing-infinitive-complement');
    expect(mechanicalContextIssue('would like to order', 'like')).toBe('');
    expect(mechanicalContextIssue('would love to join', 'love')).toBe('');
    expect(mechanicalContextIssue('often go abroad', 'go')).toBe('mechanical-context-prefix');
  });

  it('audits every one of the 150 generated cards without silently skipping a card', async () => {
    const cards = await loadAllCards();
    const report = auditCardCollection(cards);
    expect(cards).toHaveLength(150);
    expect(report).toHaveLength(150);
    expect(new Set(report.map((entry) => entry.cardId)).size).toBe(150);
    const failed = report.filter((entry) => entry.issues.length);
    expect(failed, JSON.stringify(failed.slice(0, 20), null, 2)).toEqual([]);
  });

  it('rewrites learner questions for all 150 cards without changing answers or task types', async () => {
    const cards = await loadAllCards();
    for (const card of cards) {
      const rewritten = rewriteLearnerQuestionPrompts(card.questions, {
        word: card.word,
        coreMeaning: card.meanings[0].chinese,
        partOfSpeech: card.meanings[0].partOfSpeech
      });
      expect(rewritten).toHaveLength(card.questions.length);
      expect(rewritten.every((question) => !FORBIDDEN_QUESTION_META.test(question.prompt))).toBe(true);
      expect(rewritten.map((question) => question.answer)).toEqual(card.questions.map((question) => question.answer));
      expect(rewritten.map((question) => question.type)).toEqual(card.questions.map((question) => question.type));
    }
  });

  it('keeps the second synonym question distinct and preserves the first-answer exclusion', () => {
    const rewritten = rewriteLearnerQuestionPrompts([
      { id: 'affect-v-synonym-choice', type: 'meaning_choice', prompt: 'old', options: ['influence'], answer: 'influence' },
      { id: 'affect-v-synonym-choice-2', type: 'meaning_choice', prompt: 'old', options: ['impact'], answer: 'impact' }
    ], { word: 'affect', coreMeaning: '影响', partOfSpeech: 'v.' });
    expect(rewritten[1].prompt).toContain('除“influence”外');
    expect(rewritten[1].prompt).not.toBe(rewritten[0].prompt);
  });

  it('keeps composite POS relation answers eligible and locks the work core-sense answers', () => {
    const synonyms = [
      { word: 'labor', partOfSpeech: 'v. / n.', chinese: '劳动；劳作' },
      { word: 'function', partOfSpeech: 'v.', chinese: '运转；发挥作用' }
    ];
    const antonyms = [
      { word: 'rest', partOfSpeech: 'v. / n.', chinese: '休息' },
      { word: 'fail', partOfSpeech: 'v.', chinese: '失败；失灵' }
    ];
    expect(partOfSpeechCompatible('v. / n.', 'v.')).toBe(true);
    expect(partOfSpeechCompatible('v. / n.', 'n.')).toBe(true);
    expect(selectRelationQuestionAnswer(synonyms, { preferredWord: 'labor' })?.word).toBe('labor');
    expect(selectRelationQuestionAnswer(antonyms, { preferredWord: 'rest' })?.word).toBe('rest');
    const couldSynonyms = [
      { word: 'might', partOfSpeech: 'modal v.', chinese: '可能' },
      { word: 'was able to', partOfSpeech: 'phr.', chinese: '过去能够' }
    ];
    expect(selectRelationQuestionAnswer(couldSynonyms, { preferredWord: 'was able to' })?.word).toBe('was able to');
  });

  it('does not manufacture a second synonym question from another sense or part of speech', () => {
    const wouldSynonyms = [
      { word: 'might', partOfSpeech: 'aux.', chinese: '可能会' },
      { word: 'used to', partOfSpeech: 'phr.', chinese: '过去常常' },
      { word: 'was willing to', partOfSpeech: 'phr.', chinese: '当时愿意' }
    ];
    expect(selectSecondaryRelationQuestionAnswer(wouldSynonyms, wouldSynonyms[0])).toBeUndefined();
    expect(selectSecondaryRelationQuestionAnswer([
      { word: 'might', partOfSpeech: 'aux.', chinese: '可能会' },
      { word: 'could', partOfSpeech: 'aux.', chinese: '可能会' }
    ], wouldSynonyms[0])?.word).toBe('could');
  });

  it('describes modal and quasi-modal structures as bare-infinitive patterns', () => {
    for (const phrase of [
      'can always do something',
      'would sooner not do something',
      'would rather not do something',
      'need only do something',
      'may well do something',
      'may yet do something'
    ]) {
      const clue = structureFormClue(phrase);
      expect(clue, phrase).toContain('动词原形');
      expect(clue, phrase).not.toContain('直接带有事物宾语');
    }
  });

  it('distinguishes modal placeholders from lexical do, inversion, and polite questions', () => {
    for (const phrase of [
      'can afford something',
      'can tell',
      'can be found',
      'will not take no for an answer',
      'could not care less',
      'should know better',
      'could do with something'
    ]) {
      expect(structureFormClue(phrase), phrase).not.toContain('do 是');
      expect(structureFormClue(phrase), phrase).not.toContain('do something 是模板占位');
    }
    expect(structureFormClue('should the need arise')).toContain('条件倒装');
    expect(structureFormClue('should the need arise')).not.toContain('占位');
    expect(structureFormClue('might I ask')).toContain('礼貌');
    expect(structureFormClue('might I suggest')).toContain('礼貌');
    expect(structureFormClue('can always do something')).toContain('模板占位');
    expect(structureFormClue('want nothing to do with something')).toContain('不可拆换');
    expect(structureFormClue('seem like something')).toContain('介词 like');
    expect(structureFormClue('look like something')).toContain('介词 like');
    expect(structureFormClue('more like something')).toContain('介词 like');
    expect(structureFormClue('something like')).toContain('介词 like');
    expect(structureFormClue('give off something')).toContain('介词 off');
    expect(structureFormClue('live down something')).toContain('介词 down');
    expect(structureFormClue('remember where something is')).toContain('wh-从句');
    expect(structureFormClue('discover how something works')).toContain('wh-从句');
  });

  it('adds slot guidance only for explicit metasyntactic templates', () => {
    expect(slotGuidance('want nothing to do with something', { targetWord: 'want' })).not.toContain('do 代表');
    expect(slotGuidance('could do with something', { targetWord: 'could' })).not.toContain('do 代表');
    expect(slotGuidance('do the right thing', { targetWord: 'do' })).not.toContain('do 代表');
    expect(slotGuidance('to do something', { targetWord: 'want' })).toContain('do 代表');
    expect(slotGuidance('A useful example helps us think.', { targetWord: 'think', isTemplate: false })).toBe('');
    expect(slotGuidance('Help yourself to some fruit.', { targetWord: 'help', isTemplate: false })).toBe('');
    expect(slotGuidance('help yourself to something', { targetWord: 'help' })).toContain('yourself 或 yourselves');
    expect(slotGuidance('help yourself to something', { targetWord: 'help' })).not.toContain('myself');
  });

  it('creates a real secondary-sense question instead of fabricating another synonym', () => {
    const question = buildSecondaryMeaningChoiceQuestion({
      id: 'would-v-meaning-secondary',
      word: 'would',
      meanings: [
        { english: 'used for imagined or conditional situations', chinese: '会；将会（假设）' },
        { english: 'used to make requests, offers, and preferences more polite', chinese: '愿意；想要；请（委婉）' },
        { english: 'used for repeated actions in the past', chinese: '过去常常' }
      ]
    });
    expect(question?.answer).toBe('愿意；想要；请（委婉）');
    expect(question?.prompt).toContain('requests, offers, and preferences');
    expect(question?.options).toHaveLength(3);
    expect(question?.options).not.toContain('used to');
  });

  it('removes cross-category and relation-section duplication for all 150 cards', async () => {
    const cards = await loadAllCards();
    for (const card of cards) {
      const relationWords = [card.synonyms, card.antonyms, card.derivatives, card.confusables];
      const result = deduplicateRelatedVocabulary({
        word: card.word,
        groups: card.relatedVocabulary,
        relationWords
      });
      const words = result.groups.flatMap((group) => group.items.map((item) => item.word.toLowerCase()));
      const excluded = new Set(relationWords.flat().map((entry) => entry.word.toLowerCase()));
      expect(new Set(words).size).toBe(words.length);
      expect(words.every((word) => word !== card.word.toLowerCase() && !excluded.has(word))).toBe(true);
    }
  });

  it('builds independent context categories only from real, non-fixed phrase candidates', () => {
    const fixedPhrases = [{ phrase: 'improve your skills' }];
    const candidates = [
      ['improve communication at work', '改善职场沟通'],
      ['improve your English at school', '提高在校英语'],
      ['improve over time', '逐渐改善'],
      ['improve every day', '每天进步'],
      ['improve the final result', '改善最终结果'],
      ['improve after practice', '练习后进步'],
      ['improve customer service', '改善客户服务'],
      ['improve family communication', '改善家庭沟通'],
      ['improve before the test', '考前提高'],
      ['improve with experience', '随经验提升'],
      ['improve your skills', '提高技能']
    ].map(([phrase, chinese]) => ({ phrase, chinese, phonetic: '/test/' }));
    const groups = buildIndependentContextGroups({ word: 'improve', partOfSpeech: 'v.', fixedPhrases, candidates });
    const phrases = groups.flatMap((group) => group.items.map((entry) => entry.phrase));
    expect(phrases).toHaveLength(10);
    expect(phrases).not.toContain('improve your skills');
    expect(groups.length).toBeGreaterThanOrEqual(3);
  });

  it('rejects duplicated, truncated and sentence-translation fixed phrases', () => {
    const candidates = [
      ['improve your skills', '提高技能', 'Daily practice improves your skills.', '日常练习能提高你的技能。'],
      ['improve your health', '改善健康', 'Walking improves your health.', '步行能改善你的健康。'],
      ['improve the result', '改善结果', 'This change improved the result.', '这个改动改善了结果。'],
      ['improve communication', '改善沟通', 'Clear notes improve communication.', '清楚的笔记能改善沟通。'],
      ['improve efficiency', '提高效率', 'The new tool improves efficiency.', '新工具提高了效率。'],
      ['improve performance', '提升表现', 'Practice improves performance.', '练习能提升表现。'],
      ['improve quality', '提高质量', 'Feedback improves quality.', '反馈能提高质量。'],
      ['improve conditions', '改善条件', 'The policy improved conditions.', '这项政策改善了条件。'],
      ['improve access', '改善获取条件', 'The change improves access.', '这项改变改善了获取条件。'],
      ['improve with practice', '通过练习提高', 'You can improve with practice.', '你可以通过练习提高。'],
      ['improve your skills', '提高技能', 'Daily practice improves your skills.', '日常练习能提高你的技能。'],
      ['improve the', '我们正在提高这个项目。', 'We improve the project.', '我们改善这个项目。']
    ].map(([phrase, chinese, example, translation]) => ({ phrase, chinese, example, translation, phonetic: '/test/' }));
    const result = buildFixedPhrases({ word: 'improve', candidates });
    expect(result).toHaveLength(10);
    expect(result.map((entry) => entry.phrase)).not.toContain('improve the');
    expect(result.filter((entry) => entry.phrase === 'improve your skills')).toHaveLength(1);
  });

  it('rejects semantic related vocabulary that merely repeats other relation sections', () => {
    const groups = buildSemanticRelatedVocabulary({
      word: 'improve',
      relationWords: [{ word: 'enhance' }, { word: 'worsen' }, { word: 'improvement' }],
      semanticCandidates: [
        ['change', 'v.', '改变', '@'], ['progress', 'n.', '进步', '@'], ['upgrade', 'v.', '升级', '~'],
        ['refine', 'v.', '改进', '~'], ['quality', 'n.', '质量', '#p'], ['condition', 'n.', '状况', '#p'],
        ['practice', 'n.', '练习', 'field'], ['feedback', 'n.', '反馈', 'field'], ['enhance', 'v.', '提高', '~']
      ].map(([word, partOfSpeech, chinese, relation]) => ({ word, partOfSpeech, chinese, relation, phonetic: '/test/' })),
      minimumItems: 8
    });
    const words = groups.flatMap((group) => group.items.map((entry) => entry.word));
    expect(words).toHaveLength(8);
    expect(words).not.toContain('enhance');
    expect(new Set(words).size).toBe(words.length);
  });

  it('selects deterministic, meaningful distractors with a compatible part of speech', () => {
    const answer = { word: 'accept', partOfSpeech: 'v.', chinese: '接受', cocaRank: 100 };
    const distractors = selectTeachingDistractors({
      answer,
      candidates: [
        { word: 'choice', partOfSpeech: 'n.', chinese: '选择', cocaRank: 10 },
        { word: 'refuse', partOfSpeech: 'v.', chinese: '拒绝', cocaRank: 200 },
        { word: 'admit', partOfSpeech: 'v.', chinese: '承认', cocaRank: 150 },
        { word: 'permit', partOfSpeech: 'v.', chinese: '允许', cocaRank: 400 },
        { word: 'filler', partOfSpeech: 'v.', chinese: '相近的常用表达', cocaRank: 1 }
      ]
    });
    expect(distractors.map((entry) => entry.word)).toEqual(['admit', 'refuse', 'permit']);
    expect(distractors.every((entry) => partOfSpeechCompatible(answer.partOfSpeech, entry.partOfSpeech))).toBe(true);
  });

  it('fails instead of padding when evidence-backed inputs cannot meet a quality floor', () => {
    expect(() => buildIndependentContextGroups({
      word: 'improve',
      fixedPhrases: [{ phrase: 'improve your skills' }],
      candidates: [{ phrase: 'improve your skills', chinese: '提高技能' }],
      minimumItems: 1,
      minimumCategories: 1
    })).toThrow(SectionQualityError);
  });
});
