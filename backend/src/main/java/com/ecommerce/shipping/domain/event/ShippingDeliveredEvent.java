package com.ecommerce.shipping.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 배송 완료 이벤트
 */
@Getter
public class ShippingDeliveredEvent extends BaseDomainEvent {

    private final Long shippingId;
    private final Long orderId;
    private final String trackingNumber;
    private final LocalDateTime deliveredAt;

    public ShippingDeliveredEvent(Long shippingId, Long orderId,
                                   String trackingNumber, LocalDateTime deliveredAt) {
        super();
        this.shippingId = shippingId;
        this.orderId = orderId;
        this.trackingNumber = trackingNumber;
        this.deliveredAt = deliveredAt;
    }
}
