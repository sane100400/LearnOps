import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X, ChevronDown, Sparkles, ArrowRight, Building2, Mail, User, Users } from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Footer from '../components/Footer'
import { individualPlans, teamPlans, featureTable, faqs } from '../data/pricingData'

function formatPrice(price) {
  if (price === 0) return '무료'
  return `₩${price.toLocaleString()}`
}

function renderCellValue(val) {
  if (val === true) return <Check size={18} style={{ color: '#10B981' }} />
  if (val === false) return <X size={18} style={{ color: '#CBD5E1' }} />
  return <span>{val}</span>
}

function PlanCard({ plan, isYearly, isTeam }) {
  const price = plan.isEnterprise ? null : (isYearly ? plan.price.yearly : plan.price.monthly)
  const unit = isTeam ? (plan.priceUnit || '월') : '월'
  const isMailLink = plan.ctaLink?.startsWith('mailto:')

  const ctaEl = (
    <Button
      variant={plan.highlighted ? 'primary' : 'secondary'}
      style={{ width: '100%', padding: '14px 24px' }}
    >
      {plan.cta} <ArrowRight size={16} />
    </Button>
  )

  return (
    <div style={{ ...styles.card, ...(plan.highlighted ? styles.cardHighlighted : {}) }}>
      {plan.badge && <div style={styles.recommendBadge}>{plan.badge}</div>}
      <h3 style={styles.cardName}>{plan.name}</h3>
      <p style={styles.cardDesc}>{plan.desc}</p>

      <div style={styles.priceWrap}>
        {plan.isEnterprise ? (
          <span style={{ ...styles.price, fontSize: '1.6rem' }}>별도 협의</span>
        ) : (
          <>
            <span style={styles.price}>{formatPrice(price)}</span>
            {price > 0 && <span style={styles.priceUnit}>/{unit}</span>}
          </>
        )}
      </div>

      {!plan.isEnterprise && isYearly && price > 0 && (
        <p style={styles.priceSub}>
          월 {formatPrice(plan.price.monthly)} 대비 20% 절약
        </p>
      )}

      {isTeam && plan.minMembers && (
        <p style={styles.minMembers}>최소 {plan.minMembers}명부터</p>
      )}

      <div style={{ marginTop: '24px' }}>
        {isMailLink ? (
          <a href={plan.ctaLink} style={{ textDecoration: 'none', display: 'block' }}>{ctaEl}</a>
        ) : (
          <Link to={plan.ctaLink} style={{ textDecoration: 'none', display: 'block' }}>{ctaEl}</Link>
        )}
      </div>

      <ul style={styles.featureList}>
        {plan.features.map((f, i) => (
          <li key={i} style={styles.featureItem}>
            <Check size={16} style={{ color: '#10B981', flexShrink: 0 }} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ComparisonTable({ track }) {
  const data = featureTable[track]
  if (!data) return null
  const cols = data.columns
  const keys = cols.map((c) => c.toLowerCase())
  const highlightIdx = track === 'individual' ? 1 : 1

  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.th, textAlign: 'left' }}>기능</th>
            {cols.map((col, i) => (
              <th key={col} style={{ ...styles.th, ...(i === highlightIdx ? styles.thHighlight : {}) }}>{col}</th>
            ))}
          </tr>
        </thead>
        {data.categories.map((cat) => (
          <tbody key={cat.name}>
            <tr>
              <td colSpan={cols.length + 1} style={styles.categoryRow}>{cat.name}</td>
            </tr>
            {cat.features.map((feat, i) => (
              <tr key={`${cat.name}-${i}`} style={i % 2 === 1 ? { background: '#FAFBFC' } : {}}>
                <td style={{ ...styles.td, textAlign: 'left', color: '#0F172A', fontWeight: 600 }}>
                  {feat.label}
                </td>
                {keys.map((key, ki) => (
                  <td key={key} style={{ ...styles.td, ...(ki === highlightIdx ? styles.tdHighlight : {}) }}>
                    {renderCellValue(feat[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  )
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const [track, setTrack] = useState('individual')
  const [openFaq, setOpenFaq] = useState(null)

  const plans = track === 'individual' ? individualPlans : teamPlans

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-content">
        {/* Hero */}
        <section style={styles.hero}>
          <div style={styles.heroBg} />
          <div style={styles.heroBg2} />
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div style={styles.heroContent}>
              <div style={styles.badge}>
                <Sparkles size={14} />
                <span>나에게 맞는 플랜</span>
              </div>
              <h1 style={styles.heroTitle}>
                학습 목적에 맞는<br />
                <span className="gradient-text">최적의 요금제</span>
              </h1>
              <p style={styles.heroDesc}>
                혼자 실력을 키우든, 팀과 함께 성장하든.<br />
                14일 환불 보장으로 부담 없이 시작하세요.
              </p>

              {/* Track toggle */}
              <div style={styles.trackToggle}>
                <button
                  style={{
                    ...styles.trackBtn,
                    ...(track === 'individual' ? styles.trackBtnActive : {}),
                  }}
                  onClick={() => setTrack('individual')}
                >
                  <User size={16} /> 개인
                </button>
                <button
                  style={{
                    ...styles.trackBtn,
                    ...(track === 'team' ? styles.trackBtnActive : {}),
                  }}
                  onClick={() => setTrack('team')}
                >
                  <Users size={16} /> 팀 / 기관
                </button>
              </div>

              {/* Billing toggle */}
              <div style={{ ...styles.toggleWrap, display: 'flex', justifyContent: 'center' }}>
                <span style={{ ...styles.toggleLabel, color: !isYearly ? '#0F172A' : '#94A3B8' }}>월간</span>
                <button
                  style={styles.toggleTrack}
                  onClick={() => setIsYearly(!isYearly)}
                  aria-label="결제 주기 변경"
                >
                  <div style={{ ...styles.toggleThumb, transform: isYearly ? 'translateX(24px)' : 'translateX(0)' }} />
                </button>
                <span style={{ ...styles.toggleLabel, color: isYearly ? '#0F172A' : '#94A3B8' }}>
                  연간
                  <span style={styles.discountBadge}>20% 할인</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section style={styles.section}>
          <div className="container">
            <div className="pricing-card-grid" style={{
              ...styles.cardGrid,
              gridTemplateColumns: `repeat(${plans.length}, 1fr)`,
            }}>
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isYearly={isYearly}
                  isTeam={track === 'team'}
                />
              ))}
            </div>

            {/* Value callout for team */}
            {track === 'team' && (
              <div style={styles.valueCallout}>
                <div style={styles.valueIcon}>
                  <Users size={20} />
                </div>
                <div>
                  <strong style={{ color: '#0F172A' }}>팀 플랜 = 개인 Pro 전체 기능 + 관리 도구</strong>
                  <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '4px 0 0' }}>
                    모든 팀 멤버가 Pro의 무제한 학습 기능을 사용하고, 관리자는 대시보드에서 팀 역량을 한눈에 파악합니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Feature Comparison */}
        <section style={{ ...styles.section, background: '#F8FAFC' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 className="section-title">기능 비교</h2>
              <p className="section-subtitle">
                {track === 'individual' ? '개인 플랜별 상세 기능' : '팀 플랜별 상세 기능'}을 비교해보세요
              </p>
            </div>
            <ComparisonTable track={track} />
          </div>
        </section>

        {/* FAQ */}
        <section style={styles.section}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 className="section-title">자주 묻는 질문</h2>
              <p className="section-subtitle">요금제에 대해 궁금한 점을 확인해보세요</p>
            </div>
            <div style={styles.faqList}>
              {faqs.map((faq, i) => (
                <div key={i} style={styles.faqItem}>
                  <button
                    style={styles.faqQuestion}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span style={styles.faqQuestionText}>{faq.q}</span>
                    <ChevronDown
                      size={20}
                      style={{
                        color: '#64748B',
                        transition: 'transform 0.2s ease',
                        transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                        flexShrink: 0,
                      }}
                    />
                  </button>
                  {openFaq === i && (
                    <div style={styles.faqAnswer}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={styles.ctaSection}>
          <div className="container" style={{ textAlign: 'center' }}>
            <Building2 size={48} style={{ color: '#4F46E5', marginBottom: '24px' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px', color: '#0F172A' }}>
              지금 바로 시작하세요
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '32px' }}>
              무료로 LearnOps를 체험하고, 나에게 맞는 플랜으로 확장하세요.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register">
                <Button size="large">
                  무료로 시작하기 <ArrowRight size={18} />
                </Button>
              </Link>
              <a href="mailto:hello@learnops.io" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="large">
                  <Mail size={18} /> Enterprise 문의
                </Button>
              </a>
            </div>
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
    padding: '120px 0 60px',
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
    fontSize: '3rem',
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: '24px',
    letterSpacing: '-0.02em',
    color: '#0F172A',
  },
  heroDesc: {
    fontSize: '1.1rem',
    color: '#64748B',
    lineHeight: 1.8,
    marginBottom: '40px',
  },

  /* Track toggle (개인 / 팀) */
  trackToggle: {
    display: 'inline-flex',
    gap: '4px',
    padding: '4px',
    background: '#F1F5F9',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  trackBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 24px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: '#64748B',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  trackBtnActive: {
    background: '#fff',
    color: '#4F46E5',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },

  /* Billing toggle */
  toggleWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
  },
  toggleLabel: {
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'color 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  toggleTrack: {
    width: '52px',
    height: '28px',
    borderRadius: '100px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    padding: 0,
  },
  toggleThumb: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute',
    top: '3px',
    left: '3px',
    transition: 'transform 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
  },
  discountBadge: {
    padding: '3px 8px',
    borderRadius: '100px',
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10B981',
    fontSize: '0.75rem',
    fontWeight: 700,
  },

  /* Cards */
  section: { padding: '80px 0' },
  cardGrid: {
    display: 'grid',
    gap: '24px',
    alignItems: 'start',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    border: '1px solid #E2E8F0',
    padding: '36px 32px',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  cardHighlighted: {
    border: '2px solid transparent',
    background: 'linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #4F46E5, #06B6D4) border-box',
    transform: 'scale(1.04)',
    boxShadow: '0 20px 40px rgba(79, 70, 229, 0.15)',
    zIndex: 1,
  },
  recommendBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '4px 16px',
    borderRadius: '100px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  cardName: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: '4px',
  },
  cardDesc: {
    fontSize: '0.9rem',
    color: '#64748B',
    marginBottom: '24px',
  },
  priceWrap: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  price: {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: '#0F172A',
  },
  priceUnit: {
    fontSize: '1rem',
    color: '#64748B',
    fontWeight: 500,
  },
  priceSub: {
    fontSize: '0.8rem',
    color: '#10B981',
    marginTop: '4px',
  },
  minMembers: {
    fontSize: '0.8rem',
    color: '#94A3B8',
    marginTop: '4px',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: '24px 0 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.9rem',
    color: '#334155',
  },

  /* Value callout */
  valueCallout: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '32px',
    padding: '20px 28px',
    background: 'rgba(79, 70, 229, 0.04)',
    border: '1px solid rgba(79, 70, 229, 0.12)',
    borderRadius: '14px',
  },
  valueIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(79, 70, 229, 0.1)',
    color: '#4F46E5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  /* Table */
  tableWrap: {
    overflowX: 'auto',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '2px solid #E2E8F0',
  },
  th: {
    padding: '18px 24px',
    fontSize: '0.95rem',
    fontWeight: 800,
    color: '#0F172A',
    textAlign: 'center',
    background: '#F1F5F9',
    borderBottom: '2px solid #E2E8F0',
  },
  thHighlight: {
    background: 'linear-gradient(135deg, rgba(79,70,229,0.12), rgba(6,182,212,0.08))',
    color: '#4F46E5',
  },
  categoryRow: {
    padding: '14px 24px',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#4F46E5',
    background: '#EEF2FF',
    borderTop: '2px solid #E2E8F0',
    borderBottom: '1px solid #E2E8F0',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  td: {
    padding: '16px 24px',
    fontSize: '0.9rem',
    color: '#334155',
    textAlign: 'center',
    borderBottom: '1px solid #E2E8F0',
    fontWeight: 500,
  },
  tdHighlight: {
    background: 'rgba(79, 70, 229, 0.06)',
  },

  /* FAQ */
  faqList: {
    maxWidth: '720px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  faqItem: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
  },
  faqQuestion: {
    width: '100%',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  faqQuestionText: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#0F172A',
    textAlign: 'left',
  },
  faqAnswer: {
    padding: '0 24px 20px',
    fontSize: '0.9rem',
    color: '#64748B',
    lineHeight: 1.8,
  },

  /* CTA */
  ctaSection: { padding: '100px 0' },
}

const pricingStyleSheet = document.createElement('style')
pricingStyleSheet.textContent = `
  @media (max-width: 1024px) {
    .pricing-card-grid {
      grid-template-columns: 1fr 1fr !important;
    }
  }
  @media (max-width: 700px) {
    .pricing-card-grid {
      grid-template-columns: 1fr !important;
    }
  }
  @media (max-width: 768px) {
    .page-content section h1 {
      font-size: 2rem !important;
    }
  }
`
if (!document.querySelector('[data-learnops-pricing-styles]')) {
  pricingStyleSheet.setAttribute('data-learnops-pricing-styles', '')
  document.head.appendChild(pricingStyleSheet)
}
