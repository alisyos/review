'use client';

import { useState } from 'react';
import ReviewForm from '@/components/ReviewForm';
import AnalysisResultComponent from '@/components/AnalysisResult';
import { AnalysisRequest, AnalysisResult } from '@/types/analysis';
import { downloadAsHTML, downloadAsDocx } from '@/utils/downloadUtils';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (data: AnalysisRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '분석 중 오류가 발생했습니다.');
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (format: 'html' | 'docx') => {
    if (!analysisResult) return;

    try {
      if (format === 'html') {
        downloadAsHTML(analysisResult);
      } else {
        await downloadAsDocx(analysisResult);
      }
    } catch {
      setError('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              AI 고객 리뷰 분석 시스템
            </h1>
            <p className="text-gray-600">
              OpenAI를 활용하여 고객 리뷰를 자동으로 분석하고, 긍정/부정 감성 분석과 마케팅 인사이트를 제공합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="container mx-auto px-4 pt-4 flex-shrink-0">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">오류가 발생했습니다:</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 - 좌우 분할 (1:2 비율) */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-hidden">
        <div className="grid lg:grid-cols-3 gap-6 h-full">
          {/* 좌측: 입력 폼 (1/3) */}
          <div className="lg:col-span-1 flex flex-col min-h-0">
            <div className="bg-white rounded-lg shadow-lg p-6 flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-800">리뷰 입력</h2>
                {analysisResult && (
                  <button
                    onClick={handleNewAnalysis}
                    className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-xs"
                  >
                    새 분석
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                <ReviewForm onSubmit={handleAnalyze} isLoading={isLoading} />
              </div>
            </div>
          </div>

          {/* 우측: 분석 결과 (2/3) */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <div className="bg-white rounded-lg shadow-lg p-6 flex-1 flex flex-col overflow-hidden">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex-shrink-0">분석 결과</h2>
              
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">AI가 리뷰를 분석하고 있습니다...</p>
                    <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요.</p>
                  </div>
                ) : analysisResult ? (
                  <div className="pb-6">
                    <AnalysisResultComponent 
                      result={analysisResult} 
                      onDownload={handleDownload}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-lg font-medium mb-2">분석 결과가 여기에 표시됩니다</p>
                    <p className="text-sm text-center">
                      좌측에서 고객 리뷰와 제품 정보를 입력한 후<br />
                      &ldquo;분석 시작&rdquo; 버튼을 클릭해주세요.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-white border-t flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2024 AI 고객 리뷰 분석 시스템. OpenAI GPT-4를 활용한 감성 분석 서비스입니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
