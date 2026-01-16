package com.ecommerce.promotion.dto;

import com.ecommerce.promotion.domain.CouponType;
import com.ecommerce.promotion.domain.DiscountType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 쿠폰 생성 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponCreateRequest {

    @NotBlank(message = "쿠폰 코드는 필수입니다.")
    @Size(max = 50, message = "쿠폰 코드는 50자 이하여야 합니다.")
    private String code;

    @NotBlank(message = "쿠폰 이름은 필수입니다.")
    private String name;

    private String description;

    @NotNull(message = "쿠폰 타입은 필수입니다.")
    private CouponType couponType;

    @NotNull(message = "할인 타입은 필수입니다.")
    private DiscountType discountType;

    @NotNull(message = "할인 값은 필수입니다.")
    @Positive(message = "할인 값은 0보다 커야 합니다.")
    private BigDecimal discountValue;

    @PositiveOrZero(message = "최소 주문 금액은 0 이상이어야 합니다.")
    private BigDecimal minOrderAmount;

    @Positive(message = "최대 할인 금액은 0보다 커야 합니다.")
    private BigDecimal maxDiscountAmount;

    @NotNull(message = "유효 시작일은 필수입니다.")
    private LocalDateTime validFrom;

    @NotNull(message = "유효 종료일은 필수입니다.")
    @Future(message = "유효 종료일은 미래여야 합니다.")
    private LocalDateTime validUntil;

    @Positive(message = "발급 수량은 0보다 커야 합니다.")
    private Integer totalQuantity;
}
