import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cardsForStudyDay,
  clearContentCache,
  loadContent,
  revalidateContent,
  watchForContentUpdates
} from './content';
import type { ContentBundle, WordCard } from '../types';
import { releaseConfig } from '../config/release';

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
const digestBytes = (hex: string) => Uint8Array.from(hex.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16)).buffer;

const bundle = (word: string): ContentBundle => ({
  contentVersion: releaseConfig.contentVersion,
  templateVersion: releaseConfig.templateVersion,
  total: 1,
  cards: [{ id: 'test-v', word } as WordCard]
});

const lockedManifest = {
  contentVersion: releaseConfig.contentVersion,
  templateVersion: releaseConfig.templateVersion,
  catalogHash: releaseConfig.catalogHash,
  releaseId: releaseConfig.releaseVersion
};

describe('content catalog updates', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    clearContentCache();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('crypto', {
      subtle: {
        digest: vi.fn().mockResolvedValue(digestBytes(releaseConfig.catalogHash))
      }
    });
  });

  afterEach(() => {
    clearContentCache();
    vi.unstubAllGlobals();
    delete (document as unknown as { visibilityState?: DocumentVisibilityState }).visibilityState;
  });

  it('loads only the immutable catalog identified by the compiled release', async () => {
    const currentBundle = bundle('locked detailed wording');
    fetchMock
      .mockResolvedValueOnce(jsonResponse(lockedManifest))
      .mockResolvedValueOnce(jsonResponse(currentBundle))
      .mockResolvedValueOnce(jsonResponse(lockedManifest));

    expect((await loadContent()).cards[0].word).toBe('locked detailed wording');
    const update = await revalidateContent();

    expect(update.changed).toBe(false);
    expect(update.bundle.cards[0].word).toBe('locked detailed wording');
    expect((await loadContent()).cards[0].word).toBe('locked detailed wording');
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[2][0].toString()).toContain('manifest.json?check=');
    expect(fetchMock.mock.calls[1][0].toString()).toContain(`catalog=${releaseConfig.catalogHash}`);
    expect(fetchMock.mock.calls[1][0].toString()).toContain(`release=${releaseConfig.releaseVersion}`);
    expect(fetchMock.mock.calls.every(([, init]) => init?.cache === 'no-store')).toBe(true);
  });

  it('rechecks on background resume, pageshow and focus without touching IndexedDB', async () => {
    const currentBundle = bundle('locked detailed wording');
    fetchMock
      .mockResolvedValueOnce(jsonResponse(lockedManifest))
      .mockResolvedValueOnce(jsonResponse(currentBundle));
    await loadContent();

    const indexedDbOpen = vi.fn();
    vi.stubGlobal('indexedDB', { open: indexedDbOpen });
    const onUpdate = vi.fn();
    const stopWatching = watchForContentUpdates(onUpdate);

    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(fetchMock).toHaveBeenCalledTimes(2);

    fetchMock.mockResolvedValueOnce(jsonResponse(lockedManifest));
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    await revalidateContent();

    fetchMock.mockResolvedValueOnce(jsonResponse(lockedManifest));
    window.dispatchEvent(new Event('pageshow'));
    await revalidateContent();
    expect(fetchMock).toHaveBeenCalledTimes(4);

    fetchMock.mockResolvedValueOnce(jsonResponse(lockedManifest));
    window.dispatchEvent(new Event('focus'));
    await revalidateContent();
    expect(fetchMock).toHaveBeenCalledTimes(5);

    expect(onUpdate).not.toHaveBeenCalled();
    expect((await loadContent()).cards[0].word).toBe('locked detailed wording');
    expect(indexedDbOpen).not.toHaveBeenCalled();
    expect(fetchMock.mock.calls.every(([, init]) => init?.cache === 'no-store')).toBe(true);

    stopWatching();
    window.dispatchEvent(new Event('focus'));
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it('rejects a foreign manifest and keeps the prior verified bundle', async () => {
    const firstBundle = bundle('verified wording');
    fetchMock
      .mockResolvedValueOnce(jsonResponse(lockedManifest))
      .mockResolvedValueOnce(jsonResponse(firstBundle));

    expect((await loadContent()).cards[0].word).toBe('verified wording');

    const indexedDbOpen = vi.fn();
    vi.stubGlobal('indexedDB', { open: indexedDbOpen });
    fetchMock.mockResolvedValueOnce(jsonResponse({
      ...lockedManifest,
      contentVersion: '2026.09.10.4'
    }));

    await expect(revalidateContent()).rejects.toThrow('词卡版本不是当前固定发布版本');
    expect((await loadContent()).cards[0].word).toBe('verified wording');
    expect(indexedDbOpen).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('rejects catalog bytes that do not match the locked hash', async () => {
    const currentBundle = bundle('tampered wording');
    vi.stubGlobal('crypto', {
      subtle: {
        digest: vi.fn().mockResolvedValue(digestBytes('0'.repeat(64)))
      }
    });
    fetchMock
      .mockResolvedValueOnce(jsonResponse(lockedManifest))
      .mockResolvedValueOnce(jsonResponse(currentBundle));

    await expect(loadContent()).rejects.toThrow('词卡内容校验失败');
  });
});
