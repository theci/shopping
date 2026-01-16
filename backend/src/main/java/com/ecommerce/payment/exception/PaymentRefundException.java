package com.ecommerce.payment.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 환불 처리 중 오류가 발생했을 때 발생하는 예외
 */
public class PaymentRefundException extends BusinessException {

    public PaymentRefundException(String message) {
        super("PAYMENT_REFUND_ERROR", message);
    }

    public PaymentRefundException(String errorCode, String message) {
        super(errorCode, message);
    }
}
