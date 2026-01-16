package com.ecommerce.order.dto;

import com.ecommerce.order.domain.OrderStatus;
import lombok.Getter;
import lombok.Setter;

/**
 * 주문 검색 요청 DTO
 */
@Getter
@Setter
public class OrderSearchRequest {

    private OrderStatus status;
    private int page = 0;
    private int size = 10;
}
