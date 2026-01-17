import axios from 'axios';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * JWT 토큰 관리자
 */
export const tokenManager = {
  /**
   * Access Token 조회
   */
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Access Token 저장
   */
  setAccessToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  /**
   * Refresh Token 조회
   */
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Refresh Token 저장
   */
  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  /**
   * 토큰 일괄 저장
   */
  setTokens: (accessToken: string, refreshToken: string): void => {
    tokenManager.setAccessToken(accessToken);
    tokenManager.setRefreshToken(refreshToken);
  },

  /**
   * 토큰 일괄 삭제
   */
  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Access Token 갱신
   */
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

      // Refresh Token도 갱신된 경우
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

  /**
   * 토큰 유효성 확인 (간단한 존재 여부 체크)
   */
  hasValidToken: (): boolean => {
    const token = tokenManager.getAccessToken();
    return !!token;
  },
};
