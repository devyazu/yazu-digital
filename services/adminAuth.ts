import { supabase } from '../lib/supabase';

export async function isAdmin(email: string | undefined): Promise<boolean> {
  if (!email || !supabase) return false;
  const { data } = await supabase
    .from('admin_users')
    .select('email')
    .eq('email', email)
    .maybeSingle();
  return Boolean(data);
}
