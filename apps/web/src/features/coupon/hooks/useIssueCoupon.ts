/**
 * 쿠폰 발급 Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { couponApi } from '../api/couponApi';
import { couponKeys } from './useCoupons';
import { useToast } from '@/shared/hooks';
import type { CouponIssueRequest } from '../types';

/**
 * 쿠폰 코드로 발급받기
 */
export const useIssueCoupon = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: CouponIssueRequest) => couponApi.issueCoupon(data),
    onSuccess: (coupon) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      showToast({
        type: 'success',
        message: `${coupon.name} 쿠폰이 발급되었습니다.`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '쿠폰 발급에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};
