package com.ecommerce.review.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 리뷰 삭제 이벤트
 */
@Getter
public class ReviewDeletedEvent extends BaseDomainEvent {

    private final Long reviewId;
    private final Long productId;
    private final Long customerId;
    private final Integer rating;

    public ReviewDeletedEvent(Long reviewId, Long productId, Long customerId, Integer rating) {
        super();
        this.reviewId = reviewId;
        this.productId = productId;
        this.customerId = customerId;
        this.rating = rating;
    }
}
