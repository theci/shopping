package com.ecommerce.promotion.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 쿠폰이 이미 사용되었을 때 발생하는 예외
 */
public class CouponAlreadyUsedException extends BusinessException {

    public CouponAlreadyUsedException() {
        super("COUPON_ALREADY_USED", "이미 사용된 쿠폰입니다.");
    }

    public CouponAlreadyUsedException(String couponCode) {
        super("COUPON_ALREADY_USED", "이미 사용된 쿠폰입니다. 코드: " + couponCode);
    }
}
