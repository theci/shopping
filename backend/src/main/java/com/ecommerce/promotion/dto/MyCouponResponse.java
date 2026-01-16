package com.ecommerce.promotion.dto;

import com.ecommerce.promotion.domain.CouponType;
import com.ecommerce.promotion.domain.DiscountType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 내 쿠폰 응답 DTO
 */
@Getter
@Builder
public class MyCouponResponse {

    private Long issueId;
    private Long couponId;
    private String code;
    private String name;
    private String description;
    private CouponType couponType;
    private String couponTypeDescription;
    private DiscountType discountType;
    private String discountTypeDescription;
    private BigDecimal discountValue;
    private BigDecimal minOrderAmount;
    private BigDecimal maxDiscountAmount;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private LocalDateTime issuedAt;
    private Boolean used;
    private LocalDateTime usedAt;
    private Boolean usable;
    private Long daysUntilExpiry;
}
