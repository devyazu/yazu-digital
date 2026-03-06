import { supabase } from '../lib/supabase';

export interface NotificationRow {
  id: string;
  title: string;
  body: string;
  created_at: string;
  created_by: string | null;
  target_type: string;
  target_user_ids: string[] | null;
}

export async function getNotificationsForUser(): Promise<{
  data: NotificationRow[];
  error: Error | null;
}> {
  if (!supabase) return { data: [], error: new Error('Supabase not configured') };
  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, body, created_at, created_by, target_type, target_user_ids')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return { data: [], error };
  return { data: (data ?? []) as NotificationRow[], error: null };
}
