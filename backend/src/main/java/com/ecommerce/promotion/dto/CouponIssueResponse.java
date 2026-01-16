package com.ecommerce.promotion.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 쿠폰 발급 응답 DTO
 */
@Getter
@Builder
public class CouponIssueResponse {

    private Long issueId;
    private Long couponId;
    private String couponCode;
    private String couponName;
    private Long customerId;
    private LocalDateTime issuedAt;
    private Boolean used;
    private LocalDateTime usedAt;
    private Long usedOrderId;
    private Boolean usable;
}
