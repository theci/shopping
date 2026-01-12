package com.ecommerce.shared.infrastructure;

import com.ecommerce.shared.domain.DomainEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * 도메인 이벤트를 저장하고 추적하는 이벤트 스토어
 * (선택적 기능 - 이벤트 소싱이나 감사 로그에 활용 가능)
 */
@Slf4j
@Component
public class EventStore {

    /**
     * 모든 도메인 이벤트를 수신하고 로깅
     */
    @EventListener
    public void handleDomainEvent(DomainEvent event) {
        log.info("Domain Event occurred: {} at {}",
                event.getClass().getSimpleName(),
                event.getOccurredOn());

        // TODO: 이벤트를 데이터베이스에 저장하거나 외부 시스템으로 전송
        // 예: eventRepository.save(event);
        // 예: messageQueue.publish(event);
    }
}
