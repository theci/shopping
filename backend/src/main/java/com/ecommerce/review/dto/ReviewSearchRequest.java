package com.ecommerce.review.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * 리뷰 검색 요청 DTO
 */
@Getter
@Setter
public class ReviewSearchRequest {

    private Integer rating;
    private int page = 0;
    private int size = 10;
}
