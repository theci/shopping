package com.ecommerce.shipping.application;

import com.ecommerce.order.domain.event.OrderConfirmedEvent;
import com.ecommerce.shipping.domain.Shipping;
import com.ecommerce.shipping.domain.ShippingAddress;
import com.ecommerce.shipping.domain.ShippingRepository;
import com.ecommerce.shipping.domain.event.ShippingDeliveredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Shipping 도메인 이벤트 핸들러
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ShippingEventHandler {

    private final ShippingRepository shippingRepository;

    /**
     * 주문 확인 이벤트 처리 → 배송 자동 생성
     */
    @Async
    @EventListener
    public void handleOrderConfirmed(OrderConfirmedEvent event) {
        log.info("주문 확인 이벤트 수신 → 배송 생성: orderId={}, orderNumber={}",
                event.getOrderId(), event.getOrderNumber());

        try {
            // 이미 배송이 존재하는지 확인
            if (shippingRepository.existsByOrderId(event.getOrderId())) {
                log.warn("이미 배송이 존재합니다: orderId={}", event.getOrderId());
                return;
            }

            // 배송 주소 정보 (주문에서 가져와야 하지만, 여기서는 이벤트에 포함되지 않아 별도 조회 필요)
            // TODO: OrderConfirmedEvent에 배송 정보 포함 또는 Order 조회
            ShippingAddress address = ShippingAddress.builder()
                    .recipientName("수령인")
                    .recipientPhone("010-0000-0000")
                    .postalCode("00000")
                    .address("주소")
                    .build();

            Shipping shipping = Shipping.builder()
                    .orderId(event.getOrderId())
                    .shippingAddress(address)
                    .build();

            Shipping savedShipping = shippingRepository.save(shipping);
            log.info("배송 자동 생성 완료: shippingId={}, orderId={}",
                    savedShipping.getId(), event.getOrderId());

        } catch (Exception e) {
            log.error("배송 생성 실패: orderId={}, error={}", event.getOrderId(), e.getMessage(), e);
        }
    }

    /**
     * 배송 완료 이벤트 처리
     */
    @Async
    @EventListener
    public void handleShippingDelivered(ShippingDeliveredEvent event) {
        log.info("배송 완료 이벤트 수신: shippingId={}, orderId={}, trackingNumber={}",
                event.getShippingId(), event.getOrderId(), event.getTrackingNumber());

        // TODO: 주문 상태를 DELIVERED로 변경
        // TODO: 고객에게 배송 완료 알림 발송
    }
}
