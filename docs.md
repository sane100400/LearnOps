# LearnOps - AI 맞춤형 IT 보안 실습 플랫폼

## 비전

**B2B AI 기반 맞춤형 보안 교육 플랫폼.**
기업 고객의 조직 특성, 학습자 수준, 업종별 보안 요구사항을 분석하여 AI가 자동으로 커리큘럼과 실습 문제를 생성하고, Docker 격리 환경에서 실전 실습까지 제공하는 올인원 보안 교육 솔루션.

---

## 핵심 가치

| 기존 보안 교육 | LearnOps |
|---|---|
| 범용 교재, 모든 학습자에게 동일 내용 | AI가 학습자별 수준·목표에 맞춰 커리큘럼 자동 생성 |
| 이론 위주, 실습 환경 별도 구축 필요 | Docker 기반 격리 실습 환경 원클릭 제공 |
| 강사 의존적, 스케일 불가 | AI 튜터 + 자동 평가로 무한 스케일 |
| 학습 현황 파악 어려움 | 실시간 대시보드로 조직 전체 학습 현황 가시화 |

---

## 현재 구현 현황

### 아키텍처

```
[React SPA] ←→ [Nginx] ←→ [Express API Server] ←→ [Docker Engine]
                                    ↓                      ↓
                             [OpenAI API]         [격리된 Lab 컨테이너]
                                                  (attacker + vuln-app + DB)
```

- **프론트엔드**: React 18, React Router 6, Recharts, xterm.js
- **백엔드**: Express.js, WebSocket(ws), Dockerode
- **AI**: OpenAI GPT-4o-mini (백엔드 프록시 `/api/ai/chat`)
- **인프라**: Docker Compose, Nginx, systemd
- **배포**: Oracle Cloud (158.101.142.47)

### 페이지 구성

| 페이지 | 경로 | 설명 | 상태 |
|---|---|---|---|
| 랜딩 | `/` | 마케팅 홈페이지, 핵심 가치 제안 | 완료 |
| 로그인 | `/login` | 이메일/비밀번호 인증 | UI 완료 (백엔드 미연동) |
| 회원가입 | `/register` | 이름, 이메일, 비밀번호, 역할 선택 | UI 완료 (백엔드 미연동) |
| 대시보드 | `/dashboard` | 학습 통계, 진행률 차트, 알림, 빠른 접근 | 완료 (Mock 데이터) |
| 레벨테스트 | `/level-test` | AI 적응형 역량 분석 (퀴즈 + 대화형) | 완료 |
| 커리큘럼 | `/curriculum` | 주차별 학습 경로, 이론+실습 | 완료 (Mock 데이터) |
| 커리큘럼 생성 | `/curriculum-generate` | AI 기반 맞춤형 커리큘럼 자동 생성 | 완료 |
| 실습 환경 | `/lab` | Docker 격리 Lab, xterm.js 터미널 | 완료 |
| 랭킹 | `/ranking` | 학습자 리더보드, 점수/레벨/트렌드 | 완료 (Mock 데이터) |
| 스터디 그룹 | `/study-group` | 그룹 기반 협업 학습, 메시징 | 완료 (Mock 데이터) |
| 관리자 | `/admin` | 로드맵 관리, 학습자 관리, 조직 설정 | 완료 |

### 핵심 기능 상세

#### 1. AI 레벨테스트 (`/level-test`)

두 가지 모드 제공:

**AI 적응형 테스트 (12문항)**
- Q1~Q3: 고정 시드 질문 (학습 동기, IT 경험, 관심 보안 분야)
- Q4~Q8: AI가 이전 답변 기반으로 학습 방향·목표·선호 학습 방식 심층 탐색
- Q9~Q12: 관심 분야 기반 4지선다 지식 측정
- 최종: 레이더 차트 + 프로필 분석 + 맞춤 학습 경로 추천

**AI 대화형 상담**
- 자유 대화로 관심사·목표·경험 파악
- 4단계 대화 가이드 (동기 → 세부 분야 → 구체적 목표 → 역량 확인)
- 5회 이상 메시지 교환 후 분석 가능

#### 2. 실습 환경 (`/lab`)

Docker 기반 격리된 보안 실습 환경:

- **공격자 컨테이너**: Ubuntu 22.04 + nmap, curl, python 등 보안 도구
- **취약 웹앱**: PHP 8.1 + Apache (의도적 취약점: SQL Injection, XSS 등)
- **데이터베이스**: MySQL 8.0
- **네트워크 격리**: 세션별 독립 Docker 네트워크
- **리소스 제한**: 컨테이너당 256MB RAM, 0.5 CPU, PID 100개
- **웹 터미널**: xterm.js + WebSocket으로 브라우저에서 직접 조작
- **리버스 프록시**: 취약 웹앱을 iframe으로 임베딩

#### 3. 관리자 콘솔 (`/admin`)

**대시보드 탭**: 조직 통계 카드 4개, 주간 활동 차트, 최근 활동 피드

**로드맵 관리 탭** (핵심):
- 카테고리/상태/난이도 필터링
- 타임라인 기반 스테이지 뷰 (확장/축소, 순서 변경, 추가/삭제)
- 스테이지별 문제 관리 (인라인 편집, AI/수동 추가)
- **AI 로드맵 생성 위저드**: 채팅으로 요구사항 수집 → 구조화된 로드맵 자동 생성 → 리뷰/편집 → 저장

**학습자 관리 탭**: 검색/필터, 상세 프로필, 실습 이력

**조직 설정 탭**: 조직 정보, 멤버 초대, 기본 설정

#### 4. AI 커리큘럼 생성 (`/curriculum-generate`)

사용자가 주제를 입력하면 AI가 주차별 학습 계획을 자동 생성.

### 서버 API

| 엔드포인트 | 메서드 | 설명 | Rate Limit |
|---|---|---|---|
| `/api/health` | GET | 서버 상태 확인 | - |
| `/api/ai/chat` | POST | OpenAI 프록시 (GPT-4o-mini) | 20/min |
| `/api/lab/start` | POST | Lab 환경 시작 (Docker 컨테이너 생성) | 10/min |
| `/api/lab/stop` | POST | Lab 환경 종료 (컨테이너 제거) | 10/min |
| `/api/lab/status` | GET | Lab 상태 확인 | 10/min |
| `/api/lab/proxy/*` | ALL | 취약 웹앱 리버스 프록시 | 10/min |
| `/ws/terminal` | WS | 컨테이너 터미널 WebSocket | - |

### 기술 스택

| 영역 | 기술 |
|---|---|
| 프론트엔드 | React 18, React Router 6, Recharts, xterm.js, Lucide Icons |
| 백엔드 | Node.js, Express.js, ws (WebSocket), Dockerode |
| AI | OpenAI GPT-4o-mini |
| 컨테이너 | Docker, Docker Compose |
| 웹서버 | Nginx (리버스 프록시 + SPA 라우팅 + gzip) |
| 프로세스 관리 | systemd |
| 형상 관리 | Git, GitHub |

### 디렉토리 구조

```
LearnOps/
├── src/
│   ├── pages/           # 11개 페이지 컴포넌트
│   ├── components/      # 공통 컴포넌트 (Navbar, Sidebar, Card, Button, Footer)
│   ├── hooks/           # useLabWebSocket, useContainerStatus
│   └── data/            # Mock 사용자 데이터
├── server/
│   ├── index.js         # Express 서버 진입점
│   ├── docker.js        # Docker 컨테이너 관리
│   └── routes/
│       ├── lab.js       # Lab API 라우트
│       └── ai.js        # OpenAI 프록시 라우트
├── docker/
│   ├── attacker/        # 공격자 컨테이너 Dockerfile
│   ├── vuln-app/        # 취약 웹앱 (PHP)
│   └── vuln-db/         # MySQL + 초기화 SQL
├── docker-compose.yml   # 개발용 컨테이너 오케스트레이션
├── vite.config.js       # Vite 설정 (프록시 포함)
└── .env                 # 환경변수 (OPENAI_API_KEY)
```

---

## 향후 로드맵

### Phase 1: 제품 완성 (MVP → 베타)

#### 1-1. 인증/인가 시스템
- [ ] JWT 기반 로그인/회원가입 백엔드 구현
- [ ] 역할 기반 접근 제어 (운영자/학습자/관리자)
- [ ] 조직(Organization) 단위 멀티테넌시
- [ ] 초대 기반 회원가입 (B2B: 운영자가 학습자 초대)

#### 1-2. 데이터베이스 연동
- [ ] PostgreSQL 또는 MySQL로 Mock 데이터 → 실제 DB 전환
- [ ] 사용자, 조직, 커리큘럼, 로드맵, 실습 기록 스키마 설계
- [ ] 레벨테스트 결과 저장 및 이력 관리
- [ ] 학습 진행률 실시간 추적

#### 1-3. AI 커리큘럼 고도화
- [ ] 레벨테스트 결과 → 커리큘럼 자동 매칭/생성 파이프라인
- [ ] 학습자 진행 상황 기반 커리큘럼 동적 조정 (적응형 학습)
- [ ] 학습자 약점 분석 → 보충 콘텐츠 자동 추천
- [ ] 기업 맞춤: 업종별 보안 위협 시나리오 자동 반영 (금융, 의료, 제조 등)

#### 1-4. 실습 환경 확장
- [ ] 다양한 취약점 시나리오 추가 (SSRF, XXE, 권한 상승, 암호화 취약점 등)
- [ ] 난이도별 실습 환경 템플릿 (초급/중급/고급)
- [ ] 자동 채점 시스템 (Flag 기반 CTF 방식)
- [ ] AI 힌트 시스템: 학습자가 막혔을 때 단계별 힌트 제공
- [ ] 실습 리플레이: 학습자의 터미널 명령어 기록 및 재생

### Phase 2: B2B 핵심 기능

#### 2-1. 조직 관리 대시보드
- [ ] 조직별 학습 현황 대시보드 (완료율, 평균 점수, 취약 분야)
- [ ] 부서별/팀별 학습 그룹 관리
- [ ] 학습 완료 인증서 자동 발급
- [ ] 월간/분기별 보안 역량 리포트 자동 생성 (PDF 내보내기)
- [ ] 학습 목표 설정 및 달성률 추적 (OKR 방식)

#### 2-2. 기업 맞춤 커리큘럼 엔진
- [ ] 기업 보안 정책/규정 입력 → AI가 맞춤 교육 과정 설계
- [ ] 업종별 컴플라이언스 매핑 (ISMS, ISO 27001, PCI-DSS 등)
- [ ] 실제 보안 사고 사례 기반 시뮬레이션 시나리오 생성
- [ ] 기업 내부 시스템 환경을 모사한 커스텀 Lab 환경
- [ ] 신규 입사자 온보딩 보안 교육 자동화

#### 2-3. 평가 및 리포팅
- [ ] 정기 보안 역량 평가 (분기별 자동 스케줄링)
- [ ] 학습자별 성장 추이 그래프
- [ ] 조직 전체 보안 역량 점수 (Security Readiness Score)
- [ ] 경영진 대상 요약 리포트 (비기술적 언어)
- [ ] 벤치마킹: 동종 업계 평균 대비 비교

### Phase 3: 스케일 & 수익화

#### 3-1. SaaS 인프라
- [ ] Kubernetes 기반 멀티테넌트 아키텍처
- [ ] 컨테이너 자동 스케일링 (동시 Lab 세션 수 기반)
- [ ] CDN + 글로벌 엣지 배포
- [ ] 가용성 99.9% SLA

#### 3-2. 과금 모델
- [ ] 구독 기반 요금제 (Starter / Business / Enterprise)
  - **Starter**: 학습자 20명, 기본 Lab, AI 커리큘럼
  - **Business**: 학습자 100명, 고급 Lab, 맞춤 시나리오, 리포트
  - **Enterprise**: 무제한, 전용 인프라, API 연동, 전담 매니저
- [ ] 사용량 기반 추가 과금 (Lab 시간, AI 호출 횟수)
- [ ] 연간 계약 할인

#### 3-3. 콘텐츠 생태계
- [ ] 보안 전문가 커뮤니티 Lab 시나리오 기여 (마켓플레이스)
- [ ] 기업 내부 보안팀이 자체 시나리오 제작·배포하는 도구
- [ ] 자격증 연계: 정보보안기사, CISSP, CEH 등 시험 대비 모드
- [ ] 글로벌: 영어, 일본어 다국어 지원

#### 3-4. 통합 & API
- [ ] LMS 연동 API (Moodle, Canvas 등)
- [ ] SSO 연동 (SAML, OIDC)
- [ ] Slack/Teams 알림 연동
- [ ] HR 시스템 연동 (학습 완료 → 인사 평가 반영)
- [ ] SIEM 연동 (실제 보안 이벤트 → 맞춤 교육 트리거)

### Phase 4: AI 고도화

#### 4-1. 차세대 AI 기능
- [ ] AI 튜터: 실습 중 실시간 대화형 가이드 (현재 터미널 상태 인식)
- [ ] 자동 취약점 시나리오 생성: AI가 새로운 실습 환경을 코드 레벨에서 생성
- [ ] 학습 패턴 분석: 학습자의 학습 습관·시간대·집중도 분석
- [ ] 예측 모델: 이탈 위험 학습자 조기 탐지 → 운영자에게 알림
- [ ] 자연어 → Lab 환경: "SSRF 취약점 실습 만들어줘" → Docker 환경 자동 생성

#### 4-2. RAG 기반 지식 베이스
- [ ] 최신 CVE, 보안 뉴스 자동 수집 → 교육 콘텐츠 업데이트
- [ ] 기업 내부 보안 문서 업로드 → 맞춤 교육 자료 생성
- [ ] MITRE ATT&CK 프레임워크 매핑 → 체계적 역량 커버리지

---

## 경쟁 우위

| 경쟁사 | 한계 | LearnOps 차별점 |
|---|---|---|
| 일반 보안 교육 플랫폼 (인프런, Udemy) | 범용 콘텐츠, 실습 없음 | AI 맞춤 + Docker 실습 |
| HackTheBox, TryHackMe | 개인 학습자 대상, B2B 기능 부족 | 기업 맞춤 커리큘럼, 조직 관리, 리포팅 |
| 기업 보안 교육 (오프라인) | 비용 높음, 스케일 불가, 일회성 | 자동화, 지속적 학습, 실시간 추적 |
| 자체 구축 CTF | 구축/유지보수 부담 | SaaS로 즉시 도입, AI가 시나리오 자동 생성 |

---

## 로컬 개발 환경 설정

```bash
# 프론트엔드 + 백엔드 동시 실행
npm run dev:all

# 또는 각각 실행
npm run dev          # Vite 프론트엔드 (port 5173)
npm run dev:server   # Express 백엔드 (port 3001)

# Docker Lab 이미지 빌드
docker compose build

# 프로덕션 빌드
npm run build
```

### 환경변수 (.env)

```
OPENAI_API_KEY=sk-proj-...    # OpenAI API 키 (서버에서만 사용)
```

### 서버 배포 (Oracle Cloud)

```bash
# 서버 접속
ssh -i ssh-key-2026-02-15.key ubuntu@158.101.142.47

# 코드 업데이트
cd /home/ubuntu/LearnOps
git pull
npm install
cd server && npm install && cd ..
npx vite build

# 백엔드 재시작
sudo systemctl restart learnops-server
```

서버 구성:
- **Nginx**: `/etc/nginx/sites-available/learnops` (SPA 라우팅 + API 프록시)
- **백엔드 서비스**: `/etc/systemd/system/learnops-server.service`
- **프론트엔드**: `/home/ubuntu/LearnOps/dist/`
