import { Router } from 'express';

const router = Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// POST /api/ai/chat — general chat completion proxy
router.post('/chat', async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(503).json({ error: 'API key not configured' });
  }

  const { messages, temperature = 0.8, max_tokens = 500 } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature,
        max_tokens,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('[ai/chat]', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
