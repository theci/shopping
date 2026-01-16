package com.ecommerce.payment.dto;

import com.ecommerce.payment.domain.PaymentMethod;
import com.ecommerce.payment.domain.PaymentStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 결제 응답 DTO
 */
@Getter
@Builder
public class PaymentResponse {

    private Long id;
    private Long orderId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private String paymentMethodDescription;
    private PaymentStatus paymentStatus;
    private String paymentStatusDescription;
    private String transactionId;
    private String pgProvider;
    private String paymentKey;
    private String failedReason;
    private BigDecimal refundAmount;
    private BigDecimal refundableAmount;
    private String refundReason;
    private LocalDateTime refundedAt;
    private LocalDateTime completedAt;
    private LocalDateTime cancelledAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
