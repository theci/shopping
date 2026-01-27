/**
 * Admin Auth API
 */

import { api } from '@/lib/api/client';
import type { LoginRequest, LoginResponse, Admin, ApiResponse } from '../types';

export const authApi = {
  /**
   * 관리자 로그인 (일반 인증 API 사용, role 검증은 클라이언트에서 수행)
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>(
      '/api/v1/auth/login',
      data
    );
    return response.data;
  },

  /**
   * 내 정보 조회
   */
  getMe: async (): Promise<Admin> => {
    const response = await api.get<ApiResponse<Admin>>('/api/v1/customers/me');
    return response.data;
  },

  /**
   * 로그아웃 (클라이언트에서 토큰 삭제)
   */
  logout: async (): Promise<void> => {
    // 서버 측 로그아웃 API가 없으므로 클라이언트에서만 처리
  },
};
