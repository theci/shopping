package com.ecommerce.promotion.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 쿠폰 코드가 중복될 때 발생하는 예외
 */
public class DuplicateCouponCodeException extends BusinessException {

    public DuplicateCouponCodeException(String code) {
        super("DUPLICATE_COUPON_CODE", "이미 존재하는 쿠폰 코드입니다: " + code);
    }
}
