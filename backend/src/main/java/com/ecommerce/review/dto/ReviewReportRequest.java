package com.ecommerce.review.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 리뷰 신고 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewReportRequest {

    @NotBlank(message = "신고 사유는 필수입니다.")
    @Size(max = 500, message = "신고 사유는 500자 이하여야 합니다.")
    private String reason;
}
