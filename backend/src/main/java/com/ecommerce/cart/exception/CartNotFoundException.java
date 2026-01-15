package com.ecommerce.cart.exception;

import com.ecommerce.shared.exception.ResourceNotFoundException;

/**
 * 장바구니를 찾을 수 없을 때 발생하는 예외
 */
public class CartNotFoundException extends ResourceNotFoundException {

    public CartNotFoundException(Long customerId) {
        super("장바구니를 찾을 수 없습니다. 고객 ID: " + customerId);
    }
}
