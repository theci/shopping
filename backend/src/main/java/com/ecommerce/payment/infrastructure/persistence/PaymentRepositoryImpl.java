package com.ecommerce.payment.infrastructure.persistence;

import com.ecommerce.payment.domain.Payment;
import com.ecommerce.payment.domain.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Payment Repository 구현체
 */
@Repository
@RequiredArgsConstructor
public class PaymentRepositoryImpl implements PaymentRepository {

    private final JpaPaymentRepository jpaPaymentRepository;

    @Override
    public Payment save(Payment payment) {
        return jpaPaymentRepository.save(payment);
    }

    @Override
    public Optional<Payment> findById(Long id) {
        return jpaPaymentRepository.findById(id);
    }

    @Override
    public Optional<Payment> findByOrderId(Long orderId) {
        return jpaPaymentRepository.findByOrderId(orderId);
    }

    @Override
    public Optional<Payment> findByPaymentKey(String paymentKey) {
        return jpaPaymentRepository.findByPaymentKey(paymentKey);
    }

    @Override
    public Optional<Payment> findByTransactionId(String transactionId) {
        return jpaPaymentRepository.findByTransactionId(transactionId);
    }

    @Override
    public boolean existsByOrderId(Long orderId) {
        return jpaPaymentRepository.existsByOrderId(orderId);
    }
}
