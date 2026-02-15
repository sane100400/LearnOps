import { useState } from 'react'
import {
  Trophy,
  Medal,
  Crown,
  Star,
  Flame,
  Shield,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'

/* ===== Mock Data ===== */

const top3 = [
  {
    rank: 1,
    name: '김보안',
    score: 12450,
    level: 'Elite',
    trend: 'up',
    trendValue: '+3',
  },
  {
    rank: 2,
    name: '이해커',
    score: 11200,
    level: 'Advanced',
    trend: 'up',
    trendValue: '+1',
  },
  {
    rank: 3,
    name: '박시큐',
    score: 10800,
    level: 'Advanced',
    trend: 'down',
    trendValue: '-1',
  },
]

const leaderboardData = [
  { rank: 4, name: '최방어', score: 10200, level: 'Advanced', change: 2, badges: 8 },
  { rank: 5, name: '정관제', score: 9800, level: 'Advanced', change: -1, badges: 7 },
  { rank: 6, name: '한네트', score: 9450, level: 'Intermediate', change: 0, badges: 6 },
  { rank: 7, name: '나', score: 9100, level: 'Intermediate', change: 3, badges: 5, isMe: true },
  { rank: 8, name: '윤분석', score: 8750, level: 'Intermediate', change: -2, badges: 5 },
  { rank: 9, name: '송포렌', score: 8400, level: 'Intermediate', change: 1, badges: 4 },
  { rank: 10, name: '강암호', score: 8100, level: 'Intermediate', change: 0, badges: 4 },
  { rank: 11, name: '오취약', score: 7800, level: 'Intermediate', change: -1, badges: 3 },
  { rank: 12, name: '임서버', score: 7500, level: 'Beginner', change: 2, badges: 3 },
  { rank: 13, name: '배리눅', score: 7200, level: 'Beginner', change: 0, badges: 3 },
  { rank: 14, name: '조웹앱', score: 6900, level: 'Beginner', change: -3, badges: 2 },
  { rank: 15, name: '류디비', score: 6600, level: 'Beginner', change: 1, badges: 2 },
  { rank: 16, name: '서클라', score: 6300, level: 'Beginner', change: 0, badges: 2 },
  { rank: 17, name: '문로그', score: 6000, level: 'Beginner', change: -1, badges: 1 },
  { rank: 18, name: '장패킷', score: 5700, level: 'Beginner', change: 2, badges: 1 },
  { rank: 19, name: '권인프', score: 5400, level: 'Beginner', change: 0, badges: 1 },
  { rank: 20, name: '홍보안', score: 5100, level: 'Beginner', change: -2, badges: 1 },
]

const badgesData = [
  {
    emoji: '\u{1F6E1}\uFE0F',
    title: '첫 실습 완료',
    description: '첫 번째 실습을 성공적으로 완료했습니다.',
    earned: true,
  },
  {
    emoji: '\u26A1',
    title: '스피드러너',
    description: '제한 시간의 50% 이내에 실습을 완료했습니다.',
    earned: true,
  },
  {
    emoji: '\u{1F525}',
    title: '7일 연속 학습',
    description: '7일 연속으로 학습 활동을 기록했습니다.',
    earned: true,
  },
  {
    emoji: '\u{1F3C6}',
    title: 'Top 10 진입',
    description: '전체 랭킹 Top 10에 진입했습니다.',
    earned: true,
  },
  {
    emoji: '\u2B50',
    title: '완벽한 점수',
    description: '실습에서 만점을 획득했습니다.',
    earned: false,
  },
  {
    emoji: '\u{1F3AF}',
    title: '10개 실습 완료',
    description: '총 10개의 실습을 완료했습니다.',
    earned: false,
  },
  {
    emoji: '\u{1F451}',
    title: '그룹 1등',
    description: '소속 그룹에서 1등을 달성했습니다.',
    earned: false,
  },
  {
    emoji: '\u{1F48E}',
    title: '마스터 레벨 달성',
    description: '마스터 레벨에 도달했습니다.',
    earned: false,
  },
  {
    emoji: '\u{1F31F}',
    title: '올라운더',
    description: '모든 카테고리에서 실습을 완료했습니다.',
    earned: false,
  },
]

/* ===== Helper ===== */

function getLevelColor(level) {
  switch (level) {
    case 'Elite':
      return { bg: 'rgba(79, 70, 229, 0.15)', color: '#818CF8' }
    case 'Advanced':
      return { bg: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE' }
    case 'Intermediate':
      return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }
    case 'Beginner':
      return { bg: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }
    default:
      return { bg: 'rgba(148, 163, 184, 0.15)', color: '#94A3B8' }
  }
}

/* ===== Ranking Component ===== */

export default function Ranking() {
  const [activeTab, setActiveTab] = useState('all')
  const [period, setPeriod] = useState('weekly')

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="dashboard-content">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>
              <Trophy size={28} style={{ marginRight: '12px', verticalAlign: 'middle', color: '#F59E0B' }} />
              랭킹
            </h1>
            <p style={styles.subtitle}>실력을 증명하고 최고의 자리에 도전하세요.</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterBar}>
          <div style={styles.tabGroup}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'all' ? styles.tabBtnActive : {}),
              }}
            >
              전체 랭킹
              {activeTab === 'all' && <div style={styles.tabIndicator} />}
            </button>
            <button
              onClick={() => setActiveTab('group')}
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'group' ? styles.tabBtnActive : {}),
              }}
            >
              그룹 내 랭킹
              {activeTab === 'group' && <div style={styles.tabIndicator} />}
            </button>
          </div>

          <div style={styles.periodGroup}>
            {[
              { key: 'weekly', label: '주간' },
              { key: 'monthly', label: '월간' },
              { key: 'all-time', label: '전체' },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  ...styles.periodBtn,
                  ...(period === p.key ? styles.periodBtnActive : {}),
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div style={styles.podiumSection} className="ranking-podium">
          {/* Rank 2 - Left */}
          <div style={styles.podiumCardWrap} className="ranking-podium-card">
            <Card style={{ padding: '28px 24px', textAlign: 'center', position: 'relative', overflow: 'visible' }}>
              <div style={styles.rankBadge2}>2</div>
              <div style={{ marginBottom: '16px' }}>
                <Medal size={36} style={{ color: '#C0C0C0' }} />
              </div>
              <div style={styles.podiumAvatar}>
                {top3[1].name.charAt(0)}
              </div>
              <h3 style={styles.podiumName}>{top3[1].name}</h3>
              <div style={styles.podiumScore}>
                {top3[1].score.toLocaleString()}
                <span style={styles.podiumScoreUnit}> pts</span>
              </div>
              <div
                style={{
                  ...styles.levelBadge,
                  background: getLevelColor(top3[1].level).bg,
                  color: getLevelColor(top3[1].level).color,
                }}
              >
                {top3[1].level}
              </div>
              <div style={styles.trendUp}>
                <TrendingUp size={14} />
                <span>{top3[1].trendValue}</span>
              </div>
            </Card>
          </div>

          {/* Rank 1 - Center (larger) */}
          <div style={{ ...styles.podiumCardWrap, ...styles.podiumCardCenter }} className="ranking-podium-card ranking-podium-center">
            <Card style={{ padding: '36px 28px', textAlign: 'center', position: 'relative', overflow: 'visible', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
              <div style={styles.crownWrap}>
                <Crown size={32} style={{ color: '#FFD700' }} />
              </div>
              <div style={styles.rankBadge1}>1</div>
              <div style={{ ...styles.podiumAvatar, ...styles.podiumAvatarLarge }}>
                {top3[0].name.charAt(0)}
              </div>
              <h3 style={{ ...styles.podiumName, fontSize: '1.15rem' }}>{top3[0].name}</h3>
              <div style={{ ...styles.podiumScore, fontSize: '1.6rem' }}>
                {top3[0].score.toLocaleString()}
                <span style={styles.podiumScoreUnit}> pts</span>
              </div>
              <div
                style={{
                  ...styles.levelBadge,
                  background: getLevelColor(top3[0].level).bg,
                  color: getLevelColor(top3[0].level).color,
                }}
              >
                {top3[0].level}
              </div>
              <div style={styles.trendUp}>
                <TrendingUp size={14} />
                <span>{top3[0].trendValue}</span>
              </div>
            </Card>
          </div>

          {/* Rank 3 - Right */}
          <div style={styles.podiumCardWrap} className="ranking-podium-card">
            <Card style={{ padding: '28px 24px', textAlign: 'center', position: 'relative', overflow: 'visible' }}>
              <div style={styles.rankBadge3}>3</div>
              <div style={{ marginBottom: '16px' }}>
                <Medal size={36} style={{ color: '#CD7F32' }} />
              </div>
              <div style={styles.podiumAvatar}>
                {top3[2].name.charAt(0)}
              </div>
              <h3 style={styles.podiumName}>{top3[2].name}</h3>
              <div style={styles.podiumScore}>
                {top3[2].score.toLocaleString()}
                <span style={styles.podiumScoreUnit}> pts</span>
              </div>
              <div
                style={{
                  ...styles.levelBadge,
                  background: getLevelColor(top3[2].level).bg,
                  color: getLevelColor(top3[2].level).color,
                }}
              >
                {top3[2].level}
              </div>
              <div style={styles.trendDown}>
                <TrendingDown size={14} />
                <span>{top3[2].trendValue}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={styles.sectionHeading}>
            <Award size={20} style={{ marginRight: '8px' }} />
            전체 순위표
          </h3>
          <Card style={{ padding: 0, overflow: 'hidden' }} hover={false}>
            <div style={styles.tableWrap} className="ranking-table-wrap">
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, width: '80px' }}>순위</th>
                    <th style={styles.th}>이름</th>
                    <th style={{ ...styles.th, width: '120px' }}>레벨</th>
                    <th style={{ ...styles.th, width: '120px', textAlign: 'right' }}>점수</th>
                    <th style={{ ...styles.th, width: '80px', textAlign: 'center' }}>변동</th>
                    <th style={{ ...styles.th, width: '80px', textAlign: 'center' }}>뱃지</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user, index) => (
                    <tr
                      key={user.rank}
                      style={{
                        ...styles.tr,
                        background: user.isMe
                          ? 'rgba(79, 70, 229, 0.06)'
                          : index % 2 === 0
                            ? '#FFFFFF'
                            : '#F8FAFC',
                        ...(user.isMe ? styles.trMe : {}),
                      }}
                      className="ranking-table-row"
                    >
                      <td style={styles.td}>
                        <span style={styles.rankNum}>{user.rank}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.nameCell}>
                          <div style={styles.tableAvatar}>
                            {user.name === '나' ? '나' : user.name.charAt(0)}
                          </div>
                          <span style={{ color: '#0F172A', fontWeight: 600 }}>
                            {user.name}
                          </span>
                          {user.isMe && (
                            <span style={styles.meBadge}>나</span>
                          )}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.levelBadgeSmall,
                            background: getLevelColor(user.level).bg,
                            color: getLevelColor(user.level).color,
                          }}
                        >
                          {user.level}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', color: '#0F172A', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        {user.score.toLocaleString()}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        {user.change > 0 ? (
                          <span style={styles.changeUp}>
                            <TrendingUp size={14} />
                            <span>+{user.change}</span>
                          </span>
                        ) : user.change < 0 ? (
                          <span style={styles.changeDown}>
                            <TrendingDown size={14} />
                            <span>{user.change}</span>
                          </span>
                        ) : (
                          <span style={styles.changeSame}>
                            <Minus size={14} />
                          </span>
                        )}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={styles.badgeCount}>
                          <Star size={14} style={{ color: '#F59E0B' }} />
                          {user.badges}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Badges & Achievements */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={styles.sectionHeading}>
            <Shield size={20} style={{ marginRight: '8px' }} />
            뱃지 & 업적
          </h3>
          <div style={styles.badgesGrid} className="ranking-badges-grid">
            {badgesData.map((badge, i) => (
              <Card
                key={i}
                style={{
                  padding: '24px',
                  position: 'relative',
                  opacity: badge.earned ? 1 : 0.5,
                  filter: badge.earned ? 'none' : 'grayscale(100%)',
                }}
                hover={badge.earned}
              >
                {badge.earned && <div style={styles.earnedGlow} />}
                <div style={styles.badgeCardInner}>
                  <div
                    style={{
                      ...styles.badgeIcon,
                      background: badge.earned
                        ? 'rgba(79, 70, 229, 0.12)'
                        : 'rgba(148, 163, 184, 0.08)',
                      boxShadow: badge.earned
                        ? '0 0 20px rgba(79, 70, 229, 0.15)'
                        : 'none',
                    }}
                  >
                    <span style={{ fontSize: '1.6rem' }}>{badge.emoji}</span>
                  </div>
                  <div style={styles.badgeInfo}>
                    <h4 style={styles.badgeTitle}>{badge.title}</h4>
                    <p style={styles.badgeDesc}>{badge.description}</p>
                  </div>
                  {badge.earned ? (
                    <div style={styles.earnedTag}>
                      <Star size={12} />
                      <span>획득</span>
                    </div>
                  ) : (
                    <div style={styles.lockedTag}>
                      <Shield size={12} />
                      <span>잠김</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

/* ===== Styles ===== */

const styles = {
  /* Header */
  header: {
    marginBottom: '32px',
  },
  pageTitle: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#0F172A',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  subtitle: {
    color: '#64748B',
    fontSize: '0.95rem',
  },

  /* Filter Bar */
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  tabGroup: {
    display: 'flex',
    gap: '4px',
    background: '#F8FAFC',
    borderRadius: '12px',
    padding: '4px',
    border: '1px solid #E2E8F0',
  },
  tabBtn: {
    position: 'relative',
    padding: '10px 24px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: '#64748B',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabBtnActive: {
    color: '#0F172A',
    background: 'rgba(79, 70, 229, 0.1)',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    height: '3px',
    borderRadius: '3px',
    background: 'linear-gradient(90deg, #4F46E5, #06B6D4)',
  },
  periodGroup: {
    display: 'flex',
    gap: '4px',
    background: '#F8FAFC',
    borderRadius: '10px',
    padding: '4px',
    border: '1px solid #E2E8F0',
  },
  periodBtn: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#64748B',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  periodBtnActive: {
    color: '#0F172A',
    background: 'rgba(79, 70, 229, 0.1)',
  },

  /* Podium */
  podiumSection: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '40px',
    padding: '20px 0',
  },
  podiumCardWrap: {
    flex: '0 1 240px',
    maxWidth: '240px',
  },
  podiumCardCenter: {
    flex: '0 1 280px',
    maxWidth: '280px',
    marginBottom: '20px',
  },
  crownWrap: {
    position: 'absolute',
    top: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#FFFFFF',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(255, 215, 0, 0.4)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  rankBadge1: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    color: '#0F172A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '0.9rem',
  },
  rankBadge2: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)',
    color: '#0F172A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '0.8rem',
  },
  rankBadge3: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #CD7F32, #A0522D)',
    color: '#0F172A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '0.8rem',
  },
  podiumAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: 700,
    margin: '0 auto 12px',
  },
  podiumAvatarLarge: {
    width: '68px',
    height: '68px',
    fontSize: '1.4rem',
  },
  podiumName: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: '6px',
  },
  podiumScore: {
    fontSize: '1.35rem',
    fontWeight: 800,
    color: '#0F172A',
    marginBottom: '10px',
    fontVariantNumeric: 'tabular-nums',
  },
  podiumScoreUnit: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: '#64748B',
  },
  levelBadge: {
    display: 'inline-block',
    padding: '4px 14px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 700,
    marginBottom: '10px',
  },
  trendUp: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#10B981',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  trendDown: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#EF4444',
    fontSize: '0.8rem',
    fontWeight: 600,
  },

  /* Section Heading */
  sectionHeading: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  },

  /* Table */
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  },
  th: {
    padding: '14px 20px',
    textAlign: 'left',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #E2E8F0',
    background: '#F8FAFC',
  },
  tr: {
    borderBottom: '1px solid #E2E8F0',
    transition: 'background 0.15s ease',
  },
  trMe: {
    background: 'rgba(79, 70, 229, 0.06)',
    borderLeft: '3px solid #4F46E5',
  },
  td: {
    padding: '14px 20px',
    fontSize: '0.88rem',
    color: '#64748B',
    verticalAlign: 'middle',
  },
  rankNum: {
    fontWeight: 800,
    color: '#64748B',
    fontSize: '0.95rem',
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  tableAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  meBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 8px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 700,
  },
  levelBadgeSmall: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    fontWeight: 700,
  },
  changeUp: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    color: '#10B981',
    fontSize: '0.82rem',
    fontWeight: 600,
  },
  changeDown: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    color: '#EF4444',
    fontSize: '0.82rem',
    fontWeight: 600,
  },
  changeSame: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#64748B',
    fontSize: '0.82rem',
  },
  badgeCount: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#0F172A',
    fontWeight: 600,
    fontSize: '0.85rem',
  },

  /* Badges Grid */
  badgesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  badgeCardInner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    position: 'relative',
    zIndex: 1,
  },
  badgeIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  badgeInfo: {
    flex: 1,
    minWidth: 0,
  },
  badgeTitle: {
    fontSize: '0.92rem',
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: '4px',
  },
  badgeDesc: {
    fontSize: '0.78rem',
    color: '#64748B',
    lineHeight: 1.5,
  },
  earnedTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 10px',
    borderRadius: '6px',
    background: 'rgba(16, 185, 129, 0.15)',
    color: '#10B981',
    fontSize: '0.7rem',
    fontWeight: 700,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  lockedTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 10px',
    borderRadius: '6px',
    background: 'rgba(148, 163, 184, 0.1)',
    color: '#64748B',
    fontSize: '0.7rem',
    fontWeight: 700,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  earnedGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '16px',
    background: 'radial-gradient(ellipse at top left, rgba(79, 70, 229, 0.06), transparent 60%)',
    pointerEvents: 'none',
  },
}

/* ===== Responsive CSS (injected once) ===== */

const rankingStyleEl = document.createElement('style')
rankingStyleEl.textContent = `
  .ranking-table-row:hover {
    background: #F1F5F9 !important;
  }

  @media (max-width: 1024px) {
    .ranking-badges-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }

  @media (max-width: 768px) {
    .ranking-podium {
      flex-direction: column !important;
      align-items: center !important;
    }
    .ranking-podium-card {
      flex: 0 1 auto !important;
      max-width: 320px !important;
      width: 100% !important;
    }
    .ranking-podium-center {
      order: -1 !important;
      margin-bottom: 0 !important;
    }
    .ranking-table-wrap {
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch;
    }
    .ranking-badges-grid {
      grid-template-columns: 1fr !important;
    }
  }
`
if (!document.querySelector('[data-learnops-ranking-styles]')) {
  rankingStyleEl.setAttribute('data-learnops-ranking-styles', '')
  document.head.appendChild(rankingStyleEl)
}
