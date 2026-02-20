import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2, Users, BookOpen, ChevronRight, ChevronLeft,
  Mail, Link2, Copy, Check, Sparkles, ArrowRight,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'

const orgTypes = [
  { id: 'club', label: '동아리', desc: '대학/사내 동아리', icon: Users },
  { id: 'edu', label: '교육단체', desc: '학원/교육기관', icon: BookOpen },
  { id: 'study', label: '스터디그룹', desc: '자유 스터디 모임', icon: Building2 },
]

const memberOptions = ['1~5명', '6~10명', '11~20명', '21~50명', '50명+']

const stepLabels = ['조직 정보', '멤버 초대', '완료']

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  // Step 1
  const [orgName, setOrgName] = useState('')
  const [orgType, setOrgType] = useState('')
  const [memberCount, setMemberCount] = useState('')
  const [errors, setErrors] = useState({})

  // Step 2
  const [inviteMode, setInviteMode] = useState('email')
  const [emailText, setEmailText] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)

  const validateStep1 = () => {
    const errs = {}
    if (!orgName.trim()) errs.orgName = '조직 이름을 입력해주세요'
    if (!orgType) errs.orgType = '조직 유형을 선택해주세요'
    if (!memberCount) errs.memberCount = '예상 멤버 수를 선택해주세요'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleGenerateLink = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    setInviteLink(`https://learnops.io/invite/${code}`)
  }

  const handleCopyLink = () => {
    if (!inviteLink) return
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const emailCount = emailText.trim()
    ? emailText.trim().split('\n').filter((e) => e.trim()).length
    : 0

  const handleComplete = () => {
    const orgData = {
      name: orgName,
      type: orgType,
      memberCount,
      invitedEmails: inviteMode === 'email'
        ? emailText.trim().split('\n').filter((e) => e.trim())
        : [],
      inviteLink: inviteMode === 'link' ? inviteLink : '',
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem('learnops-org', JSON.stringify(orgData))
    navigate('/dashboard')
  }

  return (
    <div style={styles.page}>
      <Navbar minimal />
      <div style={styles.bgGlow} />
      <div style={styles.bgGlow2} />

      <main style={styles.main}>
        <div style={styles.card}>
          {/* Step Indicator */}
          <div style={styles.stepIndicator}>
            {stepLabels.map((label, i) => (
              <div key={i} style={styles.stepItem}>
                <div
                  style={{
                    ...styles.stepDot,
                    ...(i < step ? styles.stepDotDone : {}),
                    ...(i === step ? styles.stepDotActive : {}),
                  }}
                >
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span
                  style={{
                    ...styles.stepLabel,
                    color: i <= step ? '#0F172A' : '#94A3B8',
                    fontWeight: i === step ? 700 : 500,
                  }}
                >
                  {label}
                </span>
                {i < stepLabels.length - 1 && (
                  <div
                    style={{
                      ...styles.stepLine,
                      background: i < step ? '#10B981' : '#E2E8F0',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 0 && (
            <div style={styles.stepContent}>
              <h2 style={styles.stepTitle}>조직 정보를 알려주세요</h2>
              <p style={styles.stepSubtitle}>LearnOps에서 사용할 조직 정보를 입력해주세요</p>

              {/* Org name */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>조직 이름</label>
                <input
                  type="text"
                  placeholder="예: 사이버보안 동아리"
                  value={orgName}
                  onChange={(e) => { setOrgName(e.target.value); setErrors({ ...errors, orgName: '' }) }}
                  style={{
                    ...styles.input,
                    ...(errors.orgName ? styles.inputError : {}),
                  }}
                />
                {errors.orgName && <span style={styles.errorText}>{errors.orgName}</span>}
              </div>

              {/* Org type */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>조직 유형</label>
                <div style={styles.typeGrid}>
                  {orgTypes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { setOrgType(t.id); setErrors({ ...errors, orgType: '' }) }}
                      style={{
                        ...styles.typeCard,
                        ...(orgType === t.id ? styles.typeCardActive : {}),
                      }}
                    >
                      <div
                        style={{
                          ...styles.typeIcon,
                          ...(orgType === t.id ? styles.typeIconActive : {}),
                        }}
                      >
                        <t.icon size={24} />
                      </div>
                      <span style={styles.typeLabel}>{t.label}</span>
                      <span style={styles.typeDesc}>{t.desc}</span>
                    </button>
                  ))}
                </div>
                {errors.orgType && <span style={styles.errorText}>{errors.orgType}</span>}
              </div>

              {/* Member count */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>예상 멤버 수</label>
                <div style={styles.memberGrid}>
                  {memberOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setMemberCount(opt); setErrors({ ...errors, memberCount: '' }) }}
                      style={{
                        ...styles.memberBtn,
                        ...(memberCount === opt ? styles.memberBtnActive : {}),
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.memberCount && <span style={styles.errorText}>{errors.memberCount}</span>}
              </div>

              <Button onClick={handleNext} style={{ width: '100%', padding: '14px 24px', marginTop: '8px' }}>
                다음 단계 <ChevronRight size={18} />
              </Button>
            </div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <div style={styles.stepContent}>
              <h2 style={styles.stepTitle}>멤버를 초대하세요</h2>
              <p style={styles.stepSubtitle}>함께 학습할 멤버를 초대해보세요</p>

              {/* Invite mode toggle */}
              <div style={styles.inviteToggle}>
                <button
                  style={{
                    ...styles.inviteToggleBtn,
                    ...(inviteMode === 'email' ? styles.inviteToggleBtnActive : {}),
                  }}
                  onClick={() => setInviteMode('email')}
                >
                  <Mail size={16} /> 이메일 초대
                </button>
                <button
                  style={{
                    ...styles.inviteToggleBtn,
                    ...(inviteMode === 'link' ? styles.inviteToggleBtnActive : {}),
                  }}
                  onClick={() => setInviteMode('link')}
                >
                  <Link2 size={16} /> 링크 초대
                </button>
              </div>

              {inviteMode === 'email' && (
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    이메일 주소 (줄바꿈으로 구분)
                    {emailCount > 0 && (
                      <span style={styles.emailCount}>{emailCount}명</span>
                    )}
                  </label>
                  <textarea
                    placeholder={'예:\nhong@example.com\nkim@example.com'}
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    style={styles.textarea}
                    rows={6}
                  />
                </div>
              )}

              {inviteMode === 'link' && (
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>초대 링크</label>
                  {!inviteLink ? (
                    <Button
                      variant="secondary"
                      onClick={handleGenerateLink}
                      style={{ width: '100%', padding: '14px 24px' }}
                    >
                      <Link2 size={16} /> 초대 링크 생성
                    </Button>
                  ) : (
                    <div style={styles.linkRow}>
                      <input
                        type="text"
                        value={inviteLink}
                        readOnly
                        style={{ ...styles.input, flex: 1 }}
                      />
                      <Button
                        variant="secondary"
                        onClick={handleCopyLink}
                        style={{ padding: '12px 16px', flexShrink: 0 }}
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? '복사됨' : '복사'}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div style={styles.stepActions}>
                <Button variant="ghost" onClick={handleBack} style={{ padding: '14px 24px' }}>
                  <ChevronLeft size={18} /> 이전
                </Button>
                <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                  <Button
                    variant="secondary"
                    onClick={() => setStep(2)}
                    style={{ flex: 1, padding: '14px 24px' }}
                  >
                    나중에 초대하기
                  </Button>
                  <Button onClick={handleNext} style={{ flex: 1, padding: '14px 24px' }}>
                    다음 <ChevronRight size={18} />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div style={styles.stepContent}>
              <div style={styles.completeIcon}>
                <Sparkles size={40} style={{ color: '#4F46E5' }} />
              </div>
              <h2 style={{ ...styles.stepTitle, textAlign: 'center' }}>설정이 완료되었습니다!</h2>
              <p style={{ ...styles.stepSubtitle, textAlign: 'center' }}>
                이제 LearnOps에서 팀과 함께 학습을 시작할 수 있습니다.
              </p>

              <div style={styles.summaryCard}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>조직 이름</span>
                  <span style={styles.summaryValue}>{orgName}</span>
                </div>
                <div style={styles.summaryDivider} />
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>조직 유형</span>
                  <span style={styles.summaryValue}>
                    {orgTypes.find((t) => t.id === orgType)?.label}
                  </span>
                </div>
                <div style={styles.summaryDivider} />
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>예상 멤버 수</span>
                  <span style={styles.summaryValue}>{memberCount}</span>
                </div>
                {emailCount > 0 && (
                  <>
                    <div style={styles.summaryDivider} />
                    <div style={styles.summaryRow}>
                      <span style={styles.summaryLabel}>초대된 멤버</span>
                      <span style={styles.summaryValue}>{emailCount}명</span>
                    </div>
                  </>
                )}
              </div>

              <Button onClick={handleComplete} style={{ width: '100%', padding: '14px 24px', marginTop: '8px' }}>
                대시보드로 이동 <ArrowRight size={18} />
              </Button>
            </div>
          )}
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
    maxWidth: '560px',
    background: '#FFFFFF',
    borderRadius: '20px',
    border: '1px solid #E2E8F0',
    padding: '48px 40px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },

  /* Step indicator */
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stepDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 700,
    background: '#F1F5F9',
    color: '#94A3B8',
    transition: 'all 0.3s ease',
    flexShrink: 0,
  },
  stepDotActive: {
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    color: '#fff',
  },
  stepDotDone: {
    background: '#10B981',
    color: '#fff',
  },
  stepLabel: {
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  stepLine: {
    width: '40px',
    height: '2px',
    margin: '0 8px',
    transition: 'background 0.3s ease',
    flexShrink: 0,
  },

  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  stepTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: '0',
  },
  stepSubtitle: {
    fontSize: '0.9rem',
    color: '#64748B',
    marginBottom: '8px',
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
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
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
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: '0.8rem',
    color: '#EF4444',
    fontWeight: 500,
  },

  /* Org type */
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  typeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '20px 12px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    background: '#F8FAFC',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#64748B',
    fontFamily: "'Inter', sans-serif",
  },
  typeCardActive: {
    border: '1px solid rgba(79, 70, 229, 0.5)',
    background: 'rgba(79, 70, 229, 0.05)',
    color: '#0F172A',
    boxShadow: '0 0 20px rgba(79, 70, 229, 0.1)',
  },
  typeIcon: {
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
  typeIconActive: {
    background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(6,182,212,0.2))',
    color: '#818CF8',
  },
  typeLabel: {
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  typeDesc: {
    fontSize: '0.75rem',
    color: '#64748B',
    textAlign: 'center',
  },

  /* Member count */
  memberGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  memberBtn: {
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    background: '#F8FAFC',
    color: '#64748B',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Inter', sans-serif",
  },
  memberBtnActive: {
    border: '1px solid rgba(79, 70, 229, 0.5)',
    background: 'rgba(79, 70, 229, 0.05)',
    color: '#4F46E5',
  },

  /* Invite */
  inviteToggle: {
    display: 'flex',
    gap: '8px',
    padding: '4px',
    background: '#F1F5F9',
    borderRadius: '12px',
  },
  inviteToggleBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#64748B',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Inter', sans-serif",
  },
  inviteToggleBtnActive: {
    background: '#fff',
    color: '#0F172A',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    background: '#F8FAFC',
    color: '#0F172A',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.6,
    boxSizing: 'border-box',
  },
  emailCount: {
    padding: '2px 8px',
    borderRadius: '100px',
    background: 'rgba(79, 70, 229, 0.1)',
    color: '#4F46E5',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  linkRow: {
    display: 'flex',
    gap: '8px',
  },
  stepActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },

  /* Complete */
  completeIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(79, 70, 229, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  summaryCard: {
    background: '#F8FAFC',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    padding: '24px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  },
  summaryLabel: {
    fontSize: '0.9rem',
    color: '#64748B',
  },
  summaryValue: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#0F172A',
  },
  summaryDivider: {
    height: '1px',
    background: '#E2E8F0',
  },
}

const onboardingStyleSheet = document.createElement('style')
onboardingStyleSheet.textContent = `
  @media (max-width: 480px) {
    .onboarding-card {
      padding: 32px 24px !important;
    }
  }
`
if (!document.querySelector('[data-learnops-onboarding-styles]')) {
  onboardingStyleSheet.setAttribute('data-learnops-onboarding-styles', '')
  document.head.appendChild(onboardingStyleSheet)
}
