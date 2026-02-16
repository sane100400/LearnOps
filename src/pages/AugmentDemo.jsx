import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Swords, Zap, Clock, Eye, EyeOff, Code, Lock,
  ChevronRight, RotateCcw, Trophy, Star, Target, Skull,
  Sparkles, ArrowLeft, Play, Send, HelpCircle, AlertTriangle,
  Flame, Snowflake, Shuffle, Layers, Timer, X, Check,
  Lightbulb, Hash, TrendingUp, TrendingDown, Dices
} from 'lucide-react'

// ─── AUGMENTS (18개) ───

const AUGMENTS = [
  // Buff (green) - 6개: 쉬워지지만 점수 배율 감소
  { id: 'hint-master', name: '힌트 마스터', desc: '모든 힌트가 무료로 공개됩니다', category: 'buff', tier: 'silver', icon: Lightbulb, scoreMultiplier: 0.7, effect: { freeHints: true } },
  { id: 'time-expand', name: '시간 팽창', desc: '제한 시간이 60초 추가됩니다', category: 'buff', tier: 'silver', icon: Clock, scoreMultiplier: 0.85, effect: { bonusTime: 60 } },
  { id: 'safety-net', name: '안전망', desc: '오답 시 1회 재시도 기회를 얻습니다', category: 'buff', tier: 'gold', icon: Shield, scoreMultiplier: 0.8, effect: { retries: 1 } },
  { id: 'code-lens', name: '코드 렌즈', desc: '취약한 코드 라인이 하이라이트됩니다', category: 'buff', tier: 'gold', icon: Eye, scoreMultiplier: 0.75, effect: { highlight: true } },
  { id: 'difficulty-down', name: '난이도 하향', desc: '더 쉬운 시나리오가 출제됩니다', category: 'buff', tier: 'prismatic', icon: TrendingDown, scoreMultiplier: 0.7, effect: { difficultyShift: -1 } },
  { id: 'auto-decode', name: '자동 디코딩', desc: '인코딩된 문자열이 자동으로 해독됩니다', category: 'buff', tier: 'silver', icon: Hash, scoreMultiplier: 0.8, effect: { autoDecode: true } },

  // Nerf (red) - 6개: 어려워지지만 점수 배율 증가
  { id: 'speed-demon', name: '스피드 데몬', desc: '제한 시간이 40% 감소합니다', category: 'nerf', tier: 'silver', icon: Flame, scoreMultiplier: 1.5, effect: { timeMultiplier: 0.6 } },
  { id: 'no-hints', name: '무힌트 도전', desc: '모든 힌트가 비활성화됩니다', category: 'nerf', tier: 'gold', icon: EyeOff, scoreMultiplier: 1.4, effect: { noHints: true } },
  { id: 'obfuscation', name: '코드 난독화', desc: '코드가 난독화되어 표시됩니다', category: 'nerf', tier: 'gold', icon: Code, scoreMultiplier: 1.6, effect: { obfuscate: true } },
  { id: 'pressure-cooker', name: '압력솥', desc: '시간이 50% 이하일 때 화면이 흔들립니다', category: 'nerf', tier: 'silver', icon: AlertTriangle, scoreMultiplier: 1.3, effect: { screenShake: true } },
  { id: 'difficulty-up', name: '난이도 상향', desc: '더 어려운 시나리오가 출제됩니다', category: 'nerf', tier: 'prismatic', icon: TrendingUp, scoreMultiplier: 1.8, effect: { difficultyShift: 1 } },
  { id: 'one-shot', name: '원샷 원킬', desc: '제출 기회가 단 1회뿐입니다', category: 'nerf', tier: 'prismatic', icon: Skull, scoreMultiplier: 2.0, effect: { maxSubmits: 1 } },

  // Wildcard (purple) - 6개: 독특한 트레이드오프
  { id: 'time-bank', name: '타임 뱅크', desc: '남은 시간이 다음 라운드로 이월됩니다', category: 'wildcard', tier: 'gold', icon: Timer, scoreMultiplier: 1.0, effect: { timeBank: true } },
  { id: 'double-or-nothing', name: '더블 오어 낫싱', desc: '정답 시 2배, 오답 시 0점', category: 'wildcard', tier: 'prismatic', icon: Dices, scoreMultiplier: 1.0, effect: { doubleOrNothing: true } },
  { id: 'scenario-swap', name: '시나리오 교체', desc: '챌린지 중 1회 다른 시나리오로 교체 가능', category: 'wildcard', tier: 'gold', icon: Shuffle, scoreMultiplier: 1.05, effect: { canSwap: true } },
  { id: 'hint-trade', name: '힌트 거래', desc: '힌트 사용 시 시간 30초 추가, 점수 -20%', category: 'wildcard', tier: 'silver', icon: Sparkles, scoreMultiplier: 1.1, effect: { hintTrade: true } },
  { id: 'combo-breaker', name: '콤보 브레이커', desc: '연속 정답 시 배율 +0.2씩 증가', category: 'wildcard', tier: 'gold', icon: Layers, scoreMultiplier: 1.0, effect: { comboBonus: true } },
  { id: 'mirror-match', name: '미러 매치', desc: '이전 라운드와 같은 카테고리 시나리오 출제', category: 'wildcard', tier: 'silver', icon: Target, scoreMultiplier: 1.05, effect: { mirrorMatch: true } },
]

// ─── SCENARIOS (5개) ───

const SCENARIOS = [
  {
    id: 'sqli-login',
    title: 'SQL Injection: 로그인 우회',
    category: 'sql-injection',
    difficulty: 1,
    timeLimit: 180,
    baseScore: 1000,
    briefing: '취약한 로그인 시스템이 발견되었습니다. SQL Injection을 이용하여 관리자 계정으로 로그인을 우회하세요.',
    code: `// server.js - Login Handler
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = \`SELECT * FROM users
    WHERE username = '\${username}'
    AND password = '\${password}'\`;

  db.query(query, (err, results) => {
    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.json({ success: false });
    }
  });
});`,
    obfuscatedCode: `// s.js - L Handler
app.post('/l', (r, s) => {
  const { u, p } = r.body;
  const q = \`SELECT * FROM t1
    WHERE c1 = '\${u}'
    AND c2 = '\${p}'\`;

  db.query(q, (e, x) => {
    if (x.length > 0) {
      s.json({ s: true, d: x[0] });
    } else {
      s.json({ s: false });
    }
  });
});`,
    hints: [
      '사용자 입력이 SQL 쿼리에 직접 삽입되는 부분을 찾아보세요.',
      "작은따옴표(')를 이용하면 SQL 구문을 조작할 수 있습니다.",
      "admin' OR '1'='1' -- 또는 admin'# 를 username에 입력하세요.",
    ],
    vulnerableLine: 3,
    answers: ["admin' OR '1'='1' --", "admin'#", "' OR 1=1 --", "admin' OR 1=1--", "' OR '1'='1"],
  },
  {
    id: 'log-analysis',
    title: '로그 분석: 침입 흔적 탐지',
    category: 'log-analysis',
    difficulty: 2,
    timeLimit: 240,
    baseScore: 1500,
    briefing: '서버 로그에서 의심스러운 활동을 탐지하세요. 공격자의 IP 주소를 찾아내야 합니다.',
    code: `[2024-03-15 14:22:01] INFO  GET /index.html 200 - 192.168.1.100
[2024-03-15 14:22:15] INFO  GET /about.html 200 - 192.168.1.100
[2024-03-15 14:23:01] WARN  GET /admin 403 - 10.0.0.55
[2024-03-15 14:23:02] WARN  GET /admin/login 403 - 10.0.0.55
[2024-03-15 14:23:03] WARN  POST /admin/login 401 - 10.0.0.55
[2024-03-15 14:23:04] WARN  POST /admin/login 401 - 10.0.0.55
[2024-03-15 14:23:05] WARN  POST /admin/login 401 - 10.0.0.55
[2024-03-15 14:23:06] ERROR POST /admin/login 401 - 10.0.0.55
[2024-03-15 14:23:07] ERROR POST /admin/login 401 - 10.0.0.55
[2024-03-15 14:23:08] WARN  GET /wp-admin 404 - 10.0.0.55
[2024-03-15 14:23:09] WARN  GET /phpmyadmin 404 - 10.0.0.55
[2024-03-15 14:23:10] WARN  GET /.env 404 - 10.0.0.55
[2024-03-15 14:25:00] INFO  GET /products 200 - 172.16.0.22
[2024-03-15 14:25:30] INFO  POST /api/search 200 - 172.16.0.22`,
    obfuscatedCode: `[T1] I  G /p1 2xx - IP_A
[T1] I  G /p2 2xx - IP_A
[T2] W  G /p3 4xx - IP_B
[T2] W  G /p4 4xx - IP_B
[T2] W  P /p4 4xx - IP_B
[T2] W  P /p4 4xx - IP_B
[T2] W  P /p4 4xx - IP_B
[T2] E  P /p4 4xx - IP_B
[T2] E  P /p4 4xx - IP_B
[T2] W  G /p5 4xx - IP_B
[T2] W  G /p6 4xx - IP_B
[T2] W  G /p7 4xx - IP_B
[T3] I  G /p8 2xx - IP_C
[T3] I  P /p9 2xx - IP_C`,
    hints: [
      '로그에서 반복적으로 실패(4xx)하는 요청 패턴을 찾아보세요.',
      '같은 IP에서 짧은 시간 간격으로 다수의 실패 요청이 발생하고 있습니다.',
      '공격자 IP는 10.0.0.55 입니다. brute force 공격과 디렉토리 스캔을 시도하고 있습니다.',
    ],
    vulnerableLine: 3,
    answers: ['10.0.0.55'],
  },
  {
    id: 'xss-stored',
    title: 'XSS: 저장형 크로스사이트 스크립팅',
    category: 'xss',
    difficulty: 2,
    timeLimit: 200,
    baseScore: 1200,
    briefing: '게시판 시스템에서 저장형 XSS 취약점을 발견하세요. 악성 스크립트가 실행될 수 있는 입력값을 찾아내세요.',
    code: `// board.js - 게시글 작성 API
app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;

  // 게시글 저장 (필터링 없음)
  db.run('INSERT INTO posts (title, content) VALUES (?, ?)',
    [title, content]);
  res.json({ success: true });
});

// 게시글 렌더링
app.get('/api/posts/:id', (req, res) => {
  db.get('SELECT * FROM posts WHERE id = ?', [req.params.id],
    (err, post) => {
      // innerHTML로 직접 렌더링
      res.send(\`
        <h1>\${post.title}</h1>
        <div>\${post.content}</div>
      \`);
  });
});`,
    obfuscatedCode: `// m.js - API
app.post('/a/p', (r, s) => {
  const { t, c } = r.body;
  db.run('INSERT INTO t1 (c1, c2) VALUES (?, ?)', [t, c]);
  s.json({ s: true });
});

app.get('/a/p/:i', (r, s) => {
  db.get('SELECT * FROM t1 WHERE id = ?', [r.params.i],
    (e, d) => {
      s.send(\`<h1>\${d.c1}</h1><div>\${d.c2}</div>\`);
  });
});`,
    hints: [
      '게시글 내용이 필터링 없이 저장되고 있습니다.',
      '게시글 렌더링 시 HTML 이스케이프 없이 직접 출력되고 있습니다.',
      "<script>alert('XSS')</script> 를 content에 삽입하면 스크립트가 실행됩니다.",
    ],
    vulnerableLine: 15,
    answers: ["<script>alert('XSS')</script>", '<script>alert("XSS")</script>', "<script>alert(1)</script>", "<img src=x onerror=alert('XSS')>", "<img src=x onerror=alert(1)>"],
  },
  {
    id: 'command-injection',
    title: 'Command Injection: 서버 명령 실행',
    category: 'command-injection',
    difficulty: 3,
    timeLimit: 220,
    baseScore: 1800,
    briefing: 'DNS 조회 도구에서 Command Injection 취약점을 발견하세요. 서버에서 임의 명령을 실행할 수 있는 입력값을 찾으세요.',
    code: `// dns-tool.js - DNS Lookup Service
const { exec } = require('child_process');

app.get('/api/dns', (req, res) => {
  const domain = req.query.domain;

  // 사용자 입력을 직접 명령어에 삽입
  exec(\`nslookup \${domain}\`, (error, stdout, stderr) => {
    if (error) {
      res.json({ error: stderr });
      return;
    }
    res.json({ result: stdout });
  });
});

// 의도된 사용: /api/dns?domain=example.com
// 실제 실행: nslookup example.com`,
    obfuscatedCode: `// d.js
const { exec: e } = require('child_process');

app.get('/a/d', (r, s) => {
  const d = r.query.d;
  e(\`cmd1 \${d}\`, (err, o, er) => {
    if (err) { s.json({ e: er }); return; }
    s.json({ r: o });
  });
});`,
    hints: [
      'exec() 함수에 사용자 입력이 직접 전달되고 있습니다.',
      '세미콜론(;)이나 파이프(|)를 이용하면 추가 명령을 실행할 수 있습니다.',
      'example.com; cat /etc/passwd 또는 example.com | ls 를 입력하세요.',
    ],
    vulnerableLine: 7,
    answers: ['example.com; cat /etc/passwd', '; cat /etc/passwd', '| ls', 'example.com | ls', '; ls', 'example.com; ls'],
  },
  {
    id: 'encoding-flag',
    title: 'Encoding: 숨겨진 플래그 해독',
    category: 'encoding',
    difficulty: 1,
    timeLimit: 150,
    baseScore: 800,
    briefing: '의심스러운 데이터에서 숨겨진 플래그를 해독하세요. 다양한 인코딩이 중첩되어 있습니다.',
    code: `// 의심스러운 설정 파일 발견
const config = {
  // Base64로 인코딩된 값
  secret: "TGVhcm5PcHN7ZW5jMGQxbmdfbWFzdGVyfQ==",

  // 참고: Base64 디코딩 방법
  // atob("TGVhcm5PcHN7ZW5jMGQxbmdfbWFzdGVyfQ==")
  // 또는: echo "TGVhcm5PcHN7ZW5jMGQxbmdfbWFzdGVyfQ==" | base64 -d

  // Hex로 인코딩된 힌트
  hint: "4c6561726e4f7073", // = "LearnOps"

  // ROT13 메모
  memo: "Guvf vf gur synt sbezng: YrnegBcf{...}"
  // ROT13("This is the flag format: LearnOps{...}")
};`,
    obfuscatedCode: `const c = {
  s: "VEdWaGNtNVBjSHRsYm1Nd1pERnVaMTl0WVhOMFpYSjk=",
  h: "NGM2NTYxNzI2ZTRmNzA3Mw==",
  m: "Guvf vf gur synt sbezng: YrnegBcf{...}"
};`,
    hints: [
      'secret 필드의 값은 Base64로 인코딩되어 있습니다.',
      'Base64 디코딩: atob() 또는 base64 -d 명령을 사용하세요.',
      '정답은 LearnOps{enc0d1ng_master} 입니다.',
    ],
    vulnerableLine: 4,
    answers: ['LearnOps{enc0d1ng_master}'],
  },
]

// ─── TIER / CATEGORY CONFIG ───

const TIER_CONFIG = {
  silver: { label: 'Silver', color: '#94A3B8', bg: 'rgba(148,163,184,0.15)', border: '#94A3B8', glow: '0 0 20px rgba(148,163,184,0.4)' },
  gold: { label: 'Gold', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', border: '#F59E0B', glow: '0 0 20px rgba(245,158,11,0.5)' },
  prismatic: { label: 'Prismatic', color: '#818CF8', bg: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(6,182,212,0.15))', border: '#818CF8', glow: '0 0 24px rgba(79,70,229,0.5), 0 0 48px rgba(6,182,212,0.2)' },
}

const CATEGORY_CONFIG = {
  buff: { label: 'Buff', color: '#10B981', icon: Shield },
  nerf: { label: 'Nerf', color: '#EF4444', icon: Swords },
  wildcard: { label: 'Wildcard', color: '#8B5CF6', icon: Sparkles },
}

const GRADE_CONFIG = {
  S: { min: 90, color: '#F59E0B', label: 'S', glow: '0 0 40px rgba(245,158,11,0.6)' },
  A: { min: 75, color: '#10B981', label: 'A', glow: '0 0 30px rgba(16,185,129,0.5)' },
  B: { min: 60, color: '#3B82F6', label: 'B', glow: '0 0 25px rgba(59,130,246,0.4)' },
  C: { min: 40, color: '#8B5CF6', label: 'C', glow: '0 0 20px rgba(139,92,246,0.3)' },
  D: { min: 0, color: '#64748B', label: 'D', glow: '0 0 15px rgba(100,116,139,0.3)' },
}

// ─── HELPER FUNCTIONS ───

function getGrade(percentage) {
  for (const [key, cfg] of Object.entries(GRADE_CONFIG)) {
    if (percentage >= cfg.min) return { grade: key, ...cfg }
  }
  return { grade: 'D', ...GRADE_CONFIG.D }
}

function pickAugments(round) {
  // 라운드에 따라 티어 가중치 조정
  const weights = {
    1: { silver: 5, gold: 3, prismatic: 1 },
    2: { silver: 3, gold: 4, prismatic: 2 },
    3: { silver: 1, gold: 3, prismatic: 5 },
  }
  const w = weights[round] || weights[1]

  const pool = []
  AUGMENTS.forEach(a => {
    const weight = w[a.tier] || 1
    for (let i = 0; i < weight; i++) pool.push(a)
  })

  // 카테고리 다양성 보장: 3장 중 최소 2개 다른 카테고리
  const shuffled = pool.sort(() => Math.random() - 0.5)
  const picked = []
  const usedIds = new Set()

  for (const a of shuffled) {
    if (usedIds.has(a.id)) continue
    if (picked.length >= 3) break
    // 3번째 카드는 아직 없는 카테고리 우선
    if (picked.length === 2) {
      const cats = new Set(picked.map(p => p.category))
      if (cats.size === 1 && a.category === picked[0].category) continue
    }
    picked.push(a)
    usedIds.add(a.id)
  }

  return picked
}

function pickScenario(round, activeAugments, usedScenarioIds) {
  let difficultyShift = 0
  activeAugments.forEach(a => {
    if (a.effect.difficultyShift) difficultyShift += a.effect.difficultyShift
  })

  // 미러 매치: 이전 라운드와 같은 카테고리
  const mirrorMatch = activeAugments.some(a => a.effect.mirrorMatch)
  let available = SCENARIOS.filter(s => !usedScenarioIds.includes(s.id))
  if (available.length === 0) available = [...SCENARIOS]

  if (mirrorMatch && usedScenarioIds.length > 0) {
    const lastUsed = SCENARIOS.find(s => s.id === usedScenarioIds[usedScenarioIds.length - 1])
    if (lastUsed) {
      const sameCat = available.filter(s => s.category === lastUsed.category)
      if (sameCat.length > 0) available = sameCat
    }
  }

  // 난이도 조정
  if (difficultyShift !== 0) {
    const targetDiff = Math.max(1, Math.min(3, round + difficultyShift))
    const matching = available.filter(s => s.difficulty === targetDiff)
    if (matching.length > 0) available = matching
  }

  return available[Math.floor(Math.random() * available.length)]
}

function calcScore(scenario, timeLeft, totalTime, hintsUsed, augments, correct) {
  const doubleOrNothing = augments.some(a => a.effect.doubleOrNothing)
  if (doubleOrNothing && !correct) return { total: 0, base: scenario.baseScore, timeBonus: 0, hintPenalty: 1, augmentMultiplier: 0, breakdown: 'Double or Nothing: 오답 → 0점' }

  const base = scenario.baseScore
  const timeBonus = Math.round(base * (timeLeft / totalTime) * 0.3)

  const freeHints = augments.some(a => a.effect.freeHints)
  const hintPenalty = freeHints ? 1 : Math.pow(0.9, hintsUsed)

  let augmentMultiplier = 1
  augments.forEach(a => { augmentMultiplier *= a.scoreMultiplier })
  if (doubleOrNothing && correct) augmentMultiplier *= 2

  const total = Math.round((base + timeBonus) * hintPenalty * augmentMultiplier)

  return { total, base, timeBonus, hintPenalty: Math.round(hintPenalty * 100) / 100, augmentMultiplier: Math.round(augmentMultiplier * 100) / 100, breakdown: null }
}

// ─── STYLE INJECTION COMPONENT ───

function AugmentDemoStyles() {
  useEffect(() => {
    if (document.querySelector('[data-augdemo-styles]')) return
    const el = document.createElement('style')
    el.setAttribute('data-augdemo-styles', '')
    el.textContent = `
      @keyframes augCardEnter {
        0% { opacity: 0; transform: translateY(120px) rotateY(180deg) scale(0.6); }
        60% { opacity: 1; transform: translateY(-10px) rotateY(0deg) scale(1.02); }
        100% { opacity: 1; transform: translateY(0) rotateY(0deg) scale(1); }
      }
      @keyframes augCardSelect {
        0% { transform: scale(1); }
        50% { transform: scale(1.08); }
        100% { transform: scale(1.05); }
      }
      @keyframes augCardReject {
        0% { opacity: 1; transform: scale(1); filter: none; }
        100% { opacity: 0.4; transform: scale(0.9); filter: grayscale(100%); }
      }
      @keyframes gradeReveal {
        0% { opacity: 0; transform: scale(0.3) rotateZ(-30deg); }
        50% { opacity: 1; transform: scale(1.2) rotateZ(10deg); }
        70% { transform: scale(0.95) rotateZ(-3deg); }
        100% { transform: scale(1) rotateZ(0deg); }
      }
      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(79,70,229,0.3); }
        50% { box-shadow: 0 0 40px rgba(79,70,229,0.6), 0 0 60px rgba(6,182,212,0.3); }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes timerPulse {
        0%, 100% { color: #EF4444; }
        50% { color: #FCA5A5; text-shadow: 0 0 10px rgba(239,68,68,0.5); }
      }
      @keyframes shakeScreen {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px) translateY(1px); }
        50% { transform: translateX(2px) translateY(-2px); }
        75% { transform: translateX(-1px) translateY(1px); }
      }
      @keyframes scoreCount {
        from { opacity: 0; transform: scale(0.5); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes prismaticBorder {
        0% { border-color: #4F46E5; }
        33% { border-color: #06B6D4; }
        66% { border-color: #8B5CF6; }
        100% { border-color: #4F46E5; }
      }
      @keyframes comboFlash {
        0% { background: rgba(245,158,11,0.3); }
        100% { background: transparent; }
      }
      .aug-card-enter { animation: augCardEnter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      .grade-reveal { animation: gradeReveal 1s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      .pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
      .slide-up { animation: slideUp 0.6s ease both; }
      .fade-in { animation: fadeIn 0.5s ease both; }
      .timer-pulse { animation: timerPulse 1s ease-in-out infinite; }
      .shake-screen { animation: shakeScreen 0.15s ease-in-out infinite; }
      .score-count { animation: scoreCount 0.5s ease both; }
      .prismatic-border { animation: prismaticBorder 3s linear infinite; }
    `
    document.head.appendChild(el)
    return () => {
      const existing = document.querySelector('[data-augdemo-styles]')
      if (existing) existing.remove()
    }
  }, [])
  return null
}

// ─── SUB-COMPONENTS ───

function IntroScreen({ onStart }) {
  return (
    <div style={s.introWrap}>
      <div className="slide-up" style={s.introCard}>
        <div style={s.introIcon}>
          <Swords size={48} style={{ color: '#4F46E5' }} />
        </div>
        <h1 style={s.introTitle}>Security Wargame</h1>
        <p style={s.introSubtitle}>증강 워게임 챌린지</p>
        <div style={s.introDesc}>
          <p>3라운드에 걸쳐 보안 챌린지를 수행합니다.</p>
          <p>매 라운드 시작 전, TFT 스타일의 <strong style={{ color: '#F59E0B' }}>증강</strong>을 선택하여</p>
          <p>챌린지의 난이도와 보상을 조절하세요.</p>
        </div>
        <div style={s.introRules}>
          <div style={s.ruleItem}>
            <Shield size={20} style={{ color: '#10B981', flexShrink: 0 }} />
            <span><strong>Buff</strong> — 쉬워지지만 점수 배율 감소</span>
          </div>
          <div style={s.ruleItem}>
            <Swords size={20} style={{ color: '#EF4444', flexShrink: 0 }} />
            <span><strong>Nerf</strong> — 어려워지지만 점수 배율 증가</span>
          </div>
          <div style={s.ruleItem}>
            <Sparkles size={20} style={{ color: '#8B5CF6', flexShrink: 0 }} />
            <span><strong>Wildcard</strong> — 독특한 트레이드오프</span>
          </div>
        </div>
        <button style={s.startBtn} onClick={onStart}
          onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(79,70,229,0.4)' }}
          onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = '' }}
        >
          <Play size={20} />
          게임 시작
        </button>
      </div>
    </div>
  )
}

function AugmentCard({ augment, index, selected, rejected, onSelect, entered }) {
  const tier = TIER_CONFIG[augment.tier]
  const cat = CATEGORY_CONFIG[augment.category]
  const CatIcon = cat.icon
  const AugIcon = augment.icon

  // 진입 애니메이션이 끝난 뒤에만 select/reject 적용 (충돌 방지)
  const className = [
    !entered ? 'aug-card-enter' : '',
    entered && selected ? 'aug-card-selected' : '',
    entered && rejected ? 'aug-card-rejected' : '',
    augment.tier === 'prismatic' && !rejected ? 'prismatic-border' : '',
  ].filter(Boolean).join(' ')

  const cardStyle = {
    ...s.augCard,
    ...(!entered ? { animationDelay: `${index * 0.25}s` } : {}),
    borderColor: selected ? tier.color : (rejected ? '#333' : tier.border),
    boxShadow: selected ? tier.glow : (rejected ? 'none' : '0 4px 20px rgba(0,0,0,0.3)'),
    background: rejected ? '#1a1a2e' : (augment.tier === 'prismatic' ? 'linear-gradient(135deg, rgba(79,70,229,0.12), rgba(6,182,212,0.12))' : tier.bg),
    cursor: (selected || rejected) ? 'default' : 'pointer',
    opacity: rejected ? 0.4 : 1,
    transform: selected ? 'scale(1.05)' : (rejected ? 'scale(0.9)' : 'scale(1)'),
    filter: rejected ? 'grayscale(100%)' : 'none',
    transition: entered ? 'all 0.4s ease' : 'none',
  }

  return (
    <div className={className} style={cardStyle} onClick={() => { if (!selected && !rejected) onSelect(augment) }}>
      <div style={{ ...s.augTierBadge, background: tier.color, color: augment.tier === 'silver' ? '#1e293b' : '#fff' }}>
        {tier.label}
      </div>
      <div style={{ ...s.augCatBadge, background: `${cat.color}20`, color: cat.color, border: `1px solid ${cat.color}40` }}>
        <CatIcon size={14} />
        {cat.label}
      </div>
      <div style={s.augIconWrap}>
        <AugIcon size={40} style={{ color: cat.color }} />
      </div>
      <h3 style={s.augName}>{augment.name}</h3>
      <p style={s.augDesc}>{augment.desc}</p>
      <div style={{ ...s.augMultiplier, color: augment.scoreMultiplier >= 1 ? '#10B981' : '#EF4444' }}>
        {augment.scoreMultiplier >= 1 ? '+' : ''}{Math.round((augment.scoreMultiplier - 1) * 100)}% 점수
      </div>
    </div>
  )
}

function AugmentSelectScreen({ round, onSelect, selectedAugments }) {
  const [cards, setCards] = useState([])
  const [selected, setSelected] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [entered, setEntered] = useState(false)
  const prevAugIdsRef = useRef([])

  // round만 의존 — 같은 라운드 안에서 카드 재생성 방지
  useEffect(() => {
    const usedIds = prevAugIdsRef.current
    let picks = pickAugments(round)
    picks = picks.filter(a => !usedIds.includes(a.id))
    if (picks.length < 3) {
      const extra = AUGMENTS.filter(a => !usedIds.includes(a.id) && !picks.find(p => p.id === a.id))
        .sort(() => Math.random() - 0.5)
      while (picks.length < 3 && extra.length > 0) picks.push(extra.shift())
    }
    setCards(picks.slice(0, 3))
    setSelected(null)
    setConfirmed(false)
    setEntered(false)

    // 카드 진입 애니메이션 완료 후 entered = true (0.25s * 2 + 0.8s)
    const timer = setTimeout(() => setEntered(true), 1400)
    return () => clearTimeout(timer)
  }, [round])

  // 이전 증강 id 목록을 ref로 추적 (의존성 배열 안정화)
  useEffect(() => {
    prevAugIdsRef.current = selectedAugments.map(a => a.id)
  }, [selectedAugments])

  const handleSelect = (augment) => {
    if (confirmed) return
    setSelected(augment.id)
  }

  const handleConfirm = () => {
    if (!selected) return
    setConfirmed(true)
    setTimeout(() => {
      const aug = cards.find(c => c.id === selected)
      onSelect(aug)
    }, 500)
  }

  return (
    <div style={s.augOverlay}>
      <div className="fade-in" style={s.augHeader}>
        <div style={s.roundBadge}>ROUND {round}</div>
        <h2 style={s.augTitle}>증강을 선택하세요</h2>
        <p style={s.augSubtitle}>선택한 증강은 이번 라운드와 이후 라운드에 영향을 줍니다</p>
      </div>
      <div style={s.augCardsWrap}>
        {cards.map((aug, i) => (
          <AugmentCard
            key={aug.id}
            augment={aug}
            index={i}
            selected={selected === aug.id}
            rejected={selected !== null && selected !== aug.id}
            onSelect={handleSelect}
            entered={entered}
          />
        ))}
      </div>
      {selected && !confirmed && (
        <div className="slide-up" style={s.confirmWrap}>
          <button style={s.confirmBtn} onClick={handleConfirm}>
            <Check size={20} />
            선택 확정
          </button>
        </div>
      )}
    </div>
  )
}

function ActiveAugmentPills({ augments }) {
  if (augments.length === 0) return null
  return (
    <div style={s.pillsWrap}>
      {augments.map(a => {
        const cat = CATEGORY_CONFIG[a.category]
        return (
          <div key={a.id} style={{ ...s.pill, background: `${cat.color}20`, border: `1px solid ${cat.color}40`, color: cat.color }}>
            <a.icon size={14} />
            {a.name}
          </div>
        )
      })}
    </div>
  )
}

function ChallengeScreen({ scenario, round, activeAugments, bankedTime, onComplete }) {
  const totalTime = (() => {
    let t = scenario.timeLimit
    activeAugments.forEach(a => {
      if (a.effect.bonusTime) t += a.effect.bonusTime
      if (a.effect.timeMultiplier) t = Math.round(t * a.effect.timeMultiplier)
    })
    t += (bankedTime || 0)
    return t
  })()

  const [timeLeft, setTimeLeft] = useState(totalTime)
  const [answer, setAnswer] = useState('')
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [submitCount, setSubmitCount] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [retriesLeft, setRetriesLeft] = useState(() => {
    const retryAug = activeAugments.find(a => a.effect.retries)
    return retryAug ? retryAug.effect.retries : 0
  })
  const [swapUsed, setSwapUsed] = useState(false)
  const [comboCount, setComboCount] = useState(0)
  const [gaveUp, setGaveUp] = useState(false)
  const timerRef = useRef(null)
  const inputRef = useRef(null)

  const hasObfuscate = activeAugments.some(a => a.effect.obfuscate)
  const hasHighlight = activeAugments.some(a => a.effect.highlight)
  const hasNoHints = activeAugments.some(a => a.effect.noHints)
  const hasFreeHints = activeAugments.some(a => a.effect.freeHints)
  const hasScreenShake = activeAugments.some(a => a.effect.screenShake)
  const hasAutoDecode = activeAugments.some(a => a.effect.autoDecode)
  const hasHintTrade = activeAugments.some(a => a.effect.hintTrade)
  const maxSubmits = (() => {
    const oneShot = activeAugments.find(a => a.effect.maxSubmits)
    return oneShot ? oneShot.effect.maxSubmits : 999
  })()
  const hasTimeBank = activeAugments.some(a => a.effect.timeBank)

  // Refs로 최신 값 추적 (타이머 stale closure 방지)
  const onCompleteRef = useRef(onComplete)
  const hintsRevealedRef = useRef(hintsRevealed)
  const hasTimeBankRef = useRef(hasTimeBank)
  onCompleteRef.current = onComplete
  hintsRevealedRef.current = hintsRevealed
  hasTimeBankRef.current = hasTimeBank

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          onCompleteRef.current(false, 0, totalTime, hintsRevealedRef.current, 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const revealHint = () => {
    if (hasNoHints) return
    if (hintsRevealed >= scenario.hints.length) return
    if (hasHintTrade) {
      setTimeLeft(prev => prev + 30)
    }
    setHintsRevealed(prev => prev + 1)
  }

  const handleSubmit = () => {
    if (!answer.trim()) return
    if (submitCount >= maxSubmits) {
      setFeedback({ type: 'error', message: '제출 횟수를 초과했습니다.' })
      return
    }

    const isCorrect = scenario.answers.some(a => {
      const norm = str => str.toLowerCase().replace(/\s+/g, '').trim()
      return norm(answer) === norm(a)
    })

    setSubmitCount(prev => prev + 1)

    if (isCorrect) {
      clearInterval(timerRef.current)
      setFeedback({ type: 'success', message: '정답입니다!' })
      setTimeout(() => {
        onComplete(true, timeLeft, totalTime, hasFreeHints ? 0 : hintsRevealed, hasTimeBank ? timeLeft : 0)
      }, 1200)
    } else {
      if (retriesLeft > 0) {
        setRetriesLeft(prev => prev - 1)
        setFeedback({ type: 'retry', message: `오답입니다. 재시도 기회 ${retriesLeft - 1}회 남음` })
        setAnswer('')
      } else if (submitCount + 1 >= maxSubmits) {
        clearInterval(timerRef.current)
        setFeedback({ type: 'error', message: '제출 횟수를 초과했습니다.' })
        setTimeout(() => {
          onComplete(false, timeLeft, totalTime, hasFreeHints ? 0 : hintsRevealed, hasTimeBank ? timeLeft : 0)
        }, 1200)
      } else {
        setFeedback({ type: 'error', message: '오답입니다. 다시 시도하세요.' })
        setAnswer('')
      }
    }
  }

  const handleGiveUp = () => {
    clearInterval(timerRef.current)
    setGaveUp(true)
    setFeedback({ type: 'giveup', message: `정답: ${scenario.answers[0]}` })
    setTimeout(() => {
      onComplete(false, timeLeft, totalTime, hasFreeHints ? 0 : hintsRevealed, hasTimeBank ? timeLeft : 0)
    }, 3000)
  }

  const isTimeLow = timeLeft <= totalTime * 0.5
  const shaking = hasScreenShake && isTimeLow

  const codeToDisplay = hasObfuscate ? scenario.obfuscatedCode : scenario.code
  const codeLines = codeToDisplay.split('\n')

  // 자동 디코딩: Base64 문자열 자동 변환
  const displayCode = hasAutoDecode ? codeToDisplay.replace(
    /[A-Za-z0-9+/]{20,}={0,2}/g,
    match => {
      try { return `${match} /* decoded: ${atob(match)} */` } catch { return match }
    }
  ) : codeToDisplay

  return (
    <div className={shaking ? 'shake-screen' : ''} style={s.challengeWrap}>
      {/* Top Bar */}
      <div style={s.topBar}>
        <div style={s.topBarLeft}>
          <span style={s.roundLabel}>R{round}</span>
          <span style={s.scenarioTitle}>{scenario.title}</span>
        </div>
        <div style={s.topBarCenter}>
          <ActiveAugmentPills augments={activeAugments} />
        </div>
        <div style={{ ...s.timerDisplay, ...(timeLeft <= 30 ? { color: '#EF4444' } : {}) }}
          className={timeLeft <= 15 ? 'timer-pulse' : ''}
        >
          <Clock size={18} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div style={s.challengeBody}>
        {/* Briefing */}
        <div className="slide-up" style={s.briefingCard}>
          <div style={s.briefingHeader}>
            <Target size={20} style={{ color: '#F59E0B' }} />
            <span style={{ fontWeight: 700, color: '#F59E0B' }}>미션 브리핑</span>
            <span style={s.diffBadge}>
              {'★'.repeat(scenario.difficulty)}{'☆'.repeat(3 - scenario.difficulty)}
            </span>
          </div>
          <p style={s.briefingText}>{scenario.briefing}</p>
        </div>

        {/* Code Display */}
        <div className="slide-up" style={{ ...s.codeWrap, animationDelay: '0.1s' }}>
          <div style={s.codeHeader}>
            <Code size={16} style={{ color: '#94A3B8' }} />
            <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
              {hasObfuscate ? '난독화된 코드' : '취약한 코드'}
            </span>
          </div>
          <pre style={s.codeBlock}>
            {displayCode.split('\n').map((line, i) => (
              <div key={i} style={{
                ...s.codeLine,
                ...(hasHighlight && i + 1 === scenario.vulnerableLine ? s.codeLineHighlight : {}),
              }}>
                <span style={s.lineNum}>{i + 1}</span>
                <span>{line}</span>
              </div>
            ))}
          </pre>
        </div>

        {/* Hints */}
        {!hasNoHints && (
          <div className="slide-up" style={{ ...s.hintsWrap, animationDelay: '0.2s' }}>
            <div style={s.hintsHeader}>
              <Lightbulb size={18} style={{ color: '#F59E0B' }} />
              <span style={{ fontWeight: 600 }}>힌트</span>
              {hasHintTrade && <span style={s.hintTradeLabel}>힌트 사용 시 +30초, 점수 -20%</span>}
            </div>
            <div style={s.hintsList}>
              {scenario.hints.map((hint, i) => (
                <div key={i} style={s.hintItem}>
                  {i < hintsRevealed ? (
                    <div className="fade-in" style={s.hintRevealed}>
                      <Lightbulb size={14} style={{ color: '#F59E0B', flexShrink: 0 }} />
                      <span>{hint}</span>
                    </div>
                  ) : (
                    <button style={{ ...s.hintBtn, ...(hasFreeHints ? { borderColor: '#10B981' } : {}) }} onClick={revealHint}
                      disabled={i !== hintsRevealed}
                    >
                      <Lock size={14} />
                      힌트 {i + 1} {hasFreeHints ? '(무료)' : `(-${(i + 1) * 10}%)`}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answer Input */}
        <div className="slide-up" style={{ ...s.answerWrap, animationDelay: '0.3s' }}>
          <div style={s.answerHeader}>
            <Send size={18} style={{ color: '#4F46E5' }} />
            <span style={{ fontWeight: 600 }}>답 제출</span>
            {maxSubmits < 999 && (
              <span style={s.submitLimit}>제출 {submitCount}/{maxSubmits}</span>
            )}
          </div>
          <div style={s.answerInputWrap}>
            <input
              ref={inputRef}
              type="text"
              style={s.answerInput}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
              placeholder="정답을 입력하세요..."
              disabled={submitCount >= maxSubmits}
            />
            <button style={s.submitBtn} onClick={handleSubmit} disabled={submitCount >= maxSubmits || !answer.trim()}>
              <Send size={16} />
              제출
            </button>
          </div>
          {feedback && (
            <div className="fade-in" style={{
              ...s.feedbackMsg,
              color: feedback.type === 'success' ? '#10B981' : (feedback.type === 'giveup' ? '#F59E0B' : (feedback.type === 'retry' ? '#F59E0B' : '#EF4444')),
              background: feedback.type === 'success' ? 'rgba(16,185,129,0.1)' : (feedback.type === 'giveup' ? 'rgba(245,158,11,0.1)' : (feedback.type === 'retry' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)')),
              ...(feedback.type === 'giveup' ? { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" } : {}),
            }}>
              {feedback.type === 'success' ? <Check size={16} /> : (feedback.type === 'giveup' ? <Eye size={16} /> : <X size={16} />)}
              {feedback.message}
            </div>
          )}

          {/* 포기 버튼 */}
          {!gaveUp && feedback?.type !== 'success' && (
            <button style={s.giveUpBtn} onClick={handleGiveUp}>
              <X size={14} />
              포기하고 정답 보기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function RoundResultScreen({ round, scenario, scoreResult, correct, selectedAugment, onNext }) {
  return (
    <div style={s.resultOverlay}>
      <div className="slide-up" style={s.roundResultCard}>
        <div style={s.roundResultHeader}>
          <span style={s.roundBadge}>ROUND {round}</span>
          <h2 style={{ ...s.roundResultTitle, color: correct ? '#10B981' : '#EF4444' }}>
            {correct ? '챌린지 클리어!' : '챌린지 실패'}
          </h2>
        </div>

        <div style={s.scenarioLabel}>{scenario.title}</div>

        <div style={s.scoreBreakdown}>
          <div style={s.breakdownRow}>
            <span>기본 점수</span>
            <span>{scoreResult.base}</span>
          </div>
          <div style={s.breakdownRow}>
            <span>시간 보너스</span>
            <span style={{ color: '#10B981' }}>+{scoreResult.timeBonus}</span>
          </div>
          <div style={s.breakdownRow}>
            <span>힌트 감점</span>
            <span style={{ color: scoreResult.hintPenalty < 1 ? '#EF4444' : '#94A3B8' }}>
              ×{scoreResult.hintPenalty}
            </span>
          </div>
          <div style={s.breakdownRow}>
            <span>증강 배율</span>
            <span style={{ color: scoreResult.augmentMultiplier >= 1 ? '#10B981' : '#EF4444' }}>
              ×{scoreResult.augmentMultiplier}
            </span>
          </div>
          {scoreResult.breakdown && (
            <div style={{ ...s.breakdownRow, color: '#F59E0B', fontStyle: 'italic' }}>
              <span>{scoreResult.breakdown}</span>
            </div>
          )}
          <div style={s.breakdownDivider} />
          <div style={{ ...s.breakdownRow, fontWeight: 700, fontSize: '1.2rem' }}>
            <span>라운드 점수</span>
            <span className="score-count" style={{ color: '#F59E0B' }}>{scoreResult.total}</span>
          </div>
        </div>

        <div style={s.selectedAugLabel}>
          선택한 증강: <span style={{ color: CATEGORY_CONFIG[selectedAugment.category].color, fontWeight: 700 }}>{selectedAugment.name}</span>
        </div>

        <button style={s.nextBtn} onClick={onNext}>
          {round < 3 ? (
            <>다음 라운드 <ChevronRight size={18} /></>
          ) : (
            <>최종 결과 보기 <Trophy size={18} /></>
          )}
        </button>
      </div>
    </div>
  )
}

function FinalResultScreen({ rounds, totalScore, maxPossibleScore, onRestart, onDashboard }) {
  const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0
  const gradeInfo = getGrade(percentage)

  return (
    <div style={s.finalOverlay}>
      <div className="slide-up" style={s.finalCard}>
        {/* Grade Badge */}
        <div className="grade-reveal" style={{ ...s.gradeBadge, background: gradeInfo.color, boxShadow: gradeInfo.glow }}>
          {gradeInfo.grade}
        </div>

        <h2 style={s.finalTitle}>워게임 완료!</h2>
        <div className="score-count" style={s.finalScore}>{totalScore}<span style={s.finalScoreUnit}>점</span></div>

        {/* Round Cards */}
        <div style={s.roundCards}>
          {rounds.map((r, i) => {
            const catColor = CATEGORY_CONFIG[r.augment.category].color
            return (
              <div key={i} className="slide-up" style={{ ...s.roundCard, animationDelay: `${0.3 + i * 0.15}s` }}>
                <div style={s.roundCardHeader}>
                  <span style={s.roundCardBadge}>R{i + 1}</span>
                  <span style={{ ...s.roundCardResult, color: r.correct ? '#10B981' : '#EF4444' }}>
                    {r.correct ? 'CLEAR' : 'FAIL'}
                  </span>
                </div>
                <div style={s.roundCardScenario}>{r.scenario.title}</div>
                <div style={s.roundCardAug}>
                  <r.augment.icon size={14} style={{ color: catColor }} />
                  <span style={{ color: catColor }}>{r.augment.name}</span>
                </div>
                <div style={s.roundCardScore}>{r.score.total}점</div>
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          <div style={s.statItem}>
            <span style={s.statLabel}>정답률</span>
            <span style={s.statValue}>{rounds.filter(r => r.correct).length}/{rounds.length}</span>
          </div>
          <div style={s.statItem}>
            <span style={s.statLabel}>누적 배율</span>
            <span style={s.statValue}>
              ×{rounds.reduce((acc, r) => acc * r.augment.scoreMultiplier, 1).toFixed(2)}
            </span>
          </div>
          <div style={s.statItem}>
            <span style={s.statLabel}>달성률</span>
            <span style={s.statValue}>{Math.round(percentage)}%</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={s.finalButtons}>
          <button style={s.restartBtn} onClick={onRestart}>
            <RotateCcw size={18} />
            다시 하기
          </button>
          <button style={s.dashboardBtn} onClick={onDashboard}>
            <ArrowLeft size={18} />
            대시보드
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───

export default function AugmentDemo() {
  const navigate = useNavigate()
  const [gamePhase, setGamePhase] = useState('intro') // intro | augment-select | challenge | round-result | final-result
  const [round, setRound] = useState(1)
  const [selectedAugments, setSelectedAugments] = useState([])
  const [currentScenario, setCurrentScenario] = useState(null)
  const [usedScenarioIds, setUsedScenarioIds] = useState([])
  const [rounds, setRounds] = useState([])
  const [currentRoundScore, setCurrentRoundScore] = useState(null)
  const [currentCorrect, setCurrentCorrect] = useState(false)
  const [bankedTime, setBankedTime] = useState(0)
  const [comboStreak, setComboStreak] = useState(0)

  const handleStart = () => {
    setGamePhase('augment-select')
  }

  const handleAugmentSelect = (augment) => {
    setSelectedAugments(prev => [...prev, augment])
    // 시나리오 선택
    const scenario = pickScenario(round, [...selectedAugments, augment], usedScenarioIds)
    setCurrentScenario(scenario)
    setUsedScenarioIds(prev => [...prev, scenario.id])
    setTimeout(() => setGamePhase('challenge'), 300)
  }

  const handleChallengeComplete = (correct, timeLeft, totalTime, hintsUsed, banked) => {
    // 콤보 계산
    let newCombo = correct ? comboStreak + 1 : 0
    setComboStreak(newCombo)

    // 콤보 브레이커 증강 효과
    let comboMultiplier = 1
    if (selectedAugments.some(a => a.effect.comboBonus) && newCombo > 1) {
      comboMultiplier = 1 + (newCombo - 1) * 0.2
    }

    const score = calcScore(currentScenario, timeLeft, totalTime, hintsUsed, selectedAugments, correct)
    score.total = Math.round(score.total * comboMultiplier)

    // 타임 뱅크
    if (banked > 0) setBankedTime(prev => prev + banked)

    setCurrentRoundScore(score)
    setCurrentCorrect(correct)
    setRounds(prev => [...prev, {
      round,
      scenario: currentScenario,
      augment: selectedAugments[selectedAugments.length - 1],
      score,
      correct,
    }])
    setGamePhase('round-result')
  }

  const handleNextRound = () => {
    if (round >= 3) {
      setGamePhase('final-result')
    } else {
      setRound(prev => prev + 1)
      setGamePhase('augment-select')
    }
  }

  const handleRestart = () => {
    setGamePhase('intro')
    setRound(1)
    setSelectedAugments([])
    setCurrentScenario(null)
    setUsedScenarioIds([])
    setRounds([])
    setCurrentRoundScore(null)
    setCurrentCorrect(false)
    setBankedTime(0)
    setComboStreak(0)
  }

  const totalScore = rounds.reduce((acc, r) => acc + r.score.total, 0)
  const maxPossibleScore = rounds.reduce((acc, r) => acc + r.scenario.baseScore * 1.3 * 2, 0) || 3000

  return (
    <div style={s.pageWrap}>
      <AugmentDemoStyles />
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft} onClick={() => navigate('/dashboard')} role="button" tabIndex={0}>
          <ArrowLeft size={18} />
          <span>대시보드로 돌아가기</span>
        </div>
        <div style={s.logo}>
          <Shield size={22} style={{ color: '#4F46E5' }} />
          <span style={s.logoText}>LearnOps</span>
        </div>
      </div>

      {/* Game Content */}
      {gamePhase === 'intro' && <IntroScreen onStart={handleStart} />}
      {gamePhase === 'augment-select' && (
        <AugmentSelectScreen
          round={round}
          onSelect={handleAugmentSelect}
          selectedAugments={selectedAugments}
        />
      )}
      {gamePhase === 'challenge' && currentScenario && (
        <ChallengeScreen
          scenario={currentScenario}
          round={round}
          activeAugments={selectedAugments}
          bankedTime={bankedTime}
          onComplete={handleChallengeComplete}
        />
      )}
      {gamePhase === 'round-result' && currentRoundScore && (
        <RoundResultScreen
          round={round}
          scenario={currentScenario}
          scoreResult={currentRoundScore}
          correct={currentCorrect}
          selectedAugment={selectedAugments[selectedAugments.length - 1]}
          onNext={handleNextRound}
        />
      )}
      {gamePhase === 'final-result' && (
        <FinalResultScreen
          rounds={rounds}
          totalScore={totalScore}
          maxPossibleScore={maxPossibleScore}
          onRestart={handleRestart}
          onDashboard={() => navigate('/dashboard')}
        />
      )}
    </div>
  )
}

// ─── STYLES ───

const s = {
  // Page
  pageWrap: { minHeight: '100vh', background: '#0a0a1a', color: '#E2E8F0', fontFamily: "'Inter', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif" },

  // Header
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 100 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s' },
  logo: { display: 'flex', alignItems: 'center', gap: '8px' },
  logoText: { fontSize: '1.1rem', fontWeight: 700, background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },

  // Intro
  introWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', padding: '24px' },
  introCard: { maxWidth: '560px', width: '100%', textAlign: 'center', padding: '48px 40px', background: 'rgba(255,255,255,0.04)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' },
  introIcon: { width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(79,70,229,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' },
  introTitle: { fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  introSubtitle: { color: '#94A3B8', fontSize: '1rem', marginBottom: '28px' },
  introDesc: { color: '#CBD5E1', lineHeight: 1.7, marginBottom: '28px', fontSize: '0.95rem' },
  introRules: { display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '32px' },
  ruleItem: { display: 'flex', alignItems: 'center', gap: '12px', color: '#CBD5E1', fontSize: '0.9rem' },
  startBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 36px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' },

  // Augment Select
  augOverlay: { position: 'fixed', inset: 0, top: '60px', background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px', backdropFilter: 'blur(8px)' },
  augHeader: { textAlign: 'center', marginBottom: '40px' },
  roundBadge: { display: 'inline-block', padding: '4px 16px', background: 'rgba(79,70,229,0.2)', color: '#818CF8', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '12px' },
  augTitle: { fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '8px' },
  augSubtitle: { color: '#94A3B8', fontSize: '0.9rem' },
  augCardsWrap: { display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '860px' },
  augCard: { width: '240px', minHeight: '340px', borderRadius: '16px', border: '2px solid', padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', transition: 'all 0.3s', perspective: '1000px' },
  augTierBadge: { position: 'absolute', top: '12px', right: '12px', padding: '2px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' },
  augCatBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '16px' },
  augIconWrap: { width: '72px', height: '72px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
  augName: { fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' },
  augDesc: { fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5, flex: 1, marginBottom: '12px' },
  augMultiplier: { fontSize: '0.9rem', fontWeight: 700, padding: '4px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' },
  confirmWrap: { marginTop: '32px' },
  confirmBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 32px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' },

  // Pills
  pillsWrap: { display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' },
  pill: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 },

  // Challenge
  challengeWrap: { minHeight: 'calc(100vh - 60px)', padding: '0' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: '8px' },
  topBarLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  topBarCenter: { flex: 1, display: 'flex', justifyContent: 'center' },
  roundLabel: { fontWeight: 700, color: '#818CF8', fontSize: '0.9rem' },
  scenarioTitle: { fontWeight: 600, color: '#E2E8F0', fontSize: '0.95rem' },
  timerDisplay: { display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '1.1rem', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: '#10B981' },

  challengeBody: { maxWidth: '800px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },

  // Briefing
  briefingCard: { padding: '20px', background: 'rgba(245,158,11,0.06)', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.15)' },
  briefingHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' },
  briefingText: { color: '#CBD5E1', lineHeight: 1.7, fontSize: '0.95rem' },
  diffBadge: { marginLeft: 'auto', color: '#F59E0B', fontSize: '0.85rem', letterSpacing: '2px' },

  // Code
  codeWrap: { borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' },
  codeHeader: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  codeBlock: { margin: 0, padding: '16px', background: '#0d1117', fontSize: '0.85rem', lineHeight: 1.7, overflowX: 'auto', fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" },
  codeLine: { display: 'flex', gap: '16px' },
  lineNum: { color: '#4a5568', minWidth: '28px', textAlign: 'right', userSelect: 'none', flexShrink: 0 },
  codeLineHighlight: { background: 'rgba(245,158,11,0.12)', borderLeft: '3px solid #F59E0B', marginLeft: '-3px', paddingLeft: '0' },

  // Hints
  hintsWrap: { padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' },
  hintsHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#E2E8F0' },
  hintTradeLabel: { marginLeft: 'auto', fontSize: '0.75rem', color: '#F59E0B', background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: '8px' },
  hintsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  hintItem: {},
  hintRevealed: { display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.5, padding: '8px 12px', background: 'rgba(245,158,11,0.06)', borderRadius: '8px' },
  hintBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94A3B8', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' },

  // Answer
  answerWrap: { padding: '20px', background: 'rgba(79,70,229,0.06)', borderRadius: '12px', border: '1px solid rgba(79,70,229,0.15)' },
  answerHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#E2E8F0' },
  submitLimit: { marginLeft: 'auto', fontSize: '0.8rem', color: '#EF4444', background: 'rgba(239,68,68,0.1)', padding: '2px 10px', borderRadius: '8px' },
  answerInputWrap: { display: 'flex', gap: '8px' },
  answerInput: { flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#E2E8F0', fontSize: '0.95rem', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", outline: 'none', transition: 'border-color 0.2s' },
  submitBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 20px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s', whiteSpace: 'nowrap' },
  feedbackMsg: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 },
  giveUpBtn: { display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-end', padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#64748B', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', marginTop: '4px' },

  // Round Result
  resultOverlay: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', padding: '24px' },
  roundResultCard: { maxWidth: '480px', width: '100%', padding: '40px 36px', background: 'rgba(255,255,255,0.04)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' },
  roundResultHeader: { marginBottom: '20px' },
  roundResultTitle: { fontSize: '1.6rem', fontWeight: 800 },
  scenarioLabel: { color: '#94A3B8', fontSize: '0.9rem', marginBottom: '24px' },
  scoreBreakdown: { textAlign: 'left', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '24px' },
  breakdownRow: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#CBD5E1', fontSize: '0.9rem' },
  breakdownDivider: { height: '1px', background: 'rgba(255,255,255,0.08)', margin: '10px 0' },
  selectedAugLabel: { color: '#94A3B8', fontSize: '0.85rem', marginBottom: '24px' },
  nextBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' },

  // Final Result
  finalOverlay: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', padding: '24px' },
  finalCard: { maxWidth: '600px', width: '100%', padding: '48px 40px', background: 'rgba(255,255,255,0.04)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' },
  gradeBadge: { width: '96px', height: '96px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2.8rem', fontWeight: 900, color: '#fff' },
  finalTitle: { fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '8px' },
  finalScore: { fontSize: '3rem', fontWeight: 900, color: '#F59E0B', marginBottom: '32px' },
  finalScoreUnit: { fontSize: '1.2rem', color: '#94A3B8', marginLeft: '4px' },

  roundCards: { display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' },
  roundCard: { flex: '1 1 160px', maxWidth: '180px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' },
  roundCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  roundCardBadge: { fontSize: '0.75rem', fontWeight: 700, color: '#818CF8' },
  roundCardResult: { fontSize: '0.75rem', fontWeight: 700 },
  roundCardScenario: { fontSize: '0.8rem', color: '#94A3B8', marginBottom: '8px', lineHeight: 1.3 },
  roundCardAug: { display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', fontSize: '0.75rem', marginBottom: '8px' },
  roundCardScore: { fontSize: '1.1rem', fontWeight: 700, color: '#F59E0B' },

  statsRow: { display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '32px', flexWrap: 'wrap' },
  statItem: { textAlign: 'center' },
  statLabel: { display: 'block', fontSize: '0.8rem', color: '#64748B', marginBottom: '4px' },
  statValue: { fontSize: '1.2rem', fontWeight: 700, color: '#E2E8F0' },

  finalButtons: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
  restartBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' },
  dashboardBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'transparent', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
}
