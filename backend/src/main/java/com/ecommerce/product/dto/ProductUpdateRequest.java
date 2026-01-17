package com.ecommerce.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 상품 수정 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateRequest {

    @Size(max = 255, message = "상품명은 255자를 초과할 수 없습니다")
    private String name;

    @Size(max = 2000, message = "상품 설명은 2000자를 초과할 수 없습니다")
    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "가격은 0보다 커야 합니다")
    @Digits(integer = 10, fraction = 2, message = "가격 형식이 올바르지 않습니다")
    private BigDecimal price;

    @DecimalMin(value = "0.0", inclusive = false, message = "할인가는 0보다 커야 합니다")
    @Digits(integer = 10, fraction = 2, message = "할인가 형식이 올바르지 않습니다")
    private BigDecimal discountPrice;

    @Size(max = 100, message = "브랜드명은 100자를 초과할 수 없습니다")
    private String brand;

    private Long categoryId;
}
