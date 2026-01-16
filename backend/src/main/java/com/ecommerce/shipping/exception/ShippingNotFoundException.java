package com.ecommerce.shipping.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 배송을 찾을 수 없을 때 발생하는 예외
 */
public class ShippingNotFoundException extends BusinessException {

    public ShippingNotFoundException(Long shippingId) {
        super("SHIPPING_NOT_FOUND", "배송 정보를 찾을 수 없습니다. ID: " + shippingId);
    }

    public ShippingNotFoundException(String identifier) {
        super("SHIPPING_NOT_FOUND", "배송 정보를 찾을 수 없습니다: " + identifier);
    }
}
