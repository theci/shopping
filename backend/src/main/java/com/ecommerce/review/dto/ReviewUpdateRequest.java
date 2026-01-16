package com.ecommerce.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 리뷰 수정 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewUpdateRequest {

    @NotNull(message = "평점은 필수입니다.")
    @Min(value = 1, message = "평점은 1 이상이어야 합니다.")
    @Max(value = 5, message = "평점은 5 이하여야 합니다.")
    private Integer rating;

    @Size(max = 2000, message = "리뷰 내용은 2000자 이하여야 합니다.")
    private String content;

    @Size(max = 5, message = "이미지는 최대 5개까지 등록할 수 있습니다.")
    private List<String> imageUrls;
}
