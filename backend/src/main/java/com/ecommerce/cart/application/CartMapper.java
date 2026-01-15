package com.ecommerce.cart.application;

import com.ecommerce.cart.domain.Cart;
import com.ecommerce.cart.domain.CartItem;
import com.ecommerce.cart.dto.CartItemResponse;
import com.ecommerce.cart.dto.CartResponse;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Cart Mapper
 */
@Component
public class CartMapper {

    public CartResponse toResponse(Cart cart) {
        return CartResponse.builder()
                .id(cart.getId())
                .customerId(cart.getCustomerId())
                .items(toCartItemResponseList(cart.getItems()))
                .itemCount(cart.getItemCount())
                .totalQuantity(cart.getTotalQuantity())
                .totalAmount(cart.getTotalAmount())
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }

    public CartItemResponse toCartItemResponse(CartItem item) {
        return CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .productImageUrl(item.getProductImageUrl())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subtotal(item.getSubtotal())
                .createdAt(item.getCreatedAt())
                .build();
    }

    public List<CartItemResponse> toCartItemResponseList(List<CartItem> items) {
        if (items == null) {
            return List.of();
        }
        return items.stream()
                .map(this::toCartItemResponse)
                .collect(Collectors.toList());
    }
}
