'use client';

import { useState, useEffect } from 'react';
import { PromptTemplate } from '@/types/prompt';

interface PromptEditorProps {
  onSave: (prompt: PromptTemplate) => void;
  onCancel: () => void;
  initialPrompt?: PromptTemplate;
}

export default function PromptEditor({ onSave, onCancel, initialPrompt }: PromptEditorProps) {
  const [formData, setFormData] = useState({
    name: initialPrompt?.name || '',
    description: initialPrompt?.description || '',
    content: initialPrompt?.content || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const promptData: PromptTemplate = {
        id: initialPrompt?.id || `prompt_${Date.now()}`,
        name: formData.name,
        description: formData.description,
        content: formData.content,
        isActive: true,
        createdAt: initialPrompt?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSave(promptData);
    } catch (error) {
      console.error('프롬프트 저장 오류:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {initialPrompt ? '프롬프트 편집' : '새 프롬프트 생성'}
        </h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            form="prompt-form"
            disabled={isSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      <form id="prompt-form" onSubmit={handleSubmit} className="space-y-6">
        {/* 프롬프트 이름 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            프롬프트 이름 *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="예: 기본 분석 프롬프트"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* 프롬프트 설명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            설명
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="프롬프트에 대한 간단한 설명을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 프롬프트 내용 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            프롬프트 내용 *
          </label>
          <div className="mb-2 text-sm text-gray-600">
            <p>사용 가능한 변수:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><code className="bg-gray-100 px-1 rounded">{'{customerReview}'}</code> - 고객 리뷰 내용</li>
              <li><code className="bg-gray-100 px-1 rounded">{'{productServiceGroup}'}</code> - 제품/서비스 군</li>
              <li><code className="bg-gray-100 px-1 rounded">{'{productServiceName}'}</code> - 제품/서비스 이름</li>
            </ul>
          </div>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="GPT에게 전달할 프롬프트를 입력하세요..."
            className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            required
          />
          <div className="mt-2 text-sm text-gray-500">
            현재 길이: {formData.content.length}자
          </div>
        </div>
      </form>
    </div>
  );
} 