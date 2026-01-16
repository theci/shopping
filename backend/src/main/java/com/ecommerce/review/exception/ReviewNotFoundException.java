package com.ecommerce.review.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 리뷰를 찾을 수 없을 때 발생하는 예외
 */
public class ReviewNotFoundException extends BusinessException {

    public ReviewNotFoundException(Long reviewId) {
        super("REVIEW_NOT_FOUND", "리뷰를 찾을 수 없습니다. ID: " + reviewId);
    }
}
