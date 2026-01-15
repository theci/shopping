package com.ecommerce.customer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 배송지 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequest {

    @Size(max = 100, message = "수령인 이름은 100자 이하여야 합니다.")
    private String recipientName;

    @Size(max = 20, message = "전화번호는 20자 이하여야 합니다.")
    private String phoneNumber;

    @NotBlank(message = "우편번호는 필수입니다.")
    @Size(max = 10, message = "우편번호는 10자 이하여야 합니다.")
    private String postalCode;

    @NotBlank(message = "주소는 필수입니다.")
    private String address;

    private String addressDetail;

    private boolean isDefault;
}
