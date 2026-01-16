package com.ecommerce.notification.domain;

/**
 * 알림 타입 Enum
 */
public enum NotificationType {

    ORDER_PLACED("주문 접수"),
    ORDER_CONFIRMED("주문 확인"),
    ORDER_CANCELLED("주문 취소"),
    ORDER_COMPLETED("주문 완료"),

    PAYMENT_COMPLETED("결제 완료"),
    PAYMENT_FAILED("결제 실패"),
    PAYMENT_REFUNDED("환불 완료"),

    SHIPPING_STARTED("배송 시작"),
    SHIPPING_IN_TRANSIT("배송 중"),
    SHIPPING_OUT_FOR_DELIVERY("배송 출발"),
    SHIPPING_DELIVERED("배송 완료"),

    COUPON_ISSUED("쿠폰 발급"),
    COUPON_EXPIRING("쿠폰 만료 임박"),

    PRODUCT_RESTOCKED("상품 재입고"),
    PRODUCT_PRICE_DROP("상품 가격 인하"),

    REVIEW_REPLY("리뷰 답변"),

    WELCOME("환영 메시지"),
    BIRTHDAY("생일 축하"),
    MARKETING("마케팅");

    private final String description;

    NotificationType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
