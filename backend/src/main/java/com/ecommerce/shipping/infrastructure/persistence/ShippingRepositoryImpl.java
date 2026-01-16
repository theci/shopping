package com.ecommerce.shipping.infrastructure.persistence;

import com.ecommerce.shipping.domain.Shipping;
import com.ecommerce.shipping.domain.ShippingRepository;
import com.ecommerce.shipping.domain.ShippingStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Shipping Repository 구현체
 */
@Repository
@RequiredArgsConstructor
public class ShippingRepositoryImpl implements ShippingRepository {

    private final JpaShippingRepository jpaShippingRepository;

    @Override
    public Shipping save(Shipping shipping) {
        return jpaShippingRepository.save(shipping);
    }

    @Override
    public Optional<Shipping> findById(Long id) {
        return jpaShippingRepository.findById(id);
    }

    @Override
    public Optional<Shipping> findByOrderId(Long orderId) {
        return jpaShippingRepository.findByOrderId(orderId);
    }

    @Override
    public Optional<Shipping> findByTrackingNumber(String trackingNumber) {
        return jpaShippingRepository.findByTrackingNumber(trackingNumber);
    }

    @Override
    public Page<Shipping> findByShippingStatus(ShippingStatus status, Pageable pageable) {
        return jpaShippingRepository.findByShippingStatusOrderByCreatedAtDesc(status, pageable);
    }

    @Override
    public Page<Shipping> findAll(Pageable pageable) {
        return jpaShippingRepository.findAllOrderByCreatedAtDesc(pageable);
    }

    @Override
    public boolean existsByOrderId(Long orderId) {
        return jpaShippingRepository.existsByOrderId(orderId);
    }
}
