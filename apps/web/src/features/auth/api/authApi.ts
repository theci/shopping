import { apiClient } from '@/lib/api/client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  TokenRefreshRequest,
  TokenRefreshResponse,
  Customer,
} from '../types';

/**
 * 인증 관련 API
 */
export const authApi = {
  /**
   * 회원가입
   */
  register: async (data: RegisterRequest): Promise<Customer> => {
    const response = await apiClient.post<{ data: Customer }>(
      '/api/v1/auth/register',
      data
    );
    return response.data.data;
  },

  /**
   * 로그인
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<{ data: LoginResponse }>(
      '/api/v1/auth/login',
      data
    );
    return response.data.data;
  },

  /**
   * 토큰 갱신
   */
  refreshToken: async (data: TokenRefreshRequest): Promise<TokenRefreshResponse> => {
    const response = await apiClient.post<{ data: TokenRefreshResponse }>(
      '/api/v1/auth/refresh',
      data
    );
    return response.data.data;
  },

  /**
   * 내 정보 조회
   */
  getMe: async (): Promise<Customer> => {
    const response = await apiClient.get<{ data: Customer }>('/api/v1/customers/me');
    return response.data.data;
  },
};
