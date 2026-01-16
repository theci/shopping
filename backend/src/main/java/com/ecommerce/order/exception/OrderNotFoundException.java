package com.ecommerce.order.exception;

import com.ecommerce.shared.exception.ResourceNotFoundException;

/**
 * 주문을 찾을 수 없을 때 발생하는 예외
 */
public class OrderNotFoundException extends ResourceNotFoundException {

    public OrderNotFoundException(Long orderId) {
        super("주문을 찾을 수 없습니다. 주문 ID: " + orderId);
    }

    public OrderNotFoundException(String orderNumber) {
        super("주문을 찾을 수 없습니다. 주문번호: " + orderNumber);
    }
}
