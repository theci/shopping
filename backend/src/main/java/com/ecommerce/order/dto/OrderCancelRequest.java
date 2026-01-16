package com.ecommerce.order.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 주문 취소 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCancelRequest {

    @Size(max = 500, message = "취소 사유는 500자 이하여야 합니다.")
    private String reason;
}
