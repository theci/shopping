/**
 * Admin Auth Types
 */

export type { ApiResponse } from '@/lib/api/types';

/**
 * 관리자 역할
 */
export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER';

/**
 * 관리자 정보
 */
export interface Admin {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
  lastLoginAt?: string;
}

/**
 * 로그인 요청
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 로그인 응답
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  admin: Admin;
}

/**
 * 토큰 갱신 요청
 */
export interface TokenRefreshRequest {
  refreshToken: string;
}

/**
 * 토큰 갱신 응답
 */
export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

/**
 * 인증 상태
 */
export interface AuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

/**
 * 관리자 역할 정보
 */
export const ADMIN_ROLE_MAP: Record<AdminRole, { label: string; color: string }> = {
  SUPER_ADMIN: { label: '최고관리자', color: 'danger' },
  ADMIN: { label: '관리자', color: 'primary' },
  MANAGER: { label: '매니저', color: 'info' },
};
