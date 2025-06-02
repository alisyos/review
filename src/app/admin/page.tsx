'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PromptTemplate } from '@/types/prompt';
import PromptEditor from '@/components/PromptEditor';

export default function AdminPage() {
  const [activePrompt, setActivePrompt] = useState<PromptTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProduction, setIsProduction] = useState(false);

  // 활성 프롬프트 로드
  const loadActivePrompt = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/prompts?type=active');
      if (!response.ok) {
        throw new Error('프롬프트를 불러오는데 실패했습니다.');
      }
      const prompt = await response.json();
      setActivePrompt(prompt);
      
      // 프로덕션 환경 확인
      setIsProduction(prompt.id === 'env_prompt' || process.env.NODE_ENV === 'production');
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 프롬프트 저장
  const handleSavePrompt = async (prompt: PromptTemplate) => {
    try {
      const response = await fetch('/api/admin/prompts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '프롬프트 저장에 실패했습니다.');
      }

      const updatedPrompt = await response.json();
      setActivePrompt(updatedPrompt);
      setIsEditing(false);
      setSuccessMessage('프롬프트가 성공적으로 저장되었습니다.');
      
      // 성공 메시지 3초 후 제거
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : '프롬프트 저장 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    loadActivePrompt();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프롬프트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                관리자 페이지
              </h1>
              <p className="text-gray-600">
                AI 분석 시스템의 프롬프트를 관리하고 최적화하세요.
              </p>
            </div>
            <Link
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      {/* 프로덕션 환경 안내 */}
      {isProduction && (
        <div className="container mx-auto px-4 pt-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">프로덕션 환경 알림</h3>
                <div className="mt-2 text-sm">
                  <p>현재 프로덕션 환경에서 실행 중입니다. 프롬프트 수정이 제한됩니다.</p>
                  <p className="mt-1">프롬프트를 변경하려면 <code className="bg-yellow-200 px-1 rounded">CUSTOM_PROMPT</code> 환경 변수를 사용하세요.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 알림 메시지 */}
      {error && (
        <div className="container mx-auto px-4 pt-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <div className="flex justify-between items-center">
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="container mx-auto px-4 pt-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <div className="flex justify-between items-center">
              <p>{successMessage}</p>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-700 hover:text-green-900"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-4 py-6">
        {isEditing ? (
          <PromptEditor
            initialPrompt={activePrompt || undefined}
            onSave={handleSavePrompt}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">현재 활성 프롬프트</h2>
              <button
                onClick={() => setIsEditing(true)}
                disabled={isProduction}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isProduction 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                title={isProduction ? '프로덕션 환경에서는 편집이 제한됩니다' : '프롬프트 편집'}
              >
                편집하기
              </button>
            </div>

            {activePrompt && (
              <div className="space-y-6">
                {/* 프롬프트 정보 */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">프롬프트 정보</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">이름:</span>
                        <p className="text-gray-800">{activePrompt.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">설명:</span>
                        <p className="text-gray-800">{activePrompt.description || '설명 없음'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">소스:</span>
                        <p className="text-gray-800">
                          {activePrompt.id === 'env_prompt' ? (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">환경 변수</span>
                          ) : activePrompt.id === 'default' ? (
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">기본 프롬프트</span>
                          ) : (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">사용자 정의</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">메타데이터</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">생성일:</span>
                        <p className="text-gray-800">{new Date(activePrompt.createdAt).toLocaleString('ko-KR')}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">수정일:</span>
                        <p className="text-gray-800">{new Date(activePrompt.updatedAt).toLocaleString('ko-KR')}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">프롬프트 길이:</span>
                        <p className="text-gray-800">{activePrompt.content.length.toLocaleString()}자</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 프롬프트 내용 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">프롬프트 내용</h3>
                  <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                      {activePrompt.content}
                    </pre>
                  </div>
                </div>

                {/* 사용 가능한 변수 안내 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">사용 가능한 변수</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <ul className="space-y-2 text-sm">
                      <li>
                        <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">{'{customerReview}'}</code>
                        <span className="ml-2 text-gray-700">- 고객이 입력한 리뷰 내용</span>
                      </li>
                      <li>
                        <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">{'{productServiceGroup}'}</code>
                        <span className="ml-2 text-gray-700">- 제품/서비스 군 (예: 핸드폰, 음식점)</span>
                      </li>
                      <li>
                        <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">{'{productServiceName}'}</code>
                        <span className="ml-2 text-gray-700">- 구체적인 제품/서비스 이름</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 환경 변수 설정 안내 */}
                {isProduction && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">환경 변수 설정 방법</h3>
                    <div className="bg-gray-50 border rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-3">
                        Vercel 등 배포 환경에서 프롬프트를 변경하려면 다음과 같이 환경 변수를 설정하세요:
                      </p>
                      <div className="bg-gray-800 text-green-400 p-3 rounded text-sm font-mono">
                        <p>CUSTOM_PROMPT={`'{"'`}</p>
                        <p>&nbsp;&nbsp;{`"name": "커스텀 프롬프트",`}</p>
                        <p>&nbsp;&nbsp;{`"description": "설명",`}</p>
                        <p>&nbsp;&nbsp;{`"content": "프롬프트 내용..."`}</p>
                        <p>{`'}"'`}</p>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        * JSON 형식으로 설정하거나, 프롬프트 내용만 문자열로 설정할 수 있습니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 