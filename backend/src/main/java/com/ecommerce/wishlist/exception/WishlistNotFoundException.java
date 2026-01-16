package com.ecommerce.wishlist.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 찜 목록을 찾을 수 없을 때 발생하는 예외
 */
public class WishlistNotFoundException extends BusinessException {

    public WishlistNotFoundException(Long customerId) {
        super("WISHLIST_NOT_FOUND", "찜 목록을 찾을 수 없습니다. 고객 ID: " + customerId);
    }
}
