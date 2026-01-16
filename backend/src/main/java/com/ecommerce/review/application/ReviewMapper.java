package com.ecommerce.review.application;

import com.ecommerce.review.domain.Review;
import com.ecommerce.review.dto.ReviewResponse;
import org.springframework.stereotype.Component;

/**
 * Review Mapper
 */
@Component
public class ReviewMapper {

    public ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProductId())
                .customerId(review.getCustomerId())
                .orderId(review.getOrderId())
                .rating(review.getRating())
                .content(review.getContent())
                .reviewStatus(review.getReviewStatus())
                .reviewStatusDescription(review.getReviewStatus().getDescription())
                .imageUrls(review.getImageUrls())
                .reportCount(review.getReportCount())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
