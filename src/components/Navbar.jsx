import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Bell, ChevronDown, LogOut } from 'lucide-react'
import { currentUser } from '../data/users'

const navLinks = [
  { path: '/dashboard', label: '대시보드' },
  { path: '/level-test', label: '레벨테스트' },
  { path: '/curriculum', label: '커리큘럼' },
  { path: '/lab', label: '실습' },
  { path: '/ranking', label: '랭킹' },
  { path: '/study-group', label: '스터디' },
]

export default function Navbar({ minimal = false }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logoWrap}>
          <img src="/logo.svg" alt="LearnOps" style={styles.logoImg} />
          <span style={styles.logoText}>LearnOps</span>
        </Link>

        {!minimal && (
          <>
            <div style={styles.links}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    ...styles.link,
                    ...(location.pathname === link.path ? styles.activeLink : {}),
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div style={styles.actions}>
              <button style={styles.iconBtn}>
                <Bell size={20} />
              </button>

              {/* Profile dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  style={styles.profileBtn}
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div style={styles.profileAvatar}>{currentUser.avatar}</div>
                  <span style={styles.profileName}>{currentUser.name}</span>
                  <ChevronDown size={14} style={{ color: '#64748B' }} />
                </button>
                {profileOpen && (
                  <div style={styles.dropdown}>
                    <div style={styles.dropdownHeader}>
                      <div style={styles.dropdownAvatar}>{currentUser.avatar}</div>
                      <div>
                        <div style={styles.dropdownName}>{currentUser.name}</div>
                        <div style={styles.dropdownEmail}>{currentUser.email}</div>
                      </div>
                    </div>
                    <div style={styles.dropdownDivider} />
                    <Link to="/dashboard" style={styles.dropdownItem} onClick={() => setProfileOpen(false)}>대시보드</Link>
                    <Link to="/login" style={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                      <LogOut size={14} /> 로그아웃
                    </Link>
                  </div>
                )}
              </div>

              <button
                style={styles.hamburger}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </>
        )}
      </div>

      {mobileOpen && !minimal && (
        <div style={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.mobileLink,
                ...(location.pathname === link.path ? styles.activeMobileLink : {}),
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '72px',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid #E2E8F0',
    zIndex: 1000,
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoImg: { width: '36px', height: '36px' },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  links: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  link: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#64748B',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
  activeLink: {
    color: '#4F46E5',
    background: 'rgba(79, 70, 229, 0.08)',
    fontWeight: 600,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  iconBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748B',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px 6px 6px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  profileAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  profileName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#0F172A',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: '240px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    zIndex: 100,
  },
  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
  },
  dropdownAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
  },
  dropdownName: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#0F172A',
  },
  dropdownEmail: {
    fontSize: '0.8rem',
    color: '#94A3B8',
  },
  dropdownDivider: {
    height: '1px',
    background: '#E2E8F0',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    fontSize: '0.85rem',
    color: '#64748B',
    textDecoration: 'none',
    transition: 'background 0.15s ease',
  },
  hamburger: {
    display: 'none',
    width: '40px',
    height: '40px',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748B',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  mobileMenu: {
    position: 'absolute',
    top: '72px',
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid #E2E8F0',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  mobileLink: {
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '1rem',
    color: '#64748B',
    textDecoration: 'none',
  },
  activeMobileLink: {
    color: '#4F46E5',
    background: 'rgba(79, 70, 229, 0.08)',
  },
}

const styleSheet = document.createElement('style')
styleSheet.textContent = `
  @media (max-width: 768px) {
    nav [data-links] { display: none !important; }
  }
`
if (!document.querySelector('[data-learnops-nav-styles]')) {
  styleSheet.setAttribute('data-learnops-nav-styles', '')
  document.head.appendChild(styleSheet)
}
