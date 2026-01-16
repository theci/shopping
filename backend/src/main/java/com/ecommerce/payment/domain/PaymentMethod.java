package com.ecommerce.payment.domain;

/**
 * 결제 수단 Enum
 */
public enum PaymentMethod {

    CARD("신용/체크카드"),
    BANK_TRANSFER("계좌이체"),
    VIRTUAL_ACCOUNT("가상계좌"),
    KAKAO_PAY("카카오페이"),
    NAVER_PAY("네이버페이"),
    TOSS_PAY("토스페이"),
    PAYCO("페이코"),
    SAMSUNG_PAY("삼성페이"),
    APPLE_PAY("애플페이");

    private final String description;

    PaymentMethod(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public boolean isSimplePay() {
        return this == KAKAO_PAY || this == NAVER_PAY || this == TOSS_PAY ||
               this == PAYCO || this == SAMSUNG_PAY || this == APPLE_PAY;
    }
}
