package com.ecommerce.product.application;

import com.ecommerce.product.domain.event.ProductCreatedEvent;
import com.ecommerce.product.domain.event.ProductPublishedEvent;
import com.ecommerce.product.domain.event.ProductStockChangedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Product 도메인 이벤트 핸들러
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ProductEventHandler {

    @EventListener
    public void handleProductCreated(ProductCreatedEvent event) {
        log.info("Product created event handled: productId={}, occurredOn={}",
                event.getProductId(), event.getOccurredOn());

        // TODO: 추가 비즈니스 로직
        // 예: 캐시 업데이트, 검색 인덱스 업데이트, 알림 발송 등
    }

    @EventListener
    public void handleProductPublished(ProductPublishedEvent event) {
        log.info("Product published event handled: productId={}, occurredOn={}",
                event.getProductId(), event.getOccurredOn());

        // TODO: 추가 비즈니스 로직
        // 예: 캐시 업데이트, 알림 발송 등
    }

    @EventListener
    public void handleProductStockChanged(ProductStockChangedEvent event) {
        log.info("Product stock changed event handled: productId={}, currentStock={}, occurredOn={}",
                event.getProductId(), event.getCurrentStock(), event.getOccurredOn());

        // TODO: 추가 비즈니스 로직
        // 예: 재고 부족 알림, 캐시 업데이트 등
    }
}
