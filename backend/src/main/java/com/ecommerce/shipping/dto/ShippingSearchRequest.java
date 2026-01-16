package com.ecommerce.shipping.dto;

import com.ecommerce.shipping.domain.ShippingStatus;
import lombok.Getter;
import lombok.Setter;

/**
 * 배송 검색 요청 DTO
 */
@Getter
@Setter
public class ShippingSearchRequest {

    private ShippingStatus status;
    private int page = 0;
    private int size = 20;
}
