package com.ecommerce.review.application;

import com.ecommerce.review.domain.event.ReviewCreatedEvent;
import com.ecommerce.review.domain.event.ReviewDeletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Review 도메인 이벤트 핸들러
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ReviewEventHandler {

    /**
     * 리뷰 생성 이벤트 처리
     */
    @Async
    @EventListener
    public void handleReviewCreated(ReviewCreatedEvent event) {
        log.info("리뷰 생성 이벤트 수신: reviewId={}, productId={}, rating={}",
                event.getReviewId(), event.getProductId(), event.getRating());

        // TODO: 상품의 평균 평점 업데이트 (캐시 또는 비정규화)
        // TODO: 리뷰 작성 포인트 지급
    }

    /**
     * 리뷰 삭제 이벤트 처리
     */
    @Async
    @EventListener
    public void handleReviewDeleted(ReviewDeletedEvent event) {
        log.info("리뷰 삭제 이벤트 수신: reviewId={}, productId={}, rating={}",
                event.getReviewId(), event.getProductId(), event.getRating());

        // TODO: 상품의 평균 평점 업데이트 (캐시 또는 비정규화)
    }
}
