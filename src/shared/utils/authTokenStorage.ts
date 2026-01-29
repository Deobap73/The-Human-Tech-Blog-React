// ./src/shared/utils/authTokenStorage.ts
'use strict';

let accessToken: string | null = localStorage.getItem('access_token');

export const setAccessToken = (token: string): void => {
  accessToken = token;
  localStorage.setItem('access_token', token);
};

export const getAccessToken = (): string | null => {
  if (!accessToken) {
    accessToken = localStorage.getItem('access_token');
  }
  return accessToken;
};

/**
 * Removes the persisted access token.
 * This must delete the same storage key used by setAccessToken.
 */
export const removeAccessToken = (): void => {
  accessToken = null;
  localStorage.removeItem('access_token');
};
