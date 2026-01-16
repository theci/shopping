package com.ecommerce.shipping.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 배송중 이벤트
 */
@Getter
public class ShippingInTransitEvent extends BaseDomainEvent {

    private final Long shippingId;
    private final Long orderId;
    private final String trackingNumber;

    public ShippingInTransitEvent(Long shippingId, Long orderId, String trackingNumber) {
        super();
        this.shippingId = shippingId;
        this.orderId = orderId;
        this.trackingNumber = trackingNumber;
    }
}
