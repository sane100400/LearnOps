import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  BookOpen,
  Trophy,
  Bell,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'

/* ===== Mock Data ===== */

const statsData = [
  {
    label: '총 학습자',
    value: '24명',
    icon: Users,
    color: '#4F46E5',
    bg: 'rgba(79, 70, 229, 0.12)',
    change: '+3 이번 주',
  },
  {
    label: '진행 중 커리큘럼',
    value: '8개',
    icon: BookOpen,
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.12)',
    change: '+1 신규',
  },
  {
    label: '평균 완료율',
    value: '67%',
    icon: TrendingUp,
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    change: '+5% 상승',
  },
  {
    label: '이번 주 활동',
    value: '156',
    icon: Trophy,
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    change: '+12% 증가',
  },
]

const weeklyChartData = [
  { day: 'Mon', 학습시간: 32, 실습완료: 12 },
  { day: 'Tue', 학습시간: 45, 실습완료: 18 },
  { day: 'Wed', 학습시간: 28, 실습완료: 9 },
  { day: 'Thu', 학습시간: 52, 실습완료: 22 },
  { day: 'Fri', 학습시간: 61, 실습완료: 28 },
  { day: 'Sat', 학습시간: 38, 실습완료: 15 },
  { day: 'Sun', 학습시간: 20, 실습완료: 7 },
]

const memberProgressData = [
  { name: '김보안', role: '모의해킹', progress: 92, color: '#10B981' },
  { name: '이해커', role: '네트워크 보안', progress: 78, color: '#06B6D4' },
  { name: '박분석', role: '악성코드 분석', progress: 65, color: '#4F46E5' },
  { name: '최방어', role: '시스템 보안', progress: 53, color: '#F59E0B' },
  { name: '정관제', role: '보안 관제', progress: 41, color: '#EF4444' },
]

const recentActivities = [
  {
    icon: CheckCircle2,
    color: '#10B981',
    text: '김보안님이 "SQL Injection 실습" 을 완료했습니다.',
    time: '5분 전',
    type: '실습 완료',
  },
  {
    icon: TrendingUp,
    color: '#4F46E5',
    text: '이해커님이 Level 3에서 Level 4로 레벨업했습니다.',
    time: '23분 전',
    type: '레벨업',
  },
  {
    icon: Users,
    color: '#06B6D4',
    text: '새 멤버 정관제님이 팀에 참여했습니다.',
    time: '1시간 전',
    type: '새 멤버 참여',
  },
  {
    icon: Trophy,
    color: '#F59E0B',
    text: '박분석님이 "리버싱 마스터" 뱃지를 획득했습니다.',
    time: '2시간 전',
    type: '뱃지 획득',
  },
  {
    icon: BookOpen,
    color: '#818CF8',
    text: '최방어님이 "시스템 해킹 기초" 커리큘럼을 시작했습니다.',
    time: '3시간 전',
    type: '커리큘럼 시작',
  },
]

const quickActions = [
  {
    title: '커리큘럼 관리',
    desc: '학습 경로를 설정하고 콘텐츠를 관리합니다.',
    icon: BookOpen,
    color: '#4F46E5',
    path: '/curriculum',
  },
  {
    title: '실습 환경 설정',
    desc: '실습 서버와 환경을 구성합니다.',
    icon: AlertCircle,
    color: '#06B6D4',
    path: '/lab',
  },
  {
    title: '스터디 그룹 관리',
    desc: '그룹을 생성하고 멤버를 배정합니다.',
    icon: Users,
    color: '#10B981',
    path: '/study-group',
  },
]

const notifications = [
  {
    id: 1,
    title: '새로운 학습자 등록',
    message: '정관제님이 플랫폼에 등록하고 레벨테스트를 요청했습니다.',
    time: '10분 전',
    read: false,
  },
  {
    id: 2,
    title: '실습 환경 만료 예정',
    message: '"네트워크 침투 테스트" 실습 환경이 24시간 내 만료됩니다.',
    time: '1시간 전',
    read: false,
  },
  {
    id: 3,
    title: '주간 리포트 생성 완료',
    message: '2월 2주차 학습 성과 리포트가 생성되었습니다.',
    time: '3시간 전',
    read: true,
  },
]

/* ===== Custom Tooltip ===== */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      <p style={{ color: '#0F172A', fontWeight: 600, marginBottom: '6px', fontSize: '0.85rem' }}>
        {label}
      </p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color, fontSize: '0.8rem', margin: '2px 0' }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

/* ===== Dashboard Component ===== */

export default function Dashboard() {
  const [dismissedNotifications, setDismissedNotifications] = useState([])

  const dismissNotification = (id) => {
    setDismissedNotifications((prev) => [...prev, id])
  }

  const visibleNotifications = notifications.filter(
    (n) => !dismissedNotifications.includes(n.id)
  )

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="dashboard-content">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>운영자 대시보드</h1>
            <p style={styles.welcomeMsg}>
              안녕하세요, 관리자님. 오늘도 팀의 성장을 함께 만들어가요.
            </p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.dateBadge}>
              <Clock size={14} />
              <span>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid} className="dashboard-stats-grid">
          {statsData.map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i} style={{ padding: '24px' }}>
                <div style={styles.statCard}>
                  <div style={styles.statTop}>
                    <div
                      style={{
                        ...styles.statIconWrap,
                        background: stat.bg,
                        color: stat.color,
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span style={styles.statChange}>{stat.change}</span>
                  </div>
                  <div style={styles.statValue}>{stat.value}</div>
                  <div style={styles.statLabel}>{stat.label}</div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Charts Section */}
        <div style={styles.chartsGrid} className="dashboard-charts-grid">
          {/* Weekly Learning Chart */}
          <Card style={{ padding: '28px' }}>
            <h3 style={styles.sectionHeading}>주간 학습 현황</h3>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData} barGap={4}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="학습시간"
                    fill="#4F46E5"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="실습완료"
                    fill="#06B6D4"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.chartLegend}>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, background: '#4F46E5' }} />
                <span>학습시간 (분)</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, background: '#06B6D4' }} />
                <span>실습완료 (건)</span>
              </div>
            </div>
          </Card>

          {/* Member Progress */}
          <Card style={{ padding: '28px' }}>
            <h3 style={styles.sectionHeading}>구성원 진도 현황</h3>
            <div style={styles.memberList}>
              {memberProgressData.map((member, i) => (
                <div key={i} style={styles.memberItem}>
                  <div style={styles.memberInfo}>
                    <div style={styles.memberAvatar}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div style={styles.memberName}>{member.name}</div>
                      <div style={styles.memberRole}>{member.role}</div>
                    </div>
                  </div>
                  <div style={styles.progressWrap}>
                    <div style={styles.progressBarBg}>
                      <div
                        style={{
                          ...styles.progressBarFill,
                          width: `${member.progress}%`,
                          background: member.progress >= 80
                            ? 'linear-gradient(90deg, #10B981, #06B6D4)'
                            : member.progress >= 60
                            ? 'linear-gradient(90deg, #06B6D4, #4F46E5)'
                            : member.progress >= 40
                            ? 'linear-gradient(90deg, #F59E0B, #EF8C00)'
                            : 'linear-gradient(90deg, #EF4444, #DC2626)',
                        }}
                      />
                    </div>
                    <span style={styles.progressPercent}>{member.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={styles.sectionHeading}>최근 활동</h3>
          <Card style={{ padding: '0', overflow: 'hidden' }} hover={false}>
            {recentActivities.map((activity, i) => {
              const Icon = activity.icon
              return (
                <div
                  key={i}
                  style={{
                    ...styles.activityItem,
                    borderBottom:
                      i < recentActivities.length - 1
                        ? '1px solid #E2E8F0'
                        : 'none',
                  }}
                >
                  <div
                    style={{
                      ...styles.activityIconWrap,
                      background: `${activity.color}15`,
                      color: activity.color,
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div style={styles.activityContent}>
                    <span style={styles.activityBadge}>{activity.type}</span>
                    <p style={styles.activityText}>{activity.text}</p>
                  </div>
                  <div style={styles.activityTime}>
                    <Clock size={12} />
                    <span>{activity.time}</span>
                  </div>
                </div>
              )
            })}
          </Card>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={styles.sectionHeading}>빠른 바로가기</h3>
          <div style={styles.quickActionsGrid} className="dashboard-quick-grid">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <Link key={i} to={action.path} style={{ textDecoration: 'none' }}>
                  <Card style={{ padding: '24px', cursor: 'pointer', height: '100%' }}>
                    <div style={styles.quickAction}>
                      <div
                        style={{
                          ...styles.quickActionIcon,
                          background: `${action.color}15`,
                          color: action.color,
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={styles.quickActionTitle}>{action.title}</h4>
                        <p style={styles.quickActionDesc}>{action.desc}</p>
                      </div>
                      <ArrowRight size={18} style={{ color: '#94A3B8', flexShrink: 0 }} />
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Notification Center */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={styles.sectionHeading}>
            <Bell size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            알림 센터
            {visibleNotifications.filter((n) => !n.read).length > 0 && (
              <span style={styles.notifBadge}>
                {visibleNotifications.filter((n) => !n.read).length}
              </span>
            )}
          </h3>
          {visibleNotifications.length > 0 ? (
            <div style={styles.notifList}>
              {visibleNotifications.map((notif) => (
                <Card
                  key={notif.id}
                  style={{
                    padding: '20px 24px',
                    borderLeft: notif.read
                      ? '3px solid #E2E8F0'
                      : '3px solid #4F46E5',
                  }}
                  hover={false}
                >
                  <div style={styles.notifItem}>
                    <div
                      style={{
                        ...styles.notifIconWrap,
                        background: notif.read
                          ? 'rgba(148, 163, 184, 0.1)'
                          : 'rgba(79, 70, 229, 0.12)',
                        color: notif.read ? '#94A3B8' : '#818CF8',
                      }}
                    >
                      <Bell size={16} />
                    </div>
                    <div style={styles.notifContent}>
                      <div style={styles.notifHeader}>
                        <h4 style={styles.notifTitle}>{notif.title}</h4>
                        <span style={styles.notifTime}>{notif.time}</span>
                      </div>
                      <p style={styles.notifMessage}>{notif.message}</p>
                    </div>
                    <button
                      onClick={() => dismissNotification(notif.id)}
                      style={styles.notifDismiss}
                      title="알림 닫기"
                    >
                      &times;
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card style={{ padding: '40px', textAlign: 'center' }} hover={false}>
              <Bell size={32} style={{ color: '#94A3B8', marginBottom: '12px' }} />
              <p style={{ color: '#94A3B8' }}>새로운 알림이 없습니다.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

/* ===== Styles ===== */

const styles = {
  /* Header */
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  pageTitle: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#0F172A',
    marginBottom: '8px',
  },
  welcomeMsg: {
    color: '#64748B',
    fontSize: '0.95rem',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dateBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '10px',
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    color: '#64748B',
    fontSize: '0.85rem',
  },

  /* Stats */
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  statIconWrap: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statChange: {
    fontSize: '0.75rem',
    color: '#10B981',
    fontWeight: 600,
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#0F172A',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#64748B',
  },

  /* Charts */
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },
  sectionHeading: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  chartLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginTop: '16px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#64748B',
    fontSize: '0.8rem',
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '3px',
  },

  /* Member Progress */
  memberList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  memberItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  memberInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  memberAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  memberName: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#0F172A',
  },
  memberRole: {
    fontSize: '0.75rem',
    color: '#94A3B8',
  },
  progressWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  progressBarBg: {
    flex: 1,
    height: '8px',
    borderRadius: '4px',
    background: '#E2E8F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.6s ease',
  },
  progressPercent: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#0F172A',
    minWidth: '36px',
    textAlign: 'right',
  },

  /* Activity Feed */
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '18px 24px',
    transition: 'background 0.2s ease',
  },
  activityIconWrap: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
    minWidth: 0,
  },
  activityBadge: {
    display: 'inline-block',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#818CF8',
    background: 'rgba(79, 70, 229, 0.1)',
    padding: '2px 8px',
    borderRadius: '6px',
    marginBottom: '4px',
  },
  activityText: {
    fontSize: '0.88rem',
    color: '#334155',
    lineHeight: 1.5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  activityTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#94A3B8',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  /* Quick Actions */
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  quickAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  quickActionIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickActionTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: '4px',
  },
  quickActionDesc: {
    fontSize: '0.8rem',
    color: '#94A3B8',
    lineHeight: 1.4,
  },

  /* Notifications */
  notifBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20px',
    height: '20px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 700,
    marginLeft: '8px',
    padding: '0 6px',
  },
  notifList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  notifItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  notifIconWrap: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  notifContent: {
    flex: 1,
    minWidth: 0,
  },
  notifHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
    gap: '12px',
  },
  notifTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#0F172A',
  },
  notifTime: {
    fontSize: '0.75rem',
    color: '#94A3B8',
    whiteSpace: 'nowrap',
  },
  notifMessage: {
    fontSize: '0.83rem',
    color: '#64748B',
    lineHeight: 1.5,
  },
  notifDismiss: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94A3B8',
    fontSize: '1.2rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.2s ease',
    marginTop: '2px',
  },
}

/* ===== Responsive CSS (injected once) ===== */

const dashboardStyleEl = document.createElement('style')
dashboardStyleEl.textContent = `
  @media (max-width: 1024px) {
    .dashboard-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .dashboard-charts-grid {
      grid-template-columns: 1fr !important;
    }
    .dashboard-quick-grid {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 768px) {
    .dashboard-stats-grid {
      grid-template-columns: 1fr !important;
    }
    .dashboard-charts-grid {
      grid-template-columns: 1fr !important;
    }
    .dashboard-quick-grid {
      grid-template-columns: 1fr !important;
    }
  }

  .dashboard-content .glass-card:hover {
    transform: translateY(-2px);
  }
`
if (!document.querySelector('[data-learnops-dashboard-styles]')) {
  dashboardStyleEl.setAttribute('data-learnops-dashboard-styles', '')
  document.head.appendChild(dashboardStyleEl)
}
