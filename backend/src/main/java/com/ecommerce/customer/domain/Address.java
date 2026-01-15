package com.ecommerce.customer.domain;

import com.ecommerce.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 배송지 주소 Entity
 */
@Entity
@Table(name = "addresses")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Address extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(length = 100)
    private String recipientName;

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 10, nullable = false)
    private String postalCode;

    @Column(nullable = false)
    private String address;

    private String addressDetail;

    @Column(nullable = false)
    private boolean isDefault = false;

    @Builder
    public Address(Customer customer, String recipientName, String phoneNumber,
                   String postalCode, String address, String addressDetail, boolean isDefault) {
        this.customer = customer;
        this.recipientName = recipientName;
        this.phoneNumber = phoneNumber;
        this.postalCode = postalCode;
        this.address = address;
        this.addressDetail = addressDetail;
        this.isDefault = isDefault;
    }

    // 도메인 메서드

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void setDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }

    public void update(String recipientName, String phoneNumber,
                       String postalCode, String address, String addressDetail) {
        if (recipientName != null) {
            this.recipientName = recipientName;
        }
        if (phoneNumber != null) {
            this.phoneNumber = phoneNumber;
        }
        if (postalCode != null) {
            this.postalCode = postalCode;
        }
        if (address != null) {
            this.address = address;
        }
        if (addressDetail != null) {
            this.addressDetail = addressDetail;
        }
    }
}
