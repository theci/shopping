package com.ecommerce.promotion.application;

import com.ecommerce.promotion.domain.Coupon;
import com.ecommerce.promotion.domain.CouponIssue;
import com.ecommerce.promotion.dto.CouponIssueResponse;
import com.ecommerce.promotion.dto.CouponResponse;
import com.ecommerce.promotion.dto.MyCouponResponse;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

/**
 * 쿠폰 매퍼
 */
@Component
public class CouponMapper {

    /**
     * Coupon -> CouponResponse 변환
     */
    public CouponResponse toCouponResponse(Coupon coupon) {
        return CouponResponse.builder()
                .id(coupon.getId())
                .name(coupon.getName())
                .code(coupon.getCode())
                .description(coupon.getDescription())
                .discountType(coupon.getDiscountType())
                .discountTypeDescription(coupon.getDiscountType().getDescription())
                .discountValue(coupon.getDiscountValue())
                .minOrderAmount(coupon.getMinOrderAmount())
                .maxDiscountAmount(coupon.getMaxDiscountAmount())
                .couponType(coupon.getCouponType())
                .couponTypeDescription(coupon.getCouponType().getDescription())
                .totalQuantity(coupon.getTotalQuantity())
                .issuedQuantity(coupon.getIssuedQuantity())
                .remainingQuantity(coupon.getRemainingQuantity())
                .validFrom(coupon.getValidFrom())
                .validUntil(coupon.getValidUntil())
                .active(coupon.getActive())
                .valid(coupon.isValid())
                .issuable(coupon.isIssuable())
                .createdAt(coupon.getCreatedAt())
                .build();
    }

    /**
     * CouponIssue -> CouponIssueResponse 변환
     */
    public CouponIssueResponse toCouponIssueResponse(CouponIssue issue, Coupon coupon) {
        return CouponIssueResponse.builder()
                .issueId(issue.getId())
                .couponId(coupon.getId())
                .couponCode(coupon.getCode())
                .couponName(coupon.getName())
                .customerId(issue.getCustomerId())
                .issuedAt(issue.getIssuedAt())
                .used(issue.getUsed())
                .usedAt(issue.getUsedAt())
                .usedOrderId(issue.getUsedOrderId())
                .usable(issue.isUsable())
                .build();
    }

    /**
     * CouponIssue + Coupon -> MyCouponResponse 변환
     */
    public MyCouponResponse toMyCouponResponse(CouponIssue issue, Coupon coupon) {
        if (coupon == null) {
            return null;
        }

        long daysUntilExpiry = ChronoUnit.DAYS.between(LocalDateTime.now(), coupon.getValidUntil());
        if (daysUntilExpiry < 0) {
            daysUntilExpiry = 0;
        }

        return MyCouponResponse.builder()
                .issueId(issue.getId())
                .couponId(coupon.getId())
                .code(coupon.getCode())
                .name(coupon.getName())
                .description(coupon.getDescription())
                .couponType(coupon.getCouponType())
                .couponTypeDescription(coupon.getCouponType().getDescription())
                .discountType(coupon.getDiscountType())
                .discountTypeDescription(coupon.getDiscountType().getDescription())
                .discountValue(coupon.getDiscountValue())
                .minOrderAmount(coupon.getMinOrderAmount())
                .maxDiscountAmount(coupon.getMaxDiscountAmount())
                .validFrom(coupon.getValidFrom())
                .validUntil(coupon.getValidUntil())
                .issuedAt(issue.getIssuedAt())
                .used(issue.getUsed())
                .usedAt(issue.getUsedAt())
                .usable(issue.isUsable())
                .daysUntilExpiry(daysUntilExpiry)
                .build();
    }
}
