/**
 * Stripe webhook: verify signature, sync subscription to profiles (service role).
 * Uses micro buffer() for raw body (required for signature verification on Vercel).
 * Env: STRIPE_WEBHOOK_SECRET, STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { buffer } from 'micro';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { tierFromPriceId, TIER_DEFAULTS } from '../server-lib/stripeConfig.js';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Get raw body string (Vercel: use micro buffer so stream is not pre-consumed). */
async function getRawBody(req) {
  try {
    const buf = await buffer(req);
    return buf.toString('utf8');
  } catch (e) {
    console.error('getRawBody failed:', e);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  if (!rawBody) {
    console.error('Stripe webhook: raw body not available. Configure bodyParser: false for this route.');
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: 'Raw body required' });
  }

  const sig = req.headers['stripe-signature'] || req.headers['Stripe-Signature'];
  if (!webhookSecret || !sig) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: 'Missing webhook secret or signature' });
  }

  let event;
  try {
    event = Stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (!stripeSecret || !supabaseUrl || !supabaseServiceKey) {
    console.error('Stripe webhook: missing STRIPE_SECRET_KEY or Supabase env');
    res.setHeader('Content-Type', 'application/json');
    return res.status(503).json({ error: 'Server configuration error' });
  }

  const stripe = new Stripe(stripeSecret);
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const userId = sub.metadata?.supabase_user_id || sub.client_reference_id;
        if (!userId) {
          console.warn('Stripe webhook: subscription has no supabase_user_id in metadata');
          break;
        }
        const priceId = sub.items?.data?.[0]?.price?.id;
        let tier = 'free';
        if (priceId) {
          const { data: dbProduct } = await supabase
            .from('subscription_products')
            .select('tier')
            .eq('stripe_price_id', priceId)
            .maybeSingle();
          if (dbProduct?.tier) tier = dbProduct.tier;
          else tier = tierFromPriceId(priceId);
        }
        const defaults = TIER_DEFAULTS[tier] || TIER_DEFAULTS.free;
        const status = sub.status;
        const periodEnd = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null;

        const { error } = await supabase
          .from('profiles')
          .update({
            stripe_subscription_id: sub.id,
            stripe_customer_id: sub.customer,
            stripe_price_id: priceId || null,
            subscription_status: status,
            current_period_end: periodEnd,
            tier,
            credits_total: defaults.creditsTotal,
            max_brands: defaults.maxBrands,
          })
          .eq('id', userId);

        if (error) console.error('Supabase update failed:', error);
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const userId = sub.metadata?.supabase_user_id || sub.client_reference_id;
        if (!userId) break;

        const { error } = await supabase
          .from('profiles')
          .update({
            stripe_subscription_id: null,
            stripe_price_id: null,
            subscription_status: 'canceled',
            current_period_end: null,
            tier: 'free',
            credits_total: TIER_DEFAULTS.free.creditsTotal,
            max_brands: TIER_DEFAULTS.free.maxBrands,
          })
          .eq('id', userId);

        if (error) console.error('Supabase update failed:', error);
        break;
      }
      case 'invoice.paid':
        // Optional: log or send receipt
        break;
      case 'invoice.payment_failed':
        // Optional: notify user or downgrade after retries
        break;
      default:
        break;
    }
  } catch (err) {
    console.error('Stripe webhook handler error:', err);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'Webhook handler failed' });
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ received: true });
}
