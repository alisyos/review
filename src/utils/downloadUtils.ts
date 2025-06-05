import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { AnalysisResult } from '@/types/analysis';

export function downloadAsHTML(result: AnalysisResult) {
  const currentDate = new Date().toLocaleDateString('ko-KR');
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${result.product} - 리뷰 분석 결과</title>
    <style>
        body { font-family: 'Malgun Gothic', sans-serif; margin: 40px; line-height: 1.6; }
        .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #1f2937; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .date { color: #6b7280; font-size: 14px; }
        .section { margin-bottom: 30px; }
        .section-title { color: #1f2937; font-size: 20px; font-weight: bold; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 10px; }
        .stats { display: flex; gap: 20px; margin-bottom: 20px; }
        .stat-item { background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; flex: 1; }
        .stat-number { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .stat-label { color: #6b7280; font-size: 14px; }
        .keywords { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .keyword-section { background: #f9fafb; padding: 20px; border-radius: 8px; }
        .keyword-item { margin-bottom: 15px; padding: 10px; background: white; border-radius: 6px; }
        .keyword-name { font-weight: bold; color: #1f2937; }
        .keyword-freq { color: #6b7280; font-size: 14px; }
        .sample-reviews { margin-top: 8px; }
        .sample-review { background: #f3f4f6; padding: 8px; margin: 4px 0; border-radius: 4px; font-size: 14px; }
        .insights { background: #f0f9ff; padding: 20px; border-radius: 8px; }
        .insight-item { margin-bottom: 15px; }
        .insight-title { font-weight: bold; color: #1f2937; margin-bottom: 8px; }
        .insight-content { color: #374151; }
        .positive { color: #059669; }
        .negative { color: #dc2626; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${result.product} 리뷰 분석 결과</div>
        <div class="date">생성일: ${currentDate}</div>
    </div>

    <div class="section">
        <div class="section-title">📊 분석 개요</div>
        <div class="stats">
            <div class="stat-item">
                <div class="stat-number">${result.totalReviewCount}</div>
                <div class="stat-label">전체 리뷰</div>
            </div>
            <div class="stat-item">
                <div class="stat-number positive">${result.positiveReviewCount}</div>
                <div class="stat-label">긍정 리뷰</div>
            </div>
            <div class="stat-item">
                <div class="stat-number negative">${result.negativeReviewCount}</div>
                <div class="stat-label">부정 리뷰</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">🔍 키워드 분석</div>
        <div class="keywords">
            <div class="keyword-section">
                <h4 class="positive">긍정 키워드</h4>
                ${result.positiveKeywords.map(keyword => `
                    <div class="keyword-item">
                        <div class="keyword-name">${keyword.keyword}</div>
                        <div class="keyword-freq">언급 횟수: ${keyword.frequency}회</div>
                        <div class="sample-reviews">
                            ${keyword.sampleReviews.map(review => `<div class="sample-review">"${review}"</div>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="keyword-section">
                <h4 class="negative">부정 키워드</h4>
                ${result.negativeKeywords.map(keyword => `
                    <div class="keyword-item">
                        <div class="keyword-name">${keyword.keyword}</div>
                        <div class="keyword-freq">언급 횟수: ${keyword.frequency}회</div>
                        <div class="sample-reviews">
                            ${keyword.sampleReviews.map(review => `<div class="sample-review">"${review}"</div>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">💡 인사이트 및 제안</div>
        <div class="insights">
            <div class="insight-item">
                <div class="insight-title">개선 아이디어</div>
                <div class="insight-content">
                    <ul>
                        ${result.insights.improvementIdeas.map(idea => `<li>${idea}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="insight-item">
                <div class="insight-title">마케팅 전략</div>
                <div class="insight-content">
                    ${result.insights.marketingStrategy.split(/\n\n|\n/).filter(p => p.trim()).map(paragraph => 
                        `<p>${paragraph.trim()}</p>`
                    ).join('')}
                </div>
            </div>
            <div class="insight-item">
                <div class="insight-title">홍보 카피</div>
                <div class="insight-content">
                    <ul>
                        ${result.insights.promoCopies.map(copy => `<li>"${copy}"</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${result.product}_리뷰분석_${currentDate.replace(/\./g, '')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function downloadAsDocx(result: AnalysisResult) {
  const currentDate = new Date().toLocaleDateString('ko-KR');
  
  // 문서 생성
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // 제목
        new Paragraph({
          children: [
            new TextRun({
              text: `${result.product} 리뷰 분석 결과`,
              bold: true,
              size: 32,
            }),
          ],
          spacing: { after: 200 },
        }),
        
        // 생성일
        new Paragraph({
          children: [
            new TextRun({
              text: `생성일: ${currentDate}`,
              size: 20,
              color: "666666",
            }),
          ],
          spacing: { after: 400 },
        }),

        // 분석 개요
        new Paragraph({
          children: [
            new TextRun({
              text: "📊 분석 개요",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 200 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({ text: `전체 리뷰: ${result.totalReviewCount}개` }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `긍정 리뷰: ${result.positiveReviewCount}개` }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `부정 리뷰: ${result.negativeReviewCount}개` }),
          ],
          spacing: { after: 400 },
        }),

        // 긍정 키워드
        new Paragraph({
          children: [
            new TextRun({
              text: "🔍 긍정 키워드",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 200 },
        }),
        
        ...result.positiveKeywords.flatMap(keyword => [
          new Paragraph({
            children: [
              new TextRun({
                text: `${keyword.keyword} (${keyword.frequency}회 언급)`,
                bold: true,
              }),
            ],
          }),
          ...keyword.sampleReviews.map(review => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `  • "${review}"`,
                  italics: true,
                }),
              ],
            })
          ),
          new Paragraph({ children: [new TextRun({ text: "" })] }), // 빈 줄
        ]),

        // 부정 키워드
        new Paragraph({
          children: [
            new TextRun({
              text: "🔍 부정 키워드",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 200 },
        }),
        
        ...result.negativeKeywords.flatMap(keyword => [
          new Paragraph({
            children: [
              new TextRun({
                text: `${keyword.keyword} (${keyword.frequency}회 언급)`,
                bold: true,
              }),
            ],
          }),
          ...keyword.sampleReviews.map(review => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `  • "${review}"`,
                  italics: true,
                }),
              ],
            })
          ),
          new Paragraph({ children: [new TextRun({ text: "" })] }), // 빈 줄
        ]),

        // 인사이트
        new Paragraph({
          children: [
            new TextRun({
              text: "💡 인사이트 및 제안",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 400, after: 200 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "개선 아이디어:",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        
        ...result.insights.improvementIdeas.map(idea => 
          new Paragraph({
            children: [
              new TextRun({ text: `• ${idea}` }),
            ],
          })
        ),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "마케팅 전략:",
              bold: true,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        
        ...result.insights.marketingStrategy.split(/\n\n|\n/).filter(paragraph => paragraph.trim()).map(paragraph =>
          new Paragraph({
            children: [
              new TextRun({ text: paragraph.trim() }),
            ],
            spacing: { after: 100 },
          })
        ),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "홍보 카피:",
              bold: true,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        
        ...result.insights.promoCopies.map(copy => 
          new Paragraph({
            children: [
              new TextRun({ text: `• "${copy}"` }),
            ],
          })
        ),
      ],
    }],
  });

  // 파일 생성 및 다운로드
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
  
  saveAs(blob, `${result.product}_리뷰분석_${currentDate.replace(/\./g, '')}.docx`);
} 