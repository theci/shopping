package com.ecommerce.review.application;

import com.ecommerce.order.domain.Order;
import com.ecommerce.order.domain.OrderRepository;
import com.ecommerce.order.domain.OrderStatus;
import com.ecommerce.order.exception.OrderNotFoundException;
import com.ecommerce.review.domain.Review;
import com.ecommerce.review.domain.ReviewRepository;
import com.ecommerce.review.domain.ReviewStatus;
import com.ecommerce.review.dto.*;
import com.ecommerce.review.exception.ReviewNotAllowedException;
import com.ecommerce.review.exception.ReviewNotFoundException;
import com.ecommerce.shared.dto.PageResponse;
import com.ecommerce.shared.infrastructure.DomainEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Review 애플리케이션 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final DomainEventPublisher eventPublisher;
    private final ReviewMapper reviewMapper;

    /**
     * 리뷰 작성
     */
    @Transactional
    public ReviewResponse createReview(Long customerId, ReviewCreateRequest request) {
        log.info("리뷰 작성: customerId={}, productId={}, orderId={}",
                customerId, request.getProductId(), request.getOrderId());

        // 주문 조회 및 검증
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new OrderNotFoundException(request.getOrderId()));

        // 본인 주문인지 확인
        if (!order.getCustomerId().equals(customerId)) {
            throw ReviewNotAllowedException.notOwnReview();
        }

        // 구매 확정된 주문인지 확인
        if (order.getOrderStatus() != OrderStatus.COMPLETED) {
            throw ReviewNotAllowedException.orderNotCompleted();
        }

        // 이미 리뷰를 작성했는지 확인
        if (reviewRepository.existsByOrderIdAndProductId(request.getOrderId(), request.getProductId())) {
            throw ReviewNotAllowedException.alreadyReviewed();
        }

        // 리뷰 생성
        Review review = Review.builder()
                .productId(request.getProductId())
                .customerId(customerId)
                .orderId(request.getOrderId())
                .rating(request.getRating())
                .content(request.getContent())
                .build();

        // 이미지 추가
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            review.replaceImages(request.getImageUrls());
        }

        Review savedReview = reviewRepository.save(review);

        // 이벤트 발행
        savedReview.create();
        eventPublisher.publishEvents(savedReview);

        log.info("리뷰 작성 완료: reviewId={}", savedReview.getId());
        return reviewMapper.toResponse(savedReview);
    }

    /**
     * 리뷰 수정
     */
    @Transactional
    public ReviewResponse updateReview(Long customerId, Long reviewId, ReviewUpdateRequest request) {
        log.info("리뷰 수정: customerId={}, reviewId={}", customerId, reviewId);

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException(reviewId));

        // 본인 리뷰인지 확인
        if (!review.isOwnedBy(customerId)) {
            throw ReviewNotAllowedException.notOwnReview();
        }

        // 수정
        review.update(request.getRating(), request.getContent());

        // 이미지 교체
        if (request.getImageUrls() != null) {
            review.replaceImages(request.getImageUrls());
        }

        Review savedReview = reviewRepository.save(review);
        log.info("리뷰 수정 완료: reviewId={}", reviewId);

        return reviewMapper.toResponse(savedReview);
    }

    /**
     * 리뷰 삭제
     */
    @Transactional
    public void deleteReview(Long customerId, Long reviewId) {
        log.info("리뷰 삭제: customerId={}, reviewId={}", customerId, reviewId);

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException(reviewId));

        // 본인 리뷰인지 확인
        if (!review.isOwnedBy(customerId)) {
            throw ReviewNotAllowedException.notOwnReview();
        }

        review.delete();
        reviewRepository.save(review);

        eventPublisher.publishEvents(review);

        log.info("리뷰 삭제 완료: reviewId={}", reviewId);
    }

    /**
     * 리뷰 조회
     */
    public ReviewResponse getReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException(reviewId));
        return reviewMapper.toResponse(review);
    }

    /**
     * 상품별 리뷰 목록 조회 (활성 상태만)
     */
    public PageResponse<ReviewResponse> getProductReviews(Long productId, ReviewSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());

        Page<Review> reviewPage = reviewRepository.findByProductIdAndStatus(
                productId, ReviewStatus.ACTIVE, pageable);

        Page<ReviewResponse> responsePage = reviewPage.map(reviewMapper::toResponse);
        return PageResponse.of(responsePage);
    }

    /**
     * 내 리뷰 목록 조회
     */
    public PageResponse<ReviewResponse> getMyReviews(Long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Review> reviewPage = reviewRepository.findByCustomerId(customerId, pageable);
        Page<ReviewResponse> responsePage = reviewPage.map(reviewMapper::toResponse);

        return PageResponse.of(responsePage);
    }

    /**
     * 상품 리뷰 요약 조회 (평균 평점, 리뷰 수)
     */
    public ProductReviewSummary getProductReviewSummary(Long productId) {
        Double avgRating = reviewRepository.getAverageRatingByProductId(productId);
        Long reviewCount = reviewRepository.countByProductId(productId);

        return ProductReviewSummary.builder()
                .productId(productId)
                .averageRating(avgRating != null ? avgRating : 0.0)
                .reviewCount(reviewCount != null ? reviewCount : 0L)
                .build();
    }

    /**
     * 리뷰 신고
     */
    @Transactional
    public ReviewResponse reportReview(Long reviewId, ReviewReportRequest request) {
        log.info("리뷰 신고: reviewId={}, reason={}", reviewId, request.getReason());

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException(reviewId));

        review.report(request.getReason());
        Review savedReview = reviewRepository.save(review);

        log.info("리뷰 신고 완료: reviewId={}, reportCount={}", reviewId, savedReview.getReportCount());
        return reviewMapper.toResponse(savedReview);
    }
}
