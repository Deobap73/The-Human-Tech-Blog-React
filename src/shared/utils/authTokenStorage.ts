// src/shared/utils/authTokenStorage.ts
let accessToken: string | null = localStorage.getItem('access_token');

export const setAccessToken = (token: string): void => {
  accessToken = token;
  localStorage.setItem('access_token', token);
};

export const getAccessToken = (): string | null => {
  if (!accessToken) {
    accessToken = localStorage.getItem('access_token'); // ✅ garante persistência real
  }
  return accessToken;
};
