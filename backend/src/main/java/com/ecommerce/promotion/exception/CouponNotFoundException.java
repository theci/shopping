package com.ecommerce.promotion.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 쿠폰을 찾을 수 없을 때 발생하는 예외
 */
public class CouponNotFoundException extends BusinessException {

    public CouponNotFoundException(Long couponId) {
        super("COUPON_NOT_FOUND", "쿠폰을 찾을 수 없습니다. ID: " + couponId);
    }

    public CouponNotFoundException(String code) {
        super("COUPON_NOT_FOUND", "쿠폰을 찾을 수 없습니다. 코드: " + code);
    }
}
