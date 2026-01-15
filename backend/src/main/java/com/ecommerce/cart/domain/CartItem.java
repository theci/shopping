package com.ecommerce.cart.domain;

import com.ecommerce.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 장바구니 아이템 Entity
 */
@Entity
@Table(name = "cart_items",
    uniqueConstraints = @UniqueConstraint(columnNames = {"cart_id", "product_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CartItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String productName;

    private String productImageUrl;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Builder
    public CartItem(Cart cart, Long productId, String productName,
                    String productImageUrl, int quantity, BigDecimal price) {
        this.cart = cart;
        this.productId = productId;
        this.productName = productName;
        this.productImageUrl = productImageUrl;
        this.quantity = quantity;
        this.price = price;
    }

    // 도메인 메서드

    void setCart(Cart cart) {
        this.cart = cart;
    }

    /**
     * 수량 변경
     */
    public void changeQuantity(int quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("수량은 1 이상이어야 합니다.");
        }
        this.quantity = quantity;
    }

    /**
     * 수량 증가
     */
    public void increaseQuantity(int amount) {
        if (amount < 1) {
            throw new IllegalArgumentException("증가 수량은 1 이상이어야 합니다.");
        }
        this.quantity += amount;
    }

    /**
     * 가격 업데이트 (상품 가격 변동 시)
     */
    public void updatePrice(BigDecimal newPrice) {
        this.price = newPrice;
    }

    /**
     * 소계 계산
     */
    public BigDecimal getSubtotal() {
        return price.multiply(BigDecimal.valueOf(quantity));
    }
}
