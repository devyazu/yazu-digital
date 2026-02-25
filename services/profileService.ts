import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  email_confirmed_at: string | null;
  created_at: string;
  full_name: string | null;
  company_name: string | null;
  job_title: string | null;
  avatar_url: string | null;
}

const CONFIRM_DEADLINE_HOURS = 3;
const AVATAR_BUCKET = 'avatars';
const AVATAR_MAX_SIZE = 1024 * 1024; // 1MB

export async function getProfile(userId: string): Promise<{ profile: Profile | null; error: Error | null }> {
  if (!supabase) return { profile: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email_confirmed_at, created_at, full_name, company_name, job_title, avatar_url')
    .eq('id', userId)
    .maybeSingle();
  return { profile: data as Profile | null, error: error ?? null };
}

export interface ProfileUpdate {
  full_name?: string | null;
  company_name?: string | null;
  job_title?: string | null;
  avatar_url?: string | null;
}

export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { error: error ?? null };
}

export async function uploadAvatar(userId: string, file: File): Promise<{ url: string | null; error: Error | null }> {
  if (!supabase) return { url: null, error: new Error('Supabase not configured') };
  if (file.size > AVATAR_MAX_SIZE) return { url: null, error: new Error('Dosya 1MB\'dan küçük olmalı') };
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  if (!['jpeg', 'jpg', 'png', 'gif', 'webp'].includes(ext)) return { url: null, error: new Error('Sadece JPG, PNG, GIF veya WebP') };
  const path = `${userId}/avatar.${ext}`;
  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, { upsert: true });
  if (uploadError) return { url: null, error: uploadError };
  const { data: urlData } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  const url = urlData?.publicUrl ?? null;
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
