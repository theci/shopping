package com.ecommerce.wishlist.domain;

import java.util.List;
import java.util.Optional;

/**
 * Wishlist Repository 인터페이스 (도메인 계층)
 */
public interface WishlistRepository {

    Wishlist save(Wishlist wishlist);

    Optional<Wishlist> findById(Long id);

    Optional<Wishlist> findByCustomerId(Long customerId);

    boolean existsByCustomerId(Long customerId);

    /**
     * 상품이 고객의 찜 목록에 있는지 확인
     */
    boolean existsByCustomerIdAndProductId(Long customerId, Long productId);

    /**
     * 재고 알림 설정된 상품의 찜 목록 조회
     */
    List<WishlistItem> findItemsByProductIdAndNotifyOnRestock(Long productId);

    void delete(Wishlist wishlist);
}
