/**
 * JWT 토큰 관리
 */

import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenManager = {
  getAccessToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setAccessToken: async (token: string): Promise<void> => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setRefreshToken: async (token: string): Promise<void> => {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  },

  setTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  clearTokens: async (): Promise<void> => {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },

  hasToken: async (): Promise<boolean> => {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    return !!token;
  },
};
