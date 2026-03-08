/**
 * Admin: Abonelik ürünleri – listele (GET), oluştur (POST), güncelle (PUT).
 * Ürünler veritabanında tutulur; oluşturma/güncellemede Stripe'da Product/Price oluşturulur/güncellenir.
 */
import Stripe from 'stripe';
import requireAdmin from '../../server-lib/adminAuth.js';

const VALID_TIERS = ['basic', 'pro', 'premium'];

function send(res, status, body) {
  if (typeof res?.setHeader === 'function') res.setHeader('Content-Type', 'application/json');
  if (typeof res?.status === 'function') return res.status(status).json(body);
  return res?.end?.(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (res?.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  const method = req?.method ?? req?.headers?.['x-vercel-forwarded-method'];
  if (method === 'OPTIONS') return res.status(200).end();
  if (!['GET', 'POST', 'PUT'].includes(method)) return send(res, 405, { error: 'Method not allowed' });

  const authResult = await requireAdmin(req, res);
  if (!authResult) return;
  const { supabaseAdmin } = authResult;

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (method !== 'GET' && !stripeSecret) {
    return send(res, 503, { error: 'STRIPE_SECRET_KEY is required to create or update products.' });
  }
  const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

  if (method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('subscription_products')
      .select('id, name, slug, tier, price_amount_cents, currency, stripe_product_id, stripe_price_id, is_active, sort_order, created_at, updated_at')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) {
      console.error('subscription_products list error:', error);
      return send(res, 500, { error: 'Failed to list products', detail: error?.message });
    }
    return send(res, 200, { products: data ?? [] });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return send(res, 400, { error: 'Invalid JSON body' });
  }

  if (method === 'POST') {
    const { name, slug, tier, price_amount_cents, currency } = body;
    if (!name || typeof name !== 'string' || !slug || typeof slug !== 'string') {
      return send(res, 400, { error: 'name and slug are required' });
    }
    if (!VALID_TIERS.includes(tier)) {
      return send(res, 400, { error: 'tier must be one of: ' + VALID_TIERS.join(', ') });
    }
    const cents = Math.max(0, Math.round(Number(price_amount_cents) || 0));
    const curr = (currency && typeof currency === 'string') ? currency.toLowerCase() : 'usd';

    const slugClean = slug.trim().toLowerCase().replace(/\s+/g, '-');
    const { data: existing } = await supabaseAdmin.from('subscription_products').select('id').eq('slug', slugClean).maybeSingle();
    if (existing) return send(res, 400, { error: 'A product with this slug already exists' });

    let stripeProductId = null;
    let stripePriceId = null;
    try {
      const product = await stripe.products.create({
        name: name.trim(),
        metadata: { tier, slug: slugClean },
      });
      stripeProductId = product.id;
      const price = await stripe.prices.create({
        product: stripeProductId,
        unit_amount: cents,
        currency: curr,
        recurring: { interval: 'month' },
        metadata: { tier, slug: slugClean },
      });
      stripePriceId = price.id;
    } catch (err) {
      console.error('Stripe create product/price error:', err);
      return send(res, 500, { error: 'Stripe error: ' + (err.message || 'Failed to create product/price') });
    }

    const now = new Date().toISOString();
    const { data: inserted, error } = await supabaseAdmin
      .from('subscription_products')
      .insert({
        name: name.trim(),
        slug: slugClean,
        tier,
        price_amount_cents: cents,
        currency: curr,
        stripe_product_id: stripeProductId,
        stripe_price_id: stripePriceId,
        is_active: true,
        sort_order: 0,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    if (error) {
      console.error('subscription_products insert error:', error);
      return send(res, 500, { error: 'Failed to save product', detail: error?.message });
    }
    return send(res, 200, { product: inserted });
  }

  if (method === 'PUT') {
    const { id, name, price_amount_cents, currency, is_active } = body;
    if (!id || typeof id !== 'string') return send(res, 400, { error: 'id is required' });

    const { data: row, error: fetchErr } = await supabaseAdmin
      .from('subscription_products')
      .select('id, name, slug, tier, stripe_product_id, stripe_price_id, price_amount_cents, currency')
      .eq('id', id)
      .single();
    if (fetchErr || !row) return send(res, 404, { error: 'Product not found' });

    const updates = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = String(name).trim();
    if (typeof is_active === 'boolean') updates.is_active = is_active;

    const newCents = price_amount_cents !== undefined ? Math.max(0, Math.round(Number(price_amount_cents) || 0)) : null;
    const newCurrency = currency !== undefined ? String(currency).toLowerCase() : null;

    if (newCents !== null || newCurrency !== null) {
      const cents = newCents !== null ? newCents : row.price_amount_cents;
      const curr = newCurrency || row.currency || 'usd';
      if (!row.stripe_product_id) return send(res, 400, { error: 'Product has no Stripe product; cannot update price.' });
      try {
        const price = await stripe.prices.create({
          product: row.stripe_product_id,
          unit_amount: cents,
          currency: curr,
          recurring: { interval: 'month' },
          metadata: { tier: row.tier || 'pro', slug: row.slug || row.id },
        });
        updates.stripe_price_id = price.id;
        updates.price_amount_cents = cents;
        updates.currency = curr;
      } catch (err) {
        console.error('Stripe create new price error:', err);
        return send(res, 500, { error: 'Stripe error: ' + (err.message || 'Failed to create price') });
      }
    }

    if (updates.name !== undefined && row.stripe_product_id) {
      try {
        await stripe.products.update(row.stripe_product_id, { name: updates.name });
      } catch (e) {
        console.warn('Stripe product name update failed:', e.message);
      }
    }

    if (Object.keys(updates).length <= 1) return send(res, 400, { error: 'No fields to update' });

    const { data: updated, error } = await supabaseAdmin
      .from('subscription_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('subscription_products update error:', error);
      return send(res, 500, { error: 'Failed to update product', detail: error?.message });
    }
    return send(res, 200, { product: updated });
  }

  return send(res, 405, { error: 'Method not allowed' });
}
