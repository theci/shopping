package com.ecommerce.wishlist.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 찜 아이템 응답 DTO
 */
@Getter
@Builder
public class WishlistItemResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private BigDecimal productPrice;
    private Integer stockQuantity;
    private Boolean inStock;
    private Boolean notifyOnRestock;
    private LocalDateTime addedAt;
}
