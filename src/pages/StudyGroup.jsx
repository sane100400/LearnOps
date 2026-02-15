import { useState } from 'react'
import {
  Users,
  MessageSquare,
  Target,
  Calendar,
  Crown,
  Send,
  Clock,
  ChevronRight,
  Sparkles,
  UserPlus,
  BarChart3,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'

/* ===== Mock Data ===== */

const members = [
  {
    name: '김보안',
    initials: '김',
    role: '리더',
    level: '고급',
    levelColor: '#EF4444',
    tags: ['웹 보안', '포렌식'],
    tagColors: ['#4F46E5', '#F59E0B'],
    progress: 72,
    gradient: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    isLeader: true,
  },
  {
    name: '이해커',
    initials: '이',
    role: '멤버',
    level: '중급',
    levelColor: '#F59E0B',
    tags: ['네트워크', '시스템 보안'],
    tagColors: ['#06B6D4', '#10B981'],
    progress: 58,
    gradient: 'linear-gradient(135deg, #06B6D4, #10B981)',
    isLeader: false,
  },
  {
    name: '박시큐',
    initials: '박',
    role: '멤버',
    level: '중급',
    levelColor: '#F59E0B',
    tags: ['암호학', '웹 보안'],
    tagColors: ['#8B5CF6', '#4F46E5'],
    progress: 45,
    gradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    isLeader: false,
  },
  {
    name: '최방어',
    initials: '최',
    role: '멤버',
    level: '초급',
    levelColor: '#10B981',
    tags: ['네트워크', '클라우드'],
    tagColors: ['#06B6D4', '#3B82F6'],
    progress: 32,
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    isLeader: false,
  },
  {
    name: '정분석',
    initials: '정',
    role: '멤버',
    level: '중급',
    levelColor: '#F59E0B',
    tags: ['포렌식', '시스템 보안'],
    tagColors: ['#F59E0B', '#10B981'],
    progress: 61,
    gradient: 'linear-gradient(135deg, #10B981, #06B6D4)',
    isLeader: false,
  },
]

const weeklyProgress = [
  { name: '김보안', task: 'SQL Injection 실습 완료', done: true },
  { name: '이해커', task: '네트워크 스니핑 실습 완료', done: true },
  { name: '박시큐', task: 'XSS 공격 실습 진행 중', done: false },
  { name: '최방어', task: '방화벽 설정 실습 시작', done: false },
  { name: '정분석', task: '로그 분석 실습 완료', done: true },
]

const chatMessages = [
  {
    name: '김보안',
    initials: '김',
    gradient: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    message: '이번 주 SQL Injection 실습 다들 시작했나요?',
    time: '오후 2:30',
  },
  {
    name: '이해커',
    initials: '이',
    gradient: 'linear-gradient(135deg, #06B6D4, #10B981)',
    message: '저는 어제 완료했습니다! 힌트 없이 풀었어요 \uD83D\uDCAA',
    time: '오후 2:35',
  },
  {
    name: '박시큐',
    initials: '박',
    gradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    message: '저도 거의 다 했는데 마지막 단계에서 막혔어요...',
    time: '오후 2:42',
  },
  {
    name: '김보안',
    initials: '김',
    gradient: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    message: '마지막 단계는 UNION 기반으로 접근하면 됩니다',
    time: '오후 2:45',
  },
  {
    name: '정분석',
    initials: '정',
    gradient: 'linear-gradient(135deg, #10B981, #06B6D4)',
    message: '오 감사합니다! 저도 해봐야겠네요',
    time: '오후 2:48',
  },
]

const discoverGroups = [
  {
    name: '웹해킹 스쿼드',
    tags: ['웹 보안', 'OWASP'],
    tagColors: ['#4F46E5', '#EF4444'],
    members: '4/6',
    level: '중급',
    levelColor: '#F59E0B',
    description: 'OWASP Top 10 기반 웹 취약점 실습을 함께 진행하는 그룹입니다.',
    gradient: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
  },
  {
    name: '네트워크 디펜더',
    tags: ['네트워크 보안', 'IDS/IPS'],
    tagColors: ['#06B6D4', '#10B981'],
    members: '3/5',
    level: '초급',
    levelColor: '#10B981',
    description: '네트워크 보안의 기초부터 IDS/IPS 구축까지 단계별로 학습합니다.',
    gradient: 'linear-gradient(135deg, #06B6D4, #10B981)',
  },
  {
    name: '포렌식 탐정단',
    tags: ['디지털 포렌식', '로그 분석'],
    tagColors: ['#F59E0B', '#8B5CF6'],
    members: '5/6',
    level: '고급',
    levelColor: '#EF4444',
    description: '디지털 포렌식 기법과 실전 로그 분석을 심도있게 다룹니다.',
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
  },
  {
    name: '클라우드 가디언즈',
    tags: ['AWS 보안', '컨테이너'],
    tagColors: ['#3B82F6', '#EC4899'],
    members: '2/5',
    level: '중급',
    levelColor: '#F59E0B',
    description: 'AWS 환경에서의 보안 설정과 컨테이너 보안을 실습합니다.',
    gradient: 'linear-gradient(135deg, #3B82F6, #EC4899)',
  },
]

/* ===== Component ===== */

export default function StudyGroup() {
  const [activeTab, setActiveTab] = useState('my-group')
  const [chatInput, setChatInput] = useState('')

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="dashboard-content">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>스터디 그룹</h1>
            <p style={styles.subtitle}>함께 학습하고 성장하는 공간입니다.</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.dateBadge}>
              <Clock size={14} />
              <span>
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabBar}>
          <button
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'my-group' ? styles.tabBtnActive : {}),
            }}
            onClick={() => setActiveTab('my-group')}
          >
            <Users size={16} />
            내 그룹
          </button>
          <button
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'discover' ? styles.tabBtnActive : {}),
            }}
            onClick={() => setActiveTab('discover')}
          >
            <UserPlus size={16} />
            그룹 찾기
          </button>
        </div>

        {/* Tab 1: My Group */}
        {activeTab === 'my-group' && (
          <div>
            {/* Group Header Card */}
            <Card style={{ padding: '28px', marginBottom: '24px' }} hover={false}>
              <div style={styles.groupHeader}>
                <div style={styles.groupHeaderLeft}>
                  <div style={styles.groupTitleRow}>
                    <Sparkles size={22} style={{ color: '#F59E0B' }} />
                    <h2 style={styles.groupName}>보안 마스터즈</h2>
                    <span style={styles.aiBadge}>AI 자동 매칭</span>
                  </div>
                  <div style={styles.groupMeta}>
                    <span style={styles.metaItem}>
                      <Users size={14} />
                      5/6명
                    </span>
                    <span style={styles.metaItem}>
                      <Calendar size={14} />
                      2026.01.15
                    </span>
                  </div>
                </div>
                <div style={styles.groupHeaderRight}>
                  <div style={styles.progressLabel}>
                    <span style={{ color: '#64748B', fontSize: '0.85rem' }}>그룹 진행률</span>
                    <span style={{ color: '#0F172A', fontWeight: 700, fontSize: '1.1rem' }}>45%</span>
                  </div>
                  <div style={styles.progressBarBg}>
                    <div
                      style={{
                        ...styles.progressBarFill,
                        width: '45%',
                        background: 'linear-gradient(90deg, #4F46E5, #06B6D4)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Members Section */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={styles.sectionHeading}>
                <Users size={18} style={{ marginRight: '8px' }} />
                그룹 멤버
              </h3>
              <div style={styles.membersGrid} className="studygroup-members-grid">
                {members.map((member, i) => (
                  <Card key={i} style={{ padding: '24px' }}>
                    <div style={styles.memberCard}>
                      <div style={styles.memberTop}>
                        <div
                          style={{
                            ...styles.memberAvatar,
                            background: member.gradient,
                          }}
                        >
                          {member.initials}
                        </div>
                        <div style={styles.memberInfo}>
                          <div style={styles.memberNameRow}>
                            <span style={styles.memberName}>{member.name}</span>
                            {member.isLeader && (
                              <Crown size={14} style={{ color: '#F59E0B' }} />
                            )}
                          </div>
                          <div style={styles.memberRoleLine}>
                            <span style={styles.memberRole}>{member.role}</span>
                            <span
                              style={{
                                ...styles.levelBadge,
                                background: `${member.levelColor}20`,
                                color: member.levelColor,
                              }}
                            >
                              {member.level}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={styles.tagRow}>
                        {member.tags.map((tag, j) => (
                          <span
                            key={j}
                            style={{
                              ...styles.tag,
                              background: '#F1F5F9',
                              color: '#4F46E5',
                              border: '1px solid #E2E8F0',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div style={styles.memberProgressWrap}>
                        <div style={styles.memberProgressBar}>
                          <div
                            style={{
                              ...styles.memberProgressFill,
                              width: `${member.progress}%`,
                              background:
                                member.progress >= 70
                                  ? 'linear-gradient(90deg, #10B981, #06B6D4)'
                                  : member.progress >= 50
                                  ? 'linear-gradient(90deg, #06B6D4, #4F46E5)'
                                  : member.progress >= 40
                                  ? 'linear-gradient(90deg, #F59E0B, #EF8C00)'
                                  : 'linear-gradient(90deg, #EF4444, #DC2626)',
                            }}
                          />
                        </div>
                        <span style={styles.memberProgressText}>{member.progress}%</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Group Progress Section */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={styles.sectionHeading}>
                <BarChart3 size={18} style={{ marginRight: '8px' }} />
                그룹 진도 현황
              </h3>
              <Card style={{ padding: '28px' }} hover={false}>
                <div style={styles.weeklyTitle}>
                  <Target size={16} style={{ color: '#06B6D4' }} />
                  <span style={{ color: '#0F172A', fontWeight: 600, fontSize: '0.95rem' }}>
                    이번 주 학습 현황
                  </span>
                </div>
                <div style={styles.weeklyList}>
                  {weeklyProgress.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.weeklyItem,
                        borderBottom:
                          i < weeklyProgress.length - 1
                            ? '1px solid #E2E8F0'
                            : 'none',
                      }}
                    >
                      <div style={styles.weeklyLeft}>
                        <div
                          style={{
                            ...styles.weeklyDot,
                            background: item.done ? '#10B981' : '#F59E0B',
                          }}
                        />
                        <span style={{ color: '#0F172A', fontWeight: 600, fontSize: '0.88rem' }}>
                          {item.name}
                        </span>
                      </div>
                      <span style={{ color: '#64748B', fontSize: '0.85rem', flex: 1 }}>
                        {item.task}
                      </span>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: item.done
                            ? 'rgba(16, 185, 129, 0.12)'
                            : 'rgba(245, 158, 11, 0.12)',
                          color: item.done ? '#10B981' : '#F59E0B',
                        }}
                      >
                        {item.done ? '완료' : '진행 중'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Group vs Individual Progress */}
                <div style={styles.comparisonSection}>
                  <div style={styles.comparisonRow}>
                    <span style={{ color: '#64748B', fontSize: '0.85rem', minWidth: '80px' }}>
                      그룹 평균
                    </span>
                    <div style={styles.comparisonBarBg}>
                      <div
                        style={{
                          ...styles.comparisonBarFill,
                          width: '45%',
                          background: 'linear-gradient(90deg, #4F46E5, #06B6D4)',
                        }}
                      />
                    </div>
                    <span style={{ color: '#0F172A', fontWeight: 700, fontSize: '0.85rem', minWidth: '36px', textAlign: 'right' }}>
                      45%
                    </span>
                  </div>
                  <div style={styles.comparisonRow}>
                    <span style={{ color: '#64748B', fontSize: '0.85rem', minWidth: '80px' }}>
                      개인 최고
                    </span>
                    <div style={styles.comparisonBarBg}>
                      <div
                        style={{
                          ...styles.comparisonBarFill,
                          width: '72%',
                          background: 'linear-gradient(90deg, #10B981, #06B6D4)',
                        }}
                      />
                    </div>
                    <span style={{ color: '#0F172A', fontWeight: 700, fontSize: '0.85rem', minWidth: '36px', textAlign: 'right' }}>
                      72%
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Chat Section */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={styles.sectionHeading}>
                <MessageSquare size={18} style={{ marginRight: '8px' }} />
                그룹 채팅
              </h3>
              <Card style={{ padding: '0', overflow: 'hidden' }} hover={false}>
                <div style={styles.chatArea} className="studygroup-chat-area">
                  {chatMessages.map((msg, i) => (
                    <div key={i} style={styles.chatMessage}>
                      <div
                        style={{
                          ...styles.chatAvatar,
                          background: msg.gradient,
                        }}
                      >
                        {msg.initials}
                      </div>
                      <div style={styles.chatBubble}>
                        <div style={styles.chatBubbleTop}>
                          <span style={styles.chatName}>{msg.name}</span>
                          <span style={styles.chatTime}>
                            <Clock size={11} />
                            {msg.time}
                          </span>
                        </div>
                        <p style={styles.chatText}>{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={styles.chatInputWrap}>
                  <input
                    type="text"
                    placeholder="메시지를 입력하세요..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    style={styles.chatInput}
                  />
                  <Button
                    size="small"
                    style={{
                      borderRadius: '10px',
                      padding: '10px 16px',
                      flexShrink: 0,
                    }}
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Discover */}
        {activeTab === 'discover' && (
          <div>
            <div style={styles.discoverGrid} className="studygroup-discover-grid">
              {discoverGroups.map((group, i) => (
                <Card key={i} style={{ padding: '28px' }}>
                  <div style={styles.discoverCard}>
                    <div style={styles.discoverTop}>
                      <div
                        style={{
                          ...styles.discoverIcon,
                          background: group.gradient,
                        }}
                      >
                        <Users size={22} style={{ color: '#fff' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={styles.discoverName}>{group.name}</h3>
                        <div style={styles.discoverMeta}>
                          <span style={styles.metaItem}>
                            <Users size={13} />
                            {group.members}명
                          </span>
                          <span
                            style={{
                              ...styles.levelBadge,
                              background: `${group.levelColor}20`,
                              color: group.levelColor,
                            }}
                          >
                            {group.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.tagRow}>
                      {group.tags.map((tag, j) => (
                        <span
                          key={j}
                          style={{
                            ...styles.tag,
                            background: '#F1F5F9',
                            color: '#4F46E5',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p style={styles.discoverDesc}>{group.description}</p>

                    <Button
                      style={{
                        width: '100%',
                        borderRadius: '10px',
                        marginTop: '8px',
                      }}
                    >
                      <UserPlus size={16} />
                      참여하기
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
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
  subtitle: {
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

  /* Tabs */
  tabBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '28px',
    padding: '4px',
    background: '#F1F5F9',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    width: 'fit-content',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#64748B',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabBtnActive: {
    color: '#FFFFFF',
    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(6, 182, 212, 0.8))',
    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.2)',
  },

  /* Group Header */
  groupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
  },
  groupHeaderLeft: {
    flex: 1,
    minWidth: '240px',
  },
  groupTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  groupName: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#0F172A',
  },
  aiBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#06B6D4',
    background: 'rgba(6, 182, 212, 0.12)',
    border: '1px solid rgba(6, 182, 212, 0.25)',
  },
  groupMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#64748B',
    fontSize: '0.85rem',
  },
  groupHeaderRight: {
    minWidth: '200px',
    maxWidth: '300px',
    flex: '0 1 300px',
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  progressBarBg: {
    width: '100%',
    height: '10px',
    borderRadius: '5px',
    background: '#E2E8F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '5px',
    transition: 'width 0.6s ease',
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

  /* Members Grid */
  membersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  memberCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  memberTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  memberAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 800,
    flexShrink: 0,
  },
  memberInfo: {
    flex: 1,
    minWidth: 0,
  },
  memberNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '4px',
  },
  memberName: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#0F172A',
  },
  memberRoleLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  memberRole: {
    fontSize: '0.8rem',
    color: '#64748B',
  },
  levelBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.7rem',
    fontWeight: 700,
  },
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  tag: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  memberProgressWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  memberProgressBar: {
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    background: '#E2E8F0',
    overflow: 'hidden',
  },
  memberProgressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.6s ease',
  },
  memberProgressText: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#0F172A',
    minWidth: '32px',
    textAlign: 'right',
  },

  /* Weekly Progress */
  weeklyTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  weeklyList: {
    display: 'flex',
    flexDirection: 'column',
  },
  weeklyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 0',
    flexWrap: 'wrap',
  },
  weeklyLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: '100px',
  },
  weeklyDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
    flexShrink: 0,
  },

  /* Comparison bars */
  comparisonSection: {
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  comparisonRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  comparisonBarBg: {
    flex: 1,
    height: '8px',
    borderRadius: '4px',
    background: '#E2E8F0',
    overflow: 'hidden',
  },
  comparisonBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.6s ease',
  },

  /* Chat */
  chatArea: {
    padding: '24px',
    maxHeight: '420px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  chatMessage: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  chatAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  chatBubble: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    background: '#F1F5F9',
    border: '1px solid #E2E8F0',
  },
  chatBubbleTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
    gap: '8px',
  },
  chatName: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#0F172A',
  },
  chatTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.72rem',
    color: '#64748B',
    flexShrink: 0,
  },
  chatText: {
    fontSize: '0.88rem',
    color: '#334155',
    lineHeight: 1.6,
  },
  chatInputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 24px',
    borderTop: '1px solid #E2E8F0',
    background: '#F8FAFC',
  },
  chatInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '10px',
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    color: '#0F172A',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },

  /* Discover Grid */
  discoverGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  discoverCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  discoverTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  discoverIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  discoverName: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#0F172A',
    marginBottom: '6px',
  },
  discoverMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  discoverDesc: {
    fontSize: '0.88rem',
    color: '#64748B',
    lineHeight: 1.6,
  },
}

/* ===== Responsive CSS (injected once) ===== */

const studyGroupStyleEl = document.createElement('style')
studyGroupStyleEl.textContent = `
  @media (max-width: 1024px) {
    .studygroup-members-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .studygroup-discover-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }

  @media (max-width: 768px) {
    .studygroup-members-grid {
      grid-template-columns: 1fr !important;
    }
    .studygroup-discover-grid {
      grid-template-columns: 1fr !important;
    }
    .studygroup-chat-area {
      max-height: 320px !important;
    }
  }
`
if (!document.querySelector('[data-learnops-studygroup-styles]')) {
  studyGroupStyleEl.setAttribute('data-learnops-studygroup-styles', '')
  document.head.appendChild(studyGroupStyleEl)
}
