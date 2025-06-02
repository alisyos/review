import { NextRequest, NextResponse } from 'next/server';
import { PromptTemplate, PromptUpdateRequest } from '@/types/prompt';
import { 
  getActivePrompt, 
  saveActivePrompt, 
  getAllPrompts, 
  savePromptTemplate 
} from '@/utils/promptManager';

// GET: 모든 프롬프트 또는 활성 프롬프트 가져오기
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'active') {
      const activePrompt = getActivePrompt();
      return NextResponse.json(activePrompt);
    } else {
      const allPrompts = getAllPrompts();
      return NextResponse.json(allPrompts);
    }
  } catch (error) {
    console.error('프롬프트 조회 오류:', error);
    return NextResponse.json(
      { error: '프롬프트를 조회하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새 프롬프트 템플릿 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, content, isActive } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: '이름과 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    const newPrompt: PromptTemplate = {
      id: `prompt_${Date.now()}`,
      name,
      description: description || '',
      content,
      isActive: isActive || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    savePromptTemplate(newPrompt);

    return NextResponse.json(newPrompt, { status: 201 });
  } catch (error) {
    console.error('프롬프트 생성 오류:', error);
    return NextResponse.json(
      { error: '프롬프트를 생성하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 프롬프트 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates }: { id: string } & PromptUpdateRequest = body;

    if (!id) {
      return NextResponse.json(
        { error: '프롬프트 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 현재 활성 프롬프트 가져오기 (기본적으로 하나만 관리)
    const currentPrompt = getActivePrompt();
    
    const updatedPrompt: PromptTemplate = {
      ...currentPrompt,
      ...updates,
      id: currentPrompt.id,
      updatedAt: new Date().toISOString(),
    };

    saveActivePrompt(updatedPrompt);

    return NextResponse.json(updatedPrompt);
  } catch (error) {
    console.error('프롬프트 업데이트 오류:', error);
    return NextResponse.json(
      { error: '프롬프트를 업데이트하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 