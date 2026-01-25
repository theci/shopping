/**
 * Coupon Feature - Public API
 */

// Components
export { CouponCard, CouponList, CouponSelector } from './components';

// Hooks
export {
  useCoupons,
  useAvailableCoupons,
  useCoupon,
  useIssueCoupon,
  useValidateCoupon,
  useCalculateDiscount,
  couponKeys,
} from './hooks';

// API
export { couponApi } from './api';

// Types
export type {
  CouponType,
  CouponStatus,
  Coupon,
  CustomerCoupon,
  CouponSearchParams,
  CouponValidateRequest,
  CouponValidateResponse,
  CouponApplyRequest,
  CouponApplyResponse,
  CouponIssueRequest,
} from './types';

export { COUPON_STATUS_MAP, COUPON_TYPE_MAP } from './types';
