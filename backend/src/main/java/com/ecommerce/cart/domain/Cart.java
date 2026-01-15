package com.ecommerce.cart.domain;

import com.ecommerce.cart.domain.event.CartClearedEvent;
import com.ecommerce.cart.domain.event.CartItemAddedEvent;
import com.ecommerce.cart.domain.event.CartItemQuantityChangedEvent;
import com.ecommerce.cart.domain.event.CartItemRemovedEvent;
import com.ecommerce.shared.domain.AggregateRoot;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 장바구니 Aggregate Root
 */
@Entity
@Table(name = "carts",
    indexes = @Index(name = "idx_cart_customer", columnList = "customerId", unique = true))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cart extends AggregateRoot {

    @Column(nullable = false, unique = true)
    private Long customerId;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    @Builder
    public Cart(Long customerId) {
        this.customerId = customerId;
    }

    // 도메인 메서드

    /**
     * 장바구니에 상품 추가
     * 동일 상품이 있으면 수량만 증가
     */
    public CartItem addItem(Long productId, String productName, String productImageUrl,
                            int quantity, BigDecimal price) {
        if (quantity < 1) {
            throw new IllegalArgumentException("수량은 1 이상이어야 합니다.");
        }

        // 동일 상품이 이미 있는지 확인
        Optional<CartItem> existingItem = findItemByProductId(productId);

        if (existingItem.isPresent()) {
            // 기존 아이템의 수량 증가
            CartItem item = existingItem.get();
            item.increaseQuantity(quantity);
            item.updatePrice(price); // 최신 가격으로 업데이트

            addDomainEvent(new CartItemQuantityChangedEvent(
                this.getId(), this.customerId, productId, item.getQuantity()));

            return item;
        } else {
            // 새 아이템 추가
            CartItem newItem = CartItem.builder()
                    .cart(this)
                    .productId(productId)
                    .productName(productName)
                    .productImageUrl(productImageUrl)
                    .quantity(quantity)
                    .price(price)
                    .build();

            this.items.add(newItem);

            addDomainEvent(new CartItemAddedEvent(
                this.getId(), this.customerId, productId, productName, quantity));

            return newItem;
        }
    }

    /**
     * 아이템 수량 변경
     */
    public CartItem updateItemQuantity(Long productId, int quantity) {
        CartItem item = findItemByProductId(productId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니에 해당 상품이 없습니다."));

        item.changeQuantity(quantity);

        addDomainEvent(new CartItemQuantityChangedEvent(
            this.getId(), this.customerId, productId, quantity));

        return item;
    }

    /**
     * 아이템 삭제
     */
    public void removeItem(Long productId) {
        CartItem item = findItemByProductId(productId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니에 해당 상품이 없습니다."));

        this.items.remove(item);

        addDomainEvent(new CartItemRemovedEvent(
            this.getId(), this.customerId, productId));
    }

    /**
     * 아이템 ID로 삭제
     */
    public void removeItemById(Long itemId) {
        CartItem item = this.items.stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("장바구니에 해당 아이템이 없습니다."));

        Long productId = item.getProductId();
        this.items.remove(item);

        addDomainEvent(new CartItemRemovedEvent(
            this.getId(), this.customerId, productId));
    }

    /**
     * 장바구니 비우기
     */
    public void clear() {
        if (!this.items.isEmpty()) {
            this.items.clear();
            addDomainEvent(new CartClearedEvent(this.getId(), this.customerId));
        }
    }

    /**
     * 총액 계산
     */
    public BigDecimal getTotalAmount() {
        return items.stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * 총 수량 계산
     */
    public int getTotalQuantity() {
        return items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }

    /**
     * 아이템 개수
     */
    public int getItemCount() {
        return items.size();
    }

    /**
     * 장바구니가 비어있는지 확인
     */
    public boolean isEmpty() {
        return items.isEmpty();
    }

    /**
     * 상품 ID로 아이템 찾기
     */
    public Optional<CartItem> findItemByProductId(Long productId) {
        return items.stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst();
    }

    /**
     * 특정 상품이 장바구니에 있는지 확인
     */
    public boolean containsProduct(Long productId) {
        return findItemByProductId(productId).isPresent();
    }
}
