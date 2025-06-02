import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AnalysisRequest, AnalysisResult } from '@/types/analysis';
import { getActivePrompt } from '@/utils/promptManager';

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

    // 저장된 활성 프롬프트 가져오기
    const activePrompt = getActivePrompt();
    console.log('📝 사용 중인 프롬프트:', activePrompt.name);
    
    // 프롬프트 템플릿에 변수 치환
    const prompt = activePrompt.content
      .replace(/{customerReview}/g, customerReview)
      .replace(/{productServiceGroup}/g, productServiceGroup)
      .replace(/{productServiceName}/g, productServiceName);

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