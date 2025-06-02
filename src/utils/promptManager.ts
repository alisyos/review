import { PromptTemplate } from '@/types/prompt';
import fs from 'fs';
import path from 'path';

const PROMPTS_DIR = path.join(process.cwd(), 'data', 'prompts');
const ACTIVE_PROMPT_FILE = path.join(PROMPTS_DIR, 'active.json');

// 디렉토리 생성
export function ensurePromptsDir() {
  if (!fs.existsSync(PROMPTS_DIR)) {
    fs.mkdirSync(PROMPTS_DIR, { recursive: true });
  }
}

// 기본 프롬프트 템플릿
export const DEFAULT_PROMPT: PromptTemplate = {
  id: 'default',
  name: '기본 분석 프롬프트',
  description: 'OpenAI GPT를 활용한 기본 고객 리뷰 감성 분석 프롬프트',
  content: `###지시사항 
제공된 고객 리뷰를 **정확히 분석**하여 감성 분류(긍정·부정)를 수행하고, 각 집합에서 키워드·빈도·샘플 리뷰·개선 인사이트를 도출하시오. 
**반드시 모든 리뷰를 빠짐없이 분석하고, 정확한 개수를 세어야 합니다.**

###핵심 분석 규칙
1. **리뷰 개수 정확성**
   - 제공된 모든 리뷰를 빠짐없이 분석
   - 전체 리뷰 수 = 긍정 리뷰 수 + 부정 리뷰 수 (반드시 일치)
   - 각 리뷰를 개별적으로 카운트

2. **감성 분류 기준 (매우 엄격하게 적용)**
   **긍정 리뷰:**
   - 명확한 긍정 표현: 좋다, 만족, 추천, 빠르다, 편리하다, 괜찮다, 무난하다
   - 칭찬 표현: 굿, 대박, 짱, 최고, 완벽, 훌륭
   - 긍정적 결과: 효과있다, 도움된다, 성공적

   **부정 리뷰 (놓치지 말고 정확히 분류):**
   - 명확한 부정 표현: 나쁘다, 불만, 느리다, 불편하다, 별로다
   - 문제점 지적: 깨졌다, 고장, 결함, 오류, 실망
   - 부정적 감정: 짜증, 화남, 후회, 실망
   - **중요**: "맛은 없지만", "별로지만", "아쉽지만" 등은 부정으로 분류
   - **조건부 부정**: "~만 아니면", "~때문에 별로", "~가 문제"
   - **약한 부정도 부정으로 분류**: "그냥 그렇다", "보통이다", "기대에 못미친다"

3. **혼합 감정 처리**
   - "좋지만 비싸다" → 긍정 1개, 부정 1개로 분리
   - "맛은 없지만 비타민이니까" → 부정으로 분류 (맛없다가 주된 감정)
   - "배송은 빠른데 제품이 별로" → 긍정 1개, 부정 1개로 분리

4. **키워드 추출**
   - 감성별로 가장 많이 언급된 명사/형용사 Top 5
   - 정확한 빈도 계산 (중복 제거하지 말고 언급 횟수 그대로)

###분석 절차
1. 먼저 전체 리뷰 개수를 정확히 세기
2. 각 리뷰를 개별적으로 긍정/부정 분류
3. 분류 결과의 합이 전체와 일치하는지 검증
4. 키워드 추출 및 빈도 계산
5. 최종 검증: totalReviewCount = positiveReviewCount + negativeReviewCount

###출력 형태 
{ 
"product": "{productServiceName}", 
"analysisDate": "2024-12-19", 
"totalReviewCount": [정확한 전체 리뷰 수], 
"positiveReviewCount": [긍정 리뷰 수], 
"negativeReviewCount": [부정 리뷰 수], 
"positiveKeywords": [ 
{ 
"keyword": "키워드명", 
"frequency": [언급 횟수], 
"sampleReviews": ["샘플1", "샘플2", "샘플3"] 
} 
], 
"negativeKeywords": [ 
{ 
"keyword": "키워드명", 
"frequency": [언급 횟수], 
"sampleReviews": ["샘플1", "샘플2", "샘플3"] 
} 
], 
"insights": { 
"improvementIdeas": ["개선아이디어1", "개선아이디어2", "개선아이디어3"], 
"marketingStrategy": "400자 이상의 마케팅 전략", 
"promoCopies": ["홍보카피1", "홍보카피2", "홍보카피3"] 
} 
} 

**중요: 반드시 JSON 형식으로만 응답하고, 다른 설명은 포함하지 마세요.**

###분석할 고객 리뷰
{customerReview}

###제품 정보
제품/서비스 군: {productServiceGroup}
제품/서비스 이름: {productServiceName}`,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 환경 변수에서 프롬프트 가져오기
function getPromptFromEnv(): PromptTemplate | null {
  const envPrompt = process.env.CUSTOM_PROMPT;
  if (!envPrompt) return null;

  try {
    const parsed = JSON.parse(envPrompt);
    return {
      id: 'env_prompt',
      name: parsed.name || '환경 변수 프롬프트',
      description: parsed.description || '환경 변수에서 로드된 프롬프트',
      content: parsed.content || parsed,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('환경 변수 프롬프트 파싱 오류:', error);
    return null;
  }
}

// 활성 프롬프트 가져오기 (우선순위: 환경변수 > 파일 > 기본값)
export function getActivePrompt(): PromptTemplate {
  // 1. 환경 변수에서 프롬프트 확인 (배포 환경 우선)
  const envPrompt = getPromptFromEnv();
  if (envPrompt) {
    console.log('📝 환경 변수에서 프롬프트 로드:', envPrompt.name);
    return envPrompt;
  }

  // 2. 파일에서 프롬프트 확인 (로컬 개발 환경)
  try {
    ensurePromptsDir();
    if (fs.existsSync(ACTIVE_PROMPT_FILE)) {
      const data = fs.readFileSync(ACTIVE_PROMPT_FILE, 'utf-8');
      const filePrompt = JSON.parse(data);
      console.log('📝 파일에서 프롬프트 로드:', filePrompt.name);
      return filePrompt;
    }
  } catch (error) {
    console.error('파일 프롬프트 로드 실패:', error);
  }
  
  // 3. 기본 프롬프트 사용
  console.log('📝 기본 프롬프트 사용');
  
  // 로컬 환경에서는 기본 프롬프트를 파일로 저장
  if (process.env.NODE_ENV !== 'production') {
    try {
      saveActivePrompt(DEFAULT_PROMPT);
    } catch (error) {
      console.error('기본 프롬프트 저장 실패:', error);
    }
  }
  
  return DEFAULT_PROMPT;
}

// 활성 프롬프트 저장 (로컬 환경에서만)
export function saveActivePrompt(prompt: PromptTemplate): void {
  // 프로덕션 환경에서는 파일 저장 비활성화
  if (process.env.NODE_ENV === 'production') {
    console.warn('프로덕션 환경에서는 프롬프트 파일 저장이 비활성화됩니다. 환경 변수를 사용하세요.');
    return;
  }

  try {
    ensurePromptsDir();
    
    const updatedPrompt = {
      ...prompt,
      updatedAt: new Date().toISOString(),
    };
    
    fs.writeFileSync(ACTIVE_PROMPT_FILE, JSON.stringify(updatedPrompt, null, 2));
    console.log('✅ 프롬프트 파일 저장 완료');
  } catch (error) {
    console.error('프롬프트 저장 실패:', error);
    throw error;
  }
}

// 모든 프롬프트 템플릿 가져오기
export function getAllPrompts(): PromptTemplate[] {
  const activePrompt = getActivePrompt();
  return [activePrompt];
}

// 프롬프트 템플릿 저장
export function savePromptTemplate(prompt: PromptTemplate): void {
  // 프로덕션 환경에서는 저장 비활성화
  if (process.env.NODE_ENV === 'production') {
    throw new Error('프로덕션 환경에서는 프롬프트 수정이 제한됩니다. 환경 변수를 사용하세요.');
  }

  try {
    const templateFile = path.join(PROMPTS_DIR, `${prompt.id}.json`);
    fs.writeFileSync(templateFile, JSON.stringify(prompt, null, 2));
    
    if (prompt.isActive) {
      saveActivePrompt(prompt);
    }
  } catch (error) {
    console.error('프롬프트 템플릿 저장 실패:', error);
    throw error;
  }
} 