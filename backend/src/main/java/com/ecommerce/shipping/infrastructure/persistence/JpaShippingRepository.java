package com.ecommerce.shipping.infrastructure.persistence;

import com.ecommerce.shipping.domain.Shipping;
import com.ecommerce.shipping.domain.ShippingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * Shipping JPA Repository
 */
public interface JpaShippingRepository extends JpaRepository<Shipping, Long> {

    Optional<Shipping> findByOrderId(Long orderId);

    Optional<Shipping> findByTrackingNumber(String trackingNumber);

    Page<Shipping> findByShippingStatusOrderByCreatedAtDesc(ShippingStatus status, Pageable pageable);

    @Query("SELECT s FROM Shipping s ORDER BY s.createdAt DESC")
    Page<Shipping> findAllOrderByCreatedAtDesc(Pageable pageable);

    boolean existsByOrderId(Long orderId);
}
