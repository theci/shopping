package com.ecommerce.customer.dto;

import com.ecommerce.customer.domain.CustomerStatus;
import lombok.Getter;
import lombok.Setter;

/**
 * Admin 고객 검색 요청 DTO
 */
@Getter
@Setter
public class AdminCustomerSearchRequest {

    private Integer page = 0;
    private Integer size = 20;
    private String keyword;
    private CustomerStatus status;
    private String sortBy = "createdAt";
    private String sortDir = "desc";
}
