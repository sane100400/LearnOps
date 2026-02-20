import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, User, Github, Eye, EyeOff, UserCog, GraduationCap } from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [role, setRole] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div style={styles.page}>
      <Navbar minimal />

      <div style={styles.bgGlow} />
      <div style={styles.bgGlow2} />

      <main style={styles.main}>
        <div style={styles.card}>
          {/* Logo */}
          <div style={styles.logoWrap}>
            <img src="/logo.svg" alt="LearnOps" style={styles.logoImg} />
            <span style={styles.logoText}>LearnOps</span>
          </div>

          <h1 style={styles.title}>계정 만들기</h1>
          <p style={styles.subtitle}>LearnOps와 함께 보안 학습을 시작하세요</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Name */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>이름</label>
              <div style={styles.inputWrap}>
                <User size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>이메일</label>
              <div style={styles.inputWrap}>
                <Mail size={18} style={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>비밀번호</label>
              <div style={styles.inputWrap}>
                <Lock size={18} style={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8자 이상 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.toggleBtn}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>비밀번호 확인</label>
              <div style={styles.inputWrap}>
                <Lock size={18} style={styles.inputIcon} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 입력하세요"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={styles.toggleBtn}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role selection */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>역할 선택</label>
              <div style={styles.roleGrid}>
                <button
                  type="button"
                  onClick={() => setRole('operator')}
                  style={{
                    ...styles.roleCard,
                    ...(role === 'operator' ? styles.roleCardActive : {}),
                  }}
                >
                  <div
                    style={{
                      ...styles.roleIconWrap,
                      ...(role === 'operator' ? styles.roleIconWrapActive : {}),
                    }}
                  >
                    <UserCog size={24} />
                  </div>
                  <span style={styles.roleLabel}>운영자</span>
                  <span style={styles.roleDesc}>교육과정을 관리합니다</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('learner')}
                  style={{
                    ...styles.roleCard,
                    ...(role === 'learner' ? styles.roleCardActive : {}),
                  }}
                >
                  <div
                    style={{
                      ...styles.roleIconWrap,
                      ...(role === 'learner' ? styles.roleIconWrapActive : {}),
                    }}
                  >
                    <GraduationCap size={24} />
                  </div>
                  <span style={styles.roleLabel}>학습자</span>
                  <span style={styles.roleDesc}>보안 역량을 키웁니다</span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              style={{ width: '100%', padding: '14px 24px', fontSize: '1rem' }}
            >
              회원가입
            </Button>
          </form>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>또는</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Social signup */}
          <div style={styles.socialGroup}>
            <Button
              variant="secondary"
              style={styles.socialBtn}
              onClick={() => {}}
            >
              <Github size={20} />
              GitHub으로 가입
            </Button>
            <Button
              variant="secondary"
              style={styles.socialBtn}
              onClick={() => {}}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google로 가입
            </Button>
          </div>

          {/* Login link */}
          <p style={styles.footerText}>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" style={styles.footerLink}>
              로그인
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    fontFamily: 'inherit',
    color: '#0F172A',
    position: 'relative',
    overflow: 'hidden',
  },
  bgGlow: {
    position: 'absolute',
    top: '-200px',
    left: '-100px',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'absolute',
    bottom: '-200px',
    right: '-100px',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  main: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '100px 24px 40px',
    position: 'relative',
    zIndex: 1,
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: '#FFFFFF',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid #E2E8F0',
    padding: '48px 40px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '32px',
  },
  logoImg: {
    width: '40px',
    height: '40px',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '8px',
    letterSpacing: '-0.01em',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#0F172A',
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: '#64748B',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 44px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    background: '#F8FAFC',
    color: '#0F172A',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  toggleBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    color: '#64748B',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  roleCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '20px 16px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    background: '#F8FAFC',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#64748B',
    fontFamily: 'inherit',
  },
  roleCardActive: {
    border: '1px solid rgba(79, 70, 229, 0.5)',
    background: 'rgba(79, 70, 229, 0.05)',
    color: '#0F172A',
    boxShadow: '0 0 20px rgba(79, 70, 229, 0.1)',
  },
  roleIconWrap: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748B',
    transition: 'all 0.2s ease',
  },
  roleIconWrapActive: {
    background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(6,182,212,0.2))',
    color: '#818CF8',
  },
  roleLabel: {
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  roleDesc: {
    fontSize: '0.75rem',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 1.4,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '28px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#E2E8F0',
  },
  dividerText: {
    fontSize: '0.8rem',
    color: '#64748B',
    fontWeight: 500,
  },
  socialGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  socialBtn: {
    width: '100%',
    padding: '12px 24px',
    fontSize: '0.9rem',
    justifyContent: 'center',
  },
  footerText: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#64748B',
    marginTop: '28px',
  },
  footerLink: {
    color: '#06B6D4',
    textDecoration: 'none',
    fontWeight: 600,
  },
}

/* Focus styles for inputs */
const registerStyleSheet = document.createElement('style')
registerStyleSheet.textContent = `
  .register-page input:focus {
    border-color: rgba(79, 70, 229, 0.5) !important;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
  }
  .register-page input::placeholder {
    color: #94A3B8;
  }
  @media (max-width: 480px) {
    .register-page .register-card {
      padding: 32px 24px !important;
    }
  }
`
if (!document.querySelector('[data-learnops-register-styles]')) {
  registerStyleSheet.setAttribute('data-learnops-register-styles', '')
  document.head.appendChild(registerStyleSheet)
}
