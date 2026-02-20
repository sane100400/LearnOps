import Docker from 'dockerode';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const LABEL_PREFIX = 'learnops';
const NETWORK_PREFIX = `${LABEL_PREFIX}-net`;
const CONTAINER_LIMITS = {
  Memory: 256 * 1024 * 1024, // 256MB
  NanoCpus: 500_000_000,     // 0.5 CPU
  PidsLimit: 100,
};

// Track active sessions:
// sessionId -> {
//   status: 'starting' | 'running' | 'stopping' | 'failed',
//   error, startedAt, readyAt, failedAt,
//   startPromise, network, networkName, containers
// }
const sessions = new Map();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runExec(container, cmd) {
  const exec = await container.exec({
    Cmd: cmd,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
  });

  const stream = await exec.start({ Detach: false, Tty: false });
  const output = await new Promise((resolve) => {
    let buf = '';
    stream.on('data', (chunk) => { buf += chunk.toString(); });
    stream.on('end', () => resolve(buf));
    stream.on('error', () => resolve(buf));
  });

  const info = await exec.inspect().catch(() => ({ ExitCode: 1 }));
  return { output, exitCode: info.ExitCode ?? 1 };
}

async function removeContainerSafe(container) {
  if (!container) return;
  try {
    await container.stop({ t: 2 }).catch(() => {});
    await container.remove({ force: true });
  } catch {
    // ignore cleanup failures
  }
}

async function removeNetworkSafe(network) {
  if (!network) return;
  try {
    await network.remove();
  } catch {
    // ignore cleanup failures
  }
}

/**
 * Remove orphan containers and network for a specific session name.
 * Called before provisioning to prevent 409 network name conflicts.
 */
async function cleanupSession(sessionId) {
  const networkName = `${NETWORK_PREFIX}-${sessionId}`;
  const containerNames = [
    `${LABEL_PREFIX}-db-${sessionId}`,
    `${LABEL_PREFIX}-app-${sessionId}`,
    `${LABEL_PREFIX}-attacker-${sessionId}`,
  ];

  // Force-remove containers first (must detach from network before removing it)
  for (const name of containerNames) {
    try {
      const c = docker.getContainer(name);
      await c.stop({ t: 2 }).catch(() => {});
      await c.remove({ force: true });
    } catch { /* not found — fine */ }
  }

  // Then remove the network
  try {
    const n = docker.getNetwork(networkName);
    await n.inspect(); // throws if not found
    await n.remove();
  } catch { /* not found — fine */ }
}

function buildSessionState(sessionId) {
  return {
    status: 'starting',
    error: null,
    startedAt: new Date().toISOString(),
    readyAt: null,
    failedAt: null,
    startPromise: null,
    network: null,
    networkName: `${NETWORK_PREFIX}-${sessionId}`,
    containers: {},
  };
}

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
 * Provision a lab environment for a session (blocking worker)
 */
async function provisionLab(sessionId, session) {
  await preflight();

  // Clean up any leftover resources from a previous failed attempt
  await cleanupSession(sessionId);

  const networkName = session.networkName;
  const labels = { 'managed-by': LABEL_PREFIX, session: sessionId };
  let network;
  let db;
  let vulnApp;
  let attacker;

  try {
    // 1. Create isolated network
    network = await docker.createNetwork({
      Name: networkName,
      Labels: labels,
      Internal: false,
    });

    // 2. DB container
    db = await docker.createContainer({
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
    });

    await db.start();

    // 3. Wait for DB readiness (app user can connect)
    const maxWaitMs = 120000;
    const t0 = Date.now();
    let dbReady = false;
    while (Date.now() - t0 < maxWaitMs) {
      try {
        const { exitCode } = await runExec(db, [
          'sh', '-c',
          'mysql -h127.0.0.1 -uvuln_user -pvuln_pass -D vuln_db -e "SELECT 1" 2>/dev/null',
        ]);
        if (exitCode === 0) {
          dbReady = true;
          console.log(`[docker] MySQL(app user) ready in ${Date.now() - t0}ms`);
          break;
        }
      } catch {
        // not ready yet
      }
      await sleep(2000);
    }

    if (!dbReady) {
      throw new Error('DB 초기화가 지연되어 실습 환경 시작에 실패했습니다. 잠시 후 다시 시도하세요.');
    }

    // 4. Get DB IP address
    const dbInfo = await db.inspect();
    const dbIp = dbInfo.NetworkSettings.Networks?.[networkName]?.IPAddress;
    if (!dbIp) {
      throw new Error('DB 컨테이너 IP를 가져올 수 없습니다.');
    }
    console.log(`[docker] DB IP: ${dbIp}`);

    // 5. Start app + attacker containers
    [vulnApp, attacker] = await Promise.all([
      docker.createContainer({
        Image: 'learnops-vuln-app',
        name: `${LABEL_PREFIX}-app-${sessionId}`,
        Labels: labels,
        Env: [
          `DB_HOST=${dbIp}`,
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

    await Promise.all([vulnApp.start(), attacker.start()]);

    session.network = network;
    session.containers = { attacker, vulnApp, db };
    session.status = 'running';
    session.error = null;
    session.readyAt = new Date().toISOString();
    session.failedAt = null;
  } catch (err) {
    await Promise.allSettled([
      removeContainerSafe(attacker),
      removeContainerSafe(vulnApp),
      removeContainerSafe(db),
    ]);
    await removeNetworkSafe(network);

    session.status = 'failed';
    session.error = err.message;
    session.failedAt = new Date().toISOString();
    throw err;
  }
}

/**
 * Start a lab environment asynchronously.
 * Returns immediately so HTTP handlers can respond without waiting for Docker startup.
 */
export function startLab(sessionId) {
  const existing = sessions.get(sessionId);

  if (existing) {
    if (existing.status === 'running') return { status: 'running' };
    if (existing.status === 'starting') return { status: 'starting' };
    if (existing.status === 'stopping') return { status: 'stopping' };
    // 'failed' -> clean up and retry
    sessions.delete(sessionId);
  }

  const session = buildSessionState(sessionId);
  sessions.set(sessionId, session);

  session.startPromise = provisionLab(sessionId, session)
    .catch((err) => {
      console.error(`[docker] start failed: session=${sessionId}`, err.message);
    })
    .finally(() => {
      session.startPromise = null;
    });

  return { status: 'starting' };
}

function getSessionMeta(session) {
  return {
    status: session.status,
    error: session.error,
    startedAt: session.startedAt,
    readyAt: session.readyAt,
    failedAt: session.failedAt,
  };
}

/**
 * Stop and remove a lab environment
 */
export async function stopLab(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return { status: 'not_running' };

  session.status = 'stopping';
  session.error = null;
  const { network, containers = {} } = session;

  for (const name of ['attacker', 'vulnApp', 'db']) {
    const container = containers[name];
    if (!container) continue;
    try { await container.stop({ t: 2 }); } catch { /* already stopped */ }
    try { await container.remove({ force: true }); } catch { /* already removed */ }
  }

  try { await network?.remove(); } catch { /* already removed */ }

  sessions.delete(sessionId);
  return { status: 'stopped' };
}

/**
 * Get lab status
 */
export function getLabStatus(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return { status: 'stopped', error: null };
  return getSessionMeta(session);
}

/**
 * Get the internal IP of the vuln-app container for proxying
 */
export async function getAppTarget(sessionId) {
  const session = sessions.get(sessionId);
  if (!session || session.status !== 'running' || !session.containers?.vulnApp) return null;

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
  if (!session || session.status !== 'running' || !session.containers?.attacker) {
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
