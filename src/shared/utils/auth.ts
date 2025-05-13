// src/shared/utils/auth.ts

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};
