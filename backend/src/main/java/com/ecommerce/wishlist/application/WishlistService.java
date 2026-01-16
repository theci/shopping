package com.ecommerce.wishlist.application;

import com.ecommerce.product.domain.Product;
import com.ecommerce.product.domain.ProductRepository;
import com.ecommerce.product.exception.ProductNotFoundException;
import com.ecommerce.wishlist.domain.Wishlist;
import com.ecommerce.wishlist.domain.WishlistItem;
import com.ecommerce.wishlist.domain.WishlistRepository;
import com.ecommerce.wishlist.dto.WishlistItemRequest;
import com.ecommerce.wishlist.dto.WishlistItemResponse;
import com.ecommerce.wishlist.dto.WishlistNotificationRequest;
import com.ecommerce.wishlist.dto.WishlistResponse;
import com.ecommerce.wishlist.exception.WishlistItemNotFoundException;
import com.ecommerce.wishlist.exception.WishlistNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Wishlist 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final WishlistMapper wishlistMapper;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * 내 찜 목록 조회
     */
    public WishlistResponse getMyWishlist(Long customerId) {
        Wishlist wishlist = wishlistRepository.findByCustomerId(customerId)
                .orElseGet(() -> createEmptyWishlist(customerId));

        return wishlistMapper.toWishlistResponse(wishlist, productRepository);
    }

    /**
     * 상품 찜하기
     */
    @Transactional
    public WishlistItemResponse addItem(Long customerId, WishlistItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(request.getProductId()));

        // 찜 목록 조회 또는 생성
        Wishlist wishlist = wishlistRepository.findByCustomerId(customerId)
                .orElseGet(() -> createAndSaveWishlist(customerId));

        // 상품 찜하기 추가
        String imageUrl = product.getImages().isEmpty() ? null :
                product.getImages().get(0).getImageUrl();

        WishlistItem item = wishlist.addItem(
                product.getId(),
                product.getName(),
                imageUrl
        );

        // 재고 알림 설정
        if (request.getNotifyOnRestock() != null && request.getNotifyOnRestock()) {
            wishlist.setRestockNotification(product.getId(), true);
        }

        Wishlist savedWishlist = wishlistRepository.save(wishlist);

        // 도메인 이벤트 발행
        savedWishlist.getDomainEvents().forEach(eventPublisher::publishEvent);
        savedWishlist.clearDomainEvents();

        return wishlistMapper.toWishlistItemResponse(item, product);
    }

    /**
     * 찜하기 삭제 (상품 ID)
     */
    @Transactional
    public void removeItem(Long customerId, Long productId) {
        Wishlist wishlist = wishlistRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new WishlistNotFoundException(customerId));

        wishlist.removeItem(productId);

        Wishlist savedWishlist = wishlistRepository.save(wishlist);

        savedWishlist.getDomainEvents().forEach(eventPublisher::publishEvent);
        savedWishlist.clearDomainEvents();
    }

    /**
     * 찜하기 삭제 (아이템 ID)
     */
    @Transactional
    public void removeItemById(Long customerId, Long itemId) {
        Wishlist wishlist = wishlistRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new WishlistNotFoundException(customerId));

        wishlist.removeItemById(itemId);

        Wishlist savedWishlist = wishlistRepository.save(wishlist);

        savedWishlist.getDomainEvents().forEach(eventPublisher::publishEvent);
        savedWishlist.clearDomainEvents();
    }

    /**
     * 재고 알림 설정
     */
    @Transactional
    public void setRestockNotification(Long customerId, WishlistNotificationRequest request) {
        Wishlist wishlist = wishlistRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new WishlistNotFoundException(customerId));

        if (!wishlist.containsProduct(request.getProductId())) {
            throw new WishlistItemNotFoundException(customerId, request.getProductId());
        }

        wishlist.setRestockNotification(request.getProductId(), request.getNotifyOnRestock());
        wishlistRepository.save(wishlist);
    }

    /**
     * 찜 목록 비우기
     */
    @Transactional
    public void clearWishlist(Long customerId) {
        Wishlist wishlist = wishlistRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new WishlistNotFoundException(customerId));

        wishlist.clear();
        wishlistRepository.save(wishlist);
    }

    /**
     * 상품이 찜 목록에 있는지 확인
     */
    public boolean isProductInWishlist(Long customerId, Long productId) {
        return wishlistRepository.existsByCustomerIdAndProductId(customerId, productId);
    }

    /**
     * 재고 알림 대상 고객 조회
     */
    public List<WishlistItem> getRestockNotificationTargets(Long productId) {
        return wishlistRepository.findItemsByProductIdAndNotifyOnRestock(productId);
    }

    private Wishlist createEmptyWishlist(Long customerId) {
        return Wishlist.builder()
                .customerId(customerId)
                .build();
    }

    private Wishlist createAndSaveWishlist(Long customerId) {
        Wishlist wishlist = Wishlist.builder()
                .customerId(customerId)
                .build();
        return wishlistRepository.save(wishlist);
    }
}
