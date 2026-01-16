package com.ecommerce.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 환불 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RefundRequest {

    @Positive(message = "환불 금액은 0보다 커야 합니다.")
    private BigDecimal amount;

    @NotBlank(message = "환불 사유는 필수입니다.")
    private String reason;
}
