package com.ecommerce.wishlist.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 찜 아이템 추가 이벤트
 */
@Getter
public class WishlistItemAddedEvent extends BaseDomainEvent {

    private final Long wishlistId;
    private final Long customerId;
    private final Long productId;
    private final String productName;

    public WishlistItemAddedEvent(Long wishlistId, Long customerId, Long productId, String productName) {
        super();
        this.wishlistId = wishlistId;
        this.customerId = customerId;
        this.productId = productId;
        this.productName = productName;
    }
}
