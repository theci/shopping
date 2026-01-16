package com.ecommerce.order.domain;

/**
 * 주문 상태
 */
public enum OrderStatus {
    PENDING("주문 대기"),
    CONFIRMED("주문 확인"),
    PREPARING("상품 준비중"),
    SHIPPED("배송중"),
    DELIVERED("배송 완료"),
    COMPLETED("구매 확정"),
    CANCELLED("주문 취소"),
    RETURNED("반품");

    private final String description;

    OrderStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    /**
     * 취소 가능한 상태인지 확인
     */
    public boolean isCancellable() {
        return this == PENDING || this == CONFIRMED || this == PREPARING;
    }

    /**
     * 구매 확정 가능한 상태인지 확인
     */
    public boolean isCompletable() {
        return this == DELIVERED;
    }
}
