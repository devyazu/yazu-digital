import { supabase } from '../lib/supabase';
import type { Brand, Integration, SalesAgentConfig } from '../types';

const BRAND_LOGOS_BUCKET = 'brand-logos';
const LOGO_MAX_SIZE = 2 * 1024 * 1024; // 2MB

export interface WorkspaceRow {
  id: string;
  user_id: string;
  name: string;
  website: string;
  logo_url: string | null;
  integrations: unknown;
  sales_agent_config: unknown;
  created_at: string;
}

function rowToBrand(row: WorkspaceRow): Brand {
  const integrations = Array.isArray(row.integrations)
    ? (row.integrations as Integration[])
    : [];
  const salesAgentConfig =
    row.sales_agent_config && typeof row.sales_agent_config === 'object'
      ? (row.sales_agent_config as SalesAgentConfig)
      : undefined;
  return {
    id: row.id,
    name: row.name,
    website: row.website,
    logoUrl: row.logo_url ?? undefined,
    integrations,
    salesAgentConfig,
  };
}

export async function getBrands(userId: string): Promise<{ data: Brand[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not configured') };
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) return { data: [], error };
  const brands = (data ?? []).map((row) => rowToBrand(row as WorkspaceRow));
  return { data: brands, error: null };
}

export async function createBrand(
  userId: string,
  payload: { name?: string; website?: string }
): Promise<{ data: Brand | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabase
    .from('workspaces')
    .insert({
      user_id: userId,
      name: payload.name ?? 'New Brand',
      website: payload.website ?? '',
    })
    .select()
    .single();
  if (error) return { data: null, error };
  return { data: rowToBrand(data as WorkspaceRow), error: null };
}

export async function uploadBrandLogo(
  workspaceId: string,
  userId: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> {
  if (!supabase) return { url: null, error: new Error('Supabase not configured') };
  if (file.size > LOGO_MAX_SIZE) return { url: null, error: new Error('Logo en fazla 2MB olabilir') };
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  if (!['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
    return { url: null, error: new Error('Sadece JPG, PNG, GIF, WebP veya SVG') };
  }
  const path = `${userId}/${workspaceId}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from(BRAND_LOGOS_BUCKET)
    .upload(path, file, { upsert: true });
  if (uploadError) return { url: null, error: uploadError };
  const { data: urlData } = supabase.storage.from(BRAND_LOGOS_BUCKET).getPublicUrl(path);
  const url = urlData?.publicUrl ?? null;
  if (url) {
    const { error: updateError } = await supabase
      .from('workspaces')
      .update({ logo_url: url })
      .eq('id', workspaceId)
      .eq('user_id', userId);
    if (updateError) return { url, error: updateError };
  }
  return { url, error: null };
}
