package com.ecommerce.promotion.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Coupon Repository 인터페이스 (도메인 계층)
 */
public interface CouponRepository {

    Coupon save(Coupon coupon);

    Optional<Coupon> findById(Long id);

    Optional<Coupon> findByCode(String code);

    Page<Coupon> findAll(Pageable pageable);

    Page<Coupon> findActiveCoupons(LocalDateTime now, Pageable pageable);

    boolean existsByCode(String code);

    /**
     * 고객이 발급받은 쿠폰 목록 조회
     */
    List<CouponIssue> findCouponIssuesByCustomerId(Long customerId);

    /**
     * 고객이 사용 가능한 쿠폰 목록 조회
     */
    List<CouponIssue> findAvailableCouponIssuesByCustomerId(Long customerId, LocalDateTime now);

    /**
     * 발급 ID로 쿠폰 발급 조회
     */
    Optional<CouponIssue> findCouponIssueById(Long issueId);

    /**
     * 고객의 해당 쿠폰 발급 횟수 조회
     */
    int countIssuedCouponsByCustomerId(Long couponId, Long customerId);
}
