package com.ecommerce.order.dto;

import com.ecommerce.order.domain.OrderStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Admin 주문 상세 응답 DTO
 */
@Getter
@Builder
public class AdminOrderResponse {

    private Long id;
    private String orderNumber;
    private CustomerInfo customer;
    private OrderStatus status;
    private List<OrderItemResponse> items;
    private ShippingInfo shippingInfo;
    private String paymentMethod;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private LocalDateTime paidAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime cancelledAt;
    private String cancelReason;
    private String trackingNumber;
    private String trackingCompany;
    private String adminMemo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Builder
    public static class CustomerInfo {
        private Long id;
        private String email;
        private String name;
        private String phone;
    }

    @Getter
    @Builder
    public static class ShippingInfo {
        private String recipientName;
        private String phone;
        private String zipCode;
        private String address;
        private String addressDetail;
        private String memo;
    }
}
