package com.ecommerce.product.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 상품 재고 변경 이벤트
 */
@Getter
public class ProductStockChangedEvent extends BaseDomainEvent {

    private final Long productId;
    private final Integer currentStock;

    public ProductStockChangedEvent(Long productId, Integer currentStock) {
        super();
        this.productId = productId;
        this.currentStock = currentStock;
    }
}
