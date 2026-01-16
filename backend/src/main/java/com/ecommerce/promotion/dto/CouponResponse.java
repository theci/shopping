package com.ecommerce.promotion.dto;

import com.ecommerce.promotion.domain.CouponType;
import com.ecommerce.promotion.domain.DiscountType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 쿠폰 응답 DTO
 */
@Getter
@Builder
public class CouponResponse {

    private Long id;
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
    private Integer totalQuantity;
    private Integer issuedQuantity;
    private Integer remainingQuantity;
    private Boolean active;
    private Boolean valid;
    private Boolean issuable;
    private LocalDateTime createdAt;
}
