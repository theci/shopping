package com.ecommerce.customer.domain;

/**
 * 고객 상태
 */
public enum CustomerStatus {
    ACTIVE("활성"),
    INACTIVE("비활성"),
    BLOCKED("차단"),
    WITHDRAWN("탈퇴");

    private final String description;

    CustomerStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
