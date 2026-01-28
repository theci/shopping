package com.ecommerce.customer.dto;

import com.ecommerce.customer.domain.CustomerStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Admin 고객 상세 응답 DTO
 */
@Getter
@Builder
public class AdminCustomerResponse {

    private Long id;
    private String email;
    private String name;
    private String phone;
    private CustomerStatus status;
    private int orderCount;
    private BigDecimal totalSpent;
    private List<AddressInfo> addresses;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;

    @Getter
    @Builder
    public static class AddressInfo {
        private Long id;
        private String recipientName;
        private String phone;
        private String zipCode;
        private String address;
        private String addressDetail;
        private boolean isDefault;
    }
}
