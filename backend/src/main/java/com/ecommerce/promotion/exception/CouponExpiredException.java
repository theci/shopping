package com.ecommerce.promotion.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 쿠폰이 만료되었을 때 발생하는 예외
 */
public class CouponExpiredException extends BusinessException {

    public CouponExpiredException() {
        super("COUPON_EXPIRED", "쿠폰 유효기간이 만료되었습니다.");
    }

    public CouponExpiredException(String couponCode) {
        super("COUPON_EXPIRED", "쿠폰 유효기간이 만료되었습니다. 코드: " + couponCode);
    }
}
