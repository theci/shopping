package com.ecommerce.payment.domain;

/**
 * 결제 상태 Enum
 */
public enum PaymentStatus {

    PENDING("결제 대기"),
    PROCESSING("결제 처리중"),
    COMPLETED("결제 완료"),
    FAILED("결제 실패"),
    CANCELLED("결제 취소"),
    REFUNDED("환불 완료"),
    PARTIALLY_REFUNDED("부분 환불");

    private final String description;

    PaymentStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public boolean canCancel() {
        return this == PENDING || this == PROCESSING;
    }

    public boolean canRefund() {
        return this == COMPLETED;
    }

    public boolean isCompleted() {
        return this == COMPLETED;
    }

    public boolean isFailed() {
        return this == FAILED || this == CANCELLED;
    }
}
