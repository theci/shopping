package com.ecommerce.payment.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

import java.math.BigDecimal;

/**
 * 결제 실패 이벤트
 */
@Getter
public class PaymentFailedEvent extends BaseDomainEvent {

    private final Long paymentId;
    private final Long orderId;
    private final BigDecimal amount;
    private final String reason;

    public PaymentFailedEvent(Long paymentId, Long orderId, BigDecimal amount, String reason) {
        super();
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.amount = amount;
        this.reason = reason;
    }

    public static PaymentFailedEventBuilder builder() {
        return new PaymentFailedEventBuilder();
    }

    public static class PaymentFailedEventBuilder {
        private Long paymentId;
        private Long orderId;
        private BigDecimal amount;
        private String reason;

        public PaymentFailedEventBuilder paymentId(Long paymentId) {
            this.paymentId = paymentId;
            return this;
        }

        public PaymentFailedEventBuilder orderId(Long orderId) {
            this.orderId = orderId;
            return this;
        }

        public PaymentFailedEventBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public PaymentFailedEventBuilder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public PaymentFailedEvent build() {
            return new PaymentFailedEvent(paymentId, orderId, amount, reason);
        }
    }
}
