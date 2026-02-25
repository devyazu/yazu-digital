import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  email_confirmed_at: string | null;
  created_at: string;
}

const CONFIRM_DEADLINE_HOURS = 3;

export async function getProfile(userId: string): Promise<{ profile: Profile | null; error: Error | null }> {
  if (!supabase) return { profile: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email_confirmed_at, created_at')
    .eq('id', userId)
    .maybeSingle();
  return { profile: data as Profile | null, error: error ?? null };
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
