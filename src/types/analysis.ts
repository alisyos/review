export interface AnalysisRequest {
  customerReview: string;
  productServiceGroup: string;
  productServiceName: string;
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

export interface AnalysisResult {
  product: string;
  totalReviewCount: number;
  positiveReviewCount: number;
  negativeReviewCount: number;
  positiveKeywords: Keyword[];
  negativeKeywords: Keyword[];
  insights: Insights;
} 