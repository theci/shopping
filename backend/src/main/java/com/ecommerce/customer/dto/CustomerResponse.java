package com.ecommerce.customer.dto;

import com.ecommerce.customer.domain.CustomerLevel;
import com.ecommerce.customer.domain.CustomerRole;
import com.ecommerce.customer.domain.CustomerStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 고객 응답 DTO
 */
@Getter
@Builder
public class CustomerResponse {

    private Long id;
    private String email;
    private String name;
    private String phoneNumber;
    private CustomerStatus status;
    private CustomerLevel customerLevel;
    private CustomerRole role;
    private BigDecimal totalPurchaseAmount;
    private List<AddressResponse> addresses;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
