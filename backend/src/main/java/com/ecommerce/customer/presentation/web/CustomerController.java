package com.ecommerce.customer.presentation.web;

import com.ecommerce.customer.application.CustomerService;
import com.ecommerce.customer.dto.*;
import com.ecommerce.customer.infrastructure.security.CustomUserPrincipal;
import com.ecommerce.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 고객 API 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    /**
     * 내 정보 조회
     * GET /api/v1/customers/me
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<CustomerResponse>> getMyInfo(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        CustomerResponse response = customerService.getMyInfo(principal.getCustomerId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 내 정보 수정
     * PUT /api/v1/customers/me
     */
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateMyInfo(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody CustomerUpdateRequest request) {
        CustomerResponse response = customerService.updateMyInfo(principal.getCustomerId(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "정보가 수정되었습니다."));
    }

    /**
     * 비밀번호 변경
     * PUT /api/v1/customers/me/password
     */
    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody PasswordChangeRequest request) {
        customerService.changePassword(principal.getCustomerId(), request);
        return ResponseEntity.ok(ApiResponse.success(null, "비밀번호가 변경되었습니다."));
    }

    /**
     * 배송지 추가
     * POST /api/v1/customers/me/addresses
     */
    @PostMapping("/me/addresses")
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody AddressRequest request) {
        AddressResponse response = customerService.addAddress(principal.getCustomerId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "배송지가 추가되었습니다."));
    }

    /**
     * 배송지 수정
     * PUT /api/v1/customers/me/addresses/{addressId}
     */
    @PutMapping("/me/addresses/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request) {
        AddressResponse response = customerService.updateAddress(
                principal.getCustomerId(), addressId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "배송지가 수정되었습니다."));
    }

    /**
     * 배송지 삭제
     * DELETE /api/v1/customers/me/addresses/{addressId}
     */
    @DeleteMapping("/me/addresses/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long addressId) {
        customerService.deleteAddress(principal.getCustomerId(), addressId);
        return ResponseEntity.ok(ApiResponse.success(null, "배송지가 삭제되었습니다."));
    }

    /**
     * 기본 배송지 설정
     * PATCH /api/v1/customers/me/addresses/{addressId}/default
     */
    @PatchMapping("/me/addresses/{addressId}/default")
    public ResponseEntity<ApiResponse<Void>> setDefaultAddress(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long addressId) {
        customerService.setDefaultAddress(principal.getCustomerId(), addressId);
        return ResponseEntity.ok(ApiResponse.success(null, "기본 배송지가 설정되었습니다."));
    }

    /**
     * 회원탈퇴
     * DELETE /api/v1/customers/me
     */
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> withdraw(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody(required = false) WithdrawRequest request) {
        customerService.withdraw(principal.getCustomerId(),
                request != null ? request : new WithdrawRequest());
        return ResponseEntity.ok(ApiResponse.success(null, "회원탈퇴가 완료되었습니다."));
    }
}
