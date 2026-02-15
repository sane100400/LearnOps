import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, GraduationCap, BookOpen, Terminal,
  Trophy, Users, Settings, ChevronLeft, Menu, Cpu,
} from 'lucide-react'
import { useState } from 'react'
import { currentUser } from '../data/users'

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: '대시보드' },
  { path: '/level-test', icon: GraduationCap, label: '레벨테스트' },
  { path: '/curriculum', icon: BookOpen, label: '커리큘럼' },
  { path: '/lab', icon: Terminal, label: '실습 환경' },
  { path: '/ranking', icon: Trophy, label: '랭킹' },
  { path: '/study-group', icon: Users, label: '스터디 그룹' },
  { path: '/curriculum-generate', icon: Cpu, label: '커리큘럼 생성' },
]

export default function Sidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button onClick={() => setMobileOpen(true)} style={styles.mobileToggle} className="sidebar-mobile-toggle">
        <Menu size={22} />
      </button>
      {mobileOpen && <div style={styles.overlay} onClick={() => setMobileOpen(false)} />}
      <aside
        style={{
          ...styles.sidebar,
          width: collapsed ? '72px' : '260px',
          ...(mobileOpen ? styles.sidebarMobileOpen : {}),
        }}
        className="sidebar"
      >
        <div style={styles.top}>
          <button onClick={() => { setCollapsed(!collapsed); setMobileOpen(false) }} style={styles.collapseBtn}>
            <ChevronLeft size={18} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>
        </div>
        <nav style={styles.menu}>
          {menuItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path
            return (
              <Link key={path} to={path} style={{ ...styles.menuItem, ...(isActive ? styles.activeItem : {}) }} onClick={() => setMobileOpen(false)}>
                <Icon size={20} />
                {!collapsed && <span>{label}</span>}
              </Link>
            )
          })}
        </nav>
        <div style={styles.bottom}>
          {!collapsed && (
            <div style={styles.userCard}>
              <div style={styles.userAvatar}>{currentUser.avatar}</div>
              <div>
                <div style={styles.userName}>{currentUser.name}</div>
                <div style={styles.userRole}>{currentUser.role === 'operator' ? '운영자' : '학습자'}</div>
              </div>
            </div>
          )}
          <Link to="/dashboard" style={styles.menuItem} onClick={() => setMobileOpen(false)}>
            <Settings size={20} />
            {!collapsed && <span>설정</span>}
          </Link>
        </div>
      </aside>
    </>
  )
}

const styles = {
  sidebar: {
    position: 'fixed', top: '72px', left: 0, bottom: 0,
    background: '#FFFFFF',
    borderRight: '1px solid #E2E8F0',
    display: 'flex', flexDirection: 'column',
    transition: 'all 0.3s ease', zIndex: 900, overflowX: 'hidden',
  },
  sidebarMobileOpen: { transform: 'translateX(0)' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 899 },
  top: { padding: '16px', display: 'flex', justifyContent: 'flex-end' },
  collapseBtn: {
    width: '32px', height: '32px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer',
  },
  menu: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' },
  menuItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 16px', borderRadius: '10px', color: '#64748B',
    fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none',
    transition: 'all 0.2s ease', whiteSpace: 'nowrap',
  },
  activeItem: {
    color: '#4F46E5', background: 'rgba(79,70,229,0.08)',
    fontWeight: 600, boxShadow: 'inset 3px 0 0 #4F46E5',
  },
  bottom: { padding: '12px', borderTop: '1px solid #E2E8F0' },
  userCard: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px', marginBottom: '8px', borderRadius: '10px',
    background: '#F8FAFC',
  },
  userAvatar: {
    width: '36px', height: '36px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
  },
  userName: { fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' },
  userRole: { fontSize: '0.75rem', color: '#94A3B8' },
  mobileToggle: {
    display: 'none', position: 'fixed', bottom: '24px', left: '24px',
    width: '48px', height: '48px', borderRadius: '14px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff',
    border: 'none', cursor: 'pointer', zIndex: 901,
    alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)',
  },
}

const styleEl = document.createElement('style')
styleEl.textContent = `
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar-mobile-toggle { display: flex !important; }
  }
`
if (!document.querySelector('[data-learnops-sidebar-styles]')) {
  styleEl.setAttribute('data-learnops-sidebar-styles', '')
  document.head.appendChild(styleEl)
}
