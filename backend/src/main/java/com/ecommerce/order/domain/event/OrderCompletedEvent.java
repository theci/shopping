package com.ecommerce.order.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 구매 확정 이벤트
 */
@Getter
public class OrderCompletedEvent extends BaseDomainEvent {

    private final Long orderId;
    private final String orderNumber;
    private final Long customerId;

    public OrderCompletedEvent(Long orderId, String orderNumber, Long customerId) {
        super();
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.customerId = customerId;
    }
}
