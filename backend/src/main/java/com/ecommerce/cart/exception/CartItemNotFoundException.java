package com.ecommerce.cart.exception;

import com.ecommerce.shared.exception.ResourceNotFoundException;

/**
 * 장바구니 아이템을 찾을 수 없을 때 발생하는 예외
 */
public class CartItemNotFoundException extends ResourceNotFoundException {

    public CartItemNotFoundException(Long itemId) {
        super("장바구니 아이템을 찾을 수 없습니다. 아이템 ID: " + itemId);
    }

    public CartItemNotFoundException(Long cartId, Long productId) {
        super("장바구니에 해당 상품이 없습니다. 장바구니 ID: " + cartId + ", 상품 ID: " + productId);
    }
}
