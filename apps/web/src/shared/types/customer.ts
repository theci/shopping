/**
 * 고객 상태
 */
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN';

/**
 * 고객 정보
 */
export interface Customer {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 배송지 정보
 */
export interface Address {
  id: number;
  recipientName: string;
  phoneNumber: string;
  zipCode: string;
  address: string;
  addressDetail?: string;
  isDefault: boolean;
}

/**
 * 프로필 수정 요청
 */
export interface UpdateProfileRequest {
  name?: string;
  phoneNumber?: string;
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
 * 배송지 생성/수정 요청
 */
export interface AddressRequest {
  recipientName: string;
  phoneNumber: string;
  zipCode: string;
  address: string;
  addressDetail?: string;
  isDefault?: boolean;
}
