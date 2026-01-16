package com.ecommerce.payment.application;

import com.ecommerce.payment.domain.Payment;
import com.ecommerce.payment.dto.PaymentResponse;
import org.springframework.stereotype.Component;

/**
 * Payment Mapper
 */
@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentMethodDescription(payment.getPaymentMethod().getDescription())
                .paymentStatus(payment.getPaymentStatus())
                .paymentStatusDescription(payment.getPaymentStatus().getDescription())
                .transactionId(payment.getTransactionId())
                .pgProvider(payment.getPgProvider())
                .paymentKey(payment.getPaymentKey())
                .failedReason(payment.getFailedReason())
                .refundAmount(payment.getRefundAmount())
                .refundableAmount(payment.getRefundableAmount())
                .refundReason(payment.getRefundReason())
                .refundedAt(payment.getRefundedAt())
                .completedAt(payment.getCompletedAt())
                .cancelledAt(payment.getCancelledAt())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
