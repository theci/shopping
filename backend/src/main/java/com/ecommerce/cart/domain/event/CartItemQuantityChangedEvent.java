package com.ecommerce.cart.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 장바구니 아이템 수량 변경 이벤트
 */
@Getter
public class CartItemQuantityChangedEvent extends BaseDomainEvent {

    private final Long cartId;
    private final Long customerId;
    private final Long productId;
    private final int newQuantity;

    public CartItemQuantityChangedEvent(Long cartId, Long customerId,
                                        Long productId, int newQuantity) {
        super();
        this.cartId = cartId;
        this.customerId = customerId;
        this.productId = productId;
        this.newQuantity = newQuantity;
    }
}
