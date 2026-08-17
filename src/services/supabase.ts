import type { SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const cloudSyncConfigured = Boolean(url && publishableKey);

let clientPromise: Promise<SupabaseClient | null> | undefined;

export function getSupabase() {
  if (!cloudSyncConfigured) return Promise.resolve(null);
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(url, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'daily-english-auth'
    },
    realtime: { params: { eventsPerSecond: 4 } }
  }));
  return clientPromise;
}
