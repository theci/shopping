package com.ecommerce.payment.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 이미 결제가 존재할 때 발생하는 예외
 */
public class PaymentAlreadyExistsException extends BusinessException {

    public PaymentAlreadyExistsException(Long orderId) {
        super("PAYMENT_ALREADY_EXISTS", "이 주문에 대한 결제가 이미 존재합니다. 주문 ID: " + orderId);
    }
}
