package com.ecommerce.customer.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 고객 정보 업데이트 이벤트
 */
@Getter
public class CustomerUpdatedEvent extends BaseDomainEvent {

    private final Long customerId;
    private final String email;
    private final String name;

    public CustomerUpdatedEvent(Long customerId, String email, String name) {
        super();
        this.customerId = customerId;
        this.email = email;
        this.name = name;
    }
}
