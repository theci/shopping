package com.ecommerce.payment.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

import java.math.BigDecimal;

/**
 * 결제 취소 이벤트
 */
@Getter
public class PaymentCancelledEvent extends BaseDomainEvent {

    private final Long paymentId;
    private final Long orderId;
    private final BigDecimal amount;
    private final String reason;

    public PaymentCancelledEvent(Long paymentId, Long orderId, BigDecimal amount, String reason) {
        super();
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.amount = amount;
        this.reason = reason;
    }

    public static PaymentCancelledEventBuilder builder() {
        return new PaymentCancelledEventBuilder();
    }

    public static class PaymentCancelledEventBuilder {
        private Long paymentId;
        private Long orderId;
        private BigDecimal amount;
        private String reason;

        public PaymentCancelledEventBuilder paymentId(Long paymentId) {
            this.paymentId = paymentId;
            return this;
        }

        public PaymentCancelledEventBuilder orderId(Long orderId) {
            this.orderId = orderId;
            return this;
        }

        public PaymentCancelledEventBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public PaymentCancelledEventBuilder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public PaymentCancelledEvent build() {
            return new PaymentCancelledEvent(paymentId, orderId, amount, reason);
        }
    }
}
