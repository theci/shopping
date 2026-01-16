package com.ecommerce.review.presentation.web;

import com.ecommerce.customer.infrastructure.security.CustomUserPrincipal;
import com.ecommerce.review.application.ReviewService;
import com.ecommerce.review.dto.*;
import com.ecommerce.shared.dto.ApiResponse;
import com.ecommerce.shared.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 리뷰 API 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * 리뷰 작성
     * POST /api/v1/reviews
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody ReviewCreateRequest request) {
        ReviewResponse response = reviewService.createReview(principal.getCustomerId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "리뷰가 작성되었습니다."));
    }

    /**
     * 리뷰 수정
     * PUT /api/v1/reviews/{reviewId}
     */
    @PutMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewUpdateRequest request) {
        ReviewResponse response = reviewService.updateReview(principal.getCustomerId(), reviewId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "리뷰가 수정되었습니다."));
    }

    /**
     * 리뷰 삭제
     * DELETE /api/v1/reviews/{reviewId}
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long reviewId) {
        reviewService.deleteReview(principal.getCustomerId(), reviewId);
        return ResponseEntity.ok(ApiResponse.success(null, "리뷰가 삭제되었습니다."));
    }

    /**
     * 리뷰 조회
     * GET /api/v1/reviews/{reviewId}
     */
    @GetMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> getReview(
            @PathVariable Long reviewId) {
        ReviewResponse response = reviewService.getReview(reviewId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 상품별 리뷰 목록 조회
     * GET /api/v1/reviews/products/{productId}
     */
    @GetMapping("/products/{productId}")
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> getProductReviews(
            @PathVariable Long productId,
            @ModelAttribute ReviewSearchRequest request) {
        PageResponse<ReviewResponse> response = reviewService.getProductReviews(productId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 상품 리뷰 요약 조회 (평균 평점, 리뷰 수)
     * GET /api/v1/reviews/products/{productId}/summary
     */
    @GetMapping("/products/{productId}/summary")
    public ResponseEntity<ApiResponse<ProductReviewSummary>> getProductReviewSummary(
            @PathVariable Long productId) {
        ProductReviewSummary response = reviewService.getProductReviewSummary(productId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 내 리뷰 목록 조회
     * GET /api/v1/reviews/me
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> getMyReviews(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<ReviewResponse> response = reviewService.getMyReviews(
                principal.getCustomerId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 리뷰 신고
     * POST /api/v1/reviews/{reviewId}/report
     */
    @PostMapping("/{reviewId}/report")
    public ResponseEntity<ApiResponse<ReviewResponse>> reportReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewReportRequest request) {
        ReviewResponse response = reviewService.reportReview(reviewId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "신고가 접수되었습니다."));
    }
}
