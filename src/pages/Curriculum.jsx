import React, { useState } from 'react'
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
  Sparkles,
  Swords,
  Eye,
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

const initialCurriculumData = [
  {
    week: 1,
    title: '보안 기초와 네트워크',
    status: 'completed',
    modules: [
      { id: 'm1-1', type: '이론', title: '정보보안 개요', status: 'completed', time: '30분' },
      { id: 'm1-2', type: '이론', title: 'OSI 모델과 네트워크 기초', status: 'completed', time: '45분' },
      { id: 'm1-3', type: '실습', title: 'Wireshark 패킷 분석', status: 'completed', time: '60분' },
      { id: 'm1-4', type: '실습', title: 'Nmap 포트 스캐닝', status: 'completed', time: '50분' },
    ],
  },
  {
    week: 2,
    title: '웹 보안 기초',
    status: 'in-progress',
    modules: [
      { id: 'm2-1', type: '이론', title: 'HTTP/HTTPS 프로토콜', status: 'completed', time: '35분' },
      { id: 'm2-2', type: '이론', title: 'OWASP Top 10', status: 'in-progress', time: '40분' },
      { id: 'm2-3', type: '실습', title: 'SQL Injection 실습', status: 'locked', time: '60분' },
      { id: 'm2-4', type: '실습', title: 'XSS 공격과 방어', status: 'locked', time: '55분' },
      { id: 'm2-5', type: '워게임', title: '증강 워게임: 웹 취약점 챌린지', status: 'in-progress', time: '20분' },
    ],
  },
  {
    week: 3,
    title: '시스템 보안',
    status: 'locked',
    modules: [
      { id: 'm3-1', type: '이론', title: 'Linux 보안 기초', status: 'locked', time: '40분' },
      { id: 'm3-2', type: '이론', title: '권한 관리와 접근 제어', status: 'locked', time: '35분' },
      { id: 'm3-3', type: '실습', title: '리눅스 취약점 분석', status: 'locked', time: '60분' },
      { id: 'm3-4', type: '실습', title: '로그 분석', status: 'locked', time: '50분' },
    ],
  },
  {
    week: 4,
    title: '암호학',
    status: 'locked',
    modules: [
      { id: 'm4-1', type: '이론', title: '대칭키 / 비대칭키 암호화', status: 'locked', time: '45분' },
      { id: 'm4-2', type: '이론', title: '해시 함수와 디지털 서명', status: 'locked', time: '40분' },
      { id: 'm4-3', type: '실습', title: '암호화 알고리즘 구현', status: 'locked', time: '60분' },
      { id: 'm4-4', type: '실습', title: 'PKI 인증서 실습', status: 'locked', time: '55분' },
    ],
  },
  {
    week: 5,
    title: '포렌식 입문',
    status: 'locked',
    modules: [
      { id: 'm5-1', type: '이론', title: '디지털 포렌식 개요', status: 'locked', time: '35분' },
      { id: 'm5-2', type: '이론', title: '증거 수집과 보존', status: 'locked', time: '40분' },
      { id: 'm5-3', type: '실습', title: '디스크 이미징 실습', status: 'locked', time: '60분' },
      { id: 'm5-4', type: '실습', title: '메모리 포렌식', status: 'locked', time: '55분' },
    ],
  },
  {
    week: 6,
    title: '종합 실습 프로젝트',
    status: 'locked',
    modules: [
      { id: 'm6-1', type: '이론', title: '프로젝트 브리핑', status: 'locked', time: '30분' },
      { id: 'm6-2', type: '실습', title: '취약점 진단 보고서 작성', status: 'locked', time: '90분' },
      { id: 'm6-3', type: '실습', title: '모의 침투 테스트', status: 'locked', time: '120분' },
      { id: 'm6-4', type: '실습', title: '최종 발표와 리뷰', status: 'locked', time: '60분' },
    ],
  },
]

function getWeekProgress(modules) {
  const completed = modules.filter((m) => m.status === 'completed').length
  const total = modules.length
  return { completed, total }
}

function getWeekProgressLabel(week) {
  const { completed, total } = getWeekProgress(week.modules)
  if (week.status === 'completed') return `${completed}/${total} 완료`
  if (week.status === 'in-progress') return `${completed}/${total} 진행 중`
  return `0/${total}`
}

function getWeekProgressPercent(week) {
  const { completed, total } = getWeekProgress(week.modules)
  return (completed / total) * 100
}

export default function Curriculum() {
  const [expandedWeek, setExpandedWeek] = useState(1)
  const [openModule, setOpenModule] = useState(null)
  const [curriculumData, setCurriculumData] = useState(initialCurriculumData)

  const completeModule = (moduleId) => {
    setCurriculumData(prev => {
      const next = prev.map(week => ({
        ...week,
        modules: week.modules.map(m => ({ ...m })),
      }))

      for (const week of next) {
        const idx = week.modules.findIndex(m => m.id === moduleId)
        if (idx === -1) continue

        // 현재 모듈 완료 처리
        week.modules[idx].status = 'completed'

        // 다음 locked 모듈을 in-progress로 전환
        const nextLocked = week.modules.find((m, i) => i > idx && m.status === 'locked')
        if (nextLocked) {
          nextLocked.status = 'in-progress'
        }

        // 주차 상태 업데이트
        const allDone = week.modules.every(m => m.status === 'completed')
        const anyProgress = week.modules.some(m => m.status === 'in-progress' || m.status === 'completed')
        if (allDone) {
          week.status = 'completed'
          // 다음 주차 unlock
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

  const overallCompleted = curriculumData.reduce(
    (acc, w) => acc + w.modules.filter((m) => m.status === 'completed').length,
    0
  )
  const overallTotal = curriculumData.reduce((acc, w) => acc + w.modules.length, 0)
  const overallPercent = Math.round((overallCompleted / overallTotal) * 100)

  const toggleWeek = (weekNum) => {
    setExpandedWeek(expandedWeek === weekNum ? null : weekNum)
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="dashboard-content">
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.titleRow}>
              <Sparkles size={28} style={styles.sparklesIcon} />
              <h1 style={styles.title}>AI 맞춤 커리큘럼</h1>
            </div>
            <p style={styles.subtitle}>
              레벨테스트 결과를 기반으로 생성된 맞춤 학습 경로입니다.
            </p>

            {/* Overall Progress Bar */}
            <div style={styles.overallProgressWrap}>
              <div style={styles.overallProgressHeader}>
                <span style={styles.overallProgressLabel}>전체 진행률</span>
                <span style={styles.overallProgressPercent}>{overallPercent}%</span>
              </div>
              <div style={styles.overallProgressTrack}>
                <div
                  style={{
                    ...styles.overallProgressBar,
                    width: `${overallPercent}%`,
                  }}
                />
              </div>
              <span style={styles.overallProgressDetail}>
                {overallCompleted}/{overallTotal} 모듈 완료
              </span>
            </div>
          </div>

          {/* Curriculum List */}
          <div style={styles.weekList}>
            {curriculumData.map((week) => {
              const isExpanded = expandedWeek === week.week
              const isLocked = week.status === 'locked'
              const isCompleted = week.status === 'completed'
              const isInProgress = week.status === 'in-progress'
              const progressPercent = getWeekProgressPercent(week)

              return (
                <Card
                  key={week.week}
                  hover={false}
                  style={{
                    ...styles.weekCard,
                    ...(isInProgress ? styles.weekCardActive : {}),
                    ...(isLocked ? styles.weekCardLocked : {}),
                  }}
                >
                  {/* Week Header */}
                  <button
                    onClick={() => !isLocked && toggleWeek(week.week)}
                    style={{
                      ...styles.weekHeader,
                      cursor: isLocked ? 'default' : 'pointer',
                      opacity: isLocked ? 0.5 : 1,
                    }}
                  >
                    <div style={styles.weekLeft}>
                      <div
                        style={{
                          ...styles.weekBadge,
                          background: isCompleted
                            ? 'rgba(16, 185, 129, 0.15)'
                            : isInProgress
                            ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(6, 182, 212, 0.15))'
                            : 'rgba(148, 163, 184, 0.1)',
                          color: isCompleted
                            ? '#10B981'
                            : isInProgress
                            ? '#06B6D4'
                            : '#64748B',
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={16} />
                        ) : isLocked ? (
                          <Lock size={16} />
                        ) : (
                          <BookOpen size={16} />
                        )}
                        <span>Week {week.week}</span>
                      </div>
                      <div style={styles.weekInfo}>
                        <h3
                          style={{
                            ...styles.weekTitle,
                            color: isLocked ? '#94A3B8' : '#0F172A',
                          }}
                        >
                          {week.title}
                        </h3>
                        <span
                          style={{
                            ...styles.weekProgressLabel,
                            color: isCompleted
                              ? '#10B981'
                              : isInProgress
                              ? '#06B6D4'
                              : '#64748B',
                          }}
                        >
                          {getWeekProgressLabel(week)}
                        </span>
                      </div>
                    </div>

                    <div style={styles.weekRight}>
                      {/* Week Progress Bar */}
                      <div style={styles.weekProgressTrack}>
                        <div
                          style={{
                            ...styles.weekProgressBar,
                            width: `${progressPercent}%`,
                            background: isCompleted
                              ? '#10B981'
                              : isInProgress
                              ? 'linear-gradient(90deg, #4F46E5, #06B6D4)'
                              : 'transparent',
                          }}
                        />
                      </div>
                      {!isLocked &&
                        (isExpanded ? (
                          <ChevronDown size={20} style={{ color: '#64748B' }} />
                        ) : (
                          <ChevronRight size={20} style={{ color: '#64748B' }} />
                        ))}
                      {isLocked && <Lock size={18} style={{ color: '#94A3B8' }} />}
                    </div>
                  </button>

                  {/* Module List (Expandable) */}
                  {isExpanded && !isLocked && (
                    <div style={styles.moduleList}>
                      {week.modules.map((mod, idx) => {
                        const modCompleted = mod.status === 'completed'
                        const modInProgress = mod.status === 'in-progress'
                        const modLocked = mod.status === 'locked'

                        return (
                          <React.Fragment key={mod.id}>
                          <div
                            style={{
                              ...styles.moduleItem,
                              ...(modInProgress ? styles.moduleItemActive : {}),
                              ...(modLocked ? styles.moduleItemLocked : {}),
                              ...(modCompleted ? styles.moduleItemCompleted : {}),
                            }}
                          >
                            <div style={styles.moduleLeft}>
                              <div style={styles.moduleIndex}>
                                {modCompleted ? (
                                  <CheckCircle2 size={20} style={{ color: '#10B981' }} />
                                ) : modInProgress ? (
                                  <Play size={20} style={{ color: '#06B6D4' }} />
                                ) : (
                                  <Lock size={18} style={{ color: '#94A3B8' }} />
                                )}
                              </div>
                              <div style={styles.moduleContent}>
                                <div style={styles.moduleTopRow}>
                                  <span
                                    style={{
                                      ...styles.typeBadge,
                                      background:
                                        mod.type === '이론'
                                          ? 'rgba(79, 70, 229, 0.15)'
                                          : mod.type === '워게임'
                                          ? 'rgba(245, 158, 11, 0.15)'
                                          : 'rgba(16, 185, 129, 0.15)',
                                      color:
                                        mod.type === '이론'
                                          ? '#818CF8'
                                          : mod.type === '워게임'
                                          ? '#F59E0B'
                                          : '#10B981',
                                    }}
                                  >
                                    {mod.type === '이론' ? (
                                      <FileText size={12} />
                                    ) : mod.type === '워게임' ? (
                                      <Swords size={12} />
                                    ) : (
                                      <Code size={12} />
                                    )}
                                    {mod.type}
                                  </span>
                                  <div style={styles.moduleTime}>
                                    <Clock size={12} style={{ color: '#94A3B8' }} />
                                    <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                                      {mod.time}
                                    </span>
                                  </div>
                                </div>
                                <span
                                  style={{
                                    ...styles.moduleTitle,
                                    color: modCompleted
                                      ? '#94A3B8'
                                      : modLocked
                                      ? '#94A3B8'
                                      : '#0F172A',
                                    textDecoration: modCompleted
                                      ? 'line-through'
                                      : 'none',
                                  }}
                                >
                                  {mod.title}
                                </span>
                              </div>
                            </div>

                            <div style={styles.moduleRight}>
                              {modCompleted && mod.type === '이론' && theoryContent[mod.id] && (
                                <button
                                  style={styles.reviewBtn}
                                  onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
                                >
                                  <Eye size={14} />
                                  {openModule === mod.id ? '닫기' : '복습'}
                                </button>
                              )}
                              {modCompleted && (mod.type !== '이론' || !theoryContent[mod.id]) && (
                                <span style={styles.statusComplete}>완료</span>
                              )}
                              {modInProgress && mod.type === '이론' && (
                                <button
                                  style={styles.theoryStartBtn}
                                  onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
                                >
                                  <BookOpen size={14} />
                                  {openModule === mod.id ? '닫기' : '학습하기'}
                                </button>
                              )}
                              {modInProgress && mod.type === '실습' && (
                                <Link to="/lab" style={{ textDecoration: 'none' }}>
                                  <Button size="small" variant="primary">
                                    <Play size={14} />
                                    실습 시작
                                  </Button>
                                </Link>
                              )}
                              {modInProgress && mod.type === '워게임' && (
                                <Link to="/augment-demo" style={{ textDecoration: 'none' }}>
                                  <Button size="small" variant="primary">
                                    <Swords size={14} />
                                    도전하기
                                  </Button>
                                </Link>
                              )}
                              {modLocked && (
                                <span style={styles.statusLocked}>잠금</span>
                              )}
                            </div>
                          </div>

                          {/* 이론 콘텐츠 인라인 표시 */}
                          {openModule === mod.id && theoryContent[mod.id] && (
                            <div style={styles.theoryPanel}>
                              {theoryContent[mod.id].sections.map((sec, si) => (
                                <div key={si} style={styles.theorySection}>
                                  <h4 style={styles.theorySectionTitle}>{sec.title}</h4>
                                  <p style={styles.theorySectionBody}>{sec.body}</p>
                                </div>
                              ))}
                              {modInProgress && (
                                <button
                                  style={styles.theoryCompleteBtn}
                                  onClick={() => completeModule(mod.id)}
                                >
                                  <CheckCircle2 size={16} />
                                  학습 완료
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

      <style>{responsiveStyles}</style>
    </div>
  )
}

const responsiveStyles = `
  @media (max-width: 768px) {
    .curriculum-week-right-progress {
      display: none !important;
    }
  }
`

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },

  /* Header */
  header: {
    marginBottom: '40px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  sparklesIcon: {
    color: '#F59E0B',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#0F172A',
    margin: 0,
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748B',
    marginBottom: '28px',
    lineHeight: 1.5,
  },

  /* Overall Progress */
  overallProgressWrap: {
    background: '#FFFFFF',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #E2E8F0',
    borderRadius: '16px',
    padding: '24px',
  },
  overallProgressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  overallProgressLabel: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#0F172A',
  },
  overallProgressPercent: {
    fontSize: '1.1rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  overallProgressTrack: {
    width: '100%',
    height: '12px',
    background: '#E2E8F0',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  overallProgressBar: {
    height: '100%',
    borderRadius: '6px',
    background: 'linear-gradient(90deg, #4F46E5, #06B6D4)',
    transition: 'width 0.6s ease',
  },
  overallProgressDetail: {
    fontSize: '0.85rem',
    color: '#64748B',
  },

  /* Week List */
  weekList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  /* Week Card */
  weekCard: {
    padding: 0,
    overflow: 'hidden',
  },
  weekCardActive: {
    borderColor: 'rgba(79, 70, 229, 0.4)',
    boxShadow: '0 0 20px rgba(79, 70, 229, 0.1)',
  },
  weekCardLocked: {
    opacity: 0.7,
  },

  /* Week Header */
  weekHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '20px 24px',
    background: 'none',
    border: 'none',
    color: 'inherit',
    fontFamily: 'inherit',
    gap: '16px',
  },
  weekLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
    minWidth: 0,
  },
  weekBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  weekInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  weekTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    margin: 0,
    textAlign: 'left',
  },
  weekProgressLabel: {
    fontSize: '0.8rem',
    fontWeight: 500,
    textAlign: 'left',
  },
  weekRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexShrink: 0,
  },
  weekProgressTrack: {
    width: '120px',
    height: '6px',
    background: '#E2E8F0',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  weekProgressBar: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.4s ease',
  },

  /* Module List */
  moduleList: {
    borderTop: '1px solid #E2E8F0',
    padding: '8px 12px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  /* Module Item */
  moduleItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    gap: '12px',
  },
  moduleItemActive: {
    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(6, 182, 212, 0.06))',
    border: '1px solid rgba(79, 70, 229, 0.3)',
  },
  moduleItemLocked: {
    opacity: 0.5,
  },
  moduleItemCompleted: {
    opacity: 0.7,
  },

  moduleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flex: 1,
    minWidth: 0,
  },
  moduleIndex: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
  },
  moduleContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: 0,
  },
  moduleTopRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  typeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  moduleTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  moduleTitle: {
    fontSize: '0.92rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },

  moduleRight: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  statusComplete: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#10B981',
    padding: '4px 12px',
    borderRadius: '6px',
    background: 'rgba(16, 185, 129, 0.1)',
  },
  statusLocked: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#94A3B8',
    padding: '4px 12px',
    borderRadius: '6px',
    background: 'rgba(148, 163, 184, 0.08)',
  },

  /* Theory inline panel */
  theoryStartBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    color: '#fff',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  reviewBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #E2E8F0',
    background: '#fff',
    color: '#64748B',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  theoryPanel: {
    margin: '0 16px 12px 62px',
    padding: '20px 24px',
    background: '#F8FAFC',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  theorySection: {},
  theorySectionTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  theorySectionBody: {
    fontSize: '0.85rem',
    color: '#475569',
    lineHeight: 1.8,
    whiteSpace: 'pre-line',
  },
  theoryCompleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    alignSelf: 'flex-end',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: '#10B981',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '4px',
  },
}
