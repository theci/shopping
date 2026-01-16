package com.ecommerce.order.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 주문 확인 이벤트
 */
@Getter
public class OrderConfirmedEvent extends BaseDomainEvent {

    private final Long orderId;
    private final String orderNumber;
    private final Long customerId;
    private final Long paymentId;

    public OrderConfirmedEvent(Long orderId, String orderNumber, Long customerId, Long paymentId) {
        super();
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.customerId = customerId;
        this.paymentId = paymentId;
    }
}
