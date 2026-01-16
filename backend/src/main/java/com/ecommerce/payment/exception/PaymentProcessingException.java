package com.ecommerce.payment.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 결제 처리 중 오류가 발생했을 때 발생하는 예외
 */
public class PaymentProcessingException extends BusinessException {

    public PaymentProcessingException(String message) {
        super("PAYMENT_PROCESSING_ERROR", message);
    }

    public PaymentProcessingException(String errorCode, String message) {
        super(errorCode, message);
    }
}
