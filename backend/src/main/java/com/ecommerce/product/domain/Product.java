package com.ecommerce.product.domain;

import com.ecommerce.shared.domain.AggregateRoot;
import com.ecommerce.product.domain.event.ProductCreatedEvent;
import com.ecommerce.product.domain.event.ProductPublishedEvent;
import com.ecommerce.product.domain.event.ProductStockChangedEvent;
import com.ecommerce.product.exception.InsufficientStockException;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * 상품 Aggregate Root
 */
@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_category", columnList = "category_id"),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_name", columnList = "name")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product extends AggregateRoot {

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stockQuantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ProductStatus status;

    private String brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductOption> options = new ArrayList<>();

    // Constructor
    private Product(String name, String description, BigDecimal price,
                   Integer stockQuantity, String brand, Category category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.status = ProductStatus.DRAFT;
        this.brand = brand;
        this.category = category;
    }

    /**
     * 상품 생성
     */
    public static Product create(String name, String description, BigDecimal price,
                                 Integer stockQuantity, String brand, Category category) {
        validateCreate(name, price, stockQuantity);

        Product product = new Product(name, description, price, stockQuantity, brand, category);
        // Note: 이벤트는 저장 후 서비스 계층에서 발행
        return product;
    }

    /**
     * 상품 발행 (고객에게 노출)
     */
    public void publish() {
        if (this.status == ProductStatus.ACTIVE) {
            throw new IllegalStateException("이미 발행된 상품입니다");
        }

        this.status = ProductStatus.ACTIVE;
        if (this.getId() != null) {
            addDomainEvent(new ProductPublishedEvent(this.getId()));
        }
    }

    /**
     * 상품 비활성화
     */
    public void deactivate() {
        this.status = ProductStatus.INACTIVE;
    }

    /**
     * 재고 감소
     */
    public void decreaseStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("감소할 재고 수량은 0보다 커야 합니다");
        }

        if (this.stockQuantity < quantity) {
            throw new InsufficientStockException(
                this.getId() != null ? this.getId() : 0L,
                this.stockQuantity,
                quantity
            );
        }

        this.stockQuantity -= quantity;

        if (this.stockQuantity == 0) {
            this.status = ProductStatus.OUT_OF_STOCK;
        }

        if (this.getId() != null) {
            addDomainEvent(new ProductStockChangedEvent(this.getId(), this.stockQuantity));
        }
    }

    /**
     * 재고 증가
     */
    public void increaseStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("증가할 재고 수량은 0보다 커야 합니다");
        }

        this.stockQuantity += quantity;

        if (this.status == ProductStatus.OUT_OF_STOCK) {
            this.status = ProductStatus.ACTIVE;
        }

        if (this.getId() != null) {
            addDomainEvent(new ProductStockChangedEvent(this.getId(), this.stockQuantity));
        }
    }

    /**
     * 가격 변경
     */
    public void updatePrice(BigDecimal newPrice) {
        if (newPrice == null || newPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("가격은 0보다 커야 합니다");
        }
        this.price = newPrice;
    }

    /**
     * 상품 정보 수정
     */
    public void update(String name, String description, BigDecimal price, String brand, Category category) {
        if (name != null && !name.isBlank()) {
            this.name = name;
        }
        if (description != null) {
            this.description = description;
        }
        if (price != null && price.compareTo(BigDecimal.ZERO) > 0) {
            this.price = price;
        }
        if (brand != null) {
            this.brand = brand;
        }
        if (category != null) {
            this.category = category;
        }
    }

    /**
     * 이미지 추가
     */
    public void addImage(String imageUrl, int displayOrder) {
        ProductImage image = ProductImage.create(this, imageUrl, displayOrder);
        this.images.add(image);
    }

    /**
     * 옵션 추가
     */
    public void addOption(String optionName, String optionValue, BigDecimal additionalPrice) {
        ProductOption option = ProductOption.create(this, optionName, optionValue, additionalPrice);
        this.options.add(option);
    }

    /**
     * 재고 확인
     */
    public boolean hasStock(int quantity) {
        return this.stockQuantity >= quantity;
    }

    /**
     * 판매 가능 여부
     */
    public boolean isAvailable() {
        return this.status == ProductStatus.ACTIVE && this.stockQuantity > 0;
    }

    // Validation
    private static void validateCreate(String name, BigDecimal price, Integer stockQuantity) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("상품명은 필수입니다");
        }
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("가격은 0보다 커야 합니다");
        }
        if (stockQuantity == null || stockQuantity < 0) {
            throw new IllegalArgumentException("재고 수량은 0 이상이어야 합니다");
        }
    }
}
