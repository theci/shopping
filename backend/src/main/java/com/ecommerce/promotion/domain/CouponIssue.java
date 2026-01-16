package com.ecommerce.promotion.domain;

import com.ecommerce.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 쿠폰 발급 Entity
 */
@Entity
@Table(name = "coupon_issues", indexes = {
        @Index(name = "idx_coupon_issue_customer", columnList = "customer_id"),
        @Index(name = "idx_coupon_issue_coupon", columnList = "coupon_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_coupon_customer", columnNames = {"coupon_id", "customer_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CouponIssue extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id", nullable = false)
    private Coupon coupon;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt;

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(name = "used_order_id")
    private Long usedOrderId;

    @Column(nullable = false)
    private Boolean used;

    @Builder
    public CouponIssue(Coupon coupon, Long customerId) {
        this.coupon = coupon;
        this.customerId = customerId;
        this.issuedAt = LocalDateTime.now();
        this.used = false;
    }

    void setCoupon(Coupon coupon) {
        this.coupon = coupon;
    }

    /**
     * 쿠폰 사용
     */
    public void use(Long orderId) {
        if (this.used) {
            throw new IllegalStateException("이미 사용된 쿠폰입니다.");
        }
        this.used = true;
        this.usedAt = LocalDateTime.now();
        this.usedOrderId = orderId;
    }

    /**
     * 쿠폰 사용 취소 (환불 시)
     */
    public void cancelUse() {
        this.used = false;
        this.usedAt = null;
        this.usedOrderId = null;
    }

    /**
     * 사용 가능 여부
     */
    public boolean isUsable() {
        return !this.used && this.coupon.isValid();
    }
}
