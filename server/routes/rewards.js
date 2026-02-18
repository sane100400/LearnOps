import { Router } from 'express';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'rewards');
const SETTINGS_PATH = join(DATA_DIR, 'settings.json');
const ASSIGNMENTS_PATH = join(DATA_DIR, 'assignments.json');

const router = Router();

async function ensureDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readJson(filePath, fallback = []) {
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, data) {
  await ensureDir();
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/rewards/settings
router.get('/settings', async (_req, res) => {
  try {
    const settings = await readJson(SETTINGS_PATH);
    res.json(settings);
  } catch (err) {
    console.error('[rewards/settings GET]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rewards/settings — add or update
router.post('/settings', async (req, res) => {
  try {
    const item = req.body;
    const settings = await readJson(SETTINGS_PATH);

    if (item.id) {
      const idx = settings.findIndex(s => s.id === item.id);
      if (idx >= 0) {
        settings[idx] = { ...settings[idx], ...item };
      } else {
        settings.push(item);
      }
    } else {
      const maxId = settings.reduce((m, s) => Math.max(m, s.id || 0), 0);
      item.id = maxId + 1;
      settings.push(item);
    }

    await writeJson(SETTINGS_PATH, settings);
    res.json(item);
  } catch (err) {
    console.error('[rewards/settings POST]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/rewards/settings/:id
router.delete('/settings/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    let settings = await readJson(SETTINGS_PATH);
    settings = settings.filter(s => s.id !== id);
    await writeJson(SETTINGS_PATH, settings);
    res.json({ success: true });
  } catch (err) {
    console.error('[rewards/settings DELETE]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rewards/assignments
router.get('/assignments', async (_req, res) => {
  try {
    const assignments = await readJson(ASSIGNMENTS_PATH);
    res.json(assignments);
  } catch (err) {
    console.error('[rewards/assignments GET]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rewards/assignments — grant reward
router.post('/assignments', async (req, res) => {
  try {
    const item = req.body;
    const assignments = await readJson(ASSIGNMENTS_PATH);
    const maxId = assignments.reduce((m, a) => Math.max(m, a.id || 0), 0);
    item.id = maxId + 1;
    item.date = item.date || new Date().toISOString().slice(0, 10);
    assignments.push(item);
    await writeJson(ASSIGNMENTS_PATH, assignments);
    res.json(item);
  } catch (err) {
    console.error('[rewards/assignments POST]', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
