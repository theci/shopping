/**
 * Customer Management Types
 */

export type { ApiResponse, PageResponse } from '@/lib/api/types';

/**
 * 고객 상태
 */
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'WITHDRAWN';

/**
 * 고객 목록 아이템
 */
export interface CustomerListItem {
  id: number;
  email: string;
  name: string;
  phone?: string;
  status: CustomerStatus;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
  lastLoginAt?: string;
}

/**
 * 고객 상세
 */
export interface Customer {
  id: number;
  email: string;
  name: string;
  phone?: string;
  status: CustomerStatus;
  orderCount: number;
  totalSpent: number;
  addresses?: CustomerAddress[];
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

/**
 * 고객 배송지
 */
export interface CustomerAddress {
  id: number;
  recipientName: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail?: string;
  isDefault: boolean;
}

/**
 * 고객 주문 내역 (간략)
 */
export interface CustomerOrder {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
}

/**
 * 고객 검색 파라미터
 */
export interface CustomerSearchParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: CustomerStatus;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

/**
 * 고객 상태 변경 요청
 */
export interface CustomerStatusUpdateRequest {
  status: CustomerStatus;
  reason?: string;
}

/**
 * 고객 상태 정보
 */
export const CUSTOMER_STATUS_MAP: Record<
  CustomerStatus,
  { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }
> = {
  ACTIVE: { label: '정상', variant: 'success' },
  INACTIVE: { label: '휴면', variant: 'warning' },
  SUSPENDED: { label: '정지', variant: 'danger' },
  WITHDRAWN: { label: '탈퇴', variant: 'default' },
};
