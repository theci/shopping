/**
 * Coupon Feature Types
 */

export type { ApiResponse, PageResponse } from '@/lib/api/types';

/**
 * 쿠폰 타입
 */
export type CouponType = 'PERCENTAGE' | 'FIXED_AMOUNT';

/**
 * 쿠폰 상태
 */
export type CouponStatus = 'ACTIVE' | 'USED' | 'EXPIRED' | 'DISABLED';

/**
 * 쿠폰 정보
 */
export interface Coupon {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: CouponType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validUntil: string;
  status: CouponStatus;
  usedAt?: string;
  createdAt: string;
}

/**
 * 고객 쿠폰 (발급된 쿠폰)
 */
export interface CustomerCoupon {
  id: number;
  couponId: number;
  customerId: number;
  code: string;
  name: string;
  description?: string;
  type: CouponType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validUntil: string;
  status: CouponStatus;
  usedAt?: string;
  issuedAt: string;
}

/**
 * 쿠폰 검색 파라미터
 */
export interface CouponSearchParams {
  page?: number;
  size?: number;
  status?: CouponStatus;
}

/**
 * 쿠폰 유효성 검증 요청
 */
export interface CouponValidateRequest {
  couponCode: string;
  orderAmount: number;
}

/**
 * 쿠폰 유효성 검증 응답
 */
export interface CouponValidateResponse {
  valid: boolean;
  coupon?: CustomerCoupon;
  discountAmount: number;
  message?: string;
}

/**
 * 쿠폰 적용 요청
 */
export interface CouponApplyRequest {
  couponId: number;
  orderAmount: number;
}

/**
 * 쿠폰 적용 응답
 */
export interface CouponApplyResponse {
  couponId: number;
  discountAmount: number;
  finalAmount: number;
}

/**
 * 쿠폰 발급 요청
 */
export interface CouponIssueRequest {
  couponCode: string;
}

/**
 * 쿠폰 상태 정보
 */
export const COUPON_STATUS_MAP: Record<CouponStatus, { label: string; color: string }> = {
  ACTIVE: { label: '사용 가능', color: 'green' },
  USED: { label: '사용 완료', color: 'gray' },
  EXPIRED: { label: '기간 만료', color: 'red' },
  DISABLED: { label: '비활성화', color: 'gray' },
};

/**
 * 쿠폰 타입 정보
 */
export const COUPON_TYPE_MAP: Record<CouponType, { label: string; format: (value: number) => string }> = {
  PERCENTAGE: {
    label: '정률 할인',
    format: (value: number) => `${value}%`,
  },
  FIXED_AMOUNT: {
    label: '정액 할인',
    format: (value: number) => `${value.toLocaleString()}원`,
  },
};
