package com.ecommerce.payment.domain;

import com.ecommerce.payment.domain.event.PaymentCompletedEvent;
import com.ecommerce.payment.domain.event.PaymentFailedEvent;
import com.ecommerce.payment.domain.event.PaymentRefundedEvent;
import com.ecommerce.shared.domain.AggregateRoot;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment Aggregate Root
 */
@Entity
@Table(name = "payments", indexes = {
        @Index(name = "idx_payment_order_id", columnList = "order_id"),
        @Index(name = "idx_payment_status", columnList = "payment_status"),
        @Index(name = "idx_payment_transaction_id", columnList = "transaction_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment extends AggregateRoot {

    @Column(name = "order_id", nullable = false, unique = true)
    private Long orderId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 50)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 50)
    private PaymentStatus paymentStatus;

    @Column(name = "transaction_id", length = 255)
    private String transactionId;

    @Column(name = "pg_provider", length = 50)
    private String pgProvider;

    @Column(name = "pg_transaction_id", length = 255)
    private String pgTransactionId;

    @Column(name = "payment_key", length = 255)
    private String paymentKey;

    @Column(name = "failed_reason", columnDefinition = "TEXT")
    private String failedReason;

    @Column(name = "refund_amount", precision = 10, scale = 2)
    private BigDecimal refundAmount;

    @Column(name = "refund_reason", columnDefinition = "TEXT")
    private String refundReason;

    @Column(name = "refunded_at")
    private LocalDateTime refundedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Builder
    public Payment(Long orderId, BigDecimal amount, PaymentMethod paymentMethod) {
        this.orderId = orderId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = PaymentStatus.PENDING;
        this.refundAmount = BigDecimal.ZERO;
    }

    /**
     * 결제 처리 시작
     */
    public void startProcessing(String pgProvider, String paymentKey) {
        if (this.paymentStatus != PaymentStatus.PENDING) {
            throw new IllegalStateException("결제 대기 상태에서만 처리를 시작할 수 있습니다.");
        }
        this.paymentStatus = PaymentStatus.PROCESSING;
        this.pgProvider = pgProvider;
        this.paymentKey = paymentKey;
    }

    /**
     * 결제 완료
     */
    public void complete(String transactionId, String pgTransactionId) {
        if (this.paymentStatus != PaymentStatus.PROCESSING && this.paymentStatus != PaymentStatus.PENDING) {
            throw new IllegalStateException("결제 처리중 또는 대기 상태에서만 완료할 수 있습니다.");
        }
        this.paymentStatus = PaymentStatus.COMPLETED;
        this.transactionId = transactionId;
        this.pgTransactionId = pgTransactionId;
        this.completedAt = LocalDateTime.now();

        registerEvent(PaymentCompletedEvent.builder()
                .paymentId(this.getId())
                .orderId(this.orderId)
                .amount(this.amount)
                .paymentMethod(this.paymentMethod)
                .transactionId(transactionId)
                .build());
    }

    /**
     * 결제 실패
     */
    public void fail(String reason) {
        if (this.paymentStatus != PaymentStatus.PROCESSING && this.paymentStatus != PaymentStatus.PENDING) {
            throw new IllegalStateException("결제 처리중 또는 대기 상태에서만 실패 처리할 수 있습니다.");
        }
        this.paymentStatus = PaymentStatus.FAILED;
        this.failedReason = reason;

        registerEvent(PaymentFailedEvent.builder()
                .paymentId(this.getId())
                .orderId(this.orderId)
                .amount(this.amount)
                .reason(reason)
                .build());
    }

    /**
     * 결제 취소
     */
    public void cancel(String reason) {
        if (!this.paymentStatus.canCancel()) {
            throw new IllegalStateException("취소할 수 없는 상태입니다: " + this.paymentStatus.getDescription());
        }
        this.paymentStatus = PaymentStatus.CANCELLED;
        this.failedReason = reason;
        this.cancelledAt = LocalDateTime.now();
    }

    /**
     * 전액 환불
     */
    public void refund(String reason) {
        refund(this.amount, reason);
    }

    /**
     * 부분 환불 또는 전액 환불
     */
    public void refund(BigDecimal refundAmount, String reason) {
        if (!this.paymentStatus.canRefund()) {
            throw new IllegalStateException("환불할 수 없는 상태입니다: " + this.paymentStatus.getDescription());
        }

        BigDecimal totalRefundAmount = this.refundAmount.add(refundAmount);
        if (totalRefundAmount.compareTo(this.amount) > 0) {
            throw new IllegalStateException("환불 금액이 결제 금액을 초과할 수 없습니다.");
        }

        this.refundAmount = totalRefundAmount;
        this.refundReason = reason;
        this.refundedAt = LocalDateTime.now();

        if (totalRefundAmount.compareTo(this.amount) == 0) {
            this.paymentStatus = PaymentStatus.REFUNDED;
        } else {
            this.paymentStatus = PaymentStatus.PARTIALLY_REFUNDED;
        }

        registerEvent(PaymentRefundedEvent.builder()
                .paymentId(this.getId())
                .orderId(this.orderId)
                .refundAmount(refundAmount)
                .totalRefundAmount(totalRefundAmount)
                .reason(reason)
                .build());
    }

    /**
     * 환불 가능 금액 조회
     */
    public BigDecimal getRefundableAmount() {
        return this.amount.subtract(this.refundAmount);
    }

    /**
     * 결제 완료 여부
     */
    public boolean isCompleted() {
        return this.paymentStatus.isCompleted();
    }
}
