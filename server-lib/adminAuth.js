/**
 * Admin JWT doğrulama: Bearer token → getUser → admin_users kontrolü.
 * @returns Promise<{ caller: User, supabaseAdmin: SupabaseClient } | null>
 *   null dönerse response zaten gönderilmiştir (401/403).
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

function send(res, status, body) {
  if (typeof res?.setHeader === 'function') res.setHeader('Content-Type', 'application/json');
  if (typeof res?.status === 'function') return res.status(status).json(body);
  return res?.end?.(JSON.stringify(body));
}

export default async function requireAdmin(req, res) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
    send(res, 503, { error: 'Supabase not configured' });
    return null;
  }
  const authHeader = req?.headers?.authorization ?? req?.headers?.Authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    send(res, 401, { error: 'Authorization required' });
    return null;
  }
  const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: userData, error: userError } = await supabaseAnon.auth.getUser(token);
  const caller = userData?.user;
  if (userError || !caller?.email) {
    send(res, 401, { error: 'Invalid or expired session' });
    return null;
  }
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: adminRow } = await supabaseAdmin
    .from('admin_users')
    .select('email')
    .eq('email', caller.email)
    .maybeSingle();
  if (!adminRow) {
    send(res, 403, { error: 'Admin access required' });
    return null;
  }
  return { caller, supabaseAdmin };
}
