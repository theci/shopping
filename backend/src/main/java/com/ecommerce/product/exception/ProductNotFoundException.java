package com.ecommerce.product.exception;

import com.ecommerce.shared.exception.ResourceNotFoundException;

/**
 * 상품을 찾을 수 없을 때 발생하는 예외
 */
public class ProductNotFoundException extends ResourceNotFoundException {

    public ProductNotFoundException(Long productId) {
        super("Product", productId);
    }

    public ProductNotFoundException(String message) {
        super(message);
    }
}
