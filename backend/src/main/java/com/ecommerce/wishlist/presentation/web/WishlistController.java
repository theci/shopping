package com.ecommerce.wishlist.presentation.web;

import com.ecommerce.wishlist.application.WishlistService;
import com.ecommerce.wishlist.dto.WishlistItemRequest;
import com.ecommerce.wishlist.dto.WishlistItemResponse;
import com.ecommerce.wishlist.dto.WishlistNotificationRequest;
import com.ecommerce.wishlist.dto.WishlistResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Wishlist 컨트롤러
 */
@RestController
@RequestMapping("/api/wishlists")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    /**
     * 내 찜 목록 조회
     */
    @GetMapping("/me")
    public ResponseEntity<WishlistResponse> getMyWishlist(@RequestParam Long customerId) {
        WishlistResponse response = wishlistService.getMyWishlist(customerId);
        return ResponseEntity.ok(response);
    }

    /**
     * 상품 찜하기
     */
    @PostMapping("/items")
    public ResponseEntity<WishlistItemResponse> addItem(
            @RequestParam Long customerId,
            @Valid @RequestBody WishlistItemRequest request) {
        WishlistItemResponse response = wishlistService.addItem(customerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 찜하기 삭제 (아이템 ID)
     */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItemById(
            @RequestParam Long customerId,
            @PathVariable Long itemId) {
        wishlistService.removeItemById(customerId, itemId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 찜하기 삭제 (상품 ID)
     */
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> removeItem(
            @RequestParam Long customerId,
            @PathVariable Long productId) {
        wishlistService.removeItem(customerId, productId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 재고 알림 설정
     */
    @PutMapping("/notification")
    public ResponseEntity<Void> setRestockNotification(
            @RequestParam Long customerId,
            @Valid @RequestBody WishlistNotificationRequest request) {
        wishlistService.setRestockNotification(customerId, request);
        return ResponseEntity.ok().build();
    }

    /**
     * 찜 목록 비우기
     */
    @DeleteMapping("/me")
    public ResponseEntity<Void> clearWishlist(@RequestParam Long customerId) {
        wishlistService.clearWishlist(customerId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 상품이 찜 목록에 있는지 확인
     */
    @GetMapping("/check")
    public ResponseEntity<Boolean> isProductInWishlist(
            @RequestParam Long customerId,
            @RequestParam Long productId) {
        boolean exists = wishlistService.isProductInWishlist(customerId, productId);
        return ResponseEntity.ok(exists);
    }
}
