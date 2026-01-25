/**
 * 쿠폰 유효성 검증 Hook
 */

import { useMutation } from '@tanstack/react-query';
import { couponApi } from '../api/couponApi';
import type { CouponValidateRequest } from '../types';

/**
 * 쿠폰 유효성 검증
 */
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: (data: CouponValidateRequest) => couponApi.validateCoupon(data),
  });
};
