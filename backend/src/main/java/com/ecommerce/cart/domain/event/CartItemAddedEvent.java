package com.ecommerce.cart.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 장바구니 아이템 추가 이벤트
 */
@Getter
public class CartItemAddedEvent extends BaseDomainEvent {

    private final Long cartId;
    private final Long customerId;
    private final Long productId;
    private final String productName;
    private final int quantity;

    public CartItemAddedEvent(Long cartId, Long customerId, Long productId,
                              String productName, int quantity) {
        super();
        this.cartId = cartId;
        this.customerId = customerId;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
    }
}
