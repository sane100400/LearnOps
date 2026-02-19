import Docker from 'dockerode';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const LABEL_PREFIX = 'learnops';
const NETWORK_PREFIX = `${LABEL_PREFIX}-net`;
const CONTAINER_LIMITS = {
  Memory: 256 * 1024 * 1024, // 256MB
  NanoCpus: 500_000_000,     // 0.5 CPU
  PidsLimit: 100,
};

// Track active sessions: sessionId -> { network, containers: { attacker, vulnApp, db } }
const sessions = new Map();

/**
 * Clean up orphan containers and networks from previous runs
 */
export async function cleanupOrphans() {
  try {
    const containers = await docker.listContainers({
      all: true,
      filters: { label: [`managed-by=${LABEL_PREFIX}`] },
    });
    for (const info of containers) {
      const c = docker.getContainer(info.Id);
      try {
        if (info.State === 'running') await c.stop({ t: 2 });
        await c.remove({ force: true });
      } catch { /* already removed */ }
    }

    const networks = await docker.listNetworks({
      filters: { label: [`managed-by=${LABEL_PREFIX}`] },
    });
    for (const info of networks) {
      try {
        const n = docker.getNetwork(info.Id);
        await n.remove();
      } catch { /* already removed */ }
    }
    console.log('[docker] orphan cleanup done');
  } catch (err) {
    console.error('[docker] orphan cleanup error:', err.message);
  }
}

/**
 * Check if Docker is reachable and required images exist
 */
async function preflight() {
  try {
    await docker.ping();
  } catch {
    throw new Error('Docker Engine에 연결할 수 없습니다. Docker가 실행 중인지 확인하세요.');
  }

  const requiredImages = ['learnops-vuln-db', 'learnops-vuln-app', 'learnops-attacker'];
  const images = await docker.listImages();
  const tags = images.flatMap((img) => img.RepoTags || []);

  const missing = requiredImages.filter(
    (name) => !tags.some((t) => t.startsWith(`${name}:`))
  );
  if (missing.length > 0) {
    throw new Error(
      `Docker 이미지가 없습니다: ${missing.join(', ')}. 먼저 "docker compose build" 를 실행하세요.`
    );
  }
}

/**
 * Start a lab environment for a session
 */
export async function startLab(sessionId) {
  if (sessions.has(sessionId)) {
    return { status: 'already_running' };
  }

  await preflight();

  const networkName = `${NETWORK_PREFIX}-${sessionId}`;
  const labels = { 'managed-by': LABEL_PREFIX, session: sessionId };

  // 1. Create isolated network
  const network = await docker.createNetwork({
    Name: networkName,
    Labels: labels,
    Internal: false,
  });

  // 2. 컨테이너 3개 동시 생성
  const [db, vulnApp, attacker] = await Promise.all([
    docker.createContainer({
      Image: 'learnops-vuln-db',
      name: `${LABEL_PREFIX}-db-${sessionId}`,
      Labels: labels,
      Env: [
        'MYSQL_ROOT_PASSWORD=rootpass',
        'MYSQL_DATABASE=vuln_db',
        'MYSQL_USER=vuln_user',
        'MYSQL_PASSWORD=vuln_pass',
      ],
      HostConfig: {
        ...CONTAINER_LIMITS,
        NetworkMode: networkName,
        CapDrop: ['ALL'],
        CapAdd: ['SETUID', 'SETGID', 'DAC_OVERRIDE', 'FOWNER', 'CHOWN'],
      },
      NetworkingConfig: {
        EndpointsConfig: { [networkName]: { Aliases: ['vuln-db'] } },
      },
    }),
    docker.createContainer({
      Image: 'learnops-vuln-app',
      name: `${LABEL_PREFIX}-app-${sessionId}`,
      Labels: labels,
      Env: [
        'DB_HOST=vuln-db',
        'DB_USER=vuln_user',
        'DB_PASS=vuln_pass',
        'DB_NAME=vuln_db',
      ],
      HostConfig: {
        ...CONTAINER_LIMITS,
        NetworkMode: networkName,
        CapDrop: ['ALL'],
      },
      NetworkingConfig: {
        EndpointsConfig: { [networkName]: { Aliases: ['target-app'] } },
      },
    }),
    docker.createContainer({
      Image: 'learnops-attacker',
      name: `${LABEL_PREFIX}-attacker-${sessionId}`,
      Labels: labels,
      Tty: true,
      OpenStdin: true,
      Cmd: ['/bin/bash'],
      User: 'learner',
      WorkingDir: '/home/learner/workspace',
      HostConfig: {
        ...CONTAINER_LIMITS,
        NetworkMode: networkName,
        CapDrop: ['ALL'],
        CapAdd: ['NET_RAW'],
      },
      NetworkingConfig: {
        EndpointsConfig: { [networkName]: { Aliases: ['attacker'] } },
      },
    }),
  ]);

  // 3. DB를 먼저 시작하고 준비될 때까지 대기 (vuln-db DNS 별칭 등록 보장)
  await db.start();

  const maxWait = 30000;
  const t0 = Date.now();
  let dbReady = false;
  while (Date.now() - t0 < maxWait) {
    try {
      const exec = await db.exec({
        Cmd: ['mysqladmin', 'ping', '-h', 'localhost', '-uroot', '-prootpass', '--silent'],
        AttachStdout: true, AttachStderr: true,
      });
      const stream = await exec.start({ Detach: false, Tty: false });
      const output = await new Promise((resolve) => {
        let buf = '';
        stream.on('data', (chunk) => { buf += chunk.toString(); });
        stream.on('end', () => resolve(buf));
        stream.on('error', () => resolve(''));
        });
      if (output.includes('alive')) {
        dbReady = true;
        console.log(`[docker] MySQL ready in ${Date.now() - t0}ms`);
        break;
      }
    } catch { /* not ready */ }
    await new Promise((r) => setTimeout(r, 500));
  }

  // 4. DB 준비 후 vuln-app, attacker 시작
  await Promise.all([vulnApp.start(), attacker.start()]);

  sessions.set(sessionId, {
    network,
    containers: { attacker, vulnApp, db },
    networkName,
    dbReady,
  });

  return { status: 'started' };
}

/**
 * Stop and remove a lab environment
 */
export async function stopLab(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return { status: 'not_running' };

  const { network, containers } = session;

  // Stop and remove containers in reverse order
  for (const name of ['attacker', 'vulnApp', 'db']) {
    try {
      await containers[name].stop({ t: 2 });
    } catch { /* already stopped */ }
    try {
      await containers[name].remove({ force: true });
    } catch { /* already removed */ }
  }

  // Remove network
  try {
    await network.remove();
  } catch { /* already removed */ }

  sessions.delete(sessionId);
  return { status: 'stopped' };
}

/**
 * Get lab status
 */
export function getLabStatus(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return { status: 'stopped' };
  return { status: 'running' };
}

/**
 * Get the internal IP of the vuln-app container for proxying
 */
export async function getAppTarget(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  try {
    const info = await session.containers.vulnApp.inspect();
    const ip = info.NetworkSettings.Networks?.[session.networkName]?.IPAddress;
    if (ip) return `http://${ip}:80`;
  } catch { /* container gone */ }

  return null;
}

/**
 * Attach WebSocket to attacker container's bash PTY
 */
export async function attachWebSocket(sessionId, ws) {
  const session = sessions.get(sessionId);
  if (!session) {
    ws.send('\r\n[Error] Lab environment is not running. Click "환경 시작" first.\r\n');
    ws.close();
    return;
  }

  const { attacker } = session.containers;

  const exec = await attacker.exec({
    Cmd: ['/bin/bash'],
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    User: 'learner',
    WorkingDir: '/home/learner/workspace',
    Env: ['TERM=xterm-256color'],
  });

  const stream = await exec.start({
    hijack: true,
    stdin: true,
    Tty: true,
  });

  // Docker stream -> WebSocket
  stream.on('data', (chunk) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(chunk.toString('utf-8'));
    }
  });

  stream.on('end', () => {
    if (ws.readyState === ws.OPEN) {
      ws.send('\r\n[Session ended]\r\n');
      ws.close();
    }
  });

  // WebSocket -> Docker stream
  ws.on('message', (data) => {
    stream.write(data.toString());
  });

  ws.on('close', () => {
    stream.end();
  });

  ws.on('error', () => {
    stream.end();
  });
}
