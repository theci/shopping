package com.ecommerce.payment.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 결제를 찾을 수 없을 때 발생하는 예외
 */
public class PaymentNotFoundException extends BusinessException {

    public PaymentNotFoundException(Long paymentId) {
        super("PAYMENT_NOT_FOUND", "결제를 찾을 수 없습니다. ID: " + paymentId);
    }

    public PaymentNotFoundException(String identifier) {
        super("PAYMENT_NOT_FOUND", "결제를 찾을 수 없습니다: " + identifier);
    }
}
