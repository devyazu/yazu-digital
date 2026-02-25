/**
 * Vercel Serverless Function: Gemini API proxy.
 * GEMINI_API_KEY ortam değişkenini Vercel dashboard'dan ayarlayın.
 */
const { GoogleGenAI } = require('@google/genai');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'API Key is missing. Set GEMINI_API_KEY in Vercel Environment Variables.',
    });
  }

  const { prompt, systemInstruction } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "prompt"' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || '',
        temperature: 0.7,
      },
    });

    const text = response.text ?? 'No response generated.';
    return res.status(200).json({ text });
  } catch (err) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({
      error: 'An error occurred while communicating with the AI. Please try again.',
    });
  }
};
