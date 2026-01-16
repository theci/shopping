package com.ecommerce.review.infrastructure.persistence;

import com.ecommerce.review.domain.Review;
import com.ecommerce.review.domain.ReviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * Review JPA Repository
 */
public interface JpaReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.images WHERE r.id = :id")
    Optional<Review> findByIdWithImages(@Param("id") Long id);

    Page<Review> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);

    Page<Review> findByProductIdAndReviewStatusOrderByCreatedAtDesc(
            Long productId, ReviewStatus status, Pageable pageable);

    Page<Review> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    Optional<Review> findByOrderIdAndProductId(Long orderId, Long productId);

    boolean existsByOrderIdAndProductId(Long orderId, Long productId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productId = :productId AND r.reviewStatus = 'ACTIVE'")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.productId = :productId AND r.reviewStatus = 'ACTIVE'")
    Long countByProductIdAndStatusActive(@Param("productId") Long productId);
}
