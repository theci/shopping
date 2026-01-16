package com.ecommerce.payment.domain;

import java.math.BigDecimal;

/**
 * PG사 연동 인터페이스
 */
public interface PaymentGateway {

    /**
     * 결제 요청 (결제창 URL 또는 결제키 발급)
     */
    PaymentInitResponse initiate(PaymentInitRequest request);

    /**
     * 결제 승인
     */
    PaymentConfirmResponse confirm(PaymentConfirmRequest request);

    /**
     * 결제 취소
     */
    PaymentCancelResponse cancel(String paymentKey, String reason);

    /**
     * 환불
     */
    PaymentRefundResponse refund(String paymentKey, BigDecimal amount, String reason);

    /**
     * 결제 조회
     */
    PaymentStatusResponse getStatus(String paymentKey);

    /**
     * 결제 요청 DTO
     */
    record PaymentInitRequest(
            String orderId,
            BigDecimal amount,
            String orderName,
            String customerName,
            String customerEmail,
            PaymentMethod paymentMethod,
            String successUrl,
            String failUrl
    ) {}

    /**
     * 결제 요청 응답 DTO
     */
    record PaymentInitResponse(
            String paymentKey,
            String checkoutUrl,
            boolean success,
            String errorCode,
            String errorMessage
    ) {}

    /**
     * 결제 승인 요청 DTO
     */
    record PaymentConfirmRequest(
            String paymentKey,
            String orderId,
            BigDecimal amount
    ) {}

    /**
     * 결제 승인 응답 DTO
     */
    record PaymentConfirmResponse(
            boolean success,
            String transactionId,
            String pgTransactionId,
            PaymentStatus status,
            String errorCode,
            String errorMessage
    ) {}

    /**
     * 결제 취소 응답 DTO
     */
    record PaymentCancelResponse(
            boolean success,
            String cancelTransactionId,
            String errorCode,
            String errorMessage
    ) {}

    /**
     * 환불 응답 DTO
     */
    record PaymentRefundResponse(
            boolean success,
            String refundTransactionId,
            BigDecimal refundedAmount,
            String errorCode,
            String errorMessage
    ) {}

    /**
     * 결제 상태 조회 응답 DTO
     */
    record PaymentStatusResponse(
            boolean success,
            PaymentStatus status,
            BigDecimal amount,
            BigDecimal refundedAmount,
            String transactionId,
            String errorCode,
            String errorMessage
    ) {}
}
