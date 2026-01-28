package com.ecommerce.order.dto;

import com.ecommerce.order.domain.OrderStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Admin 주문 검색 요청 DTO
 */
@Getter
@Setter
public class AdminOrderSearchRequest {

    private Integer page = 0;
    private Integer size = 20;
    private String keyword;
    private OrderStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String sortBy = "createdAt";
    private String sortDir = "desc";
}
