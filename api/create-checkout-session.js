/**
 * Create Stripe Checkout Session (new subscription) or upgrade existing subscription with proration.
 * POST body: { targetTier: 'pro' | 'premium' }
 * Headers: Authorization: Bearer <Supabase access_token>
 * Vercel env: STRIPE_SECRET_KEY, STRIPE_PRICE_PRO, STRIPE_PRICE_PREMIUM, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, APP_URL
 */
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import requireAuth from '../server-lib/requireAuth.js';
import { getPriceIdForTier } from '../server-lib/stripeConfig.js';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
function send(res, status, body) {
  if (typeof res?.setHeader === 'function') res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(body);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });

  const auth = await requireAuth(req);
  if (!auth) return send(res, 401, { error: 'Authorization required' });
  const { userId, email } = auth;

  if (!stripeSecret || !supabaseUrl || !supabaseServiceKey) {
    return send(res, 503, { error: 'Server configuration error. Set STRIPE_SECRET_KEY, SUPABASE_* and APP_URL.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return send(res, 400, { error: 'Invalid JSON body' });
  }

  const targetTier = body.targetTier === 'premium' ? 'premium' : body.targetTier === 'basic' ? 'basic' : 'pro';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Use request origin so redirect goes back to where the user came from (e.g. app.yazu.digital), not Vercel deployment URL
  const origin = (req.headers.origin || req.headers.Origin || '').toString().replace(/\/$/, '');
  const baseUrl = origin && /^https:\/\//.test(origin) ? origin : (process.env.APP_URL || '').replace(/\/$/, '') || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  let priceId = null;
  const { data: dbProduct } = await supabase
    .from('subscription_products')
    .select('stripe_price_id')
    .eq('tier', targetTier)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (dbProduct?.stripe_price_id) priceId = dbProduct.stripe_price_id;
  if (!priceId) priceId = getPriceIdForTier(targetTier);
  if (!priceId) return send(res, 400, { error: `Price not configured for tier: ${targetTier}. Add a product in Admin → Abonelik or set STRIPE_PRICE_${targetTier.toUpperCase()}.` });

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, tier, stripe_customer_id, stripe_subscription_id, subscription_status')
    .eq('id', userId)
    .single();

  if (profileError || !profile) return send(res, 500, { error: 'Profile not found' });

  const stripe = new Stripe(stripeSecret);

  try {
    if (profile.stripe_subscription_id && profile.subscription_status === 'active') {
      const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
      const itemId = subscription.items?.data?.[0]?.id;
      if (!itemId) return send(res, 500, { error: 'Subscription has no item' });
      await stripe.subscriptions.update(profile.stripe_subscription_id, {
        items: [{ id: itemId, price: priceId }],
        proration_behavior: 'always_invoice',
        payment_behavior: 'pending_if_incomplete',
      });
      return send(res, 200, { updated: true, url: `${baseUrl}/?billing=updated` });
    }

    let customerId = profile.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email || undefined,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', userId);
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?checkout=cancelled`,
      client_reference_id: userId,
      subscription_data: {
        metadata: { supabase_user_id: userId },
        trial_period_days: undefined,
      },
      allow_promotion_codes: true,
    });

    return send(res, 200, { url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    const msg = err?.message || '';
    if (msg.includes('test mode key') && msg.includes('live mode')) {
      return send(res, 400, {
        error: 'Stripe test/live uyumsuzluğu: Vercel\'de test anahtarı (sk_test_...) kullanıyorsunuz ama paketler canlı modda oluşturulmuş. Çözüm: Stripe Dashboard\'da Test moduna geçin, Admin → Packages\'ta ilgili paketleri silip yeniden ekleyin (test fiyat ID\'leri oluşur). Veya canlı ödeme için Vercel\'de canlı Stripe anahtarı kullanın.',
      });
    }
    return send(res, 500, { error: err.message || 'Payment setup failed' });
  }
}
