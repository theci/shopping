package com.ecommerce.payment.domain;

import java.util.Optional;

/**
 * Payment Repository 인터페이스 (도메인 계층)
 */
public interface PaymentRepository {

    Payment save(Payment payment);

    Optional<Payment> findById(Long id);

    Optional<Payment> findByOrderId(Long orderId);

    Optional<Payment> findByPaymentKey(String paymentKey);

    Optional<Payment> findByTransactionId(String transactionId);

    boolean existsByOrderId(Long orderId);
}
