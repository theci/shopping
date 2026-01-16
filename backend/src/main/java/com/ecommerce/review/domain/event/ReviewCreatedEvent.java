package com.ecommerce.review.domain.event;

import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 리뷰 생성 이벤트
 */
@Getter
public class ReviewCreatedEvent extends BaseDomainEvent {

    private final Long reviewId;
    private final Long productId;
    private final Long customerId;
    private final Long orderId;
    private final Integer rating;

    public ReviewCreatedEvent(Long reviewId, Long productId, Long customerId, Long orderId, Integer rating) {
        super();
        this.reviewId = reviewId;
        this.productId = productId;
        this.customerId = customerId;
        this.orderId = orderId;
        this.rating = rating;
    }
}
