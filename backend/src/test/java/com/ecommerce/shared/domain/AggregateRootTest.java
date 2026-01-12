package com.ecommerce.shared.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("AggregateRoot 테스트")
class AggregateRootTest {

    static class TestAggregate extends AggregateRoot {
        public void doSomething() {
            addDomainEvent(new TestEvent());
        }
    }

    static class TestEvent extends BaseDomainEvent {
    }

    @Test
    @DisplayName("도메인 이벤트를 추가할 수 있다")
    void addDomainEvent() {
        // given
        TestAggregate aggregate = new TestAggregate();

        // when
        aggregate.doSomething();

        // then
        assertThat(aggregate.getDomainEvents()).hasSize(1);
        assertThat(aggregate.getDomainEvents().get(0)).isInstanceOf(TestEvent.class);
    }

    @Test
    @DisplayName("도메인 이벤트를 클리어할 수 있다")
    void clearDomainEvents() {
        // given
        TestAggregate aggregate = new TestAggregate();
        aggregate.doSomething();

        // when
        aggregate.clearDomainEvents();

        // then
        assertThat(aggregate.getDomainEvents()).isEmpty();
    }

    @Test
    @DisplayName("도메인 이벤트 목록은 불변이다")
    void domainEventsAreImmutable() {
        // given
        TestAggregate aggregate = new TestAggregate();
        aggregate.doSomething();

        // when & then
        assertThat(aggregate.getDomainEvents())
                .isUnmodifiable();
    }

    @Test
    @DisplayName("이벤트는 발생 시간을 가진다")
    void eventHasOccurredOn() {
        // given
        TestAggregate aggregate = new TestAggregate();
        LocalDateTime before = LocalDateTime.now();

        // when
        aggregate.doSomething();

        // then
        LocalDateTime after = LocalDateTime.now();
        LocalDateTime occurredOn = aggregate.getDomainEvents().get(0).getOccurredOn();

        assertThat(occurredOn)
                .isAfterOrEqualTo(before)
                .isBeforeOrEqualTo(after);
    }
}
