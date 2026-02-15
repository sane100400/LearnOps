import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Github, Eye, EyeOff } from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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

          <h1 style={styles.title}>다시 오신 것을 환영합니다</h1>
          <p style={styles.subtitle}>계정에 로그인하여 학습을 계속하세요</p>

          <form onSubmit={handleSubmit} style={styles.form}>
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
                  placeholder="비밀번호를 입력하세요"
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

            {/* Forgot password */}
            <div style={styles.forgotRow}>
              <Link to="/forgot-password" style={styles.forgotLink}>
                비밀번호를 잊으셨나요?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              style={{ width: '100%', padding: '14px 24px', fontSize: '1rem' }}
            >
              로그인
            </Button>
          </form>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>또는</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Social login */}
          <div style={styles.socialGroup}>
            <Button
              variant="secondary"
              style={styles.socialBtn}
              onClick={() => {}}
            >
              <Github size={20} />
              GitHub으로 로그인
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
              Google로 로그인
            </Button>
          </div>

          {/* Register link */}
          <p style={styles.footerText}>
            계정이 없으신가요?{' '}
            <Link to="/register" style={styles.footerLink}>
              회원가입
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
    fontFamily: "'Inter', sans-serif",
    color: '#0F172A',
    position: 'relative',
    overflow: 'hidden',
  },
  bgGlow: {
    position: 'absolute',
    top: '-200px',
    right: '-100px',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'absolute',
    bottom: '-200px',
    left: '-100px',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
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
    borderRadius: '20px',
    border: '1px solid #E2E8F0',
    padding: '48px 40px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
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
    color: '#94A3B8',
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
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
  },
  toggleBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    color: '#94A3B8',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '-8px',
  },
  forgotLink: {
    fontSize: '0.8rem',
    color: '#06B6D4',
    textDecoration: 'none',
    fontWeight: 500,
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
    color: '#94A3B8',
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
const loginStyleSheet = document.createElement('style')
loginStyleSheet.textContent = `
  .login-page input:focus {
    border-color: rgba(79, 70, 229, 0.5) !important;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
  }
  .login-page input::placeholder {
    color: #94A3B8;
  }
  @media (max-width: 480px) {
    .login-page .login-card {
      padding: 32px 24px !important;
    }
  }
`
if (!document.querySelector('[data-learnops-login-styles]')) {
  loginStyleSheet.setAttribute('data-learnops-login-styles', '')
  document.head.appendChild(loginStyleSheet)
}
