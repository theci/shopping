package com.ecommerce.cart.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 장바구니 응답 DTO
 */
@Getter
@Builder
public class CartResponse {

    private Long id;
    private Long customerId;
    private List<CartItemResponse> items;
    private int itemCount;
    private int totalQuantity;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
