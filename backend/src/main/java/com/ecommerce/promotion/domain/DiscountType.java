package com.ecommerce.promotion.domain;

/**
 * 할인 타입 Enum
 */
public enum DiscountType {

    FIXED_AMOUNT("정액 할인"),
    PERCENTAGE("정률 할인");

    private final String description;

    DiscountType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
