'use client';

import { useState } from 'react';
import { AnalysisRequest } from '@/types/analysis';
// @ts-ignore
import mammoth from 'mammoth';

interface ReviewFormProps {
  onSubmit: (data: AnalysisRequest) => void;
  isLoading: boolean;
}

type InputMethod = 'text' | 'file';

export default function ReviewForm({ onSubmit, isLoading }: ReviewFormProps) {
  const [formData, setFormData] = useState<AnalysisRequest>({
    customerReview: '',
    productServiceGroup: '',
    productServiceName: '',
  });
  
  const [inputMethod, setInputMethod] = useState<InputMethod>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        let content = '';
        
        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
          // 워드 파일 처리
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          content = result.value;
        } else {
          // 텍스트 파일 처리 (txt, csv)
          const reader = new FileReader();
          reader.onload = (event) => {
            const textContent = event.target?.result as string;
            setFormData(prev => ({ ...prev, customerReview: textContent }));
          };
          reader.readAsText(file);
          return;
        }
        
        setFormData(prev => ({ ...prev, customerReview: content }));
      } catch (error) {
        console.error('파일 읽기 오류:', error);
        alert('파일을 읽는 중 오류가 발생했습니다. 다른 파일을 시도해주세요.');
      }
    }
  };

  const handleInputMethodChange = (method: InputMethod) => {
    setInputMethod(method);
    // 입력 방식 변경 시 리뷰 내용 초기화
    setFormData(prev => ({ ...prev, customerReview: '' }));
  };

  return (
    <div className="h-full flex flex-col">
      <form onSubmit={handleSubmit} className="space-y-3 flex-1 flex flex-col">
        {/* 제품/서비스 군 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제품/서비스 군
          </label>
          <input
            type="text"
            value={formData.productServiceGroup}
            onChange={(e) => setFormData(prev => ({ ...prev, productServiceGroup: e.target.value }))}
            placeholder="예: 핸드폰, 노트북, 음식점 등"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* 제품/서비스 이름 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제품/서비스 이름
          </label>
          <input
            type="text"
            value={formData.productServiceName}
            onChange={(e) => setFormData(prev => ({ ...prev, productServiceName: e.target.value }))}
            placeholder="예: 갤럭시 S24, 맥북 프로, 맛집 이름 등"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* 고객 리뷰 입력 방식 선택 */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            고객 리뷰 입력 방식
          </label>
          
          {/* 입력 방식 선택 라디오 버튼 */}
          <div className="flex space-x-6 mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="inputMethod"
                value="text"
                checked={inputMethod === 'text'}
                onChange={() => handleInputMethodChange('text')}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">직접 입력</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="inputMethod"
                value="file"
                checked={inputMethod === 'file'}
                onChange={() => handleInputMethodChange('file')}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">파일 업로드</span>
            </label>
          </div>

          {/* 선택된 입력 방식에 따른 UI */}
          <div className="mb-2">
            {inputMethod === 'text' ? (
              <textarea
                value={formData.customerReview}
                onChange={(e) => setFormData(prev => ({ ...prev, customerReview: e.target.value }))}
                placeholder="고객 리뷰를 입력해주세요..."
                className="w-full h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            ) : (
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-3 flex flex-col items-center justify-center h-[120px] hover:border-blue-400 transition-colors">
                  <div className="text-center">
                    <svg className="mx-auto h-6 w-6 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-xs text-gray-600 mb-1">
                      {formData.customerReview ? '파일이 업로드되었습니다' : '파일을 선택하거나 드래그하여 업로드하세요'}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      .txt, .csv, .docx 파일을 지원합니다
                    </p>
                    <input
                      type="file"
                      accept=".txt,.csv,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs"
                    >
                      파일 선택
                    </label>
                  </div>
                </div>
                
                {/* 업로드된 파일 내용 미리보기 */}
                {formData.customerReview && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700">업로드된 내용 미리보기</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, customerReview: '' }))}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        삭제
                      </button>
                    </div>
                    <div className="text-xs text-gray-600 max-h-12 overflow-y-auto">
                      {formData.customerReview.substring(0, 150)}
                      {formData.customerReview.length > 150 && '...'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      총 {formData.customerReview.length}자
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              분석 중...
            </div>
          ) : (
            '분석 시작'
          )}
        </button>
      </form>
    </div>
  );
} 