/**
 * Stripe price IDs and tier mapping. Set in Vercel env:
 * STRIPE_PRICE_BASIC, STRIPE_PRICE_PRO, STRIPE_PRICE_PREMIUM (monthly recurring price IDs from Stripe Dashboard).
 */
export const STRIPE_PRICE_IDS = {
  basic: process.env.STRIPE_PRICE_BASIC || '',
  pro: process.env.STRIPE_PRICE_PRO || '',
  premium: process.env.STRIPE_PRICE_PREMIUM || '',
};

/** Tier from Stripe price ID (for webhook). */
export function tierFromPriceId(priceId) {
  if (!priceId) return 'free';
  const e = Object.entries(STRIPE_PRICE_IDS).find(([, id]) => id === priceId);
  return e ? e[0] : 'free';
}

/** Credits and max_brands per tier (sync with types.ts TIER_DEFAULTS). */
export const TIER_DEFAULTS = {
  free: { creditsTotal: 1000, maxBrands: 1 },
  basic: { creditsTotal: 5000, maxBrands: 1 },
  pro: { creditsTotal: 15000, maxBrands: 3 },
  premium: { creditsTotal: 25000, maxBrands: 10 },
  enterprise: { creditsTotal: 100000, maxBrands: 50 },
};

export function getPriceIdForTier(tier) {
  const id = STRIPE_PRICE_IDS[tier];
  return id || null;
}
