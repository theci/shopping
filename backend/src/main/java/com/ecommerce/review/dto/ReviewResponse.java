package com.ecommerce.review.dto;

import com.ecommerce.review.domain.ReviewStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 리뷰 응답 DTO
 */
@Getter
@Builder
public class ReviewResponse {

    private Long id;
    private Long productId;
    private Long customerId;
    private Long orderId;
    private Integer rating;
    private String content;
    private ReviewStatus reviewStatus;
    private String reviewStatusDescription;
    private List<String> imageUrls;
    private Integer reportCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
