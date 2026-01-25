/**
 * 쿠폰 조회 관련 Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { couponApi } from '../api/couponApi';
import { useAuthStore } from '@/features/auth';
import type { CouponSearchParams } from '../types';

/**
 * React Query 캐시 키
 */
export const couponKeys = {
  all: ['coupons'] as const,
  lists: () => [...couponKeys.all, 'list'] as const,
  list: (params?: CouponSearchParams) => [...couponKeys.lists(), params] as const,
  available: (orderAmount: number) => [...couponKeys.all, 'available', orderAmount] as const,
  details: () => [...couponKeys.all, 'detail'] as const,
  detail: (id: number) => [...couponKeys.details(), id] as const,
};

/**
 * 내 쿠폰 목록 조회
 */
export const useCoupons = (params?: CouponSearchParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: couponKeys.list(params),
    queryFn: () => couponApi.getMyCoupons(params),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

/**
 * 사용 가능한 쿠폰 목록 조회 (주문 금액 기준)
 */
export const useAvailableCoupons = (orderAmount: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: couponKeys.available(orderAmount),
    queryFn: () => couponApi.getAvailableCoupons(orderAmount),
    enabled: isAuthenticated && orderAmount > 0,
    staleTime: 1000 * 60, // 1분
  });
};

/**
 * 쿠폰 상세 조회
 */
export const useCoupon = (couponId: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: couponKeys.detail(couponId),
    queryFn: () => couponApi.getCoupon(couponId),
    enabled: isAuthenticated && !!couponId,
  });
};
