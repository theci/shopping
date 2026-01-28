package com.ecommerce.order.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * 배송 정보 업데이트 요청 DTO
 */
@Getter
@Setter
public class ShippingUpdateRequest {

    @NotBlank(message = "운송장 번호는 필수입니다.")
    private String trackingNumber;

    @NotBlank(message = "택배사는 필수입니다.")
    private String trackingCompany;
}
