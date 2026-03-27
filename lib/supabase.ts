import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const url = rawUrl.replace(/\/+$/, '');
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

/** Main app: default storage key (user session). */
export const supabaseMain =
  url && anonKey ? createClient(url, anonKey) : null;

/** Admin app: separate storage key so admin and user sessions can coexist in different tabs. */
export const supabaseAdmin =
  url && anonKey ? createClient(url, anonKey, { auth: { storageKey: 'sb-admin-auth-token' } }) : null;

function isAdminContext(): boolean {
  if (typeof window === 'undefined') return false;
  const adminDomain = (import.meta.env.VITE_ADMIN_DOMAIN || 'admin.yazu.digital').toLowerCase();
  return (
    window.location.hostname === adminDomain ||
    window.location.pathname === '/admin' ||
    window.location.pathname.startsWith('/admin/')
  );
}

/** Returns the Supabase client for the current context (path/host). Use this so admin and user tabs keep separate sessions. */
export function getSupabase(): SupabaseClient | null {
  return isAdminContext() ? supabaseAdmin : supabaseMain;
}

/** @deprecated Use getSupabase() for auth so admin/user sessions stay separate. Legacy export for code that must read once at load. */
export const supabase = supabaseMain;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}
