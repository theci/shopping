package com.ecommerce.customer.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 배송지 응답 DTO
 */
@Getter
@Builder
public class AddressResponse {

    private Long id;
    private String recipientName;
    private String phoneNumber;
    private String postalCode;
    private String address;
    private String addressDetail;
    private boolean isDefault;
    private LocalDateTime createdAt;
}
