package com.ecommerce.cart.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 장바구니 아이템 삭제 이벤트
 */
@Getter
public class CartItemRemovedEvent extends BaseDomainEvent {

    private final Long cartId;
    private final Long customerId;
    private final Long productId;

    public CartItemRemovedEvent(Long cartId, Long customerId, Long productId) {
        super();
        this.cartId = cartId;
        this.customerId = customerId;
        this.productId = productId;
    }
}
