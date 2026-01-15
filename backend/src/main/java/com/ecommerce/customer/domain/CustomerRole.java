package com.ecommerce.customer.domain;

/**
 * 고객 권한
 */
public enum CustomerRole {
    CUSTOMER("일반 고객"),
    SELLER("판매자"),
    ADMIN("관리자");

    private final String description;

    CustomerRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
