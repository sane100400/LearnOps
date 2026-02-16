import { useState, useEffect, useRef } from 'react'
import {
  Shield, Users, BookOpen, Settings, Plus, Search, Filter,
  ArrowLeft, Edit3, Trash2, Save, Send, CheckCircle2, Clock,
  TrendingUp, Terminal, MessageSquare, ChevronRight, Loader2,
  Mail, AlertCircle, Globe, Network, Monitor, Lock, Cloud, Bug,
  BarChart3, Eye, X,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'

/* ===================================================================
   CONFIG
   =================================================================== */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

/* ===================================================================
   CATEGORIES
   =================================================================== */

const CATEGORIES = {
  web:       { label: '웹 보안',      color: '#4F46E5', icon: Globe },
  network:   { label: '네트워크',     color: '#06B6D4', icon: Network },
  system:    { label: '시스템',       color: '#10B981', icon: Monitor },
  reversing: { label: '리버싱',       color: '#F59E0B', icon: Eye },
  crypto:    { label: '암호학',       color: '#8B5CF6', icon: Lock },
  cloud:     { label: '클라우드',     color: '#EC4899', icon: Cloud },
  malware:   { label: '악성코드',     color: '#EF4444', icon: Bug },
}

const DIFFICULTY_COLORS = {
  '초급': '#10B981',
  '중급': '#F59E0B',
  '고급': '#EF4444',
}

/* ===================================================================
   MOCK DATA
   =================================================================== */

const MOCK_PROBLEMS = [
  {
    id: 1, title: 'SQL Injection 기초', category: 'web', difficulty: '초급',
    status: 'active', description: 'HTTP 요청 파라미터를 통한 SQL Injection 공격을 이해하고, UNION 기반 공격으로 데이터를 추출하는 실습입니다.',
    learningPoints: ['SQL Injection 원리 이해', 'UNION 기반 공격 기법', '입력값 검증의 중요성'],
    assignedCount: 18, completionRate: 72, createdAt: '2026-01-15', timeLimit: 60,
  },
  {
    id: 2, title: 'XSS 공격과 방어', category: 'web', difficulty: '중급',
    status: 'active', description: 'Stored XSS와 Reflected XSS의 차이를 이해하고, CSP 헤더를 활용한 방어 기법을 학습합니다.',
    learningPoints: ['XSS 유형 구분', 'DOM 조작 기법', 'CSP 설정 방법'],
    assignedCount: 12, completionRate: 58, createdAt: '2026-01-20', timeLimit: 90,
  },
  {
    id: 3, title: 'Linux 권한 상승', category: 'system', difficulty: '고급',
    status: 'active', description: 'SUID 비트, cron job 악용, 커널 취약점을 통한 권한 상승 기법을 실습합니다.',
    learningPoints: ['SUID/SGID 이해', 'Cron job 악용', '커널 익스플로잇 기초'],
    assignedCount: 8, completionRate: 35, createdAt: '2026-02-01', timeLimit: 120,
  },
  {
    id: 4, title: 'ARP 스푸핑 실습', category: 'network', difficulty: '중급',
    status: 'draft', description: 'ARP 프로토콜의 취약점을 이용한 중간자 공격(MITM)을 실습하고, 탐지 및 방어 방법을 학습합니다.',
    learningPoints: ['ARP 프로토콜 이해', 'MITM 공격 원리', '네트워크 모니터링'],
    assignedCount: 0, completionRate: 0, createdAt: '2026-02-05', timeLimit: 90,
  },
  {
    id: 5, title: '악성코드 정적 분석', category: 'malware', difficulty: '고급',
    status: 'archived', description: 'PE 파일 구조를 분석하고, 문자열 추출 및 API 호출 패턴을 통해 악성코드의 행위를 추정하는 실습입니다.',
    learningPoints: ['PE 파일 구조', '정적 분석 도구 활용', '악성코드 행위 분류'],
    assignedCount: 5, completionRate: 80, createdAt: '2025-12-10', timeLimit: 150,
  },
]

const MOCK_LEARNERS = [
  {
    id: 1, name: '김보안', email: 'kim@example.com', level: '고급',
    avatar: '김', joinDate: '2025-09-01', group: 'A팀',
    completedLabs: 28, totalAssigned: 32, avgScore: 92, lastActive: '2시간 전',
    interests: ['웹 보안', '모의해킹'],
    labHistory: [
      { name: 'SQL Injection 기초', score: 95, completedAt: '2026-02-14', duration: '45분' },
      { name: 'XSS 공격과 방어', score: 88, completedAt: '2026-02-10', duration: '72분' },
      { name: 'Linux 권한 상승', score: 91, completedAt: '2026-02-05', duration: '95분' },
    ],
  },
  {
    id: 2, name: '이해커', email: 'lee@example.com', level: '중급',
    avatar: '이', joinDate: '2025-10-15', group: 'A팀',
    completedLabs: 19, totalAssigned: 28, avgScore: 78, lastActive: '5시간 전',
    interests: ['네트워크 보안', '포렌식'],
    labHistory: [
      { name: 'ARP 스푸핑 실습', score: 82, completedAt: '2026-02-12', duration: '68분' },
      { name: 'SQL Injection 기초', score: 75, completedAt: '2026-02-08', duration: '55분' },
    ],
  },
  {
    id: 3, name: '박분석', email: 'park@example.com', level: '중급',
    avatar: '박', joinDate: '2025-11-20', group: 'B팀',
    completedLabs: 15, totalAssigned: 24, avgScore: 71, lastActive: '1일 전',
    interests: ['악성코드 분석', '리버싱'],
    labHistory: [
      { name: '악성코드 정적 분석', score: 85, completedAt: '2026-02-11', duration: '120분' },
    ],
  },
  {
    id: 4, name: '최방어', email: 'choi@example.com', level: '초급',
    avatar: '최', joinDate: '2026-01-05', group: 'B팀',
    completedLabs: 8, totalAssigned: 20, avgScore: 65, lastActive: '3일 전',
    interests: ['시스템 보안', '클라우드'],
    labHistory: [
      { name: 'SQL Injection 기초', score: 68, completedAt: '2026-02-09', duration: '58분' },
    ],
  },
  {
    id: 5, name: '정관제', email: 'jung@example.com', level: '초급',
    avatar: '정', joinDate: '2026-02-01', group: 'C팀',
    completedLabs: 3, totalAssigned: 12, avgScore: 60, lastActive: '30분 전',
    interests: ['보안 관제', '로그 분석'],
    labHistory: [],
  },
]

const WEEKLY_CHART_DATA = [
  { day: 'Mon', 실습완료: 14, 문제생성: 2 },
  { day: 'Tue', 실습완료: 22, 문제생성: 1 },
  { day: 'Wed', 실습완료: 11, 문제생성: 3 },
  { day: 'Thu', 실습완료: 28, 문제생성: 0 },
  { day: 'Fri', 실습완료: 35, 문제생성: 2 },
  { day: 'Sat', 실습완료: 18, 문제생성: 1 },
  { day: 'Sun', 실습완료: 8, 문제생성: 0 },
]

const RECENT_ACTIVITIES = [
  { icon: CheckCircle2, color: '#10B981', text: '김보안님이 "SQL Injection 기초" 실습을 95점으로 완료했습니다.', time: '2시간 전', type: '실습 완료' },
  { icon: Users, color: '#06B6D4', text: '정관제님이 플랫폼에 새로 등록했습니다.', time: '5시간 전', type: '신규 등록' },
  { icon: Terminal, color: '#4F46E5', text: '"XSS 공격과 방어" Lab 환경이 정상 가동 중입니다.', time: '6시간 전', type: '환경 알림' },
  { icon: TrendingUp, color: '#F59E0B', text: '이해커님이 Level 2에서 Level 3로 승급했습니다.', time: '1일 전', type: '레벨업' },
  { icon: BookOpen, color: '#8B5CF6', text: '새 문제 "Linux 권한 상승"이 8명에게 배정되었습니다.', time: '2일 전', type: '문제 배정' },
]

/* ===================================================================
   AI Problem Generation API
   =================================================================== */

async function generateChatResponseForProblem(messages) {
  if (!OPENAI_API_KEY) return null

  const systemPrompt = `당신은 사이버 보안 실습 문제 설계 전문가입니다. 친근하고 전문적인 톤으로 대화하세요.

목표: 대화를 통해 실습 문제의 주제, 난이도, 학습 목표, 시나리오, 풀이 단계를 수집합니다.

규칙:
- 한 번에 1~2개의 질문만 하세요
- 문제의 주제, 대상 분야, 난이도, 학습 목표를 자연스럽게 파악하세요
- 실제 보안 시나리오를 기반으로 현실적인 문제를 설계하도록 도와주세요
- 답변은 2~4문장으로 간결하게 유지하세요`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.8,
        max_tokens: 400,
      }),
    })
    if (!response.ok) return null
    const data = await response.json()
    return data.choices?.[0]?.message?.content?.trim() || null
  } catch {
    return null
  }
}

async function generateProblemFromChat(messages) {
  if (!OPENAI_API_KEY) return null

  const systemPrompt = `대화 내용을 바탕으로 구조화된 실습 문제를 JSON으로 생성하세요.

반드시 아래 형식으로만 응답하세요:
{
  "title": "문제 제목",
  "category": "web|network|system|reversing|crypto|cloud|malware 중 택 1",
  "difficulty": "초급|중급|고급 중 택 1",
  "description": "문제 설명 (2~3문장)",
  "learningPoints": ["학습 포인트 1", "학습 포인트 2", "학습 포인트 3"],
  "timeLimit": 60
}`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...messages, { role: 'user', content: '위 대화 내용을 바탕으로 실습 문제를 JSON으로 생성해주세요.' }],
        temperature: 0.7,
        max_tokens: 600,
      }),
    })
    if (!response.ok) return null
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content?.trim()
    if (!content) return null
    let jsonStr = content
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim()
    return JSON.parse(jsonStr)
  } catch {
    return null
  }
}

/* ===================================================================
   Custom Tooltip (recharts)
   =================================================================== */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <p style={{ color: '#0F172A', fontWeight: 600, marginBottom: 6, fontSize: '0.85rem' }}>{label}</p>
      {payload.map((e, i) => (
        <p key={i} style={{ color: e.color, fontSize: '0.8rem', margin: '2px 0' }}>{e.name}: {e.value}</p>
      ))}
    </div>
  )
}

/* ===================================================================
   MAIN COMPONENT
   =================================================================== */

export default function Admin() {
  // Tab
  const [activeTab, setActiveTab] = useState('overview')

  // Problems
  const [problems, setProblems] = useState(MOCK_PROBLEMS)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [problemView, setProblemView] = useState('list') // 'list' | 'detail' | 'create'
  const [problemFilter, setProblemFilter] = useState({ category: 'all', status: 'all', difficulty: 'all' })

  // AI Wizard
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [wizardStep, setWizardStep] = useState('chat') // 'chat' | 'review' | 'done'
  const [generatedProblem, setGeneratedProblem] = useState(null)

  // Learners
  const [selectedLearner, setSelectedLearner] = useState(null)
  const [learnerView, setLearnerView] = useState('list') // 'list' | 'detail'
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')

  // Settings
  const [orgName, setOrgName] = useState('사이버 보안 교육팀')
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitedList, setInvitedList] = useState([
    { email: 'new1@example.com', date: '2026-02-14', status: '대기중' },
    { email: 'new2@example.com', date: '2026-02-10', status: '수락됨' },
  ])
  const [defaultDifficulty, setDefaultDifficulty] = useState('중급')
  const [labTimeout, setLabTimeout] = useState(120)
  const [notifEnabled, setNotifEnabled] = useState(true)

  const chatEndRef = useRef(null)
  const chatInputRef = useRef(null)

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isChatLoading])

  /* -------- Tab definitions -------- */
  const tabs = [
    { id: 'overview', label: '대시보드', icon: BarChart3 },
    { id: 'problems', label: '문제 관리', icon: BookOpen },
    { id: 'learners', label: '학습자 관리', icon: Users },
    { id: 'settings', label: '조직 설정', icon: Settings },
  ]

  /* -------- Problem helpers -------- */
  const filteredProblems = problems.filter(p => {
    if (problemFilter.category !== 'all' && p.category !== problemFilter.category) return false
    if (problemFilter.status !== 'all' && p.status !== problemFilter.status) return false
    if (problemFilter.difficulty !== 'all' && p.difficulty !== problemFilter.difficulty) return false
    return true
  })

  const openProblemDetail = (p) => {
    setSelectedProblem({ ...p })
    setProblemView('detail')
  }

  const saveProblem = () => {
    if (!selectedProblem) return
    setProblems(prev => prev.map(p => p.id === selectedProblem.id ? selectedProblem : p))
    setProblemView('list')
    setSelectedProblem(null)
  }

  const deleteProblem = (id) => {
    setProblems(prev => prev.filter(p => p.id !== id))
    setProblemView('list')
    setSelectedProblem(null)
  }

  /* -------- AI Chat for problem creation -------- */
  const startProblemWizard = async () => {
    setProblemView('create')
    setWizardStep('chat')
    setChatMessages([])
    setChatInput('')
    setGeneratedProblem(null)
    setIsChatLoading(true)

    const greeting = await generateChatResponseForProblem([
      { role: 'user', content: '새로운 실습 문제를 만들고 싶습니다.' },
    ])
    const firstMsg = greeting || '안녕하세요! 실습 문제 설계를 도와드리겠습니다. 어떤 보안 분야의 문제를 만들고 싶으신가요? (예: 웹 보안, 네트워크, 시스템, 리버싱, 암호학, 클라우드, 악성코드)'
    setChatMessages([{ role: 'assistant', content: firstMsg }])
    setIsChatLoading(false)
  }

  const sendProblemChat = async () => {
    const msg = chatInput.trim()
    if (!msg || isChatLoading) return

    const userMsg = { role: 'user', content: msg }
    const newMsgs = [...chatMessages, userMsg]
    setChatMessages(newMsgs)
    setChatInput('')
    setIsChatLoading(true)

    const reply = await generateChatResponseForProblem(newMsgs)
    const replyMsg = reply || '좋은 아이디어네요! 좀 더 구체적으로 말씀해주시겠어요?'
    setChatMessages(prev => [...prev, { role: 'assistant', content: replyMsg }])
    setIsChatLoading(false)
  }

  const generateProblem = async () => {
    setIsChatLoading(true)
    const result = await generateProblemFromChat(chatMessages)
    if (result) {
      setGeneratedProblem(result)
      setWizardStep('review')
    } else {
      // Fallback: manual form
      setGeneratedProblem({
        title: '', category: 'web', difficulty: '중급',
        description: '', learningPoints: ['', '', ''], timeLimit: 60,
      })
      setWizardStep('review')
    }
    setIsChatLoading(false)
  }

  const saveGeneratedProblem = () => {
    if (!generatedProblem) return
    const newProblem = {
      ...generatedProblem,
      id: Math.max(...problems.map(p => p.id), 0) + 1,
      status: 'draft',
      assignedCount: 0,
      completionRate: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setProblems(prev => [...prev, newProblem])
    setWizardStep('done')
  }

  /* -------- Learner helpers -------- */
  const filteredLearners = MOCK_LEARNERS.filter(l => {
    if (filterLevel !== 'all' && l.level !== filterLevel) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)
    }
    return true
  })

  /* -------- Settings helpers -------- */
  const sendInvite = () => {
    if (!inviteEmail.trim()) return
    setInvitedList(prev => [...prev, { email: inviteEmail.trim(), date: new Date().toISOString().split('T')[0], status: '대기중' }])
    setInviteEmail('')
  }

  /* -------- Computed stats -------- */
  const statsData = [
    { label: '총 학습자', value: `${MOCK_LEARNERS.length}명`, icon: Users, color: '#4F46E5', bg: 'rgba(79,70,229,0.12)', change: '+1 이번 주' },
    { label: '활성 문제', value: `${problems.filter(p => p.status === 'active').length}개`, icon: BookOpen, color: '#06B6D4', bg: 'rgba(6,182,212,0.12)', change: `총 ${problems.length}개` },
    { label: '평균 완료율', value: `${Math.round(problems.filter(p => p.status === 'active').reduce((s, p) => s + p.completionRate, 0) / Math.max(problems.filter(p => p.status === 'active').length, 1))}%`, icon: TrendingUp, color: '#10B981', bg: 'rgba(16,185,129,0.12)', change: '+5% 상승' },
    { label: '실행 중 Lab', value: '3개', icon: Terminal, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', change: '정상 가동' },
  ]

  const userMsgCount = chatMessages.filter(m => m.role === 'user').length

  /* ===================================================================
     RENDER
     =================================================================== */

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="dashboard-content">
        {/* Header */}
        <div style={st.header}>
          <div>
            <h1 style={st.pageTitle}>관리자 콘솔</h1>
            <p style={st.welcomeMsg}>조직의 학습 환경을 관리하고, AI와 함께 실습 문제를 설계하세요.</p>
          </div>
          <div style={st.dateBadge}>
            <Clock size={14} />
            <span>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
          </div>
        </div>

        {/* Tab bar */}
        <div style={st.tabBar} className="admin-tab-bar">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setProblemView('list'); setLearnerView('list') }}
                style={{ ...st.tabBtn, ...(isActive ? st.tabBtnActive : {}) }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* ============================================================
           TAB 1: OVERVIEW
           ============================================================ */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div style={st.statsGrid} className="admin-stats-grid">
              {statsData.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <Card key={i} style={{ padding: '24px' }}>
                    <div style={st.statCard}>
                      <div style={st.statTop}>
                        <div style={{ ...st.statIconWrap, background: stat.bg, color: stat.color }}>
                          <Icon size={22} />
                        </div>
                        <span style={st.statChange}>{stat.change}</span>
                      </div>
                      <div style={st.statValue}>{stat.value}</div>
                      <div style={st.statLabel}>{stat.label}</div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Weekly Chart */}
            <Card style={{ padding: '28px', marginBottom: '24px' }}>
              <h3 style={st.sectionHeading}>주간 활동 현황</h3>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={WEEKLY_CHART_DATA} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="실습완료" fill="#4F46E5" radius={[6, 6, 0, 0]} maxBarSize={32} />
                    <Bar dataKey="문제생성" fill="#06B6D4" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={st.chartLegend}>
                <div style={st.legendItem}><div style={{ ...st.legendDot, background: '#4F46E5' }} /><span>실습완료 (건)</span></div>
                <div style={st.legendItem}><div style={{ ...st.legendDot, background: '#06B6D4' }} /><span>문제생성 (건)</span></div>
              </div>
            </Card>

            {/* Recent Activity */}
            <h3 style={st.sectionHeading}>최근 활동</h3>
            <Card style={{ padding: 0, overflow: 'hidden', marginBottom: '32px' }} hover={false}>
              {RECENT_ACTIVITIES.map((act, i) => {
                const Icon = act.icon
                return (
                  <div key={i} style={{ ...st.activityItem, borderBottom: i < RECENT_ACTIVITIES.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                    <div style={{ ...st.activityIconWrap, background: `${act.color}15`, color: act.color }}>
                      <Icon size={16} />
                    </div>
                    <div style={st.activityContent}>
                      <span style={st.activityBadge}>{act.type}</span>
                      <p style={st.activityText}>{act.text}</p>
                    </div>
                    <div style={st.activityTime}>
                      <Clock size={12} />
                      <span>{act.time}</span>
                    </div>
                  </div>
                )
              })}
            </Card>
          </>
        )}

        {/* ============================================================
           TAB 2: PROBLEMS
           ============================================================ */}
        {activeTab === 'problems' && (
          <>
            {/* --- Problem List --- */}
            {problemView === 'list' && (
              <>
                <div style={st.toolBar}>
                  <div style={st.filterRow} className="admin-filter-row">
                    <select style={st.filterSelect} value={problemFilter.category} onChange={e => setProblemFilter(f => ({ ...f, category: e.target.value }))}>
                      <option value="all">전체 카테고리</option>
                      {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <select style={st.filterSelect} value={problemFilter.status} onChange={e => setProblemFilter(f => ({ ...f, status: e.target.value }))}>
                      <option value="all">전체 상태</option>
                      <option value="active">활성</option>
                      <option value="draft">초안</option>
                      <option value="archived">보관</option>
                    </select>
                    <select style={st.filterSelect} value={problemFilter.difficulty} onChange={e => setProblemFilter(f => ({ ...f, difficulty: e.target.value }))}>
                      <option value="all">전체 난이도</option>
                      <option value="초급">초급</option>
                      <option value="중급">중급</option>
                      <option value="고급">고급</option>
                    </select>
                  </div>
                  <Button onClick={startProblemWizard}>
                    <Plus size={16} /> 새 문제 만들기
                  </Button>
                </div>

                <div style={st.cardGrid} className="admin-card-grid">
                  {filteredProblems.map(p => {
                    const cat = CATEGORIES[p.category] || CATEGORIES.web
                    const CatIcon = cat.icon
                    return (
                      <Card key={p.id} style={{ padding: '24px', cursor: 'pointer' }} onClick={() => openProblemDetail(p)}>
                        <div style={st.problemCardTop}>
                          <span style={{ ...st.categoryBadge, background: `${cat.color}15`, color: cat.color }}>
                            <CatIcon size={12} /> {cat.label}
                          </span>
                          <span style={{ ...st.statusBadge, ...(p.status === 'active' ? st.statusActive : p.status === 'draft' ? st.statusDraft : st.statusArchived) }}>
                            {p.status === 'active' ? '활성' : p.status === 'draft' ? '초안' : '보관'}
                          </span>
                        </div>
                        <h4 style={st.problemTitle}>{p.title}</h4>
                        <div style={st.problemMeta}>
                          <span style={{ ...st.diffBadge, color: DIFFICULTY_COLORS[p.difficulty] }}>{p.difficulty}</span>
                          <span style={st.problemMetaText}>{p.assignedCount}명 배정</span>
                        </div>
                        <div style={st.progressWrap}>
                          <div style={st.progressBarBg}>
                            <div style={{ ...st.progressBarFill, width: `${p.completionRate}%` }} />
                          </div>
                          <span style={st.progressPercent}>{p.completionRate}%</span>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </>
            )}

            {/* --- Problem Detail --- */}
            {problemView === 'detail' && selectedProblem && (
              <div style={st.detailWrap}>
                <button onClick={() => { setProblemView('list'); setSelectedProblem(null) }} style={st.backBtn}>
                  <ArrowLeft size={16} /> 목록으로
                </button>

                <Card hover={false} style={{ padding: '32px', marginBottom: '20px' }}>
                  <div style={st.detailField}>
                    <label style={st.fieldLabel}>제목</label>
                    <input style={st.fieldInput} value={selectedProblem.title} onChange={e => setSelectedProblem(p => ({ ...p, title: e.target.value }))} />
                  </div>

                  <div style={st.fieldRow}>
                    <div style={st.detailField}>
                      <label style={st.fieldLabel}>카테고리</label>
                      <select style={st.fieldInput} value={selectedProblem.category} onChange={e => setSelectedProblem(p => ({ ...p, category: e.target.value }))}>
                        {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </div>
                    <div style={st.detailField}>
                      <label style={st.fieldLabel}>난이도</label>
                      <select style={st.fieldInput} value={selectedProblem.difficulty} onChange={e => setSelectedProblem(p => ({ ...p, difficulty: e.target.value }))}>
                        <option value="초급">초급</option>
                        <option value="중급">중급</option>
                        <option value="고급">고급</option>
                      </select>
                    </div>
                    <div style={st.detailField}>
                      <label style={st.fieldLabel}>제한시간 (분)</label>
                      <input type="number" style={st.fieldInput} value={selectedProblem.timeLimit} onChange={e => setSelectedProblem(p => ({ ...p, timeLimit: Number(e.target.value) }))} />
                    </div>
                  </div>

                  <div style={st.detailField}>
                    <label style={st.fieldLabel}>설명</label>
                    <textarea style={{ ...st.fieldInput, minHeight: '100px', resize: 'vertical' }} value={selectedProblem.description} onChange={e => setSelectedProblem(p => ({ ...p, description: e.target.value }))} />
                  </div>

                  <div style={st.detailField}>
                    <label style={st.fieldLabel}>학습 포인트</label>
                    {(selectedProblem.learningPoints || []).map((lp, i) => (
                      <input key={i} style={{ ...st.fieldInput, marginBottom: '8px' }} value={lp}
                        onChange={e => {
                          const pts = [...selectedProblem.learningPoints]
                          pts[i] = e.target.value
                          setSelectedProblem(p => ({ ...p, learningPoints: pts }))
                        }}
                      />
                    ))}
                  </div>

                  <div style={st.detailField}>
                    <label style={st.fieldLabel}>배정된 학습자</label>
                    <p style={st.fieldHint}>{selectedProblem.assignedCount}명 배정됨 / 완료율 {selectedProblem.completionRate}%</p>
                  </div>

                  <div style={st.detailActions}>
                    <Button onClick={saveProblem}>
                      <Save size={16} /> 저장
                    </Button>
                    <Button variant="secondary" onClick={() => deleteProblem(selectedProblem.id)} style={{ color: '#EF4444' }}>
                      <Trash2 size={16} /> 삭제
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* --- AI Problem Create Wizard --- */}
            {problemView === 'create' && (
              <div style={st.wizardWrap}>
                <button onClick={() => setProblemView('list')} style={st.backBtn}>
                  <ArrowLeft size={16} /> 목록으로
                </button>

                {/* Step indicator */}
                <div style={st.stepIndicator}>
                  {['AI 채팅', '리뷰', '완료'].map((label, i) => {
                    const stepId = ['chat', 'review', 'done'][i]
                    const isCurrent = wizardStep === stepId
                    const isDone = ['chat', 'review', 'done'].indexOf(wizardStep) > i
                    return (
                      <div key={stepId} style={st.stepItem}>
                        <div style={{ ...st.stepCircle, ...(isCurrent ? st.stepCircleActive : isDone ? st.stepCircleDone : {}) }}>
                          {isDone ? <CheckCircle2 size={14} /> : i + 1}
                        </div>
                        <span style={{ ...st.stepLabel, ...(isCurrent ? { color: '#4F46E5', fontWeight: 700 } : {}) }}>{label}</span>
                        {i < 2 && <div style={st.stepLine} />}
                      </div>
                    )
                  })}
                </div>

                {/* Step 1: Chat */}
                {wizardStep === 'chat' && (
                  <div style={st.chatContainer}>
                    <div style={st.chatHeader}>
                      <div style={st.chatHeaderLeft}>
                        <div style={st.chatAvatar}><MessageSquare size={20} /></div>
                        <div>
                          <div style={st.chatHeaderName}>AI 문제 설계 도우미</div>
                          <div style={st.chatHeaderStatus}>
                            <div style={{ ...st.chatStatusDot, background: isChatLoading ? '#F59E0B' : '#10B981' }} />
                            {isChatLoading ? '생각중...' : '온라인'}
                          </div>
                        </div>
                      </div>
                      {userMsgCount >= 3 && (
                        <button onClick={generateProblem} style={st.chatAnalyzeBtn} disabled={isChatLoading}>
                          문제 생성하기 <ChevronRight size={16} />
                        </button>
                      )}
                    </div>

                    <div style={st.chatMessagesArea}>
                      {chatMessages.map((msg, i) => (
                        <div key={i} style={msg.role === 'user' ? st.chatBubbleRowUser : st.chatBubbleRowAi}>
                          {msg.role === 'assistant' && (
                            <div style={st.chatBubbleAvatar}><MessageSquare size={14} /></div>
                          )}
                          <div style={msg.role === 'user' ? st.chatBubbleUser : st.chatBubbleAi}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isChatLoading && (
                        <div style={st.chatBubbleRowAi}>
                          <div style={st.chatBubbleAvatar}><MessageSquare size={14} /></div>
                          <div style={st.chatBubbleAi}>
                            <div style={st.chatTypingDots}>
                              <div style={{ ...st.dot, animationDelay: '0s' }} />
                              <div style={{ ...st.dot, animationDelay: '0.2s' }} />
                              <div style={{ ...st.dot, animationDelay: '0.4s' }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <div style={st.chatInputBar}>
                      <input
                        ref={chatInputRef}
                        type="text"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendProblemChat() } }}
                        placeholder={OPENAI_API_KEY ? '문제 주제, 난이도, 학습 목표 등을 알려주세요...' : 'AI 키가 없어 수동 입력 모드입니다. 아무 메시지나 3개 입력 후 "문제 생성하기"를 눌러주세요.'}
                        disabled={isChatLoading}
                        style={st.chatInputField}
                      />
                      <button onClick={sendProblemChat} disabled={isChatLoading || !chatInput.trim()} style={{ ...st.chatSendBtn, opacity: isChatLoading || !chatInput.trim() ? 0.5 : 1 }}>
                        <Send size={18} />
                      </button>
                    </div>

                    {userMsgCount < 3 && (
                      <div style={st.chatHint}>
                        문제 생성까지 {3 - userMsgCount}개 메시지 더 필요합니다
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Review */}
                {wizardStep === 'review' && generatedProblem && (
                  <Card hover={false} style={{ padding: '32px' }}>
                    <h3 style={st.sectionHeading}>생성된 문제 리뷰</h3>

                    <div style={st.detailField}>
                      <label style={st.fieldLabel}>제목</label>
                      <input style={st.fieldInput} value={generatedProblem.title} onChange={e => setGeneratedProblem(p => ({ ...p, title: e.target.value }))} />
                    </div>

                    <div style={st.fieldRow}>
                      <div style={st.detailField}>
                        <label style={st.fieldLabel}>카테고리</label>
                        <select style={st.fieldInput} value={generatedProblem.category} onChange={e => setGeneratedProblem(p => ({ ...p, category: e.target.value }))}>
                          {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                      </div>
                      <div style={st.detailField}>
                        <label style={st.fieldLabel}>난이도</label>
                        <select style={st.fieldInput} value={generatedProblem.difficulty} onChange={e => setGeneratedProblem(p => ({ ...p, difficulty: e.target.value }))}>
                          <option value="초급">초급</option>
                          <option value="중급">중급</option>
                          <option value="고급">고급</option>
                        </select>
                      </div>
                      <div style={st.detailField}>
                        <label style={st.fieldLabel}>제한시간 (분)</label>
                        <input type="number" style={st.fieldInput} value={generatedProblem.timeLimit} onChange={e => setGeneratedProblem(p => ({ ...p, timeLimit: Number(e.target.value) }))} />
                      </div>
                    </div>

                    <div style={st.detailField}>
                      <label style={st.fieldLabel}>설명</label>
                      <textarea style={{ ...st.fieldInput, minHeight: '100px', resize: 'vertical' }} value={generatedProblem.description} onChange={e => setGeneratedProblem(p => ({ ...p, description: e.target.value }))} />
                    </div>

                    <div style={st.detailField}>
                      <label style={st.fieldLabel}>학습 포인트</label>
                      {(generatedProblem.learningPoints || []).map((lp, i) => (
                        <input key={i} style={{ ...st.fieldInput, marginBottom: '8px' }} value={lp}
                          onChange={e => {
                            const pts = [...generatedProblem.learningPoints]
                            pts[i] = e.target.value
                            setGeneratedProblem(p => ({ ...p, learningPoints: pts }))
                          }}
                        />
                      ))}
                    </div>

                    <div style={st.detailActions}>
                      <Button onClick={saveGeneratedProblem}>
                        <Save size={16} /> 저장
                      </Button>
                      <Button variant="secondary" onClick={() => { setWizardStep('chat'); setGeneratedProblem(null) }}>
                        다시 생성
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Step 3: Done */}
                {wizardStep === 'done' && (
                  <div style={st.doneCard}>
                    <div style={st.doneIconWrap}>
                      <CheckCircle2 size={48} />
                    </div>
                    <h2 style={st.doneTitle}>문제가 성공적으로 생성되었습니다!</h2>
                    <p style={st.doneDesc}>문제 목록에서 확인하고 학습자에게 배정할 수 있습니다.</p>
                    <Button onClick={() => { setProblemView('list'); setWizardStep('chat'); setChatMessages([]) }}>
                      문제 목록으로 <ChevronRight size={16} />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ============================================================
           TAB 3: LEARNERS
           ============================================================ */}
        {activeTab === 'learners' && (
          <>
            {/* --- Learner List --- */}
            {learnerView === 'list' && (
              <>
                <div style={st.toolBar} className="admin-filter-row">
                  <div style={st.searchWrap}>
                    <Search size={16} style={{ color: '#94A3B8' }} />
                    <input style={st.searchInput} placeholder="이름 또는 이메일 검색..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <div style={st.filterRow}>
                    {['all', '초급', '중급', '고급'].map(lv => (
                      <button key={lv} onClick={() => setFilterLevel(lv)} style={{ ...st.filterChip, ...(filterLevel === lv ? st.filterChipActive : {}) }}>
                        {lv === 'all' ? '전체' : lv}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={st.learnerList}>
                  {filteredLearners.map(l => (
                    <Card key={l.id} style={{ padding: '20px', marginBottom: '12px' }}>
                      <div style={st.learnerRow}>
                        <div style={st.learnerAvatar}>{l.avatar}</div>
                        <div style={st.learnerInfo}>
                          <div style={st.learnerName}>{l.name}</div>
                          <div style={st.learnerEmail}>{l.email}</div>
                        </div>
                        <span style={{ ...st.levelBadge, color: DIFFICULTY_COLORS[l.level] || '#64748B', background: `${DIFFICULTY_COLORS[l.level] || '#64748B'}15` }}>
                          {l.level}
                        </span>
                        <span style={st.learnerGroup}>{l.group}</span>
                        <div style={st.learnerProgress}>
                          <div style={st.progressBarBg}>
                            <div style={{ ...st.progressBarFill, width: `${Math.round((l.completedLabs / Math.max(l.totalAssigned, 1)) * 100)}%` }} />
                          </div>
                          <span style={st.progressPercent}>{Math.round((l.completedLabs / Math.max(l.totalAssigned, 1)) * 100)}%</span>
                        </div>
                        <span style={st.learnerLastActive}>{l.lastActive}</span>
                        <Button size="small" variant="secondary" onClick={e => { e.stopPropagation(); setSelectedLearner(l); setLearnerView('detail') }}>
                          상세
                        </Button>
                      </div>
                    </Card>
                  ))}
                  {filteredLearners.length === 0 && (
                    <Card hover={false} style={{ padding: '40px', textAlign: 'center' }}>
                      <p style={{ color: '#94A3B8' }}>검색 결과가 없습니다.</p>
                    </Card>
                  )}
                </div>
              </>
            )}

            {/* --- Learner Detail --- */}
            {learnerView === 'detail' && selectedLearner && (
              <div style={st.detailWrap}>
                <button onClick={() => { setLearnerView('list'); setSelectedLearner(null) }} style={st.backBtn}>
                  <ArrowLeft size={16} /> 목록으로
                </button>

                {/* Profile Card */}
                <Card hover={false} style={{ padding: '32px', marginBottom: '20px' }}>
                  <div style={st.profileRow}>
                    <div style={st.profileAvatar}>{selectedLearner.avatar}</div>
                    <div>
                      <h2 style={st.profileName}>{selectedLearner.name}</h2>
                      <p style={st.profileEmail}>{selectedLearner.email}</p>
                      <div style={st.profileTags}>
                        <span style={{ ...st.levelBadge, color: DIFFICULTY_COLORS[selectedLearner.level], background: `${DIFFICULTY_COLORS[selectedLearner.level]}15` }}>
                          {selectedLearner.level}
                        </span>
                        <span style={st.groupTag}>{selectedLearner.group}</span>
                        <span style={st.joinDate}>가입일: {selectedLearner.joinDate}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Stats */}
                <div style={st.learnerStatsGrid} className="admin-stats-grid">
                  <Card style={{ padding: '20px' }}>
                    <div style={st.miniStatValue}>{selectedLearner.completedLabs}</div>
                    <div style={st.miniStatLabel}>완료 실습</div>
                  </Card>
                  <Card style={{ padding: '20px' }}>
                    <div style={st.miniStatValue}>{selectedLearner.avgScore}점</div>
                    <div style={st.miniStatLabel}>평균 점수</div>
                  </Card>
                  <Card style={{ padding: '20px' }}>
                    <div style={st.miniStatValue}>{selectedLearner.totalAssigned}</div>
                    <div style={st.miniStatLabel}>배정 실습</div>
                  </Card>
                </div>

                {/* Lab History */}
                <Card hover={false} style={{ padding: '28px' }}>
                  <h3 style={st.sectionHeading}>실습 이력</h3>
                  {selectedLearner.labHistory.length > 0 ? (
                    <div style={st.tableWrap}>
                      <table style={st.table}>
                        <thead>
                          <tr>
                            <th style={st.th}>실습명</th>
                            <th style={st.th}>점수</th>
                            <th style={st.th}>완료일</th>
                            <th style={st.th}>소요시간</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedLearner.labHistory.map((h, i) => (
                            <tr key={i}>
                              <td style={st.td}>{h.name}</td>
                              <td style={st.td}>
                                <span style={{ color: h.score >= 80 ? '#10B981' : h.score >= 60 ? '#F59E0B' : '#EF4444', fontWeight: 700 }}>
                                  {h.score}
                                </span>
                              </td>
                              <td style={st.td}>{h.completedAt}</td>
                              <td style={st.td}>{h.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: '#94A3B8', textAlign: 'center', padding: '24px' }}>실습 이력이 없습니다.</p>
                  )}
                </Card>
              </div>
            )}
          </>
        )}

        {/* ============================================================
           TAB 4: SETTINGS
           ============================================================ */}
        {activeTab === 'settings' && (
          <div style={st.settingsWrap}>
            {/* Org Info */}
            <Card hover={false} style={{ padding: '28px', marginBottom: '20px' }}>
              <h3 style={st.sectionHeading}>조직 정보</h3>
              <div style={st.detailField}>
                <label style={st.fieldLabel}>조직 이름</label>
                <input style={st.fieldInput} value={orgName} onChange={e => setOrgName(e.target.value)} />
              </div>
              <div style={st.detailField}>
                <label style={st.fieldLabel}>플랜</label>
                <div style={st.planBadge}>Enterprise</div>
              </div>
            </Card>

            {/* Member Invite */}
            <Card hover={false} style={{ padding: '28px', marginBottom: '20px' }}>
              <h3 style={st.sectionHeading}>멤버 초대</h3>
              <div style={st.inviteRow}>
                <div style={st.searchWrap}>
                  <Mail size={16} style={{ color: '#94A3B8' }} />
                  <input style={st.searchInput} placeholder="이메일 주소 입력..." value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') sendInvite() }}
                  />
                </div>
                <Button onClick={sendInvite} size="small">
                  <Send size={14} /> 초대
                </Button>
              </div>

              {invitedList.length > 0 && (
                <div style={st.inviteList}>
                  {invitedList.map((inv, i) => (
                    <div key={i} style={st.inviteItem}>
                      <Mail size={14} style={{ color: '#94A3B8' }} />
                      <span style={st.inviteEmail}>{inv.email}</span>
                      <span style={st.inviteDate}>{inv.date}</span>
                      <span style={{ ...st.inviteStatus, color: inv.status === '수락됨' ? '#10B981' : '#F59E0B' }}>{inv.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Default Settings */}
            <Card hover={false} style={{ padding: '28px', marginBottom: '20px' }}>
              <h3 style={st.sectionHeading}>기본 설정</h3>

              <div style={st.detailField}>
                <label style={st.fieldLabel}>기본 난이도</label>
                <div style={st.radioGroup}>
                  {['초급', '중급', '고급'].map(d => (
                    <button key={d} onClick={() => setDefaultDifficulty(d)} style={{ ...st.radioBtn, ...(defaultDifficulty === d ? st.radioBtnActive : {}) }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div style={st.detailField}>
                <label style={st.fieldLabel}>Lab 세션 타임아웃 (분)</label>
                <input type="number" style={{ ...st.fieldInput, maxWidth: '200px' }} value={labTimeout} onChange={e => setLabTimeout(Number(e.target.value))} />
              </div>

              <div style={st.detailField}>
                <label style={st.fieldLabel}>알림 설정</label>
                <button onClick={() => setNotifEnabled(!notifEnabled)} style={{ ...st.toggleBtn, ...(notifEnabled ? st.toggleBtnOn : {}) }}>
                  <div style={{ ...st.toggleKnob, ...(notifEnabled ? st.toggleKnobOn : {}) }} />
                </button>
                <span style={st.toggleLabel}>{notifEnabled ? '활성화됨' : '비활성화됨'}</span>
              </div>
            </Card>

            {/* Save */}
            <Button size="large">
              <Save size={16} /> 설정 저장
            </Button>
          </div>
        )}
      </main>

      <AdminStyles />
    </div>
  )
}

/* ===================================================================
   AdminStyles — Keyframes + Responsive CSS
   =================================================================== */

function AdminStyles() {
  useEffect(() => {
    if (document.querySelector('[data-admin-styles]')) return
    const el = document.createElement('style')
    el.setAttribute('data-admin-styles', '')
    el.textContent = `
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes dotPulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
      @media (max-width: 1024px) {
        .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .admin-card-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .admin-filter-row { flex-wrap: wrap !important; }
      }
      @media (max-width: 768px) {
        .admin-stats-grid { grid-template-columns: 1fr !important; }
        .admin-card-grid { grid-template-columns: 1fr !important; }
        .admin-tab-bar { overflow-x: auto !important; }
      }
    `
    document.head.appendChild(el)
    return () => {
      const existing = document.querySelector('[data-admin-styles]')
      if (existing) existing.remove()
    }
  }, [])
  return null
}

/* ===================================================================
   STYLES
   =================================================================== */

const st = {
  /* Header */
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  pageTitle: { fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' },
  welcomeMsg: { color: '#64748B', fontSize: '0.95rem' },
  dateBadge: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', color: '#64748B', fontSize: '0.85rem' },

  /* Tabs */
  tabBar: { display: 'flex', gap: '4px', marginBottom: '28px', padding: '4px', background: '#F1F5F9', borderRadius: '12px', width: 'fit-content' },
  tabBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'transparent', color: '#64748B', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease', whiteSpace: 'nowrap' },
  tabBtnActive: { background: '#fff', color: '#4F46E5', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },

  /* Stats */
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' },
  statCard: { display: 'flex', flexDirection: 'column' },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  statIconWrap: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statChange: { fontSize: '0.75rem', color: '#10B981', fontWeight: 600 },
  statValue: { fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' },
  statLabel: { fontSize: '0.85rem', color: '#64748B' },

  /* Section Heading */
  sectionHeading: { fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center' },

  /* Chart */
  chartLegend: { display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.8rem' },
  legendDot: { width: '10px', height: '10px', borderRadius: '3px' },

  /* Activity */
  activityItem: { display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 24px', transition: 'background 0.2s ease' },
  activityIconWrap: { width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  activityContent: { flex: 1, minWidth: 0 },
  activityBadge: { display: 'inline-block', fontSize: '0.7rem', fontWeight: 600, color: '#818CF8', background: 'rgba(79,70,229,0.1)', padding: '2px 8px', borderRadius: '6px', marginBottom: '4px' },
  activityText: { fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  activityTime: { display: 'flex', alignItems: 'center', gap: '4px', color: '#94A3B8', fontSize: '0.75rem', whiteSpace: 'nowrap', flexShrink: 0 },

  /* Toolbar & Filters */
  toolBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' },
  filterRow: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' },
  filterSelect: { padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#fff', color: '#0F172A', fontSize: '0.85rem', fontFamily: 'inherit', cursor: 'pointer', outline: 'none' },
  filterChip: { padding: '8px 16px', borderRadius: '100px', border: '1.5px solid #E2E8F0', background: '#fff', color: '#64748B', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease' },
  filterChipActive: { border: '1.5px solid #4F46E5', color: '#4F46E5', background: 'rgba(79,70,229,0.04)' },

  /* Card Grid */
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' },

  /* Problem Card */
  problemCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  categoryBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 },
  statusBadge: { padding: '3px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600 },
  statusActive: { background: 'rgba(16,185,129,0.1)', color: '#10B981' },
  statusDraft: { background: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  statusArchived: { background: 'rgba(148,163,184,0.1)', color: '#94A3B8' },
  problemTitle: { fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px' },
  problemMeta: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' },
  diffBadge: { fontSize: '0.78rem', fontWeight: 700 },
  problemMetaText: { fontSize: '0.78rem', color: '#94A3B8' },

  /* Progress */
  progressWrap: { display: 'flex', alignItems: 'center', gap: '10px' },
  progressBarBg: { flex: 1, height: '6px', borderRadius: '3px', background: '#E2E8F0', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #4F46E5, #06B6D4)', transition: 'width 0.6s ease' },
  progressPercent: { fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', minWidth: '32px', textAlign: 'right' },

  /* Detail */
  detailWrap: { maxWidth: '800px' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' },
  detailField: { marginBottom: '20px' },
  fieldLabel: { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#64748B', marginBottom: '8px' },
  fieldInput: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#FAFBFC', color: '#0F172A', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s ease', boxSizing: 'border-box' },
  fieldRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  fieldHint: { color: '#94A3B8', fontSize: '0.85rem' },
  detailActions: { display: 'flex', gap: '12px', marginTop: '24px' },

  /* Wizard */
  wizardWrap: { maxWidth: '720px' },
  stepIndicator: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0px', marginBottom: '28px' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  stepCircle: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', background: '#F1F5F9', border: '2px solid #E2E8F0', flexShrink: 0 },
  stepCircleActive: { color: '#fff', background: '#4F46E5', border: '2px solid #4F46E5' },
  stepCircleDone: { color: '#fff', background: '#10B981', border: '2px solid #10B981' },
  stepLabel: { fontSize: '0.82rem', fontWeight: 500, color: '#94A3B8', whiteSpace: 'nowrap' },
  stepLine: { width: '40px', height: '2px', background: '#E2E8F0', margin: '0 8px' },

  /* Chat (reused from LevelTest) */
  chatContainer: { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px - 260px)', minHeight: '400px' },
  chatHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px 16px 0 0', borderBottom: 'none' },
  chatHeaderLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  chatAvatar: { width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  chatHeaderName: { fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' },
  chatHeaderStatus: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 },
  chatStatusDot: { width: '6px', height: '6px', borderRadius: '50%' },
  chatAnalyzeBtn: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '8px 16px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  chatMessagesArea: { flex: 1, overflowY: 'auto', padding: '24px 20px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderTop: 'none', borderBottom: 'none', display: 'flex', flexDirection: 'column', gap: '16px' },
  chatBubbleRowAi: { display: 'flex', alignItems: 'flex-end', gap: '8px', maxWidth: '80%' },
  chatBubbleRowUser: { display: 'flex', justifyContent: 'flex-end', maxWidth: '80%', marginLeft: 'auto' },
  chatBubbleAvatar: { width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  chatBubbleAi: { padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: '#fff', border: '1px solid #E2E8F0', color: '#0F172A', fontSize: '0.88rem', lineHeight: 1.6, fontWeight: 500 },
  chatBubbleUser: { padding: '12px 16px', borderRadius: '16px 4px 16px 16px', background: 'linear-gradient(135deg, #4F46E5, #6366F1)', color: '#fff', fontSize: '0.88rem', lineHeight: 1.6, fontWeight: 500 },
  chatTypingDots: { display: 'flex', gap: '6px', padding: '4px 0' },
  chatInputBar: { display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '0 0 16px 16px' },
  chatInputField: { flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none' },
  chatSendBtn: { width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
  chatHint: { textAlign: 'center', color: '#94A3B8', fontSize: '0.78rem', fontWeight: 500, marginTop: '12px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', background: '#4F46E5', animation: 'dotPulse 1.2s ease-in-out infinite' },

  /* Done */
  doneCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 40px', textAlign: 'center' },
  doneIconWrap: { width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(16,185,129,0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' },
  doneTitle: { fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' },
  doneDesc: { color: '#64748B', fontSize: '0.9rem', marginBottom: '24px' },

  /* Search */
  searchWrap: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#fff', flex: 1, maxWidth: '400px' },
  searchInput: { flex: 1, border: 'none', background: 'transparent', color: '#0F172A', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none' },

  /* Learner */
  learnerList: { marginBottom: '32px' },
  learnerRow: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  learnerAvatar: { width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, flexShrink: 0 },
  learnerInfo: { minWidth: '140px' },
  learnerName: { fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' },
  learnerEmail: { fontSize: '0.78rem', color: '#94A3B8' },
  levelBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 },
  learnerGroup: { fontSize: '0.82rem', color: '#64748B', fontWeight: 500, minWidth: '40px' },
  learnerProgress: { display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '120px', maxWidth: '200px' },
  learnerLastActive: { fontSize: '0.78rem', color: '#94A3B8', minWidth: '60px', textAlign: 'right' },

  /* Profile Detail */
  profileRow: { display: 'flex', alignItems: 'center', gap: '20px' },
  profileAvatar: { width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 },
  profileName: { fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' },
  profileEmail: { color: '#94A3B8', fontSize: '0.88rem', marginBottom: '8px' },
  profileTags: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' },
  groupTag: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: '#F1F5F9', color: '#64748B' },
  joinDate: { fontSize: '0.78rem', color: '#94A3B8' },

  learnerStatsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' },
  miniStatValue: { fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  miniStatLabel: { fontSize: '0.82rem', color: '#64748B' },

  /* Table */
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', borderBottom: '1px solid #E2E8F0', whiteSpace: 'nowrap' },
  td: { padding: '14px 16px', fontSize: '0.88rem', color: '#334155', borderBottom: '1px solid #F1F5F9' },

  /* Settings */
  settingsWrap: { maxWidth: '720px' },
  planBadge: { display: 'inline-block', padding: '6px 16px', borderRadius: '100px', background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(6,182,212,0.1))', color: '#4F46E5', fontSize: '0.85rem', fontWeight: 700, border: '1px solid rgba(79,70,229,0.15)' },
  inviteRow: { display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' },
  inviteList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  inviteItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', background: '#F8FAFC' },
  inviteEmail: { flex: 1, fontSize: '0.88rem', color: '#0F172A' },
  inviteDate: { fontSize: '0.78rem', color: '#94A3B8' },
  inviteStatus: { fontSize: '0.78rem', fontWeight: 600 },

  radioGroup: { display: 'flex', gap: '8px' },
  radioBtn: { padding: '8px 20px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#fff', color: '#64748B', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease' },
  radioBtnActive: { border: '1.5px solid #4F46E5', color: '#4F46E5', background: 'rgba(79,70,229,0.04)' },

  toggleBtn: { width: '48px', height: '28px', borderRadius: '14px', border: 'none', background: '#E2E8F0', cursor: 'pointer', position: 'relative', transition: 'background 0.2s ease', padding: 0 },
  toggleBtnOn: { background: '#4F46E5' },
  toggleKnob: { width: '22px', height: '22px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: '3px', transition: 'left 0.2s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' },
  toggleKnobOn: { left: '23px' },
  toggleLabel: { fontSize: '0.82rem', color: '#64748B', marginLeft: '12px', verticalAlign: 'middle' },
}
