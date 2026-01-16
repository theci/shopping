package com.ecommerce.promotion.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 쿠폰 할인 계산 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CouponDiscountRequest {

    @NotNull(message = "주문 금액은 필수입니다.")
    @Positive(message = "주문 금액은 0보다 커야 합니다.")
    private BigDecimal orderAmount;
}
