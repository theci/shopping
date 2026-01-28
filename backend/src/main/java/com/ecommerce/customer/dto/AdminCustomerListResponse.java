package com.ecommerce.customer.dto;

import com.ecommerce.customer.domain.CustomerStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Admin 고객 목록 응답 DTO
 */
@Getter
@Builder
public class AdminCustomerListResponse {

    private Long id;
    private String email;
    private String name;
    private String phone;
    private CustomerStatus status;
    private int orderCount;
    private BigDecimal totalSpent;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}
