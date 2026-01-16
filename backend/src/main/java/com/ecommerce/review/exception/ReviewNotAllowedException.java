package com.ecommerce.review.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 리뷰 작성이 허용되지 않을 때 발생하는 예외
 */
public class ReviewNotAllowedException extends BusinessException {

    public ReviewNotAllowedException(String message) {
        super("REVIEW_NOT_ALLOWED", message);
    }

    public static ReviewNotAllowedException alreadyReviewed() {
        return new ReviewNotAllowedException("이미 해당 상품에 대한 리뷰를 작성하셨습니다.");
    }

    public static ReviewNotAllowedException orderNotCompleted() {
        return new ReviewNotAllowedException("구매 확정된 주문에 대해서만 리뷰를 작성할 수 있습니다.");
    }

    public static ReviewNotAllowedException notOwnReview() {
        return new ReviewNotAllowedException("본인의 리뷰만 수정/삭제할 수 있습니다.");
    }
}
