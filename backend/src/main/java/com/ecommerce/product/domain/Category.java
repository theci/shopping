package com.ecommerce.product.domain;

import com.ecommerce.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 카테고리 Entity
 */
@Entity
@Table(name = "categories")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    @Column(name = "display_order")
    private Integer displayOrder;

    private Category(String name, Category parent, Integer displayOrder) {
        this.name = name;
        this.parent = parent;
        this.displayOrder = displayOrder;
    }

    public static Category create(String name, Category parent, Integer displayOrder) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("카테고리명은 필수입니다");
        }
        return new Category(name, parent, displayOrder);
    }

    public void update(String name, Integer displayOrder) {
        if (name != null && !name.isBlank()) {
            this.name = name;
        }
        if (displayOrder != null) {
            this.displayOrder = displayOrder;
        }
    }
}
