/**
 * Admin kullanıcı listesi. Sadece admin_users'da olan kullanıcılar çağırabilir.
 * Vercel env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY (veya VITE_SUPABASE_ANON_KEY)
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

export default async function handler(req, res) {
  try {
    if (res?.setHeader) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    const method = req?.method ?? req?.headers?.['x-vercel-forwarded-method'];
    if (method === 'OPTIONS') {
      if (typeof res?.status === 'function') return res.status(200).end();
      return send(res, 200, {});
    }
    if (method !== 'GET') return send(res, 405, { error: 'Method not allowed' });

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
      return send(res, 503, { error: 'Supabase not configured' });
    }

    const authHeader = req?.headers?.authorization ?? req?.headers?.Authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return send(res, 401, { error: 'Authorization required' });
    }

    const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: userData, error: userError } = await supabaseAnon.auth.getUser(token);
    const caller = userData?.user;
    if (userError || !caller?.email) {
      return send(res, 401, { error: 'Invalid or expired session' });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: adminRow } = await supabaseAdmin
      .from('admin_users')
      .select('email')
      .eq('email', caller.email)
      .maybeSingle();
    if (!adminRow) {
      return send(res, 403, { error: 'Admin access required' });
    }

    const listResult = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const listError = listResult?.error;
    const listData = listResult?.data;
    if (listError) {
      console.error('listUsers error:', listError);
      return send(res, 500, { error: 'Could not list users', detail: listError?.message });
    }

    const rawList = listData?.users ?? (Array.isArray(listData) ? listData : []);
    const userList = Array.isArray(rawList) ? rawList : [];

    const { data: adminEmails } = await supabaseAdmin
      .from('admin_users')
      .select('email');
    const adminSet = new Set((adminEmails || []).map((r) => r?.email).filter(Boolean));

    const users = userList.map((u) => ({
      id: u?.id ?? '',
      email: u?.email ?? '',
      created_at: u?.created_at ?? null,
      is_admin: adminSet.has(u?.email ?? ''),
    }));

    return send(res, 200, { users });
  } catch (err) {
    console.error('list-users error:', err);
    return send(res, 500, {
      error: 'Server error',
      detail: err?.message ?? String(err),
    });
  }
}
