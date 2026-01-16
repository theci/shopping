package com.ecommerce.order.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 주문 취소 불가 예외
 */
public class OrderCancellationException extends BusinessException {

    public OrderCancellationException(String message) {
        super("ORDER_CANCELLATION_FAILED", message);
    }
}
