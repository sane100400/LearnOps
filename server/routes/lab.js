import { Router } from 'express';
import http from 'http';
import { startLab, stopLab, getLabStatus, getAppTarget } from '../docker.js';

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
  res.json(getLabStatus(sessionId));
});

// Reverse proxy to vuln-app container
router.all('/proxy', proxyHandler);
router.all('/proxy/*', proxyHandler);

async function proxyHandler(req, res) {
  const sessionId = req.query.session || 'default';
  const target = await getAppTarget(sessionId);

  if (!target) {
    return res.status(502).json({ error: 'Lab environment is not running.' });
  }

  const targetUrl = new URL(target);
  const subPath = req.params[0] ? `/${req.params[0]}` : '/';

  // Build query string without 'session'
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(req.query).filter(([k]) => k !== 'session'))
  ).toString();

  // Raw body 읽기 (body parser를 건너뛰므로 직접 스트림에서 읽음)
  const contentType = req.headers['content-type'] || '';
  let bodyBuf = null;

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    bodyBuf = await new Promise((resolve) => {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => resolve(chunks.length > 0 ? Buffer.concat(chunks) : null));
      req.on('error', () => resolve(null));
    });
  }

  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || 80,
    path: subPath + (query ? `?${query}` : ''),
    method: req.method,
    headers: {
      'host': targetUrl.host,
      'user-agent': 'Mozilla/5.0',
      'accept': req.headers['accept'] || '*/*',
      'accept-language': req.headers['accept-language'] || 'ko',
    },
  };

  if (bodyBuf && bodyBuf.length > 0) {
    options.headers['content-type'] = contentType;
    options.headers['content-length'] = bodyBuf.length;
  }

  console.log(`[proxy] ${req.method} ${subPath} → ${target} (body: ${bodyBuf ? bodyBuf.length : 0} bytes)`);

  const proxyPrefix = `/api/lab/proxy`;

  const proxyReq = http.request(options, (proxyRes) => {
    const headers = { ...proxyRes.headers };

    // Rewrite Location headers (redirects) to route through proxy
    if (headers.location) {
      const loc = headers.location;
      if (loc.startsWith('/')) {
        headers.location = `${proxyPrefix}${loc}?session=${sessionId}`;
      }
    }

    // Remove headers that break iframe embedding
    delete headers['x-frame-options'];
    delete headers['content-security-policy'];

    const isHtml = (headers['content-type'] || '').includes('text/html');

    if (isHtml) {
      // Buffer HTML response to rewrite internal URLs
      delete headers['content-length'];
      delete headers['content-encoding'];
      res.writeHead(proxyRes.statusCode, headers);

      const chunks = [];
      proxyRes.on('data', (chunk) => chunks.push(chunk));
      proxyRes.on('end', () => {
        let html = Buffer.concat(chunks).toString('utf-8');
        // Rewrite absolute paths: action="/...", href="/...", src="/..."
        html = html.replace(
          /(action|href|src)=["']\/([^"']*?)["']/g,
          (_, attr, path) => `${attr}="${proxyPrefix}/${path}?session=${sessionId}"`,
        );
        res.end(html);
      });
    } else {
      res.writeHead(proxyRes.statusCode, headers);
      proxyRes.pipe(res);
    }
  });

  proxyReq.on('error', () => {
    if (!res.headersSent) {
      res.status(502).json({ error: 'Failed to connect to lab web app.' });
    }
  });

  if (bodyBuf) {
    proxyReq.end(bodyBuf);
  } else {
    proxyReq.end();
  }
}

export default router;
