package com.ecommerce.product.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 재고 부족 시 발생하는 예외
 */
public class InsufficientStockException extends BusinessException {

    private static final String ERROR_CODE = "INSUFFICIENT_STOCK";

    public InsufficientStockException(Long productId, int currentStock, int requestedQuantity) {
        super(ERROR_CODE,
                String.format("상품 ID %d의 재고가 부족합니다. (현재: %d, 요청: %d)",
                        productId, currentStock, requestedQuantity));
    }

    public InsufficientStockException(String message) {
        super(ERROR_CODE, message);
    }
}
