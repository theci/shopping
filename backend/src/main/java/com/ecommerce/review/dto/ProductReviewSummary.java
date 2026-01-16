package com.ecommerce.review.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * 상품 리뷰 요약 DTO
 */
@Getter
@Builder
public class ProductReviewSummary {

    private Long productId;
    private Double averageRating;
    private Long reviewCount;
}
