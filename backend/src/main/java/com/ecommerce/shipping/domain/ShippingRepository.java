package com.ecommerce.shipping.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Shipping Repository 인터페이스 (도메인 계층)
 */
public interface ShippingRepository {

    Shipping save(Shipping shipping);

    Optional<Shipping> findById(Long id);

    Optional<Shipping> findByOrderId(Long orderId);

    Optional<Shipping> findByTrackingNumber(String trackingNumber);

    Page<Shipping> findByShippingStatus(ShippingStatus status, Pageable pageable);

    Page<Shipping> findAll(Pageable pageable);

    boolean existsByOrderId(Long orderId);
}
