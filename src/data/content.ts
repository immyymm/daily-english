import type { ContentBundle, WordCard } from '../types';
import { releaseConfig } from '../config/release';

interface ContentManifest {
  contentVersion: string;
  templateVersion: string;
  catalogHash: string;
  releaseId: string;
}

export interface ContentUpdateResult {
  changed: boolean;
  bundle: ContentBundle;
}

let cachedBundle: ContentBundle | null = null;
let cachedManifest: ContentManifest | null = null;
let initialLoad: Promise<ContentBundle> | null = null;
let updateCheck: Promise<ContentUpdateResult> | null = null;
let requestNonce = 0;

function dataBaseUrl() {
  return new URL(import.meta.env.BASE_URL, window.location.origin);
}

function nextRequestNonce() {
  requestNonce += 1;
  return `${Date.now()}-${requestNonce}`;
}

async function fetchManifest(): Promise<ContentManifest> {
  const manifestUrl = new URL('data/manifest.json', dataBaseUrl());
  // iOS standalone PWAs can retain an in-memory response despite no-store.
  // A unique URL makes every foreground check observable at the origin/CDN.
  manifestUrl.searchParams.set('check', nextRequestNonce());
  const response = await fetch(manifestUrl.toString(), { cache: 'no-store' });
  if (!response.ok) throw new Error('词卡版本信息加载失败');
  const manifest = (await response.json()) as ContentManifest;
  const normalizedCatalogHash = manifest.catalogHash?.trim().toUpperCase();
  if (!manifest.contentVersion || !manifest.templateVersion || !normalizedCatalogHash || !manifest.releaseId) {
    throw new Error('词卡版本信息无效');
  }
  if (manifest.contentVersion !== releaseConfig.contentVersion
    || manifest.templateVersion !== releaseConfig.templateVersion
    || manifest.releaseId !== releaseConfig.releaseVersion
    || normalizedCatalogHash !== releaseConfig.catalogHash) {
    throw new Error('词卡版本不是当前固定发布版本，请刷新应用');
  }
  manifest.catalogHash = normalizedCatalogHash;
  return manifest;
}

function isSameManifest(left: ContentManifest, right: ContentManifest) {
  return left.contentVersion === right.contentVersion
    && left.templateVersion === right.templateVersion
    && (left.catalogHash ?? '') === (right.catalogHash ?? '')
    && (left.releaseId ?? '') === (right.releaseId ?? '');
}

async function sha256Hex(text: string) {
  if (!globalThis.crypto?.subtle) throw new Error('当前浏览器无法校验词卡内容');
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

async function fetchBundle(manifest: ContentManifest): Promise<ContentBundle> {
  const url = new URL('data/all-cards.json', dataBaseUrl());
  url.searchParams.set('v', manifest.contentVersion);
  url.searchParams.set('catalog', manifest.catalogHash);
  url.searchParams.set('release', manifest.releaseId);
  const response = await fetch(url.toString(), { cache: 'no-store' });
  if (!response.ok) throw new Error('词卡内容加载失败');
  const catalogText = await response.text();
  const expectedHash = manifest.catalogHash;
  if (!/^[0-9A-F]{64}$/.test(expectedHash)) throw new Error('词卡版本校验信息无效');
  const actualHash = await sha256Hex(catalogText);
  if (actualHash !== expectedHash) throw new Error('词卡内容校验失败，请稍后重试');
  let bundle: ContentBundle;
  try {
    bundle = JSON.parse(catalogText) as ContentBundle;
  } catch {
    throw new Error('词卡内容格式无效');
  }
  if (!Array.isArray(bundle.cards) || bundle.cards.length === 0) throw new Error('词卡内容为空');
  if (bundle.contentVersion !== manifest.contentVersion
    || bundle.templateVersion !== manifest.templateVersion
    || bundle.contentVersion !== releaseConfig.contentVersion
    || bundle.templateVersion !== releaseConfig.templateVersion) {
    throw new Error('词卡更新未完成，请刷新后重试');
  }
  return bundle;
}

async function loadAndCache(manifest: ContentManifest) {
  const bundle = await fetchBundle(manifest);
  cachedManifest = manifest;
  cachedBundle = bundle;
  return bundle;
}

export function clearContentCache() {
  cachedBundle = null;
  cachedManifest = null;
  initialLoad = null;
}

export async function loadContent(): Promise<ContentBundle> {
  if (cachedBundle) return cachedBundle;
  if (!initialLoad) {
    initialLoad = fetchManifest()
      .then(loadAndCache)
      .finally(() => {
        initialLoad = null;
      });
  }
  return initialLoad;
}

export async function revalidateContent(): Promise<ContentUpdateResult> {
  if (updateCheck) return updateCheck;
  updateCheck = (async () => {
    if (initialLoad) await initialLoad;
    const previousManifest = cachedManifest;
    const previousBundle = cachedBundle;
    const manifest = await fetchManifest();
    if (previousManifest && previousBundle && isSameManifest(previousManifest, manifest)) {
      return { changed: false, bundle: previousBundle };
    }

    // Keep the current cards usable until the replacement has passed validation,
    // then clear the module cache and publish the new catalog atomically.
    const bundle = await fetchBundle(manifest);
    clearContentCache();
    cachedManifest = manifest;
    cachedBundle = bundle;
    return { changed: Boolean(previousManifest), bundle };
  })().finally(() => {
    updateCheck = null;
  });
  return updateCheck;
}

export function watchForContentUpdates(
  onUpdate: (bundle: ContentBundle) => void,
  onError?: (error: unknown) => void
) {
  const check = () => {
    if (document.visibilityState === 'hidden') return;
    void revalidateContent()
      .then((result) => {
        if (result.changed) onUpdate(result.bundle);
      })
      .catch((error: unknown) => onError?.(error));
  };
  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') check();
  };

  window.addEventListener('pageshow', check);
  window.addEventListener('focus', check);
  document.addEventListener('visibilitychange', onVisibilityChange);
  return () => {
    window.removeEventListener('pageshow', check);
    window.removeEventListener('focus', check);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}

export function cardsForStudyDay(cards: WordCard[], studyDay: number): WordCard[] {
  const normalizedDay = Math.max(1, studyDay);
  const start = (normalizedDay - 1) * 5;
  return cards.slice(start, start + 5);
}
