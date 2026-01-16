package com.ecommerce.order.dto;

import com.ecommerce.order.domain.OrderStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 주문 응답 DTO
 */
@Getter
@Builder
public class OrderResponse {

    private Long id;
    private String orderNumber;
    private Long customerId;
    private List<OrderItemResponse> items;
    private BigDecimal totalAmount;
    private OrderStatus orderStatus;
    private String orderStatusDescription;

    // 배송 정보
    private String recipientName;
    private String recipientPhone;
    private String shippingPostalCode;
    private String shippingAddress;
    private String shippingAddressDetail;
    private String shippingMemo;

    // 결제 정보
    private Long paymentId;

    // 취소 정보
    private String cancelReason;
    private LocalDateTime cancelledAt;

    // 완료 정보
    private LocalDateTime completedAt;

    private int itemCount;
    private int totalQuantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
