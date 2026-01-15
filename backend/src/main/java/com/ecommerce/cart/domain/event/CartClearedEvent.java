package com.ecommerce.cart.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 장바구니 비우기 이벤트
 */
@Getter
public class CartClearedEvent extends BaseDomainEvent {

    private final Long cartId;
    private final Long customerId;

    public CartClearedEvent(Long cartId, Long customerId) {
        super();
        this.cartId = cartId;
        this.customerId = customerId;
    }
}
