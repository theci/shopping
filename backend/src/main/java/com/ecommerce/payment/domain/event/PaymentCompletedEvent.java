package com.ecommerce.payment.domain.event;

import com.ecommerce.payment.domain.PaymentMethod;
import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

import java.math.BigDecimal;

/**
 * 결제 완료 이벤트
 */
@Getter
public class PaymentCompletedEvent extends BaseDomainEvent {

    private final Long paymentId;
    private final Long orderId;
    private final BigDecimal amount;
    private final PaymentMethod paymentMethod;
    private final String transactionId;

    public PaymentCompletedEvent(Long paymentId, Long orderId, BigDecimal amount,
                                  PaymentMethod paymentMethod, String transactionId) {
        super();
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
    }

    public static PaymentCompletedEventBuilder builder() {
        return new PaymentCompletedEventBuilder();
    }

    public static class PaymentCompletedEventBuilder {
        private Long paymentId;
        private Long orderId;
        private BigDecimal amount;
        private PaymentMethod paymentMethod;
        private String transactionId;

        public PaymentCompletedEventBuilder paymentId(Long paymentId) {
            this.paymentId = paymentId;
            return this;
        }

        public PaymentCompletedEventBuilder orderId(Long orderId) {
            this.orderId = orderId;
            return this;
        }

        public PaymentCompletedEventBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public PaymentCompletedEventBuilder paymentMethod(PaymentMethod paymentMethod) {
            this.paymentMethod = paymentMethod;
            return this;
        }

        public PaymentCompletedEventBuilder transactionId(String transactionId) {
            this.transactionId = transactionId;
            return this;
        }

        public PaymentCompletedEvent build() {
            return new PaymentCompletedEvent(paymentId, orderId, amount, paymentMethod, transactionId);
        }
    }
}
