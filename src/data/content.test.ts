import { describe, expect, it } from 'vitest';
import { cardsForStudyDay } from './content';
import type { WordCard } from '../types';

const cards = Array.from({ length: 150 }, (_, index) => ({ id: 'card-' + index } as WordCard));

describe('daily card selection', () => {
  it('returns exactly five stable cards for a study day', () => {
    expect(cardsForStudyDay(cards, 1).map((card) => card.id)).toEqual(['card-0', 'card-1', 'card-2', 'card-3', 'card-4']);
    expect(cardsForStudyDay(cards, 30)).toHaveLength(5);
  });

  it('does not silently loop back to old new-word cards after the catalog ends', () => {
    expect(cardsForStudyDay(cards, 31)).toEqual([]);
  });
});
