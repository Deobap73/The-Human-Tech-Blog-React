// src/shared/types/AiPrompt.ts
export interface AiPromptTranslation {
  title: string;
  description: string;
  content: string;
}

export type AiPromptTranslations = {
  en: AiPromptTranslation;
  pt?: AiPromptTranslation;
  de?: AiPromptTranslation;
  es?: AiPromptTranslation;
  [key: string]: AiPromptTranslation | undefined;
};

export interface AiPrompt {
  _id: string;
  translations: AiPromptTranslations;
  image?: string;
  slug: string;
  categories: string[];
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  isAiPrompt?: boolean;
  author?: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}
