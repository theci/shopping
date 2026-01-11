package com.ecommerce.shared.domain;

import java.time.LocalDateTime;

public interface DomainEvent {
    LocalDateTime getOccurredOn();
}
