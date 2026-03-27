/**
 * AI içerik üretimi: İstekler /api/generate proxy'sine gider.
 * API anahtarı yalnızca sunucu tarafında (yerel server.js veya Vercel Function) kullanılır.
 */
const API_GENERATE = '/api/generate';
const API_TOOL_RUN = '/api/tools/run';

export const generateContent = async (
  prompt: string,
  systemInstruction: string
): Promise<string> => {
  try {
    const res = await fetch(API_GENERATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemInstruction }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message =
        typeof data.error === 'string'
          ? data.error
          : 'An error occurred while communicating with the AI. Please try again.';
      return message;
    }

    return typeof data.text === 'string' ? data.text : 'No response generated.';
  } catch (err) {
    console.error('Generate API Error:', err);
    return 'An error occurred while communicating with the AI. Please try again.';
  }
};

export interface ToolRunResult {
  toolId: string;
  cost: number;
  output: unknown;
  usage?: { latencyMs?: number };
}

export const runTool = async (params: {
  token: string;
  toolId: string;
  input: string;
  brandId?: string;
}): Promise<{ data: ToolRunResult | null; error: string | null }> => {
  try {
    const res = await fetch(API_TOOL_RUN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        toolId: params.toolId,
        input: params.input,
        brandId: params.brandId || null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { data: null, error: typeof data.error === 'string' ? data.error : 'Tool run failed' };
    }
    return { data: data as ToolRunResult, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error' };
  }
};
