import type { ContentBundle, WordCard } from '../types';

let cachedBundle: ContentBundle | null = null;

export async function loadContent(): Promise<ContentBundle> {
  if (cachedBundle) return cachedBundle;
  const base = window.location.href.replace(/[^/]*$/, '');
  const manifestUrl = new URL('data/manifest.json', base);
  const manifestResponse = await fetch(manifestUrl.toString(), { cache: 'no-store' });
  if (!manifestResponse.ok) throw new Error('词卡版本信息加载失败');
  const manifest = (await manifestResponse.json()) as Pick<ContentBundle, 'contentVersion' | 'templateVersion'>;
  const url = new URL('data/all-cards.json', base);
  url.searchParams.set('v', manifest.contentVersion);
  const response = await fetch(url.toString(), { cache: 'no-store' });
  if (!response.ok) throw new Error('词卡内容加载失败');
  const bundle = (await response.json()) as ContentBundle;
  if (!Array.isArray(bundle.cards) || bundle.cards.length === 0) throw new Error('词卡内容为空');
  if (bundle.contentVersion !== manifest.contentVersion || bundle.templateVersion !== manifest.templateVersion) {
    throw new Error('词卡内容版本不一致，请刷新后重试');
  }
  cachedBundle = bundle;
  return bundle;
}

export function cardsForStudyDay(cards: WordCard[], studyDay: number): WordCard[] {
  const normalizedDay = Math.max(1, studyDay);
  const dayInCycle = (normalizedDay - 1) % 30;
  return cards.slice(dayInCycle * 5, dayInCycle * 5 + 5);
}
