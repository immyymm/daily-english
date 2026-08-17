import type { Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { exportSnapshot, importSnapshot } from '../storage/db';
import { hydrateDetailedRecords, syncDetailedRecords } from '../services/cloudRecords';
import { cloudSyncConfigured, getSupabase } from '../services/supabase';
import type { AIEvaluation, AppSnapshot, CardProgress, DailyPlanRecord } from '../types';

export const LOCAL_DATA_CHANGED_EVENT = 'daily-english:local-data-changed';

export function notifyLocalDataChanged() {
  window.dispatchEvent(new Event(LOCAL_DATA_CHANGED_EVENT));
}

type SyncState = 'disabled' | 'signed-out' | 'connecting' | 'synced' | 'error';

interface SnapshotRow {
  user_id: string;
  payload: AppSnapshot;
  client_updated_at: string;
  updated_at: string;
  revision: number;
  device_id: string | null;
}

function getDeviceId() {
  const key = 'daily-english-device-id';
  const stored = localStorage.getItem(key);
  if (stored) return stored;
  const created = crypto.randomUUID();
  localStorage.setItem(key, created);
  return created;
}

function timestamp(value?: string) {
  return value ? new Date(value).getTime() || 0 : 0;
}

function progressTime(item: CardProgress) {
  return timestamp(item.lastReviewedAt ?? item.learnedAt);
}

function mergeByKey<T>(local: T[], remote: T[], key: (item: T) => string, choose: (a: T, b: T) => T): T[] {
  const merged = new Map<string, T>();
  for (const item of local) merged.set(key(item), item);
  for (const item of remote) {
    const existing = merged.get(key(item));
    merged.set(key(item), existing ? choose(existing, item) : item);
  }
  return [...merged.values()];
}

function mergePlans(local: DailyPlanRecord, remote: DailyPlanRecord): DailyPlanRecord {
  const cardIds = [...new Set([...local.cardIds, ...remote.cardIds])];
  return {
    ...local,
    ...remote,
    cardIds,
    completedCardIds: [...new Set([...local.completedCardIds, ...remote.completedCardIds])]
  };
}

function chooseEvaluation(local: AIEvaluation, remote: AIEvaluation) {
  if (local.status === 'complete' && remote.status !== 'complete') return local;
  if (remote.status === 'complete' && local.status !== 'complete') return remote;
  return timestamp(remote.createdAt) >= timestamp(local.createdAt) ? remote : local;
}

function chooseRecommendation(local: AppSnapshot['dailyRecommendations'][number], remote: AppSnapshot['dailyRecommendations'][number]) {
  return timestamp(remote.generatedAt) >= timestamp(local.generatedAt) ? remote : local;
}

export function mergeSnapshots(local: AppSnapshot, remote: AppSnapshot): AppSnapshot {
  const localNewer = timestamp(local.exportedAt) >= timestamp(remote.exportedAt);
  const newerSettings = localNewer ? local.settings : remote.settings;
  return {
    settings: {
      ...newerSettings,
      id: 'settings',
      firstUseDate: local.settings.firstUseDate <= remote.settings.firstUseDate
        ? local.settings.firstUseDate
        : remote.settings.firstUseDate,
      streak: Math.max(local.settings.streak, remote.settings.streak),
      aiConsent: local.settings.aiConsent || remote.settings.aiConsent
    },
    progress: mergeByKey(local.progress, remote.progress, (item) => item.cardId, (a, b) => progressTime(b) >= progressTime(a) ? b : a),
    attempts: mergeByKey(local.attempts, remote.attempts, (item) => item.id, (a, b) => timestamp(b.createdAt) >= timestamp(a.createdAt) ? b : a),
    aiEvaluations: mergeByKey(local.aiEvaluations, remote.aiEvaluations, (item) => item.requestId, chooseEvaluation),
    dailyPlans: mergeByKey(local.dailyPlans, remote.dailyPlans, (item) => item.date, mergePlans),
    dailyRecommendations: mergeByKey(
      local.dailyRecommendations ?? [],
      remote.dailyRecommendations ?? [],
      (item) => item.date,
      chooseRecommendation
    ),
    exportedAt: new Date(Math.max(timestamp(local.exportedAt), timestamp(remote.exportedAt))).toISOString(),
    schemaVersion: 2
  };
}

export function useCloudSync(refresh: () => Promise<void>) {
  const [session, setSession] = useState<Session | null>(null);
  const [state, setState] = useState<SyncState>(cloudSyncConfigured ? 'signed-out' : 'disabled');
  const [message, setMessage] = useState(cloudSyncConfigured ? '登录后可在多台设备间实时同步' : '云同步尚未配置');
  const [lastSyncedAt, setLastSyncedAt] = useState<string>();
  const revisionRef = useRef(0);
  const deviceIdRef = useRef<string | undefined>(undefined);
  const syncingRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);

  if (!deviceIdRef.current && typeof window !== 'undefined') deviceIdRef.current = getDeviceId();

  const pushSnapshot = useCallback(async (userId?: string) => {
    const activeUserId = userId ?? session?.user.id;
    const client = await getSupabase();
    if (!client || !activeUserId || syncingRef.current) return;
    syncingRef.current = true;
    setState('connecting');
    setMessage('正在同步学习记录…');
    try {
      const payload = await exportSnapshot();
      const now = new Date().toISOString();
      const revision = revisionRef.current + 1;
      const { error } = await client.from('daily_english_snapshots').upsert({
        user_id: activeUserId,
        payload,
        schema_version: payload.schemaVersion,
        client_updated_at: now,
        updated_at: now,
        revision,
        device_id: deviceIdRef.current
      }, { onConflict: 'user_id' });
      if (error) throw error;
      await syncDetailedRecords(client, activeUserId, payload, deviceIdRef.current);
      revisionRef.current = revision;
      setLastSyncedAt(now);
      setState('synced');
      setMessage('所有设备已同步');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : '同步失败，请稍后重试');
    } finally {
      syncingRef.current = false;
    }
  }, [session?.user.id]);

  const mergeRemote = useCallback(async (row: SnapshotRow, userId: string, uploadMerged: boolean) => {
    const local = await exportSnapshot();
    const merged = mergeSnapshots(local, row.payload);
    revisionRef.current = Math.max(revisionRef.current, row.revision ?? 0);
    await importSnapshot(merged);
    await refresh();
    setLastSyncedAt(row.updated_at ?? row.client_updated_at);
    setState('synced');
    setMessage('已收到另一台设备的最新记录');
    if (uploadMerged) await pushSnapshot(userId);
  }, [pushSnapshot, refresh]);

  const connect = useCallback(async (activeSession: Session) => {
    const client = await getSupabase();
    if (!client) return;
    setState('connecting');
    setMessage('正在合并云端和本机记录…');
    const { data, error } = await client
      .from('daily_english_snapshots')
      .select('*')
      .eq('user_id', activeSession.user.id)
      .maybeSingle<SnapshotRow>();
    if (error) {
      setState('error');
      setMessage(error.message);
      return;
    }
    if (data) await mergeRemote(data, activeSession.user.id, true);
    else await pushSnapshot(activeSession.user.id);
    try {
      await hydrateDetailedRecords(client, activeSession.user.id);
      await refresh();
    } catch (detailError) {
      console.warn('DETAILED_SYNC_UNAVAILABLE', detailError);
    }
  }, [mergeRemote, pushSnapshot]);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    void getSupabase().then((client) => {
      if (!client || cancelled) return;
      void client.auth.getSession().then(({ data }) => {
        if (cancelled) return;
        setSession(data.session);
        if (data.session) void connect(data.session);
      });
      const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
        if (nextSession) window.setTimeout(() => void connect(nextSession), 0);
        else {
          setState('signed-out');
          setMessage('登录后可在多台设备间实时同步');
        }
      });
      unsubscribe = () => data.subscription.unsubscribe();
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [connect]);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void getSupabase().then((client) => {
      if (!client || cancelled) return;
      const channel = client
        .channel('daily-english-' + session.user.id)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'daily_english_snapshots',
          filter: 'user_id=eq.' + session.user.id
        }, (event) => {
          const row = event.new as SnapshotRow;
          if (!row?.payload || row.device_id === deviceIdRef.current) return;
          void mergeRemote(row, session.user.id, false);
        })
        .subscribe();
      cleanup = () => { void client.removeChannel(channel); };
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [mergeRemote, session]);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let refreshTimer: number | undefined;
    void getSupabase().then((client) => {
      if (!client || cancelled) return;
      const hydrate = () => {
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => {
          void hydrateDetailedRecords(client, session.user.id)
            .then(refresh)
            .catch((error) => console.warn('DETAILED_REALTIME_REFRESH_FAILED', error));
        }, 250);
      };
      let channel = client.channel('daily-english-details-' + session.user.id);
      for (const table of ['daily_english_mastery', 'daily_english_attempts', 'daily_english_ai_evaluations', 'daily_english_daily_plans']) {
        channel = channel.on('postgres_changes', {
          event: '*',
          schema: 'public',
          table,
          filter: 'user_id=eq.' + session.user.id
        }, hydrate);
      }
      channel = channel.subscribe();
      cleanup = () => {
        window.clearTimeout(refreshTimer);
        void client.removeChannel(channel);
      };
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [refresh, session]);

  useEffect(() => {
    if (!session) return;
    const handleChange = () => {
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => void pushSnapshot(), 900);
    };
    window.addEventListener(LOCAL_DATA_CHANGED_EVENT, handleChange);
    return () => {
      window.removeEventListener(LOCAL_DATA_CHANGED_EVENT, handleChange);
      window.clearTimeout(timerRef.current);
    };
  }, [pushSnapshot, session]);

  const sendMagicLink = useCallback(async (email: string) => {
    const client = await getSupabase();
    if (!client) throw new Error('云同步尚未配置');
    setState('connecting');
    const redirect = new URL(import.meta.env.BASE_URL, window.location.origin).toString();
    const { error } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirect, shouldCreateUser: true }
    });
    if (error) {
      setState('error');
      setMessage(error.message);
      throw error;
    }
    setState('signed-out');
    setMessage('登录链接已发送，请在邮箱中打开');
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const client = await getSupabase();
    if (!client) return false;
    setState('connecting');
    setMessage('正在登录并读取云端记录…');
    const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setState('error');
      setMessage(error.message === 'Invalid login credentials' ? '邮箱或密码不正确' : error.message);
      return false;
    }
    return true;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const client = await getSupabase();
    if (!client) return false;
    setState('connecting');
    setMessage('正在创建“每日英语”同步账户…');
    const { data, error } = await client.auth.signUp({ email: email.trim(), password });
    if (error) {
      setState('error');
      setMessage(error.message);
      return false;
    }
    if (!data.session) {
      setState('signed-out');
      setMessage('确认邮件已发送；点击邮件中的链接后，返回这里登录');
    }
    return true;
  }, []);

  const signOut = useCallback(async () => {
    const client = await getSupabase();
    if (!client) return;
    await client.auth.signOut();
    setSession(null);
    setState('signed-out');
    setMessage('已退出；本机学习记录仍然保留');
  }, []);

  return {
    configured: cloudSyncConfigured,
    session,
    state,
    message,
    lastSyncedAt,
    sendMagicLink,
    signIn,
    signUp,
    signOut,
    syncNow: () => pushSnapshot()
  };
}
