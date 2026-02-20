import { Router } from 'express';

const router = Router();

const individualPlans = [
  {
    id: 'starter',
    name: 'Starter',
    desc: '보안 학습의 첫 걸음',
    price: { monthly: 0, yearly: 0 },
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
];

const teamPlans = [
  {
    id: 'team',
    name: 'Team',
    desc: '동아리 · 소규모 팀을 위한 플랜',
    price: { monthly: 15000, yearly: 12000 },
    priceUnit: '인/월',
    minMembers: 5,
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
    minMembers: 50,
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
];

const allPlans = [...individualPlans, ...teamPlans];

// GET /api/pricing — 전체 요금제 반환
router.get('/', (_req, res) => {
  res.json({ individualPlans, teamPlans });
});

// GET /api/pricing/:planId — 특정 요금제 반환
router.get('/:planId', (req, res) => {
  const plan = allPlans.find((p) => p.id === req.params.planId);
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }
  res.json({ plan });
});

export default router;
