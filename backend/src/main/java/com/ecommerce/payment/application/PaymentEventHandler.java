package com.ecommerce.payment.application;

import com.ecommerce.order.application.OrderService;
import com.ecommerce.payment.domain.event.PaymentCompletedEvent;
import com.ecommerce.payment.domain.event.PaymentFailedEvent;
import com.ecommerce.payment.domain.event.PaymentRefundedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Payment 도메인 이벤트 핸들러
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventHandler {

    private final OrderService orderService;

    /**
     * 결제 완료 이벤트 처리
     */
    @Async
    @EventListener
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        log.info("결제 완료 이벤트 수신: paymentId={}, orderId={}, amount={}",
                event.getPaymentId(), event.getOrderId(), event.getAmount());

        try {
            // 주문 확인 처리
            orderService.confirmOrder(event.getOrderId(), event.getPaymentId());
            log.info("주문 확인 처리 완료: orderId={}", event.getOrderId());
        } catch (Exception e) {
            log.error("주문 확인 처리 실패: orderId={}, error={}", event.getOrderId(), e.getMessage(), e);
            // TODO: 보상 트랜잭션 또는 재시도 로직
        }
    }

    /**
     * 결제 실패 이벤트 처리
     */
    @Async
    @EventListener
    public void handlePaymentFailed(PaymentFailedEvent event) {
        log.info("결제 실패 이벤트 수신: paymentId={}, orderId={}, reason={}",
                event.getPaymentId(), event.getOrderId(), event.getReason());

        // TODO: 주문 취소 처리
        // TODO: 고객에게 결제 실패 알림
    }

    /**
     * 환불 완료 이벤트 처리
     */
    @Async
    @EventListener
    public void handlePaymentRefunded(PaymentRefundedEvent event) {
        log.info("환불 완료 이벤트 수신: paymentId={}, orderId={}, refundAmount={}",
                event.getPaymentId(), event.getOrderId(), event.getRefundAmount());

        // TODO: 재고 복구 처리 (전액 환불인 경우)
        // TODO: 고객에게 환불 완료 알림
    }
}
