package com.ecommerce.customer.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 고객 탈퇴 이벤트
 */
@Getter
public class CustomerWithdrawnEvent extends BaseDomainEvent {

    private final Long customerId;
    private final String email;
    private final String reason;

    public CustomerWithdrawnEvent(Long customerId, String email, String reason) {
        super();
        this.customerId = customerId;
        this.email = email;
        this.reason = reason;
    }
}
