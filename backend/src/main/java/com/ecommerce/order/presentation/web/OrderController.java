package com.ecommerce.order.presentation.web;

import com.ecommerce.customer.infrastructure.security.CustomUserPrincipal;
import com.ecommerce.order.application.OrderService;
import com.ecommerce.order.dto.*;
import com.ecommerce.shared.dto.ApiResponse;
import com.ecommerce.shared.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 주문 API 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ========== Admin API ==========

    /**
     * 전체 주문 목록 조회 (Admin)
     * GET /api/v1/orders
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminOrderListResponse>>> getAllOrders(
            @ModelAttribute AdminOrderSearchRequest request) {
        PageResponse<AdminOrderListResponse> response = orderService.getAllOrders(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 주문 상세 조회 (Admin)
     * GET /api/v1/orders/{orderId}
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<AdminOrderResponse>> getOrderForAdmin(
            @PathVariable Long orderId) {
        AdminOrderResponse response = orderService.getOrderForAdmin(orderId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 주문 상태 변경 (Admin)
     * PATCH /api/v1/orders/{orderId}/status
     */
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<AdminOrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        AdminOrderResponse response = orderService.updateOrderStatus(orderId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "주문 상태가 변경되었습니다."));
    }

    /**
     * 배송 정보 입력 (Admin)
     * PATCH /api/v1/orders/{orderId}/shipping
     */
    @PatchMapping("/{orderId}/shipping")
    public ResponseEntity<ApiResponse<AdminOrderResponse>> updateShipping(
            @PathVariable Long orderId,
            @Valid @RequestBody ShippingUpdateRequest request) {
        AdminOrderResponse response = orderService.updateShipping(orderId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "배송 정보가 입력되었습니다."));
    }

    /**
     * 관리자 메모 저장 (Admin)
     * PATCH /api/v1/orders/{orderId}/memo
     */
    @PatchMapping("/{orderId}/memo")
    public ResponseEntity<ApiResponse<AdminOrderResponse>> updateAdminMemo(
            @PathVariable Long orderId,
            @RequestBody AdminMemoRequest request) {
        AdminOrderResponse response = orderService.updateAdminMemo(orderId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "메모가 저장되었습니다."));
    }

    // ========== 일반 사용자 API ==========

    /**
     * 주문 생성 (장바구니에서 주문)
     * POST /api/v1/orders
     */
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody OrderCreateRequest request) {
        OrderResponse response = orderService.createOrder(principal.getCustomerId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "주문이 생성되었습니다."));
    }

    /**
     * 내 주문 목록 조회
     * GET /api/v1/orders/me
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @ModelAttribute OrderSearchRequest searchRequest) {
        PageResponse<OrderResponse> response = orderService.getMyOrders(principal.getCustomerId(), searchRequest);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 내 주문 상세 조회
     * GET /api/v1/orders/me/{orderId}
     */
    @GetMapping("/me/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getMyOrder(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long orderId) {
        OrderResponse response = orderService.getOrder(principal.getCustomerId(), orderId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 주문 취소
     * POST /api/v1/orders/{orderId}/cancel
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long orderId,
            @Valid @RequestBody OrderCancelRequest request) {
        OrderResponse response = orderService.cancelOrder(principal.getCustomerId(), orderId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "주문이 취소되었습니다."));
    }

    /**
     * 구매 확정
     * POST /api/v1/orders/{orderId}/complete
     */
    @PostMapping("/{orderId}/complete")
    public ResponseEntity<ApiResponse<OrderResponse>> completeOrder(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long orderId) {
        OrderResponse response = orderService.completeOrder(principal.getCustomerId(), orderId);
        return ResponseEntity.ok(ApiResponse.success(response, "구매가 확정되었습니다."));
    }
}
