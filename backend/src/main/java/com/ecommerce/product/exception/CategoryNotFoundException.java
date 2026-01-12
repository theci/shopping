package com.ecommerce.product.exception;

import com.ecommerce.shared.exception.ResourceNotFoundException;

/**
 * 카테고리를 찾을 수 없을 때 발생하는 예외
 */
public class CategoryNotFoundException extends ResourceNotFoundException {

    public CategoryNotFoundException(Long categoryId) {
        super("Category", categoryId);
    }
}
