import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { AnalysisResult } from '@/types/analysis';

export const downloadAsHTML = (result: AnalysisResult) => {
  const positivePercentage = ((result.positiveReviewCount / result.totalReviewCount) * 100).toFixed(1);
  const negativePercentage = ((result.negativeReviewCount / result.totalReviewCount) * 100).toFixed(1);

  const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${result.product} 리뷰 분석 결과</title>
    <style>
        body { font-family: 'Malgun Gothic', sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
        .date { color: #6b7280; }
        .section { margin-bottom: 40px; }
        .section-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #374151; }
        .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .stat-item { display: flex; justify-content: space-between; padding: 10px 0; }
        .positive { color: #059669; }
        .negative { color: #dc2626; }
        .keyword-item { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
        .keyword-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .keyword-name { font-weight: bold; }
        .keyword-frequency { background: #f3f4f6; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
        .sample-review { background: #f9fafb; padding: 10px; margin: 5px 0; border-radius: 5px; font-size: 14px; }
        .insight-item { margin-bottom: 10px; }
        .marketing-strategy { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 15px 0; }
        .promo-copy { background: linear-gradient(135deg, #fce7f3, #e0e7ff); padding: 15px; border-radius: 8px; text-align: center; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${result.product} 리뷰 분석 결과</h1>
        <p class="date">분석 날짜: ${result.analysisDate}</p>
    </div>

    <div class="section">
        <h2 class="section-title">긍부정 평가</h2>
        <div class="stats">
            <div>
                <div class="stat-item">
                    <span>전체 리뷰 수:</span>
                    <span><strong>${result.totalReviewCount}개</strong></span>
                </div>
                <div class="stat-item positive">
                    <span>긍정 리뷰:</span>
                    <span><strong>${result.positiveReviewCount}개 (${positivePercentage}%)</strong></span>
                </div>
                <div class="stat-item negative">
                    <span>부정 리뷰:</span>
                    <span><strong>${result.negativeReviewCount}개 (${negativePercentage}%)</strong></span>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title positive">긍정 리뷰 분석</h2>
        ${result.positiveKeywords.map(keyword => `
            <div class="keyword-item">
                <div class="keyword-header">
                    <span class="keyword-name">#${keyword.keyword}</span>
                    <span class="keyword-frequency">${keyword.frequency}회 언급</span>
                </div>
                ${keyword.sampleReviews.map(review => `
                    <div class="sample-review">"${review}"</div>
                `).join('')}
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2 class="section-title negative">부정 리뷰 분석</h2>
        ${result.negativeKeywords.map(keyword => `
            <div class="keyword-item">
                <div class="keyword-header">
                    <span class="keyword-name">#${keyword.keyword}</span>
                    <span class="keyword-frequency">${keyword.frequency}회 언급</span>
                </div>
                ${keyword.sampleReviews.map(review => `
                    <div class="sample-review">"${review}"</div>
                `).join('')}
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2 class="section-title">개선방안 및 인사이트</h2>
        
        <h3>개선 아이디어</h3>
        <ul>
            ${result.insights.improvementIdeas.map(idea => `<li class="insight-item">${idea}</li>`).join('')}
        </ul>

        <h3>마케팅 전략</h3>
        <div class="marketing-strategy">
            ${result.insights.marketingStrategy}
        </div>

        <h3>홍보 카피</h3>
        ${result.insights.promoCopies.map(copy => `
            <div class="promo-copy">"${copy}"</div>
        `).join('')}
    </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `${result.product}_리뷰분석결과_${result.analysisDate}.html`);
};

export const downloadAsDocx = async (result: AnalysisResult) => {
  const positivePercentage = ((result.positiveReviewCount / result.totalReviewCount) * 100).toFixed(1);
  const negativePercentage = ((result.negativeReviewCount / result.totalReviewCount) * 100).toFixed(1);

  const doc = new Document({
    sections: [
      {
        children: [
          // 제목
          new Paragraph({
            text: `${result.product} 리뷰 분석 결과`,
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            text: `분석 날짜: ${result.analysisDate}`,
          }),
          new Paragraph({ text: '' }), // 빈 줄

          // 긍부정 평가
          new Paragraph({
            text: '긍부정 평가',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: `전체 리뷰 수: ${result.totalReviewCount}개`,
          }),
          new Paragraph({
            text: `긍정 리뷰: ${result.positiveReviewCount}개 (${positivePercentage}%)`,
          }),
          new Paragraph({
            text: `부정 리뷰: ${result.negativeReviewCount}개 (${negativePercentage}%)`,
          }),
          new Paragraph({ text: '' }),

          // 긍정 리뷰 분석
          new Paragraph({
            text: '긍정 리뷰 분석',
            heading: HeadingLevel.HEADING_1,
          }),
          ...result.positiveKeywords.flatMap(keyword => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `#${keyword.keyword}`,
                  bold: true,
                }),
                new TextRun({
                  text: ` (${keyword.frequency}회 언급)`,
                }),
              ],
            }),
            ...keyword.sampleReviews.map(review => 
              new Paragraph({
                text: `"${review}"`,
                indent: { left: 720 }, // 들여쓰기
              })
            ),
            new Paragraph({ text: '' }),
          ]),

          // 부정 리뷰 분석
          new Paragraph({
            text: '부정 리뷰 분석',
            heading: HeadingLevel.HEADING_1,
          }),
          ...result.negativeKeywords.flatMap(keyword => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `#${keyword.keyword}`,
                  bold: true,
                }),
                new TextRun({
                  text: ` (${keyword.frequency}회 언급)`,
                }),
              ],
            }),
            ...keyword.sampleReviews.map(review => 
              new Paragraph({
                text: `"${review}"`,
                indent: { left: 720 },
              })
            ),
            new Paragraph({ text: '' }),
          ]),

          // 개선방안 및 인사이트
          new Paragraph({
            text: '개선방안 및 인사이트',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: '개선 아이디어',
            heading: HeadingLevel.HEADING_2,
          }),
          ...result.insights.improvementIdeas.map(idea => 
            new Paragraph({
              text: `• ${idea}`,
            })
          ),
          new Paragraph({ text: '' }),

          new Paragraph({
            text: '마케팅 전략',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: result.insights.marketingStrategy,
          }),
          new Paragraph({ text: '' }),

          new Paragraph({
            text: '홍보 카피',
            heading: HeadingLevel.HEADING_2,
          }),
          ...result.insights.promoCopies.map(copy => 
            new Paragraph({
              text: `"${copy}"`,
            })
          ),
        ],
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  saveAs(buffer, `${result.product}_리뷰분석결과_${result.analysisDate}.docx`);
}; 