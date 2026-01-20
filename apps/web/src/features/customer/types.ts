/**
 * Customer Feature Types
 */

export type { ApiResponse } from '@/lib/api/types';

/**
 * 고객 정보
 */
export interface Customer {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  phone?: string; // alias for phoneNumber (API compatibility)
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  status?: 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN';
  createdAt: string;
  updatedAt?: string;
}

/**
 * 프로필 수정 요청
 */
export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

/**
 * 비밀번호 변경 요청
 */
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 배송지
 */
export interface Address {
  id: number;
  name: string;
  recipientName: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 배송지 추가/수정 요청
 */
export interface AddressRequest {
  name: string;
  recipientName: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail?: string;
  isDefault?: boolean;
}

/**
 * 회원탈퇴 요청
 */
export interface WithdrawRequest {
  reason?: string;
  password: string;
}
