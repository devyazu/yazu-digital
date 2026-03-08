/**
 * Public list of active subscription plans (for /start landing page).
 * GET only, no auth. Returns active subscription_products from DB.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function send(res, status, body) {
  if (typeof res?.setHeader === 'function') res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(body);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });

  if (!supabaseUrl || !supabaseServiceKey) {
    return send(res, 503, { error: 'Server not configured', plans: [] });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from('subscription_products')
    .select('id, name, slug, tier, price_amount_cents, currency, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('plans list error:', error);
    return send(res, 500, { error: 'Failed to load plans', plans: [] });
  }

  return send(res, 200, { plans: data ?? [] });
}
