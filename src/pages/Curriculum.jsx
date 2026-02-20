import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Play,
  CheckCircle2,
  Lock,
  Clock,
  FileText,
  Code,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Sparkles,
  Swords,
  Eye,
  Loader2,
  Calendar,
  Layers,
  ArrowLeft,
  Shield,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Button from '../components/Button'
import Card from '../components/Card'

// ─── 이론 모듈 학습 콘텐츠 ───
const theoryContent = {
  'm1-1': {
    sections: [
      { title: '정보보안이란?', body: '정보보안(Information Security)은 정보의 기밀성(Confidentiality), 무결성(Integrity), 가용성(Availability)을 보장하기 위한 활동입니다. 이 세 가지를 CIA Triad라고 합니다.' },
      { title: '보안 위협의 종류', body: '• 악성코드 (Malware): 바이러스, 웜, 트로이목마, 랜섬웨어\n• 사회공학 (Social Engineering): 피싱, 스피어피싱, 프리텍스팅\n• 네트워크 공격: DDoS, MITM, 스니핑\n• 웹 공격: SQL Injection, XSS, CSRF' },
      { title: '핵심 개념', body: '• 인증(Authentication): 사용자 신원 확인\n• 인가(Authorization): 접근 권한 부여\n• 감사(Auditing): 활동 기록 및 추적\n• 암호화(Encryption): 데이터 보호' },
    ],
  },
  'm1-2': {
    sections: [
      { title: 'OSI 7계층 모델', body: '네트워크 통신을 7개 계층으로 분류한 표준 모델입니다.\n7. 응용 계층 (Application) — HTTP, FTP, DNS\n6. 표현 계층 (Presentation) — 암호화, 압축\n5. 세션 계층 (Session) — 연결 관리\n4. 전송 계층 (Transport) — TCP, UDP\n3. 네트워크 계층 (Network) — IP, 라우팅\n2. 데이터링크 계층 (Data Link) — MAC, 스위칭\n1. 물리 계층 (Physical) — 케이블, 전기신호' },
      { title: 'TCP/IP 모델', body: '실제 인터넷에서 사용되는 4계층 모델입니다.\n4. 응용 계층 — HTTP, SMTP, DNS\n3. 전송 계층 — TCP, UDP\n2. 인터넷 계층 — IP, ICMP\n1. 네트워크 접근 계층 — Ethernet, Wi-Fi' },
      { title: 'IP 주소와 포트', body: '• IPv4: 32비트 (예: 192.168.1.1)\n• IPv6: 128비트 (예: 2001:db8::1)\n• Well-known 포트: 0~1023 (HTTP=80, HTTPS=443, SSH=22)\n• 서브넷 마스크: 네트워크 범위 구분 (255.255.255.0 = /24)' },
    ],
  },
  'm2-1': {
    sections: [
      { title: 'HTTP 프로토콜', body: 'HyperText Transfer Protocol — 웹 통신의 기본 프로토콜입니다.\n• 요청 메서드: GET, POST, PUT, DELETE, PATCH\n• 상태 코드: 200(성공), 301(리다이렉트), 403(금지), 404(없음), 500(서버 오류)\n• 비연결성(Stateless): 각 요청은 독립적' },
      { title: 'HTTPS와 TLS', body: 'HTTPS는 HTTP에 TLS(Transport Layer Security)를 적용한 암호화 통신입니다.\n• 대칭키 + 비대칭키 하이브리드 암호화\n• 인증서(Certificate): CA가 서버 신원 보증\n• TLS 핸드셰이크: 클라이언트-서버 간 암호화 협상 과정' },
      { title: '쿠키와 세션', body: '• 쿠키(Cookie): 브라우저에 저장되는 작은 데이터\n• 세션(Session): 서버 측에서 사용자 상태 유지\n• JWT(JSON Web Token): 서명된 토큰 기반 인증\n• 보안 속성: HttpOnly, Secure, SameSite' },
    ],
  },
  'm2-2': {
    sections: [
      { title: 'OWASP Top 10이란?', body: 'OWASP(Open Web Application Security Project)에서 발표하는 웹 애플리케이션 보안 위협 상위 10개 항목입니다. 주기적으로 업데이트되며, 개발자와 보안 전문가의 필수 참고 자료입니다.' },
      { title: '주요 취약점 (1~5)', body: '1. Broken Access Control — 권한 없는 리소스 접근\n2. Cryptographic Failures — 암호화 미흡/잘못된 구현\n3. Injection — SQL, NoSQL, OS, LDAP 인젝션\n4. Insecure Design — 설계 단계부터의 보안 결함\n5. Security Misconfiguration — 기본 설정, 불필요한 기능 활성화' },
      { title: '주요 취약점 (6~10)', body: '6. Vulnerable Components — 알려진 취약점이 있는 라이브러리 사용\n7. Authentication Failures — 인증/세션 관리 결함\n8. Data Integrity Failures — 데이터 무결성 검증 미흡\n9. Logging Failures — 모니터링/로깅 부족\n10. SSRF — 서버 측 요청 위조' },
      { title: '방어 원칙', body: '• 입력 검증: 모든 사용자 입력은 악의적이라 가정\n• 최소 권한: 필요한 최소한의 권한만 부여\n• 심층 방어: 여러 겹의 보안 계층 구축\n• 보안 테스트: SAST, DAST, 침투 테스트 정기 수행' },
    ],
  },
}

// ─── 기본 커리큘럼 (데모) ───
const defaultCurriculumData = [
  {
    week: 1, title: '보안 기초와 네트워크', status: 'completed',
    modules: [
      { id: 'm1-1', type: '이론', title: '정보보안 개요', status: 'completed', time: '30분' },
      { id: 'm1-2', type: '이론', title: 'OSI 모델과 네트워크 기초', status: 'completed', time: '45분' },
      { id: 'm1-3', type: '실습', title: 'Wireshark 패킷 분석', status: 'completed', time: '60분' },
      { id: 'm1-4', type: '실습', title: 'Nmap 포트 스캐닝', status: 'completed', time: '50분' },
    ],
  },
  {
    week: 2, title: '웹 보안 기초', status: 'in-progress',
    modules: [
      { id: 'm2-1', type: '이론', title: 'HTTP/HTTPS 프로토콜', status: 'completed', time: '35분' },
      { id: 'm2-2', type: '이론', title: 'OWASP Top 10', status: 'in-progress', time: '40분' },
      { id: 'm2-3', type: '실습', title: 'SQL Injection 실습', status: 'locked', time: '60분' },
      { id: 'm2-4', type: '실습', title: 'XSS 공격과 방어', status: 'locked', time: '55분' },
      { id: 'm2-5', type: '워게임', title: '증강 워게임: 웹 취약점 챌린지', status: 'in-progress', time: '20분' },
    ],
  },
  {
    week: 3, title: '시스템 보안', status: 'locked',
    modules: [
      { id: 'm3-1', type: '이론', title: 'Linux 보안 기초', status: 'locked', time: '40분' },
      { id: 'm3-2', type: '이론', title: '권한 관리와 접근 제어', status: 'locked', time: '35분' },
      { id: 'm3-3', type: '실습', title: '리눅스 취약점 분석', status: 'locked', time: '60분' },
      { id: 'm3-4', type: '실습', title: '로그 분석', status: 'locked', time: '50분' },
    ],
  },
  {
    week: 4, title: '암호학', status: 'locked',
    modules: [
      { id: 'm4-1', type: '이론', title: '대칭키 / 비대칭키 암호화', status: 'locked', time: '45분' },
      { id: 'm4-2', type: '이론', title: '해시 함수와 디지털 서명', status: 'locked', time: '40분' },
      { id: 'm4-3', type: '실습', title: '암호화 알고리즘 구현', status: 'locked', time: '60분' },
      { id: 'm4-4', type: '실습', title: 'PKI 인증서 실습', status: 'locked', time: '55분' },
    ],
  },
  {
    week: 5, title: '포렌식 입문', status: 'locked',
    modules: [
      { id: 'm5-1', type: '이론', title: '디지털 포렌식 개요', status: 'locked', time: '35분' },
      { id: 'm5-2', type: '이론', title: '증거 수집과 보존', status: 'locked', time: '40분' },
      { id: 'm5-3', type: '실습', title: '디스크 이미징 실습', status: 'locked', time: '60분' },
      { id: 'm5-4', type: '실습', title: '메모리 포렌식', status: 'locked', time: '55분' },
    ],
  },
  {
    week: 6, title: '종합 실습 프로젝트', status: 'locked',
    modules: [
      { id: 'm6-1', type: '이론', title: '프로젝트 브리핑', status: 'locked', time: '30분' },
      { id: 'm6-2', type: '실습', title: '취약점 진단 보고서 작성', status: 'locked', time: '90분' },
      { id: 'm6-3', type: '실습', title: '모의 침투 테스트', status: 'locked', time: '120분' },
      { id: 'm6-4', type: '실습', title: '최종 발표와 리뷰', status: 'locked', time: '60분' },
    ],
  },
]

/* ── helpers ── */
function getWeekProgress(modules) {
  const completed = modules.filter((m) => m.status === 'completed').length
  return { completed, total: modules.length }
}
function getWeekProgressLabel(week) {
  const { completed, total } = getWeekProgress(week.modules)
  if (week.status === 'completed') return `${completed}/${total} 완료`
  if (week.status === 'in-progress') return `${completed}/${total} 진행 중`
  return `0/${total}`
}
function getWeekProgressPercent(week) {
  const { completed, total } = getWeekProgress(week.modules)
  return total > 0 ? (completed / total) * 100 : 0
}
function calcStats(data) {
  const totalModules = data.reduce((a, w) => a + w.modules.length, 0)
  const completedModules = data.reduce((a, w) => a + w.modules.filter(m => m.status === 'completed').length, 0)
  const percent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
  return { totalModules, completedModules, percent }
}

/* ═══════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════ */
export default function Curriculum() {
  // activeView: null → 카드 목록, 'default' → 기본 커리큘럼 로드맵, 'saved' → AI 저장 커리큘럼 로드맵
  const [activeView, setActiveView] = useState(null)
  const [expandedWeek, setExpandedWeek] = useState(null)
  const [openModule, setOpenModule] = useState(null)

  // 기본(데모) 커리큘럼
  const [demoCurriculum, setDemoCurriculum] = useState(defaultCurriculumData)

  // 저장된 AI 커리큘럼
  const [savedCurriculum, setSavedCurriculum] = useState(null)
  const [savedRaw, setSavedRaw] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSaved() {
      try {
        const userId = localStorage.getItem('learnops-user') || null
        if (!userId) { setLoading(false); return }
        const res = await fetch(`/api/ai/saved-curriculum?userId=${encodeURIComponent(userId)}`)
        if (!res.ok) { setLoading(false); return }
        const data = await res.json()
        const items = data.phases || data.weeks
        if (items && items.length > 0) {
          setSavedRaw(data)
          setSavedCurriculum(items.map((item, wi) => ({
            week: item.phase || item.week, title: item.title, goal: item.goal,
            status: wi === 0 ? 'in-progress' : 'locked',
            modules: (item.modules || []).map((mod, mi) => ({
              id: `s${item.phase || item.week}-${mi + 1}`, type: mod.type, title: mod.title,
              desc: mod.desc,
              status: wi === 0 && mi === 0 ? 'in-progress' : 'locked',
            })),
          })))
        }
      } catch { /* best-effort */ }
      setLoading(false)
    }
    loadSaved()
  }, [])

  /* ── completeModule (works for both datasets) ── */
  const completeModule = (moduleId, setter) => {
    setter(prev => {
      if (!prev) return prev
      const next = prev.map(week => ({ ...week, modules: week.modules.map(m => ({ ...m })) }))
      for (const week of next) {
        const idx = week.modules.findIndex(m => m.id === moduleId)
        if (idx === -1) continue
        week.modules[idx].status = 'completed'
        const nextLocked = week.modules.find((m, i) => i > idx && m.status === 'locked')
        if (nextLocked) nextLocked.status = 'in-progress'
        const allDone = week.modules.every(m => m.status === 'completed')
        const anyProgress = week.modules.some(m => m.status === 'in-progress' || m.status === 'completed')
        if (allDone) {
          week.status = 'completed'
          const weekIdx = next.indexOf(week)
          if (weekIdx < next.length - 1 && next[weekIdx + 1].status === 'locked') {
            next[weekIdx + 1].status = 'in-progress'
            next[weekIdx + 1].modules[0].status = 'in-progress'
          }
        } else if (anyProgress) {
          week.status = 'in-progress'
        }
        break
      }
      return next
    })
    setOpenModule(null)
  }

  const toggleWeek = (weekNum) => setExpandedWeek(expandedWeek === weekNum ? null : weekNum)

  const openRoadmap = (view) => {
    setActiveView(view)
    setExpandedWeek(null)
    setOpenModule(null)
    const data = view === 'default' ? demoCurriculum : savedCurriculum
    if (data) {
      const inProg = data.find(w => w.status === 'in-progress')
      setExpandedWeek(inProg ? inProg.week : data[0]?.week ?? null)
    }
  }

  /* ── loading ── */
  if (loading) {
    return (
      <div className="dashboard-layout">
        <Navbar /><Sidebar />
        <main className="dashboard-content">
          <div style={st.centerBox}>
            <Loader2 size={36} style={{ color: '#4F46E5', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748B', marginTop: 16 }}>커리큘럼을 불러오는 중...</p>
          </div>
        </main>
        <style>{keyframes}</style>
      </div>
    )
  }

  /* ═══════════════════════════════════════
     CARD LIST VIEW
     ═══════════════════════════════════════ */
  if (!activeView) {
    const demoStats = calcStats(demoCurriculum)
    const savedStats = savedCurriculum ? calcStats(savedCurriculum) : null

    return (
      <div className="dashboard-layout">
        <Navbar /><Sidebar />
        <main className="dashboard-content">
          <div style={st.page}>
            <div style={st.pageHeader}>
              <Sparkles size={28} style={{ color: '#F59E0B' }} />
              <h1 style={st.pageTitle}>커리큘럼</h1>
            </div>
            <p style={st.pageSubtitle}>학습 로드맵을 선택하세요. 카드를 눌러 상세 로드맵을 확인할 수 있습니다.</p>

            <div style={st.cardGrid}>
              {/* ── 기본 커리큘럼 카드 ── */}
              <div style={st.cardOuter} onClick={() => openRoadmap('default')}>
                <div style={{ ...st.cardGradientBar, background: 'linear-gradient(90deg, #EF4444, #F59E0B)' }} />
                <div style={st.cardBody}>
                  <div style={st.cardTopRow}>
                    <div style={{ ...st.cardIconWrap, background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                      <Shield size={26} />
                    </div>
                    <div style={st.cardMeta}>
                      <div style={st.cardMetaItem}><Calendar size={14} /><span>6주 과정</span></div>
                      <div style={st.cardMetaItem}><Layers size={14} /><span>{demoStats.totalModules}개 모듈</span></div>
                    </div>
                  </div>
                  <h2 style={{ ...st.cardTitle, background: 'linear-gradient(135deg,#EF4444,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    사이버 보안 기초 커리큘럼
                  </h2>
                  <p style={st.cardDesc}>이론 학습, 실습 환경, 증강 워게임이 포함된 체험형 보안 학습 과정입니다.</p>

                  <div style={st.chipRow}>
                    {demoCurriculum.slice(0, 3).map(w => (
                      <span key={w.week} style={{ ...st.chip, ...(w.status === 'completed' ? st.chipDone : w.status === 'in-progress' ? st.chipActive : {}) }}>
                        W{w.week} {w.title}
                      </span>
                    ))}
                    <span style={st.chip}>+{demoCurriculum.length - 3}</span>
                  </div>

                  <div style={st.cardProgressWrap}>
                    <div style={st.cardProgressHeader}>
                      <span style={st.cardProgressLabel}>진행률</span>
                      <span style={{ ...st.cardProgressPct, background: 'linear-gradient(135deg,#EF4444,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{demoStats.percent}%</span>
                    </div>
                    <div style={st.cardProgressTrack}>
                      <div style={{ ...st.cardProgressBar, width: `${demoStats.percent}%`, background: 'linear-gradient(90deg,#EF4444,#F59E0B)' }} />
                    </div>
                    <span style={st.cardProgressDetail}>{demoStats.completedModules}/{demoStats.totalModules} 모듈 완료</span>
                  </div>

                  <div style={st.cardCta}>
                    <span style={{ ...st.cardCtaText, color: '#EF4444' }}>로드맵 상세 보기</span>
                    <ChevronRight size={18} style={{ color: '#EF4444' }} />
                  </div>
                </div>
              </div>

              {/* ── AI 맞춤 커리큘럼 카드 (저장된 경우에만 표시) ── */}
              {savedCurriculum && savedRaw && (
                <div style={st.cardOuter} onClick={() => openRoadmap('saved')}>
                  <div style={st.cardGradientBar} />
                  <div style={st.cardBody}>
                    <div style={st.cardTopRow}>
                      <div style={st.cardIconWrap}><BookOpen size={26} /></div>
                      <div style={st.cardMeta}>
                        <div style={st.cardMetaItem}><Calendar size={14} /><span>{savedRaw.totalPhases || savedRaw.totalWeeks || savedCurriculum.length} Phase</span></div>
                        <div style={st.cardMetaItem}><Layers size={14} /><span>{savedStats.totalModules}개 모듈</span></div>
                      </div>
                    </div>
                    <h2 style={st.cardTitle}>{savedRaw.title || 'AI 맞춤 커리큘럼'}</h2>
                    <p style={st.cardDesc}>레벨테스트 결과를 기반으로 AI가 생성한 맞춤형 학습 로드맵입니다.</p>

                    <div style={st.chipRow}>
                      {savedCurriculum.slice(0, 3).map(w => (
                        <span key={w.week} style={{ ...st.chip, ...(w.status === 'completed' ? st.chipDone : w.status === 'in-progress' ? st.chipActive : {}) }}>
                          P{w.week} {w.title}
                        </span>
                      ))}
                      {savedCurriculum.length > 3 && <span style={st.chip}>+{savedCurriculum.length - 3}</span>}
                    </div>

                    <div style={st.cardProgressWrap}>
                      <div style={st.cardProgressHeader}>
                        <span style={st.cardProgressLabel}>진행률</span>
                        <span style={st.cardProgressPct}>{savedStats.percent}%</span>
                      </div>
                      <div style={st.cardProgressTrack}>
                        <div style={{ ...st.cardProgressBar, width: `${savedStats.percent}%` }} />
                      </div>
                      <span style={st.cardProgressDetail}>{savedStats.completedModules}/{savedStats.totalModules} 모듈 완료</span>
                    </div>

                    <div style={st.cardCta}>
                      <span style={st.cardCtaText}>로드맵 상세 보기</span>
                      <ChevronRight size={18} style={{ color: '#4F46E5' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        <style>{keyframes}</style>
      </div>
    )
  }

  /* ═══════════════════════════════════════
     ROADMAP DETAIL VIEW
     ═══════════════════════════════════════ */
  const isDefault = activeView === 'default'
  const data = isDefault ? demoCurriculum : savedCurriculum
  const setter = isDefault ? setDemoCurriculum : setSavedCurriculum
  const title = isDefault ? '사이버 보안 기초 커리큘럼' : (savedRaw?.title || 'AI 맞춤 커리큘럼')
  const { totalModules, completedModules, percent: overallPercent } = calcStats(data)
  const totalPhases = isDefault ? 6 : (savedRaw?.totalPhases || savedRaw?.totalWeeks || data.length)

  return (
    <div className="dashboard-layout">
      <Navbar /><Sidebar />
      <main className="dashboard-content">
        <div style={st.page}>
          <button style={st.backBtn} onClick={() => { setActiveView(null); setExpandedWeek(null); setOpenModule(null) }}>
            <ArrowLeft size={18} /> 카드 목록으로
          </button>

          <div style={st.roadmapHeader}>
            <div style={st.pageHeader}>
              <Sparkles size={28} style={{ color: '#F59E0B' }} />
              <h1 style={st.pageTitle}>{title}</h1>
            </div>
            <p style={st.pageSubtitle}>{isDefault ? `총 ${totalPhases}주 과정` : `총 ${totalPhases} Phase`} &middot; {totalModules}개 모듈</p>

            <div style={st.overallWrap}>
              <div style={st.overallRow}>
                <span style={st.overallLabel}>전체 진행률</span>
                <span style={st.overallPct}>{overallPercent}%</span>
              </div>
              <div style={st.overallTrack}>
                <div style={{ ...st.overallBar, width: `${overallPercent}%` }} />
              </div>
              <span style={st.overallDetail}>{completedModules}/{totalModules} 모듈 완료</span>
            </div>
          </div>

          {/* Week accordion */}
          <div style={st.weekList}>
            {data.map((week) => {
              const isExp = expandedWeek === week.week
              const isLocked = week.status === 'locked'
              const isCompleted = week.status === 'completed'
              const isInProgress = week.status === 'in-progress'
              const pct = getWeekProgressPercent(week)

              return (
                <Card key={week.week} hover={false} style={{
                  ...st.weekCard,
                  ...(isInProgress ? st.weekCardActive : {}),
                  ...(isLocked ? st.weekCardLocked : {}),
                }}>
                  <button
                    onClick={() => !isLocked && toggleWeek(week.week)}
                    style={{ ...st.weekHeader, cursor: isLocked ? 'default' : 'pointer', opacity: isLocked ? 0.5 : 1 }}
                  >
                    <div style={st.weekLeft}>
                      <div style={{
                        ...st.weekBadge,
                        background: isCompleted ? 'rgba(16,185,129,0.15)' : isInProgress ? 'linear-gradient(135deg,rgba(79,70,229,0.2),rgba(6,182,212,0.15))' : 'rgba(148,163,184,0.1)',
                        color: isCompleted ? '#10B981' : isInProgress ? '#06B6D4' : '#64748B',
                      }}>
                        {isCompleted ? <CheckCircle2 size={16}/> : isLocked ? <Lock size={16}/> : <BookOpen size={16}/>}
                        <span>{isDefault ? `Week ${week.week}` : `Phase ${week.week}`}</span>
                      </div>
                      <div style={st.weekInfo}>
                        <h3 style={{ ...st.weekTitle, color: isLocked ? '#94A3B8' : '#0F172A' }}>{week.title}</h3>
                        <span style={{ ...st.weekProgressLabel, color: isCompleted ? '#10B981' : isInProgress ? '#06B6D4' : '#64748B' }}>
                          {getWeekProgressLabel(week)}
                        </span>
                      </div>
                    </div>
                    <div style={st.weekRight}>
                      <div style={st.weekProgressTrack} className="curriculum-week-right-progress">
                        <div style={{
                          ...st.weekProgressBar, width: `${pct}%`,
                          background: isCompleted ? '#10B981' : isInProgress ? 'linear-gradient(90deg,#4F46E5,#06B6D4)' : 'transparent',
                        }} />
                      </div>
                      {!isLocked && (isExp ? <ChevronUp size={20} style={{ color: '#64748B' }}/> : <ChevronDown size={20} style={{ color: '#64748B' }}/>)}
                      {isLocked && <Lock size={18} style={{ color: '#94A3B8' }}/>}
                    </div>
                  </button>

                  {/* Modules */}
                  {isExp && !isLocked && (
                    <div style={st.moduleList}>
                      {week.modules.map((mod) => {
                        const done = mod.status === 'completed'
                        const active = mod.status === 'in-progress'
                        const locked = mod.status === 'locked'

                        return (
                          <React.Fragment key={mod.id}>
                            <div style={{
                              ...st.modItem,
                              ...(active ? st.modItemActive : {}),
                              ...(locked ? st.modItemLocked : {}),
                              ...(done ? st.modItemDone : {}),
                            }}>
                              <div style={st.modLeft}>
                                <div style={st.modIcon}>
                                  {done ? <CheckCircle2 size={20} style={{ color: '#10B981' }}/> : active ? <Play size={20} style={{ color: '#06B6D4' }}/> : <Lock size={18} style={{ color: '#94A3B8' }}/>}
                                </div>
                                <div style={st.modContent}>
                                  <div style={st.modTopRow}>
                                    <span style={{
                                      ...st.typeBadge,
                                      background: mod.type === '이론' ? 'rgba(79,70,229,0.15)' : mod.type === '워게임' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                                      color: mod.type === '이론' ? '#818CF8' : mod.type === '워게임' ? '#F59E0B' : '#10B981',
                                    }}>
                                      {mod.type === '이론' ? <FileText size={12}/> : mod.type === '워게임' ? <Swords size={12}/> : <Code size={12}/>}
                                      {mod.type}
                                    </span>
                                    {mod.time && (
                                      <div style={st.modTime}>
                                        <Clock size={12} style={{ color: '#94A3B8' }}/>
                                        <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{mod.time}</span>
                                      </div>
                                    )}
                                  </div>
                                  <span style={{
                                    ...st.modTitle,
                                    color: done ? '#94A3B8' : locked ? '#94A3B8' : '#0F172A',
                                    textDecoration: done ? 'line-through' : 'none',
                                  }}>{mod.title}</span>
                                  {mod.desc && <span style={st.modDesc}>{mod.desc}</span>}
                                </div>
                              </div>

                              <div style={st.modRight}>
                                {/* 이론 복습 (완료 + theoryContent 있을 때) */}
                                {done && mod.type === '이론' && theoryContent[mod.id] && (
                                  <button style={st.reviewBtn} onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}>
                                    <Eye size={14} /> {openModule === mod.id ? '닫기' : '복습'}
                                  </button>
                                )}
                                {/* 완료 (이론 콘텐츠 없는 경우) */}
                                {done && (mod.type !== '이론' || !theoryContent[mod.id]) && (
                                  <span style={st.statusDone}>완료</span>
                                )}
                                {/* 이론 학습하기 */}
                                {active && mod.type === '이론' && theoryContent[mod.id] && (
                                  <button style={st.theoryStartBtn} onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}>
                                    <BookOpen size={14} /> {openModule === mod.id ? '닫기' : '학습하기'}
                                  </button>
                                )}
                                {/* 이론이지만 theoryContent 없는 경우 (AI 커리큘럼) → 완료 처리 */}
                                {active && mod.type === '이론' && !theoryContent[mod.id] && (
                                  <button style={st.completeBtn} onClick={() => completeModule(mod.id, setter)}>
                                    <CheckCircle2 size={14}/> 완료 처리
                                  </button>
                                )}
                                {/* 실습 시작 */}
                                {active && mod.type === '실습' && (
                                  <Link to="/lab" style={{ textDecoration: 'none' }}>
                                    <Button size="small" variant="primary"><Play size={14} /> 실습 시작</Button>
                                  </Link>
                                )}
                                {/* 워게임 도전 */}
                                {active && mod.type === '워게임' && (
                                  <Link to="/augment-demo" style={{ textDecoration: 'none' }}>
                                    <Button size="small" variant="primary"><Swords size={14} /> 도전하기</Button>
                                  </Link>
                                )}
                                {locked && <span style={st.statusLocked}>잠금</span>}
                              </div>
                            </div>

                            {/* 이론 콘텐츠 인라인 표시 */}
                            {openModule === mod.id && theoryContent[mod.id] && (
                              <div style={st.theoryPanel}>
                                {theoryContent[mod.id].sections.map((sec, si) => (
                                  <div key={si} style={st.theorySection}>
                                    <h4 style={st.theorySectionTitle}>{sec.title}</h4>
                                    <p style={st.theorySectionBody}>{sec.body}</p>
                                  </div>
                                ))}
                                {active && (
                                  <button style={st.theoryCompleteBtn} onClick={() => completeModule(mod.id, setter)}>
                                    <CheckCircle2 size={16} /> 학습 완료
                                  </button>
                                )}
                              </div>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </main>
      <style>{`
        @media (max-width: 768px) { .curriculum-week-right-progress { display: none !important; } }
        ${keyframes}
      `}</style>
    </div>
  )
}

const keyframes = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`

const st = {
  page: { maxWidth: 900, margin: '0 auto' },
  centerBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)', textAlign: 'center', padding: 24 },
  pageHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 },
  pageTitle: { fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', margin: 0 },
  pageSubtitle: { fontSize: '1rem', color: '#64748B', marginBottom: 28, lineHeight: 1.5 },

  /* card grid */
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 },
  cardOuter: { position: 'relative', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' },
  cardGradientBar: { height: 5, background: 'linear-gradient(90deg, #4F46E5, #06B6D4, #10B981)' },
  cardBody: { padding: '24px 24px 20px' },
  cardTopRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  cardIconWrap: { width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,rgba(79,70,229,0.12),rgba(6,182,212,0.08))', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardMeta: { display: 'flex', gap: 14 },
  cardMetaItem: { display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#64748B', fontWeight: 500 },
  cardTitle: { fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px', background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  cardDesc: { fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, marginBottom: 14 },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  chip: { padding: '3px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0', whiteSpace: 'nowrap' },
  chipActive: { background: 'rgba(79,70,229,0.08)', color: '#4F46E5', borderColor: 'rgba(79,70,229,0.25)' },
  chipDone: { background: 'rgba(16,185,129,0.08)', color: '#10B981', borderColor: 'rgba(16,185,129,0.25)' },
  cardProgressWrap: { background: '#F8FAFC', borderRadius: 12, padding: '14px 16px', marginBottom: 14, border: '1px solid #F1F5F9' },
  cardProgressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  cardProgressLabel: { fontSize: '0.82rem', fontWeight: 600, color: '#0F172A' },
  cardProgressPct: { fontSize: '0.9rem', fontWeight: 700, background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  cardProgressTrack: { width: '100%', height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  cardProgressBar: { height: '100%', borderRadius: 4, background: 'linear-gradient(90deg,#4F46E5,#06B6D4)', transition: 'width 0.6s ease' },
  cardProgressDetail: { fontSize: '0.76rem', color: '#94A3B8' },
  cardCta: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 0 0', borderTop: '1px solid #F1F5F9' },
  cardCtaText: { fontSize: '0.88rem', fontWeight: 700, color: '#4F46E5' },

  /* roadmap */
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 0', marginBottom: 16, background: 'none', border: 'none', color: '#64748B', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  roadmapHeader: { marginBottom: 32 },
  overallWrap: { background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24 },
  overallRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  overallLabel: { fontSize: '0.95rem', fontWeight: 600, color: '#0F172A' },
  overallPct: { fontSize: '1.1rem', fontWeight: 700, background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  overallTrack: { width: '100%', height: 12, background: '#E2E8F0', borderRadius: 6, overflow: 'hidden', marginBottom: 8 },
  overallBar: { height: '100%', borderRadius: 6, background: 'linear-gradient(90deg,#4F46E5,#06B6D4)', transition: 'width 0.6s ease' },
  overallDetail: { fontSize: '0.85rem', color: '#64748B' },

  /* weeks */
  weekList: { display: 'flex', flexDirection: 'column', gap: 16 },
  weekCard: { padding: 0, overflow: 'hidden' },
  weekCardActive: { borderColor: 'rgba(79,70,229,0.4)', boxShadow: '0 0 20px rgba(79,70,229,0.1)' },
  weekCardLocked: { opacity: 0.7 },
  weekHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '20px 24px', background: 'none', border: 'none', color: 'inherit', fontFamily: 'inherit', gap: 16 },
  weekLeft: { display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 },
  weekBadge: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' },
  weekInfo: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  weekTitle: { fontSize: '1rem', fontWeight: 700, margin: 0, textAlign: 'left' },
  weekProgressLabel: { fontSize: '0.8rem', fontWeight: 500, textAlign: 'left' },
  weekRight: { display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 },
  weekProgressTrack: { width: 120, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  weekProgressBar: { height: '100%', borderRadius: 3, transition: 'width 0.4s ease' },

  /* modules */
  moduleList: { borderTop: '1px solid #E2E8F0', padding: '8px 12px 12px', display: 'flex', flexDirection: 'column', gap: 4 },
  modItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, transition: 'all 0.2s ease', gap: 12 },
  modItemActive: { background: 'linear-gradient(135deg,rgba(79,70,229,0.08),rgba(6,182,212,0.06))', border: '1px solid rgba(79,70,229,0.3)' },
  modItemLocked: { opacity: 0.5 },
  modItemDone: { opacity: 0.7 },
  modLeft: { display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 },
  modIcon: { flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 },
  modContent: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 },
  modTopRow: { display: 'flex', alignItems: 'center', gap: 10 },
  typeBadge: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' },
  modTime: { display: 'flex', alignItems: 'center', gap: 4 },
  modTitle: { fontSize: '0.92rem', fontWeight: 600, lineHeight: 1.3 },
  modDesc: { fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4 },
  modRight: { display: 'flex', alignItems: 'center', flexShrink: 0 },
  statusDone: { fontSize: '0.8rem', fontWeight: 600, color: '#10B981', padding: '4px 12px', borderRadius: 6, background: 'rgba(16,185,129,0.1)' },
  statusLocked: { fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', padding: '4px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.08)' },
  completeBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },

  /* theory */
  theoryStartBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  reviewBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  theoryPanel: { margin: '0 16px 12px 62px', padding: '20px 24px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 16 },
  theorySection: {},
  theorySectionTitle: { fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 },
  theorySectionBody: { fontSize: '0.85rem', color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-line' },
  theoryCompleteBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-end', padding: '10px 20px', borderRadius: 8, border: 'none', background: '#10B981', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginTop: 4 },
}
