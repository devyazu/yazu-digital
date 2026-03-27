import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import requireAuth from '../../server-lib/requireAuth.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const COPY1_COST = 10;
const MAX_INPUT_CHARS = 4000;

function send(res, status, body) {
  if (typeof res?.setHeader === 'function') res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(body);
}

function buildCopy1Prompt({ input, brandName, brandWebsite, integrations }) {
  const connected = integrations.length > 0 ? integrations.join(', ') : 'none';
  return `
You are a senior direct-response copywriter.
Task: produce viral ad hooks and opening script lines.

Brand context:
- Brand: ${brandName || 'Unknown brand'}
- Website: ${brandWebsite || 'N/A'}
- Connected data sources: ${connected}

User brief:
${input}

Return JSON only with this exact shape:
{
  "hooks": [
    { "hook": "string", "trigger": "curiosity|fomo|self_interest|social_proof|pain_point", "reason": "string" }
  ],
  "scriptOpeners": [
    { "line": "string", "style": "direct|story|question" }
  ]
}

Rules:
- hooks must contain at least 10 unique entries
- scriptOpeners must contain exactly 3 entries
- keep language Turkish
- keep each hook under 120 characters
- keep each script opener under 180 characters
`.trim();
}

function parseJsonSafely(text) {
  if (!text || typeof text !== 'string') return null;
  try {
    return JSON.parse(text);
  } catch (_) {
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');
    if (first === -1 || last === -1 || last <= first) return null;
    const sliced = text.slice(first, last + 1);
    try {
      return JSON.parse(sliced);
    } catch {
      return null;
    }
  }
}

function normalizeCopy1Result(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const hooksRaw = Array.isArray(raw.hooks) ? raw.hooks : [];
  const openersRaw = Array.isArray(raw.scriptOpeners) ? raw.scriptOpeners : [];
  const hooks = hooksRaw
    .map((x) => ({
      hook: String(x?.hook || '').trim(),
      trigger: String(x?.trigger || '').trim(),
      reason: String(x?.reason || '').trim(),
    }))
    .filter((x) => x.hook && x.reason);
  const seen = new Set();
  const uniqueHooks = hooks.filter((h) => {
    const key = h.hook.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const scriptOpeners = openersRaw
    .map((x) => ({
      line: String(x?.line || '').trim(),
      style: String(x?.style || 'direct').trim() || 'direct',
    }))
    .filter((x) => x.line);
  if (uniqueHooks.length < 10) return null;
  if (scriptOpeners.length < 3) return null;
  return {
    hooks: uniqueHooks.slice(0, 10),
    scriptOpeners: scriptOpeners.slice(0, 3),
  };
}

async function runCopy1(ai, payload) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: payload.prompt,
    config: {
      temperature: 0.4,
      responseMimeType: 'application/json',
    },
  });
  const text = response?.text || '';
  return normalizeCopy1Result(parseJsonSafely(text));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });

  const auth = await requireAuth(req);
  if (!auth) return send(res, 401, { error: 'Authorization required' });

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
    return send(res, 503, { error: 'Server config missing (SUPABASE_* or GEMINI_API_KEY)' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return send(res, 400, { error: 'Invalid JSON body' });
  }
  const toolId = String(body.toolId || '').trim();
  const input = String(body.input || '').trim();
  const brandId = body.brandId ? String(body.brandId).trim() : null;
  if (toolId !== 'copy-1') return send(res, 400, { error: 'Only copy-1 is supported in this phase' });
  if (!input) return send(res, 400, { error: 'Input is required' });
  if (input.length > MAX_INPUT_CHARS) return send(res, 400, { error: `Input too long (max ${MAX_INPUT_CHARS})` });

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from('profiles')
    .select('id, tier, credits_total, credits_used')
    .eq('id', auth.userId)
    .maybeSingle();
  if (profileErr || !profile) return send(res, 404, { error: 'Profile not found' });

  const creditsTotal = Number(profile.credits_total || 0);
  const creditsUsed = Number(profile.credits_used || 0);
  if (creditsTotal - creditsUsed < COPY1_COST) {
    return send(res, 402, { error: 'Insufficient credits for this tool run' });
  }

  let brandName = '';
  let brandWebsite = '';
  let integrations = [];
  if (brandId) {
    const { data: workspace } = await supabaseAdmin
      .from('workspaces')
      .select('name, website, integrations')
      .eq('id', brandId)
      .eq('user_id', auth.userId)
      .maybeSingle();
    if (workspace) {
      brandName = workspace.name || '';
      brandWebsite = workspace.website || '';
      integrations = Array.isArray(workspace.integrations)
        ? workspace.integrations.filter((i) => i?.isConnected).map((i) => i?.name).filter(Boolean)
        : [];
    }
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const prompt = buildCopy1Prompt({ input, brandName, brandWebsite, integrations });
  const startedAt = Date.now();

  let structured = await runCopy1(ai, { prompt });
  if (!structured) {
    const retryPrompt = `${prompt}\n\nIMPORTANT: Strict JSON only. Do not include markdown.`;
    structured = await runCopy1(ai, { prompt: retryPrompt });
  }
  if (!structured) {
    await supabaseAdmin.from('tool_runs').insert({
      user_id: auth.userId,
      brand_id: brandId,
      tool_id: 'copy-1',
      status: 'failed',
      error_message: 'response_validation_failed',
      input_preview: input.slice(0, 500),
      cost_used: 0,
      latency_ms: Date.now() - startedAt,
    }).then(() => {}).catch(() => {});
    return send(res, 502, { error: 'Model response validation failed. Please retry.' });
  }

  const latencyMs = Date.now() - startedAt;
  const nextCreditsUsed = creditsUsed + COPY1_COST;
  const { error: creditErr } = await supabaseAdmin
    .from('profiles')
    .update({ credits_used: nextCreditsUsed })
    .eq('id', auth.userId);
  if (creditErr) return send(res, 500, { error: 'Could not update credits' });

  await supabaseAdmin.from('tool_runs').insert({
    user_id: auth.userId,
    brand_id: brandId,
    tool_id: 'copy-1',
    status: 'success',
    error_message: null,
    input_preview: input.slice(0, 500),
    cost_used: COPY1_COST,
    latency_ms: latencyMs,
  }).then(() => {}).catch(() => {});

  return send(res, 200, {
    toolId: 'copy-1',
    cost: COPY1_COST,
    output: structured,
    usage: {
      latencyMs,
    },
  });
}
