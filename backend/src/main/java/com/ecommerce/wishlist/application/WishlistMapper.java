package com.ecommerce.wishlist.application;

import com.ecommerce.product.domain.Product;
import com.ecommerce.product.domain.ProductRepository;
import com.ecommerce.product.domain.ProductStatus;
import com.ecommerce.wishlist.domain.Wishlist;
import com.ecommerce.wishlist.domain.WishlistItem;
import com.ecommerce.wishlist.dto.WishlistItemResponse;
import com.ecommerce.wishlist.dto.WishlistResponse;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Wishlist 매퍼
 */
@Component
public class WishlistMapper {

    /**
     * Wishlist -> WishlistResponse 변환
     */
    public WishlistResponse toWishlistResponse(Wishlist wishlist, ProductRepository productRepository) {
        List<WishlistItemResponse> itemResponses = wishlist.getItems().stream()
                .map(item -> {
                    Product product = productRepository.findById(item.getProductId()).orElse(null);
                    return toWishlistItemResponse(item, product);
                })
                .collect(Collectors.toList());

        return WishlistResponse.builder()
                .id(wishlist.getId())
                .customerId(wishlist.getCustomerId())
                .items(itemResponses)
                .itemCount(wishlist.getItemCount())
                .createdAt(wishlist.getCreatedAt())
                .updatedAt(wishlist.getUpdatedAt())
                .build();
    }

    /**
     * WishlistItem -> WishlistItemResponse 변환
     */
    public WishlistItemResponse toWishlistItemResponse(WishlistItem item, Product product) {
        BigDecimal price = null;
        Integer stockQuantity = null;
        Boolean inStock = false;
        String imageUrl = item.getProductImageUrl();

        if (product != null) {
            price = product.getPrice();
            stockQuantity = product.getStockQuantity();
            inStock = product.getStockQuantity() > 0 && product.getStatus() == ProductStatus.ACTIVE;

            // 최신 이미지 URL 사용
            if (!product.getImages().isEmpty()) {
                imageUrl = product.getImages().get(0).getImageUrl();
            }
        }

        return WishlistItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .productImageUrl(imageUrl)
                .productPrice(price)
                .stockQuantity(stockQuantity)
                .inStock(inStock)
                .notifyOnRestock(item.getNotifyOnRestock())
                .addedAt(item.getCreatedAt())
                .build();
    }
}
