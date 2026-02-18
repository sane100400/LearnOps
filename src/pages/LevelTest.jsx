import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Target,
  Loader2,
  MessageSquare,
  Send,
  Shield,
  Monitor,
  Server,
  Cloud,
  Database,
  Smartphone,
} from 'lucide-react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Button from '../components/Button'
import Card from '../components/Card'

/* =========================================================
   CONFIG
   ========================================================= */

const MAX_QUESTIONS = 12
const MIN_CHAT_MESSAGES = 5
const DIRECTION_PHASE_END = 8  // Q1~Q8: 방향 탐색, Q9~Q12: 지식 측정

/* =========================================================
   IT 분야 카테고리
   ========================================================= */

const IT_FIELDS = [
  { id: 'security', label: '사이버 보안', icon: Shield, desc: '모의해킹, 포렌식, 보안 관제, 취약점 분석', color: '#EF4444' },
  { id: 'frontend', label: '프론트엔드 개발', icon: Monitor, desc: 'React, Vue, UI/UX, 웹 퍼포먼스', color: '#3B82F6' },
  { id: 'backend', label: '백엔드 개발', icon: Server, desc: 'API 설계, DB, 서버 아키텍처, MSA', color: '#10B981' },
  { id: 'infra', label: '인프라/클라우드', icon: Cloud, desc: 'AWS, Docker, K8s, CI/CD, DevOps', color: '#F59E0B' },
  { id: 'data', label: '데이터/AI', icon: Database, desc: '데이터 엔지니어링, ML, 데이터 분석', color: '#8B5CF6' },
  { id: 'mobile', label: '모바일 개발', icon: Smartphone, desc: 'iOS, Android, React Native, Flutter', color: '#EC4899' },
]

/* =========================================================
   분야별 프롬프트 설정
   ========================================================= */

function getFieldPromptConfig(field) {
  const configs = {
    security: {
      expertRole: '사이버 보안 학습 성향 및 역량 분석 전문가',
      directionTopics: ['구체적인 학습 목표 (자격증, 직무, 프로젝트)', '학습 시간과 기간', '선호하는 학습 방식 (이론 vs 실습)', '관심 보안 세부 분야 (웹 해킹, 포렌식, 악성코드 분석, 클라우드 보안, 네트워크 침투)', '이전 학습 경험 (CTF, 온라인 강의, 독학)', '현재 IT 역량 수준 (프로그래밍, 리눅스, 네트워크)', '커리어 방향'],
      knowledgeAreas: ['네트워크 보안', '웹 보안', '시스템 해킹', '암호학', '포렌식'],
      analysisExpert: '사이버 보안 학습 분석 전문가',
      chatRole: '사이버 보안 학습 상담사',
      profileExample: '공격형 보안 전문가 지망생',
    },
    frontend: {
      expertRole: '프론트엔드 개발 학습 성향 및 역량 분석 전문가',
      directionTopics: ['구체적인 학습 목표 (취업, 포트폴리오, 사이드 프로젝트)', '학습 시간과 기간', '선호하는 학습 방식 (이론 vs 실습)', '관심 세부 분야 (React vs Vue vs Svelte, CSS 프레임워크, 번들러, 상태관리)', '이전 개발 경험 (HTML/CSS, JavaScript, 프로젝트 경험)', '현재 역량 수준 (프로그래밍 언어, 프레임워크 경험)', '커리어 방향'],
      knowledgeAreas: ['JavaScript', 'React', 'CSS/HTML', '웹 성능 최적화', '상태 관리'],
      analysisExpert: '프론트엔드 개발 학습 분석 전문가',
      chatRole: '프론트엔드 개발 학습 상담사',
      profileExample: '컴포넌트 아키텍트 지망생',
    },
    backend: {
      expertRole: '백엔드 개발 학습 성향 및 역량 분석 전문가',
      directionTopics: ['구체적인 학습 목표 (취업, 서비스 구축, 역량 강화)', '학습 시간과 기간', '선호하는 학습 방식 (이론 vs 실습)', '관심 세부 분야 (API 설계, DB 최적화, MSA, 메시지 큐, 인증/보안)', '이전 개발 경험 (언어, 프레임워크, DB)', '현재 역량 수준', '커리어 방향'],
      knowledgeAreas: ['API 설계', '데이터베이스', '서버 아키텍처', '인증/보안', '성능 최적화'],
      analysisExpert: '백엔드 개발 학습 분석 전문가',
      chatRole: '백엔드 개발 학습 상담사',
      profileExample: '서버 아키텍트 지망생',
    },
    infra: {
      expertRole: '인프라/클라우드 학습 성향 및 역량 분석 전문가',
      directionTopics: ['구체적인 학습 목표 (자격증, DevOps 전환, 인프라 운영)', '학습 시간과 기간', '선호하는 학습 방식 (이론 vs 실습)', '관심 세부 분야 (AWS vs GCP vs Azure, Docker/K8s, CI/CD, IaC, 모니터링)', '이전 운영 경험 (서버 관리, 네트워크, 클라우드)', '현재 역량 수준 (리눅스, 스크립팅, 네트워크)', '커리어 방향'],
      knowledgeAreas: ['클라우드 서비스', '컨테이너/K8s', 'CI/CD', '네트워크', 'IaC'],
      analysisExpert: '인프라/클라우드 학습 분석 전문가',
      chatRole: '인프라/클라우드 학습 상담사',
      profileExample: 'DevOps 엔지니어 지망생',
    },
    data: {
      expertRole: '데이터/AI 학습 성향 및 역량 분석 전문가',
      directionTopics: ['구체적인 학습 목표 (데이터 분석가, ML 엔지니어, 데이터 엔지니어)', '학습 시간과 기간', '선호하는 학습 방식 (이론 vs 실습)', '관심 세부 분야 (데이터 분석, ML/DL, 데이터 파이프라인, NLP, 컴퓨터 비전)', '이전 경험 (통계, Python, SQL, ML 프로젝트)', '현재 역량 수준 (수학/통계, 프로그래밍, 도구)', '커리어 방향'],
      knowledgeAreas: ['Python/SQL', '통계/수학', '머신러닝', '데이터 파이프라인', '시각화/분석'],
      analysisExpert: '데이터/AI 학습 분석 전문가',
      chatRole: '데이터/AI 학습 상담사',
      profileExample: 'ML 엔지니어 지망생',
    },
    mobile: {
      expertRole: '모바일 개발 학습 성향 및 역량 분석 전문가',
      directionTopics: ['구체적인 학습 목표 (앱 출시, 취업, 사이드 프로젝트)', '학습 시간과 기간', '선호하는 학습 방식 (이론 vs 실습)', '관심 세부 분야 (iOS/Swift vs Android/Kotlin vs 크로스플랫폼 React Native/Flutter)', '이전 개발 경험 (프로그래밍 언어, 앱 개발)', '현재 역량 수준', '커리어 방향'],
      knowledgeAreas: ['모바일 UI/UX', '네이티브 개발', '크로스플랫폼', '앱 아키텍처', '배포/운영'],
      analysisExpert: '모바일 개발 학습 분석 전문가',
      chatRole: '모바일 개발 학습 상담사',
      profileExample: '모바일 앱 개발자 지망생',
    },
  }
  return configs[field] || configs.security
}

/* =========================================================
   분야별 초기 질문 (첫 3문항은 고정 — 학습 방향 탐색 시드)
   ========================================================= */

function getInitialQuestions(field) {
  const questions = {
    security: [
      {
        type: 'single-with-text',
        question: '보안 학습을 시작하려는 이유가 무엇인가요?',
        options: ['취업/이직 준비', '현업 역량 강화', '개인적 호기심/흥미'],
      },
      {
        type: 'single-with-text',
        question: '현재 보안 관련 경험 수준은 어느 정도인가요?',
        options: ['완전 처음이에요 (IT 기초부터 시작)', '기본 개념은 알지만 실습 경험은 부족해요', '실무나 프로젝트 경험이 있어요 (CTF, 보안 업무 등)'],
      },
      {
        type: 'single-with-text',
        question: '보안 분야 중 가장 끌리는 방향이 있으신가요?',
        options: ['웹/앱 해킹 (버그바운티, 모의해킹)', '시스템/네트워크 보안 (침투테스트, 포렌식)', '아직 잘 모르겠어서 전반적으로 탐색하고 싶어요'],
      },
    ],
    frontend: [
      {
        type: 'single-with-text',
        question: '프론트엔드 개발을 시작하려는 이유가 무엇인가요?',
        options: ['취업/이직 준비', '현업 역량 강화', '개인적 호기심/사이드 프로젝트'],
      },
      {
        type: 'single-with-text',
        question: '현재 프론트엔드 개발 경험 수준은 어느 정도인가요?',
        options: ['완전 처음이에요 (HTML/CSS부터 시작)', 'HTML/CSS, JS 기초는 알지만 프레임워크는 처음이에요', 'React/Vue 등 프레임워크로 프로젝트 경험이 있어요'],
      },
      {
        type: 'single-with-text',
        question: '프론트엔드에서 가장 관심 있는 방향이 있으신가요?',
        options: ['UI/UX 중심 개발 (디자인 시스템, 인터랙션)', '웹 애플리케이션 개발 (SPA, SSR)', '아직 잘 모르겠어서 전반적으로 탐색하고 싶어요'],
      },
    ],
    backend: [
      {
        type: 'single-with-text',
        question: '백엔드 개발을 시작하려는 이유가 무엇인가요?',
        options: ['취업/이직 준비', '현업 역량 강화', '개인 서비스/프로젝트 구축'],
      },
      {
        type: 'single-with-text',
        question: '현재 백엔드 개발 경험 수준은 어느 정도인가요?',
        options: ['완전 처음이에요 (프로그래밍 기초부터 시작)', '언어/DB 기초는 알지만 서버 구축 경험은 부족해요', 'API 개발이나 서버 운영 경험이 있어요'],
      },
      {
        type: 'single-with-text',
        question: '백엔드에서 가장 관심 있는 방향이 있으신가요?',
        options: ['API 설계 및 서버 개발', 'DB 설계 및 데이터 모델링', '대규모 시스템 아키텍처 (MSA, 분산 시스템)'],
      },
    ],
    infra: [
      {
        type: 'single-with-text',
        question: '인프라/클라우드를 시작하려는 이유가 무엇인가요?',
        options: ['취업/이직 준비', '현업 역량 강화 (DevOps 전환)', '개인적 호기심/학습'],
      },
      {
        type: 'single-with-text',
        question: '현재 인프라/클라우드 경험 수준은 어느 정도인가요?',
        options: ['완전 처음이에요 (리눅스 기초부터 시작)', '리눅스/네트워크 기초는 알지만 클라우드는 처음이에요', '클라우드 서비스나 DevOps 실무 경험이 있어요'],
      },
      {
        type: 'single-with-text',
        question: '인프라/클라우드에서 가장 관심 있는 방향이 있으신가요?',
        options: ['클라우드 아키텍처 (AWS, GCP, Azure)', '컨테이너 오케스트레이션 (Docker, Kubernetes)', 'CI/CD 및 DevOps 파이프라인'],
      },
    ],
    data: [
      {
        type: 'single-with-text',
        question: '데이터/AI를 시작하려는 이유가 무엇인가요?',
        options: ['취업/이직 준비', '현업 역량 강화', '개인적 호기심/연구'],
      },
      {
        type: 'single-with-text',
        question: '현재 데이터/AI 경험 수준은 어느 정도인가요?',
        options: ['완전 처음이에요 (Python 기초부터 시작)', 'Python/SQL 기초는 알지만 분석 경험은 부족해요', 'ML 모델링이나 데이터 분석 프로젝트 경험이 있어요'],
      },
      {
        type: 'single-with-text',
        question: '데이터/AI에서 가장 관심 있는 방향이 있으신가요?',
        options: ['데이터 분석 및 시각화', '머신러닝/딥러닝 엔지니어링', '데이터 파이프라인/엔지니어링'],
      },
    ],
    mobile: [
      {
        type: 'single-with-text',
        question: '모바일 개발을 시작하려는 이유가 무엇인가요?',
        options: ['취업/이직 준비', '현업 역량 강화', '개인 앱 출시/사이드 프로젝트'],
      },
      {
        type: 'single-with-text',
        question: '현재 모바일 개발 경험 수준은 어느 정도인가요?',
        options: ['완전 처음이에요 (프로그래밍 기초부터 시작)', '프로그래밍 기초는 알지만 앱 개발은 처음이에요', '앱을 직접 만들어보거나 출시 경험이 있어요'],
      },
      {
        type: 'single-with-text',
        question: '모바일 개발에서 가장 관심 있는 방향이 있으신가요?',
        options: ['iOS 네이티브 개발 (Swift/SwiftUI)', 'Android 네이티브 개발 (Kotlin/Jetpack Compose)', '크로스플랫폼 (React Native, Flutter)'],
      },
    ],
  }
  return questions[field] || questions.security
}

/* =========================================================
   Backend AI Proxy Helper
   ========================================================= */

async function aiProxy(messages, temperature = 0.8, max_tokens = 500) {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, temperature, max_tokens }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() || null
  } catch {
    return null
  }
}

/* =========================================================
   OpenAI API — Adaptive Question Generation
   ========================================================= */

async function generateNextQuestion(history, field) {
  const config = getFieldPromptConfig(field)
  const historyText = history.map((h, i) =>
    `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`
  ).join('\n\n')

  const currentNum = history.length + 1
  const isDirectionPhase = currentNum <= DIRECTION_PHASE_END

  const directionTopicsList = config.directionTopics.map(t => `- ${t}`).join('\n')

  const directionGuidance = isDirectionPhase
    ? `현재는 **방향 탐색 단계** (${currentNum}/${DIRECTION_PHASE_END})입니다.
아직 파악하지 못한 정보를 우선적으로 질문하세요:
${directionTopicsList}

** 절대 지식 측정 문제(quiz 타입)를 내지 마세요. 방향 탐색 질문만 하세요.**
이전 답변에서 이미 파악된 정보는 건너뛰고, 아직 모르는 부분을 물어보세요.`
    : `현재는 **지식 측정 단계** (문항 ${currentNum}/${MAX_QUESTIONS})입니다.
사용자가 관심 있다고 한 분야에서 실제 지식 수준을 측정하는 4지선다 퀴즈를 출제하세요.
측정 가능한 지식 영역: ${config.knowledgeAreas.join(', ')}
- 반드시 quiz 타입을 사용하세요
- 너무 쉽거나 너무 어려운 문제는 피하세요
- 이전에 틀린 문제가 있다면 난이도를 조절하세요`

  const systemPrompt = `당신은 ${config.expertRole}입니다.
사용자의 이전 답변을 기반으로 다음 질문을 생성하세요.

목표: 아키네이터처럼 점진적으로 사용자의 학습 방향, 동기, 경험, 목표를 깊이 파악한 뒤, 마지막에 지식 수준을 측정합니다.

${directionGuidance}

공통 규칙:
- 이전 답변을 반영하여 자연스럽게 이어지는 질문을 하세요
- 한 번에 1개 질문만 생성하세요
- 주관식(text)만으로 이루어진 질문은 절대 생성하지 마세요
- 모든 질문에는 반드시 객관식 선택지 3개를 포함해야 합니다
- 사용자가 선택지 외에 직접 입력할 수 있는 기능은 UI가 자동으로 제공하므로 선택지에 "기타"를 넣지 마세요
- 아래 JSON 형식 중 하나로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요.

사용 가능한 질문 유형:

1) 단일 선택 (+ 직접 입력 가능):
{"type":"single-with-text","question":"질문","options":["선택지1","선택지2","선택지3"]}

2) 복수 선택 (+ 직접 입력 가능):
{"type":"multi-with-text","question":"질문","options":["선택지1","선택지2","선택지3"]}

3) 4지선다 지식 문제 (정답 포함) — **지식 측정 단계에서만 사용**:
{"type":"quiz","question":"질문","options":["선택지1","선택지2","선택지3","선택지4"],"answer":0}
answer는 정답 인덱스(0~3)

현재까지 ${history.length}개 질문 완료. 총 ${MAX_QUESTIONS}개 질문 예정.`

  try {
    const content = await aiProxy(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `이전 문답 기록:\n${historyText}\n\n다음 질문을 생성해주세요.` },
      ],
      0.8,
      500,
    )
    if (!content) return null

    let jsonStr = content
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim()

    const parsed = JSON.parse(jsonStr)
    if (parsed.question && parsed.type) {
      if (parsed.type === 'text') return null
      return parsed
    }
    return null
  } catch {
    return null
  }
}

/* =========================================================
   OpenAI API — Final Analysis
   ========================================================= */

async function generateAnalysis(history, field) {
  const config = getFieldPromptConfig(field)
  const historyText = history.map((h, i) =>
    `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}${h.correct !== undefined ? ` (${h.correct ? '정답' : '오답'})` : ''}`
  ).join('\n\n')

  const radarExample = config.knowledgeAreas.map(area => `{"subject": "${area}", "score": 50}`).join(',\n    ')

  const systemPrompt = `당신은 ${config.analysisExpert}입니다.
사용자의 전체 문답 기록을 분석하여 종합 결과를 생성하세요.

중요: 사용자의 학습 동기, 목표, 관심 방향, 경험 수준을 충분히 반영하세요.
단순히 지식 점수만이 아니라, 사용자가 어디로 가고 싶어하는지, 어떤 학습 경로가 적합한지를 중심으로 분석하세요.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "profileName": "프로필 타입명 (예: ${config.profileExample})",
  "profileDesc": "사용자의 학습 방향과 특성을 반영한 한 줄 설명",
  "level": "초급/중급/상급 중 택 1",
  "interests": ["관심 분야 태그 배열 — 사용자가 직접 언급한 분야 중심"],
  "strengths": ["강점 3개 — 학습 동기, 경험, 방향성 포함"],
  "improvements": ["보완할 점 3개 — 구체적이고 실행 가능한 조언"],
  "recommendations": [
    {"title": "추천 경로 1", "desc": "사용자의 목표에 맞는 구체적 설명"},
    {"title": "추천 경로 2", "desc": "설명"},
    {"title": "추천 경로 3", "desc": "설명"}
  ],
  "radarData": [
    ${radarExample}
    ...최소 5개 — 사용자 관심 분야를 반영한 레이더 축
  ]
}`

  try {
    const content = await aiProxy(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `전체 문답 기록:\n${historyText}\n\n종합 분석 결과를 생성해주세요.` },
      ],
      0.7,
      1000,
    )
    if (!content) return null

    let jsonStr = content
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim()

    return JSON.parse(jsonStr)
  } catch {
    return null
  }
}

/* =========================================================
   OpenAI API — Chat Mode Response
   ========================================================= */

async function generateChatResponse(messages, field) {
  const config = getFieldPromptConfig(field)
  const fieldLabel = IT_FIELDS.find(f => f.id === field)?.label || 'IT'
  const systemPrompt = `당신은 ${config.chatRole}입니다. 친근하고 전문적인 톤으로 대화하세요.

목표: 자연스러운 대화를 통해 사용자의 ${fieldLabel} 분야 학습 방향, 동기, 관심 분야, 경험 수준, 학습 목표를 깊이 파악합니다.

대화 흐름 가이드:
1단계 (1~2번째 메시지): ${fieldLabel} 학습을 시작하려는 동기와 배경을 파악
2단계 (3~4번째 메시지): 관심 있는 ${fieldLabel} 세부 분야와 이유 탐색
3단계 (5~6번째 메시지): 구체적인 목표 (취업, 자격증, 프로젝트 등)와 투자 가능 시간
4단계 (7번째~): 선호하는 학습 방식, 현재 역량 수준 확인, 정리

규칙:
- 한 번에 1~2개의 질문만 하세요
- 사용자의 답변에 공감하고 적절한 피드백을 제공하세요
- "왜 그 분야에 관심을 갖게 되셨어요?", "구체적으로 어떤 일을 해보고 싶으세요?" 같은 깊이 있는 질문을 하세요
- 너무 형식적이지 않게, 자연스러운 대화체를 사용하세요
- 답변은 2~4문장으로 간결하게 유지하세요
- 지식을 테스트하지 마세요 — 방향성과 목표 파악에 집중하세요
- 사용자가 충분한 정보를 제공했다면 추가 질문보다는 정리/확인을 하세요`

  try {
    const content = await aiProxy(
      [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      0.8,
      300,
    )
    return content
  } catch {
    return null
  }
}

/* =========================================================
   Chat → Q&A History Converter
   ========================================================= */

function convertChatToHistory(messages) {
  const history = []
  const userMessages = messages.filter((m) => m.role === 'user')
  const assistantMessages = messages.filter((m) => m.role === 'assistant')

  for (let i = 0; i < userMessages.length; i++) {
    const question = assistantMessages[i]?.content || '자유 대화'
    const answer = userMessages[i].content
    history.push({ question, answer })
  }

  return history
}

/* =========================================================
   Fallback Analysis (API 없을 때)
   ========================================================= */

function getFallbackAnalysis(history, field) {
  const config = getFieldPromptConfig(field)
  const fieldInfo = IT_FIELDS.find(f => f.id === field)
  const fieldLabel = fieldInfo?.label || 'IT'

  const quizResults = history.filter((h) => h.correct !== undefined)
  const correctCount = quizResults.filter((h) => h.correct).length
  const level = quizResults.length === 0 ? '측정 불가'
    : correctCount / quizResults.length >= 0.7 ? '상급'
    : correctCount / quizResults.length >= 0.4 ? '중급' : '초급'

  const fallbacks = {
    security: {
      profileName: '보안 탐색자',
      profileDesc: '다양한 보안 분야를 탐색하고 있는 타입입니다.',
      interests: ['보안', '학습'],
      strengths: ['보안에 대한 관심', '학습 의지', '자기 분석 능력'],
      improvements: ['실습 경험 확대', '세부 분야 깊이 강화', '최신 트렌드 파악'],
      recommendations: [
        { title: '보안 기초 완성', desc: '네트워크, 시스템, 웹 보안 기초 역량 구축' },
        { title: 'CTF 실전 대비', desc: '다양한 보안 분야를 아우르는 CTF 풀이 역량' },
        { title: '보안 자격증 취득', desc: '정보보안기사, CISSP 등 자격증 대비' },
      ],
      radarData: [
        { subject: '웹 보안', score: 50 }, { subject: '네트워크', score: 50 },
        { subject: '시스템', score: 50 }, { subject: '암호학', score: 40 }, { subject: '포렌식', score: 30 },
      ],
    },
    frontend: {
      profileName: '프론트엔드 탐색자',
      profileDesc: '프론트엔드 개발의 다양한 영역을 탐색하고 있는 타입입니다.',
      interests: ['프론트엔드', 'UI/UX'],
      strengths: ['프론트엔드에 대한 관심', '학습 의지', '사용자 경험 감각'],
      improvements: ['프레임워크 심화 학습', '프로젝트 경험 확대', '성능 최적화 이해'],
      recommendations: [
        { title: 'JavaScript 기초 완성', desc: 'ES6+, 비동기 처리, DOM 조작 핵심 역량 구축' },
        { title: 'React 프로젝트 실전', desc: '컴포넌트 설계, 상태 관리, 라우팅 실습' },
        { title: '포트폴리오 구축', desc: '개인 프로젝트로 실무 역량 증명' },
      ],
      radarData: [
        { subject: 'JavaScript', score: 50 }, { subject: 'React', score: 40 },
        { subject: 'CSS/HTML', score: 50 }, { subject: '웹 성능', score: 30 }, { subject: '상태 관리', score: 35 },
      ],
    },
    backend: {
      profileName: '백엔드 탐색자',
      profileDesc: '백엔드 개발의 다양한 영역을 탐색하고 있는 타입입니다.',
      interests: ['백엔드', 'API'],
      strengths: ['서버 개발에 대한 관심', '학습 의지', '논리적 사고력'],
      improvements: ['DB 설계 역량 강화', '아키텍처 패턴 학습', '실전 프로젝트 경험'],
      recommendations: [
        { title: '서버 개발 기초 완성', desc: 'RESTful API 설계, DB 연동 핵심 역량 구축' },
        { title: 'DB 설계 실전', desc: '정규화, 인덱싱, 쿼리 최적화 실습' },
        { title: 'MSA 아키텍처 이해', desc: '마이크로서비스 설계 원칙과 패턴 학습' },
      ],
      radarData: [
        { subject: 'API 설계', score: 45 }, { subject: '데이터베이스', score: 40 },
        { subject: '서버 아키텍처', score: 35 }, { subject: '인증/보안', score: 30 }, { subject: '성능 최적화', score: 30 },
      ],
    },
    infra: {
      profileName: '인프라 탐색자',
      profileDesc: '인프라/클라우드의 다양한 영역을 탐색하고 있는 타입입니다.',
      interests: ['인프라', '클라우드'],
      strengths: ['인프라에 대한 관심', '학습 의지', '시스템 이해력'],
      improvements: ['클라우드 서비스 실습', '자동화 스킬 향상', 'IaC 도구 학습'],
      recommendations: [
        { title: '리눅스/네트워크 기초', desc: '서버 운영, 네트워크 기초 역량 구축' },
        { title: '클라우드 실전', desc: 'AWS/GCP 핵심 서비스 실습과 자격증 준비' },
        { title: 'DevOps 파이프라인 구축', desc: 'CI/CD, 컨테이너, 모니터링 실습' },
      ],
      radarData: [
        { subject: '클라우드', score: 40 }, { subject: '컨테이너/K8s', score: 35 },
        { subject: 'CI/CD', score: 30 }, { subject: '네트워크', score: 45 }, { subject: 'IaC', score: 25 },
      ],
    },
    data: {
      profileName: '데이터 탐색자',
      profileDesc: '데이터/AI의 다양한 영역을 탐색하고 있는 타입입니다.',
      interests: ['데이터', 'AI'],
      strengths: ['데이터에 대한 관심', '학습 의지', '분석적 사고력'],
      improvements: ['통계 기초 보강', '실전 데이터 프로젝트', 'ML 파이프라인 이해'],
      recommendations: [
        { title: 'Python/SQL 기초 완성', desc: '데이터 처리를 위한 핵심 도구 역량 구축' },
        { title: '데이터 분석 실전', desc: '실제 데이터셋으로 EDA, 시각화 실습' },
        { title: 'ML 모델링 입문', desc: '기본 알고리즘 이해와 모델 학습 실습' },
      ],
      radarData: [
        { subject: 'Python/SQL', score: 45 }, { subject: '통계/수학', score: 35 },
        { subject: '머신러닝', score: 30 }, { subject: '데이터 파이프라인', score: 25 }, { subject: '시각화/분석', score: 40 },
      ],
    },
    mobile: {
      profileName: '모바일 탐색자',
      profileDesc: '모바일 개발의 다양한 영역을 탐색하고 있는 타입입니다.',
      interests: ['모바일', '앱 개발'],
      strengths: ['모바일 개발에 대한 관심', '학습 의지', '사용자 경험 감각'],
      improvements: ['네이티브 API 이해', '앱 아키텍처 학습', '배포 프로세스 경험'],
      recommendations: [
        { title: '플랫폼 선택 및 기초', desc: 'iOS/Android/크로스플랫폼 중 선택하여 기초 역량 구축' },
        { title: '앱 프로젝트 실전', desc: 'UI 구현, API 연동, 로컬 저장소 활용 실습' },
        { title: '앱 스토어 배포', desc: '빌드, 테스트, 배포 프로세스 경험' },
      ],
      radarData: [
        { subject: '모바일 UI/UX', score: 40 }, { subject: '네이티브 개발', score: 35 },
        { subject: '크로스플랫폼', score: 30 }, { subject: '앱 아키텍처', score: 30 }, { subject: '배포/운영', score: 25 },
      ],
    },
  }

  const fb = fallbacks[field] || fallbacks.security
  return { ...fb, level }
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function LevelTest() {
  const [step, setStep] = useState('intro')     // 'intro' | 'quiz' | 'chat' | 'analyzing' | 'results'
  const [selectedField, setSelectedField] = useState(null)  // IT field selection
  const [qIdx, setQIdx] = useState(0)            // current question index
  const [currentQ, setCurrentQ] = useState(null)  // current question object
  const [history, setHistory] = useState([])      // all Q&A pairs
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  // Answer state
  const [selectedOption, setSelectedOption] = useState(null)  // single-select highlight
  const [multiSelection, setMultiSelection] = useState([])    // multi-select
  const [textInput, setTextInput] = useState('')               // free-text input
  const [showTextInput, setShowTextInput] = useState(false)    // toggle custom text field

  // Chat mode state
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [chatUserMsgCount, setChatUserMsgCount] = useState(0)

  const textRef = useRef(null)
  const chatEndRef = useRef(null)
  const chatInputRef = useRef(null)

  /* ----- Start the test ----- */
  const startTest = () => {
    const questions = getInitialQuestions(selectedField)
    setStep('quiz')
    setQIdx(0)
    setHistory([])
    setCurrentQ(questions[0])
  }

  /* ----- Build answer string from current state ----- */
  const buildAnswerString = () => {
    if (!currentQ) return ''

    if (currentQ.type === 'quiz') {
      return currentQ.options[selectedOption] || ''
    }

    if (currentQ.type === 'single-with-text') {
      if (showTextInput && textInput.trim()) {
        return selectedOption !== null
          ? `${currentQ.options[selectedOption]}, 추가: ${textInput.trim()}`
          : textInput.trim()
      }
      return selectedOption !== null ? currentQ.options[selectedOption] : ''
    }

    if (currentQ.type === 'multi-with-text') {
      const selected = multiSelection.map((i) => currentQ.options[i])
      if (showTextInput && textInput.trim()) selected.push(textInput.trim())
      return selected.join(', ')
    }

    return ''
  }

  /* ----- Handle single-select (quiz type — auto advance) ----- */
  const handleQuizAnswer = (optIdx) => {
    setSelectedOption(optIdx)
    const isCorrect = optIdx === currentQ.answer
    const answerText = currentQ.options[optIdx]

    setTimeout(() => {
      advanceToNext({
        question: currentQ.question,
        answer: answerText,
        correct: isCorrect,
      })
    }, 400)
  }

  /* ----- Handle single-with-text select (highlight, no auto-advance) ----- */
  const handleSingleSelect = (optIdx) => {
    setSelectedOption((prev) => prev === optIdx ? null : optIdx)
  }

  /* ----- Handle multi select toggle ----- */
  const toggleMultiSelect = (optIdx) => {
    setMultiSelection((prev) =>
      prev.includes(optIdx) ? prev.filter((i) => i !== optIdx) : [...prev, optIdx]
    )
  }

  /* ----- Submit answer (for non-quiz types) ----- */
  const submitAnswer = () => {
    const answerStr = buildAnswerString()
    if (!answerStr) return

    advanceToNext({
      question: currentQ.question,
      answer: answerStr,
    })
  }

  /* ----- Advance to next question ----- */
  const advanceToNext = async (entry) => {
    const newHistory = [...history, entry]
    setHistory(newHistory)

    // Reset answer state
    setSelectedOption(null)
    setMultiSelection([])
    setTextInput('')
    setShowTextInput(false)

    const nextIdx = qIdx + 1

    // Check if we've reached max questions
    if (nextIdx >= MAX_QUESTIONS) {
      await finishTest(newHistory)
      return
    }

    setQIdx(nextIdx)

    // Use initial questions if available, otherwise ask AI
    const questions = getInitialQuestions(selectedField)
    if (nextIdx < questions.length) {
      setCurrentQ(questions[nextIdx])
    } else {
      setIsLoading(true)
      const aiQ = await generateNextQuestion(newHistory, selectedField)
      setIsLoading(false)

      if (aiQ) {
        setCurrentQ(aiQ)
      } else {
        // If AI fails, finish early
        await finishTest(newHistory)
      }
    }
  }

  /* ----- Finish test & generate analysis ----- */
  const finishTest = async (finalHistory) => {
    setStep('analyzing')
    const result = await generateAnalysis(finalHistory, selectedField)
    setAnalysis(result || getFallbackAnalysis(finalHistory, selectedField))
    setStep('results')
  }

  /* ----- Start chat mode ----- */
  const startChat = async () => {
    const fieldLabel = IT_FIELDS.find(f => f.id === selectedField)?.label || 'IT'
    setStep('chat')
    setChatMessages([])
    setChatUserMsgCount(0)
    setIsChatLoading(true)

    const greeting = await generateChatResponse([
      { role: 'user', content: `안녕하세요, ${fieldLabel} 학습 상담을 시작하고 싶습니다.` },
    ], selectedField)

    const firstMsg = greeting || `안녕하세요! ${fieldLabel} 학습 상담사입니다. ${fieldLabel} 분야에서 어떤 부분에 가장 관심이 있으신가요? 편하게 말씀해주세요!`
    setChatMessages([{ role: 'assistant', content: firstMsg }])
    setIsChatLoading(false)
  }

  /* ----- Send chat message ----- */
  const sendChatMessage = async () => {
    const msg = chatInput.trim()
    if (!msg || isChatLoading) return

    const userMsg = { role: 'user', content: msg }
    const newMessages = [...chatMessages, userMsg]
    setChatMessages(newMessages)
    setChatInput('')
    setChatUserMsgCount((c) => c + 1)
    setIsChatLoading(true)

    const aiReply = await generateChatResponse(newMessages, selectedField)
    const replyMsg = aiReply || '흥미로운 답변이네요! 조금 더 자세히 말씀해주시겠어요?'
    setChatMessages((prev) => [...prev, { role: 'assistant', content: replyMsg }])
    setIsChatLoading(false)
  }

  /* ----- Finish chat → analyze ----- */
  const finishChat = async () => {
    const chatHistory = convertChatToHistory(chatMessages)
    await finishTest(chatHistory)
  }

  /* ----- Reset ----- */
  const resetTest = () => {
    setStep('intro')
    setSelectedField(null)
    setQIdx(0)
    setCurrentQ(null)
    setHistory([])
    setIsLoading(false)
    setAnalysis(null)
    setSelectedOption(null)
    setMultiSelection([])
    setTextInput('')
    setShowTextInput(false)
    setChatMessages([])
    setChatInput('')
    setIsChatLoading(false)
    setChatUserMsgCount(0)
  }

  /* ----- Can submit? ----- */
  const canSubmit = () => {
    if (!currentQ) return false
    if (currentQ.type === 'single-with-text') return selectedOption !== null || (showTextInput && textInput.trim().length > 0)
    if (currentQ.type === 'multi-with-text') return multiSelection.length > 0 || (showTextInput && textInput.trim().length > 0)
    return false
  }

  /* ----- Focus text input when shown ----- */
  useEffect(() => {
    if (showTextInput && textRef.current) textRef.current.focus()
  }, [showTextInput])

  /* ----- Auto-scroll chat ----- */
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages, isChatLoading])

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">

          {/* ===== Intro ===== */}
          {step === 'intro' && (
            <div style={s.centerWrap}>
              <div style={s.introContainer}>
                {/* Common header */}
                <div style={s.introHeader}>
                  <div style={s.introIconWrap}>
                    <Target size={48} />
                  </div>
                  <h1 style={s.introTitle}>AI 레벨테스트</h1>
                  <p style={s.introDesc}>
                    AI가 당신의 답변을 분석하여
                    <br />맞춤형 역량 분석 리포트를 생성합니다.
                  </p>
                  <div style={s.aiBadge}>&#10024; AI 적응형 분석 활성화</div>
                </div>

                {/* Step 1: Field selection */}
                {!selectedField && (
                  <>
                    <h2 style={s.fieldSelectTitle}>분야를 선택하세요</h2>
                    <div style={s.fieldGrid}>
                      {IT_FIELDS.map((field) => {
                        const Icon = field.icon
                        return (
                          <Card
                            key={field.id}
                            hover={false}
                            style={s.fieldCard}
                            onClick={() => setSelectedField(field.id)}
                          >
                            <div style={{ ...s.fieldCardIcon, background: `${field.color}14`, color: field.color }}>
                              <Icon size={28} />
                            </div>
                            <h3 style={s.fieldCardLabel}>{field.label}</h3>
                            <p style={s.fieldCardDesc}>{field.desc}</p>
                          </Card>
                        )
                      })}
                    </div>
                  </>
                )}

                {/* Step 2: Mode selection (after field chosen) */}
                {selectedField && (
                  <>
                    {/* Selected field badge */}
                    <div style={s.selectedFieldRow}>
                      {(() => {
                        const f = IT_FIELDS.find(fi => fi.id === selectedField)
                        const Icon = f.icon
                        return (
                          <div style={{ ...s.selectedFieldBadge, borderColor: `${f.color}30`, background: `${f.color}08` }}>
                            <Icon size={16} style={{ color: f.color }} />
                            <span style={{ color: f.color, fontWeight: 700, fontSize: '0.88rem' }}>{f.label}</span>
                          </div>
                        )
                      })()}
                      <button
                        style={s.changeFieldBtn}
                        onClick={() => setSelectedField(null)}
                      >
                        다른 분야 선택
                      </button>
                    </div>

                    {/* Option cards */}
                    <div style={s.optionCardsRow}>
                      {/* Quiz option */}
                      <Card hover={false} style={s.optionCard} onClick={startTest}>
                        <div style={s.optionCardIcon}>
                          <Target size={32} />
                        </div>
                        <h3 style={s.optionCardTitle}>AI 적응형 테스트</h3>
                        <p style={s.optionCardDesc}>
                          객관식 선택지 + 주관식 입력으로 구성된 체계적인 테스트
                        </p>
                        <div style={s.optionCardMeta}>
                          <span style={s.optionCardTag}>객관식 + 주관식</span>
                          <span style={s.optionCardTag}>총 {MAX_QUESTIONS}문항</span>
                        </div>
                        <div style={s.optionCardAction}>
                          시작하기 <ChevronRight size={16} />
                        </div>
                      </Card>

                      {/* Chat option */}
                      <Card hover={false} style={s.optionCard} onClick={startChat}>
                        <div style={{ ...s.optionCardIcon, background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.08))', color: '#10B981' }}>
                          <MessageSquare size={32} />
                        </div>
                        <h3 style={s.optionCardTitle}>AI 대화형 상담</h3>
                        <p style={s.optionCardDesc}>
                          자유로운 대화를 통해 관심 분야와 학습 목표를 구체화
                        </p>
                        <div style={s.optionCardMeta}>
                          <span style={s.optionCardTag}>자유 대화</span>
                          <span style={s.optionCardTag}>맞춤형 분석</span>
                        </div>
                        <div style={{ ...s.optionCardAction, background: 'linear-gradient(135deg, #10B981, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          시작하기 <ChevronRight size={16} style={{ color: '#10B981' }} />
                        </div>
                      </Card>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ===== Quiz ===== */}
          {step === 'quiz' && (
            <div style={s.quizWrap}>
              <ProgressBar current={qIdx + 1} total={MAX_QUESTIONS} />

              {isLoading ? (
                <div style={s.loadingCard}>
                  <Loader2 size={36} style={{ color: '#4F46E5', animation: 'spin 1s linear infinite' }} />
                  <p style={s.loadingText}>AI가 다음 질문을 준비하고 있습니다...</p>
                </div>
              ) : currentQ ? (
                <div style={s.questionCard}>
                  <div style={s.qHeader}>
                    <span style={s.qNumber}>Q{qIdx + 1}</span>
                    {currentQ.type === 'quiz' && <span style={s.qBadgeQuiz}>지식 문제</span>}
                    {currentQ.type === 'single-with-text' && <span style={s.qBadgeSingle}>단일 선택</span>}
                    {currentQ.type === 'multi-with-text' && <span style={s.qBadgeMulti}>복수 선택</span>}
                  </div>
                  <h2 style={s.qText}>{currentQ.question}</h2>

                  {/* ---- Quiz (4지선다, 자동 이동) ---- */}
                  {currentQ.type === 'quiz' && (
                    <div style={s.optionsList}>
                      {currentQ.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuizAnswer(i)}
                          disabled={selectedOption !== null}
                          style={{
                            ...s.optionBtn,
                            ...(selectedOption === i
                              ? (i === currentQ.answer ? s.optionCorrect : s.optionWrong)
                              : (selectedOption !== null && i === currentQ.answer ? s.optionCorrect : {})),
                          }}
                        >
                          <span style={{
                            ...s.optionLabel,
                            ...(selectedOption === i ? { background: i === currentQ.answer ? '#10B981' : '#EF4444', color: '#fff' } : {}),
                            ...(selectedOption !== null && i === currentQ.answer && selectedOption !== i ? { background: '#10B981', color: '#fff' } : {}),
                          }}>{String.fromCharCode(65 + i)}</span>
                          <span style={{ flex: 1 }}>{opt}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ---- Single select + optional text ---- */}
                  {currentQ.type === 'single-with-text' && (
                    <>
                      <div style={s.optionsList}>
                        {currentQ.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleSingleSelect(i)}
                            style={{
                              ...s.optionBtn,
                              ...(selectedOption === i ? s.optionSelected : {}),
                            }}
                          >
                            <span style={{
                              ...s.optionLabel,
                              ...(selectedOption === i ? { background: '#4F46E5', color: '#fff' } : {}),
                            }}>{String.fromCharCode(65 + i)}</span>
                            <span style={{ flex: 1 }}>{opt}</span>
                            {selectedOption === i && <CheckCircle2 size={18} style={{ color: '#4F46E5' }} />}
                          </button>
                        ))}
                      </div>
                      <TextInputToggle
                        showTextInput={showTextInput}
                        setShowTextInput={setShowTextInput}
                        textInput={textInput}
                        setTextInput={setTextInput}
                        textRef={textRef}
                      />
                      <SubmitFooter canSubmit={canSubmit()} onSubmit={submitAnswer} />
                    </>
                  )}

                  {/* ---- Multi select + optional text ---- */}
                  {currentQ.type === 'multi-with-text' && (
                    <>
                      <div style={s.optionsList}>
                        {currentQ.options.map((opt, i) => {
                          const isChecked = multiSelection.includes(i)
                          return (
                            <button
                              key={i}
                              onClick={() => toggleMultiSelect(i)}
                              style={{
                                ...s.optionBtn,
                                ...(isChecked ? s.optionSelected : {}),
                              }}
                            >
                              <div style={{ ...s.checkbox, ...(isChecked ? s.checkboxActive : {}) }}>
                                {isChecked && <CheckCircle2 size={14} />}
                              </div>
                              <span style={{ flex: 1 }}>{opt}</span>
                            </button>
                          )
                        })}
                      </div>
                      <TextInputToggle
                        showTextInput={showTextInput}
                        setShowTextInput={setShowTextInput}
                        textInput={textInput}
                        setTextInput={setTextInput}
                        textRef={textRef}
                      />
                      <SubmitFooter
                        canSubmit={canSubmit()}
                        onSubmit={submitAnswer}
                        countLabel={multiSelection.length > 0 ? `${multiSelection.length}개 선택됨` : null}
                      />
                    </>
                  )}
                </div>
              ) : null}

              {/* 6번째 질문부터 조기 종료 버튼 */}
              {!isLoading && qIdx >= 5 && (
                <button
                  onClick={() => finishTest(history)}
                  style={s.earlyFinishBtn}
                >
                  여기서 마치고 결과 보기
                </button>
              )}
            </div>
          )}

          {/* ===== Chat ===== */}
          {step === 'chat' && (
            <div style={s.chatWrap}>
              {/* Chat header */}
              <div style={s.chatHeader}>
                <div style={s.chatHeaderLeft}>
                  <div style={s.chatAvatar}>
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <div style={s.chatHeaderName}>AI 학습 상담사</div>
                    <div style={s.chatHeaderStatus}>
                      <div style={{ ...s.chatStatusDot, background: isChatLoading ? '#F59E0B' : '#10B981' }} />
                      {isChatLoading ? '입력중...' : '온라인'}
                    </div>
                  </div>
                </div>
                {chatUserMsgCount >= MIN_CHAT_MESSAGES && (
                  <button onClick={finishChat} style={s.chatAnalyzeBtn}>
                    분석 시작 <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {/* Chat messages */}
              <div style={s.chatMessagesArea}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={msg.role === 'user' ? s.chatBubbleRowUser : s.chatBubbleRowAi}>
                    {msg.role === 'assistant' && (
                      <div style={s.chatBubbleAvatar}>
                        <MessageSquare size={14} />
                      </div>
                    )}
                    <div style={msg.role === 'user' ? s.chatBubbleUser : s.chatBubbleAi}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isChatLoading && (
                  <div style={s.chatBubbleRowAi}>
                    <div style={s.chatBubbleAvatar}>
                      <MessageSquare size={14} />
                    </div>
                    <div style={s.chatBubbleAi}>
                      <div style={s.chatTypingDots}>
                        <div style={{ ...s.dot, animationDelay: '0s' }} />
                        <div style={{ ...s.dot, animationDelay: '0.2s' }} />
                        <div style={{ ...s.dot, animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat input bar */}
              <div style={s.chatInputBar}>
                <input
                  ref={chatInputRef}
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendChatMessage()
                    }
                  }}
                  placeholder="메시지를 입력하세요..."
                  disabled={isChatLoading}
                  style={s.chatInputField}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={isChatLoading || !chatInput.trim()}
                  style={{
                    ...s.chatSendBtn,
                    opacity: isChatLoading || !chatInput.trim() ? 0.5 : 1,
                  }}
                >
                  <Send size={18} />
                </button>
              </div>

              {/* Message count hint */}
              {chatUserMsgCount < MIN_CHAT_MESSAGES && (
                <div style={s.chatHint}>
                  분석 시작까지 {MIN_CHAT_MESSAGES - chatUserMsgCount}개 메시지 더 필요합니다
                </div>
              )}
            </div>
          )}

          {/* ===== Analyzing ===== */}
          {step === 'analyzing' && (
            <div style={s.centerWrap}>
              <div style={s.analyzingCard}>
                <Loader2 size={44} style={{ color: '#4F46E5', animation: 'spin 1s linear infinite' }} />
                <h2 style={s.analyzingTitle}>AI가 결과를 분석하고 있습니다...</h2>
                <p style={s.analyzingDesc}>답변을 종합하여 맞춤 분석을 생성 중입니다</p>
                <div style={s.analyzingDots}>
                  <div style={{ ...s.dot, animationDelay: '0s' }} />
                  <div style={{ ...s.dot, animationDelay: '0.2s' }} />
                  <div style={{ ...s.dot, animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}

          {/* ===== Results ===== */}
          {step === 'results' && analysis && (
            <div style={s.resultWrap}>
              <h1 style={s.resultTitle}>
                <span className="gradient-text">분석 완료!</span>
              </h1>

              {/* Profile badge */}
              <div style={s.profileBadge}>
                <span style={s.profileName}>{analysis.profileName}</span>
                <span style={s.profileDesc}>{analysis.profileDesc}</span>
              </div>

              {/* Level & Interests */}
              <Card hover={false} style={{ padding: '24px 28px', marginBottom: '20px' }}>
                <div style={s.levelRow}>
                  <div style={s.levelCol}>
                    <span style={s.infoLabel}>종합 레벨</span>
                    <span style={s.levelValue}>{analysis.level}</span>
                  </div>
                  <div style={s.interestsCol}>
                    <span style={s.infoLabel}>관심 분야</span>
                    <div style={s.tagRow}>
                      {(analysis.interests || []).map((tag, i) => (
                        <span key={i} style={s.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Radar chart */}
              {analysis.radarData && analysis.radarData.length >= 3 && (
                <Card hover={false} style={s.chartCard}>
                  <h3 style={s.chartTitle}>역량 분석 차트</h3>
                  <div style={s.chartWrap}>
                    <ResponsiveContainer width="100%" height={320}>
                      <RadarChart data={analysis.radarData} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid stroke="#E2E8F0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} />
                        <Radar name="점수" dataKey="score" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.25} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}

              {/* Strengths & Improvements */}
              <div style={s.summaryGrid}>
                <Card hover={false} style={s.summaryCard}>
                  <div style={s.summaryHeader}>
                    <div style={{ ...s.summaryDot, background: '#10B981' }} />
                    <h4 style={s.summaryTitle}>강점</h4>
                  </div>
                  <ul style={s.summaryList}>
                    {(analysis.strengths || []).map((item, i) => (
                      <li key={i} style={s.summaryItem}>
                        <CheckCircle2 size={14} style={{ color: '#10B981', flexShrink: 0 }} />
                        <span style={s.summaryArea}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card hover={false} style={s.summaryCard}>
                  <div style={s.summaryHeader}>
                    <div style={{ ...s.summaryDot, background: '#F59E0B' }} />
                    <h4 style={s.summaryTitle}>보완 영역</h4>
                  </div>
                  <ul style={s.summaryList}>
                    {(analysis.improvements || []).map((item, i) => (
                      <li key={i} style={s.summaryItem}>
                        <Target size={14} style={{ color: '#F59E0B', flexShrink: 0 }} />
                        <span style={s.summaryArea}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Recommendations */}
              <Card hover={false} style={{ padding: '28px', marginBottom: '32px' }}>
                <h3 style={s.sectionLabel}>추천 학습 경로</h3>
                <div style={s.pathList}>
                  {(analysis.recommendations || []).map((p, i) => (
                    <div key={i} style={s.pathItem}>
                      <div style={{ ...s.pathNum, background: ['#4F46E5', '#06B6D4', '#10B981'][i % 3] }}>
                        {i + 1}
                      </div>
                      <div>
                        <div style={s.pathTitle}>{p.title}</div>
                        <div style={s.pathDesc}>{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Actions */}
              <div style={s.resultActions}>
                <Link to="/curriculum">
                  <Button size="large">맞춤 커리큘럼 확인 <ChevronRight size={18} /></Button>
                </Link>
                <Button variant="secondary" size="large" onClick={resetTest}>
                  <RotateCcw size={18} /> 다시 테스트하기
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
      <LevelTestStyles />
    </>
  )
}

/* =========================================================
   Sub-components
   ========================================================= */

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div style={s.progressWrap}>
      <div style={s.progressInfo}>
        <span style={s.progressLabel}>진행률</span>
        <span style={s.progressCount}>{current} / {total}</span>
      </div>
      <div style={s.progressTrack}>
        <div style={{ ...s.progressFill, width: `${pct}%` }} />
      </div>
    </div>
  )
}

function TextInputToggle({ showTextInput, setShowTextInput, textInput, setTextInput, textRef }) {
  return (
    <div style={s.customInputSection}>
      <button
        onClick={() => setShowTextInput(!showTextInput)}
        style={{
          ...s.customToggleBtn,
          ...(showTextInput ? s.customToggleBtnActive : {}),
        }}
      >
        {showTextInput ? '- 직접 입력 닫기' : '+ 직접 입력하기'}
      </button>
      {showTextInput && (
        <input
          ref={textRef}
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="직접 입력해주세요..."
          style={s.customTextInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault()
          }}
        />
      )}
    </div>
  )
}

function SubmitFooter({ canSubmit, onSubmit, countLabel }) {
  return (
    <div style={s.submitFooter}>
      {countLabel && <span style={s.multiCount}>{countLabel}</span>}
      <Button
        size="large"
        onClick={onSubmit}
        style={{
          opacity: canSubmit ? 1 : 0.5,
          pointerEvents: canSubmit ? 'auto' : 'none',
          marginLeft: 'auto',
        }}
      >
        다음 <ChevronRight size={18} />
      </Button>
    </div>
  )
}

function LevelTestStyles() {
  useEffect(() => {
    if (document.querySelector('[data-lt-styles]')) return
    const el = document.createElement('style')
    el.setAttribute('data-lt-styles', '')
    el.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes dotPulse {
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
      }
    `
    document.head.appendChild(el)
    return () => {
      const existing = document.querySelector('[data-lt-styles]')
      if (existing) existing.remove()
    }
  }, [])
  return null
}

/* =========================================================
   STYLES
   ========================================================= */

const s = {
  /* Center wrapper — used for intro & analyzing */
  centerWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 72px - 64px)',
    padding: '24px',
  },

  /* ====== Intro ====== */
  introContainer: {
    maxWidth: '720px',
    width: '100%',
  },
  introHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  introIconWrap: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, rgba(79,70,229,0.12), rgba(6,182,212,0.08))',
    color: '#818CF8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  introTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    marginBottom: '12px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  introDesc: {
    color: '#0F172A',
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.7,
    marginBottom: '8px',
  },
  aiBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 16px',
    borderRadius: '100px',
    background: 'rgba(16,185,129,0.08)',
    color: '#10B981',
    fontSize: '0.8rem',
    fontWeight: 600,
    border: '1px solid rgba(16,185,129,0.15)',
  },

  /* ====== Field Selection ====== */
  fieldSelectTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: '20px',
  },
  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '14px',
  },
  fieldCard: {
    padding: '24px 20px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    border: '1.5px solid #E2E8F0',
  },
  fieldCardIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
  },
  fieldCardLabel: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: '6px',
  },
  fieldCardDesc: {
    color: '#94A3B8',
    fontSize: '0.78rem',
    lineHeight: 1.5,
  },
  selectedFieldRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  selectedFieldBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '100px',
    border: '1.5px solid',
  },
  changeFieldBtn: {
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    background: 'transparent',
    color: '#94A3B8',
    fontSize: '0.78rem',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
  },

  /* ====== Intro Option Cards ====== */
  optionCardsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  optionCard: {
    padding: '32px 28px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    border: '1.5px solid #E2E8F0',
  },
  optionCardIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(79,70,229,0.12), rgba(6,182,212,0.08))',
    color: '#818CF8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  optionCardTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: '8px',
  },
  optionCardDesc: {
    color: '#64748B',
    fontSize: '0.85rem',
    lineHeight: 1.6,
    marginBottom: '16px',
  },
  optionCardMeta: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  optionCardTag: {
    padding: '4px 10px',
    borderRadius: '100px',
    background: '#F1F5F9',
    color: '#64748B',
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  optionCardAction: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.9rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  /* ====== Chat ====== */
  chatWrap: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '24px 16px 32px',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 72px - 64px)',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '16px 16px 0 0',
    borderBottom: 'none',
  },
  chatHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  chatAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderName: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#0F172A',
  },
  chatHeaderStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    color: '#94A3B8',
    fontWeight: 500,
  },
  chatStatusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  chatAnalyzeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 16px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    color: '#fff',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'opacity 0.15s ease',
  },
  chatMessagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 20px',
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderTop: 'none',
    borderBottom: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  chatBubbleRowAi: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    maxWidth: '80%',
  },
  chatBubbleRowUser: {
    display: 'flex',
    justifyContent: 'flex-end',
    maxWidth: '80%',
    marginLeft: 'auto',
  },
  chatBubbleAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  chatBubbleAi: {
    padding: '12px 16px',
    borderRadius: '4px 16px 16px 16px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    color: '#0F172A',
    fontSize: '0.88rem',
    lineHeight: 1.6,
    fontWeight: 500,
  },
  chatBubbleUser: {
    padding: '12px 16px',
    borderRadius: '16px 4px 16px 16px',
    background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
    color: '#fff',
    fontSize: '0.88rem',
    lineHeight: 1.6,
    fontWeight: 500,
  },
  chatTypingDots: {
    display: 'flex',
    gap: '6px',
    padding: '4px 0',
  },
  chatInputBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 20px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '0 0 16px 16px',
  },
  chatInputField: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1.5px solid #E2E8F0',
    background: '#F8FAFC',
    color: '#0F172A',
    fontSize: '0.88rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  },
  chatSendBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'opacity 0.15s ease',
    flexShrink: 0,
  },
  chatHint: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: '0.78rem',
    fontWeight: 500,
    marginTop: '12px',
  },

  /* ====== Quiz ====== */
  quizWrap: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '24px 16px 60px',
  },

  /* Progress bar */
  progressWrap: { marginBottom: '24px' },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  progressLabel: { color: '#94A3B8', fontSize: '0.8rem', fontWeight: 500 },
  progressCount: { color: '#0F172A', fontSize: '0.85rem', fontWeight: 700 },
  progressTrack: {
    height: '4px',
    borderRadius: '2px',
    background: '#E2E8F0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '2px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    transition: 'width 0.4s ease',
  },

  /* Question card */
  questionCard: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '16px',
    padding: '32px 28px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  qHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  qNumber: {
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: '6px',
    background: 'rgba(79,70,229,0.08)',
    color: '#4F46E5',
    fontSize: '0.78rem',
    fontWeight: 700,
  },
  qBadgeQuiz: {
    padding: '3px 10px',
    borderRadius: '6px',
    background: 'rgba(245,158,11,0.08)',
    color: '#D97706',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  qBadgeSingle: {
    padding: '3px 10px',
    borderRadius: '6px',
    background: 'rgba(79,70,229,0.06)',
    color: '#6366F1',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  qBadgeMulti: {
    padding: '3px 10px',
    borderRadius: '6px',
    background: 'rgba(6,182,212,0.08)',
    color: '#0891B2',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  qText: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#0F172A',
    lineHeight: 1.6,
    marginBottom: '24px',
  },

  /* Options — single column list */
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  optionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1.5px solid #E2E8F0',
    background: '#FAFBFC',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#0F172A',
    transition: 'all 0.15s ease',
  },
  optionSelected: {
    border: '1.5px solid #4F46E5',
    background: 'rgba(79,70,229,0.04)',
  },
  optionCorrect: {
    border: '1.5px solid #10B981',
    background: 'rgba(16,185,129,0.06)',
  },
  optionWrong: {
    border: '1.5px solid #EF4444',
    background: 'rgba(239,68,68,0.06)',
  },
  optionLabel: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: '#E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#64748B',
    flexShrink: 0,
    transition: 'all 0.15s ease',
  },

  /* Checkbox for multi-select */
  checkbox: {
    width: '20px',
    height: '20px',
    borderRadius: '6px',
    border: '2px solid #CBD5E1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.15s ease',
  },
  checkboxActive: {
    border: '2px solid #4F46E5',
    color: '#4F46E5',
    background: 'rgba(79,70,229,0.08)',
  },

  /* Custom text input toggle */
  customInputSection: { marginTop: '14px' },
  customToggleBtn: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px dashed #CBD5E1',
    background: 'transparent',
    color: '#94A3B8',
    fontSize: '0.82rem',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
  },
  customToggleBtnActive: {
    border: '1px dashed #4F46E5',
    color: '#4F46E5',
  },
  customTextInput: {
    width: '100%',
    marginTop: '10px',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1.5px solid #E2E8F0',
    background: '#FAFBFC',
    color: '#0F172A',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.15s ease',
    boxSizing: 'border-box',
  },

  /* Submit footer */
  submitFooter: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '20px',
    gap: '12px',
  },
  multiCount: {
    fontSize: '0.82rem',
    color: '#4F46E5',
    fontWeight: 600,
    background: 'rgba(79,70,229,0.06)',
    padding: '4px 12px',
    borderRadius: '6px',
  },

  /* Loading */
  loadingCard: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '16px',
    padding: '48px 28px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
  },
  loadingText: { color: '#94A3B8', fontSize: '0.9rem', fontWeight: 500 },

  /* Analyzing */
  analyzingCard: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '20px',
    padding: '60px 40px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center',
  },
  analyzingTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#0F172A',
  },
  analyzingDesc: {
    color: '#94A3B8',
    fontSize: '0.88rem',
    fontWeight: 500,
  },
  analyzingDots: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#4F46E5',
    animation: 'dotPulse 1.2s ease-in-out infinite',
  },

  /* ====== Results ====== */
  resultWrap: { maxWidth: '640px', margin: '0 auto', padding: '32px 16px 60px' },
  resultTitle: { fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: '20px' },

  profileBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    margin: '0 auto 28px',
    padding: '20px 32px',
    borderRadius: '14px',
    background: 'rgba(79,70,229,0.06)',
    border: '1px solid rgba(79,70,229,0.15)',
    width: 'fit-content',
    maxWidth: '100%',
  },
  profileName: {
    fontSize: '1.3rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  profileDesc: { color: '#64748B', fontSize: '0.88rem', textAlign: 'center' },

  levelRow: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  levelCol: { flexShrink: 0 },
  interestsCol: { flex: 1, minWidth: 0 },
  levelValue: {
    display: 'block',
    fontSize: '1.05rem',
    fontWeight: 800,
    marginTop: '4px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  sectionLabel: { fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '14px' },
  infoLabel: { display: 'block', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 },

  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' },
  tag: {
    padding: '4px 10px',
    borderRadius: '100px',
    background: 'rgba(79,70,229,0.06)',
    color: '#6366F1',
    fontSize: '0.78rem',
    fontWeight: 600,
    border: '1px solid rgba(79,70,229,0.12)',
  },

  chartCard: { padding: '28px 20px', marginBottom: '20px' },
  chartTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '12px', textAlign: 'center', color: '#0F172A' },
  chartWrap: { width: '100%', height: '320px' },

  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' },
  summaryCard: { padding: '20px' },
  summaryHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
  summaryDot: { width: '8px', height: '8px', borderRadius: '50%' },
  summaryTitle: { fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' },
  summaryList: { display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', padding: 0, margin: 0 },
  summaryItem: { display: 'flex', alignItems: 'flex-start', gap: '8px' },
  summaryArea: { color: '#475569', fontSize: '0.85rem', lineHeight: 1.5 },

  pathList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  pathItem: { display: 'flex', alignItems: 'center', gap: '12px' },
  pathNum: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  pathTitle: { fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '2px' },
  pathDesc: { fontSize: '0.8rem', color: '#64748B' },

  resultActions: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },

  /* Early finish */
  earlyFinishBtn: {
    display: 'block',
    margin: '16px auto 0',
    padding: '10px 20px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    background: 'transparent',
    color: '#94A3B8',
    fontSize: '0.84rem',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
  },
}
