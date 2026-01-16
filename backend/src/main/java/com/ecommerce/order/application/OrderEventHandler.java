package com.ecommerce.order.application;

import com.ecommerce.order.domain.event.OrderCancelledEvent;
import com.ecommerce.order.domain.event.OrderCompletedEvent;
import com.ecommerce.order.domain.event.OrderConfirmedEvent;
import com.ecommerce.order.domain.event.OrderPlacedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Order 도메인 이벤트 핸들러
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventHandler {

    /**
     * 주문 생성 이벤트 처리
     */
    @Async
    @EventListener
    public void handleOrderPlaced(OrderPlacedEvent event) {
        log.info("주문 생성 이벤트 수신: orderId={}, orderNumber={}, customerId={}, totalAmount={}",
                event.getOrderId(), event.getOrderNumber(), event.getCustomerId(), event.getTotalAmount());

        // TODO: 주문 접수 알림 발송
        // TODO: 결제 요청 처리
    }

    /**
     * 주문 확인 이벤트 처리
     */
    @Async
    @EventListener
    public void handleOrderConfirmed(OrderConfirmedEvent event) {
        log.info("주문 확인 이벤트 수신: orderId={}, orderNumber={}, paymentId={}",
                event.getOrderId(), event.getOrderNumber(), event.getPaymentId());

        // TODO: 주문 확인 알림 발송
        // TODO: 배송 준비 시작 트리거
    }

    /**
     * 주문 취소 이벤트 처리
     */
    @Async
    @EventListener
    public void handleOrderCancelled(OrderCancelledEvent event) {
        log.info("주문 취소 이벤트 수신: orderId={}, orderNumber={}, paymentId={}, reason={}",
                event.getOrderId(), event.getOrderNumber(), event.getPaymentId(), event.getReason());

        // TODO: 환불 처리 요청
        // TODO: 주문 취소 알림 발송
    }

    /**
     * 구매 확정 이벤트 처리
     */
    @Async
    @EventListener
    public void handleOrderCompleted(OrderCompletedEvent event) {
        log.info("구매 확정 이벤트 수신: orderId={}, orderNumber={}, customerId={}",
                event.getOrderId(), event.getOrderNumber(), event.getCustomerId());

        // TODO: 구매 확정 알림 발송
        // TODO: 리뷰 작성 요청 알림
        // TODO: 고객 등급 업데이트 (구매 금액 반영)
    }
}
