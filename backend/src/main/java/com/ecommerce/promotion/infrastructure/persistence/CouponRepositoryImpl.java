package com.ecommerce.promotion.infrastructure.persistence;

import com.ecommerce.promotion.domain.Coupon;
import com.ecommerce.promotion.domain.CouponIssue;
import com.ecommerce.promotion.domain.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Coupon Repository 구현체 (인프라 계층)
 */
@Repository
@RequiredArgsConstructor
public class CouponRepositoryImpl implements CouponRepository {

    private final JpaCouponRepository jpaCouponRepository;
    private final JpaCouponIssueRepository jpaCouponIssueRepository;

    @Override
    public Coupon save(Coupon coupon) {
        return jpaCouponRepository.save(coupon);
    }

    @Override
    public Optional<Coupon> findById(Long id) {
        return jpaCouponRepository.findByIdWithIssues(id);
    }

    @Override
    public Optional<Coupon> findByCode(String code) {
        return jpaCouponRepository.findByCode(code);
    }

    @Override
    public Page<Coupon> findAll(Pageable pageable) {
        return jpaCouponRepository.findAll(pageable);
    }

    @Override
    public Page<Coupon> findActiveCoupons(LocalDateTime now, Pageable pageable) {
        return jpaCouponRepository.findAllActive(now, pageable);
    }

    @Override
    public boolean existsByCode(String code) {
        return jpaCouponRepository.existsByCode(code);
    }

    @Override
    public List<CouponIssue> findCouponIssuesByCustomerId(Long customerId) {
        return jpaCouponIssueRepository.findByCustomerId(customerId);
    }

    @Override
    public List<CouponIssue> findAvailableCouponIssuesByCustomerId(Long customerId, LocalDateTime now) {
        return jpaCouponIssueRepository.findByCustomerIdAndUsedIsFalse(customerId)
                .stream()
                .filter(issue -> issue.getCoupon().isValid())
                .collect(Collectors.toList());
    }

    @Override
    public Optional<CouponIssue> findCouponIssueById(Long issueId) {
        return jpaCouponIssueRepository.findById(issueId);
    }

    @Override
    public int countIssuedCouponsByCustomerId(Long couponId, Long customerId) {
        return jpaCouponIssueRepository.countByCouponIdAndCustomerId(couponId, customerId);
    }
}
