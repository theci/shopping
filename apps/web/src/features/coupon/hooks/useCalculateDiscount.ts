/**
 * 쿠폰 할인 금액 계산 Hook
 */

import { useMutation } from '@tanstack/react-query';
import { couponApi } from '../api/couponApi';

interface CalculateDiscountParams {
  couponId: number;
  orderAmount: number;
}

/**
 * 쿠폰 할인 금액 계산
 */
export const useCalculateDiscount = () => {
  return useMutation({
    mutationFn: ({ couponId, orderAmount }: CalculateDiscountParams) =>
      couponApi.calculateDiscount(couponId, orderAmount),
  });
};
