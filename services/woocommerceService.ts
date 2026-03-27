export async function connectWooCommerce(params: {
  token: string;
  workspaceId: string;
  siteUrl: string;
  consumerKey: string;
  consumerSecret: string;
}): Promise<{ ok: boolean; error?: string; siteUrl?: string }> {
  try {
    const res = await fetch('/api/woocommerce/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        workspaceId: params.workspaceId,
        siteUrl: params.siteUrl,
        consumerKey: params.consumerKey,
        consumerSecret: params.consumerSecret,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.error || 'WooCommerce connect failed' };
    return { ok: true, siteUrl: data?.siteUrl };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Network error' };
  }
}

export async function syncWooCommerce(params: {
  token: string;
  workspaceId: string;
}): Promise<{ ok: boolean; error?: string; products?: number; orders?: number; lastSync?: string }> {
  try {
    const res = await fetch('/api/woocommerce/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({ workspaceId: params.workspaceId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.error || 'WooCommerce sync failed' };
    return {
      ok: true,
      products: Number(data?.products || 0),
      orders: Number(data?.orders || 0),
      lastSync: data?.lastSync || '',
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Network error' };
  }
}
