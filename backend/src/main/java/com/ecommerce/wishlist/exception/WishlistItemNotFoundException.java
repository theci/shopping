package com.ecommerce.wishlist.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 찜 아이템을 찾을 수 없을 때 발생하는 예외
 */
public class WishlistItemNotFoundException extends BusinessException {

    public WishlistItemNotFoundException(Long itemId) {
        super("WISHLIST_ITEM_NOT_FOUND", "찜 아이템을 찾을 수 없습니다. ID: " + itemId);
    }

    public WishlistItemNotFoundException(Long customerId, Long productId) {
        super("WISHLIST_ITEM_NOT_FOUND",
              String.format("찜 목록에 없는 상품입니다. 고객 ID: %d, 상품 ID: %d", customerId, productId));
    }
}
