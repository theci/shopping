package com.ecommerce.review.domain;

import com.ecommerce.review.domain.event.ReviewCreatedEvent;
import com.ecommerce.review.domain.event.ReviewDeletedEvent;
import com.ecommerce.shared.domain.AggregateRoot;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Review Aggregate Root
 */
@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_review_product_id", columnList = "product_id"),
        @Index(name = "idx_review_customer_id", columnList = "customer_id"),
        @Index(name = "idx_review_order_id", columnList = "order_id"),
        @Index(name = "idx_review_status", columnList = "review_status")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_review_order", columnNames = {"order_id", "product_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review extends AggregateRoot {

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "review_status", nullable = false, length = 50)
    private ReviewStatus reviewStatus;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewImage> images = new ArrayList<>();

    @Column(name = "report_reason")
    private String reportReason;

    @Column(name = "report_count")
    private Integer reportCount;

    @Builder
    public Review(Long productId, Long customerId, Long orderId, Integer rating, String content) {
        validateRating(rating);
        this.productId = productId;
        this.customerId = customerId;
        this.orderId = orderId;
        this.rating = rating;
        this.content = content;
        this.reviewStatus = ReviewStatus.ACTIVE;
        this.reportCount = 0;
    }

    /**
     * 리뷰 생성 이벤트 발행
     */
    public void create() {
        registerEvent(new ReviewCreatedEvent(
                this.getId(),
                this.productId,
                this.customerId,
                this.orderId,
                this.rating
        ));
    }

    /**
     * 리뷰 수정
     */
    public void update(Integer rating, String content) {
        if (!this.reviewStatus.canEdit()) {
            throw new IllegalStateException("수정할 수 없는 상태입니다: " + this.reviewStatus.getDescription());
        }
        validateRating(rating);
        this.rating = rating;
        this.content = content;
    }

    /**
     * 이미지 추가
     */
    public void addImage(String imageUrl, Integer displayOrder) {
        ReviewImage image = ReviewImage.builder()
                .review(this)
                .imageUrl(imageUrl)
                .displayOrder(displayOrder != null ? displayOrder : this.images.size())
                .build();
        this.images.add(image);
    }

    /**
     * 이미지 전체 교체
     */
    public void replaceImages(List<String> imageUrls) {
        this.images.clear();
        for (int i = 0; i < imageUrls.size(); i++) {
            addImage(imageUrls.get(i), i);
        }
    }

    /**
     * 리뷰 삭제 (soft delete)
     */
    public void delete() {
        if (!this.reviewStatus.canDelete()) {
            throw new IllegalStateException("삭제할 수 없는 상태입니다: " + this.reviewStatus.getDescription());
        }
        this.reviewStatus = ReviewStatus.DELETED;

        registerEvent(new ReviewDeletedEvent(
                this.getId(),
                this.productId,
                this.customerId,
                this.rating
        ));
    }

    /**
     * 리뷰 신고
     */
    public void report(String reason) {
        this.reportCount++;
        this.reportReason = reason;

        // 신고 3회 이상 시 자동 숨김 처리
        if (this.reportCount >= 3 && this.reviewStatus == ReviewStatus.ACTIVE) {
            this.reviewStatus = ReviewStatus.REPORTED;
        }
    }

    /**
     * 리뷰 숨김 처리 (관리자)
     */
    public void hide() {
        this.reviewStatus = ReviewStatus.HIDDEN;
    }

    /**
     * 리뷰 복구 (관리자)
     */
    public void restore() {
        if (this.reviewStatus == ReviewStatus.DELETED) {
            throw new IllegalStateException("삭제된 리뷰는 복구할 수 없습니다.");
        }
        this.reviewStatus = ReviewStatus.ACTIVE;
        this.reportCount = 0;
        this.reportReason = null;
    }

    /**
     * 본인 리뷰인지 확인
     */
    public boolean isOwnedBy(Long customerId) {
        return this.customerId.equals(customerId);
    }

    /**
     * 이미지 URL 목록 반환
     */
    public List<String> getImageUrls() {
        return this.images.stream()
                .map(ReviewImage::getImageUrl)
                .toList();
    }

    private void validateRating(Integer rating) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new IllegalArgumentException("평점은 1~5 사이여야 합니다.");
        }
    }
}
