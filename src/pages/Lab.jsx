import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Button from '../components/Button'
import useLabWebSocket from '../hooks/useLabWebSocket'
import useContainerStatus from '../hooks/useContainerStatus'
import {
  Terminal,
  Clock,
  Lightbulb,
  ChevronRight,
  Play,
  Square,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Loader,
} from 'lucide-react'

const SESSION_ID = 'default'
const LAB_TIME_SECONDS = 3600

// Lab type determines default view: 'web' → browser first, 'system' → terminal first
const LAB_TYPE = 'web'  // SQLi is a web lab

const hints = [
  '로그인 폼의 입력값이 직접 SQL 쿼리에 삽입됩니다.',
  "인증 쿼리: SELECT * FROM users WHERE username='입력값' AND password='입력값'",
  "username에 admin'# 을 입력해보세요. (#은 MySQL 주석으로 뒤의 비밀번호 검증을 무시합니다)",
]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const statusLabels = {
  idle: '대기',
  starting: '시작 중...',
  running: '실행 중',
  stopping: '중지 중...',
  stopped: '중지됨',
  error: '오류',
}

const statusColors = {
  idle: '#64748B',
  starting: '#F59E0B',
  running: '#10B981',
  stopping: '#F59E0B',
  stopped: '#64748B',
  error: '#EF4444',
}

export default function Lab() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(LAB_TYPE === 'web' ? 'web' : 'terminal')
  const [showHint, setShowHint] = useState(false)
  const [hintLevel, setHintLevel] = useState(0)
  const [timeLeft, setTimeLeft] = useState(LAB_TIME_SECONDS)
  const timerRef = useRef(null)
  const [submitted, setSubmitted] = useState(false)
  const [labCleared, setLabCleared] = useState(() => {
    return localStorage.getItem('lab-sqli-cleared') === 'true'
  })
  const [showActions, setShowActions] = useState(false)

  // xterm.js refs
  const terminalRef = useRef(null)
  const termContainerRef = useRef(null)
  const fitAddonRef = useRef(null)
  const [termReady, setTermReady] = useState(false)

  // Container management
  const { status, error, start, stop, restart } = useContainerStatus(SESSION_ID)
  const isRunning = status === 'running'

  // 타이머 카운트다운 (실행 중일 때만)
  useEffect(() => {
    if (isRunning && !labCleared) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isRunning, labCleared])

  // WebSocket connection
  useLabWebSocket(termReady ? terminalRef.current : null, SESSION_ID, isRunning)

  // Initialize xterm.js
  useEffect(() => {
    if (!termContainerRef.current) return

    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: 'bar',
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      theme: {
        background: '#1E293B',
        foreground: '#C9D1D9',
        cursor: '#10B981',
        selectionBackground: 'rgba(79, 70, 229, 0.3)',
        black: '#1E293B',
        brightBlack: '#64748B',
        red: '#EF4444',
        brightRed: '#F87171',
        green: '#10B981',
        brightGreen: '#34D399',
        yellow: '#F59E0B',
        brightYellow: '#FBBF24',
        blue: '#3B82F6',
        brightBlue: '#60A5FA',
        magenta: '#8B5CF6',
        brightMagenta: '#A78BFA',
        cyan: '#06B6D4',
        brightCyan: '#22D3EE',
        white: '#C9D1D9',
        brightWhite: '#F8FAFC',
      },
      allowProposedApi: true,
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)
    term.open(termContainerRef.current)
    fitAddon.fit()

    term.writeln('\x1b[36m[LearnOps Lab]\x1b[0m SQL Injection 실습 환경')
    term.writeln('\x1b[33m[*]\x1b[0m "환경 시작" 버튼을 클릭하여 Docker 컨테이너를 시작하세요.\r\n')

    terminalRef.current = term
    fitAddonRef.current = fitAddon
    setTermReady(true)

    const handleResize = () => {
      try { fitAddon.fit() } catch { /* ignore */ }
    }
    window.addEventListener('resize', handleResize)

    // Use ResizeObserver for the container
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(termContainerRef.current)

    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
      term.dispose()
      terminalRef.current = null
      setTermReady(false)
    }
  }, [])

  // Re-fit terminal when container status changes
  useEffect(() => {
    if (fitAddonRef.current) {
      try { fitAddonRef.current.fit() } catch { /* ignore */ }
    }
  }, [status])

  // Listen for lab-clear postMessage from iframe
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'lab-clear') {
        setLabCleared(true)
        setSubmitted(true)
        localStorage.setItem('lab-sqli-cleared', 'true')
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  // Show action buttons 2 seconds after modal appears
  useEffect(() => {
    if (submitted && labCleared) {
      setShowActions(false)
      const timer = setTimeout(() => setShowActions(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [submitted, labCleared])

  const resetLabSessionState = useCallback(() => {
    clearInterval(timerRef.current)
    setTimeLeft(LAB_TIME_SECONDS)
    setSubmitted(false)
    setLabCleared(false)
    setShowActions(false)
    localStorage.removeItem('lab-sqli-cleared')
  }, [])

  const handleStart = useCallback(async () => {
    resetLabSessionState()
    if (terminalRef.current) {
      terminalRef.current.clear()
      terminalRef.current.writeln('\x1b[36m[LearnOps Lab]\x1b[0m Docker 컨테이너를 시작합니다...')
      terminalRef.current.writeln('\x1b[33m[*]\x1b[0m attacker, vuln-app, MySQL 컨테이너 생성 중...\r\n')
    }
    await start()
  }, [start, resetLabSessionState])

  const handleStop = useCallback(async () => {
    await stop()
    if (terminalRef.current) {
      terminalRef.current.writeln('\r\n\x1b[33m[*]\x1b[0m 환경이 중지되었습니다.')
    }
  }, [stop])

  const handleRestart = useCallback(async () => {
    resetLabSessionState()
    if (terminalRef.current) {
      terminalRef.current.clear()
      terminalRef.current.writeln('\x1b[36m[LearnOps Lab]\x1b[0m 환경을 재시작합니다...\r\n')
    }
    await restart()
  }, [restart, resetLabSessionState])

  const handleHintToggle = () => {
    if (!showHint) {
      setShowHint(true)
      if (hintLevel === 0) setHintLevel(1)
    } else {
      setShowHint(false)
    }
  }

  const handleNextHint = () => {
    if (hintLevel < 3) {
      setHintLevel(hintLevel + 1)
    }
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />
      <main className="dashboard-content" style={styles.main}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <div style={styles.labTitleRow}>
              <Terminal size={22} style={{ color: '#06B6D4' }} />
              <h1 style={styles.labTitle}>SQL Injection 실습</h1>
            </div>
            <span style={styles.difficultyBadge}>중급</span>
            <span style={{
              ...styles.statusBadge,
              color: statusColors[status],
              background: `${statusColors[status]}15`,
              borderColor: `${statusColors[status]}30`,
            }}>
              {(status === 'starting' || status === 'stopping') && (
                <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} />
              )}
              {statusLabels[status]}
            </span>
          </div>
          <div style={styles.topBarRight}>
            <div style={styles.timerWrap}>
              <Clock size={18} style={{ color: '#F59E0B' }} />
              <span style={styles.timerText}>{formatTime(timeLeft)}</span>
            </div>
            {labCleared && (
              <div style={styles.clearedBadge}>
                <CheckCircle2 size={16} />
                수강 완료
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <XCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Split screen */}
        <div style={styles.splitScreen} className="lab-split-screen">
          {/* Left panel - Problem description */}
          <div style={styles.leftPanel}>
            <div style={styles.panelHeader}>
              <FileText size={18} style={{ color: '#4F46E5' }} />
              <span style={styles.panelHeaderText}>문제 설명</span>
            </div>

            {/* Mission title */}
            <div style={styles.missionSection}>
              <h2 style={styles.missionTitle}>
                <Play size={18} style={{ color: '#10B981' }} />
                미션: 로그인 우회
              </h2>
            </div>

            {/* Objective */}
            <div style={styles.objectiveBox}>
              <h3 style={styles.sectionLabel}>목표</h3>
              <p style={styles.objectiveText}>
                SQL Injection을 이용하여 관리자 계정으로 로그인하세요.
              </p>
            </div>

            {/* Background info */}
            <div style={styles.infoSection}>
              <h3 style={styles.sectionLabel}>배경 정보</h3>
              <ul style={styles.infoList}>
                <li style={styles.infoItem}>
                  <ChevronRight size={14} style={{ color: '#06B6D4', flexShrink: 0, marginTop: '3px' }} />
                  <span>대상 웹 애플리케이션의 로그인 페이지에 SQL Injection 취약점이 존재합니다.</span>
                </li>
                <li style={styles.infoItem}>
                  <ChevronRight size={14} style={{ color: '#06B6D4', flexShrink: 0, marginTop: '3px' }} />
                  <span>관리자 계정(admin)으로 로그인에 성공하면 미션 완료입니다.</span>
                </li>
              </ul>
            </div>

            {/* Rules */}
            <div style={styles.rulesSection}>
              <h3 style={styles.sectionLabel}>규칙</h3>
              <ul style={styles.rulesList}>
                <li style={styles.ruleItem}>
                  <XCircle size={14} style={{ color: '#EF4444', flexShrink: 0, marginTop: '3px' }} />
                  <span>자동화 도구 사용 금지</span>
                </li>
                <li style={styles.ruleItem}>
                  <CheckCircle2 size={14} style={{ color: '#10B981', flexShrink: 0, marginTop: '3px' }} />
                  <span>제공된 환경 내에서만 실습</span>
                </li>
              </ul>
            </div>

            {/* Hint system */}
            <div style={styles.hintSection}>
              <button
                onClick={handleHintToggle}
                style={styles.hintToggleBtn}
              >
                <Lightbulb size={16} style={{ color: '#F59E0B' }} />
                <span>힌트 보기</span>
                {showHint ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>

              {showHint && (
                <div style={styles.hintContent}>
                  {hints.slice(0, hintLevel).map((hint, idx) => (
                    <div key={idx} style={styles.hintItem}>
                      <span style={styles.hintBadge}>힌트 {idx + 1}</span>
                      <p style={styles.hintText}>{hint}</p>
                    </div>
                  ))}
                  {hintLevel < 3 && (
                    <button
                      onClick={handleNextHint}
                      style={styles.nextHintBtn}
                    >
                      <Lightbulb size={14} />
                      다음 힌트 보기 ({hintLevel}/3)
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right panel - Terminal / Web */}
          <div style={styles.rightPanel}>
            {/* Tab bar */}
            <div style={styles.tabBar}>
              {LAB_TYPE === 'web' && (
                <button
                  style={activeTab === 'web' ? styles.tabActive : styles.tabInactive}
                  onClick={() => setActiveTab('web')}
                >
                  <Globe size={14} />
                  웹 브라우저
                </button>
              )}
              <button
                style={activeTab === 'terminal' ? styles.tabActive : styles.tabInactive}
                onClick={() => {
                  setActiveTab('terminal')
                  // Re-fit terminal when switching to it
                  setTimeout(() => {
                    try { fitAddonRef.current?.fit() } catch { /* ignore */ }
                  }, 50)
                }}
              >
                <Terminal size={14} />
                터미널
              </button>
              <div style={styles.tabBarActions}>
                {status === 'idle' || status === 'stopped' || status === 'error' ? (
                  <button
                    onClick={handleStart}
                    style={styles.envBtn}
                    title="환경 시작"
                  >
                    <Play size={14} />
                    환경 시작
                  </button>
                ) : status === 'running' ? (
                  <>
                    <button
                      onClick={handleRestart}
                      style={styles.tabBarIconBtn}
                      title="재시작"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <button
                      onClick={handleStop}
                      style={styles.stopBtn}
                      title="중지"
                    >
                      <Square size={14} />
                      중지
                    </button>
                  </>
                ) : (
                  <Loader size={14} style={{ color: '#F59E0B', animation: 'spin 1s linear infinite' }} />
                )}
              </div>
            </div>

            {/* Web browser view */}
            {activeTab === 'web' && (
              <div style={styles.webViewArea}>
                {isRunning ? (
                  <iframe
                    src={`/api/lab/proxy/?session=${SESSION_ID}`}
                    title="Lab Web App"
                    style={styles.webIframe}
                  />
                ) : (
                  <div style={styles.webPlaceholder}>
                    {status === 'starting' ? (
                      <>
                        <Loader size={40} style={{ color: '#06B6D4', animation: 'spin 1s linear infinite' }} />
                        <p style={{ ...styles.webPlaceholderText, color: '#06B6D4', fontWeight: 600 }}>
                          환경을 준비하는 중...
                        </p>
                        <p style={{ ...styles.webPlaceholderText, fontSize: '0.8rem' }}>
                          Docker 컨테이너 생성 및 DB 초기화 중입니다
                        </p>
                      </>
                    ) : (
                      <>
                        <Globe size={48} style={{ color: '#94A3B8' }} />
                        <p style={styles.webPlaceholderText}>
                          "환경 시작" 버튼을 클릭하면 여기에 대상 웹사이트가 표시됩니다.
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Terminal area - xterm.js (always mounted, hidden when web tab active) */}
            <div
              style={{
                ...styles.terminalArea,
                display: activeTab === 'terminal' ? 'block' : 'none',
              }}
              ref={termContainerRef}
            />
          </div>
        </div>

        {/* Clear modal */}
        {submitted && labCleared && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard}>
              {showActions && (
                <button
                  onClick={() => setSubmitted(false)}
                  style={styles.modalCloseBtn}
                >
                  <XCircle size={20} />
                </button>
              )}

              <div style={styles.modalContent}>
                <CheckCircle2 size={56} style={{ color: '#10B981' }} />
                <h2 style={styles.modalTitle}>수강 완료!</h2>
                <p style={styles.modalSubtitle}>
                  SQL Injection 실습을 성공적으로 완료했습니다.
                </p>

                <div style={styles.scoreBox}>
                  <div style={styles.scoreRow}>
                    <span style={styles.scoreLabel}>사용 힌트</span>
                    <span style={styles.scoreValueSm}>{hintLevel}개</span>
                  </div>
                </div>

                <div style={{
                  ...styles.modalActions,
                  opacity: showActions ? 1 : 0,
                  transform: showActions ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                  pointerEvents: showActions ? 'auto' : 'none',
                }}>
                  <Button variant="primary" style={{ flex: 1 }} onClick={() => navigate('/curriculum')}>
                    <ChevronRight size={16} />
                    다음 과정
                  </Button>
                  <Button variant="secondary" style={{ flex: 1 }} onClick={() => setSubmitted(false)}>
                    <FileText size={16} />
                    계속 실습
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

const styles = {
  main: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: 'calc(100vh - 72px)',
    overflow: 'hidden',
  },

  /* Top bar */
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px 24px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  labTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  labTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#0F172A',
    margin: 0,
  },
  difficultyBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#06B6D4',
    background: 'rgba(6, 182, 212, 0.15)',
    border: '1px solid rgba(6, 182, 212, 0.3)',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  timerWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '10px',
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
  },
  timerText: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#F59E0B',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
  clearedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '20px',
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#10B981',
    fontSize: '0.85rem',
    fontWeight: 700,
  },

  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '10px',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#EF4444',
    fontSize: '0.85rem',
    fontWeight: 500,
  },

  /* Split screen */
  splitScreen: {
    display: 'flex',
    gap: '20px',
    flex: 1,
    minHeight: 0,
  },

  /* Left panel */
  leftPanel: {
    flex: 1,
    background: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflowY: 'auto',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '16px',
    borderBottom: '1px solid #E2E8F0',
  },
  panelHeaderText: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  missionSection: {
    padding: 0,
  },
  missionTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#0F172A',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: 0,
  },
  objectiveBox: {
    background: 'rgba(79, 70, 229, 0.05)',
    border: '1px solid rgba(79, 70, 229, 0.15)',
    borderRadius: '10px',
    padding: '16px',
  },
  sectionLabel: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  objectiveText: {
    fontSize: '0.95rem',
    color: '#0F172A',
    lineHeight: 1.6,
    margin: 0,
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '0.9rem',
    color: '#64748B',
    lineHeight: 1.5,
  },
  rulesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  rulesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  ruleItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '0.9rem',
    color: '#64748B',
    lineHeight: 1.5,
  },

  /* Hint system */
  hintSection: {
    borderTop: '1px solid #E2E8F0',
    paddingTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  hintToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '10px',
    background: 'rgba(245, 158, 11, 0.08)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    color: '#F59E0B',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: 'fit-content',
  },
  hintContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  hintItem: {
    background: 'rgba(245, 158, 11, 0.05)',
    border: '1px solid rgba(245, 158, 11, 0.15)',
    borderRadius: '8px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  hintBadge: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#F59E0B',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  hintText: {
    fontSize: '0.88rem',
    color: '#0F172A',
    lineHeight: 1.5,
    margin: 0,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
  nextHintBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    background: 'transparent',
    border: '1px dashed rgba(245, 158, 11, 0.3)',
    color: '#F59E0B',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: 'fit-content',
  },

  /* Right panel */
  rightPanel: {
    flex: 1,
    background: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tabBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    borderBottom: '1px solid #E2E8F0',
    padding: '0 16px',
    background: '#F8FAFC',
  },
  tabActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '12px 16px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#0F172A',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid #4F46E5',
    cursor: 'pointer',
  },
  tabInactive: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '12px 16px',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#64748B',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
  tabBarActions: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tabBarIconBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748B',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  envBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '8px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#10B981',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  stopBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '8px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#EF4444',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  /* Web view */
  webViewArea: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webIframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  webPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '40px',
  },
  webPlaceholderText: {
    color: '#94A3B8',
    fontSize: '0.9rem',
    fontWeight: 500,
    textAlign: 'center',
    lineHeight: 1.6,
    margin: 0,
  },

  /* Terminal - xterm.js container */
  terminalArea: {
    flex: 1,
    background: '#1E293B',
    minHeight: 0,
    overflow: 'hidden',
    padding: '8px',
  },

  /* Modal */
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '24px',
  },
  modalCard: {
    position: 'relative',
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748B',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'color 0.2s ease',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#0F172A',
    margin: 0,
  },
  modalSubtitle: {
    fontSize: '0.9rem',
    color: '#64748B',
    margin: 0,
    lineHeight: 1.5,
  },
  scoreBox: {
    width: '100%',
    background: '#F8FAFC',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '8px',
    border: '1px solid #E2E8F0',
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    fontSize: '0.85rem',
    color: '#64748B',
  },
  scoreValue: {
    fontSize: '1.5rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  scoreValueSm: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#0F172A',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    marginTop: '8px',
  },
}

/* Inject responsive styles + spinner animation */
const labStyleEl = document.createElement('style')
labStyleEl.textContent = `
  @media (max-width: 900px) {
    .lab-split-screen {
      flex-direction: column !important;
    }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`
if (!document.querySelector('[data-learnops-lab-styles]')) {
  labStyleEl.setAttribute('data-learnops-lab-styles', '')
  document.head.appendChild(labStyleEl)
}
