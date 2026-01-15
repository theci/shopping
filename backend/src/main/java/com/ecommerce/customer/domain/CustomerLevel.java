package com.ecommerce.customer.domain;

import java.math.BigDecimal;

/**
 * 고객 등급
 */
public enum CustomerLevel {
    BRONZE("브론즈", BigDecimal.ZERO, new BigDecimal("100000")),
    SILVER("실버", new BigDecimal("100000"), new BigDecimal("500000")),
    GOLD("골드", new BigDecimal("500000"), new BigDecimal("1000000")),
    PLATINUM("플래티넘", new BigDecimal("1000000"), null);

    private final String description;
    private final BigDecimal minPurchaseAmount;
    private final BigDecimal maxPurchaseAmount;

    CustomerLevel(String description, BigDecimal minPurchaseAmount, BigDecimal maxPurchaseAmount) {
        this.description = description;
        this.minPurchaseAmount = minPurchaseAmount;
        this.maxPurchaseAmount = maxPurchaseAmount;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getMinPurchaseAmount() {
        return minPurchaseAmount;
    }

    public BigDecimal getMaxPurchaseAmount() {
        return maxPurchaseAmount;
    }

    public static CustomerLevel fromPurchaseAmount(BigDecimal totalPurchaseAmount) {
        if (totalPurchaseAmount.compareTo(PLATINUM.minPurchaseAmount) >= 0) {
            return PLATINUM;
        } else if (totalPurchaseAmount.compareTo(GOLD.minPurchaseAmount) >= 0) {
            return GOLD;
        } else if (totalPurchaseAmount.compareTo(SILVER.minPurchaseAmount) >= 0) {
            return SILVER;
        }
        return BRONZE;
    }
}
