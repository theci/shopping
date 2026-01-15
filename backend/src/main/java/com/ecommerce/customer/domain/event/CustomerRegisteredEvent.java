package com.ecommerce.customer.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 고객 등록 이벤트
 */
@Getter
public class CustomerRegisteredEvent extends BaseDomainEvent {

    private final Long customerId;
    private final String email;
    private final String name;

    public CustomerRegisteredEvent(Long customerId, String email, String name) {
        super();
        this.customerId = customerId;
        this.email = email;
        this.name = name;
    }
}
