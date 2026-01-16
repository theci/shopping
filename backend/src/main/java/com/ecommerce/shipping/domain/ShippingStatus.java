package com.ecommerce.shipping.domain;

/**
 * 배송 상태 Enum
 */
public enum ShippingStatus {

    PENDING("배송 대기"),
    PREPARING("배송 준비중"),
    PICKED_UP("집하 완료"),
    IN_TRANSIT("배송중"),
    OUT_FOR_DELIVERY("배송 출발"),
    DELIVERED("배송 완료"),
    RETURNED("반송");

    private final String description;

    ShippingStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public boolean canUpdateTo(ShippingStatus newStatus) {
        return switch (this) {
            case PENDING -> newStatus == PREPARING;
            case PREPARING -> newStatus == PICKED_UP || newStatus == RETURNED;
            case PICKED_UP -> newStatus == IN_TRANSIT || newStatus == RETURNED;
            case IN_TRANSIT -> newStatus == OUT_FOR_DELIVERY || newStatus == RETURNED;
            case OUT_FOR_DELIVERY -> newStatus == DELIVERED || newStatus == RETURNED;
            case DELIVERED, RETURNED -> false;
        };
    }

    public boolean isDelivered() {
        return this == DELIVERED;
    }

    public boolean isInProgress() {
        return this == PREPARING || this == PICKED_UP || this == IN_TRANSIT || this == OUT_FOR_DELIVERY;
    }
}
