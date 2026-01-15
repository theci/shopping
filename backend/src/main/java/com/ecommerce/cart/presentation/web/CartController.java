package com.ecommerce.cart.presentation.web;

import com.ecommerce.cart.application.CartService;
import com.ecommerce.cart.dto.*;
import com.ecommerce.customer.infrastructure.security.CustomUserPrincipal;
import com.ecommerce.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 장바구니 API 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * 내 장바구니 조회
     * GET /api/v1/carts/me
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<CartResponse>> getMyCart(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        CartResponse response = cartService.getMyCart(principal.getCustomerId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 장바구니에 상품 추가
     * POST /api/v1/carts/items
     */
    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody CartItemRequest request) {
        CartResponse response = cartService.addItem(principal.getCustomerId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "상품이 장바구니에 추가되었습니다."));
    }

    /**
     * 장바구니 아이템 수량 변경
     * PUT /api/v1/carts/items/{itemId}
     */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateItemQuantity(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long itemId,
            @Valid @RequestBody CartItemQuantityRequest request) {
        CartResponse response = cartService.updateItemQuantity(principal.getCustomerId(), itemId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "수량이 변경되었습니다."));
    }

    /**
     * 장바구니 아이템 삭제
     * DELETE /api/v1/carts/items/{itemId}
     */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long itemId) {
        CartResponse response = cartService.removeItem(principal.getCustomerId(), itemId);
        return ResponseEntity.ok(ApiResponse.success(response, "상품이 삭제되었습니다."));
    }

    /**
     * 장바구니 비우기
     * DELETE /api/v1/carts/me
     */
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        cartService.clearCart(principal.getCustomerId());
        return ResponseEntity.ok(ApiResponse.success(null, "장바구니가 비워졌습니다."));
    }
}
