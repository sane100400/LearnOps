export const plans = [
  {
    id: 'free',
    name: 'Free',
    desc: '소규모 동아리의 첫 시작',
    price: { monthly: 0, yearly: 0 },
    maxMembers: 5,
    cta: '무료로 시작',
    ctaLink: '/register',
    highlighted: false,
    features: [
      '최대 5명',
      '기본 레벨테스트 (월 3회)',
      'AI 커리큘럼 1개',
      '기본 실습 환경',
      '커뮤니티 지원',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    desc: '활발한 동아리에 추천',
    price: { monthly: 49000, yearly: 39200 },
    maxMembers: 20,
    cta: '시작하기',
    ctaLink: '/onboarding',
    highlighted: true,
    badge: '추천',
    features: [
      '최대 20명',
      '무제한 레벨테스트',
      'AI 커리큘럼 무제한',
      '관리자 대시보드',
      '그룹 랭킹',
      '이메일 지원',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: '교육단체를 위한 프리미엄',
    price: { monthly: 99000, yearly: 79200 },
    maxMembers: 50,
    cta: '시작하기',
    ctaLink: '/onboarding',
    highlighted: false,
    features: [
      '최대 50명',
      '무제한 레벨테스트',
      'AI 커리큘럼 무제한',
      '관리자 대시보드 + 분석',
      '그룹 랭킹 + 리더보드',
      '전용 매니저 지원',
      '맞춤 커리큘럼 설계',
      'API 연동',
    ],
  },
]

export const featureTable = {
  categories: [
    {
      name: '학습',
      features: [
        { label: '레벨테스트', free: '월 3회', basic: '무제한', pro: '무제한' },
        { label: 'AI 커리큘럼', free: '1개', basic: '무제한', pro: '무제한' },
        { label: '실습 환경', free: '기본', basic: '고급', pro: '프리미엄' },
        { label: '워게임 모듈', free: false, basic: true, pro: true },
        { label: '맞춤 커리큘럼 설계', free: false, basic: false, pro: true },
      ],
    },
    {
      name: '그룹 관리',
      features: [
        { label: '최대 인원', free: '5명', basic: '20명', pro: '50명' },
        { label: '관리자 대시보드', free: false, basic: true, pro: true },
        { label: '멤버 초대 (이메일/링크)', free: false, basic: true, pro: true },
        { label: '그룹 랭킹', free: false, basic: true, pro: true },
        { label: '학습 분석 리포트', free: false, basic: false, pro: true },
      ],
    },
    {
      name: '지원',
      features: [
        { label: '커뮤니티 포럼', free: true, basic: true, pro: true },
        { label: '이메일 지원', free: false, basic: true, pro: true },
        { label: '전용 매니저', free: false, basic: false, pro: true },
        { label: 'API 연동', free: false, basic: false, pro: true },
      ],
    },
  ],
}

export const faqs = [
  {
    q: '무료 플랜으로 어떤 기능을 사용할 수 있나요?',
    a: 'Free 플랜에서는 최대 5명까지 그룹을 구성하고, 월 3회 레벨테스트와 AI 커리큘럼 1개를 이용할 수 있습니다. 기본적인 실습 환경과 커뮤니티 지원도 포함됩니다.',
  },
  {
    q: '연간 결제 시 할인이 적용되나요?',
    a: '네, 연간 결제 시 월간 대비 20% 할인된 가격이 적용됩니다. Basic 플랜은 월 ₩39,200, Pro 플랜은 월 ₩79,200에 이용 가능합니다.',
  },
  {
    q: '플랜은 언제든 변경할 수 있나요?',
    a: '네, 언제든지 상위 플랜으로 업그레이드하거나 하위 플랜으로 다운그레이드할 수 있습니다. 업그레이드 시 차액만 결제되며, 다운그레이드는 다음 결제일부터 적용됩니다.',
  },
  {
    q: '50명 이상의 단체도 이용할 수 있나요?',
    a: '네, 50명 이상의 대규모 교육단체나 기업을 위한 Enterprise 플랜을 별도로 제공합니다. 맞춤 견적과 전용 기능이 필요하시면 문의해주세요.',
  },
  {
    q: '결제 방법은 어떤 것이 있나요?',
    a: '신용카드, 체크카드, 계좌이체를 지원합니다. Enterprise 플랜은 세금계산서 발행과 후불 결제도 가능합니다.',
  },
  {
    q: '환불 정책은 어떻게 되나요?',
    a: '첫 결제 후 14일 이내에 요청하시면 전액 환불해 드립니다. 이후에는 남은 기간에 대해 일할 계산하여 환불됩니다.',
  },
]
