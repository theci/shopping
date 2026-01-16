package com.ecommerce.review.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Review Repository 인터페이스 (도메인 계층)
 */
public interface ReviewRepository {

    Review save(Review review);

    Optional<Review> findById(Long id);

    Page<Review> findByProductId(Long productId, Pageable pageable);

    Page<Review> findByProductIdAndStatus(Long productId, ReviewStatus status, Pageable pageable);

    Page<Review> findByCustomerId(Long customerId, Pageable pageable);

    Optional<Review> findByOrderIdAndProductId(Long orderId, Long productId);

    boolean existsByOrderIdAndProductId(Long orderId, Long productId);

    Double getAverageRatingByProductId(Long productId);

    Long countByProductId(Long productId);
}
