package com.ecommerce.wishlist.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 찜하기 추가 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItemRequest {

    @NotNull(message = "상품 ID는 필수입니다.")
    private Long productId;

    private Boolean notifyOnRestock;
}
