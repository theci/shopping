package com.ecommerce.shipping.dto;

import com.ecommerce.shipping.domain.ShippingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 배송 상태 업데이트 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ShippingStatusUpdateRequest {

    @NotNull(message = "배송 상태는 필수입니다.")
    private ShippingStatus status;

    private String trackingNumber;

    private String shippingCompany;
}
