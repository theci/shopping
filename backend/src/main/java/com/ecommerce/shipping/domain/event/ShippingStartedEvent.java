package com.ecommerce.shipping.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 배송 시작 이벤트
 */
@Getter
public class ShippingStartedEvent extends BaseDomainEvent {

    private final Long shippingId;
    private final Long orderId;
    private final String shippingCompany;

    public ShippingStartedEvent(Long shippingId, Long orderId, String shippingCompany) {
        super();
        this.shippingId = shippingId;
        this.orderId = orderId;
        this.shippingCompany = shippingCompany;
    }
}
