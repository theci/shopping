package com.ecommerce.customer.exception;

import com.ecommerce.shared.exception.ForbiddenException;

/**
 * 차단된 고객 예외
 */
public class CustomerBlockedException extends ForbiddenException {

    public CustomerBlockedException() {
        super("차단된 계정입니다. 고객센터에 문의해주세요.");
    }
}
