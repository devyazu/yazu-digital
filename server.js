/**
 * Yerel geliştirme için API proxy sunucusu.
 * Gemini API anahtarını sadece sunucu tarafında tutar; istemci asla görmez.
 * Canlıda Vercel Serverless Function (api/generate.js) kullanılır.
 */
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.API_PORT || 3001;
const apiKey = process.env.GEMINI_API_KEY;

app.post('/api/generate', async (req, res) => {
  if (!apiKey) {
    return res.status(503).json({
      error: 'API Key is missing. Set GEMINI_API_KEY in .env.local',
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
    return res.json({ text });
  } catch (err) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({
      error: 'An error occurred while communicating with the AI. Please try again.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`[API] Proxy running at http://localhost:${PORT} (POST /api/generate)`);
});
