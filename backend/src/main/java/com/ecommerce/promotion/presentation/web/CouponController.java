package com.ecommerce.promotion.presentation.web;

import com.ecommerce.promotion.application.CouponService;
import com.ecommerce.promotion.dto.CouponCreateRequest;
import com.ecommerce.promotion.dto.CouponDiscountRequest;
import com.ecommerce.promotion.dto.CouponDiscountResponse;
import com.ecommerce.promotion.dto.CouponIssueResponse;
import com.ecommerce.promotion.dto.CouponResponse;
import com.ecommerce.promotion.dto.CouponUseRequest;
import com.ecommerce.promotion.dto.MyCouponResponse;
import com.ecommerce.shared.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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

import java.math.BigDecimal;
import java.util.List;

/**
 * 쿠폰 컨트롤러
 */
@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    /**
     * 쿠폰 생성 (관리자)
     */
    @PostMapping
    public ResponseEntity<CouponResponse> createCoupon(
            @Valid @RequestBody CouponCreateRequest request) {
        CouponResponse response = couponService.createCoupon(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 쿠폰 조회 (ID)
     */
    @GetMapping("/{couponId}")
    public ResponseEntity<CouponResponse> getCoupon(@PathVariable Long couponId) {
        CouponResponse response = couponService.getCoupon(couponId);
        return ResponseEntity.ok(response);
    }

    /**
     * 쿠폰 조회 (코드)
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<CouponResponse> getCouponByCode(@PathVariable String code) {
        CouponResponse response = couponService.getCouponByCode(code);
        return ResponseEntity.ok(response);
    }

    /**
     * 활성 쿠폰 목록 조회
     */
    @GetMapping("/active")
    public ResponseEntity<PageResponse<CouponResponse>> getActiveCoupons(
            @PageableDefault(size = 20, sort = "validUntil", direction = Sort.Direction.ASC) Pageable pageable) {
        PageResponse<CouponResponse> response = couponService.getActiveCoupons(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * 전체 쿠폰 목록 조회 (관리자)
     */
    @GetMapping
    public ResponseEntity<PageResponse<CouponResponse>> getAllCoupons(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<CouponResponse> response = couponService.getAllCoupons(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * 쿠폰 발급 (ID)
     */
    @PostMapping("/{couponId}/issue")
    public ResponseEntity<CouponIssueResponse> issueCoupon(
            @PathVariable Long couponId,
            @RequestParam Long customerId) {
        CouponIssueResponse response = couponService.issueCoupon(couponId, customerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 쿠폰 발급 (코드)
     */
    @PostMapping("/code/{code}/issue")
    public ResponseEntity<CouponIssueResponse> issueCouponByCode(
            @PathVariable String code,
            @RequestParam Long customerId) {
        CouponIssueResponse response = couponService.issueCouponByCode(code, customerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 내 쿠폰 목록 조회
     */
    @GetMapping("/my")
    public ResponseEntity<List<MyCouponResponse>> getMyCoupons(
            @RequestParam Long customerId) {
        List<MyCouponResponse> response = couponService.getMyCoupons(customerId);
        return ResponseEntity.ok(response);
    }

    /**
     * 사용 가능한 내 쿠폰 목록 조회
     */
    @GetMapping("/my/available")
    public ResponseEntity<List<MyCouponResponse>> getMyAvailableCoupons(
            @RequestParam Long customerId) {
        List<MyCouponResponse> response = couponService.getMyAvailableCoupons(customerId);
        return ResponseEntity.ok(response);
    }

    /**
     * 쿠폰 할인 금액 계산
     */
    @PostMapping("/{couponId}/calculate-discount")
    public ResponseEntity<CouponDiscountResponse> calculateDiscount(
            @PathVariable Long couponId,
            @RequestParam Long customerId,
            @Valid @RequestBody CouponDiscountRequest request) {
        CouponDiscountResponse response = couponService.calculateDiscount(couponId, customerId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 쿠폰 사용
     */
    @PostMapping("/{couponId}/use")
    public ResponseEntity<BigDecimal> useCoupon(
            @PathVariable Long couponId,
            @Valid @RequestBody CouponUseRequest request) {
        BigDecimal discountAmount = couponService.useCoupon(
                couponId, request.getCustomerId(), request.getOrderId(), request.getOrderAmount());
        return ResponseEntity.ok(discountAmount);
    }

    /**
     * 쿠폰 사용 취소
     */
    @DeleteMapping("/{couponId}/use")
    public ResponseEntity<Void> cancelCouponUsage(
            @PathVariable Long couponId,
            @RequestParam Long customerId) {
        couponService.cancelCouponUsage(couponId, customerId);
        return ResponseEntity.ok().build();
    }

    /**
     * 쿠폰 비활성화 (관리자)
     */
    @PutMapping("/{couponId}/deactivate")
    public ResponseEntity<Void> deactivateCoupon(@PathVariable Long couponId) {
        couponService.deactivateCoupon(couponId);
        return ResponseEntity.ok().build();
    }

    /**
     * 쿠폰 활성화 (관리자)
     */
    @PutMapping("/{couponId}/activate")
    public ResponseEntity<Void> activateCoupon(@PathVariable Long couponId) {
        couponService.activateCoupon(couponId);
        return ResponseEntity.ok().build();
    }
}
