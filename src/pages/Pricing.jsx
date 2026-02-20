import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X, ChevronDown, Sparkles, ArrowRight, Building2, Mail } from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Footer from '../components/Footer'
import { plans, featureTable, faqs } from '../data/pricingData'

function formatPrice(price) {
  if (price === 0) return '무료'
  return `₩${price.toLocaleString()}`
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

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
                <span>합리적인 가격</span>
              </div>
              <h1 style={styles.heroTitle}>
                동아리와 교육단체를 위한<br />
                <span className="gradient-text">합리적인 요금제</span>
              </h1>
              <p style={styles.heroDesc}>
                팀 규모와 필요에 맞는 플랜을 선택하세요.<br />
                모든 플랜은 14일 환불 보장을 제공합니다.
              </p>

              {/* Monthly / Yearly toggle */}
              <div style={styles.toggleWrap}>
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
            <div style={styles.cardGrid}>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  style={{
                    ...styles.card,
                    ...(plan.highlighted ? styles.cardHighlighted : {}),
                  }}
                >
                  {plan.badge && (
                    <div style={styles.recommendBadge}>{plan.badge}</div>
                  )}
                  <h3 style={styles.cardName}>{plan.name}</h3>
                  <p style={styles.cardDesc}>{plan.desc}</p>
                  <div style={styles.priceWrap}>
                    <span style={styles.price}>
                      {formatPrice(isYearly ? plan.price.yearly : plan.price.monthly)}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span style={styles.priceUnit}>/월</span>
                    )}
                  </div>
                  {isYearly && plan.price.monthly > 0 && (
                    <p style={styles.priceSub}>
                      연 {formatPrice(plan.price.yearly * 12)} (월 {formatPrice(plan.price.monthly)} 대비 절약)
                    </p>
                  )}
                  <Link to={plan.ctaLink} style={{ textDecoration: 'none', display: 'block', marginTop: '24px' }}>
                    <Button
                      variant={plan.highlighted ? 'primary' : 'secondary'}
                      style={{ width: '100%', padding: '14px 24px' }}
                    >
                      {plan.cta} <ArrowRight size={16} />
                    </Button>
                  </Link>
                  <ul style={styles.featureList}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={styles.featureItem}>
                        <Check size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section style={{ ...styles.section, background: '#F8FAFC' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 className="section-title">기능 비교</h2>
              <p className="section-subtitle">플랜별 상세 기능을 비교해보세요</p>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, textAlign: 'left' }}>기능</th>
                    <th style={styles.th}>Free</th>
                    <th style={{ ...styles.th, ...styles.thHighlight }}>Basic</th>
                    <th style={styles.th}>Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {featureTable.categories.map((cat) => (
                    <>
                      <tr key={`cat-${cat.name}`}>
                        <td colSpan={4} style={styles.categoryRow}>{cat.name}</td>
                      </tr>
                      {cat.features.map((feat, i) => (
                        <tr key={`${cat.name}-${i}`}>
                          <td style={{ ...styles.td, textAlign: 'left', color: '#0F172A', fontWeight: 500 }}>
                            {feat.label}
                          </td>
                          {['free', 'basic', 'pro'].map((tier) => (
                            <td
                              key={tier}
                              style={{
                                ...styles.td,
                                ...(tier === 'basic' ? styles.tdHighlight : {}),
                              }}
                            >
                              {renderCellValue(feat[tier])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
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
              무료 플랜으로 LearnOps를 체험하고, 팀에 맞는 플랜으로 확장하세요.
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
      <PricingStyles />
    </div>
  )
}

function renderCellValue(val) {
  if (val === true) return <Check size={18} style={{ color: '#10B981' }} />
  if (val === false) return <X size={18} style={{ color: '#CBD5E1' }} />
  return <span>{val}</span>
}

function PricingStyles() {
  return null
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

  section: {
    padding: '80px 0',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
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

  /* Table */
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
  },
  th: {
    padding: '16px 20px',
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#0F172A',
    textAlign: 'center',
    background: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
  },
  thHighlight: {
    background: 'rgba(79, 70, 229, 0.08)',
    color: '#4F46E5',
  },
  categoryRow: {
    padding: '12px 20px',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#4F46E5',
    background: '#F8FAFC',
    borderTop: '1px solid #E2E8F0',
    borderBottom: '1px solid #E2E8F0',
  },
  td: {
    padding: '14px 20px',
    fontSize: '0.9rem',
    color: '#64748B',
    textAlign: 'center',
    borderBottom: '1px solid #F1F5F9',
  },
  tdHighlight: {
    background: 'rgba(79, 70, 229, 0.03)',
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
    fontFamily: "'Inter', sans-serif",
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
  ctaSection: {
    padding: '100px 0',
  },
}

const pricingStyleSheet = document.createElement('style')
pricingStyleSheet.textContent = `
  @media (max-width: 900px) {
    .page-content section > .container > div[style*="grid-template-columns: repeat(3"] {
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
