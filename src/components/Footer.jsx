import { Link } from 'react-router-dom'
import { Github, Mail, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          <div>
            <div style={styles.logoWrap}>
              <img src="/logo.svg" alt="LearnOps" style={{ width: 32, height: 32 }} />
              <span style={styles.logoText}>LearnOps</span>
            </div>
            <p style={styles.desc}>AI 맞춤형 IT 보안 실습 플랫폼으로<br />당신의 보안 역량을 한 단계 높이세요.</p>
          </div>
          <div>
            <h4 style={styles.heading}>서비스</h4>
            <div style={styles.linkList}>
              <Link to="/level-test" style={styles.link}>레벨테스트</Link>
              <Link to="/curriculum" style={styles.link}>커리큘럼</Link>
              <Link to="/lab" style={styles.link}>실습 환경</Link>
              <Link to="/ranking" style={styles.link}>랭킹</Link>
            </div>
          </div>
          <div>
            <h4 style={styles.heading}>커뮤니티</h4>
            <div style={styles.linkList}>
              <Link to="/study-group" style={styles.link}>스터디 그룹</Link>
              <a href="#" style={styles.link}>블로그 <ExternalLink size={12} /></a>
              <a href="#" style={styles.link}>Discord <ExternalLink size={12} /></a>
            </div>
          </div>
          <div>
            <h4 style={styles.heading}>문의</h4>
            <div style={styles.linkList}>
              <a href="mailto:hello@learnops.io" style={styles.link}><Mail size={14} /> hello@learnops.io</a>
              <a href="#" style={styles.link}><Github size={14} /> GitHub</a>
            </div>
          </div>
        </div>
        <div style={styles.bottom}>
          <span style={styles.copy}>&copy; 2026 LearnOps. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: { borderTop: '1px solid #E2E8F0', padding: '64px 0 32px', background: '#FFFFFF' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', marginBottom: '48px' },
  logoWrap: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
  logoText: {
    fontSize: '1.2rem', fontWeight: 800,
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  desc: { color: '#64748B', fontSize: '0.9rem', lineHeight: 1.7 },
  heading: { color: '#0F172A', fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px' },
  linkList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  link: {
    color: '#64748B', fontSize: '0.85rem', textDecoration: 'none',
    display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s ease',
  },
  bottom: { borderTop: '1px solid #E2E8F0', paddingTop: '24px', textAlign: 'center' },
  copy: { color: '#94A3B8', fontSize: '0.8rem' },
}

const footerStyle = document.createElement('style')
footerStyle.textContent = `
  @media (max-width: 768px) { footer .container > div:first-child { grid-template-columns: 1fr 1fr !important; } }
  @media (max-width: 480px) { footer .container > div:first-child { grid-template-columns: 1fr !important; } }
`
if (!document.querySelector('[data-learnops-footer-styles]')) {
  footerStyle.setAttribute('data-learnops-footer-styles', '')
  document.head.appendChild(footerStyle)
}
