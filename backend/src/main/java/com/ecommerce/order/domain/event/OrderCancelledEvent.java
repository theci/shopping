package com.ecommerce.order.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 주문 취소 이벤트
 */
@Getter
public class OrderCancelledEvent extends BaseDomainEvent {

    private final Long orderId;
    private final String orderNumber;
    private final Long customerId;
    private final Long paymentId;
    private final String reason;

    public OrderCancelledEvent(Long orderId, String orderNumber, Long customerId,
                               Long paymentId, String reason) {
        super();
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.customerId = customerId;
        this.paymentId = paymentId;
        this.reason = reason;
    }
}
