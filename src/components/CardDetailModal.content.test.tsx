import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import avoidCardJson from '../../content/cards/avoid-v.json';
import encourageCardJson from '../../content/cards/encourage-v.json';
import provideCardJson from '../../content/cards/provide-v.json';
import type { WordCard } from '../types';
import { CardDetailModal } from './CardDetailModal';

const provideCard = provideCardJson as unknown as WordCard;
const screenshotRegressionCards = [avoidCardJson, encourageCardJson] as unknown as WordCard[];

afterEach(cleanup);

describe('CardDetailModal template content', () => {
  it('renders complete meanings and keeps every lexical entry in the same mobile reading order', () => {
    render(
      <CardDetailModal
        open
        card={provideCard}
        onClose={vi.fn()}
        onLearn={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: '单词词卡' });
    expect(within(dialog).getByText('释义')).toBeInTheDocument();
    expect(within(dialog).getByText('音节与美式音标')).toBeInTheDocument();
    expect(within(dialog).getByText('provide someone with something')).toBeInTheDocument();
    expect(within(dialog).getByText('provide something for someone')).toBeInTheDocument();

    const sectionNames = [
      '核心记忆',
      '固定搭配和短语',
      '常用语境词组',
      '派生词',
      '近义词',
      '反义词',
      '易混词',
      '同类词汇分类',
    ];
    for (const sectionName of sectionNames) {
      expect(within(dialog).getAllByText(sectionName).length).toBeGreaterThan(0);
    }

    const renderedSectionOrder = Array.from(dialog.querySelectorAll('.learning-section-toggle .section-name'))
      .map((element) => element.firstChild?.textContent);
    expect(renderedSectionOrder).toEqual(sectionNames);

    expect(within(dialog).queryByText('词性与释义')).not.toBeInTheDocument();
    expect(within(dialog).queryByText('高频例句')).not.toBeInTheDocument();

    const mainEntry = dialog.querySelector('.memory-main-entry');
    const mainEntryOrder = Array.from(mainEntry?.children ?? []).map((element) => element.className);
    expect(mainEntryOrder).toEqual(['memory-main-head', 'memory-meaning-list']);

    const meaningItems = Array.from(dialog.querySelectorAll('.memory-meaning-item'));
    expect(meaningItems).toHaveLength(provideCard.meanings.length);
    const meaningListOrder = Array.from(dialog.querySelector('.memory-meaning-list')?.children ?? [])
      .map((element) => element.className);
    expect(meaningListOrder).toEqual(['memory-meaning-item core', ...provideCard.meanings.slice(1).map(() => 'memory-meaning-item')]);
    expect(meaningItems[0]).toHaveTextContent('核心义');
    provideCard.meanings.forEach((meaning, index) => {
      expect(meaningItems[index]).toHaveTextContent(meaning.partOfSpeech);
      expect(meaningItems[index]).toHaveTextContent(meaning.chinese);
      expect(meaningItems[index]).toHaveTextContent(meaning.english);
    });

    const pronunciation = dialog.querySelector('.memory-pronunciation-row .memory-pronunciation');
    expect(pronunciation).toHaveTextContent('pro·vide');
    expect(pronunciation).toHaveTextContent('/prəˈvaɪd/');

    const coreDerivativeWords = Array.from(dialog.querySelectorAll('.memory-relation-item .lexical-entry-term'))
      .map((element) => element.textContent);
    expect(coreDerivativeWords.slice(0, 2)).toEqual(['provider', 'provision']);
    expect(coreDerivativeWords).not.toContain('provided');
    expect(coreDerivativeWords).not.toContain('providing');
    expect(within(dialog).getByRole('button', { name: '播放派生词 provider 的发音' })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: '展开全部' }));
    const lexicalEntries = Array.from(dialog.querySelectorAll('.lexical-entry-copy'));
    expect(lexicalEntries.length).toBeGreaterThan(20);
    for (const entry of lexicalEntries) {
      expect(Array.from(entry.children).map((element) => element.className)).toEqual([
        'lexical-entry-term',
        'lexical-entry-meaning',
        'lexical-entry-phonetic',
      ]);
    }

    const heroOrder = Array.from(dialog.querySelector('.word-hero > div')?.children ?? [])
      .slice(0, 3)
      .map((element) => element.className);
    expect(heroOrder).toEqual(['word-heading', 'word-meaning', 'phonetic']);

    const visibleText = dialog.textContent ?? '';
    expect(visibleText).not.toContain('The phrase “');
    expect(visibleText).not.toContain('vocabulary notebook');
    expect(visibleText).not.toContain('真实表达延伸');
    expect(visibleText).not.toContain('主动输出提示');
    expect(visibleText).not.toContain('人工精校');
    expect(visibleText).not.toContain('模板版本');
    expect(visibleText).not.toContain('内容版本');
    expect(visibleText).not.toContain('待深度补全');
  });

  it('does not repeat an identical Chinese gloss as the example translation', () => {
    const fixedPhrase = {
      ...provideCard.fixedPhrases[0],
      phrase: 'provide a clear answer',
      chinese: '给出明确答复。',
      translation: '给出明确答复',
    };
    const card = { ...provideCard, fixedPhrases: [fixedPhrase] };

    render(
      <CardDetailModal
        open
        card={card}
        onClose={vi.fn()}
        onLearn={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: '单词词卡' });
    const phraseToggle = Array.from(dialog.querySelectorAll<HTMLButtonElement>('.learning-section-toggle'))
      .find((button) => button.textContent?.includes('固定搭配和短语'));
    expect(phraseToggle).toBeDefined();
    fireEvent.click(phraseToggle!);
    expect(within(dialog).getAllByText('给出明确答复。')).toHaveLength(1);
  });

  it.each(screenshotRegressionCards)('keeps the expanded detail floor visible for $word', (card) => {
    expect(card.meanings.length).toBeGreaterThanOrEqual(2);
    expect(card.fixedPhrases.length).toBeGreaterThanOrEqual(12);
    expect(card.contextPhrases).toHaveLength(4);
    expect(card.contextPhrases.flatMap((group) => group.items)).toHaveLength(16);
    expect(card.derivatives.length).toBeGreaterThanOrEqual(4);
    expect(card.synonyms.length).toBeGreaterThanOrEqual(5);
    expect(card.examples.length).toBeGreaterThanOrEqual(12);
    expect(card.questions.length).toBeGreaterThanOrEqual(15);

    render(
      <CardDetailModal
        open
        card={card}
        onClose={vi.fn()}
        onLearn={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: '单词词卡' });
    const sectionCounts = new Map(
      Array.from(dialog.querySelectorAll('.learning-section-toggle')).map((button) => {
        const name = button.querySelector('.section-name')?.firstChild?.textContent ?? '';
        const count = button.querySelector('.section-name small')?.textContent ?? '';
        return [name, count];
      }),
    );
    expect(sectionCounts.get('固定搭配和短语')).toBe(`${card.fixedPhrases.length} 项内容`);
    expect(sectionCounts.get('常用语境词组')).toBe('16 项内容');
    expect(sectionCounts.get('派生词')).toBe(`${card.derivatives.length} 项内容`);
    expect(sectionCounts.get('近义词')).toBe(`${card.synonyms.length} 项内容`);
    expect(sectionCounts.get('同类词汇分类')).toBe('12 项内容');
  });
});
