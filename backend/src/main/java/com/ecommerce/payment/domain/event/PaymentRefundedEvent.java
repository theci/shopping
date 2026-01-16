package com.ecommerce.payment.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

import java.math.BigDecimal;

/**
 * 결제 환불 이벤트
 */
@Getter
public class PaymentRefundedEvent extends BaseDomainEvent {

    private final Long paymentId;
    private final Long orderId;
    private final BigDecimal refundAmount;
    private final BigDecimal totalRefundAmount;
    private final String reason;

    public PaymentRefundedEvent(Long paymentId, Long orderId, BigDecimal refundAmount,
                                 BigDecimal totalRefundAmount, String reason) {
        super();
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.refundAmount = refundAmount;
        this.totalRefundAmount = totalRefundAmount;
        this.reason = reason;
    }

    public static PaymentRefundedEventBuilder builder() {
        return new PaymentRefundedEventBuilder();
    }

    public static class PaymentRefundedEventBuilder {
        private Long paymentId;
        private Long orderId;
        private BigDecimal refundAmount;
        private BigDecimal totalRefundAmount;
        private String reason;

        public PaymentRefundedEventBuilder paymentId(Long paymentId) {
            this.paymentId = paymentId;
            return this;
        }

        public PaymentRefundedEventBuilder orderId(Long orderId) {
            this.orderId = orderId;
            return this;
        }

        public PaymentRefundedEventBuilder refundAmount(BigDecimal refundAmount) {
            this.refundAmount = refundAmount;
            return this;
        }

        public PaymentRefundedEventBuilder totalRefundAmount(BigDecimal totalRefundAmount) {
            this.totalRefundAmount = totalRefundAmount;
            return this;
        }

        public PaymentRefundedEventBuilder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public PaymentRefundedEvent build() {
            return new PaymentRefundedEvent(paymentId, orderId, refundAmount, totalRefundAmount, reason);
        }
    }
}
