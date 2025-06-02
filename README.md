# 리뷰 분석 AI

LLM모델을 활용하여 고객 리뷰를 자동으로 분석하고, 긍정/부정 감성 분석과 마케팅 인사이트를 제공하는 웹 애플리케이션입니다.

## 주요 기능

- **감성 분석**: 고객 리뷰를 긍정/부정으로 자동 분류
- **키워드 추출**: 긍정/부정 리뷰에서 핵심 키워드 추출 및 빈도 분석
- **마케팅 인사이트**: AI가 생성하는 개선 방안 및 마케팅 전략
- **다양한 입력 방식**: 직접 입력 또는 파일 업로드 (.txt, .csv, .docx)
- **결과 다운로드**: HTML 및 Word 파일로 분석 결과 저장
- **관리자 페이지**: 프롬프트 관리 및 최적화 기능

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-4.1
- **차트**: Recharts
- **파일 처리**: file-saver, docx, mammoth
- **배포**: Vercel

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 프롬프트 관리

### 로컬 개발 환경
- 관리자 페이지(`/admin`)에서 프롬프트를 직접 편집할 수 있습니다.
- 프롬프트는 `data/prompts/` 폴더에 JSON 파일로 저장됩니다.

### 배포 환경 (Vercel 등)
배포 환경에서는 파일 시스템 접근이 제한되므로 환경 변수를 통해 프롬프트를 관리합니다.

#### 방법 1: JSON 형식으로 설정
```env
CUSTOM_PROMPT={"name":"커스텀 프롬프트","description":"배포용 프롬프트","content":"프롬프트 내용..."}
```

#### 방법 2: 프롬프트 내용만 설정
```env
CUSTOM_PROMPT=프롬프트 내용을 여기에 입력하세요...
```

### 프롬프트 우선순위
1. **환경 변수** (`CUSTOM_PROMPT`) - 배포 환경에서 우선 적용
2. **로컬 파일** (`data/prompts/active.json`) - 개발 환경에서 적용
3. **기본 프롬프트** - 위 두 가지가 없을 때 적용

## 배포

### Vercel 배포
1. GitHub에 코드를 푸시합니다.
2. Vercel에서 프로젝트를 연결합니다.
3. 환경 변수를 설정합니다:
   - `OPENAI_API_KEY`: OpenAI API 키
   - `CUSTOM_PROMPT`: (선택사항) 커스텀 프롬프트

### 환경 변수 설정 예시 (Vercel)
```
OPENAI_API_KEY=sk-...
CUSTOM_PROMPT={"name":"프로덕션 프롬프트","description":"최적화된 분석 프롬프트","content":"###지시사항\n고객 리뷰를 정확히 분석하여..."}
```

## 파일 구조

```
src/
├── app/
│   ├── admin/              # 관리자 페이지
│   ├── api/
│   │   ├── admin/prompts/  # 프롬프트 관리 API
│   │   └── analyze/        # 리뷰 분석 API
│   └── page.tsx           # 메인 페이지
├── components/
│   ├── AnalysisResult.tsx  # 분석 결과 컴포넌트
│   ├── PromptEditor.tsx    # 프롬프트 편집기
│   └── ReviewForm.tsx      # 리뷰 입력 폼
├── types/
│   ├── analysis.ts         # 분석 관련 타입
│   └── prompt.ts          # 프롬프트 관련 타입
└── utils/
    ├── downloadUtils.ts    # 파일 다운로드 유틸리티
    └── promptManager.ts    # 프롬프트 관리 유틸리티
```

## 사용 방법

1. **리뷰 입력**: 좌측 패널에서 고객 리뷰를 직접 입력하거나 파일로 업로드
2. **제품 정보 입력**: 제품/서비스 군과 구체적인 이름 입력
3. **분석 실행**: "분석 시작" 버튼 클릭
4. **결과 확인**: 우측 패널에서 감성 분석 결과 및 인사이트 확인
5. **결과 저장**: HTML 또는 Word 파일로 다운로드

## 관리자 기능

- **프롬프트 편집**: AI 분석 품질 향상을 위한 프롬프트 최적화
- **실시간 미리보기**: 프롬프트 변경 사항 즉시 확인
- **환경별 관리**: 개발/배포 환경에 따른 유연한 프롬프트 관리

## 라이선스

MIT License

## 기여

이슈 리포트나 풀 리퀘스트를 환영합니다!