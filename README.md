# AI 고객 리뷰 분석 시스템

OpenAI GPT-4를 활용한 고객 리뷰 감성 분석 및 마케팅 인사이트 제공 시스템입니다.

## 주요 기능

### 📊 분석 기능
- **감성 분석**: 고객 리뷰를 긍정/부정으로 자동 분류
- **키워드 추출**: 긍정/부정 리뷰에서 주요 키워드 및 빈도 분석
- **시각화**: 원형 그래프를 통한 긍정/부정 비율 표시
- **샘플 리뷰**: 각 키워드별 대표 리뷰 3개 제공

### 💡 인사이트 제공
- **개선 아이디어**: 부정 리뷰 기반 제품/서비스 개선 방안
- **마케팅 전략**: 긍정 키워드 활용한 마케팅 전략 (400자 이상)
- **홍보 카피**: SNS/배너 활용 가능한 홍보 문구 3개

### 📥 입력 방식
- **직접 입력**: 텍스트 영역에 리뷰 직접 입력
- **파일 업로드**: .txt, .csv 파일 업로드 지원
- **제품 정보**: 제품/서비스 군 및 이름 입력

### 📤 다운로드 기능
- **HTML 파일**: 웹 브라우저에서 볼 수 있는 형태로 저장
- **Word 파일**: Microsoft Word에서 편집 가능한 .docx 형태로 저장

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **AI**: OpenAI GPT-4
- **File Export**: file-saver, docx
- **Deployment**: Vercel

## 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd review-analyzer
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 OpenAI API 키를 설정합니다:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## Vercel 배포

### 1. Vercel 계정 연결
```bash
npm i -g vercel
vercel login
```

### 2. 프로젝트 배포
```bash
vercel
```

### 3. 환경 변수 설정
Vercel 대시보드에서 프로젝트 설정 → Environment Variables에서 `OPENAI_API_KEY`를 추가합니다.

## 사용 방법

### 1. 리뷰 입력
- 고객 리뷰를 직접 입력하거나 파일로 업로드
- 제품/서비스 군 입력 (예: 핸드폰, 노트북, 음식점)
- 제품/서비스 이름 입력 (예: 갤럭시 S24, 맥북 프로)

### 2. 분석 실행
- "분석 시작" 버튼 클릭
- AI가 리뷰를 분석하여 결과 생성 (약 10-30초 소요)

### 3. 결과 확인
- 긍정/부정 비율 및 원형 그래프
- 주요 키워드별 빈도 및 샘플 리뷰
- 개선 아이디어 및 마케팅 인사이트

### 4. 결과 다운로드
- HTML 또는 Word 파일로 분석 결과 저장

## API 엔드포인트

### POST /api/analyze
고객 리뷰 분석을 수행합니다.

**Request Body:**
```json
{
  "customerReview": "고객 리뷰 텍스트",
  "productServiceGroup": "제품/서비스 군",
  "productServiceName": "제품/서비스 이름"
}
```

**Response:**
```json
{
  "product": "제품명",
  "analysisDate": "2024-01-01",
  "totalReviewCount": 100,
  "positiveReviewCount": 70,
  "negativeReviewCount": 30,
  "positiveKeywords": [...],
  "negativeKeywords": [...],
  "insights": {
    "improvementIdeas": [...],
    "marketingStrategy": "...",
    "promoCopies": [...]
  }
}
```

## 프로젝트 구조

```
review-analyzer/
├── src/
│   ├── app/
│   │   ├── api/analyze/route.ts    # OpenAI API 호출
│   │   ├── layout.tsx              # 레이아웃
│   │   └── page.tsx                # 메인 페이지
│   ├── components/
│   │   ├── ReviewForm.tsx          # 입력 폼
│   │   └── AnalysisResult.tsx      # 결과 표시
│   ├── types/
│   │   └── analysis.ts             # 타입 정의
│   └── utils/
│       └── downloadUtils.ts        # 다운로드 기능
├── public/                         # 정적 파일
├── package.json                    # 의존성 관리
└── README.md                       # 프로젝트 문서
```

## 주의사항

1. **OpenAI API 키**: 반드시 유효한 OpenAI API 키가 필요합니다.
2. **API 사용량**: GPT-4 사용으로 인한 API 비용이 발생할 수 있습니다.
3. **파일 크기**: 업로드 파일은 적절한 크기로 제한하는 것을 권장합니다.
4. **언어**: 현재 한국어 리뷰 분석에 최적화되어 있습니다.

## 라이선스

MIT License

## 기여

이슈 리포트나 풀 리퀘스트는 언제든 환영합니다!
