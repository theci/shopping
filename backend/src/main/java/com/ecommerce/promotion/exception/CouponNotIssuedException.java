package com.ecommerce.promotion.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 쿠폰이 발급되지 않았을 때 발생하는 예외
 */
public class CouponNotIssuedException extends BusinessException {

    public CouponNotIssuedException() {
        super("COUPON_NOT_ISSUED", "발급받은 쿠폰이 아닙니다.");
    }
}
