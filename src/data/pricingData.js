/* =========================================================
   Pricing Data — 2-Track Model
   Track 1: 개인 (B2C)
   Track 2: 팀/기관 (B2B, 인당 과금)
   ========================================================= */

export const individualPlans = [
  {
    id: 'starter',
    name: 'Starter',
    desc: '보안 학습의 첫 걸음',
    price: { monthly: 0, yearly: 0 },
    cta: '무료로 시작',
    ctaLink: '/register',
    highlighted: false,
    features: [
      '레벨테스트 월 1회',
      'AI 커리큘럼 미리보기',
      '실습 환경 일 30분',
      '워게임 기초 5문제',
      '랭킹 조회',
      '커뮤니티 포럼 접근',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: '본격적인 실력 향상을 위한 플랜',
    price: { monthly: 12900, yearly: 10300 },
    cta: '시작하기',
    ctaLink: '/register',
    highlighted: true,
    badge: '인기',
    features: [
      '무제한 레벨테스트',
      'AI 맞춤 커리큘럼 무제한',
      '실습 환경 무제한',
      '전체 워게임 라이브러리',
      '랭킹 참여 + 뱃지',
      '월간 학습 리포트',
      '우선 기술 지원',
    ],
  },
]

export const teamPlans = [
  {
    id: 'team',
    name: 'Team',
    desc: '동아리 · 소규모 팀을 위한 플랜',
    price: { monthly: 15000, yearly: 12000 },
    priceUnit: '인/월',
    minMembers: 5,
    cta: '팀 시작하기',
    ctaLink: '/register',
    highlighted: false,
    features: [
      '개인 Pro 기능 전체 포함',
      '관리자 대시보드',
      '멤버별 기본 역량 분석',
      '그룹 랭킹 · 리더보드',
      '멤버 초대 (이메일/링크)',
      '이메일 지원',
    ],
  },
  {
    id: 'academy',
    name: 'Academy',
    desc: '교육기관 · 학과를 위한 프리미엄',
    price: { monthly: 25000, yearly: 20000 },
    priceUnit: '인/월',
    minMembers: 10,
    cta: '도입 문의',
    ctaLink: '/register',
    highlighted: true,
    badge: '추천',
    features: [
      'Team 기능 전체 포함',
      '상세 역량 분석 리포트',
      '커리큘럼 커스터마이징',
      '전용 실습 인스턴스',
      '온보딩 가이드 제공',
      '수료증 발급',
      '전담 매니저 지원',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    desc: '대규모 기관 · 기업 보안팀',
    price: { monthly: 0, yearly: 0 },
    priceUnit: '',
    minMembers: 50,
    cta: 'Enterprise 문의',
    ctaLink: 'mailto:hello@learnops.io',
    highlighted: false,
    isEnterprise: true,
    features: [
      'Academy 기능 전체 포함',
      '맞춤 자격 과정 설계',
      '전용 인프라 구성',
      'SSO / LMS 연동',
      'API 연동',
      'SLA 보장',
      '전담 보안 컨설턴트',
    ],
  },
]

export const featureTable = {
  individual: {
    columns: ['Starter', 'Pro'],
    categories: [
      {
        name: '학습',
        features: [
          { label: '레벨테스트', starter: '월 1회', pro: '무제한' },
          { label: 'AI 커리큘럼', starter: '미리보기', pro: '무제한' },
          { label: '실습 환경', starter: '일 30분', pro: '무제한' },
          { label: '워게임', starter: '기초 5문제', pro: '전체' },
          { label: '학습 리포트', starter: false, pro: '월간' },
        ],
      },
      {
        name: '지원',
        features: [
          { label: '커뮤니티 포럼', starter: true, pro: true },
          { label: '우선 기술 지원', starter: false, pro: true },
        ],
      },
    ],
  },
  team: {
    columns: ['Team', 'Academy', 'Enterprise'],
    categories: [
      {
        name: '학습',
        features: [
          { label: '레벨테스트', team: '무제한', academy: '무제한', enterprise: '무제한' },
          { label: 'AI 커리큘럼', team: '무제한', academy: '커스텀 가능', enterprise: '맞춤 설계' },
          { label: '실습 환경', team: '공유', academy: '전용', enterprise: '전용 인프라' },
          { label: '워게임', team: '전체', academy: '전체', enterprise: '전체 + 커스텀' },
          { label: '학습 리포트', team: '월간', academy: '주간 상세', enterprise: '실시간' },
        ],
      },
      {
        name: '그룹 관리',
        features: [
          { label: '관리자 대시보드', team: true, academy: true, enterprise: true },
          { label: '멤버별 역량 분석', team: '기본', academy: '상세', enterprise: '커스텀' },
          { label: '그룹 랭킹', team: true, academy: true, enterprise: true },
          { label: '수료증 발급', team: false, academy: true, enterprise: true },
          { label: 'SSO / LMS 연동', team: false, academy: false, enterprise: true },
        ],
      },
      {
        name: '지원',
        features: [
          { label: '이메일 지원', team: true, academy: true, enterprise: true },
          { label: '온보딩 지원', team: '셀프', academy: '가이드', enterprise: '전담' },
          { label: '전담 매니저', team: false, academy: true, enterprise: true },
          { label: 'API 연동', team: false, academy: false, enterprise: true },
          { label: 'SLA 보장', team: false, academy: false, enterprise: true },
        ],
      },
    ],
  },
}

export const faqs = [
  {
    q: '무료 Starter 플랜으로 어떤 것을 할 수 있나요?',
    a: 'Starter 플랜에서는 매월 1회 AI 레벨테스트를 받고, 커리큘럼 미리보기와 하루 30분 실습 환경을 이용할 수 있습니다. 기초 워게임 5문제와 커뮤니티 포럼도 이용 가능합니다. LearnOps의 핵심 기능을 체험한 뒤 업그레이드를 결정하세요.',
  },
  {
    q: '개인 플랜과 팀 플랜의 차이가 무엇인가요?',
    a: '개인 플랜(Starter/Pro)은 혼자 학습하는 분을 위한 것이고, 팀 플랜(Team/Academy/Enterprise)은 관리자 대시보드, 멤버별 역량 분석, 그룹 랭킹 등 조직 관리 기능이 추가됩니다. 팀 플랜은 인당 과금되며, 개인 Pro의 모든 학습 기능을 포함합니다.',
  },
  {
    q: '팀 플랜의 최소 인원은 몇 명인가요?',
    a: 'Team 플랜은 최소 5명, Academy 플랜은 최소 10명부터 시작합니다. Enterprise는 50명 이상 대규모 조직을 위해 별도 협의를 통해 진행됩니다.',
  },
  {
    q: '연간 결제 시 할인이 적용되나요?',
    a: '네, 모든 유료 플랜에서 연간 결제 시 월 대비 20% 할인됩니다. Pro 플랜은 월 ₩10,300, Team은 인당 월 ₩12,000, Academy는 인당 월 ₩20,000에 이용 가능합니다.',
  },
  {
    q: '플랜 변경이나 인원 추가는 언제든 가능한가요?',
    a: '네, 언제든 가능합니다. 상위 플랜으로 업그레이드 시 차액만 결제되며, 팀 인원 추가도 바로 반영됩니다. 다운그레이드는 다음 결제일부터 적용됩니다.',
  },
  {
    q: '환불 정책은 어떻게 되나요?',
    a: '첫 결제 후 14일 이내 요청 시 전액 환불됩니다. 이후에는 남은 기간에 대해 일할 계산하여 환불됩니다.',
  },
  {
    q: 'Enterprise 도입 절차는 어떻게 되나요?',
    a: '문의 접수 후 담당자가 조직의 규모와 필요를 파악하여 맞춤 제안서를 제공합니다. 무료 파일럿(2주)을 진행한 뒤 도입을 결정하실 수 있습니다.',
  },
]
