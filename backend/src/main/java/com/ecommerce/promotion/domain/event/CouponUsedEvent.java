package com.ecommerce.promotion.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

import java.math.BigDecimal;

/**
 * 쿠폰 사용 이벤트
 */
@Getter
public class CouponUsedEvent extends BaseDomainEvent {

    private final Long couponId;
    private final String couponCode;
    private final Long customerId;
    private final Long orderId;
    private final BigDecimal discountAmount;

    public CouponUsedEvent(Long couponId, String couponCode, Long customerId,
                           Long orderId, BigDecimal discountAmount) {
        super();
        this.couponId = couponId;
        this.couponCode = couponCode;
        this.customerId = customerId;
        this.orderId = orderId;
        this.discountAmount = discountAmount;
    }
}
