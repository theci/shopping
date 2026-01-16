package com.ecommerce.shipping.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 배송 생성 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingCreateRequest {

    @NotNull(message = "주문 ID는 필수입니다.")
    private Long orderId;

    @NotBlank(message = "수령인 이름은 필수입니다.")
    private String recipientName;

    @NotBlank(message = "수령인 연락처는 필수입니다.")
    private String recipientPhone;

    @NotBlank(message = "우편번호는 필수입니다.")
    private String postalCode;

    @NotBlank(message = "주소는 필수입니다.")
    private String address;

    private String addressDetail;

    private String shippingMemo;
}
