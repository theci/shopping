package com.ecommerce.shipping.presentation.web;

import com.ecommerce.shared.dto.ApiResponse;
import com.ecommerce.shared.dto.PageResponse;
import com.ecommerce.shipping.application.ShippingService;
import com.ecommerce.shipping.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 배송 API 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/shippings")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingService shippingService;

    /**
     * 배송 생성 (관리자)
     * POST /api/v1/shippings
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ShippingResponse>> createShipping(
            @Valid @RequestBody ShippingCreateRequest request) {
        ShippingResponse response = shippingService.createShipping(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "배송이 생성되었습니다."));
    }

    /**
     * 배송 목록 조회 (관리자)
     * GET /api/v1/shippings
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ShippingResponse>>> getShippings(
            @ModelAttribute ShippingSearchRequest request) {
        PageResponse<ShippingResponse> response = shippingService.getShippings(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 배송 상세 조회
     * GET /api/v1/shippings/{shippingId}
     */
    @GetMapping("/{shippingId}")
    public ResponseEntity<ApiResponse<ShippingResponse>> getShipping(
            @PathVariable Long shippingId) {
        ShippingResponse response = shippingService.getShipping(shippingId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 주문별 배송 조회
     * GET /api/v1/shippings/orders/{orderId}
     */
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<ShippingResponse>> getShippingByOrderId(
            @PathVariable Long orderId) {
        ShippingResponse response = shippingService.getShippingByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 송장번호로 배송 추적
     * GET /api/v1/shippings/track/{trackingNumber}
     */
    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<ApiResponse<ShippingResponse>> trackShipping(
            @PathVariable String trackingNumber) {
        ShippingResponse response = shippingService.trackByTrackingNumber(trackingNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 배송 준비 시작 (관리자)
     * POST /api/v1/shippings/{shippingId}/prepare
     */
    @PostMapping("/{shippingId}/prepare")
    public ResponseEntity<ApiResponse<ShippingResponse>> startPreparing(
            @PathVariable Long shippingId,
            @RequestParam String shippingCompany) {
        ShippingResponse response = shippingService.startPreparing(shippingId, shippingCompany);
        return ResponseEntity.ok(ApiResponse.success(response, "배송 준비가 시작되었습니다."));
    }

    /**
     * 집하 완료 (관리자)
     * POST /api/v1/shippings/{shippingId}/pickup
     */
    @PostMapping("/{shippingId}/pickup")
    public ResponseEntity<ApiResponse<ShippingResponse>> pickUp(
            @PathVariable Long shippingId,
            @RequestParam String trackingNumber) {
        ShippingResponse response = shippingService.pickUp(shippingId, trackingNumber);
        return ResponseEntity.ok(ApiResponse.success(response, "집하가 완료되었습니다."));
    }

    /**
     * 배송 상태 업데이트 (관리자)
     * PATCH /api/v1/shippings/{shippingId}/status
     */
    @PatchMapping("/{shippingId}/status")
    public ResponseEntity<ApiResponse<ShippingResponse>> updateStatus(
            @PathVariable Long shippingId,
            @Valid @RequestBody ShippingStatusUpdateRequest request) {
        ShippingResponse response = shippingService.updateStatus(shippingId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "배송 상태가 업데이트되었습니다."));
    }

    /**
     * 배송 완료 처리 (관리자)
     * POST /api/v1/shippings/{shippingId}/complete
     */
    @PostMapping("/{shippingId}/complete")
    public ResponseEntity<ApiResponse<ShippingResponse>> completeDelivery(
            @PathVariable Long shippingId) {
        ShippingResponse response = shippingService.completeDelivery(shippingId);
        return ResponseEntity.ok(ApiResponse.success(response, "배송이 완료되었습니다."));
    }
}
