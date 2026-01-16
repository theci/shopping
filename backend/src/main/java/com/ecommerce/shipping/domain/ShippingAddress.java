package com.ecommerce.shipping.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 배송 주소 Value Object
 */
@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ShippingAddress {

    @Column(name = "recipient_name", length = 100)
    private String recipientName;

    @Column(name = "recipient_phone", length = 20)
    private String recipientPhone;

    @Column(name = "postal_code", length = 10)
    private String postalCode;

    @Column(name = "address")
    private String address;

    @Column(name = "address_detail")
    private String addressDetail;

    @Builder
    public ShippingAddress(String recipientName, String recipientPhone,
                           String postalCode, String address, String addressDetail) {
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.postalCode = postalCode;
        this.address = address;
        this.addressDetail = addressDetail;
    }

    public String getFullAddress() {
        if (addressDetail != null && !addressDetail.isBlank()) {
            return address + " " + addressDetail;
        }
        return address;
    }
}
