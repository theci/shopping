package com.ecommerce.product.domain;

public enum ProductStatus {
    DRAFT("임시저장"),
    ACTIVE("판매중"),
    INACTIVE("판매중지"),
    OUT_OF_STOCK("품절"),
    DISCONTINUED("단종");

    private final String description;

    ProductStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public boolean isAvailableForSale() {
        return this == ACTIVE;
    }
}
