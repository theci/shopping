package com.ecommerce.payment.infrastructure.persistence;

import com.ecommerce.payment.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Payment JPA Repository
 */
public interface JpaPaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderId(Long orderId);

    Optional<Payment> findByPaymentKey(String paymentKey);

    Optional<Payment> findByTransactionId(String transactionId);

    boolean existsByOrderId(Long orderId);
}
