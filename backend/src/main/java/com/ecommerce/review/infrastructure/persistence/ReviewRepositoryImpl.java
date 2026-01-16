package com.ecommerce.review.infrastructure.persistence;

import com.ecommerce.review.domain.Review;
import com.ecommerce.review.domain.ReviewRepository;
import com.ecommerce.review.domain.ReviewStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Review Repository 구현체
 */
@Repository
@RequiredArgsConstructor
public class ReviewRepositoryImpl implements ReviewRepository {

    private final JpaReviewRepository jpaReviewRepository;

    @Override
    public Review save(Review review) {
        return jpaReviewRepository.save(review);
    }

    @Override
    public Optional<Review> findById(Long id) {
        return jpaReviewRepository.findByIdWithImages(id);
    }

    @Override
    public Page<Review> findByProductId(Long productId, Pageable pageable) {
        return jpaReviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
    }

    @Override
    public Page<Review> findByProductIdAndStatus(Long productId, ReviewStatus status, Pageable pageable) {
        return jpaReviewRepository.findByProductIdAndReviewStatusOrderByCreatedAtDesc(productId, status, pageable);
    }

    @Override
    public Page<Review> findByCustomerId(Long customerId, Pageable pageable) {
        return jpaReviewRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);
    }

    @Override
    public Optional<Review> findByOrderIdAndProductId(Long orderId, Long productId) {
        return jpaReviewRepository.findByOrderIdAndProductId(orderId, productId);
    }

    @Override
    public boolean existsByOrderIdAndProductId(Long orderId, Long productId) {
        return jpaReviewRepository.existsByOrderIdAndProductId(orderId, productId);
    }

    @Override
    public Double getAverageRatingByProductId(Long productId) {
        return jpaReviewRepository.getAverageRatingByProductId(productId);
    }

    @Override
    public Long countByProductId(Long productId) {
        return jpaReviewRepository.countByProductIdAndStatusActive(productId);
    }
}
