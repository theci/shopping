package com.ecommerce.shipping.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 배송 출발 이벤트
 */
@Getter
public class ShippingOutForDeliveryEvent extends BaseDomainEvent {

    private final Long shippingId;
    private final Long orderId;
    private final String trackingNumber;
    private final String recipientName;

    public ShippingOutForDeliveryEvent(Long shippingId, Long orderId,
                                        String trackingNumber, String recipientName) {
        super();
        this.shippingId = shippingId;
        this.orderId = orderId;
        this.trackingNumber = trackingNumber;
        this.recipientName = recipientName;
    }
}
