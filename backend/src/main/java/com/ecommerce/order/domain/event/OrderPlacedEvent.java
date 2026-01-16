package com.ecommerce.order.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

import java.math.BigDecimal;

/**
 * 주문 생성 이벤트
 */
@Getter
public class OrderPlacedEvent extends BaseDomainEvent {

    private final Long orderId;
    private final String orderNumber;
    private final Long customerId;
    private final BigDecimal totalAmount;

    public OrderPlacedEvent(Long orderId, String orderNumber, Long customerId, BigDecimal totalAmount) {
        super();
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.customerId = customerId;
        this.totalAmount = totalAmount;
    }
}
