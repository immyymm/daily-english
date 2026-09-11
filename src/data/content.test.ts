import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import {
  cardsForStudyDay,
  clearContentCache,
  loadContent,
  revalidateContent,
  watchForContentUpdates
} from './content';
import type { ContentBundle, WordCard } from '../types';

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

const jsonResponse = (body: unknown) => new Response(JSON.stringify(body), {
  status: 200,
  headers: { 'Content-Type': 'application/json' }
});
const catalogHash = (body: unknown) => createHash('sha256')
  .update(JSON.stringify(body))
  .digest('hex')
  .toUpperCase();

const bundle = (word: string): ContentBundle => ({
  contentVersion: 'cards-v1',
  templateVersion: 'template-v1',
  total: 1,
  cards: [{ id: 'test-v', word } as WordCard]
});

describe('content catalog updates', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    clearContentCache();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    clearContentCache();
    vi.unstubAllGlobals();
    delete (document as unknown as { visibilityState?: DocumentVisibilityState }).visibilityState;
  });

  it('loads a content-only catalog update even when the public version string is unchanged', async () => {
    const firstBundle = bundle('old wording');
    const updatedBundle = bundle('new detailed wording');
    fetchMock
      .mockResolvedValueOnce(jsonResponse({
        contentVersion: 'cards-v1',
        templateVersion: 'template-v1',
        catalogHash: catalogHash(firstBundle),
        releaseId: 'release-before'
      }))
      .mockResolvedValueOnce(jsonResponse(firstBundle))
      .mockResolvedValueOnce(jsonResponse({
        contentVersion: 'cards-v1',
        templateVersion: 'template-v1',
        catalogHash: catalogHash(updatedBundle),
        releaseId: 'release-after'
      }))
      .mockResolvedValueOnce(jsonResponse(updatedBundle));

    expect((await loadContent()).cards[0].word).toBe('old wording');
    const update = await revalidateContent();

    expect(update.changed).toBe(true);
    expect(update.bundle.cards[0].word).toBe('new detailed wording');
    expect((await loadContent()).cards[0].word).toBe('new detailed wording');
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock.mock.calls[2][0].toString()).toContain('manifest.json?check=');
    expect(fetchMock.mock.calls[3][0].toString()).toContain(`catalog=${catalogHash(updatedBundle)}`);
    expect(fetchMock.mock.calls[3][0].toString()).toContain('release=release-after');
    expect(fetchMock.mock.calls.every(([, init]) => init?.cache === 'no-store')).toBe(true);
  });

  it('rechecks on background resume, pageshow and focus without touching IndexedDB', async () => {
    const firstBundle = bundle('old wording');
    const updatedBundle = bundle('new detailed wording');
    const oldManifest = {
      contentVersion: 'cards-v1',
      templateVersion: 'template-v1',
      catalogHash: catalogHash(firstBundle),
      releaseId: 'release-before'
    };
    const newManifest = {
      contentVersion: 'cards-v1',
      templateVersion: 'template-v1',
      catalogHash: catalogHash(updatedBundle),
      releaseId: 'release-after'
    };
    fetchMock
      .mockResolvedValueOnce(jsonResponse(oldManifest))
      .mockResolvedValueOnce(jsonResponse(firstBundle));
    await loadContent();

    const indexedDbOpen = vi.fn();
    vi.stubGlobal('indexedDB', { open: indexedDbOpen });
    const onUpdate = vi.fn();
    const stopWatching = watchForContentUpdates(onUpdate);

    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(fetchMock).toHaveBeenCalledTimes(2);

    fetchMock
      .mockResolvedValueOnce(jsonResponse(newManifest))
      .mockResolvedValueOnce(jsonResponse(updatedBundle));
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.waitFor(() => expect(onUpdate).toHaveBeenCalledWith(updatedBundle));

    fetchMock.mockResolvedValueOnce(jsonResponse(newManifest));
    window.dispatchEvent(new Event('pageshow'));
    await revalidateContent();
    expect(fetchMock).toHaveBeenCalledTimes(5);

    fetchMock.mockResolvedValueOnce(jsonResponse(newManifest));
    window.dispatchEvent(new Event('focus'));
    await revalidateContent();
    expect(fetchMock).toHaveBeenCalledTimes(6);

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect((await loadContent()).cards[0].word).toBe('new detailed wording');
    expect(indexedDbOpen).not.toHaveBeenCalled();
    expect(fetchMock.mock.calls.every(([, init]) => init?.cache === 'no-store')).toBe(true);

    stopWatching();
    window.dispatchEvent(new Event('focus'));
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalledTimes(6);
  });

  it('rejects a catalog whose bytes do not match the manifest and keeps the prior verified bundle', async () => {
    const firstBundle = bundle('verified wording');
    const expectedBundle = bundle('expected new wording');
    const staleBundle = bundle('stale CDN wording');
    fetchMock
      .mockResolvedValueOnce(jsonResponse({
        contentVersion: 'cards-v1',
        templateVersion: 'template-v1',
        catalogHash: catalogHash(firstBundle),
        releaseId: 'release-before'
      }))
      .mockResolvedValueOnce(jsonResponse(firstBundle));

    expect((await loadContent()).cards[0].word).toBe('verified wording');

    const indexedDbOpen = vi.fn();
    vi.stubGlobal('indexedDB', { open: indexedDbOpen });
    fetchMock
      .mockResolvedValueOnce(jsonResponse({
        contentVersion: 'cards-v1',
        templateVersion: 'template-v1',
        catalogHash: catalogHash(expectedBundle),
        releaseId: 'release-after'
      }))
      .mockResolvedValueOnce(jsonResponse(staleBundle));

    await expect(revalidateContent()).rejects.toThrow('词卡内容校验失败');
    expect((await loadContent()).cards[0].word).toBe('verified wording');
    expect(indexedDbOpen).not.toHaveBeenCalled();
  });
});
