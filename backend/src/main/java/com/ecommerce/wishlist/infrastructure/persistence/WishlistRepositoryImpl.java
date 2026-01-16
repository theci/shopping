package com.ecommerce.wishlist.infrastructure.persistence;

import com.ecommerce.wishlist.domain.Wishlist;
import com.ecommerce.wishlist.domain.WishlistItem;
import com.ecommerce.wishlist.domain.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Wishlist Repository 구현체 (인프라 계층)
 */
@Repository
@RequiredArgsConstructor
public class WishlistRepositoryImpl implements WishlistRepository {

    private final JpaWishlistRepository jpaWishlistRepository;
    private final JpaWishlistItemRepository jpaWishlistItemRepository;

    @Override
    public Wishlist save(Wishlist wishlist) {
        return jpaWishlistRepository.save(wishlist);
    }

    @Override
    public Optional<Wishlist> findById(Long id) {
        return jpaWishlistRepository.findById(id);
    }

    @Override
    public Optional<Wishlist> findByCustomerId(Long customerId) {
        return jpaWishlistRepository.findByCustomerIdWithItems(customerId);
    }

    @Override
    public boolean existsByCustomerId(Long customerId) {
        return jpaWishlistRepository.existsByCustomerId(customerId);
    }

    @Override
    public boolean existsByCustomerIdAndProductId(Long customerId, Long productId) {
        return jpaWishlistRepository.existsByCustomerIdAndProductId(customerId, productId);
    }

    @Override
    public List<WishlistItem> findItemsByProductIdAndNotifyOnRestock(Long productId) {
        return jpaWishlistItemRepository.findByProductIdAndNotifyOnRestockTrue(productId);
    }

    @Override
    public void delete(Wishlist wishlist) {
        jpaWishlistRepository.delete(wishlist);
    }
}
