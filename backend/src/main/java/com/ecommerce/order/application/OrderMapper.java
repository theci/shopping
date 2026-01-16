package com.ecommerce.order.application;

import com.ecommerce.order.domain.Order;
import com.ecommerce.order.domain.OrderItem;
import com.ecommerce.order.dto.OrderItemResponse;
import com.ecommerce.order.dto.OrderResponse;
import org.springframework.stereotype.Component;

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
}
