package com.ecommerce.wishlist.domain;

import com.ecommerce.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * WishlistItem Entity (찜 아이템)
 */
@Entity
@Table(name = "wishlist_items", indexes = {
        @Index(name = "idx_wishlist_item_product", columnList = "product_id"),
        @Index(name = "idx_wishlist_item_wishlist", columnList = "wishlist_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_wishlist_product", columnNames = {"wishlist_id", "product_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WishlistItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wishlist_id", nullable = false)
    private Wishlist wishlist;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_image_url")
    private String productImageUrl;

    @Column(name = "notify_on_restock", nullable = false)
    private Boolean notifyOnRestock;

    @Builder
    public WishlistItem(Wishlist wishlist, Long productId, String productName,
                        String productImageUrl, Boolean notifyOnRestock) {
        this.wishlist = wishlist;
        this.productId = productId;
        this.productName = productName;
        this.productImageUrl = productImageUrl;
        this.notifyOnRestock = notifyOnRestock != null ? notifyOnRestock : false;
    }

    /**
     * 재고 알림 설정
     */
    void setNotifyOnRestock(boolean notify) {
        this.notifyOnRestock = notify;
    }

    /**
     * 상품 정보 업데이트
     */
    void updateProductInfo(String productName, String productImageUrl) {
        this.productName = productName;
        this.productImageUrl = productImageUrl;
    }
}
