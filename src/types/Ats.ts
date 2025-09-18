// File: /src/shared/types/Ats.ts
// Description: Shared types for ATS feature.

export type AtsLanguage = 'en' | 'pt' | 'es' | 'de';
export type AtsTone = 'professional' | 'provocative' | 'friendly';
export type AtsSeniority = 'junior' | 'mid' | 'senior';

export interface AtsOptions {
  language: AtsLanguage;
  tone: AtsTone;
  seniority: AtsSeniority;
  includeKeywords: string[];
}

export interface AtsGenerationPayload {
  cvText: string;
  jobAdText: string;
  options: AtsOptions;
}

export interface AtsGenerationResult {
  coverLetter: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
