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
  Loader2,
  Target,
  Calendar,
  Layers,
  ArrowLeft,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Button from '../components/Button'
import Card from '../components/Card'

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

/* ── component ── */

export default function Curriculum() {
  const [expanded, setExpanded] = useState(false)
  const [expandedWeek, setExpandedWeek] = useState(null)
  const [curriculumData, setCurriculumData] = useState(null)
  const [rawData, setRawData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCurriculum() {
      try {
        const stored = localStorage.getItem('learnops_user')
        const userId = stored ? JSON.parse(stored).email : null
        if (!userId) { setLoading(false); return }

        const res = await fetch(`/api/ai/saved-curriculum?userId=${encodeURIComponent(userId)}`)
        if (!res.ok) { setLoading(false); return }

        const data = await res.json()
        if (data.weeks && data.weeks.length > 0) {
          setRawData(data)
          const transformed = data.weeks.map((week, wi) => ({
            week: week.week,
            title: week.title,
            goal: week.goal,
            status: wi === 0 ? 'in-progress' : 'locked',
            modules: (week.modules || []).map((mod, mi) => ({
              id: `m${week.week}-${mi + 1}`,
              type: mod.type,
              title: mod.title,
              desc: mod.desc,
              time: mod.time,
              status: wi === 0 && mi === 0 ? 'in-progress' : 'locked',
            })),
          }))
          setCurriculumData(transformed)
        }
      } catch { /* best-effort */ }
      setLoading(false)
    }
    loadCurriculum()
  }, [])

  const completeModule = (moduleId) => {
    setCurriculumData(prev => {
      if (!prev) return prev
      const next = prev.map(week => ({
        ...week,
        modules: week.modules.map(m => ({ ...m })),
      }))

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
  }

  const toggleWeek = (weekNum) => {
    setExpandedWeek(expandedWeek === weekNum ? null : weekNum)
  }

  const openRoadmap = () => {
    setExpanded(true)
    // auto-expand first in-progress week
    if (curriculumData) {
      const inProg = curriculumData.find(w => w.status === 'in-progress')
      setExpandedWeek(inProg ? inProg.week : curriculumData[0]?.week ?? null)
    }
  }

  /* ── loading ── */
  if (loading) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <Sidebar />
        <main className="dashboard-content">
          <div style={st.centerBox}>
            <Loader2 size={36} style={{ color: '#4F46E5', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748B', marginTop: '16px' }}>커리큘럼을 불러오는 중...</p>
          </div>
        </main>
        <style>{keyframes}</style>
      </div>
    )
  }

  /* ── empty state ── */
  if (!curriculumData || !rawData) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <Sidebar />
        <main className="dashboard-content">
          <div style={st.centerBox}>
            <div style={st.emptyIcon}><Target size={48} /></div>
            <h2 style={st.emptyTitle}>저장된 커리큘럼이 없습니다</h2>
            <p style={st.emptyDesc}>레벨테스트를 진행하고 AI 맞춤 커리큘럼을 생성해보세요.</p>
            <Link to="/level-test" style={{ textDecoration: 'none' }}>
              <Button size="large"><BookOpen size={18} /> 레벨테스트 시작하기</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  /* ── stats ── */
  const totalModules = curriculumData.reduce((a, w) => a + w.modules.length, 0)
  const completedModules = curriculumData.reduce((a, w) => a + w.modules.filter(m => m.status === 'completed').length, 0)
  const overallPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
  const totalWeeks = rawData.totalWeeks || curriculumData.length

  /* ═══════════════════════════════════════════════
     CARD VIEW (collapsed)
     ═══════════════════════════════════════════════ */
  if (!expanded) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <Sidebar />
        <main className="dashboard-content">
          <div style={st.page}>
            {/* page header */}
            <div style={st.pageHeader}>
              <Sparkles size={28} style={{ color: '#F59E0B' }} />
              <h1 style={st.pageTitle}>커리큘럼</h1>
            </div>
            <p style={st.pageSubtitle}>저장된 AI 맞춤 학습 로드맵입니다. 카드를 눌러 상세 로드맵을 확인하세요.</p>

            {/* curriculum card */}
            <div style={st.cardOuter} onClick={openRoadmap}>
              {/* gradient top bar */}
              <div style={st.cardGradientBar} />

              <div style={st.cardBody}>
                {/* top row */}
                <div style={st.cardTopRow}>
                  <div style={st.cardIconWrap}>
                    <BookOpen size={26} />
                  </div>
                  <div style={st.cardMeta}>
                    <div style={st.cardMetaItem}>
                      <Calendar size={14} style={{ color: '#64748B' }} />
                      <span>{totalWeeks}주 과정</span>
                    </div>
                    <div style={st.cardMetaItem}>
                      <Layers size={14} style={{ color: '#64748B' }} />
                      <span>{totalModules}개 모듈</span>
                    </div>
                  </div>
                </div>

                {/* title */}
                <h2 style={st.cardTitle}>{rawData.title || 'AI 맞춤 커리큘럼'}</h2>

                {/* week preview chips */}
                <div style={st.chipRow}>
                  {curriculumData.slice(0, 4).map(w => (
                    <span key={w.week} style={{
                      ...st.chip,
                      ...(w.status === 'completed' ? st.chipDone : w.status === 'in-progress' ? st.chipActive : {}),
                    }}>
                      W{w.week} {w.title}
                    </span>
                  ))}
                  {curriculumData.length > 4 && (
                    <span style={st.chip}>+{curriculumData.length - 4}</span>
                  )}
                </div>

                {/* progress */}
                <div style={st.cardProgressWrap}>
                  <div style={st.cardProgressHeader}>
                    <span style={st.cardProgressLabel}>진행률</span>
                    <span style={st.cardProgressPct}>{overallPercent}%</span>
                  </div>
                  <div style={st.cardProgressTrack}>
                    <div style={{ ...st.cardProgressBar, width: `${overallPercent}%` }} />
                  </div>
                  <span style={st.cardProgressDetail}>{completedModules}/{totalModules} 모듈 완료</span>
                </div>

                {/* CTA */}
                <div style={st.cardCta}>
                  <span style={st.cardCtaText}>로드맵 상세 보기</span>
                  <ChevronRight size={18} style={{ color: '#4F46E5' }} />
                </div>
              </div>
            </div>
          </div>
        </main>
        <style>{keyframes}</style>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════
     ROADMAP VIEW (expanded)
     ═══════════════════════════════════════════════ */
  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />
      <main className="dashboard-content">
        <div style={st.page}>
          {/* back button + header */}
          <button style={st.backBtn} onClick={() => setExpanded(false)}>
            <ArrowLeft size={18} /> 카드로 돌아가기
          </button>

          <div style={st.roadmapHeader}>
            <div style={st.pageHeader}>
              <Sparkles size={28} style={{ color: '#F59E0B' }} />
              <h1 style={st.pageTitle}>{rawData.title || 'AI 맞춤 커리큘럼'}</h1>
            </div>
            <p style={st.pageSubtitle}>총 {totalWeeks}주 과정 &middot; {totalModules}개 모듈</p>

            {/* overall progress */}
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

          {/* week accordion */}
          <div style={st.weekList}>
            {curriculumData.map((week) => {
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
                  {/* week header */}
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
                        <span>Week {week.week}</span>
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
                          ...st.weekProgressBar,
                          width: `${pct}%`,
                          background: isCompleted ? '#10B981' : isInProgress ? 'linear-gradient(90deg,#4F46E5,#06B6D4)' : 'transparent',
                        }} />
                      </div>
                      {!isLocked && (isExp ? <ChevronUp size={20} style={{ color: '#64748B' }}/> : <ChevronDown size={20} style={{ color: '#64748B' }}/>)}
                      {isLocked && <Lock size={18} style={{ color: '#94A3B8' }}/>}
                    </div>
                  </button>

                  {/* modules */}
                  {isExp && !isLocked && (
                    <div style={st.moduleList}>
                      {week.modules.map((mod) => {
                        const done = mod.status === 'completed'
                        const active = mod.status === 'in-progress'
                        const locked = mod.status === 'locked'
                        return (
                          <div key={mod.id} style={{
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
                                    background: mod.type === '이론' ? 'rgba(79,70,229,0.15)' : 'rgba(16,185,129,0.15)',
                                    color: mod.type === '이론' ? '#818CF8' : '#10B981',
                                  }}>
                                    {mod.type === '이론' ? <FileText size={12}/> : <Code size={12}/>}
                                    {mod.type}
                                  </span>
                                  <div style={st.modTime}>
                                    <Clock size={12} style={{ color: '#94A3B8' }}/>
                                    <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{mod.time}</span>
                                  </div>
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
                              {done && <span style={st.statusDone}>완료</span>}
                              {active && (
                                <button style={st.completeBtn} onClick={() => completeModule(mod.id)}>
                                  <CheckCircle2 size={14}/> 완료 처리
                                </button>
                              )}
                              {locked && <span style={st.statusLocked}>잠금</span>}
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
      <style>{`
        @media (max-width: 768px) {
          .curriculum-week-right-progress { display: none !important; }
        }
        ${keyframes}
      `}</style>
    </div>
  )
}

/* ── keyframes ── */
const keyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`

/* ── styles ── */
const st = {
  /* layout */
  page: { maxWidth: 900, margin: '0 auto' },
  centerBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)', textAlign: 'center', padding: 24,
  },
  pageHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 },
  pageTitle: { fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', margin: 0 },
  pageSubtitle: { fontSize: '1rem', color: '#64748B', marginBottom: 28, lineHeight: 1.5 },

  /* empty */
  emptyIcon: {
    width: 80, height: 80, borderRadius: 20,
    background: 'linear-gradient(135deg,rgba(79,70,229,0.12),rgba(6,182,212,0.08))',
    color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  emptyTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 },
  emptyDesc: { fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6, marginBottom: 24 },

  /* ═══ summary card ═══ */
  cardOuter: {
    position: 'relative',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 20,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  cardGradientBar: {
    height: 5,
    background: 'linear-gradient(90deg, #4F46E5, #06B6D4, #10B981)',
  },
  cardBody: { padding: '28px 28px 24px' },
  cardTopRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  cardIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    background: 'linear-gradient(135deg,rgba(79,70,229,0.12),rgba(6,182,212,0.08))',
    color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  cardMeta: { display: 'flex', gap: 16 },
  cardMetaItem: { display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.82rem', color: '#64748B', fontWeight: 500 },
  cardTitle: {
    fontSize: '1.25rem', fontWeight: 800, margin: '0 0 16px',
    background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },

  /* chips */
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    padding: '4px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600,
    background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0', whiteSpace: 'nowrap',
  },
  chipActive: { background: 'rgba(79,70,229,0.08)', color: '#4F46E5', borderColor: 'rgba(79,70,229,0.25)' },
  chipDone: { background: 'rgba(16,185,129,0.08)', color: '#10B981', borderColor: 'rgba(16,185,129,0.25)' },

  /* card progress */
  cardProgressWrap: {
    background: '#F8FAFC', borderRadius: 12, padding: '16px 18px', marginBottom: 16, border: '1px solid #F1F5F9',
  },
  cardProgressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  cardProgressLabel: { fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' },
  cardProgressPct: {
    fontSize: '0.95rem', fontWeight: 700,
    background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  cardProgressTrack: { width: '100%', height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  cardProgressBar: { height: '100%', borderRadius: 4, background: 'linear-gradient(90deg,#4F46E5,#06B6D4)', transition: 'width 0.6s ease' },
  cardProgressDetail: { fontSize: '0.78rem', color: '#94A3B8' },

  /* CTA */
  cardCta: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '12px 0 0', borderTop: '1px solid #F1F5F9',
  },
  cardCtaText: { fontSize: '0.9rem', fontWeight: 700, color: '#4F46E5' },

  /* ═══ roadmap view ═══ */
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 0', marginBottom: 16,
    background: 'none', border: 'none', color: '#64748B', fontSize: '0.88rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  roadmapHeader: { marginBottom: 32 },

  /* overall progress (roadmap) */
  overallWrap: {
    background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0',
    borderRadius: 16, padding: 24,
  },
  overallRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  overallLabel: { fontSize: '0.95rem', fontWeight: 600, color: '#0F172A' },
  overallPct: {
    fontSize: '1.1rem', fontWeight: 700,
    background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  overallTrack: { width: '100%', height: 12, background: '#E2E8F0', borderRadius: 6, overflow: 'hidden', marginBottom: 8 },
  overallBar: { height: '100%', borderRadius: 6, background: 'linear-gradient(90deg,#4F46E5,#06B6D4)', transition: 'width 0.6s ease' },
  overallDetail: { fontSize: '0.85rem', color: '#64748B' },

  /* week list */
  weekList: { display: 'flex', flexDirection: 'column', gap: 16 },
  weekCard: { padding: 0, overflow: 'hidden' },
  weekCardActive: { borderColor: 'rgba(79,70,229,0.4)', boxShadow: '0 0 20px rgba(79,70,229,0.1)' },
  weekCardLocked: { opacity: 0.7 },

  weekHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
    padding: '20px 24px', background: 'none', border: 'none', color: 'inherit', fontFamily: 'inherit', gap: 16,
  },
  weekLeft: { display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 },
  weekBadge: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
    fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap',
  },
  weekInfo: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  weekTitle: { fontSize: '1rem', fontWeight: 700, margin: 0, textAlign: 'left' },
  weekProgressLabel: { fontSize: '0.8rem', fontWeight: 500, textAlign: 'left' },
  weekRight: { display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 },
  weekProgressTrack: { width: 120, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  weekProgressBar: { height: '100%', borderRadius: 3, transition: 'width 0.4s ease' },

  /* modules */
  moduleList: { borderTop: '1px solid #E2E8F0', padding: '8px 12px 12px', display: 'flex', flexDirection: 'column', gap: 4 },
  modItem: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px', borderRadius: 12, transition: 'all 0.2s ease', gap: 12,
  },
  modItemActive: { background: 'linear-gradient(135deg,rgba(79,70,229,0.08),rgba(6,182,212,0.06))', border: '1px solid rgba(79,70,229,0.3)' },
  modItemLocked: { opacity: 0.5 },
  modItemDone: { opacity: 0.7 },
  modLeft: { display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 },
  modIcon: { flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 },
  modContent: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 },
  modTopRow: { display: 'flex', alignItems: 'center', gap: 10 },
  typeBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6,
    fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap',
  },
  modTime: { display: 'flex', alignItems: 'center', gap: 4 },
  modTitle: { fontSize: '0.92rem', fontWeight: 600, lineHeight: 1.3 },
  modDesc: { fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4 },
  modRight: { display: 'flex', alignItems: 'center', flexShrink: 0 },
  statusDone: {
    fontSize: '0.8rem', fontWeight: 600, color: '#10B981', padding: '4px 12px', borderRadius: 6,
    background: 'rgba(16,185,129,0.1)',
  },
  statusLocked: {
    fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', padding: '4px 12px', borderRadius: 6,
    background: 'rgba(148,163,184,0.08)',
  },
  completeBtn: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8,
    border: 'none', background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#fff',
    fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
  },
}
