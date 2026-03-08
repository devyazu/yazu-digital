/**
 * Create Stripe Checkout Session (new subscription) or upgrade existing subscription with proration.
 * POST body: { targetTier: 'pro' | 'premium' }
 * Headers: Authorization: Bearer <Supabase access_token>
 * Vercel env: STRIPE_SECRET_KEY, STRIPE_PRICE_PRO, STRIPE_PRICE_PREMIUM, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, APP_URL
 */
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import requireAuth from './lib/requireAuth.js';
import { getPriceIdForTier, TIER_DEFAULTS, STRIPE_PRICE_IDS } from './lib/stripeConfig.js';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const appUrl = process.env.APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

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
  const priceId = getPriceIdForTier(targetTier);
  if (!priceId) return send(res, 400, { error: `Price not configured for tier: ${targetTier}. Set STRIPE_PRICE_${targetTier.toUpperCase()}.` });

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      return send(res, 200, { updated: true, url: `${appUrl}/?billing=updated` });
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
      success_url: `${appUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?checkout=cancelled`,
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
    return send(res, 500, { error: err.message || 'Payment setup failed' });
  }
}
