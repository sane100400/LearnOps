import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { URL } from 'url';
import labRouter from './routes/lab.js';
import { attachWebSocket, cleanupOrphans } from './docker.js';

const PORT = process.env.SERVER_PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const app = express();
const server = createServer(app);

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Rate limiter for lab API (10 requests per minute)
const labLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again later.' },
});

// Routes
app.use('/api/lab', labLimiter, labRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// WebSocket server for terminal
const wss = new WebSocketServer({ server, path: '/ws/terminal' });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const sessionId = url.searchParams.get('session') || 'default';

  console.log(`[ws] terminal connected: session=${sessionId}`);

  attachWebSocket(sessionId, ws).catch((err) => {
    console.error('[ws] attach error:', err.message);
    if (ws.readyState === ws.OPEN) {
      ws.send(`\r\n[Error] ${err.message}\r\n`);
      ws.close();
    }
  });
});

// Start
async function main() {
  await cleanupOrphans();

  server.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
  });
}

main().catch(console.error);
