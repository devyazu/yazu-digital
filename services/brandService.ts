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

function normalizeWebsite(website: string): string {
  const raw = String(website || '').trim();
  if (!raw) return '';
  return raw
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
    .trim()
    .toLowerCase();
}

async function hasDuplicateBrand(userId: string, name: string, excludeId?: string): Promise<boolean> {
  if (!supabase) return false;
  const normalized = name.trim().toLowerCase();
  if (!normalized) return false;
  const { data, error } = await supabase
    .from('workspaces')
    .select('id, name')
    .eq('user_id', userId);
  if (error || !Array.isArray(data)) return false;
  return data.some((row) => {
    const sameId = excludeId && row.id === excludeId;
    return !sameId && String(row.name || '').trim().toLowerCase() === normalized;
  });
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
  const cleanName = String(payload.name ?? '').trim() || 'New Brand';
  const cleanWebsite = normalizeWebsite(String(payload.website ?? ''));
  const duplicate = await hasDuplicateBrand(userId, cleanName);
  if (duplicate) return { data: null, error: new Error('Bu marka adi zaten mevcut') };
  const { data, error } = await supabase
    .from('workspaces')
    .insert({
      user_id: userId,
      name: cleanName,
      website: cleanWebsite,
    })
    .select()
    .single();
  if (error) return { data: null, error };
  return { data: rowToBrand(data as WorkspaceRow), error: null };
}

export async function updateBrand(
  userId: string,
  workspaceId: string,
  payload: { name?: string; website?: string }
): Promise<{ data: Brand | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  const cleanName = String(payload.name ?? '').trim();
  if (!cleanName) return { data: null, error: new Error('Marka adi bos olamaz') };
  const duplicate = await hasDuplicateBrand(userId, cleanName, workspaceId);
  if (duplicate) return { data: null, error: new Error('Bu marka adi zaten mevcut') };
  const cleanWebsite = normalizeWebsite(String(payload.website ?? ''));
  const { data, error } = await supabase
    .from('workspaces')
    .update({ name: cleanName, website: cleanWebsite })
    .eq('id', workspaceId)
    .eq('user_id', userId)
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
