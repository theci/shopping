package com.ecommerce.product.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 상품 생성 이벤트
 */
@Getter
public class ProductCreatedEvent extends BaseDomainEvent {

    private final Long productId;

    public ProductCreatedEvent(Long productId) {
        super();
        this.productId = productId;
    }
}
