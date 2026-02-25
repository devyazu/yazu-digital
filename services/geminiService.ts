/**
 * AI içerik üretimi: İstekler /api/generate proxy'sine gider.
 * API anahtarı yalnızca sunucu tarafında (yerel server.js veya Vercel Function) kullanılır.
 */
const API_GENERATE = '/api/generate';

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
