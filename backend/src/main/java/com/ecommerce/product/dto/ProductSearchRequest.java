package com.ecommerce.product.dto;

import com.ecommerce.product.domain.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 상품 검색 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchRequest {

    private String keyword;
    private ProductStatus status;
    private Long categoryId;
    private Integer page = 0;
    private Integer size = 20;
    private String sort = "createdAt";
    private String direction = "DESC";
}
