import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import provideCardJson from '../../content/cards/provide-v.json';
import type { WordCard } from '../types';
import { CardDetailModal } from './CardDetailModal';

const provideCard = provideCardJson as unknown as WordCard;

describe('CardDetailModal template content', () => {
  it('renders the locked ten-section template with curated provide content', () => {
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
      '词性与释义',
      '常用语境词组',
      '固定搭配和短语',
      '近义词',
      '反义词',
      '派生词',
      '易混词',
      '同类词汇分类',
      '高频例句',
    ];
    for (const sectionName of sectionNames) {
      expect(within(dialog).getAllByText(sectionName).length).toBeGreaterThan(0);
    }

    const visibleText = dialog.textContent ?? '';
    expect(visibleText).not.toContain('The phrase “');
    expect(visibleText).not.toContain('vocabulary notebook');
    expect(visibleText).not.toContain('真实表达延伸');
    expect(visibleText).not.toContain('主动输出提示');
  });
});
