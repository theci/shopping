package com.ecommerce.notification.application;

import com.ecommerce.customer.domain.Customer;
import com.ecommerce.customer.domain.CustomerRepository;
import com.ecommerce.notification.domain.NotificationChannel;
import com.ecommerce.notification.domain.NotificationType;
import com.ecommerce.order.domain.Order;
import com.ecommerce.order.domain.OrderRepository;
import com.ecommerce.order.domain.event.OrderConfirmedEvent;
import com.ecommerce.order.domain.event.OrderPlacedEvent;
import com.ecommerce.payment.domain.event.PaymentCompletedEvent;
import com.ecommerce.promotion.domain.event.CouponIssuedEvent;
import com.ecommerce.shipping.domain.Shipping;
import com.ecommerce.shipping.domain.ShippingRepository;
import com.ecommerce.shipping.domain.event.ShippingDeliveredEvent;
import com.ecommerce.shipping.domain.event.ShippingStartedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Notification 이벤트 핸들러
 * 다른 도메인 이벤트를 수신하여 알림 발송
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventHandler {

    private final NotificationService notificationService;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final ShippingRepository shippingRepository;

    /**
     * 주문 접수 이벤트 → 주문 접수 알림
     */
    @Async
    @EventListener
    public void handleOrderPlaced(OrderPlacedEvent event) {
        log.info("주문 접수 알림 발송 - 주문ID: {}, 고객ID: {}", event.getOrderId(), event.getCustomerId());

        Optional<Customer> customer = customerRepository.findById(event.getCustomerId());
        if (customer.isEmpty()) {
            log.warn("고객을 찾을 수 없습니다. ID: {}", event.getCustomerId());
            return;
        }

        String title = "주문이 접수되었습니다";
        String content = String.format(
                "주문번호 %s의 주문이 정상적으로 접수되었습니다. 결제를 완료해주세요.",
                event.getOrderNumber()
        );

        // 인앱 알림
        notificationService.sendNotification(
                event.getCustomerId(),
                NotificationType.ORDER_PLACED,
                NotificationChannel.IN_APP,
                title,
                content,
                null,
                event.getOrderId(),
                "ORDER"
        );

        // 이메일 알림
        notificationService.sendNotification(
                event.getCustomerId(),
                NotificationType.ORDER_PLACED,
                NotificationChannel.EMAIL,
                title,
                content,
                customer.get().getEmail(),
                event.getOrderId(),
                "ORDER"
        );
    }

    /**
     * 주문 확인 이벤트 → 주문 확인 알림
     */
    @Async
    @EventListener
    public void handleOrderConfirmed(OrderConfirmedEvent event) {
        log.info("주문 확인 알림 발송 - 주문ID: {}, 고객ID: {}", event.getOrderId(), event.getCustomerId());

        Optional<Customer> customer = customerRepository.findById(event.getCustomerId());
        if (customer.isEmpty()) {
            return;
        }

        String title = "주문이 확인되었습니다";
        String content = String.format(
                "주문번호 %s의 결제가 완료되어 주문이 확정되었습니다. 곧 배송이 시작됩니다.",
                event.getOrderNumber()
        );

        notificationService.sendNotification(
                event.getCustomerId(),
                NotificationType.ORDER_CONFIRMED,
                NotificationChannel.IN_APP,
                title,
                content,
                null,
                event.getOrderId(),
                "ORDER"
        );

        notificationService.sendNotification(
                event.getCustomerId(),
                NotificationType.ORDER_CONFIRMED,
                NotificationChannel.EMAIL,
                title,
                content,
                customer.get().getEmail(),
                event.getOrderId(),
                "ORDER"
        );
    }

    /**
     * 결제 완료 이벤트 → 결제 완료 알림
     */
    @Async
    @EventListener
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        log.info("결제 완료 알림 발송 - 결제ID: {}, 주문ID: {}", event.getPaymentId(), event.getOrderId());

        // 주문에서 고객 ID 조회
        Optional<Order> order = orderRepository.findById(event.getOrderId());
        if (order.isEmpty()) {
            log.warn("주문을 찾을 수 없습니다. ID: {}", event.getOrderId());
            return;
        }

        Long customerId = order.get().getCustomerId();

        String title = "결제가 완료되었습니다";
        String content = String.format(
                "결제 금액 %s원의 결제가 정상적으로 처리되었습니다.",
                event.getAmount()
        );

        notificationService.sendNotification(
                customerId,
                NotificationType.PAYMENT_COMPLETED,
                NotificationChannel.IN_APP,
                title,
                content,
                null,
                event.getPaymentId(),
                "PAYMENT"
        );
    }

    /**
     * 배송 시작 이벤트 → 배송 시작 알림
     */
    @Async
    @EventListener
    public void handleShippingStarted(ShippingStartedEvent event) {
        log.info("배송 시작 알림 발송 - 배송ID: {}, 주문ID: {}", event.getShippingId(), event.getOrderId());

        // 주문에서 고객 ID 조회
        Optional<Order> order = orderRepository.findById(event.getOrderId());
        if (order.isEmpty()) {
            log.warn("주문을 찾을 수 없습니다. ID: {}", event.getOrderId());
            return;
        }

        Long customerId = order.get().getCustomerId();

        Optional<Customer> customer = customerRepository.findById(customerId);
        if (customer.isEmpty()) {
            return;
        }

        // 배송에서 송장번호 조회
        Optional<Shipping> shipping = shippingRepository.findById(event.getShippingId());
        String trackingNumber = shipping.map(Shipping::getTrackingNumber).orElse("조회 중");

        String title = "배송이 시작되었습니다";
        String content = String.format(
                "주문하신 상품의 배송이 시작되었습니다. 배송사: %s, 송장번호: %s",
                event.getShippingCompany(),
                trackingNumber
        );

        // 인앱 알림
        notificationService.sendNotification(
                customerId,
                NotificationType.SHIPPING_STARTED,
                NotificationChannel.IN_APP,
                title,
                content,
                null,
                event.getShippingId(),
                "SHIPPING"
        );

        // SMS 알림
        if (customer.get().getPhoneNumber() != null) {
            notificationService.sendNotification(
                    customerId,
                    NotificationType.SHIPPING_STARTED,
                    NotificationChannel.SMS,
                    title,
                    content,
                    customer.get().getPhoneNumber(),
                    event.getShippingId(),
                    "SHIPPING"
            );
        }
    }

    /**
     * 배송 완료 이벤트 → 배송 완료 알림
     */
    @Async
    @EventListener
    public void handleShippingDelivered(ShippingDeliveredEvent event) {
        log.info("배송 완료 알림 발송 - 배송ID: {}, 주문ID: {}", event.getShippingId(), event.getOrderId());

        // 주문에서 고객 ID 조회
        Optional<Order> order = orderRepository.findById(event.getOrderId());
        if (order.isEmpty()) {
            log.warn("주문을 찾을 수 없습니다. ID: {}", event.getOrderId());
            return;
        }

        Long customerId = order.get().getCustomerId();

        String title = "배송이 완료되었습니다";
        String content = "주문하신 상품이 배송 완료되었습니다. 상품을 확인해주세요.";

        notificationService.sendNotification(
                customerId,
                NotificationType.SHIPPING_DELIVERED,
                NotificationChannel.IN_APP,
                title,
                content,
                null,
                event.getShippingId(),
                "SHIPPING"
        );

        notificationService.sendNotification(
                customerId,
                NotificationType.SHIPPING_DELIVERED,
                NotificationChannel.PUSH,
                title,
                content,
                null,
                event.getShippingId(),
                "SHIPPING"
        );
    }

    /**
     * 쿠폰 발급 이벤트 → 쿠폰 발급 알림
     */
    @Async
    @EventListener
    public void handleCouponIssued(CouponIssuedEvent event) {
        log.info("쿠폰 발급 알림 발송 - 쿠폰ID: {}, 고객ID: {}", event.getCouponId(), event.getCustomerId());

        String title = "쿠폰이 발급되었습니다";
        String content = String.format(
                "'%s' 쿠폰이 발급되었습니다. 마이페이지에서 확인하세요.",
                event.getCouponName()
        );

        notificationService.sendNotification(
                event.getCustomerId(),
                NotificationType.COUPON_ISSUED,
                NotificationChannel.IN_APP,
                title,
                content,
                null,
                event.getCouponId(),
                "COUPON"
        );

        notificationService.sendNotification(
                event.getCustomerId(),
                NotificationType.COUPON_ISSUED,
                NotificationChannel.PUSH,
                title,
                content,
                null,
                event.getCouponId(),
                "COUPON"
        );
    }
}
