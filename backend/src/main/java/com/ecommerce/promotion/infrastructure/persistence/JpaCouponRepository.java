package com.ecommerce.promotion.infrastructure.persistence;

import com.ecommerce.promotion.domain.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Coupon JPA Repository
 */
public interface JpaCouponRepository extends JpaRepository<Coupon, Long> {

    @Query("SELECT c FROM Coupon c LEFT JOIN FETCH c.issues WHERE c.id = :id")
    Optional<Coupon> findByIdWithIssues(@Param("id") Long id);

    Optional<Coupon> findByCode(String code);

    @Query("SELECT c FROM Coupon c WHERE c.active = true AND c.validFrom <= :now AND c.validUntil > :now ORDER BY c.createdAt DESC")
    Page<Coupon> findAllActive(@Param("now") LocalDateTime now, Pageable pageable);

    @Query("SELECT DISTINCT c FROM Coupon c JOIN c.issues i WHERE i.customerId = :customerId ORDER BY i.issuedAt DESC")
    Page<Coupon> findByCustomerId(@Param("customerId") Long customerId, Pageable pageable);

    @Query("SELECT DISTINCT c FROM Coupon c JOIN c.issues i " +
           "WHERE i.customerId = :customerId AND i.used = false " +
           "AND c.active = true AND c.validFrom <= :now AND c.validUntil > :now " +
           "ORDER BY c.validUntil ASC")
    Page<Coupon> findUsableByCustomerId(@Param("customerId") Long customerId,
                                         @Param("now") LocalDateTime now,
                                         Pageable pageable);

    boolean existsByCode(String code);
}
