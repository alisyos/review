export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromptUpdateRequest {
  name?: string;
  description?: string;
  content?: string;
  isActive?: boolean;
} 