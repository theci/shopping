package com.ecommerce.product.domain;

import com.ecommerce.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 상품 옵션 Entity (색상, 사이즈 등)
 */
@Entity
@Table(name = "product_options")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductOption extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, length = 50)
    private String optionName;

    @Column(nullable = false, length = 100)
    private String optionValue;

    @Column(precision = 10, scale = 2)
    private BigDecimal additionalPrice;

    private ProductOption(Product product, String optionName, String optionValue, BigDecimal additionalPrice) {
        this.product = product;
        this.optionName = optionName;
        this.optionValue = optionValue;
        this.additionalPrice = additionalPrice != null ? additionalPrice : BigDecimal.ZERO;
    }

    public static ProductOption create(Product product, String optionName, String optionValue, BigDecimal additionalPrice) {
        if (optionName == null || optionName.isBlank()) {
            throw new IllegalArgumentException("옵션명은 필수입니다");
        }
        if (optionValue == null || optionValue.isBlank()) {
            throw new IllegalArgumentException("옵션값은 필수입니다");
        }
        return new ProductOption(product, optionName, optionValue, additionalPrice);
    }
}
