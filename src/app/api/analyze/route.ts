import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AnalysisRequest, AnalysisResult } from '@/types/analysis';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();
    const { customerReview, productServiceGroup, productServiceName } = body;

    console.log('=== 리뷰 분석 요청 시작 ===');
    console.log('제품/서비스 군:', productServiceGroup);
    console.log('제품/서비스 이름:', productServiceName);
    console.log('고객 리뷰 길이:', customerReview.length, '자');
    console.log('고객 리뷰 내용 (처음 200자):', customerReview.substring(0, 200) + '...');

    if (!customerReview || !productServiceGroup || !productServiceName) {
      console.log('❌ 필수 필드 누락');
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    const prompt = `###지시사항 
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
"product": "${productServiceName}", 
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
${customerReview}

###제품 정보
제품/서비스 군: ${productServiceGroup}
제품/서비스 이름: ${productServiceName}`;

    console.log('📤 OpenAI API 호출 시작');
    console.log('사용 모델:', 'gpt-4.1');
    console.log('프롬프트 길이:', prompt.length, '자');
    
    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log('📥 OpenAI API 응답 완료');
    console.log('응답 시간:', duration, 'ms');
    console.log('사용된 토큰 수:', completion.usage?.total_tokens || 'N/A');
    console.log('입력 토큰:', completion.usage?.prompt_tokens || 'N/A');
    console.log('출력 토큰:', completion.usage?.completion_tokens || 'N/A');

    const responseContent = completion.choices[0].message.content;
    
    console.log('📄 GPT 응답 내용:');
    console.log('응답 길이:', responseContent?.length || 0, '자');
    console.log('응답 내용 (처음 500자):', responseContent?.substring(0, 500) + '...');
    
    if (!responseContent) {
      console.log('❌ OpenAI API 응답이 비어있음');
      throw new Error('OpenAI API에서 응답을 받지 못했습니다.');
    }

    // JSON 파싱 시도
    let analysisResult: AnalysisResult;
    try {
      console.log('🔄 JSON 파싱 시도');
      analysisResult = JSON.parse(responseContent);
      console.log('✅ JSON 파싱 성공');
      console.log('분석 결과 요약:');
      console.log('- 제품명:', analysisResult.product);
      console.log('- 전체 리뷰 수:', analysisResult.totalReviewCount);
      console.log('- 긍정 리뷰 수:', analysisResult.positiveReviewCount);
      console.log('- 부정 리뷰 수:', analysisResult.negativeReviewCount);
      console.log('- 긍정 키워드 수:', analysisResult.positiveKeywords?.length || 0);
      console.log('- 부정 키워드 수:', analysisResult.negativeKeywords?.length || 0);
    } catch (parseError) {
      console.log('❌ JSON 파싱 실패');
      console.error('파싱 오류:', parseError);
      console.log('원본 응답 내용:');
      console.log(responseContent);
      throw new Error('분석 결과를 파싱하는데 실패했습니다.');
    }

    console.log('=== 리뷰 분석 완료 ===');
    return NextResponse.json(analysisResult);
  } catch (error) {
    console.log('❌ 분석 중 오류 발생');
    console.error('오류 상세:', error);
    return NextResponse.json(
      { error: '분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 