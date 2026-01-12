package com.ecommerce.product.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 상품 발행 이벤트 (판매 시작)
 */
@Getter
public class ProductPublishedEvent extends BaseDomainEvent {

    private final Long productId;

    public ProductPublishedEvent(Long productId) {
        super();
        this.productId = productId;
    }
}
