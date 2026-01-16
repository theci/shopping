package com.ecommerce.wishlist.infrastructure.persistence;

import com.ecommerce.wishlist.domain.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * WishlistItem JPA Repository
 */
public interface JpaWishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    @Query("SELECT wi FROM WishlistItem wi WHERE wi.productId = :productId AND wi.notifyOnRestock = true")
    List<WishlistItem> findByProductIdAndNotifyOnRestockTrue(@Param("productId") Long productId);
}
