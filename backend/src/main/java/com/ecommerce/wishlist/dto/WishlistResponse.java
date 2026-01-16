package com.ecommerce.wishlist.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 찜 목록 응답 DTO
 */
@Getter
@Builder
public class WishlistResponse {

    private Long id;
    private Long customerId;
    private List<WishlistItemResponse> items;
    private int itemCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
