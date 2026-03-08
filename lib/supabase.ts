import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL ?? '';
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

/** Admin app (subdomain or /admin path) uses a separate auth storage key so user and admin can be logged in in different tabs. */
function getAuthOptions(): { auth: { storageKey: string } } | undefined {
  if (typeof window === 'undefined') return undefined;
  const adminDomain = (import.meta.env.VITE_ADMIN_DOMAIN || 'admin.yazu.digital').toLowerCase();
  const isAdmin =
    window.location.hostname === adminDomain ||
    window.location.pathname === '/admin' ||
    window.location.pathname.startsWith('/admin/');
  return isAdmin ? { auth: { storageKey: 'sb-admin-auth-token' } } : undefined;
}

export const supabase =
  url && anonKey ? createClient(url, anonKey, getAuthOptions() ?? {}) : null;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}
