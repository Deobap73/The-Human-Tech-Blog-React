// src/shared/services/aiPromptService.ts
import api from '../utils/axios';
import { AiPrompt } from '../types/iPrompt';

/**
 * Fetch all AI Prompts (short-form articles)
 */
export async function getAiPrompts(): Promise<AiPrompt[]> {
  const res = await api.get<AiPrompt[]>('/ai-prompts', { withCredentials: true });
  return res.data;
}
