package com.ecommerce.shared.infrastructure;

import com.ecommerce.shared.domain.AggregateRoot;
import com.ecommerce.shared.domain.BaseDomainEvent;
import com.ecommerce.shared.domain.DomainEvent;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@DisplayName("DomainEventPublisher 테스트")
@ExtendWith(MockitoExtension.class)
class DomainEventPublisherTest {

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private DomainEventPublisher domainEventPublisher;

    static class TestAggregate extends AggregateRoot {
        public void doSomething() {
            addDomainEvent(new TestEvent());
            addDomainEvent(new TestEvent());
        }
    }

    static class TestEvent extends BaseDomainEvent {
    }

    @Test
    @DisplayName("Aggregate의 이벤트를 발행하고 클리어한다")
    void publishEventsAndClear() {
        // given
        TestAggregate aggregate = new TestAggregate();
        aggregate.doSomething();
        assertThat(aggregate.getDomainEvents()).hasSize(2);

        // when
        domainEventPublisher.publishEvents(aggregate);

        // then
        verify(eventPublisher, times(2)).publishEvent(any(DomainEvent.class));
        assertThat(aggregate.getDomainEvents()).isEmpty();
    }
}
