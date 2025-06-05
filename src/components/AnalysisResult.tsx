'use client';

import { AnalysisResult } from '@/types/analysis';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AnalysisResultProps {
  result: AnalysisResult;
  onDownload: (format: 'html' | 'docx') => void;
}

export default function AnalysisResultComponent({ result, onDownload }: AnalysisResultProps) {
  const sentimentData = [
    { name: '긍정', value: result.positiveReviewCount, color: '#10B981' },
    { name: '부정', value: result.negativeReviewCount, color: '#EF4444' },
  ];

  const positivePercentage = ((result.positiveReviewCount / result.totalReviewCount) * 100).toFixed(1);
  const negativePercentage = ((result.negativeReviewCount / result.totalReviewCount) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{result.product}</h3>
          <p className="text-sm text-gray-600">
            총 {result.totalReviewCount}개 리뷰 분석 완료
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDownload('html')}
            className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            HTML 저장
          </button>
          <button
            onClick={() => onDownload('docx')}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Word 저장
          </button>
        </div>
      </div>

      {/* 긍부정 평가 */}
      <div>
        <h4 className="text-xl font-semibold text-gray-800 mb-4">긍부정 평가</h4>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>전체 리뷰:</span>
              <span className="font-semibold">{result.totalReviewCount}개</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>긍정:</span>
              <span className="font-semibold">{result.positiveReviewCount}개 ({positivePercentage}%)</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>부정:</span>
              <span className="font-semibold">{result.negativeReviewCount}개 ({negativePercentage}%)</span>
            </div>
          </div>
          
          <div className="col-span-2 h-64 flex flex-col">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value}개`, name]}
                  labelFormatter={() => ''}
                />
                <Legend 
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '14px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 키워드 분석 - 좌우 분할 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 긍정 리뷰 분석 */}
        <div>
          <h4 className="text-xl font-semibold text-green-600 mb-4">긍정 리뷰 분석</h4>
          <div className="space-y-4">
            {result.positiveKeywords.map((keyword, index) => (
              <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-semibold text-green-800">#{keyword.keyword}</h5>
                  <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    {keyword.frequency}회 언급
                  </span>
                </div>
                <div className="space-y-2">
                  {keyword.sampleReviews.map((review, reviewIndex) => (
                    <p key={reviewIndex} className="text-sm text-gray-700 bg-white p-3 rounded border-l-4 border-green-300">
                      &ldquo;{review}&rdquo;
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 부정 리뷰 분석 */}
        <div>
          <h4 className="text-xl font-semibold text-red-600 mb-4">부정 리뷰 분석</h4>
          <div className="space-y-4">
            {result.negativeKeywords.map((keyword, index) => (
              <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-semibold text-red-800">#{keyword.keyword}</h5>
                  <span className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded-full">
                    {keyword.frequency}회 언급
                  </span>
                </div>
                <div className="space-y-2">
                  {keyword.sampleReviews.map((review, reviewIndex) => (
                    <p key={reviewIndex} className="text-sm text-gray-700 bg-white p-3 rounded border-l-4 border-red-300">
                      &ldquo;{review}&rdquo;
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 개선방안 및 인사이트 */}
      <div>
        <h4 className="text-xl font-semibold text-gray-800 mb-4">개선방안 및 인사이트</h4>
        
        <div className="grid grid-cols-2 gap-6">
          {/* 개선 아이디어 */}
          <div>
            <h5 className="font-semibold text-gray-700 mb-3">개선 아이디어</h5>
            <ul className="space-y-2">
              {result.insights.improvementIdeas.map((idea, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">{idea}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 홍보 카피 */}
          <div>
            <h5 className="font-semibold text-gray-700 mb-3">홍보 카피</h5>
            <div className="space-y-3">
              {result.insights.promoCopies.map((copy, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                  <p className="text-gray-800 font-medium text-center">&ldquo;{copy}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 마케팅 전략 */}
        <div className="mt-6">
          <h5 className="font-semibold text-gray-700 mb-3">마케팅 전략</h5>
          <div className="bg-blue-50 p-4 rounded-lg">
            {result.insights.marketingStrategy.split(/\n\n|\n/).filter(p => p.trim()).map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-3 last:mb-0">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 