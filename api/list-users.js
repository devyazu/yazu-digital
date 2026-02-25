/**
 * Admin kullanıcı listesi. Sadece admin_users'da olan kullanıcılar çağırabilir.
 * Vercel env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY (veya VITE_SUPABASE_ANON_KEY)
 */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
    return res.status(503).json({ error: 'Supabase not configured' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: { user: caller }, error: userError } = await supabaseAnon.auth.getUser(token);
  if (userError || !caller?.email) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: adminRow } = await supabaseAdmin
    .from('admin_users')
    .select('email')
    .eq('email', caller.email)
    .maybeSingle();
  if (!adminRow) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 1000,
  });
  if (listError) {
    console.error('listUsers error:', listError);
    return res.status(500).json({ error: 'Could not list users' });
  }

  const { data: adminEmails } = await supabaseAdmin
    .from('admin_users')
    .select('email');
  const adminSet = new Set((adminEmails || []).map((r) => r.email));

  const users = (listData?.users || []).map((u) => ({
    id: u.id,
    email: u.email || '',
    created_at: u.created_at,
    is_admin: adminSet.has(u.email || ''),
  }));

  return res.status(200).json({ users });
};
