package com.ecommerce.order.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

/**
 * 주문 상품 응답 DTO
 */
@Getter
@Builder
public class OrderItemResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private int quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
}
