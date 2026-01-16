package com.ecommerce.wishlist.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 재고 알림 설정 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WishlistNotificationRequest {

    @NotNull(message = "상품 ID는 필수입니다.")
    private Long productId;

    @NotNull(message = "알림 설정 여부는 필수입니다.")
    private Boolean notifyOnRestock;
}
