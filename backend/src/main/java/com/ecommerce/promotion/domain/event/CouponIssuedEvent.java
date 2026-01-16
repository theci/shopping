package com.ecommerce.promotion.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 쿠폰 발급 이벤트
 */
@Getter
public class CouponIssuedEvent extends BaseDomainEvent {

    private final Long couponId;
    private final String couponCode;
    private final String couponName;
    private final Long customerId;

    public CouponIssuedEvent(Long couponId, String couponCode, String couponName, Long customerId) {
        super();
        this.couponId = couponId;
        this.couponCode = couponCode;
        this.couponName = couponName;
        this.customerId = customerId;
    }
}
