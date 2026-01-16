package com.ecommerce.promotion.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

/**
 * 쿠폰 할인 계산 응답 DTO
 */
@Getter
@Builder
public class CouponDiscountResponse {

    private Long couponId;
    private String couponCode;
    private String couponName;
    private BigDecimal orderAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private Boolean applicable;
    private String message;
}
