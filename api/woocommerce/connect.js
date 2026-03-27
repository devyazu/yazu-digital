import { createClient } from '@supabase/supabase-js';
import requireAuth from '../../server-lib/requireAuth.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function send(res, status, body) {
  if (typeof res?.setHeader === 'function') res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(body);
}

function normalizeSiteUrl(siteUrl) {
  const raw = String(siteUrl || '').trim();
  if (!raw) return '';
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, '');
}

async function wooGet(baseUrl, path, key, secret) {
  const url = new URL(`${baseUrl}${path}`);
  url.searchParams.set('consumer_key', key);
  url.searchParams.set('consumer_secret', secret);
  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`WooCommerce API error (${res.status}): ${text || 'request failed'}`);
  }
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });

  const auth = await requireAuth(req);
  if (!auth) return send(res, 401, { error: 'Authorization required' });
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return send(res, 503, { error: 'Supabase config missing' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return send(res, 400, { error: 'Invalid JSON body' });
  }

  const workspaceId = String(body.workspaceId || '').trim();
  const siteUrl = normalizeSiteUrl(body.siteUrl);
  const consumerKey = String(body.consumerKey || '').trim();
  const consumerSecret = String(body.consumerSecret || '').trim();
  if (!workspaceId || !siteUrl || !consumerKey || !consumerSecret) {
    return send(res, 400, { error: 'workspaceId, siteUrl, consumerKey, consumerSecret required' });
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: workspace } = await supabaseAdmin
    .from('workspaces')
    .select('id, user_id, integrations')
    .eq('id', workspaceId)
    .eq('user_id', auth.userId)
    .maybeSingle();
  if (!workspace) return send(res, 404, { error: 'Workspace not found' });

  try {
    await wooGet(siteUrl, '/wp-json/wc/v3/products?per_page=1', consumerKey, consumerSecret);
  } catch (e) {
    return send(res, 400, { error: e instanceof Error ? e.message : 'WooCommerce connection failed' });
  }

  const nowIso = new Date().toISOString();
  const { error: connErr } = await supabaseAdmin
    .from('woo_connections')
    .upsert({
      workspace_id: workspaceId,
      user_id: auth.userId,
      site_url: siteUrl,
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      is_connected: true,
      updated_at: nowIso,
    }, { onConflict: 'workspace_id' });
  if (connErr) return send(res, 500, { error: connErr.message || 'Could not save Woo connection' });

  const existing = Array.isArray(workspace.integrations) ? workspace.integrations : [];
  const next = [
    ...existing.filter((i) => i?.id !== 'woo'),
    { id: 'woo', name: 'WooCommerce', type: 'store', iconName: 'ShoppingBag', isConnected: true, lastSync: 'connected' },
  ];
  const { error: updateErr } = await supabaseAdmin
    .from('workspaces')
    .update({ integrations: next })
    .eq('id', workspaceId)
    .eq('user_id', auth.userId);
  if (updateErr) return send(res, 500, { error: updateErr.message || 'Could not update integrations' });

  return send(res, 200, { connected: true, siteUrl });
}
