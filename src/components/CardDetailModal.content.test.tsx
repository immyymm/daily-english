import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import provideCardJson from '../../content/cards/provide-v.json';
import type { WordCard } from '../types';
import { CardDetailModal } from './CardDetailModal';

const provideCard = provideCardJson as unknown as WordCard;

describe('CardDetailModal template content', () => {
  it('renders the mobile learning order and the condensed core-memory fields', () => {
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

    const pronunciation = dialog.querySelector('.memory-pronunciation');
    expect(pronunciation).toHaveTextContent('pro·vide');
    expect(pronunciation).toHaveTextContent('/prəˈvaɪd/');

    const definition = dialog.querySelector('.memory-definition');
    expect(definition).toHaveTextContent('v.');
    expect(definition).toHaveTextContent('提供');
    expect(definition).toHaveTextContent('to give someone something that they need');

    const coreDerivativeWords = Array.from(dialog.querySelectorAll('.memory-relation-item > div > strong'))
      .map((element) => element.textContent);
    expect(coreDerivativeWords.slice(0, 2)).toEqual(['provider', 'provision']);
    expect(coreDerivativeWords).not.toContain('provided');
    expect(coreDerivativeWords).not.toContain('providing');
    expect(within(dialog).getByRole('button', { name: '播放派生词 provider 的发音' })).toBeInTheDocument();

    const visibleText = dialog.textContent ?? '';
    expect(visibleText).not.toContain('The phrase “');
    expect(visibleText).not.toContain('vocabulary notebook');
    expect(visibleText).not.toContain('真实表达延伸');
    expect(visibleText).not.toContain('主动输出提示');
  });
});
