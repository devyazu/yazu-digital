import { createClient } from '@supabase/supabase-js';
import requireAuth from '../server-lib/requireAuth.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PER_PAGE = 100;
const MAX_PAGES = 20;

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

async function fetchAll(baseUrl, endpoint, key, secret) {
  const rows = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const chunk = await wooGet(baseUrl, `${endpoint}?per_page=${PER_PAGE}&page=${page}`, key, secret);
    if (!Array.isArray(chunk) || chunk.length === 0) break;
    rows.push(...chunk);
    if (chunk.length < PER_PAGE) break;
  }
  return rows;
}

async function connectAction({ auth, body, supabaseAdmin, res }) {
  const workspaceId = String(body.workspaceId || '').trim();
  const siteUrl = normalizeSiteUrl(body.siteUrl);
  const consumerKey = String(body.consumerKey || '').trim();
  const consumerSecret = String(body.consumerSecret || '').trim();
  if (!workspaceId || !siteUrl || !consumerKey || !consumerSecret) {
    return send(res, 400, { error: 'workspaceId, siteUrl, consumerKey, consumerSecret required' });
  }

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

async function syncAction({ auth, body, supabaseAdmin, res }) {
  const workspaceId = String(body.workspaceId || '').trim();
  if (!workspaceId) return send(res, 400, { error: 'workspaceId required' });

  const { data: conn } = await supabaseAdmin
    .from('woo_connections')
    .select('workspace_id, user_id, site_url, consumer_key, consumer_secret')
    .eq('workspace_id', workspaceId)
    .eq('user_id', auth.userId)
    .maybeSingle();
  if (!conn) return send(res, 404, { error: 'WooCommerce connection not found' });

  try {
    const [products, orders] = await Promise.all([
      fetchAll(conn.site_url, '/wp-json/wc/v3/products', conn.consumer_key, conn.consumer_secret),
      fetchAll(conn.site_url, '/wp-json/wc/v3/orders', conn.consumer_key, conn.consumer_secret),
    ]);
    const nowIso = new Date().toISOString();

    if (products.length > 0) {
      const productRows = products.map((p) => ({
        user_id: auth.userId,
        workspace_id: workspaceId,
        external_id: String(p.id),
        name: p.name ?? null,
        status: p.status ?? null,
        price: p.price ?? null,
        stock_status: p.stock_status ?? null,
        raw: p,
        updated_at: nowIso,
      }));
      const { error: pErr } = await supabaseAdmin.from('woo_products').upsert(productRows, { onConflict: 'workspace_id,external_id' });
      if (pErr) return send(res, 500, { error: pErr.message || 'Could not save products' });
    }

    if (orders.length > 0) {
      const orderRows = orders.map((o) => ({
        user_id: auth.userId,
        workspace_id: workspaceId,
        external_id: String(o.id),
        status: o.status ?? null,
        currency: o.currency ?? null,
        total: o.total ?? null,
        customer_name: `${o.billing?.first_name || ''} ${o.billing?.last_name || ''}`.trim() || null,
        customer_email: o.billing?.email ?? null,
        raw: o,
        updated_at: nowIso,
      }));
      const { error: oErr } = await supabaseAdmin.from('woo_orders').upsert(orderRows, { onConflict: 'workspace_id,external_id' });
      if (oErr) return send(res, 500, { error: oErr.message || 'Could not save orders' });
    }

    const { error: connUpdateErr } = await supabaseAdmin
      .from('woo_connections')
      .update({ last_sync_at: nowIso, updated_at: nowIso })
      .eq('workspace_id', workspaceId)
      .eq('user_id', auth.userId);
    if (connUpdateErr) return send(res, 500, { error: connUpdateErr.message || 'Could not update connection sync time' });

    const { data: workspace } = await supabaseAdmin
      .from('workspaces')
      .select('integrations')
      .eq('id', workspaceId)
      .eq('user_id', auth.userId)
      .maybeSingle();
    const existing = Array.isArray(workspace?.integrations) ? workspace.integrations : [];
    const next = [
      ...existing.filter((i) => i?.id !== 'woo'),
      { id: 'woo', name: 'WooCommerce', type: 'store', iconName: 'ShoppingBag', isConnected: true, lastSync: nowIso },
    ];
    await supabaseAdmin.from('workspaces').update({ integrations: next }).eq('id', workspaceId).eq('user_id', auth.userId);

    return send(res, 200, { synced: true, products: products.length, orders: orders.length, lastSync: nowIso });
  } catch (e) {
    return send(res, 400, { error: e instanceof Error ? e.message : 'WooCommerce sync failed' });
  }
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
  const action = String(body.action || '').trim();

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  if (action === 'connect') return connectAction({ auth, body, supabaseAdmin, res });
  if (action === 'sync') return syncAction({ auth, body, supabaseAdmin, res });
  return send(res, 400, { error: 'Unsupported action. Use connect or sync.' });
}
