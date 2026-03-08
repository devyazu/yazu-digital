import { supabase } from '../lib/supabase';

export type ProfileTier = 'free' | 'basic' | 'pro' | 'premium' | 'enterprise';

export interface Profile {
  id: string;
  email_confirmed_at: string | null;
  created_at: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  job_title: string | null;
  avatar_url: string | null;
  tier: ProfileTier;
  credits_total: number;
  credits_used: number;
  max_brands: number;
  /** Ordered list of favorite tool IDs for sidebar */
  favorite_tool_ids?: string[];
}

const CONFIRM_DEADLINE_HOURS = 3;
const AVATAR_BUCKET = 'avatars';
const AVATAR_MAX_SIZE = 1024 * 1024; // 1MB

export async function getProfile(userId: string): Promise<{ profile: Profile | null; error: Error | null }> {
  if (!supabase) return { profile: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email_confirmed_at, created_at, full_name, first_name, last_name, company_name, job_title, avatar_url, tier, credits_total, credits_used, max_brands')
    .eq('id', userId)
    .maybeSingle();
  const profile = data as Profile | null;
  if (profile) {
    if (profile.tier == null || profile.credits_total == null) {
      profile.tier = profile.tier ?? 'free';
      profile.credits_total = profile.credits_total ?? 1000;
      profile.credits_used = profile.credits_used ?? 0;
      profile.max_brands = profile.max_brands ?? 1;
    }
  }
  return { profile, error: error ?? null };
}

/** Load only favorite_tool_ids so profile fetch never fails if column is missing. Returns [] on error or missing column. */
export async function getFavoriteToolIds(userId: string): Promise<string[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('favorite_tool_ids')
    .eq('id', userId)
    .maybeSingle();
  if (error || data == null) return [];
  const raw = (data as { favorite_tool_ids?: unknown })?.favorite_tool_ids;
  return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : [];
}

export interface ProfileUpdate {
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  company_name?: string | null;
  job_title?: string | null;
  avatar_url?: string | null;
  tier?: ProfileTier | null;
  credits_total?: number | null;
  credits_used?: number | null;
  max_brands?: number | null;
  favorite_tool_ids?: string[];
}

export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { error: error ?? null };
}

/** Update only favorite_tool_ids. No-op if column does not exist (safe before migration). */
export async function updateFavoriteToolIds(userId: string, ids: string[]): Promise<void> {
  const { error } = await updateProfile(userId, { favorite_tool_ids: ids });
  if (error) {
    console.warn('updateFavoriteToolIds failed (run migration 013 if needed):', error.message);
  }
}

export async function uploadAvatar(userId: string, file: File): Promise<{ url: string | null; error: Error | null }> {
  if (!supabase) return { url: null, error: new Error('Supabase not configured') };
  if (file.size > AVATAR_MAX_SIZE) return { url: null, error: new Error('File must be under 1MB') };
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  if (!['jpeg', 'jpg', 'png', 'gif', 'webp'].includes(ext)) return { url: null, error: new Error('Only JPG, PNG, GIF or WebP') };
  const path = `${userId}/avatar.${ext}`;
  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, { upsert: true });
  if (uploadError) return { url: null, error: uploadError };
  const { data: urlData } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  const baseUrl = urlData?.publicUrl ?? null;
  const url = baseUrl ? `${baseUrl}?v=${Date.now()}` : null;
  if (url) {
    const { error: updateError } = await updateProfile(userId, { avatar_url: url });
    if (updateError) return { url, error: updateError };
  }
  return { url, error: null };
}

export function isConfirmRequired(profile: Profile | null): boolean {
  if (!profile) return false;
  if (profile.email_confirmed_at) return false;
  const created = new Date(profile.created_at).getTime();
  const deadline = created + CONFIRM_DEADLINE_HOURS * 60 * 60 * 1000;
  return Date.now() > deadline;
}

export function isWithinConfirmGrace(profile: Profile | null): boolean {
  if (!profile) return false;
  if (profile.email_confirmed_at) return false;
  const created = new Date(profile.created_at).getTime();
  const deadline = created + CONFIRM_DEADLINE_HOURS * 60 * 60 * 1000;
  return Date.now() <= deadline;
}
