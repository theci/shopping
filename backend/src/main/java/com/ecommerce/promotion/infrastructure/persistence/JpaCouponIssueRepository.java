package com.ecommerce.promotion.infrastructure.persistence;

import com.ecommerce.promotion.domain.CouponIssue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * CouponIssue JPA Repository
 */
public interface JpaCouponIssueRepository extends JpaRepository<CouponIssue, Long> {

    List<CouponIssue> findByCustomerId(Long customerId);

    List<CouponIssue> findByCustomerIdAndUsedIsFalse(Long customerId);

    int countByCouponIdAndCustomerId(Long couponId, Long customerId);
}
