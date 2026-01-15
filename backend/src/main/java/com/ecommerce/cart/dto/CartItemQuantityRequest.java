package com.ecommerce.cart.dto;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 장바구니 아이템 수량 변경 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemQuantityRequest {

    @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
    private int quantity;
}
