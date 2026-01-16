package com.ecommerce.wishlist.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 이미 찜한 상품일 때 발생하는 예외
 */
public class WishlistItemAlreadyExistsException extends BusinessException {

    public WishlistItemAlreadyExistsException(Long productId) {
        super("WISHLIST_ITEM_ALREADY_EXISTS", "이미 찜한 상품입니다. 상품 ID: " + productId);
    }
}
