package com.ecommerce.payment.presentation.web;

import com.ecommerce.customer.infrastructure.security.CustomUserPrincipal;
import com.ecommerce.payment.application.PaymentService;
import com.ecommerce.payment.dto.*;
import com.ecommerce.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 결제 API 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * 결제 요청 (결제 초기화)
     * POST /api/v1/payments
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PaymentInitResponse>> initiatePayment(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody PaymentRequest request) {
        PaymentInitResponse response = paymentService.initiatePayment(principal.getCustomerId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "결제가 요청되었습니다."));
    }

    /**
     * 결제 승인
     * POST /api/v1/payments/confirm
     */
    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<PaymentResponse>> confirmPayment(
            @Valid @RequestBody PaymentConfirmRequest request) {
        PaymentResponse response = paymentService.confirmPayment(request);
        return ResponseEntity.ok(ApiResponse.success(response, "결제가 완료되었습니다."));
    }

    /**
     * 결제 조회
     * GET /api/v1/payments/{paymentId}
     */
    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPayment(
            @PathVariable Long paymentId) {
        PaymentResponse response = paymentService.getPayment(paymentId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 주문별 결제 조회
     * GET /api/v1/payments/orders/{orderId}
     */
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByOrderId(
            @PathVariable Long orderId) {
        PaymentResponse response = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 환불 요청
     * POST /api/v1/payments/{paymentId}/refund
     */
    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<ApiResponse<PaymentResponse>> refundPayment(
            @PathVariable Long paymentId,
            @Valid @RequestBody RefundRequest request) {
        PaymentResponse response = paymentService.refundPayment(paymentId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "환불이 처리되었습니다."));
    }

    /**
     * 결제 취소 (결제 완료 전)
     * POST /api/v1/payments/{paymentId}/cancel
     */
    @PostMapping("/{paymentId}/cancel")
    public ResponseEntity<ApiResponse<PaymentResponse>> cancelPayment(
            @PathVariable Long paymentId,
            @RequestParam(required = false, defaultValue = "사용자 요청") String reason) {
        PaymentResponse response = paymentService.cancelPayment(paymentId, reason);
        return ResponseEntity.ok(ApiResponse.success(response, "결제가 취소되었습니다."));
    }

    /**
     * PG사 Webhook 처리
     * POST /api/v1/payments/webhook
     */
    @PostMapping("/webhook")
    public ResponseEntity<ApiResponse<Void>> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Toss-Signature", required = false) String signature) {
        // TODO: Webhook 검증 및 처리
        // 1. 서명 검증
        // 2. 결제 상태 업데이트
        // 3. 이벤트 발행
        return ResponseEntity.ok(ApiResponse.success(null, "Webhook 수신 완료"));
    }
}
