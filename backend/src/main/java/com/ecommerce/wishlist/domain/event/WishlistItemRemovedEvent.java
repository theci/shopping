package com.ecommerce.wishlist.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 찜 아이템 삭제 이벤트
 */
@Getter
public class WishlistItemRemovedEvent extends BaseDomainEvent {

    private final Long wishlistId;
    private final Long customerId;
    private final Long productId;

    public WishlistItemRemovedEvent(Long wishlistId, Long customerId, Long productId) {
        super();
        this.wishlistId = wishlistId;
        this.customerId = customerId;
        this.productId = productId;
    }
}
