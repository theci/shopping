/**
 * Auth API
 */

import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  customer: {
    id: number;
    email: string;
    name: string;
    phoneNumber?: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/api/v1/auth/login',
      data
    );
    return (response as any).data;
  },

  register: async (data: RegisterRequest): Promise<void> => {
    await apiClient.post('/api/v1/auth/register', data);
  },

  getMe: async () => {
    const response = await apiClient.get('/api/v1/customers/me');
    return (response as any).data;
  },
};
