import { Router } from 'express';
import { startLab, stopLab, getLabStatus } from '../docker.js';

const router = Router();

// POST /api/lab/start
router.post('/start', async (req, res) => {
  const sessionId = req.query.session || 'default';
  try {
    const result = await startLab(sessionId);
    res.json(result);
  } catch (err) {
    console.error('[lab/start]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/lab/stop
router.post('/stop', async (req, res) => {
  const sessionId = req.query.session || 'default';
  try {
    const result = await stopLab(sessionId);
    res.json(result);
  } catch (err) {
    console.error('[lab/stop]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/lab/status
router.get('/status', (req, res) => {
  const sessionId = req.query.session || 'default';
  res.json({ status: getLabStatus(sessionId) });
});

export default router;
