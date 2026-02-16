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
   Initial Questions (첫 3문항은 고정 — 학습 방향 탐색 시드)
   ========================================================= */

const initialQuestions = [
  {
    type: 'single-with-text',
    question: '보안 학습을 시작하려는 이유가 무엇인가요?',
    options: ['취업/이직 준비', '현업 역량 강화', '개인적 호기심/흥미'],
  },
  {
    type: 'multi-with-text',
    question: '현재 IT 관련 경험이 있다면 어떤 분야인가요? (복수 선택 가능)',
    options: ['프로그래밍/개발', '서버/네트워크 관리', '보안 관련 업무나 학습'],
  },
  {
    type: 'single-with-text',
    question: '보안 분야 중 가장 끌리는 방향이 있으신가요?',
    options: ['웹/앱 해킹 (버그바운티, 모의해킹)', '시스템/네트워크 보안 (침투테스트, 포렌식)', '아직 잘 모르겠어서 전반적으로 탐색하고 싶어요'],
  },
]

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

async function generateNextQuestion(history) {
  const historyText = history.map((h, i) =>
    `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`
  ).join('\n\n')

  const currentNum = history.length + 1
  const isDirectionPhase = currentNum <= DIRECTION_PHASE_END

  const directionGuidance = isDirectionPhase
    ? `현재는 **방향 탐색 단계** (${currentNum}/${DIRECTION_PHASE_END})입니다.
아직 파악하지 못한 정보를 우선적으로 질문하세요:
- 구체적인 학습 목표 (예: 어떤 자격증? 어떤 직무? 어떤 프로젝트?)
- 학습에 투자할 수 있는 시간과 기간
- 선호하는 학습 방식 (이론 vs 실습, 혼자 vs 그룹)
- 관심 있는 보안 세부 분야 (웹 해킹, 포렌식, 악성코드 분석, 클라우드 보안, 네트워크 침투 등)
- 이전 학습 경험이나 시도한 적 있는 것 (CTF, 온라인 강의, 독학 등)
- 현재 개발/IT 역량 수준 (프로그래밍 언어, 리눅스 경험, 네트워크 이해도 등)
- 최종적으로 되고 싶은 모습이나 커리어 방향

** 절대 지식 측정 문제(quiz 타입)를 내지 마세요. 방향 탐색 질문만 하세요.**
이전 답변에서 이미 파악된 정보는 건너뛰고, 아직 모르는 부분을 물어보세요.`
    : `현재는 **지식 측정 단계** (문항 ${currentNum}/${MAX_QUESTIONS})입니다.
사용자가 관심 있다고 한 분야에서 실제 지식 수준을 측정하는 4지선다 퀴즈를 출제하세요.
- 반드시 quiz 타입을 사용하세요
- 너무 쉽거나 너무 어려운 문제는 피하세요
- 이전에 틀린 문제가 있다면 난이도를 조절하세요`

  const systemPrompt = `당신은 사이버 보안 학습 성향 및 역량 분석 전문가입니다.
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

async function generateAnalysis(history) {
  const historyText = history.map((h, i) =>
    `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}${h.correct !== undefined ? ` (${h.correct ? '정답' : '오답'})` : ''}`
  ).join('\n\n')

  const systemPrompt = `당신은 사이버 보안 학습 분석 전문가입니다.
사용자의 전체 문답 기록을 분석하여 종합 결과를 생성하세요.

중요: 사용자의 학습 동기, 목표, 관심 방향, 경험 수준을 충분히 반영하세요.
단순히 지식 점수만이 아니라, 사용자가 어디로 가고 싶어하는지, 어떤 학습 경로가 적합한지를 중심으로 분석하세요.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "profileName": "프로필 타입명 (예: 공격형 보안 전문가 지망생)",
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
    {"subject": "분야명", "score": 0~100},
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

async function generateChatResponse(messages) {
  const systemPrompt = `당신은 사이버 보안 학습 상담사입니다. 친근하고 전문적인 톤으로 대화하세요.

목표: 자연스러운 대화를 통해 사용자의 학습 방향, 동기, 관심 분야, 경험 수준, 학습 목표를 깊이 파악합니다.

대화 흐름 가이드:
1단계 (1~2번째 메시지): 학습을 시작하려는 동기와 배경을 파악
2단계 (3~4번째 메시지): 관심 있는 보안 세부 분야와 이유 탐색
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

function getFallbackAnalysis(history) {
  const allAnswers = history.map((h) => h.answer).join(' ')
  let profileName = '보안 탐색자'
  let profileDesc = '다양한 보안 분야를 탐색하고 있는 타입입니다.'

  if (allAnswers.includes('보안') || allAnswers.includes('해킹')) {
    profileName = '보안 전문가 지망생'
    profileDesc = '보안 분야에 높은 관심을 가지고 있는 타입입니다.'
  }

  const quizResults = history.filter((h) => h.correct !== undefined)
  const correctCount = quizResults.filter((h) => h.correct).length
  const level = quizResults.length === 0 ? '측정 불가'
    : correctCount / quizResults.length >= 0.7 ? '상급'
    : correctCount / quizResults.length >= 0.4 ? '중급' : '초급'

  return {
    profileName,
    profileDesc,
    level,
    interests: ['보안', '학습'],
    strengths: ['보안에 대한 관심', '학습 의지', '자기 분석 능력'],
    improvements: ['실습 경험 확대', '세부 분야 깊이 강화', '최신 트렌드 파악'],
    recommendations: [
      { title: '보안 기초 완성', desc: '네트워크, 시스템, 웹 보안 기초 역량 구축' },
      { title: 'CTF 실전 대비', desc: '다양한 보안 분야를 아우르는 CTF 풀이 역량' },
      { title: '보안 자격증 취득', desc: '정보보안기사, CISSP 등 자격증 대비' },
    ],
    radarData: [
      { subject: '웹 보안', score: 50 },
      { subject: '네트워크', score: 50 },
      { subject: '시스템', score: 50 },
      { subject: '암호학', score: 40 },
      { subject: '포렌식', score: 30 },
    ],
  }
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function LevelTest() {
  const [step, setStep] = useState('intro')     // 'intro' | 'quiz' | 'chat' | 'analyzing' | 'results'
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
    setStep('quiz')
    setQIdx(0)
    setHistory([])
    setCurrentQ(initialQuestions[0])
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
    if (nextIdx < initialQuestions.length) {
      setCurrentQ(initialQuestions[nextIdx])
    } else {
      setIsLoading(true)
      const aiQ = await generateNextQuestion(newHistory)
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
    const result = await generateAnalysis(finalHistory)
    setAnalysis(result || getFallbackAnalysis(finalHistory))
    setStep('results')
  }

  /* ----- Start chat mode ----- */
  const startChat = async () => {
    setStep('chat')
    setChatMessages([])
    setChatUserMsgCount(0)
    setIsChatLoading(true)

    const greeting = await generateChatResponse([
      { role: 'user', content: '안녕하세요, 학습 상담을 시작하고 싶습니다.' },
    ])

    const firstMsg = greeting || '안녕하세요! 사이버 보안 학습 상담사입니다. 현재 IT 분야에서 어떤 부분에 가장 관심이 있으신가요? 보안, 개발, 인프라 등 편하게 말씀해주세요!'
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

    const aiReply = await generateChatResponse(newMessages)
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
