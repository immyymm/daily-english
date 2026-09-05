import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import provideCardJson from '../../content/cards/provide-v.json';
import type { WordCard } from '../types';
import { CardDetailModal } from './CardDetailModal';

const provideCard = provideCardJson as unknown as WordCard;

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

    const dialog = screen.getByRole('dialog', { name: '完整单词词卡' });
    expect(within(dialog).getByText('人工精校详卡')).toBeInTheDocument();
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
    expect(mainEntryOrder).toEqual(['memory-main-head', 'memory-meaning-list', 'memory-pronunciation']);

    const meaningItems = Array.from(dialog.querySelectorAll('.memory-meaning-item'));
    expect(meaningItems).toHaveLength(provideCard.meanings.length);
    const meaningListOrder = Array.from(dialog.querySelector('.memory-meaning-list')?.children ?? [])
      .map((element) => element.className);
    expect(meaningListOrder).toEqual(['memory-core-summary', ...provideCard.meanings.map(() => 'memory-meaning-item')]);
    expect(dialog.querySelector('.memory-core-summary')).toHaveTextContent('v.提供核心义');
    expect(meaningItems[0]).toHaveTextContent('提供；供给');
    expect(meaningItems[0]).toHaveTextContent('to give someone something that they need');
    expect(meaningItems[1]).toHaveTextContent('提供；使可以使用');
    expect(meaningItems[2]).toHaveTextContent('供养；为……提供生活所需');

    const pronunciation = mainEntry?.querySelector('.memory-pronunciation');
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
  });
});
