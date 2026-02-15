import { useState } from 'react'
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
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Button from '../components/Button'
import Card from '../components/Card'

const curriculumData = [
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
                          <div
                            key={mod.id}
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
                                          : 'rgba(16, 185, 129, 0.15)',
                                      color:
                                        mod.type === '이론' ? '#818CF8' : '#10B981',
                                    }}
                                  >
                                    {mod.type === '이론' ? (
                                      <FileText size={12} />
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
                              {modCompleted && (
                                <span style={styles.statusComplete}>완료</span>
                              )}
                              {modInProgress && (
                                <Link to="/lab" style={{ textDecoration: 'none' }}>
                                  <Button size="small" variant="primary">
                                    <Play size={14} />
                                    학습 시작
                                  </Button>
                                </Link>
                              )}
                              {modLocked && (
                                <span style={styles.statusLocked}>잠금</span>
                              )}
                            </div>
                          </div>
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
}
