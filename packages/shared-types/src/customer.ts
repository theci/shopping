/**
 * 고객 관련 타입 - 백엔드 CustomerResponse와 일치
 */

/**
 * 고객 상태
 */
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN';

/**
 * 고객 등급
 */
export type CustomerLevel = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'VIP';

/**
 * 고객 역할
 */
export type CustomerRole = 'USER' | 'ADMIN';

/**
 * 배송지 응답
 */
export interface Address {
  id: number;
  recipientName: string;
  phoneNumber: string;
  postalCode: string;
  address: string;
  addressDetail?: string;
  isDefault: boolean;
  createdAt: string;
}

/**
 * 고객 응답 (백엔드 CustomerResponse)
 */
export interface Customer {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  status: CustomerStatus;
  customerLevel?: CustomerLevel;
  role?: CustomerRole;
  totalPurchaseAmount?: number;
  addresses?: Address[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 회원가입 요청
 */
export interface CustomerRegisterRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

/**
 * 고객 정보 수정 요청
 */
export interface CustomerUpdateRequest {
  name?: string;
  phoneNumber?: string;
}

/**
 * 배송지 요청
 */
export interface AddressRequest {
  recipientName: string;
  phoneNumber: string;
  postalCode: string;
  address: string;
  addressDetail?: string;
  isDefault?: boolean;
}

/**
 * 비밀번호 변경 요청
 */
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
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
  tokenType: string;
  expiresIn: number;
  customer: Customer;
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
  tokenType: string;
  expiresIn: number;
}
