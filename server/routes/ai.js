import { Router } from 'express';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = join(__dirname, '..', 'data', 'results');
const CURRICULA_DIR = join(__dirname, '..', 'data', 'curricula');

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

// Sanitize userId to prevent path traversal
function sanitizeUserId(userId) {
  return String(userId).replace(/[^a-zA-Z0-9@._-]/g, '_');
}

// POST /api/ai/save-results — 레벨테스트 결과 MD 저장
router.post('/save-results', async (req, res) => {
  const { userId, field, analysis } = req.body;
  if (!userId || !analysis) {
    return res.status(400).json({ error: 'userId and analysis are required' });
  }

  const safeId = sanitizeUserId(userId);
  const interests = (analysis.interests || []).join(', ');
  const strengths = (analysis.strengths || []).map(s => `- ${s}`).join('\n');
  const improvements = (analysis.improvements || []).map(s => `- ${s}`).join('\n');
  const recommendations = (analysis.recommendations || [])
    .map((r, i) => `${i + 1}. **${r.title}**: ${r.desc}`)
    .join('\n');

  const md = `# 레벨테스트 결과

- **분야**: ${field || 'IT'}
- **프로필**: ${analysis.profileName || ''}
- **설명**: ${analysis.profileDesc || ''}
- **레벨**: ${analysis.level || ''}

## 관심 분야
${interests}

## 강점
${strengths}

## 보완점
${improvements}

## 추천 경로
${recommendations}
`;

  try {
    await mkdir(RESULTS_DIR, { recursive: true });
    await writeFile(join(RESULTS_DIR, `${safeId}.md`), md, 'utf-8');
    res.json({ success: true });
  } catch (err) {
    console.error('[ai/save-results]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/curriculum — MD 읽고 AI 커리큘럼 생성
router.post('/curriculum', async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(503).json({ error: 'API key not configured' });
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const safeId = sanitizeUserId(userId);
  const filePath = join(RESULTS_DIR, `${safeId}.md`);

  let mdContent;
  try {
    mdContent = await readFile(filePath, 'utf-8');
  } catch {
    return res.status(404).json({ error: '레벨테스트 결과를 찾을 수 없습니다.' });
  }

  const systemPrompt = `당신은 IT 학습 커리큘럼 설계 전문가입니다.
아래 레벨테스트 결과를 바탕으로 주차별 모듈 단위의 세분화된 맞춤형 학습 로드맵을 생성하세요.

${mdContent}

규칙:
- 사용자의 레벨에 맞는 난이도로 설계하세요
- 각 주차가 이전 주차를 기반으로 자연스럽게 이어지도록 구성하세요
- 6~10주차로 구성하세요
- 각 주차에 이론과 실습 모듈을 3~5개씩 포함하세요
- 모듈의 type은 "이론" 또는 "실습" 중 하나
- 반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요.

{
  "title": "커리큘럼 제목",
  "totalWeeks": 8,
  "weeks": [
    {
      "week": 1,
      "title": "주차 제목",
      "goal": "주차 학습 목표",
      "modules": [
        { "type": "이론", "title": "모듈명", "desc": "상세 설명", "time": "30분" },
        { "type": "실습", "title": "모듈명", "desc": "상세 설명", "time": "60분" }
      ]
    }
  ]
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: '분석 결과를 바탕으로 맞춤 학습 커리큘럼을 생성해주세요.' },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return res.status(500).json({ error: 'AI 응답이 비어 있습니다.' });
    }

    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) content = codeBlockMatch[1].trim();

    const curriculum = JSON.parse(content);
    res.json(curriculum);
  } catch (err) {
    console.error('[ai/curriculum]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/save-curriculum — 커리큘럼 저장
router.post('/save-curriculum', async (req, res) => {
  const { userId, curriculum } = req.body;
  if (!userId || !curriculum) {
    return res.status(400).json({ error: 'userId and curriculum are required' });
  }

  const safeId = sanitizeUserId(userId);

  try {
    await mkdir(CURRICULA_DIR, { recursive: true });
    await writeFile(
      join(CURRICULA_DIR, `${safeId}.json`),
      JSON.stringify(curriculum, null, 2),
      'utf-8',
    );
    res.json({ success: true });
  } catch (err) {
    console.error('[ai/save-curriculum]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ai/saved-curriculum?userId=xxx — 저장된 커리큘럼 조회
router.get('/saved-curriculum', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'userId query param is required' });
  }

  const safeId = sanitizeUserId(userId);
  const filePath = join(CURRICULA_DIR, `${safeId}.json`);

  try {
    const raw = await readFile(filePath, 'utf-8');
    res.json(JSON.parse(raw));
  } catch {
    return res.status(404).json({ error: '저장된 커리큘럼이 없습니다.' });
  }
});

export default router;
