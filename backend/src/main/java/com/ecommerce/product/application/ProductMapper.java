package com.ecommerce.product.application;

import com.ecommerce.product.domain.*;
import com.ecommerce.product.dto.CategoryResponse;
import com.ecommerce.product.dto.ProductResponse;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * Product DTO <-> Entity 변환 매퍼
 */
@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .status(product.getStatus())
                .brand(product.getBrand())
                .category(toNestedCategoryResponse(product.getCategory()))
                .images(product.getImages().stream()
                        .map(this::toImageResponse)
                        .collect(Collectors.toList()))
                .options(product.getOptions().stream()
                        .map(this::toOptionResponse)
                        .collect(Collectors.toList()))
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public CategoryResponse toCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .displayOrder(category.getDisplayOrder())
                .createdAt(category.getCreatedAt())
                .build();
    }

    private ProductResponse.CategoryResponse toNestedCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }

        return ProductResponse.CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }

    private ProductResponse.ProductImageResponse toImageResponse(ProductImage image) {
        return ProductResponse.ProductImageResponse.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .displayOrder(image.getDisplayOrder())
                .build();
    }

    private ProductResponse.ProductOptionResponse toOptionResponse(ProductOption option) {
        return ProductResponse.ProductOptionResponse.builder()
                .id(option.getId())
                .optionName(option.getOptionName())
                .optionValue(option.getOptionValue())
                .additionalPrice(option.getAdditionalPrice())
                .build();
    }
}
