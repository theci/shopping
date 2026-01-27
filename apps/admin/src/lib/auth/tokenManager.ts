import axios from 'axios';

const ACCESS_TOKEN_KEY = 'admin_accessToken';
const REFRESH_TOKEN_KEY = 'admin_refreshToken';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * JWT 토큰 관리자 (Admin)
 */
export const tokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    tokenManager.setAccessToken(accessToken);
    tokenManager.setRefreshToken(refreshToken);
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  refreshAccessToken: async (): Promise<string> => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
        refreshToken,
      });

      const newAccessToken = response.data.data?.accessToken || response.data.accessToken;
      if (newAccessToken) {
        tokenManager.setAccessToken(newAccessToken);
      }

      const newRefreshToken = response.data.data?.refreshToken || response.data.refreshToken;
      if (newRefreshToken) {
        tokenManager.setRefreshToken(newRefreshToken);
      }

      return newAccessToken;
    } catch (error) {
      tokenManager.clearTokens();
      throw error;
    }
  },

  hasValidToken: (): boolean => {
    const token = tokenManager.getAccessToken();
    return !!token;
  },
};
