package com.ecommerce.promotion.domain;

/**
 * 쿠폰 타입 Enum
 */
public enum CouponType {

    GENERAL("일반 쿠폰"),
    WELCOME("신규가입 쿠폰"),
    BIRTHDAY("생일 쿠폰"),
    EVENT("이벤트 쿠폰"),
    VIP("VIP 전용 쿠폰");

    private final String description;

    CouponType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
