import type { Customer } from '@/shared/types/customer';

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
  customer: Customer;
}

/**
 * 회원가입 요청
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
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
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type { Customer };
