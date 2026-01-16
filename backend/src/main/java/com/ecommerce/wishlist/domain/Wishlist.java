package com.ecommerce.wishlist.domain;

import com.ecommerce.shared.domain.AggregateRoot;
import com.ecommerce.wishlist.domain.event.WishlistItemAddedEvent;
import com.ecommerce.wishlist.domain.event.WishlistItemRemovedEvent;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Wishlist Aggregate Root (찜 목록)
 */
@Entity
@Table(name = "wishlists", indexes = {
        @Index(name = "idx_wishlist_customer", columnList = "customer_id", unique = true)
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Wishlist extends AggregateRoot {

    @Column(name = "customer_id", nullable = false, unique = true)
    private Long customerId;

    @OneToMany(mappedBy = "wishlist", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt DESC")
    private List<WishlistItem> items = new ArrayList<>();

    @Builder
    public Wishlist(Long customerId) {
        this.customerId = customerId;
    }

    /**
     * 상품 찜하기 추가
     */
    public WishlistItem addItem(Long productId, String productName, String productImageUrl) {
        // 이미 찜한 상품인지 확인
        Optional<WishlistItem> existingItem = findItemByProductId(productId);
        if (existingItem.isPresent()) {
            return existingItem.get();
        }

        WishlistItem item = WishlistItem.builder()
                .wishlist(this)
                .productId(productId)
                .productName(productName)
                .productImageUrl(productImageUrl)
                .notifyOnRestock(false)
                .build();

        this.items.add(item);

        registerEvent(new WishlistItemAddedEvent(
                this.getId(),
                this.customerId,
                productId,
                productName
        ));

        return item;
    }

    /**
     * 상품 찜하기 삭제
     */
    public void removeItem(Long productId) {
        WishlistItem item = findItemByProductId(productId)
                .orElseThrow(() -> new IllegalStateException("찜 목록에 없는 상품입니다."));

        this.items.remove(item);

        registerEvent(new WishlistItemRemovedEvent(
                this.getId(),
                this.customerId,
                productId
        ));
    }

    /**
     * 상품 찜하기 삭제 (아이템 ID)
     */
    public void removeItemById(Long itemId) {
        WishlistItem item = findItemById(itemId)
                .orElseThrow(() -> new IllegalStateException("찜 목록에 없는 상품입니다."));

        Long productId = item.getProductId();
        this.items.remove(item);

        registerEvent(new WishlistItemRemovedEvent(
                this.getId(),
                this.customerId,
                productId
        ));
    }

    /**
     * 재고 알림 설정
     */
    public void setRestockNotification(Long productId, boolean notify) {
        WishlistItem item = findItemByProductId(productId)
                .orElseThrow(() -> new IllegalStateException("찜 목록에 없는 상품입니다."));

        item.setNotifyOnRestock(notify);
    }

    /**
     * 찜 목록 비우기
     */
    public void clear() {
        this.items.clear();
    }

    /**
     * 상품이 찜 목록에 있는지 확인
     */
    public boolean containsProduct(Long productId) {
        return findItemByProductId(productId).isPresent();
    }

    /**
     * 찜 목록 아이템 개수
     */
    public int getItemCount() {
        return this.items.size();
    }

    /**
     * 재고 알림 설정된 상품 목록
     */
    public List<WishlistItem> getRestockNotificationItems() {
        return this.items.stream()
                .filter(WishlistItem::getNotifyOnRestock)
                .toList();
    }

    private Optional<WishlistItem> findItemByProductId(Long productId) {
        return this.items.stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst();
    }

    private Optional<WishlistItem> findItemById(Long itemId) {
        return this.items.stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst();
    }
}
