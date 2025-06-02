export interface AnalysisResult {
  product: string;
  analysisDate: string;
  totalReviewCount: number;
  positiveReviewCount: number;
  negativeReviewCount: number;
  positiveKeywords: Keyword[];
  negativeKeywords: Keyword[];
  insights: Insights;
}

export interface Keyword {
  keyword: string;
  frequency: number;
  sampleReviews: string[];
}

export interface Insights {
  improvementIdeas: string[];
  marketingStrategy: string;
  promoCopies: string[];
}

export interface AnalysisRequest {
  customerReview: string;
  productServiceGroup: string;
  productServiceName: string;
} 