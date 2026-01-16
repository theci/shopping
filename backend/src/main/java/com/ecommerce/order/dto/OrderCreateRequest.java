package com.ecommerce.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 주문 생성 요청 DTO
 * 장바구니에서 주문 생성 시 사용
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateRequest {

    // 배송 정보
    @NotBlank(message = "수령인 이름은 필수입니다.")
    @Size(max = 100, message = "수령인 이름은 100자 이하여야 합니다.")
    private String recipientName;

    @NotBlank(message = "수령인 연락처는 필수입니다.")
    @Size(max = 20, message = "연락처는 20자 이하여야 합니다.")
    private String recipientPhone;

    @NotBlank(message = "우편번호는 필수입니다.")
    @Size(max = 10, message = "우편번호는 10자 이하여야 합니다.")
    private String shippingPostalCode;

    @NotBlank(message = "배송 주소는 필수입니다.")
    private String shippingAddress;

    private String shippingAddressDetail;

    @Size(max = 500, message = "배송 메모는 500자 이하여야 합니다.")
    private String shippingMemo;
}
