package com.ecommerce.product.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 상품 생성 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateRequest {

    @NotBlank(message = "상품명은 필수입니다")
    @Size(max = 255, message = "상품명은 255자를 초과할 수 없습니다")
    private String name;

    @Size(max = 2000, message = "상품 설명은 2000자를 초과할 수 없습니다")
    private String description;

    @NotNull(message = "가격은 필수입니다")
    @DecimalMin(value = "0.0", inclusive = false, message = "가격은 0보다 커야 합니다")
    @Digits(integer = 10, fraction = 2, message = "가격 형식이 올바르지 않습니다")
    private BigDecimal price;

    @DecimalMin(value = "0.0", inclusive = false, message = "할인가는 0보다 커야 합니다")
    @Digits(integer = 10, fraction = 2, message = "할인가 형식이 올바르지 않습니다")
    private BigDecimal discountPrice;

    @NotNull(message = "재고 수량은 필수입니다")
    @Min(value = 0, message = "재고 수량은 0 이상이어야 합니다")
    private Integer stockQuantity;

    @Size(max = 100, message = "브랜드명은 100자를 초과할 수 없습니다")
    private String brand;

    private Long categoryId;
}
