import { supabase } from '../lib/supabase';

export interface ChatArchiveRow {
  id: string;
  user_id: string;
  tool_id: string;
  tool_name: string;
  input: string;
  output: string;
  brand_id: string | null;
  created_at: string;
}

export async function saveToChatArchive(params: {
  userId: string;
  toolId: string;
  toolName: string;
  input: string;
  output: string;
  brandId?: string | null;
}): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { error } = await supabase.from('chat_archive').insert({
    user_id: params.userId,
    tool_id: params.toolId,
    tool_name: params.toolName,
    input: params.input,
    output: params.output,
    brand_id: params.brandId ?? null,
  });
  return { error: error ?? null };
}

export async function getChatArchive(userId: string, limit = 50): Promise<{ data: ChatArchiveRow[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not configured') };
  const { data, error } = await supabase
    .from('chat_archive')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data: (data as ChatArchiveRow[]) ?? [], error: error ?? null };
}
