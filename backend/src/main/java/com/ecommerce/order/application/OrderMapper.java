package com.ecommerce.order.application;

import com.ecommerce.customer.domain.Customer;
import com.ecommerce.order.domain.Order;
import com.ecommerce.order.domain.OrderItem;
import com.ecommerce.order.dto.AdminOrderListResponse;
import com.ecommerce.order.dto.AdminOrderResponse;
import com.ecommerce.order.dto.OrderItemResponse;
import com.ecommerce.order.dto.OrderResponse;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Order Mapper
 */
@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomerId())
                .items(toOrderItemResponseList(order.getItems()))
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getOrderStatus())
                .orderStatusDescription(order.getOrderStatus().getDescription())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .shippingPostalCode(order.getShippingPostalCode())
                .shippingAddress(order.getShippingAddress())
                .shippingAddressDetail(order.getShippingAddressDetail())
                .shippingMemo(order.getShippingMemo())
                .paymentId(order.getPaymentId())
                .cancelReason(order.getCancelReason())
                .cancelledAt(order.getCancelledAt())
                .completedAt(order.getCompletedAt())
                .trackingNumber(order.getTrackingNumber())
                .trackingCompany(order.getTrackingCompany())
                .adminMemo(order.getAdminMemo())
                .itemCount(order.getItemCount())
                .totalQuantity(order.getTotalQuantity())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    public OrderItemResponse toOrderItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .productImageUrl(item.getProductImageUrl())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subtotal(item.getSubtotal())
                .build();
    }

    public List<OrderItemResponse> toOrderItemResponseList(List<OrderItem> items) {
        if (items == null) {
            return List.of();
        }
        return items.stream()
                .map(this::toOrderItemResponse)
                .collect(Collectors.toList());
    }

    // ========== Admin용 매핑 메서드 ==========

    public AdminOrderListResponse toAdminListResponse(Order order, Customer customer) {
        return AdminOrderListResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerName(customer != null ? customer.getName() : "알 수 없음")
                .customerEmail(customer != null ? customer.getEmail() : "")
                .status(order.getOrderStatus())
                .totalAmount(order.getTotalAmount())
                .itemCount(order.getItemCount())
                .paymentMethod(null) // 결제 정보는 별도 조회 필요
                .createdAt(order.getCreatedAt())
                .build();
    }

    public AdminOrderResponse toAdminResponse(Order order, Customer customer) {
        return AdminOrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customer(AdminOrderResponse.CustomerInfo.builder()
                        .id(customer != null ? customer.getId() : null)
                        .email(customer != null ? customer.getEmail() : "")
                        .name(customer != null ? customer.getName() : "알 수 없음")
                        .phone(customer != null ? customer.getPhoneNumber() : null)
                        .build())
                .status(order.getOrderStatus())
                .items(toOrderItemResponseList(order.getItems()))
                .shippingInfo(AdminOrderResponse.ShippingInfo.builder()
                        .recipientName(order.getRecipientName())
                        .phone(order.getRecipientPhone())
                        .zipCode(order.getShippingPostalCode())
                        .address(order.getShippingAddress())
                        .addressDetail(order.getShippingAddressDetail())
                        .memo(order.getShippingMemo())
                        .build())
                .paymentMethod(null)
                .subtotal(order.getTotalAmount())
                .shippingFee(BigDecimal.ZERO)
                .discount(BigDecimal.ZERO)
                .totalAmount(order.getTotalAmount())
                .paidAt(null)
                .shippedAt(null)
                .deliveredAt(null)
                .confirmedAt(order.getCompletedAt())
                .cancelledAt(order.getCancelledAt())
                .cancelReason(order.getCancelReason())
                .trackingNumber(order.getTrackingNumber())
                .trackingCompany(order.getTrackingCompany())
                .adminMemo(order.getAdminMemo())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
