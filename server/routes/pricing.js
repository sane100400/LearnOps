import { Router } from 'express';

const router = Router();

const plans = [
  {
    id: 'free',
    name: 'Free',
    desc: '소규모 동아리의 첫 시작',
    price: { monthly: 0, yearly: 0 },
    maxMembers: 5,
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
];

// GET /api/pricing — 요금제 목록 반환
router.get('/', (_req, res) => {
  res.json({ plans });
});

// GET /api/pricing/:planId — 특정 요금제 반환
router.get('/:planId', (req, res) => {
  const plan = plans.find((p) => p.id === req.params.planId);
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }
  res.json({ plan });
});

export default router;
