package com.ecommerce.order.dto;

import com.ecommerce.order.domain.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * 주문 상태 변경 요청 DTO
 */
@Getter
@Setter
public class OrderStatusUpdateRequest {

    @NotNull(message = "상태는 필수입니다.")
    private OrderStatus status;

    private String reason;
}
