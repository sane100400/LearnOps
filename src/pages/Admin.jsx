import { useState, useEffect, useRef } from 'react'
import {
  Shield, Users, BookOpen, Settings, Plus, Search,
  ArrowLeft, Edit3, Trash2, Save, Send, CheckCircle2, Clock,
  TrendingUp, Terminal, MessageSquare, ChevronRight, Loader2,
  Mail, Globe, Network, Monitor, Lock, Cloud, Bug,
  BarChart3, Eye, ChevronDown, ChevronUp, Map, Layers,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'

/* AI calls go through backend proxy at /api/ai/chat */

const CATEGORIES = {
  web: { label: '웹 보안', color: '#4F46E5', icon: Globe },
  network: { label: '네트워크', color: '#06B6D4', icon: Network },
  system: { label: '시스템', color: '#10B981', icon: Monitor },
  reversing: { label: '리버싱', color: '#F59E0B', icon: Eye },
  crypto: { label: '암호학', color: '#8B5CF6', icon: Lock },
  cloud: { label: '클라우드', color: '#EC4899', icon: Cloud },
  malware: { label: '악성코드', color: '#EF4444', icon: Bug },
}
const DIFF_COLORS = { '초급': '#10B981', '중급': '#F59E0B', '고급': '#EF4444' }

/* ===== MOCK DATA ===== */

const MOCK_ROADMAPS = [
  {
    id: 1, title: '웹 보안 입문 로드맵',
    description: '웹 애플리케이션의 주요 취약점을 이해하고 방어 기법을 학습하는 입문 과정입니다.',
    category: 'web', difficulty: '초급', status: 'active',
    assignedCount: 15, completionRate: 65, createdAt: '2026-01-10', estimatedHours: 20,
    stages: [
      { id: 1, title: 'SQL Injection 이해', description: 'SQL Injection의 원리와 기본적인 공격/방어 기법을 학습합니다.', order: 1, problems: [
        { id: 101, title: 'SQL Injection 기초 실습', category: 'web', difficulty: '초급', description: 'UNION 기반 공격으로 데이터를 추출합니다.', learningPoints: ['SQL Injection 원리', 'UNION 공격', '입력값 검증'], timeLimit: 45, completionRate: 78 },
        { id: 102, title: 'Blind SQL Injection', category: 'web', difficulty: '초급', description: 'Boolean/Time 기반 Blind SQLi를 수행합니다.', learningPoints: ['Boolean-based Blind', 'Time-based Blind', 'SQLMap 활용'], timeLimit: 60, completionRate: 62 },
      ]},
      { id: 2, title: 'XSS 공격과 방어', description: 'Cross-Site Scripting의 유형별 공격 기법과 CSP 방어 방법을 실습합니다.', order: 2, problems: [
        { id: 103, title: 'Reflected XSS 실습', category: 'web', difficulty: '초급', description: 'URL 파라미터를 통한 Reflected XSS 공격을 수행합니다.', learningPoints: ['Reflected XSS 원리', 'HTML 인코딩', '입력 필터링'], timeLimit: 40, completionRate: 71 },
        { id: 104, title: 'Stored XSS와 CSP', category: 'web', difficulty: '중급', description: '게시판 환경에서 Stored XSS를 실습하고 CSP로 방어합니다.', learningPoints: ['Stored XSS', 'DOM 조작', 'CSP 정책'], timeLimit: 60, completionRate: 55 },
      ]},
      { id: 3, title: '인증/인가 취약점', description: '세션 관리, JWT 취약점 등 인증/인가 관련 취약점을 학습합니다.', order: 3, problems: [
        { id: 105, title: '세션 하이재킹 실습', category: 'web', difficulty: '중급', description: '쿠키 기반 세션 관리의 취약점을 이해합니다.', learningPoints: ['세션 관리 원리', '쿠키 보안 속성', 'HttpOnly/Secure'], timeLimit: 50, completionRate: 48 },
      ]},
    ],
  },
  {
    id: 2, title: '네트워크 보안 실무',
    description: '네트워크 프로토콜의 취약점을 이해하고 침투 테스트 기법을 학습합니다.',
    category: 'network', difficulty: '중급', status: 'active',
    assignedCount: 8, completionRate: 42, createdAt: '2026-01-25', estimatedHours: 30,
    stages: [
      { id: 4, title: '네트워크 기초와 스캐닝', description: 'TCP/IP 기초와 Nmap 네트워크 스캐닝을 학습합니다.', order: 1, problems: [
        { id: 201, title: 'Nmap 포트 스캐닝', category: 'network', difficulty: '초급', description: 'Nmap으로 대상 시스템의 열린 포트와 서비스를 탐색합니다.', learningPoints: ['TCP/UDP 스캔', 'SYN/ACK 원리', '서비스 버전 탐지'], timeLimit: 40, completionRate: 68 },
        { id: 202, title: '서브넷 분석과 호스트 탐색', category: 'network', difficulty: '중급', description: '서브넷 계산과 ARP/ICMP를 활용한 호스트 탐색을 실습합니다.', learningPoints: ['서브넷 마스크', 'ARP 탐색', 'ICMP 우회'], timeLimit: 50, completionRate: 45 },
      ]},
      { id: 5, title: 'MITM 공격과 방어', description: '중간자 공격의 원리와 탐지/방어 방법을 학습합니다.', order: 2, problems: [
        { id: 203, title: 'ARP 스푸핑 실습', category: 'network', difficulty: '중급', description: 'ARP 취약점을 이용한 MITM 공격을 수행하고 탐지합니다.', learningPoints: ['ARP 프로토콜', 'MITM 원리', 'ARP Guard'], timeLimit: 60, completionRate: 38 },
      ]},
    ],
  },
  {
    id: 3, title: '악성코드 분석 마스터',
    description: 'PE 파일 분석부터 동적 분석까지, 악성코드 분석의 전체 과정을 학습합니다.',
    category: 'malware', difficulty: '고급', status: 'draft',
    assignedCount: 0, completionRate: 0, createdAt: '2026-02-05', estimatedHours: 40,
    stages: [
      { id: 6, title: '정적 분석 기초', description: 'PE 파일 구조와 문자열/API 분석을 통한 정적 분석을 학습합니다.', order: 1, problems: [
        { id: 301, title: 'PE 파일 구조 분석', category: 'malware', difficulty: '중급', description: 'PE 헤더, 섹션 테이블, IAT 등을 분석합니다.', learningPoints: ['PE 헤더', '섹션 분석', 'Import/Export'], timeLimit: 90, completionRate: 0 },
      ]},
      { id: 7, title: '동적 분석', description: '샌드박스에서 악성코드 실행 행위를 모니터링합니다.', order: 2, problems: [
        { id: 302, title: '프로세스 모니터링 실습', category: 'malware', difficulty: '고급', description: 'Process Monitor, Wireshark로 악성코드 행위를 분석합니다.', learningPoints: ['프로세스 모니터링', '네트워크 분석', '행위 기반 탐지'], timeLimit: 120, completionRate: 0 },
      ]},
    ],
  },
]

const MOCK_LEARNERS = [
  { id: 1, name: '김보안', email: 'kim@example.com', level: '고급', avatar: '김', joinDate: '2025-09-01', group: 'A팀', completedLabs: 28, totalAssigned: 32, avgScore: 92, lastActive: '2시간 전', labHistory: [
    { name: 'SQL Injection 기초', score: 95, completedAt: '2026-02-14', duration: '45분' },
    { name: 'XSS 공격과 방어', score: 88, completedAt: '2026-02-10', duration: '72분' },
    { name: 'Linux 권한 상승', score: 91, completedAt: '2026-02-05', duration: '95분' },
  ]},
  { id: 2, name: '이해커', email: 'lee@example.com', level: '중급', avatar: '이', joinDate: '2025-10-15', group: 'A팀', completedLabs: 19, totalAssigned: 28, avgScore: 78, lastActive: '5시간 전', labHistory: [
    { name: 'ARP 스푸핑 실습', score: 82, completedAt: '2026-02-12', duration: '68분' },
  ]},
  { id: 3, name: '박분석', email: 'park@example.com', level: '중급', avatar: '박', joinDate: '2025-11-20', group: 'B팀', completedLabs: 15, totalAssigned: 24, avgScore: 71, lastActive: '1일 전', labHistory: [
    { name: '악성코드 정적 분석', score: 85, completedAt: '2026-02-11', duration: '120분' },
  ]},
  { id: 4, name: '최방어', email: 'choi@example.com', level: '초급', avatar: '최', joinDate: '2026-01-05', group: 'B팀', completedLabs: 8, totalAssigned: 20, avgScore: 65, lastActive: '3일 전', labHistory: [] },
  { id: 5, name: '정관제', email: 'jung@example.com', level: '초급', avatar: '정', joinDate: '2026-02-01', group: 'C팀', completedLabs: 3, totalAssigned: 12, avgScore: 60, lastActive: '30분 전', labHistory: [] },
]

const WEEKLY_DATA = [
  { day: 'Mon', 실습완료: 14, 로드맵진행: 5 }, { day: 'Tue', 실습완료: 22, 로드맵진행: 8 },
  { day: 'Wed', 실습완료: 11, 로드맵진행: 3 }, { day: 'Thu', 실습완료: 28, 로드맵진행: 10 },
  { day: 'Fri', 실습완료: 35, 로드맵진행: 12 }, { day: 'Sat', 실습완료: 18, 로드맵진행: 6 },
  { day: 'Sun', 실습완료: 8, 로드맵진행: 2 },
]

const ACTIVITIES = [
  { icon: CheckCircle2, color: '#10B981', text: '김보안님이 "SQL Injection 기초 실습"을 95점으로 완료했습니다.', time: '2시간 전', type: '실습 완료' },
  { icon: BookOpen, color: '#4F46E5', text: '"웹 보안 입문 로드맵"에 새 문제가 추가되었습니다.', time: '4시간 전', type: '문제 추가' },
  { icon: Users, color: '#06B6D4', text: '정관제님이 플랫폼에 새로 등록했습니다.', time: '5시간 전', type: '신규 등록' },
  { icon: Terminal, color: '#F59E0B', text: '"XSS 공격과 방어" Lab 환경이 정상 가동 중입니다.', time: '6시간 전', type: '환경 알림' },
  { icon: TrendingUp, color: '#8B5CF6', text: '이해커님이 "네트워크 보안 실무" Stage 1을 완료했습니다.', time: '1일 전', type: '스테이지 완료' },
]

/* ===== AI API ===== */

const FALLBACK_CHAT = [
  '좋은 생각이네요! 어떤 보안 분야에 중점을 두고 싶으신가요? (웹, 네트워크, 시스템, 악성코드 등)',
  '흥미로운 분야네요! 대상 학습자의 수준은 어느 정도인가요? 초급자인가요, 실무 경험이 있는 분들인가요?',
  '잘 이해했습니다! 로드맵의 기간은 어느 정도로 생각하시나요? 그리고 특별히 포함하고 싶은 주제가 있으신가요?',
  '좋습니다! 충분한 정보가 모였네요. "로드맵 생성하기" 버튼을 눌러주시면 구조화된 로드맵을 만들어 드리겠습니다.',
]

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
  } catch { return null }
}

async function aiChat(messages, systemPrompt) {
  return aiProxy([{ role: 'system', content: systemPrompt }, ...messages], 0.8, 500)
}

async function aiJson(messages, systemPrompt) {
  try {
    const c = await aiProxy([{ role: 'system', content: systemPrompt }, ...messages], 0.7, 2000)
    if (!c) return null
    let j = c; const m = c.match(/```(?:json)?\s*([\s\S]*?)```/); if (m) j = m[1].trim()
    return JSON.parse(j)
  } catch { return null }
}

const ROADMAP_CHAT_PROMPT = `당신은 사이버 보안 학습 로드맵 설계 전문가입니다. 친근하고 전문적인 톤으로 대화하세요.
목표: 대화를 통해 체계적인 학습 로드맵을 설계합니다.
수집할 정보: 학습 대상, 학습 목표, 중점 분야, 기간/속도, 특정 주제
규칙: 한 번에 1~2개 질문, 2~4문장으로 간결하게`

const ROADMAP_GEN_PROMPT = `대화 내용을 바탕으로 학습 로드맵 JSON을 생성하세요.
형식: {"title":"","description":"","category":"web|network|system|reversing|crypto|cloud|malware","difficulty":"초급|중급|고급","estimatedHours":숫자,"stages":[{"title":"Stage 1: ...","description":"...","problems":[{"title":"","category":"","difficulty":"","description":"","learningPoints":["","",""],"timeLimit":60}]}]}
규칙: 3~5 스테이지, 각 1~3문제, 점진적 난이도, 구체적 학습 포인트`

const PROBLEM_CHAT_PROMPT = (rmTitle, stTitle) => `당신은 사이버 보안 실습 문제 설계 전문가입니다.
현재 "${rmTitle}" 로드맵의 "${stTitle}" 스테이지에 문제를 추가합니다.
대화를 통해 문제의 주제, 난이도, 학습 목표를 수집하세요. 2~4문장으로 간결하게.`

const PROBLEM_GEN_PROMPT = `대화 내용을 바탕으로 실습 문제 JSON을 생성하세요.
형식: {"title":"","category":"web|network|system|reversing|crypto|cloud|malware","difficulty":"초급|중급|고급","description":"","learningPoints":["","",""],"timeLimit":60}`

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <p style={{ color: '#0F172A', fontWeight: 600, marginBottom: 6, fontSize: '0.85rem' }}>{label}</p>
      {payload.map((e, i) => <p key={i} style={{ color: e.color, fontSize: '0.8rem', margin: '2px 0' }}>{e.name}: {e.value}</p>)}
    </div>
  )
}

/* ===== MAIN COMPONENT ===== */

export default function Admin() {
  const nextId = useRef(1000)
  const gid = () => ++nextId.current

  const [activeTab, setActiveTab] = useState('overview')

  // Roadmaps
  const [roadmaps, setRoadmaps] = useState(MOCK_ROADMAPS)
  const [rmView, setRmView] = useState('list')
  const [selectedRmId, setSelectedRmId] = useState(null)
  const [rmFilter, setRmFilter] = useState({ category: 'all', status: 'all', difficulty: 'all' })
  const [expandedStages, setExpandedStages] = useState([])
  const [expandedProbId, setExpandedProbId] = useState(null)
  const [editProbData, setEditProbData] = useState(null)
  const [editingHeader, setEditingHeader] = useState(false)
  const [editingStageId, setEditingStageId] = useState(null)

  // Add problem within detail
  const [addProb, setAddProb] = useState(null) // { stageId, mode, step, chatMessages, chatInput, loading, problem }

  // Wizard
  const [wizStep, setWizStep] = useState('chat')
  const [chatMsgs, setChatMsgs] = useState([])
  const [chatIn, setChatIn] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [genRoadmap, setGenRoadmap] = useState(null)

  // Learners
  const [selLearner, setSelLearner] = useState(null)
  const [lnView, setLnView] = useState('list')
  const [searchQ, setSearchQ] = useState('')
  const [filterLv, setFilterLv] = useState('all')

  // Settings
  const [orgName, setOrgName] = useState('사이버 보안 교육팀')
  const [invEmail, setInvEmail] = useState('')
  const [invited, setInvited] = useState([
    { email: 'new1@example.com', date: '2026-02-14', status: '대기중' },
    { email: 'new2@example.com', date: '2026-02-10', status: '수락됨' },
  ])
  const [defDiff, setDefDiff] = useState('중급')
  const [labTimeout, setLabTimeout] = useState(120)
  const [notifOn, setNotifOn] = useState(true)

  const chatEndRef = useRef(null)
  const addChatEndRef = useRef(null)

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMsgs, chatLoading])
  useEffect(() => { addChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [addProb?.chatMessages, addProb?.loading])

  // Computed
  const selRm = roadmaps.find(r => r.id === selectedRmId) || null
  const totalProbs = roadmaps.reduce((s, r) => s + r.stages.reduce((s2, st) => s2 + st.problems.length, 0), 0)
  const activeRms = roadmaps.filter(r => r.status === 'active')
  const avgComp = Math.round(activeRms.reduce((s, r) => s + r.completionRate, 0) / Math.max(activeRms.length, 1))
  const userMsgCount = chatMsgs.filter(m => m.role === 'user').length

  const filteredRms = roadmaps.filter(r => {
    if (rmFilter.category !== 'all' && r.category !== rmFilter.category) return false
    if (rmFilter.status !== 'all' && r.status !== rmFilter.status) return false
    if (rmFilter.difficulty !== 'all' && r.difficulty !== rmFilter.difficulty) return false
    return true
  })

  const filteredLearners = MOCK_LEARNERS.filter(l => {
    if (filterLv !== 'all' && l.level !== filterLv) return false
    if (searchQ) { const q = searchQ.toLowerCase(); return l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) }
    return true
  })

  const statsData = [
    { label: '총 학습자', value: `${MOCK_LEARNERS.length}명`, icon: Users, color: '#4F46E5', bg: 'rgba(79,70,229,0.12)', change: '+1 이번 주' },
    { label: '활성 로드맵', value: `${activeRms.length}개`, icon: Map, color: '#06B6D4', bg: 'rgba(6,182,212,0.12)', change: `총 ${roadmaps.length}개` },
    { label: '총 문제 수', value: `${totalProbs}개`, icon: BookOpen, color: '#10B981', bg: 'rgba(16,185,129,0.12)', change: `${roadmaps.reduce((s, r) => s + r.stages.length, 0)} 스테이지` },
    { label: '평균 완료율', value: `${avgComp}%`, icon: TrendingUp, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', change: '+5% 상승' },
  ]

  const tabs = [
    { id: 'overview', label: '대시보드', icon: BarChart3 },
    { id: 'roadmaps', label: '로드맵 관리', icon: Map },
    { id: 'learners', label: '학습자 관리', icon: Users },
    { id: 'settings', label: '조직 설정', icon: Settings },
  ]

  // --- Roadmap CRUD helpers ---
  const updateRm = (id, fn) => setRoadmaps(p => p.map(r => r.id === id ? fn(r) : r))
  const updateStage = (rmId, stId, fn) => updateRm(rmId, r => ({ ...r, stages: r.stages.map(s => s.id === stId ? fn(s) : s) }))

  const addStage = (rmId) => updateRm(rmId, r => ({
    ...r, stages: [...r.stages, { id: gid(), title: `Stage ${r.stages.length + 1}: 새 스테이지`, description: '', order: r.stages.length + 1, problems: [] }]
  }))
  const deleteStage = (rmId, stId) => { updateRm(rmId, r => ({ ...r, stages: r.stages.filter(s => s.id !== stId).map((s, i) => ({ ...s, order: i + 1 })) })); setExpandedStages(p => p.filter(x => x !== stId)) }
  const moveStage = (rmId, stId, dir) => updateRm(rmId, r => {
    const ss = [...r.stages]; const i = ss.findIndex(s => s.id === stId)
    if (dir === 'up' && i > 0) [ss[i - 1], ss[i]] = [ss[i], ss[i - 1]]
    else if (dir === 'down' && i < ss.length - 1) [ss[i + 1], ss[i]] = [ss[i], ss[i + 1]]
    return { ...r, stages: ss.map((s, j) => ({ ...s, order: j + 1 })) }
  })

  const addProbToStage = (rmId, stId, prob) => updateStage(rmId, stId, s => ({ ...s, problems: [...s.problems, { ...prob, id: gid(), completionRate: 0 }] }))
  const deleteProbFromStage = (rmId, stId, pId) => { updateStage(rmId, stId, s => ({ ...s, problems: s.problems.filter(p => p.id !== pId) })); setExpandedProbId(null) }
  const updateProbInStage = (rmId, stId, pId, data) => updateStage(rmId, stId, s => ({ ...s, problems: s.problems.map(p => p.id === pId ? { ...p, ...data } : p) }))

  const deleteRoadmap = (id) => { setRoadmaps(p => p.filter(r => r.id !== id)); setRmView('list'); setSelectedRmId(null) }

  const toggleStage = (stId) => setExpandedStages(p => p.includes(stId) ? p.filter(x => x !== stId) : [...p, stId])

  const openDetail = (rm) => { setSelectedRmId(rm.id); setRmView('detail'); setExpandedStages(rm.stages.map(s => s.id)); setEditingHeader(false); setEditingStageId(null); setExpandedProbId(null); setAddProb(null) }

  // --- Wizard: AI roadmap creation ---
  const startWizard = async () => {
    setRmView('create'); setWizStep('chat'); setChatMsgs([]); setChatIn(''); setGenRoadmap(null)
    setChatLoading(true)
    const msg = await aiChat([{ role: 'user', content: '새 학습 로드맵을 설계하고 싶습니다.' }], ROADMAP_CHAT_PROMPT)
    setChatMsgs([{ role: 'assistant', content: msg || '안녕하세요! 학습 로드맵 설계를 도와드리겠습니다. 어떤 보안 분야의 로드맵을 만들고 싶으신가요?' }])
    setChatLoading(false)
  }

  const sendWizChat = async () => {
    const m = chatIn.trim(); if (!m || chatLoading) return
    const newMsgs = [...chatMsgs, { role: 'user', content: m }]
    setChatMsgs(newMsgs); setChatIn(''); setChatLoading(true)
    const uCount = newMsgs.filter(x => x.role === 'user').length
    const reply = await aiChat(newMsgs, ROADMAP_CHAT_PROMPT)
    setChatMsgs(p => [...p, { role: 'assistant', content: reply || FALLBACK_CHAT[Math.min(uCount - 1, FALLBACK_CHAT.length - 1)] }])
    setChatLoading(false)
  }

  const generateRoadmap = async () => {
    setChatLoading(true)
    const result = await aiJson(chatMsgs, ROADMAP_GEN_PROMPT)
    setGenRoadmap(result || { title: '', description: '', category: 'web', difficulty: '중급', estimatedHours: 20, stages: [
      { title: 'Stage 1: 기초', description: '', problems: [{ title: '', category: 'web', difficulty: '초급', description: '', learningPoints: ['', '', ''], timeLimit: 60 }] },
      { title: 'Stage 2: 심화', description: '', problems: [{ title: '', category: 'web', difficulty: '중급', description: '', learningPoints: ['', '', ''], timeLimit: 90 }] },
    ]})
    setWizStep('review'); setChatLoading(false)
  }

  const updateGen = (fn) => setGenRoadmap(p => fn(p))
  const updateGenStage = (si, fn) => updateGen(r => ({ ...r, stages: r.stages.map((s, i) => i === si ? fn(s) : s) }))
  const updateGenProb = (si, pi, fn) => updateGenStage(si, s => ({ ...s, problems: s.problems.map((p, i) => i === pi ? fn(p) : p) }))

  const saveGenRoadmap = () => {
    if (!genRoadmap) return
    const rm = { ...genRoadmap, id: gid(), status: 'draft', assignedCount: 0, completionRate: 0, createdAt: new Date().toISOString().split('T')[0],
      stages: genRoadmap.stages.map((s, i) => ({ ...s, id: gid(), order: i + 1, problems: s.problems.map(p => ({ ...p, id: gid(), completionRate: 0 })) })) }
    setRoadmaps(p => [...p, rm]); setWizStep('done')
  }

  // --- Add problem within detail ---
  const startAddProb = (stId, mode) => {
    if (mode === 'manual') {
      setAddProb({ stageId: stId, mode: 'manual', step: 'form', chatMessages: [], chatInput: '', loading: false,
        problem: { title: '', category: selRm?.category || 'web', difficulty: '초급', description: '', learningPoints: ['', '', ''], timeLimit: 60 } })
    } else {
      setAddProb({ stageId: stId, mode: 'ai', step: 'chat', chatMessages: [], chatInput: '', loading: false, problem: null })
      ;(async () => {
        setAddProb(p => ({ ...p, loading: true }))
        const stage = selRm?.stages.find(s => s.id === stId)
        const reply = await aiChat([{ role: 'user', content: '이 스테이지에 새 문제를 추가하고 싶습니다.' }], PROBLEM_CHAT_PROMPT(selRm?.title || '', stage?.title || ''))
        setAddProb(p => p ? ({ ...p, loading: false, chatMessages: [{ role: 'assistant', content: reply || '어떤 주제의 문제를 만들고 싶으신가요? 난이도와 학습 목표도 알려주세요!' }] }) : p)
      })()
    }
  }

  const sendAddProbChat = async () => {
    if (!addProb || !addProb.chatInput.trim() || addProb.loading) return
    const m = addProb.chatInput.trim()
    const newMsgs = [...addProb.chatMessages, { role: 'user', content: m }]
    setAddProb(p => ({ ...p, chatMessages: newMsgs, chatInput: '', loading: true }))
    const stage = selRm?.stages.find(s => s.id === addProb.stageId)
    const reply = await aiChat(newMsgs, PROBLEM_CHAT_PROMPT(selRm?.title || '', stage?.title || ''))
    const uCount = newMsgs.filter(x => x.role === 'user').length
    setAddProb(p => p ? ({ ...p, loading: false, chatMessages: [...p.chatMessages, { role: 'assistant', content: reply || (uCount >= 2 ? '"문제 생성하기" 버튼을 눌러주세요!' : '좋아요! 좀 더 구체적으로 말씀해주시겠어요?') }] }) : p)
  }

  const generateAddProb = async () => {
    if (!addProb) return
    setAddProb(p => ({ ...p, loading: true }))
    const stage = selRm?.stages.find(s => s.id === addProb.stageId)
    const result = await aiJson(addProb.chatMessages, PROBLEM_GEN_PROMPT)
    setAddProb(p => p ? ({ ...p, loading: false, step: 'form',
      problem: result || { title: '', category: selRm?.category || 'web', difficulty: stage?.problems[0]?.difficulty || '초급', description: '', learningPoints: ['', '', ''], timeLimit: 60 } }) : p)
  }

  const saveAddProb = () => {
    if (!addProb?.problem || !selRm) return
    addProbToStage(selRm.id, addProb.stageId, addProb.problem)
    setAddProb(null)
  }

  const sendInvite = () => { if (!invEmail.trim()) return; setInvited(p => [...p, { email: invEmail.trim(), date: new Date().toISOString().split('T')[0], status: '대기중' }]); setInvEmail('') }

  /* ===== RENDER ===== */
  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />
      <main className="dashboard-content">
        <div style={st.header}>
          <div>
            <h1 style={st.pageTitle}>관리자 콘솔</h1>
            <p style={st.subTitle}>조직의 학습 환경을 관리하고, AI와 함께 로드맵을 설계하세요.</p>
          </div>
          <div style={st.dateBadge}><Clock size={14} /><span>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span></div>
        </div>

        <div style={st.tabBar} className="admin-tab-bar">
          {tabs.map(t => { const I = t.icon; return (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setRmView('list'); setLnView('list') }} style={{ ...st.tabBtn, ...(activeTab === t.id ? st.tabActive : {}) }}>
              <I size={16} /><span>{t.label}</span>
            </button>
          )})}
        </div>

        {/* ===== OVERVIEW ===== */}
        {activeTab === 'overview' && <>
          <div style={st.statsGrid} className="admin-stats-grid">
            {statsData.map((s, i) => { const I = s.icon; return (
              <Card key={i} style={{ padding: '24px' }}><div style={st.statCard}>
                <div style={st.statTop}><div style={{ ...st.iconWrap, background: s.bg, color: s.color }}><I size={22} /></div><span style={st.statChange}>{s.change}</span></div>
                <div style={st.statVal}>{s.value}</div><div style={st.statLbl}>{s.label}</div>
              </div></Card>
            )})}
          </div>
          <Card style={{ padding: '28px', marginBottom: '24px' }}>
            <h3 style={st.secHead}>주간 활동 현황</h3>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_DATA} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="실습완료" fill="#4F46E5" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="로드맵진행" fill="#06B6D4" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={st.legend}><div style={st.legItem}><div style={{ ...st.legDot, background: '#4F46E5' }} /><span>실습완료</span></div><div style={st.legItem}><div style={{ ...st.legDot, background: '#06B6D4' }} /><span>로드맵진행</span></div></div>
          </Card>
          <h3 style={st.secHead}>최근 활동</h3>
          <Card style={{ padding: 0, overflow: 'hidden', marginBottom: '32px' }} hover={false}>
            {ACTIVITIES.map((a, i) => { const I = a.icon; return (
              <div key={i} style={{ ...st.actItem, borderBottom: i < ACTIVITIES.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                <div style={{ ...st.actIcon, background: `${a.color}15`, color: a.color }}><I size={16} /></div>
                <div style={st.actContent}><span style={st.actBadge}>{a.type}</span><p style={st.actText}>{a.text}</p></div>
                <div style={st.actTime}><Clock size={12} /><span>{a.time}</span></div>
              </div>
            )})}
          </Card>
        </>}

        {/* ===== ROADMAPS ===== */}
        {activeTab === 'roadmaps' && <>

          {/* -- List -- */}
          {rmView === 'list' && <>
            <div style={st.toolBar}>
              <div style={st.filterRow} className="admin-filter-row">
                <select style={st.sel} value={rmFilter.category} onChange={e => setRmFilter(f => ({ ...f, category: e.target.value }))}>
                  <option value="all">전체 카테고리</option>
                  {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select style={st.sel} value={rmFilter.status} onChange={e => setRmFilter(f => ({ ...f, status: e.target.value }))}>
                  <option value="all">전체 상태</option><option value="active">활성</option><option value="draft">초안</option><option value="archived">보관</option>
                </select>
                <select style={st.sel} value={rmFilter.difficulty} onChange={e => setRmFilter(f => ({ ...f, difficulty: e.target.value }))}>
                  <option value="all">전체 난이도</option><option value="초급">초급</option><option value="중급">중급</option><option value="고급">고급</option>
                </select>
              </div>
              <Button onClick={startWizard}><Plus size={16} /> 새 로드맵 만들기</Button>
            </div>
            <div style={st.cardGrid} className="admin-card-grid">
              {filteredRms.map(r => { const cat = CATEGORIES[r.category] || CATEGORIES.web; const CI = cat.icon; const probCount = r.stages.reduce((s, st) => s + st.problems.length, 0); return (
                <Card key={r.id} style={{ padding: '24px', cursor: 'pointer' }} onClick={() => openDetail(r)}>
                  <div style={st.cardTop}>
                    <span style={{ ...st.catBadge, background: `${cat.color}15`, color: cat.color }}><CI size={12} /> {cat.label}</span>
                    <span style={{ ...st.stBadge, ...(r.status === 'active' ? st.stActive : r.status === 'draft' ? st.stDraft : st.stArchived) }}>{r.status === 'active' ? '활성' : r.status === 'draft' ? '초안' : '보관'}</span>
                  </div>
                  <h4 style={st.cardTitle}>{r.title}</h4>
                  <p style={st.cardDesc}>{r.description}</p>
                  <div style={st.cardMeta}>
                    <span style={{ ...st.diffBadge, color: DIFF_COLORS[r.difficulty] }}>{r.difficulty}</span>
                    <span style={st.metaText}>{r.stages.length} 스테이지</span>
                    <span style={st.metaText}>{probCount}문제</span>
                    <span style={st.metaText}>{r.assignedCount}명</span>
                  </div>
                  <div style={st.progWrap}><div style={st.progBg}><div style={{ ...st.progFill, width: `${r.completionRate}%` }} /></div><span style={st.progPct}>{r.completionRate}%</span></div>
                </Card>
              )})}
            </div>
          </>}

          {/* -- Detail -- */}
          {rmView === 'detail' && selRm && <>
            <button onClick={() => { setRmView('list'); setSelectedRmId(null) }} style={st.backBtn}><ArrowLeft size={16} /> 목록으로</button>

            {/* Header */}
            <Card hover={false} style={{ padding: '28px', marginBottom: '20px' }}>
              {editingHeader ? <>
                <div style={st.field}><label style={st.fLabel}>제목</label><input style={st.fInput} value={selRm.title} onChange={e => updateRm(selRm.id, r => ({ ...r, title: e.target.value }))} /></div>
                <div style={st.field}><label style={st.fLabel}>설명</label><textarea style={{ ...st.fInput, minHeight: '80px', resize: 'vertical' }} value={selRm.description} onChange={e => updateRm(selRm.id, r => ({ ...r, description: e.target.value }))} /></div>
                <div style={st.fieldRow}>
                  <div style={st.field}><label style={st.fLabel}>카테고리</label><select style={st.fInput} value={selRm.category} onChange={e => updateRm(selRm.id, r => ({ ...r, category: e.target.value }))}>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                  <div style={st.field}><label style={st.fLabel}>난이도</label><select style={st.fInput} value={selRm.difficulty} onChange={e => updateRm(selRm.id, r => ({ ...r, difficulty: e.target.value }))}><option value="초급">초급</option><option value="중급">중급</option><option value="고급">고급</option></select></div>
                  <div style={st.field}><label style={st.fLabel}>예상 시간</label><input type="number" style={st.fInput} value={selRm.estimatedHours} onChange={e => updateRm(selRm.id, r => ({ ...r, estimatedHours: Number(e.target.value) }))} /></div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <Button size="small" onClick={() => setEditingHeader(false)}><Save size={14} /> 완료</Button>
                  <Button size="small" variant="secondary" style={{ color: '#EF4444' }} onClick={() => deleteRoadmap(selRm.id)}><Trash2 size={14} /> 삭제</Button>
                </div>
              </> : <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>{selRm.title}</h2>
                    <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '12px' }}>{selRm.description}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {(() => { const c = CATEGORIES[selRm.category] || CATEGORIES.web; const CI = c.icon; return <span style={{ ...st.catBadge, background: `${c.color}15`, color: c.color }}><CI size={12} /> {c.label}</span> })()}
                      <span style={{ ...st.diffBadge, color: DIFF_COLORS[selRm.difficulty] }}>{selRm.difficulty}</span>
                      <span style={st.metaText}>{selRm.estimatedHours}시간</span>
                      <span style={st.metaText}>{selRm.stages.length} 스테이지</span>
                      <span style={st.metaText}>{selRm.stages.reduce((s, st) => s + st.problems.length, 0)}문제</span>
                      <span style={st.metaText}>{selRm.assignedCount}명 배정</span>
                      <span style={st.metaText}>완료율 {selRm.completionRate}%</span>
                    </div>
                  </div>
                  <Button size="small" variant="secondary" onClick={() => setEditingHeader(true)}><Edit3 size={14} /> 수정</Button>
                </div>
              </>}
            </Card>

            {/* Stages timeline */}
            <h3 style={st.secHead}><Layers size={18} style={{ marginRight: '8px' }} /> 스테이지</h3>
            {selRm.stages.map((stage, si) => {
              const isExp = expandedStages.includes(stage.id)
              const isEditing = editingStageId === stage.id
              return (
                <div key={stage.id} style={st.stageWrap}>
                  <div style={st.timeline}>
                    <div style={{ ...st.tlDot, background: isExp ? '#4F46E5' : '#E2E8F0' }}>{si + 1}</div>
                    {si < selRm.stages.length - 1 && <div style={st.tlLine} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Card hover={false} style={{ padding: '20px', marginBottom: '16px' }}>
                      {/* Stage header */}
                      <div style={st.stageHeader} onClick={() => !isEditing && toggleStage(stage.id)}>
                        <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
                          {isEditing ? <>
                            <input style={{ ...st.fInput, marginBottom: '8px', fontWeight: 700 }} value={stage.title} onChange={e => updateStage(selRm.id, stage.id, s => ({ ...s, title: e.target.value }))} onClick={e => e.stopPropagation()} />
                            <textarea style={{ ...st.fInput, minHeight: '60px', resize: 'vertical' }} value={stage.description} onChange={e => updateStage(selRm.id, stage.id, s => ({ ...s, description: e.target.value }))} onClick={e => e.stopPropagation()} />
                          </> : <>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{stage.title}</h4>
                            <p style={{ fontSize: '0.82rem', color: '#94A3B8' }}>{stage.description} ({stage.problems.length}문제)</p>
                          </>}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                          {isEditing ? <Button size="small" variant="ghost" onClick={() => setEditingStageId(null)}><Save size={14} /></Button>
                            : <Button size="small" variant="ghost" onClick={() => setEditingStageId(stage.id)}><Edit3 size={14} /></Button>}
                          <Button size="small" variant="ghost" onClick={() => moveStage(selRm.id, stage.id, 'up')} disabled={si === 0}><ChevronUp size={14} /></Button>
                          <Button size="small" variant="ghost" onClick={() => moveStage(selRm.id, stage.id, 'down')} disabled={si === selRm.stages.length - 1}><ChevronDown size={14} /></Button>
                          <Button size="small" variant="ghost" onClick={() => deleteStage(selRm.id, stage.id)} style={{ color: '#EF4444' }}><Trash2 size={14} /></Button>
                          {!isEditing && (isExp ? <ChevronUp size={18} style={{ color: '#94A3B8', cursor: 'pointer' }} onClick={() => toggleStage(stage.id)} /> : <ChevronDown size={18} style={{ color: '#94A3B8', cursor: 'pointer' }} onClick={() => toggleStage(stage.id)} />)}
                        </div>
                      </div>

                      {/* Expanded: problems */}
                      {isExp && <>
                        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {stage.problems.map(prob => {
                            const pc = CATEGORIES[prob.category] || CATEGORIES.web
                            const isExpProb = expandedProbId === prob.id
                            return (
                              <div key={prob.id} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                                <div style={st.probRow} onClick={() => { setExpandedProbId(isExpProb ? null : prob.id); setEditProbData(isExpProb ? null : { ...prob }) }}>
                                  <span style={{ ...st.catBadge, background: `${pc.color}15`, color: pc.color, fontSize: '0.7rem', padding: '2px 8px' }}>{pc.label}</span>
                                  <span style={{ flex: 1, fontWeight: 600, fontSize: '0.88rem', color: '#0F172A' }}>{prob.title}</span>
                                  <span style={{ ...st.diffBadge, color: DIFF_COLORS[prob.difficulty], fontSize: '0.72rem' }}>{prob.difficulty}</span>
                                  <div style={{ ...st.progWrap, maxWidth: '120px' }}><div style={st.progBg}><div style={{ ...st.progFill, width: `${prob.completionRate}%` }} /></div><span style={{ ...st.progPct, fontSize: '0.72rem' }}>{prob.completionRate}%</span></div>
                                  {isExpProb ? <ChevronUp size={14} style={{ color: '#94A3B8' }} /> : <ChevronDown size={14} style={{ color: '#94A3B8' }} />}
                                </div>
                                {isExpProb && editProbData && <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', background: '#FAFBFC' }}>
                                  <div style={st.field}><label style={st.fLabel}>제목</label><input style={st.fInput} value={editProbData.title} onChange={e => setEditProbData(p => ({ ...p, title: e.target.value }))} /></div>
                                  <div style={st.fieldRow}>
                                    <div style={st.field}><label style={st.fLabel}>카테고리</label><select style={st.fInput} value={editProbData.category} onChange={e => setEditProbData(p => ({ ...p, category: e.target.value }))}>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                                    <div style={st.field}><label style={st.fLabel}>난이도</label><select style={st.fInput} value={editProbData.difficulty} onChange={e => setEditProbData(p => ({ ...p, difficulty: e.target.value }))}><option value="초급">초급</option><option value="중급">중급</option><option value="고급">고급</option></select></div>
                                    <div style={st.field}><label style={st.fLabel}>시간(분)</label><input type="number" style={st.fInput} value={editProbData.timeLimit} onChange={e => setEditProbData(p => ({ ...p, timeLimit: Number(e.target.value) }))} /></div>
                                  </div>
                                  <div style={st.field}><label style={st.fLabel}>설명</label><textarea style={{ ...st.fInput, minHeight: '70px', resize: 'vertical' }} value={editProbData.description} onChange={e => setEditProbData(p => ({ ...p, description: e.target.value }))} /></div>
                                  <div style={st.field}><label style={st.fLabel}>학습 포인트</label>
                                    {(editProbData.learningPoints || []).map((lp, li) => <input key={li} style={{ ...st.fInput, marginBottom: '6px' }} value={lp} onChange={e => { const pts = [...editProbData.learningPoints]; pts[li] = e.target.value; setEditProbData(p => ({ ...p, learningPoints: pts })) }} />)}
                                  </div>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <Button size="small" onClick={() => { updateProbInStage(selRm.id, stage.id, prob.id, editProbData); setExpandedProbId(null) }}><Save size={14} /> 저장</Button>
                                    <Button size="small" variant="secondary" onClick={() => setExpandedProbId(null)}>취소</Button>
                                    <Button size="small" variant="secondary" style={{ color: '#EF4444' }} onClick={() => deleteProbFromStage(selRm.id, stage.id, prob.id)}><Trash2 size={14} /> 삭제</Button>
                                  </div>
                                </div>}
                              </div>
                            )
                          })}
                        </div>

                        {/* Add problem section */}
                        {addProb && addProb.stageId === stage.id ? (
                          <div style={{ marginTop: '14px', padding: '16px', border: '1.5px dashed #4F46E5', borderRadius: '12px', background: 'rgba(79,70,229,0.02)' }}>
                            {addProb.step === 'chat' && <>
                              <div style={{ ...st.chatArea, maxHeight: '280px' }}>
                                {addProb.chatMessages.map((m, i) => (
                                  <div key={i} style={m.role === 'user' ? st.bubRowU : st.bubRowA}>
                                    {m.role === 'assistant' && <div style={st.bubAv}><MessageSquare size={12} /></div>}
                                    <div style={m.role === 'user' ? st.bubU : st.bubA}>{m.content}</div>
                                  </div>
                                ))}
                                {addProb.loading && <div style={st.bubRowA}><div style={st.bubAv}><MessageSquare size={12} /></div><div style={st.bubA}><div style={st.dots}><div style={{ ...st.dot, animationDelay: '0s' }} /><div style={{ ...st.dot, animationDelay: '0.2s' }} /><div style={{ ...st.dot, animationDelay: '0.4s' }} /></div></div></div>}
                                <div ref={addChatEndRef} />
                              </div>
                              <div style={st.chatBar}>
                                <input style={st.chatField} value={addProb.chatInput} onChange={e => setAddProb(p => ({ ...p, chatInput: e.target.value }))}
                                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendAddProbChat() } }} placeholder="문제 주제를 설명하세요..." disabled={addProb.loading} />
                                <button style={{ ...st.sendBtn, opacity: addProb.loading || !addProb.chatInput.trim() ? 0.5 : 1 }} onClick={sendAddProbChat} disabled={addProb.loading || !addProb.chatInput.trim()}><Send size={16} /></button>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{addProb.chatMessages.filter(m => m.role === 'user').length < 2 ? `생성까지 ${2 - addProb.chatMessages.filter(m => m.role === 'user').length}개 메시지 더` : ''}</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <Button size="small" variant="secondary" onClick={() => setAddProb(null)}>취소</Button>
                                  {addProb.chatMessages.filter(m => m.role === 'user').length >= 2 && <Button size="small" onClick={generateAddProb} disabled={addProb.loading}>문제 생성하기</Button>}
                                </div>
                              </div>
                            </>}
                            {addProb.step === 'form' && addProb.problem && <>
                              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>{addProb.mode === 'ai' ? '생성된 문제 리뷰' : '새 문제 입력'}</h4>
                              <div style={st.field}><label style={st.fLabel}>제목</label><input style={st.fInput} value={addProb.problem.title} onChange={e => setAddProb(p => ({ ...p, problem: { ...p.problem, title: e.target.value } }))} /></div>
                              <div style={st.fieldRow}>
                                <div style={st.field}><label style={st.fLabel}>카테고리</label><select style={st.fInput} value={addProb.problem.category} onChange={e => setAddProb(p => ({ ...p, problem: { ...p.problem, category: e.target.value } }))}>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                                <div style={st.field}><label style={st.fLabel}>난이도</label><select style={st.fInput} value={addProb.problem.difficulty} onChange={e => setAddProb(p => ({ ...p, problem: { ...p.problem, difficulty: e.target.value } }))}><option value="초급">초급</option><option value="중급">중급</option><option value="고급">고급</option></select></div>
                                <div style={st.field}><label style={st.fLabel}>시간(분)</label><input type="number" style={st.fInput} value={addProb.problem.timeLimit} onChange={e => setAddProb(p => ({ ...p, problem: { ...p.problem, timeLimit: Number(e.target.value) } }))} /></div>
                              </div>
                              <div style={st.field}><label style={st.fLabel}>설명</label><textarea style={{ ...st.fInput, minHeight: '70px', resize: 'vertical' }} value={addProb.problem.description} onChange={e => setAddProb(p => ({ ...p, problem: { ...p.problem, description: e.target.value } }))} /></div>
                              <div style={st.field}><label style={st.fLabel}>학습 포인트</label>
                                {(addProb.problem.learningPoints || []).map((lp, li) => <input key={li} style={{ ...st.fInput, marginBottom: '6px' }} value={lp} onChange={e => { const pts = [...addProb.problem.learningPoints]; pts[li] = e.target.value; setAddProb(p => ({ ...p, problem: { ...p.problem, learningPoints: pts } })) }} />)}
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <Button size="small" onClick={saveAddProb}><Save size={14} /> 저장</Button>
                                <Button size="small" variant="secondary" onClick={() => setAddProb(null)}>취소</Button>
                                {addProb.mode === 'ai' && <Button size="small" variant="secondary" onClick={() => setAddProb(p => ({ ...p, step: 'chat', problem: null }))}>다시 생성</Button>}
                              </div>
                            </>}
                          </div>
                        ) : (
                          <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                            <Button size="small" variant="secondary" onClick={() => startAddProb(stage.id, 'ai')}><MessageSquare size={14} /> AI로 문제 추가</Button>
                            <Button size="small" variant="secondary" onClick={() => startAddProb(stage.id, 'manual')}><Plus size={14} /> 직접 추가</Button>
                          </div>
                        )}
                      </>}
                    </Card>
                  </div>
                </div>
              )
            })}
            <Button variant="secondary" onClick={() => addStage(selRm.id)} style={{ marginBottom: '32px' }}><Plus size={16} /> 스테이지 추가</Button>
          </>}

          {/* -- Create Wizard -- */}
          {rmView === 'create' && <div style={{ maxWidth: '720px' }}>
            <button onClick={() => setRmView('list')} style={st.backBtn}><ArrowLeft size={16} /> 목록으로</button>

            <div style={st.stepBar}>
              {['AI 채팅', '리뷰', '완료'].map((l, i) => { const sid = ['chat', 'review', 'done'][i]; const cur = wizStep === sid; const done = ['chat', 'review', 'done'].indexOf(wizStep) > i; return (
                <div key={sid} style={st.stepItem}>
                  <div style={{ ...st.stepCircle, ...(cur ? st.stepCur : done ? st.stepDone : {}) }}>{done ? <CheckCircle2 size={14} /> : i + 1}</div>
                  <span style={{ ...st.stepLbl, ...(cur ? { color: '#4F46E5', fontWeight: 700 } : {}) }}>{l}</span>
                  {i < 2 && <div style={st.stepLine} />}
                </div>
              )})}
            </div>

            {/* Step: Chat */}
            {wizStep === 'chat' && <div style={st.chatWrap}>
              <div style={st.chatHead}>
                <div style={st.chatHeadL}><div style={st.chatAv}><MessageSquare size={20} /></div><div><div style={st.chatName}>AI 로드맵 설계 도우미</div><div style={st.chatStatus}><div style={{ ...st.statusDot, background: chatLoading ? '#F59E0B' : '#10B981' }} />{chatLoading ? '생각중...' : '온라인'}</div></div></div>
                {userMsgCount >= 3 && <button style={st.genBtn} onClick={generateRoadmap} disabled={chatLoading}>로드맵 생성하기 <ChevronRight size={16} /></button>}
              </div>
              <div style={st.chatArea}>
                {chatMsgs.map((m, i) => (
                  <div key={i} style={m.role === 'user' ? st.bubRowU : st.bubRowA}>
                    {m.role === 'assistant' && <div style={st.bubAv}><MessageSquare size={14} /></div>}
                    <div style={m.role === 'user' ? st.bubU : st.bubA}>{m.content}</div>
                  </div>
                ))}
                {chatLoading && <div style={st.bubRowA}><div style={st.bubAv}><MessageSquare size={14} /></div><div style={st.bubA}><div style={st.dots}><div style={{ ...st.dot, animationDelay: '0s' }} /><div style={{ ...st.dot, animationDelay: '0.2s' }} /><div style={{ ...st.dot, animationDelay: '0.4s' }} /></div></div></div>}
                <div ref={chatEndRef} />
              </div>
              <div style={st.chatBar}>
                <input style={st.chatField} value={chatIn} onChange={e => setChatIn(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendWizChat() } }} placeholder="학습 목표, 대상, 분야 등을 알려주세요..." disabled={chatLoading} />
                <button style={{ ...st.sendBtn, opacity: chatLoading || !chatIn.trim() ? 0.5 : 1 }} onClick={sendWizChat} disabled={chatLoading || !chatIn.trim()}><Send size={18} /></button>
              </div>
              {userMsgCount < 3 && <div style={st.chatHint}>로드맵 생성까지 {3 - userMsgCount}개 메시지 더 필요합니다</div>}
            </div>}

            {/* Step: Review */}
            {wizStep === 'review' && genRoadmap && <Card hover={false} style={{ padding: '28px' }}>
              <h3 style={st.secHead}>생성된 로드맵 리뷰</h3>
              <div style={st.field}><label style={st.fLabel}>제목</label><input style={st.fInput} value={genRoadmap.title} onChange={e => updateGen(r => ({ ...r, title: e.target.value }))} /></div>
              <div style={st.field}><label style={st.fLabel}>설명</label><textarea style={{ ...st.fInput, minHeight: '80px', resize: 'vertical' }} value={genRoadmap.description} onChange={e => updateGen(r => ({ ...r, description: e.target.value }))} /></div>
              <div style={st.fieldRow}>
                <div style={st.field}><label style={st.fLabel}>카테고리</label><select style={st.fInput} value={genRoadmap.category} onChange={e => updateGen(r => ({ ...r, category: e.target.value }))}>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                <div style={st.field}><label style={st.fLabel}>난이도</label><select style={st.fInput} value={genRoadmap.difficulty} onChange={e => updateGen(r => ({ ...r, difficulty: e.target.value }))}><option value="초급">초급</option><option value="중급">중급</option><option value="고급">고급</option></select></div>
                <div style={st.field}><label style={st.fLabel}>시간</label><input type="number" style={st.fInput} value={genRoadmap.estimatedHours} onChange={e => updateGen(r => ({ ...r, estimatedHours: Number(e.target.value) }))} /></div>
              </div>

              <h4 style={{ ...st.secHead, fontSize: '1rem', marginTop: '24px' }}>스테이지 ({genRoadmap.stages.length})</h4>
              {genRoadmap.stages.map((stg, si) => (
                <div key={si} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', marginBottom: '16px', background: '#FAFBFC' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4F46E5' }}>Stage {si + 1}</span>
                    <Button size="small" variant="ghost" onClick={() => updateGen(r => ({ ...r, stages: r.stages.filter((_, i) => i !== si) }))} style={{ color: '#EF4444' }}><Trash2 size={14} /></Button>
                  </div>
                  <div style={st.field}><label style={st.fLabel}>제목</label><input style={st.fInput} value={stg.title} onChange={e => updateGenStage(si, s => ({ ...s, title: e.target.value }))} /></div>
                  <div style={st.field}><label style={st.fLabel}>설명</label><input style={st.fInput} value={stg.description} onChange={e => updateGenStage(si, s => ({ ...s, description: e.target.value }))} /></div>

                  {stg.problems.map((prob, pi) => (
                    <div key={pi} style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', marginBottom: '10px', background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B' }}>문제 {pi + 1}</span>
                        <Button size="small" variant="ghost" onClick={() => updateGenStage(si, s => ({ ...s, problems: s.problems.filter((_, i) => i !== pi) }))} style={{ color: '#EF4444' }}><Trash2 size={12} /></Button>
                      </div>
                      <div style={st.field}><label style={st.fLabel}>제목</label><input style={st.fInput} value={prob.title} onChange={e => updateGenProb(si, pi, p => ({ ...p, title: e.target.value }))} /></div>
                      <div style={st.fieldRow}>
                        <div style={st.field}><label style={st.fLabel}>카테고리</label><select style={st.fInput} value={prob.category} onChange={e => updateGenProb(si, pi, p => ({ ...p, category: e.target.value }))}>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                        <div style={st.field}><label style={st.fLabel}>난이도</label><select style={st.fInput} value={prob.difficulty} onChange={e => updateGenProb(si, pi, p => ({ ...p, difficulty: e.target.value }))}><option value="초급">초급</option><option value="중급">중급</option><option value="고급">고급</option></select></div>
                        <div style={st.field}><label style={st.fLabel}>시간</label><input type="number" style={st.fInput} value={prob.timeLimit} onChange={e => updateGenProb(si, pi, p => ({ ...p, timeLimit: Number(e.target.value) }))} /></div>
                      </div>
                      <div style={st.field}><label style={st.fLabel}>설명</label><textarea style={{ ...st.fInput, minHeight: '50px', resize: 'vertical' }} value={prob.description} onChange={e => updateGenProb(si, pi, p => ({ ...p, description: e.target.value }))} /></div>
                      <div style={st.field}><label style={st.fLabel}>학습 포인트</label>
                        {(prob.learningPoints || []).map((lp, li) => <input key={li} style={{ ...st.fInput, marginBottom: '4px' }} value={lp} onChange={e => { const pts = [...prob.learningPoints]; pts[li] = e.target.value; updateGenProb(si, pi, p => ({ ...p, learningPoints: pts })) }} />)}
                      </div>
                    </div>
                  ))}
                  <button style={st.addProbBtn} onClick={() => updateGenStage(si, s => ({ ...s, problems: [...s.problems, { title: '', category: genRoadmap.category || 'web', difficulty: '초급', description: '', learningPoints: ['', '', ''], timeLimit: 60 }] }))}>
                    <Plus size={14} /> 문제 추가
                  </button>
                </div>
              ))}
              <button style={st.addProbBtn} onClick={() => updateGen(r => ({ ...r, stages: [...r.stages, { title: '', description: '', problems: [] }] }))}>
                <Plus size={14} /> 스테이지 추가
              </button>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <Button onClick={saveGenRoadmap}><Save size={16} /> 저장</Button>
                <Button variant="secondary" onClick={() => { setWizStep('chat'); setGenRoadmap(null) }}>다시 생성</Button>
              </div>
            </Card>}

            {/* Step: Done */}
            {wizStep === 'done' && <div style={st.doneWrap}>
              <div style={st.doneIcon}><CheckCircle2 size={48} /></div>
              <h2 style={st.doneTitle}>로드맵이 성공적으로 생성되었습니다!</h2>
              <p style={st.doneDesc}>로드맵 목록에서 확인하고 학습자에게 배정할 수 있습니다.</p>
              <Button onClick={() => { setRmView('list'); setWizStep('chat'); setChatMsgs([]) }}>로드맵 목록으로 <ChevronRight size={16} /></Button>
            </div>}
          </div>}
        </>}

        {/* ===== LEARNERS ===== */}
        {activeTab === 'learners' && <>
          {lnView === 'list' && <>
            <div style={st.toolBar} className="admin-filter-row">
              <div style={st.searchWrap}><Search size={16} style={{ color: '#94A3B8' }} /><input style={st.searchIn} placeholder="이름 또는 이메일 검색..." value={searchQ} onChange={e => setSearchQ(e.target.value)} /></div>
              <div style={st.filterRow}>
                {['all', '초급', '중급', '고급'].map(lv => <button key={lv} onClick={() => setFilterLv(lv)} style={{ ...st.chip, ...(filterLv === lv ? st.chipAct : {}) }}>{lv === 'all' ? '전체' : lv}</button>)}
              </div>
            </div>
            <div style={{ marginBottom: '32px' }}>
              {filteredLearners.map(l => (
                <Card key={l.id} style={{ padding: '20px', marginBottom: '12px' }}>
                  <div style={st.lnRow}>
                    <div style={st.lnAvatar}>{l.avatar}</div>
                    <div style={st.lnInfo}><div style={st.lnName}>{l.name}</div><div style={st.lnEmail}>{l.email}</div></div>
                    <span style={{ ...st.lvBadge, color: DIFF_COLORS[l.level], background: `${DIFF_COLORS[l.level]}15` }}>{l.level}</span>
                    <span style={st.lnGroup}>{l.group}</span>
                    <div style={{ ...st.progWrap, flex: 1, minWidth: '100px', maxWidth: '180px' }}><div style={st.progBg}><div style={{ ...st.progFill, width: `${Math.round((l.completedLabs / Math.max(l.totalAssigned, 1)) * 100)}%` }} /></div><span style={st.progPct}>{Math.round((l.completedLabs / Math.max(l.totalAssigned, 1)) * 100)}%</span></div>
                    <span style={st.lnLast}>{l.lastActive}</span>
                    <Button size="small" variant="secondary" onClick={e => { e.stopPropagation(); setSelLearner(l); setLnView('detail') }}>상세</Button>
                  </div>
                </Card>
              ))}
              {filteredLearners.length === 0 && <Card hover={false} style={{ padding: '40px', textAlign: 'center' }}><p style={{ color: '#94A3B8' }}>검색 결과가 없습니다.</p></Card>}
            </div>
          </>}
          {lnView === 'detail' && selLearner && <div style={{ maxWidth: '800px' }}>
            <button onClick={() => { setLnView('list'); setSelLearner(null) }} style={st.backBtn}><ArrowLeft size={16} /> 목록으로</button>
            <Card hover={false} style={{ padding: '32px', marginBottom: '20px' }}>
              <div style={st.profRow}>
                <div style={st.profAvatar}>{selLearner.avatar}</div>
                <div>
                  <h2 style={st.profName}>{selLearner.name}</h2>
                  <p style={st.profEmail}>{selLearner.email}</p>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ ...st.lvBadge, color: DIFF_COLORS[selLearner.level], background: `${DIFF_COLORS[selLearner.level]}15` }}>{selLearner.level}</span>
                    <span style={st.grpTag}>{selLearner.group}</span>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>가입일: {selLearner.joinDate}</span>
                  </div>
                </div>
              </div>
            </Card>
            <div style={st.miniGrid} className="admin-stats-grid">
              <Card style={{ padding: '20px' }}><div style={st.miniVal}>{selLearner.completedLabs}</div><div style={st.miniLbl}>완료 실습</div></Card>
              <Card style={{ padding: '20px' }}><div style={st.miniVal}>{selLearner.avgScore}점</div><div style={st.miniLbl}>평균 점수</div></Card>
              <Card style={{ padding: '20px' }}><div style={st.miniVal}>{selLearner.totalAssigned}</div><div style={st.miniLbl}>배정 실습</div></Card>
            </div>
            <Card hover={false} style={{ padding: '28px' }}>
              <h3 style={st.secHead}>실습 이력</h3>
              {selLearner.labHistory.length > 0 ? <div style={{ overflowX: 'auto' }}>
                <table style={st.table}><thead><tr><th style={st.th}>실습명</th><th style={st.th}>점수</th><th style={st.th}>완료일</th><th style={st.th}>소요시간</th></tr></thead>
                <tbody>{selLearner.labHistory.map((h, i) => <tr key={i}><td style={st.td}>{h.name}</td><td style={st.td}><span style={{ color: h.score >= 80 ? '#10B981' : h.score >= 60 ? '#F59E0B' : '#EF4444', fontWeight: 700 }}>{h.score}</span></td><td style={st.td}>{h.completedAt}</td><td style={st.td}>{h.duration}</td></tr>)}</tbody></table>
              </div> : <p style={{ color: '#94A3B8', textAlign: 'center', padding: '24px' }}>실습 이력이 없습니다.</p>}
            </Card>
          </div>}
        </>}

        {/* ===== SETTINGS ===== */}
        {activeTab === 'settings' && <div style={{ maxWidth: '720px' }}>
          <Card hover={false} style={{ padding: '28px', marginBottom: '20px' }}>
            <h3 style={st.secHead}>조직 정보</h3>
            <div style={st.field}><label style={st.fLabel}>조직 이름</label><input style={st.fInput} value={orgName} onChange={e => setOrgName(e.target.value)} /></div>
            <div style={st.field}><label style={st.fLabel}>플랜</label><div style={st.planBadge}>Enterprise</div></div>
          </Card>
          <Card hover={false} style={{ padding: '28px', marginBottom: '20px' }}>
            <h3 style={st.secHead}>멤버 초대</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
              <div style={st.searchWrap}><Mail size={16} style={{ color: '#94A3B8' }} /><input style={st.searchIn} placeholder="이메일 주소 입력..." value={invEmail} onChange={e => setInvEmail(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendInvite() }} /></div>
              <Button size="small" onClick={sendInvite}><Send size={14} /> 초대</Button>
            </div>
            {invited.length > 0 && <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {invited.map((inv, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', background: '#F8FAFC' }}>
                <Mail size={14} style={{ color: '#94A3B8' }} /><span style={{ flex: 1, fontSize: '0.88rem', color: '#0F172A' }}>{inv.email}</span><span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{inv.date}</span><span style={{ fontSize: '0.78rem', fontWeight: 600, color: inv.status === '수락됨' ? '#10B981' : '#F59E0B' }}>{inv.status}</span>
              </div>)}
            </div>}
          </Card>
          <Card hover={false} style={{ padding: '28px', marginBottom: '20px' }}>
            <h3 style={st.secHead}>기본 설정</h3>
            <div style={st.field}><label style={st.fLabel}>기본 난이도</label><div style={{ display: 'flex', gap: '8px' }}>{['초급', '중급', '고급'].map(d => <button key={d} onClick={() => setDefDiff(d)} style={{ ...st.radioBtn, ...(defDiff === d ? st.radioBtnAct : {}) }}>{d}</button>)}</div></div>
            <div style={st.field}><label style={st.fLabel}>Lab 세션 타임아웃 (분)</label><input type="number" style={{ ...st.fInput, maxWidth: '200px' }} value={labTimeout} onChange={e => setLabTimeout(Number(e.target.value))} /></div>
            <div style={st.field}><label style={st.fLabel}>알림 설정</label>
              <button onClick={() => setNotifOn(!notifOn)} style={{ ...st.toggle, ...(notifOn ? st.toggleOn : {}) }}><div style={{ ...st.toggleK, ...(notifOn ? st.toggleKOn : {}) }} /></button>
              <span style={{ fontSize: '0.82rem', color: '#64748B', marginLeft: '12px' }}>{notifOn ? '활성화됨' : '비활성화됨'}</span>
            </div>
          </Card>
          <Button size="large"><Save size={16} /> 설정 저장</Button>
        </div>}
      </main>
      <AdminStyles />
    </div>
  )
}

function AdminStyles() {
  useEffect(() => {
    if (document.querySelector('[data-admin-styles]')) return
    const el = document.createElement('style')
    el.setAttribute('data-admin-styles', '')
    el.textContent = `
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes dotPulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
      @media (max-width: 1024px) { .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; } .admin-card-grid { grid-template-columns: repeat(2, 1fr) !important; } .admin-filter-row { flex-wrap: wrap !important; } }
      @media (max-width: 768px) { .admin-stats-grid { grid-template-columns: 1fr !important; } .admin-card-grid { grid-template-columns: 1fr !important; } .admin-tab-bar { overflow-x: auto !important; } }
    `
    document.head.appendChild(el)
    return () => { const e = document.querySelector('[data-admin-styles]'); if (e) e.remove() }
  }, [])
  return null
}

/* ===== STYLES ===== */
const st = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  pageTitle: { fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' },
  subTitle: { color: '#64748B', fontSize: '0.95rem' },
  dateBadge: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', color: '#64748B', fontSize: '0.85rem' },
  tabBar: { display: 'flex', gap: '4px', marginBottom: '28px', padding: '4px', background: '#F1F5F9', borderRadius: '12px', width: 'fit-content' },
  tabBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'transparent', color: '#64748B', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease', whiteSpace: 'nowrap' },
  tabActive: { background: '#fff', color: '#4F46E5', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' },
  statCard: { display: 'flex', flexDirection: 'column' },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  iconWrap: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statChange: { fontSize: '0.75rem', color: '#10B981', fontWeight: 600 },
  statVal: { fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' },
  statLbl: { fontSize: '0.85rem', color: '#64748B' },
  secHead: { fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center' },
  legend: { display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' },
  legItem: { display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.8rem' },
  legDot: { width: '10px', height: '10px', borderRadius: '3px' },
  actItem: { display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 24px' },
  actIcon: { width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  actContent: { flex: 1, minWidth: 0 },
  actBadge: { display: 'inline-block', fontSize: '0.7rem', fontWeight: 600, color: '#818CF8', background: 'rgba(79,70,229,0.1)', padding: '2px 8px', borderRadius: '6px', marginBottom: '4px' },
  actText: { fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  actTime: { display: 'flex', alignItems: 'center', gap: '4px', color: '#94A3B8', fontSize: '0.75rem', whiteSpace: 'nowrap', flexShrink: 0 },
  toolBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' },
  filterRow: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' },
  sel: { padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#fff', color: '#0F172A', fontSize: '0.85rem', fontFamily: 'inherit', cursor: 'pointer', outline: 'none' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  catBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 },
  stBadge: { padding: '3px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600 },
  stActive: { background: 'rgba(16,185,129,0.1)', color: '#10B981' },
  stDraft: { background: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  stArchived: { background: 'rgba(148,163,184,0.1)', color: '#94A3B8' },
  cardTitle: { fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' },
  cardDesc: { fontSize: '0.82rem', color: '#94A3B8', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  cardMeta: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' },
  diffBadge: { fontSize: '0.78rem', fontWeight: 700 },
  metaText: { fontSize: '0.75rem', color: '#94A3B8' },
  progWrap: { display: 'flex', alignItems: 'center', gap: '10px' },
  progBg: { flex: 1, height: '6px', borderRadius: '3px', background: '#E2E8F0', overflow: 'hidden' },
  progFill: { height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #4F46E5, #06B6D4)', transition: 'width 0.6s ease' },
  progPct: { fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', minWidth: '32px', textAlign: 'right' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' },
  field: { marginBottom: '16px' },
  fLabel: { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#64748B', marginBottom: '6px' },
  fInput: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#FAFBFC', color: '#0F172A', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
  fieldRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  // Timeline
  stageWrap: { display: 'flex', gap: '16px' },
  timeline: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0 },
  tlDot: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#fff', flexShrink: 0, transition: 'background 0.2s ease' },
  tlLine: { width: '2px', flex: 1, background: '#E2E8F0', minHeight: '16px' },
  stageHeader: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  probRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', cursor: 'pointer', transition: 'background 0.15s ease' },
  addProbBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px dashed #CBD5E1', background: 'transparent', color: '#94A3B8', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginTop: '8px' },
  // Chat
  chatWrap: { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px - 280px)', minHeight: '400px' },
  chatHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px 16px 0 0', borderBottom: 'none' },
  chatHeadL: { display: 'flex', alignItems: 'center', gap: '12px' },
  chatAv: { width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  chatName: { fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' },
  chatStatus: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94A3B8' },
  statusDot: { width: '6px', height: '6px', borderRadius: '50%' },
  genBtn: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '8px 16px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  chatArea: { flex: 1, overflowY: 'auto', padding: '20px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderTop: 'none', borderBottom: 'none', display: 'flex', flexDirection: 'column', gap: '14px' },
  bubRowA: { display: 'flex', alignItems: 'flex-end', gap: '8px', maxWidth: '80%' },
  bubRowU: { display: 'flex', justifyContent: 'flex-end', maxWidth: '80%', marginLeft: 'auto' },
  bubAv: { width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubA: { padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: '#fff', border: '1px solid #E2E8F0', color: '#0F172A', fontSize: '0.88rem', lineHeight: 1.6, fontWeight: 500 },
  bubU: { padding: '12px 16px', borderRadius: '16px 4px 16px 16px', background: 'linear-gradient(135deg, #4F46E5, #6366F1)', color: '#fff', fontSize: '0.88rem', lineHeight: 1.6, fontWeight: 500 },
  dots: { display: 'flex', gap: '6px', padding: '4px 0' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', background: '#4F46E5', animation: 'dotPulse 1.2s ease-in-out infinite' },
  chatBar: { display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '0 0 16px 16px' },
  chatField: { flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none' },
  sendBtn: { width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
  chatHint: { textAlign: 'center', color: '#94A3B8', fontSize: '0.78rem', fontWeight: 500, marginTop: '12px' },
  // Steps
  stepBar: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  stepCircle: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', background: '#F1F5F9', border: '2px solid #E2E8F0', flexShrink: 0 },
  stepCur: { color: '#fff', background: '#4F46E5', border: '2px solid #4F46E5' },
  stepDone: { color: '#fff', background: '#10B981', border: '2px solid #10B981' },
  stepLbl: { fontSize: '0.82rem', fontWeight: 500, color: '#94A3B8', whiteSpace: 'nowrap' },
  stepLine: { width: '40px', height: '2px', background: '#E2E8F0', margin: '0 8px' },
  // Done
  doneWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 40px', textAlign: 'center' },
  doneIcon: { width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(16,185,129,0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' },
  doneTitle: { fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' },
  doneDesc: { color: '#64748B', fontSize: '0.9rem', marginBottom: '24px' },
  // Search
  searchWrap: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#fff', flex: 1, maxWidth: '400px' },
  searchIn: { flex: 1, border: 'none', background: 'transparent', color: '#0F172A', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none' },
  chip: { padding: '8px 16px', borderRadius: '100px', border: '1.5px solid #E2E8F0', background: '#fff', color: '#64748B', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  chipAct: { border: '1.5px solid #4F46E5', color: '#4F46E5', background: 'rgba(79,70,229,0.04)' },
  // Learner
  lnRow: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  lnAvatar: { width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, flexShrink: 0 },
  lnInfo: { minWidth: '140px' },
  lnName: { fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' },
  lnEmail: { fontSize: '0.78rem', color: '#94A3B8' },
  lvBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 },
  lnGroup: { fontSize: '0.82rem', color: '#64748B', minWidth: '40px' },
  lnLast: { fontSize: '0.78rem', color: '#94A3B8', minWidth: '60px', textAlign: 'right' },
  profRow: { display: 'flex', alignItems: 'center', gap: '20px' },
  profAvatar: { width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 },
  profName: { fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' },
  profEmail: { color: '#94A3B8', fontSize: '0.88rem', marginBottom: '8px' },
  grpTag: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: '#F1F5F9', color: '#64748B' },
  miniGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' },
  miniVal: { fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  miniLbl: { fontSize: '0.82rem', color: '#64748B' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', borderBottom: '1px solid #E2E8F0' },
  td: { padding: '14px 16px', fontSize: '0.88rem', color: '#334155', borderBottom: '1px solid #F1F5F9' },
  planBadge: { display: 'inline-block', padding: '6px 16px', borderRadius: '100px', background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(6,182,212,0.1))', color: '#4F46E5', fontSize: '0.85rem', fontWeight: 700, border: '1px solid rgba(79,70,229,0.15)' },
  radioBtn: { padding: '8px 20px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#fff', color: '#64748B', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  radioBtnAct: { border: '1.5px solid #4F46E5', color: '#4F46E5', background: 'rgba(79,70,229,0.04)' },
  toggle: { width: '48px', height: '28px', borderRadius: '14px', border: 'none', background: '#E2E8F0', cursor: 'pointer', position: 'relative', padding: 0 },
  toggleOn: { background: '#4F46E5' },
  toggleK: { width: '22px', height: '22px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: '3px', transition: 'left 0.2s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' },
  toggleKOn: { left: '23px' },
}
