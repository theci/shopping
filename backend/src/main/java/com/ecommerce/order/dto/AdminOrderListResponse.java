package com.ecommerce.order.dto;

import com.ecommerce.order.domain.OrderStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Admin 주문 목록 응답 DTO
 */
@Getter
@Builder
public class AdminOrderListResponse {

    private Long id;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private int itemCount;
    private String paymentMethod;
    private LocalDateTime createdAt;
}
