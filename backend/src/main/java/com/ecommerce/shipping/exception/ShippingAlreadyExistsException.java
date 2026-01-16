package com.ecommerce.shipping.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 이미 배송이 존재할 때 발생하는 예외
 */
public class ShippingAlreadyExistsException extends BusinessException {

    public ShippingAlreadyExistsException(Long orderId) {
        super("SHIPPING_ALREADY_EXISTS", "이 주문에 대한 배송이 이미 존재합니다. 주문 ID: " + orderId);
    }
}
