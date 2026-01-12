package com.ecommerce.shared.domain;

import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 도메인 이벤트의 기본 구현체
 * 모든 도메인 이벤트는 이 클래스를 상속받아 구현
 */
@Getter
public abstract class BaseDomainEvent implements DomainEvent {

    private final LocalDateTime occurredOn;

    protected BaseDomainEvent() {
        this.occurredOn = LocalDateTime.now();
    }

    @Override
    public LocalDateTime getOccurredOn() {
        return occurredOn;
    }
}
