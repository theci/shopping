/**
 * Admin Auth API
 */

import { api } from '@/lib/api/client';
import type { LoginRequest, LoginResponse, Admin, ApiResponse } from '../types';

export const authApi = {
  /**
   * 관리자 로그인
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>(
      '/api/v1/admin/auth/login',
      data
    );
    return response.data;
  },

  /**
   * 내 정보 조회
   */
  getMe: async (): Promise<Admin> => {
    const response = await api.get<ApiResponse<Admin>>('/api/v1/admin/auth/me');
    return response.data;
  },

  /**
   * 로그아웃
   */
  logout: async (): Promise<void> => {
    await api.post('/api/v1/admin/auth/logout');
  },
};
