import type { ContentBundle, WordCard } from '../types';

let cachedBundle: ContentBundle | null = null;

export async function loadContent(): Promise<ContentBundle> {
  if (cachedBundle) return cachedBundle;
  const url = new URL('data/all-cards.json', window.location.href.replace(/[^/]*$/, ''));
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error('词卡内容加载失败');
  const bundle = (await response.json()) as ContentBundle;
  if (!Array.isArray(bundle.cards) || bundle.cards.length === 0) throw new Error('词卡内容为空');
  cachedBundle = bundle;
  return bundle;
}

export function cardsForStudyDay(cards: WordCard[], studyDay: number): WordCard[] {
  const normalizedDay = Math.max(1, studyDay);
  const dayInCycle = (normalizedDay - 1) % 30;
  return cards.slice(dayInCycle * 5, dayInCycle * 5 + 5);
}
