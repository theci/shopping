package com.ecommerce.shipping.dto;

import com.ecommerce.shipping.domain.ShippingStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 배송 응답 DTO
 */
@Getter
@Builder
public class ShippingResponse {

    private Long id;
    private Long orderId;
    private String trackingNumber;
    private String shippingCompany;
    private ShippingStatus shippingStatus;
    private String shippingStatusDescription;

    // 배송 주소
    private String recipientName;
    private String recipientPhone;
    private String postalCode;
    private String address;
    private String addressDetail;
    private String fullAddress;

    private String shippingMemo;
    private LocalDateTime startedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime estimatedDeliveryDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
