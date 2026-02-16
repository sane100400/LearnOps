import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import {
  Brain,
  Route,
  Server,
  ArrowRight,
  ClipboardCheck,
  Cpu,
  MonitorPlay,
  Trophy,
  Users,
  BarChart3,
  Sparkles,
  Rocket,
  Zap,
  Shield,
  Code2,
  Cloud,
  Database,
  Globe,
  Smartphone,
  Lock,
  GitBranch,
  BarChart,
  Layers,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'
import Footer from '../components/Footer'

/* =========================================================
   Floating Categories
   ========================================================= */

const floatingCategories = [
  { label: '웹 개발', icon: Globe, color: '#4F46E5', x: '8%', y: '18%', delay: 0, size: 'lg' },
  { label: '사이버 보안', icon: Shield, color: '#EF4444', x: '82%', y: '12%', delay: 1.2, size: 'lg' },
  { label: '클라우드', icon: Cloud, color: '#06B6D4', x: '88%', y: '55%', delay: 0.6, size: 'md' },
  { label: 'AI / ML', icon: Brain, color: '#8B5CF6', x: '5%', y: '62%', delay: 1.8, size: 'md' },
  { label: 'DevOps', icon: GitBranch, color: '#F59E0B', x: '75%', y: '78%', delay: 2.4, size: 'sm' },
  { label: '데이터 분석', icon: BarChart, color: '#10B981', x: '15%', y: '82%', delay: 0.3, size: 'sm' },
  { label: '모바일', icon: Smartphone, color: '#EC4899', x: '92%', y: '35%', delay: 1.5, size: 'sm' },
  { label: '백엔드', icon: Database, color: '#0EA5E9', x: '2%', y: '40%', delay: 2.1, size: 'sm' },
  { label: '프론트엔드', icon: Code2, color: '#F97316', x: '70%', y: '5%', delay: 0.9, size: 'sm' },
  { label: '인프라', icon: Layers, color: '#14B8A6', x: '25%', y: '5%', delay: 2.7, size: 'sm' },
  { label: '블록체인', icon: Lock, color: '#6366F1', x: '60%', y: '85%', delay: 3.0, size: 'sm' },
]

const sizeMap = { lg: 52, md: 44, sm: 36 }
const fontMap = { lg: '0.82rem', md: '0.75rem', sm: '0.7rem' }
const iconSizeMap = { lg: 18, md: 15, sm: 13 }

/* =========================================================
   Data
   ========================================================= */

const features = [
  {
    icon: Brain,
    title: 'AI 레벨테스트',
    desc: 'AI가 당신의 IT 역량을 정밀 분석하여 현재 수준과 적합한 학습 분야를 진단합니다.',
    color: '#4F46E5',
  },
  {
    icon: Route,
    title: '맞춤 커리큘럼',
    desc: '레벨테스트 결과를 기반으로 개인화된 학습 경로를 자동 설계합니다.',
    color: '#06B6D4',
  },
  {
    icon: Server,
    title: '실습환경 자동생성',
    desc: '클릭 한 번으로 격리된 실습 환경을 즉시 생성하여 바로 학습할 수 있습니다.',
    color: '#10B981',
  },
]

const steps = [
  { icon: ClipboardCheck, title: '레벨테스트', desc: 'AI 기반 역량 진단' },
  { icon: Cpu, title: '커리큘럼 생성', desc: '맞춤 학습 경로 설계' },
  { icon: MonitorPlay, title: '실습 진행', desc: '실전 환경에서 학습' },
  { icon: Trophy, title: '성장 확인', desc: '랭킹 & 업적 달성' },
]


/* =========================================================
   Component
   ========================================================= */

export default function Landing() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-content">
        {/* Hero */}
        <section style={styles.hero}>
          <div style={styles.heroBg} />
          <div style={styles.heroBg2} />

          {/* Floating category bubbles */}
          {floatingCategories.map((cat, i) => (
            <div
              key={i}
              className="floating-bubble"
              style={{
                ...styles.floatingBubble,
                left: cat.x,
                top: cat.y,
                animationDelay: `${cat.delay}s`,
                animationDuration: `${6 + (i % 3) * 2}s`,
              }}
            >
              <div
                style={{
                  ...styles.floatingInner,
                  background: `${cat.color}10`,
                  border: `1px solid ${cat.color}25`,
                }}
              >
                <div
                  style={{
                    ...styles.floatingIcon,
                    width: `${sizeMap[cat.size]}px`,
                    height: `${sizeMap[cat.size]}px`,
                    background: `${cat.color}18`,
                    color: cat.color,
                  }}
                >
                  <cat.icon size={iconSizeMap[cat.size]} />
                </div>
                <span
                  style={{
                    ...styles.floatingLabel,
                    fontSize: fontMap[cat.size],
                    color: cat.color,
                  }}
                >
                  {cat.label}
                </span>
              </div>
            </div>
          ))}

          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div style={styles.heroContent}>
              <div style={styles.badge}>
                <Sparkles size={14} />
                <span>AI 기반 IT 학습 플랫폼</span>
              </div>
              <h1 style={styles.heroTitle}>
                IT 실력을 레벨업하는<br />
                <span className="gradient-text">가장 스마트한 방법</span>
              </h1>
              <p style={styles.heroDesc}>
                AI가 당신의 역량을 분석하고, 맞춤 커리큘럼을 설계하며,<br />
                실전과 동일한 실습 환경을 자동으로 구성합니다.
              </p>
              <div style={styles.heroCta}>
                <Link to="/register">
                  <Button size="large">
                    무료로 시작하기 <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/level-test">
                  <Button variant="secondary" size="large">
                    레벨테스트 체험
                  </Button>
                </Link>
              </div>
              <div style={styles.heroStats}>
                <div style={styles.stat}>
                  <strong style={styles.statNum}>2,400+</strong>
                  <span style={styles.statLabel}>학습자</span>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.stat}>
                  <strong style={styles.statNum}>150+</strong>
                  <span style={styles.statLabel}>실습 시나리오</span>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.stat}>
                  <strong style={styles.statNum}>98%</strong>
                  <span style={styles.statLabel}>만족도</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={styles.section}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 className="section-title">
                <span className="gradient-text">핵심 기능</span>
              </h2>
              <p className="section-subtitle">LearnOps가 제공하는 3가지 핵심 가치</p>
            </div>
            <div style={styles.featureGrid}>
              {features.map((f, i) => (
                <Card key={i} style={{ padding: '40px 32px', textAlign: 'center' }}>
                  <div
                    style={{
                      ...styles.featureIcon,
                      background: `${f.color}15`,
                      color: f.color,
                    }}
                  >
                    <f.icon size={28} />
                  </div>
                  <h3 style={styles.featureTitle}>{f.title}</h3>
                  <p style={styles.featureDesc}>{f.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section style={{ ...styles.section, background: '#F8FAFC' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle">4단계로 완성하는 IT 학습</p>
            </div>
            <div style={styles.stepsGrid}>
              {steps.map((s, i) => (
                <div key={i} style={styles.step}>
                  <div style={styles.stepNum}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={styles.stepIcon}>
                    <s.icon size={24} />
                  </div>
                  <h4 style={styles.stepTitle}>{s.title}</h4>
                  <p style={styles.stepDesc}>{s.desc}</p>
                  {i < steps.length - 1 && <div style={styles.stepArrow}>→</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Study Group & Ranking */}
        <section style={styles.section}>
          <div className="container">
            <div style={styles.dualGrid}>
              <Card style={{ padding: '48px 40px' }}>
                <Users size={32} style={{ color: '#06B6D4', marginBottom: '16px' }} />
                <h3 style={styles.featureTitle}>그룹 스터디</h3>
                <p style={styles.featureDesc}>
                  AI가 관심 분야와 수준이 비슷한 학습자를 자동 매칭합니다.
                  함께 공부하고 서로 성장하세요.
                </p>
                <Link to="/study-group">
                  <Button variant="secondary" size="small" style={{ marginTop: '24px' }}>
                    스터디 둘러보기 <ArrowRight size={14} />
                  </Button>
                </Link>
              </Card>
              <Card style={{ padding: '48px 40px' }}>
                <BarChart3 size={32} style={{ color: '#10B981', marginBottom: '16px' }} />
                <h3 style={styles.featureTitle}>랭킹 & 업적</h3>
                <p style={styles.featureDesc}>
                  실습을 완료하고 뱃지를 획득하세요.
                  전체 및 그룹 내 랭킹으로 동기부여를 유지합니다.
                </p>
                <Link to="/ranking">
                  <Button variant="secondary" size="small" style={{ marginTop: '24px' }}>
                    랭킹 보기 <ArrowRight size={14} />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={styles.ctaSection}>
          <div className="container" style={{ textAlign: 'center' }}>
            <Rocket size={48} style={{ color: '#4F46E5', marginBottom: '24px' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>
              지금 바로 시작하세요
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '32px' }}>
              무료 레벨테스트로 나의 IT 역량을 확인해보세요.
            </p>
            <Link to="/register">
              <Button size="large">
                <Zap size={18} /> 무료로 시작하기
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingStyles />
    </div>
  )
}

/* =========================================================
   Floating animation styles (injected once)
   ========================================================= */

function FloatingStyles() {
  useEffect(() => {
    if (document.querySelector('[data-lo-float]')) return
    const el = document.createElement('style')
    el.setAttribute('data-lo-float', '')
    el.textContent = `
      @keyframes floatY {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-18px); }
      }
      @keyframes floatFadeIn {
        from { opacity: 0; transform: translateY(20px) scale(0.85); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .floating-bubble {
        animation: floatY 6s ease-in-out infinite, floatFadeIn 0.8s ease-out both;
      }
      .floating-bubble:hover {
        animation-play-state: paused;
        transform: scale(1.08) !important;
      }
      @media (max-width: 768px) {
        .floating-bubble { display: none !important; }
        .page-content section h1 { font-size: 2rem !important; }
      }
    `
    document.head.appendChild(el)
    return () => {
      const existing = document.querySelector('[data-lo-float]')
      if (existing) existing.remove()
    }
  }, [])
  return null
}

/* =========================================================
   Styles
   ========================================================= */

const styles = {
  hero: {
    position: 'relative',
    padding: '120px 0 100px',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '800px',
    height: '800px',
    background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  heroBg2: {
    position: 'absolute',
    bottom: '-40%',
    left: '-15%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  heroContent: {
    maxWidth: '680px',
    margin: '0 auto',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 18px',
    borderRadius: '100px',
    background: 'rgba(79, 70, 229, 0.08)',
    color: '#4F46E5',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '32px',
  },
  heroTitle: {
    fontSize: '3.2rem',
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: '24px',
    letterSpacing: '-0.02em',
    color: '#0F172A',
  },
  heroDesc: {
    fontSize: '1.15rem',
    color: '#64748B',
    lineHeight: 1.8,
    marginBottom: '40px',
  },
  heroCta: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '64px',
  },
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '40px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNum: {
    fontSize: '1.5rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: '0.85rem',
    marginTop: '4px',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: '#E2E8F0',
  },

  /* Floating bubbles */
  floatingBubble: {
    position: 'absolute',
    zIndex: 1,
    pointerEvents: 'auto',
    cursor: 'default',
    transition: 'transform 0.3s ease',
  },
  floatingInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px 8px 8px',
    borderRadius: '100px',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  floatingIcon: {
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  floatingLabel: {
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },

  section: {
    padding: '100px 0',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  featureIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  featureTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    marginBottom: '12px',
    color: '#0F172A',
  },
  featureDesc: {
    color: '#64748B',
    fontSize: '0.9rem',
    lineHeight: 1.7,
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px',
    position: 'relative',
  },
  step: {
    textAlign: 'center',
    position: 'relative',
  },
  stepNum: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#4F46E5',
    marginBottom: '16px',
  },
  stepIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'rgba(79, 70, 229, 0.08)',
    color: '#4F46E5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  stepTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    marginBottom: '8px',
    color: '#0F172A',
  },
  stepDesc: {
    color: '#64748B',
    fontSize: '0.85rem',
  },
  stepArrow: {
    position: 'absolute',
    right: '-20px',
    top: '70px',
    color: '#4F46E5',
    fontSize: '1.2rem',
    fontWeight: 700,
  },
  dualGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
  },
  ctaSection: {
    padding: '100px 0',
  },
}
