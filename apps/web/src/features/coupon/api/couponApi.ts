/**
 * Coupon API
 */

import { api } from '@/lib/api/client';
import type {
  CustomerCoupon,
  CouponSearchParams,
  CouponValidateRequest,
  CouponValidateResponse,
  CouponApplyResponse,
  CouponIssueRequest,
  ApiResponse,
  PageResponse,
} from '../types';

export const couponApi = {
  /**
   * 내 쿠폰 목록 조회
   */
  getMyCoupons: async (params?: CouponSearchParams): Promise<PageResponse<CustomerCoupon>> => {
    const response = await api.get<ApiResponse<PageResponse<CustomerCoupon>>>(
      '/api/v1/coupons/me',
      params
    );
    return response.data;
  },

  /**
   * 사용 가능한 쿠폰 목록 조회 (주문 금액 기준)
   */
  getAvailableCoupons: async (orderAmount: number): Promise<CustomerCoupon[]> => {
    const response = await api.get<ApiResponse<CustomerCoupon[]>>(
      '/api/v1/coupons/available',
      { orderAmount }
    );
    return response.data;
  },

  /**
   * 쿠폰 상세 조회
   */
  getCoupon: async (couponId: number): Promise<CustomerCoupon> => {
    const response = await api.get<ApiResponse<CustomerCoupon>>(
      `/api/v1/coupons/${couponId}`
    );
    return response.data;
  },

  /**
   * 쿠폰 코드로 발급받기
   */
  issueCoupon: async (data: CouponIssueRequest): Promise<CustomerCoupon> => {
    const response = await api.post<ApiResponse<CustomerCoupon>>(
      '/api/v1/coupons/issue',
      data
    );
    return response.data;
  },

  /**
   * 쿠폰 유효성 검증
   */
  validateCoupon: async (data: CouponValidateRequest): Promise<CouponValidateResponse> => {
    const response = await api.post<ApiResponse<CouponValidateResponse>>(
      '/api/v1/coupons/validate',
      data
    );
    return response.data;
  },

  /**
   * 쿠폰 할인 금액 계산
   */
  calculateDiscount: async (
    couponId: number,
    orderAmount: number
  ): Promise<CouponApplyResponse> => {
    const response = await api.post<ApiResponse<CouponApplyResponse>>(
      `/api/v1/coupons/${couponId}/calculate`,
      { orderAmount }
    );
    return response.data;
  },
};
