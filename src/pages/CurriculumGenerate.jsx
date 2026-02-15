import { useState } from 'react'
import {
  Sparkles,
  Clock,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Shield,
  Globe,
  Server,
  HardDrive,
  Lock,
  Search,
  Cloud,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

/* =========================================================
   DATA — Hierarchical Topics (7 main → 8-10 subtopics each)
   ========================================================= */

const mainTopics = [
  {
    id: 'reversing',
    label: '리버스 엔지니어링',
    icon: Shield,
    color: '#8B5CF6',
    subtopics: [
      { id: 'asm-basics', label: 'x86 어셈블리 기초' },
      { id: 'pe-analysis', label: 'PE 구조 분석' },
      { id: 'elf-analysis', label: 'ELF 분석' },
      { id: 'ida-ghidra', label: 'IDA/Ghidra 정적 분석' },
      { id: 'x64dbg-gdb', label: 'x64dbg/GDB 동적 분석' },
      { id: 'anti-debug', label: '안티 디버깅 우회' },
      { id: 'packing', label: '패킹/언패킹' },
      { id: 'win-api-hook', label: '윈도우 API 후킹' },
      { id: 'dotnet-java', label: '.NET/Java 디컴파일' },
      { id: 'firmware-re', label: '펌웨어 리버싱' },
    ],
  },
  {
    id: 'web',
    label: '웹 보안',
    icon: Globe,
    color: '#4F46E5',
    subtopics: [
      { id: 'sqli', label: 'SQL Injection' },
      { id: 'xss', label: 'XSS' },
      { id: 'csrf-ssrf', label: 'CSRF/SSRF' },
      { id: 'auth-vuln', label: '인증/인가 취약점' },
      { id: 'file-upload', label: '파일 업로드 취약점' },
      { id: 'api-security', label: 'API 보안' },
      { id: 'webshell-rce', label: '웹 셸/RCE' },
      { id: 'auto-scan', label: '자동화 스캐닝' },
      { id: 'waf-bypass', label: 'WAF 우회' },
      { id: 'bugbounty', label: '버그바운티 실전' },
    ],
  },
  {
    id: 'network',
    label: '네트워크 보안',
    icon: Server,
    color: '#06B6D4',
    subtopics: [
      { id: 'tcpip', label: 'TCP/IP 프로토콜' },
      { id: 'wireshark', label: '패킷 분석(Wireshark)' },
      { id: 'spoofing', label: 'ARP/DNS 스푸핑' },
      { id: 'fw-ids-ips', label: '방화벽/IDS/IPS' },
      { id: 'vpn-ipsec', label: 'VPN/IPSec' },
      { id: 'wireless', label: '무선 네트워크 보안' },
      { id: 'net-forensic', label: '네트워크 포렌식' },
      { id: 'nmap', label: '포트 스캐닝/Nmap' },
      { id: 'mitm', label: '중간자 공격' },
      { id: 'net-monitor', label: '네트워크 모니터링' },
    ],
  },
  {
    id: 'system',
    label: '시스템 보안',
    icon: HardDrive,
    color: '#10B981',
    subtopics: [
      { id: 'linux-perm', label: 'Linux 권한 관리' },
      { id: 'win-policy', label: 'Windows 보안 정책' },
      { id: 'priv-esc', label: '권한 상승 기법' },
      { id: 'proc-mem', label: '프로세스/메모리 분석' },
      { id: 'rootkit', label: '루트킷 탐지' },
      { id: 'kernel-sec', label: '커널 보안' },
      { id: 'container-sec', label: '컨테이너 보안' },
      { id: 'log-analysis', label: '로그 분석' },
      { id: 'backdoor', label: '백도어 탐지' },
      { id: 'hardening', label: '시스템 하드닝' },
    ],
  },
  {
    id: 'malware',
    label: '악성코드 분석',
    icon: Search,
    color: '#EF4444',
    subtopics: [
      { id: 'mal-type', label: '악성코드 유형 분류' },
      { id: 'static-prop', label: '정적 속성 분석' },
      { id: 'dynamic-behav', label: '동적 행위 분석' },
      { id: 'net-traffic', label: '네트워크 트래픽 분석' },
      { id: 'ioc', label: 'IoC 추출' },
      { id: 'yara', label: 'YARA 룰 작성' },
      { id: 'sandbox', label: '샌드박스 활용' },
      { id: 'ransomware', label: '랜섬웨어 분석' },
      { id: 'doc-malware', label: '문서형 악성코드' },
      { id: 'report', label: '분석 보고서 작성' },
    ],
  },
  {
    id: 'cloud',
    label: '클라우드 보안',
    icon: Cloud,
    color: '#EC4899',
    subtopics: [
      { id: 'cloud-arch', label: '클라우드 아키텍처 기초' },
      { id: 'iam', label: 'IAM 보안' },
      { id: 's3-storage', label: 'S3/스토리지 보안' },
      { id: 'k8s-sec', label: '컨테이너/K8s 보안' },
      { id: 'serverless', label: '서버리스 보안' },
      { id: 'cloud-log', label: '클라우드 로깅/모니터링' },
      { id: 'cspm', label: 'CSPM' },
      { id: 'multi-cloud', label: '멀티클라우드 보안' },
      { id: 'iac-sec', label: '인프라 as 코드 보안' },
      { id: 'cloud-forensic', label: '클라우드 포렌식' },
    ],
  },
  {
    id: 'crypto',
    label: '암호학',
    icon: Lock,
    color: '#F59E0B',
    subtopics: [
      { id: 'symmetric', label: '대칭키 암호' },
      { id: 'asymmetric', label: '비대칭키 암호' },
      { id: 'hash', label: '해시 함수' },
      { id: 'pki', label: 'PKI/인증서' },
      { id: 'tls-ssl', label: 'TLS/SSL' },
      { id: 'crypto-proto', label: '암호 프로토콜' },
      { id: 'crypto-vuln', label: '암호 구현 취약점' },
      { id: 'blockchain', label: '블록체인 보안' },
      { id: 'quantum', label: '양자 암호' },
      { id: 'cryptanalysis', label: '암호 분석 기법' },
    ],
  },
]

/* =========================================================
   Demo Curriculum Generator
   ========================================================= */

function generateDemoCurriculum(selectedSubs, difficulty, duration) {
  const weeks = parseInt(duration) || 8
  const subsPerWeek = Math.max(2, Math.ceil(selectedSubs.length / weeks))
  const curriculum = []
  let idx = 0

  for (let w = 1; w <= weeks; w++) {
    const weekSubs = selectedSubs.slice(idx, idx + subsPerWeek)
    if (weekSubs.length === 0) break
    idx += subsPerWeek

    const diffLabel = w <= Math.ceil(weeks / 3) ? '초급' : w <= Math.ceil((weeks * 2) / 3) ? '중급' : '고급'
    const hours = difficulty === '초급' ? 10 + w : difficulty === '고급' ? 14 + w * 2 : 12 + w

    curriculum.push({
      week: w,
      title: weekSubs.map((s) => s.label).join(', '),
      topics: weekSubs.map((s) => `${s.label} — 핵심 개념 학습 및 실습`),
      hours,
      difficulty: diffLabel,
    })
  }

  return curriculum
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function CurriculumGenerate() {
  const [activeMain, setActiveMain] = useState(mainTopics[0].id)
  const [selectedSubs, setSelectedSubs] = useState([])
  const [difficulty, setDifficulty] = useState('중급')
  const [duration, setDuration] = useState('8주')
  const [goal, setGoal] = useState('')
  const [showCurriculum, setShowCurriculum] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [curriculum, setCurriculum] = useState([])

  const activeTopicData = mainTopics.find((t) => t.id === activeMain)

  const toggleSub = (sub) => {
    setSelectedSubs((prev) => {
      const exists = prev.find((s) => s.id === sub.id)
      return exists ? prev.filter((s) => s.id !== sub.id) : [...prev, sub]
    })
  }

  const isSubSelected = (subId) => selectedSubs.some((s) => s.id === subId)

  const handleGenerate = () => {
    if (selectedSubs.length === 0) return
    setIsGenerating(true)
    setShowCurriculum(false)
    setTimeout(() => {
      const gen = generateDemoCurriculum(selectedSubs, difficulty, duration)
      setCurriculum(gen)
      setIsGenerating(false)
      setShowCurriculum(true)
    }, 2000)
  }

  const totalHours = curriculum.reduce((acc, w) => acc + w.hours, 0)

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="dashboard-content">
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.titleRow}>
              <div style={styles.titleIconWrap}>
                <Sparkles size={24} />
              </div>
              <div>
                <h1 style={styles.title}>커리큘럼 생성</h1>
                <p style={styles.subtitle}>
                  대주제를 선택하고 세부 주제를 골라 AI 맞춤 커리큘럼을 생성하세요
                </p>
              </div>
            </div>
          </div>

          {/* ===== Main Topic Tab Bar ===== */}
          <div style={styles.tabBar} className="cg-tab-bar">
            {mainTopics.map((topic) => {
              const Icon = topic.icon
              const isActive = activeMain === topic.id
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveMain(topic.id)}
                  style={{
                    ...styles.tabBtn,
                    ...(isActive
                      ? { background: `${topic.color}12`, color: topic.color, border: `2px solid ${topic.color}` }
                      : {}),
                  }}
                >
                  <Icon size={16} />
                  <span>{topic.label}</span>
                </button>
              )
            })}
          </div>

          {/* ===== Content Grid: Subtopic Cards + Settings ===== */}
          <div style={styles.contentGrid} className="cg-content-grid">
            {/* Left — Subtopic cards */}
            <div style={styles.leftPanel}>
              <div style={styles.sectionCard}>
                <h2 style={styles.sectionTitle}>
                  <BookOpen size={20} style={{ color: activeTopicData?.color || '#4F46E5' }} />
                  {activeTopicData?.label} — 세부 주제
                </h2>
                <p style={styles.sectionDesc}>
                  학습할 세부 주제를 선택하세요 (복수 선택 가능)
                </p>
                <div style={styles.subGrid} className="cg-sub-grid">
                  {activeTopicData?.subtopics.map((sub) => {
                    const selected = isSubSelected(sub.id)
                    return (
                      <button
                        key={sub.id}
                        onClick={() => toggleSub(sub)}
                        style={{
                          ...styles.subCard,
                          ...(selected
                            ? {
                                border: `2px solid ${activeTopicData.color}`,
                                background: `${activeTopicData.color}06`,
                                boxShadow: `0 0 0 1px ${activeTopicData.color}15, 0 4px 12px ${activeTopicData.color}10`,
                              }
                            : {}),
                        }}
                      >
                        <div
                          style={{
                            ...styles.subIcon,
                            background: selected ? `${activeTopicData.color}15` : '#F8FAFC',
                            color: selected ? activeTopicData.color : '#94A3B8',
                          }}
                        >
                          {selected ? <CheckCircle2 size={18} /> : <BookOpen size={18} />}
                        </div>
                        <span
                          style={{
                            ...styles.subLabel,
                            color: selected ? activeTopicData.color : '#0F172A',
                          }}
                        >
                          {sub.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right — Settings panel */}
            <div style={styles.rightPanel}>
              <div style={styles.sectionCard}>
                <h2 style={styles.sectionTitle}>
                  <Sparkles size={20} style={{ color: '#06B6D4' }} />
                  생성 설정
                </h2>

                {/* Selected subtopics summary */}
                <div style={styles.configGroup}>
                  <label style={styles.configLabel}>선택된 주제</label>
                  <div style={styles.selectedTagsWrap}>
                    {selectedSubs.length === 0 ? (
                      <span style={styles.placeholderText}>세부 주제를 선택해주세요</span>
                    ) : (
                      selectedSubs.map((sub) => (
                        <span key={sub.id} style={styles.selectedTag}>
                          {sub.label}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Difficulty */}
                <div style={styles.configGroup}>
                  <label style={styles.configLabel}>난이도</label>
                  <div style={styles.radioGroup}>
                    {['초급', '중급', '고급'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        style={{
                          ...styles.radioBtn,
                          ...(difficulty === level ? styles.radioBtnActive : {}),
                        }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div style={styles.configGroup}>
                  <label style={styles.configLabel}>기간</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={styles.select}
                  >
                    <option value="4주">4주</option>
                    <option value="8주">8주</option>
                    <option value="12주">12주</option>
                  </select>
                </div>

                {/* Goal */}
                <div style={styles.configGroup}>
                  <label style={styles.configLabel}>학습 목표</label>
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="예: 악성코드 분석 전문가가 되고 싶습니다. CTF 대회에서 리버싱 문제를 풀 수 있는 실력을 갖추고 싶습니다."
                    style={styles.textarea}
                    rows={4}
                  />
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={selectedSubs.length === 0 || isGenerating}
                  style={{
                    ...styles.generateBtn,
                    ...(selectedSubs.length === 0 || isGenerating ? styles.generateBtnDisabled : {}),
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                      AI 커리큘럼 생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      AI 커리큘럼 생성하기
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ===== Generated Curriculum Preview ===== */}
          {showCurriculum && (
            <div style={styles.curriculumSection}>
              <div style={styles.curriculumHeader}>
                <div>
                  <h2 style={styles.curriculumTitle}>
                    <CheckCircle2 size={24} style={{ color: '#10B981' }} />
                    생성된 커리큘럼
                  </h2>
                  <p style={styles.curriculumSubtitle}>
                    선택한 주제를 기반으로 AI가 맞춤 커리큘럼을 구성했습니다
                  </p>
                </div>
                <div style={styles.curriculumStats}>
                  <div style={styles.statBadge}>
                    <Clock size={14} />
                    <span>총 {totalHours}시간</span>
                  </div>
                  <div style={styles.statBadge}>
                    <BookOpen size={14} />
                    <span>{curriculum.length}주 과정</span>
                  </div>
                </div>
              </div>

              {/* Overall progress */}
              <div style={styles.overallProgressWrap}>
                <div style={styles.overallProgressHeader}>
                  <span style={styles.overallProgressLabel}>전체 커리큘럼 구성</span>
                  <span style={styles.overallProgressPercent}>100%</span>
                </div>
                <div style={styles.overallProgressTrack}>
                  <div style={styles.overallProgressBar} />
                </div>
              </div>

              {/* Week cards */}
              <div style={styles.weekList}>
                {curriculum.map((week, index) => (
                  <div key={week.week} style={styles.weekCard}>
                    <div style={styles.weekCardHeader}>
                      <div style={styles.weekLeft}>
                        <div
                          style={{
                            ...styles.weekBadge,
                            background:
                              index < Math.ceil(curriculum.length / 3)
                                ? 'rgba(79,70,229,0.08)'
                                : index < Math.ceil((curriculum.length * 2) / 3)
                                ? 'rgba(6,182,212,0.08)'
                                : 'rgba(16,185,129,0.08)',
                            color:
                              index < Math.ceil(curriculum.length / 3)
                                ? '#4F46E5'
                                : index < Math.ceil((curriculum.length * 2) / 3)
                                ? '#06B6D4'
                                : '#10B981',
                          }}
                        >
                          Week {week.week}
                        </div>
                        <div>
                          <h3 style={styles.weekTitle}>{week.title}</h3>
                          <div style={styles.weekMeta}>
                            <span style={styles.weekMetaItem}>
                              <Clock size={13} />
                              {week.hours}시간
                            </span>
                            <span style={styles.weekMetaItem}>
                              <ChevronRight size={13} />
                              {week.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={styles.weekHoursCircle}>
                        <span style={styles.weekHoursNum}>{week.hours}</span>
                        <span style={styles.weekHoursUnit}>hrs</span>
                      </div>
                    </div>

                    <div style={styles.weekTopics}>
                      {week.topics.map((topic, i) => (
                        <div key={i} style={styles.weekTopicItem}>
                          <div style={styles.weekTopicDot} />
                          <span style={styles.weekTopicText}>{topic}</span>
                        </div>
                      ))}
                    </div>

                    <div style={styles.weekProgressWrap}>
                      <div style={styles.weekProgressTrack}>
                        <div
                          style={{
                            ...styles.weekProgressBar,
                            width: '100%',
                            background:
                              index < Math.ceil(curriculum.length / 3)
                                ? 'linear-gradient(90deg, #4F46E5, #818CF8)'
                                : index < Math.ceil((curriculum.length * 2) / 3)
                                ? 'linear-gradient(90deg, #06B6D4, #67E8F9)'
                                : 'linear-gradient(90deg, #10B981, #6EE7B7)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{responsiveStyles}</style>
    </div>
  )
}

/* =========================================================
   Responsive CSS
   ========================================================= */

const responsiveStyles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .cg-tab-bar {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  .cg-content-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
    margin-bottom: 40px;
  }

  .cg-sub-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 1024px) {
    .cg-content-grid {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 768px) {
    .cg-sub-grid {
      grid-template-columns: 1fr !important;
    }
    .cg-tab-bar {
      gap: 6px;
    }
  }
`

/* =========================================================
   Styles
   ========================================================= */

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto' },

  /* Header */
  header: { marginBottom: '32px' },
  titleRow: { display: 'flex', alignItems: 'center', gap: '16px' },
  titleIconWrap: {
    width: '52px', height: '52px', borderRadius: '16px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#FFFFFF', flexShrink: 0,
  },
  title: { fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', margin: 0, marginBottom: '4px' },
  subtitle: { fontSize: '0.95rem', color: '#64748B', margin: 0, lineHeight: 1.5 },

  /* Tab bar */
  tabBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '10px 18px', borderRadius: '12px',
    border: '1px solid #E2E8F0', background: '#fff',
    color: '#64748B', fontSize: '0.88rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },

  /* Content grid */
  contentGrid: {},
  leftPanel: {},
  rightPanel: {},

  /* Section card */
  sectionCard: {
    background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px',
    padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  sectionTitle: {
    fontSize: '1.1rem', fontWeight: 700, color: '#0F172A',
    marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px',
  },
  sectionDesc: { fontSize: '0.88rem', color: '#94A3B8', marginBottom: '24px', lineHeight: 1.5 },

  /* Subtopic cards */
  subGrid: {},
  subCard: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '16px 18px', borderRadius: '14px',
    border: '1px solid #E2E8F0', background: '#FFFFFF',
    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
    transition: 'all 0.2s ease', width: '100%',
  },
  subIcon: {
    width: '38px', height: '38px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, transition: 'all 0.2s ease',
  },
  subLabel: { fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s ease' },

  /* Config panel */
  configGroup: { marginBottom: '22px' },
  configLabel: {
    display: 'block', fontSize: '0.88rem', fontWeight: 600,
    color: '#0F172A', marginBottom: '10px',
  },
  selectedTagsWrap: {
    display: 'flex', flexWrap: 'wrap', gap: '8px',
    minHeight: '36px', padding: '10px 14px', borderRadius: '12px',
    border: '1px solid #E2E8F0', background: '#F8FAFC', alignItems: 'center',
    maxHeight: '120px', overflowY: 'auto',
  },
  selectedTag: {
    display: 'inline-flex', alignItems: 'center',
    padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem',
    fontWeight: 600, color: '#4F46E5',
    background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.15)',
  },
  placeholderText: { fontSize: '0.85rem', color: '#94A3B8' },
  radioGroup: { display: 'flex', gap: '8px' },
  radioBtn: {
    flex: 1, padding: '10px 16px', borderRadius: '10px',
    border: '1px solid #E2E8F0', background: '#FFFFFF',
    color: '#64748B', fontSize: '0.88rem', fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit',
  },
  radioBtnActive: {
    border: '2px solid #4F46E5', background: 'rgba(79,70,229,0.04)', color: '#4F46E5',
  },
  select: {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1px solid #E2E8F0', background: '#FFFFFF',
    color: '#0F172A', fontSize: '0.9rem', fontFamily: 'inherit',
    fontWeight: 500, cursor: 'pointer', outline: 'none', appearance: 'auto',
    transition: 'border-color 0.2s ease',
  },
  textarea: {
    width: '100%', padding: '14px 16px', borderRadius: '12px',
    border: '1px solid #E2E8F0', background: '#FFFFFF',
    color: '#0F172A', fontSize: '0.88rem', fontFamily: 'inherit',
    lineHeight: 1.6, resize: 'vertical', outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  generateBtn: {
    width: '100%', padding: '14px 24px', borderRadius: '14px',
    border: 'none', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'inherit',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '10px', transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(79,70,229,0.3)', marginTop: '8px',
  },
  generateBtnDisabled: { opacity: 0.5, cursor: 'not-allowed', boxShadow: 'none' },

  /* Generated curriculum */
  curriculumSection: { marginBottom: '40px' },
  curriculumHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '24px', flexWrap: 'wrap', gap: '16px',
  },
  curriculumTitle: {
    fontSize: '1.3rem', fontWeight: 800, color: '#0F172A',
    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px',
  },
  curriculumSubtitle: { fontSize: '0.9rem', color: '#64748B', margin: 0 },
  curriculumStats: { display: 'flex', gap: '10px' },
  statBadge: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 16px', borderRadius: '10px', background: '#FFFFFF',
    border: '1px solid #E2E8F0', color: '#64748B',
    fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },

  /* Overall progress */
  overallProgressWrap: {
    background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px',
    padding: '20px 24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  overallProgressHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px',
  },
  overallProgressLabel: { fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' },
  overallProgressPercent: {
    fontSize: '1rem', fontWeight: 700,
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  overallProgressTrack: {
    width: '100%', height: '10px', background: '#F1F5F9', borderRadius: '5px', overflow: 'hidden',
  },
  overallProgressBar: {
    width: '100%', height: '100%', borderRadius: '5px',
    background: 'linear-gradient(90deg, #4F46E5, #06B6D4)', transition: 'width 0.6s ease',
  },

  /* Week cards */
  weekList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  weekCard: {
    background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px',
    padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'all 0.2s ease',
  },
  weekCardHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px',
  },
  weekLeft: { display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 },
  weekBadge: {
    padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem',
    fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
  },
  weekTitle: { fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' },
  weekMeta: { display: 'flex', alignItems: 'center', gap: '14px' },
  weekMetaItem: {
    display: 'flex', alignItems: 'center', gap: '4px',
    fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500,
  },
  weekHoursCircle: {
    width: '56px', height: '56px', borderRadius: '16px',
    background: '#F8FAFC', border: '1px solid #E2E8F0',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  },
  weekHoursNum: { fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 },
  weekHoursUnit: { fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' },
  weekTopics: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' },
  weekTopicItem: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  weekTopicDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', flexShrink: 0, marginTop: '7px',
  },
  weekTopicText: { fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 },
  weekProgressWrap: { paddingTop: '4px' },
  weekProgressTrack: {
    width: '100%', height: '4px', background: '#F1F5F9', borderRadius: '2px', overflow: 'hidden',
  },
  weekProgressBar: { height: '100%', borderRadius: '2px', transition: 'width 0.6s ease' },
}
