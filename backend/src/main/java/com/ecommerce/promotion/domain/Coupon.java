package com.ecommerce.promotion.domain;

import com.ecommerce.promotion.domain.event.CouponIssuedEvent;
import com.ecommerce.promotion.domain.event.CouponUsedEvent;
import com.ecommerce.shared.domain.AggregateRoot;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Coupon Aggregate Root
 */
@Entity
@Table(name = "coupons", indexes = {
        @Index(name = "idx_coupon_code", columnList = "code"),
        @Index(name = "idx_coupon_type", columnList = "coupon_type"),
        @Index(name = "idx_coupon_valid_period", columnList = "valid_from, valid_until")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Coupon extends AggregateRoot {

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "coupon_type", nullable = false, length = 50)
    private CouponType couponType;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 50)
    private DiscountType discountType;

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "min_order_amount", precision = 10, scale = 2)
    private BigDecimal minOrderAmount;

    @Column(name = "max_discount_amount", precision = 10, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Column(name = "valid_from", nullable = false)
    private LocalDateTime validFrom;

    @Column(name = "valid_until", nullable = false)
    private LocalDateTime validUntil;

    @Column(name = "total_quantity")
    private Integer totalQuantity;

    @Column(name = "issued_quantity", nullable = false)
    private Integer issuedQuantity;

    @Column(nullable = false)
    private Boolean active;

    @OneToMany(mappedBy = "coupon", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CouponIssue> issues = new ArrayList<>();

    @Builder
    public Coupon(String code, String name, String description, CouponType couponType,
                  DiscountType discountType, BigDecimal discountValue,
                  BigDecimal minOrderAmount, BigDecimal maxDiscountAmount,
                  LocalDateTime validFrom, LocalDateTime validUntil, Integer totalQuantity) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.couponType = couponType;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minOrderAmount = minOrderAmount != null ? minOrderAmount : BigDecimal.ZERO;
        this.maxDiscountAmount = maxDiscountAmount;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.totalQuantity = totalQuantity;
        this.issuedQuantity = 0;
        this.active = true;
    }

    /**
     * 쿠폰 발급
     */
    public CouponIssue issue(Long customerId) {
        validateIssuable();

        // 이미 발급받았는지 확인
        boolean alreadyIssued = this.issues.stream()
                .anyMatch(issue -> issue.getCustomerId().equals(customerId));
        if (alreadyIssued) {
            throw new IllegalStateException("이미 발급받은 쿠폰입니다.");
        }

        CouponIssue couponIssue = CouponIssue.builder()
                .coupon(this)
                .customerId(customerId)
                .build();

        this.issues.add(couponIssue);
        this.issuedQuantity++;

        registerEvent(new CouponIssuedEvent(
                this.getId(),
                this.code,
                this.name,
                customerId
        ));

        return couponIssue;
    }

    /**
     * 쿠폰 사용
     */
    public BigDecimal use(Long customerId, Long orderId, BigDecimal orderAmount) {
        CouponIssue couponIssue = findIssueByCustomerId(customerId);

        if (!couponIssue.isUsable()) {
            throw new IllegalStateException("사용할 수 없는 쿠폰입니다.");
        }

        validateUsable(orderAmount);

        BigDecimal discountAmount = calculateDiscount(orderAmount);
        couponIssue.use(orderId);

        registerEvent(new CouponUsedEvent(
                this.getId(),
                this.code,
                customerId,
                orderId,
                discountAmount
        ));

        return discountAmount;
    }

    /**
     * 쿠폰 사용 취소
     */
    public void cancelUse(Long customerId) {
        CouponIssue couponIssue = findIssueByCustomerId(customerId);
        couponIssue.cancelUse();
    }

    /**
     * 할인 금액 계산
     */
    public BigDecimal calculateDiscount(BigDecimal orderAmount) {
        if (!isValid()) {
            return BigDecimal.ZERO;
        }

        if (orderAmount.compareTo(this.minOrderAmount) < 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount;
        if (this.discountType == DiscountType.FIXED_AMOUNT) {
            discount = this.discountValue;
        } else {
            // 정률 할인: orderAmount * (discountValue / 100)
            discount = orderAmount.multiply(this.discountValue)
                    .divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN);
        }

        // 최대 할인 금액 제한
        if (this.maxDiscountAmount != null && discount.compareTo(this.maxDiscountAmount) > 0) {
            discount = this.maxDiscountAmount;
        }

        // 주문 금액을 초과할 수 없음
        if (discount.compareTo(orderAmount) > 0) {
            discount = orderAmount;
        }

        return discount;
    }

    /**
     * 쿠폰 활성화
     */
    public void activate() {
        this.active = true;
    }

    /**
     * 쿠폰 비활성화
     */
    public void deactivate() {
        this.active = false;
    }

    /**
     * 유효한 쿠폰인지 확인
     */
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        return this.active &&
               now.isAfter(this.validFrom) &&
               now.isBefore(this.validUntil);
    }

    /**
     * 발급 가능한지 확인
     */
    public boolean isIssuable() {
        return isValid() &&
               (this.totalQuantity == null || this.issuedQuantity < this.totalQuantity);
    }

    /**
     * 남은 수량
     */
    public Integer getRemainingQuantity() {
        if (this.totalQuantity == null) {
            return null; // 무제한
        }
        return this.totalQuantity - this.issuedQuantity;
    }

    private void validateIssuable() {
        if (!this.active) {
            throw new IllegalStateException("비활성화된 쿠폰입니다.");
        }
        if (!isValid()) {
            throw new IllegalStateException("유효기간이 아닙니다.");
        }
        if (this.totalQuantity != null && this.issuedQuantity >= this.totalQuantity) {
            throw new IllegalStateException("쿠폰 수량이 모두 소진되었습니다.");
        }
    }

    private void validateUsable(BigDecimal orderAmount) {
        if (!isValid()) {
            throw new IllegalStateException("유효하지 않은 쿠폰입니다.");
        }
        if (orderAmount.compareTo(this.minOrderAmount) < 0) {
            throw new IllegalStateException(
                    String.format("최소 주문 금액은 %s원입니다.", this.minOrderAmount));
        }
    }

    private CouponIssue findIssueByCustomerId(Long customerId) {
        return this.issues.stream()
                .filter(issue -> issue.getCustomerId().equals(customerId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("발급받은 쿠폰이 없습니다."));
    }
}
