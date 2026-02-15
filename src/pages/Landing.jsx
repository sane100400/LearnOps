import { Link } from 'react-router-dom'
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
  Check,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'
import Footer from '../components/Footer'

const features = [
  {
    icon: Brain,
    title: 'AI 레벨테스트',
    desc: 'AI가 당신의 보안 역량을 정밀 분석하여 현재 수준을 진단합니다.',
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
    desc: '클릭 한 번으로 격리된 보안 실습 환경을 즉시 생성합니다.',
    color: '#10B981',
  },
]

const steps = [
  { icon: ClipboardCheck, title: '레벨테스트', desc: 'AI 기반 역량 진단' },
  { icon: Cpu, title: '커리큘럼 생성', desc: '맞춤 학습 경로 설계' },
  { icon: MonitorPlay, title: '실습 진행', desc: '실전 환경에서 학습' },
  { icon: Trophy, title: '성장 확인', desc: '랭킹 & 업적 달성' },
]

const plans = [
  {
    name: 'Free',
    price: '₩0',
    period: '/월',
    desc: '보안 학습을 시작하는 입문자',
    features: ['AI 레벨테스트 1회', '기본 커리큘럼', '실습 환경 2개', '커뮤니티 접근'],
    cta: '무료로 시작',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₩29,900',
    period: '/월',
    desc: '체계적으로 역량을 키우고 싶은 학습자',
    features: ['무제한 레벨테스트', 'AI 맞춤 커리큘럼', '무제한 실습 환경', '스터디 그룹 매칭', '우선 기술 지원'],
    cta: 'Pro 시작하기',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '문의',
    period: '',
    desc: '팀/조직 단위 보안 교육이 필요한 기업',
    features: ['모든 Pro 기능', '관리자 대시보드', '맞춤 커리큘럼 설계', 'SSO & SCIM', '전담 매니저'],
    cta: '영업팀 문의',
    highlight: false,
  },
]

export default function Landing() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-content">
        {/* Hero */}
        <section style={styles.hero}>
          <div style={styles.heroBg} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={styles.heroContent}>
              <div style={styles.badge}>
                <Sparkles size={14} />
                <span>AI 기반 보안 학습 플랫폼</span>
              </div>
              <h1 style={styles.heroTitle}>
                보안 실력을 레벨업하는<br />
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
              <p className="section-subtitle">4단계로 완성하는 보안 학습</p>
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

        {/* Pricing */}
        <section style={{ ...styles.section, background: '#F8FAFC' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 className="section-title">
                <span className="gradient-text">가격 플랜</span>
              </h2>
              <p className="section-subtitle">나에게 맞는 플랜을 선택하세요</p>
            </div>
            <div style={styles.pricingGrid}>
              {plans.map((plan, i) => (
                <Card
                  key={i}
                  style={{
                    padding: '40px 32px',
                    ...(plan.highlight
                      ? {
                          border: '1px solid rgba(79, 70, 229, 0.4)',
                          boxShadow: '0 0 40px rgba(79, 70, 229, 0.15)',
                          position: 'relative',
                        }
                      : {}),
                  }}
                >
                  {plan.highlight && (
                    <div style={styles.popularBadge}>인기</div>
                  )}
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                    {plan.name}
                  </h3>
                  <div style={styles.price}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span>
                    <span style={{ color: '#64748B' }}>{plan.period}</span>
                  </div>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '24px' }}>
                    {plan.desc}
                  </p>
                  <ul style={styles.planFeatures}>
                    {plan.features.map((f, fi) => (
                      <li key={fi} style={styles.planFeature}>
                        <Check size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register">
                    <Button
                      variant={plan.highlight ? 'primary' : 'secondary'}
                      style={{ width: '100%', marginTop: '24px' }}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={styles.ctaSection}>
          <div className="container" style={{ textAlign: 'center' }}>
            <Shield size={48} style={{ color: '#4F46E5', marginBottom: '24px' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>
              지금 바로 시작하세요
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '32px' }}>
              무료 레벨테스트로 나의 보안 역량을 확인해보세요.
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
    </div>
  )
}

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
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    alignItems: 'start',
  },
  price: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginBottom: '8px',
  },
  planFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  planFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#334155',
    fontSize: '0.9rem',
  },
  popularBadge: {
    position: 'absolute',
    top: '-12px',
    right: '24px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    color: '#fff',
    padding: '4px 16px',
    borderRadius: '100px',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  ctaSection: {
    padding: '100px 0',
  },
}

const landingStyle = document.createElement('style')
landingStyle.textContent = `
  @media (max-width: 768px) {
    .page-content section h1 { font-size: 2rem !important; }
    .page-content section .hero-desc { font-size: 1rem !important; }
  }
`
if (!document.querySelector('[data-learnops-landing]')) {
  landingStyle.setAttribute('data-learnops-landing', '')
  document.head.appendChild(landingStyle)
}
