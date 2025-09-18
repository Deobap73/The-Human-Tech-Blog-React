// File: /src/shared/services/atsService.ts
// Description: Calls ATS endpoints on the backend. Assumes server validates PayPal capture before generating.

import { ApiResponse, AtsGenerationPayload, AtsGenerationResult } from '../../types/Ats';
import axios from '../utils/axios';

export const generateCoverLetter = async (
  payload: AtsGenerationPayload
): Promise<ApiResponse<AtsGenerationResult>> => {
  try {
    const { data } = await axios.post<ApiResponse<AtsGenerationResult>>(
      '/api/ats/generate',
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return data ?? { success: false, message: 'Empty response from server' };
  } catch (err: any) {
    console.error('generateCoverLetter error:', err);
    return { success: false, message: err?.response?.data?.message ?? 'Generation failed' };
  }
};
