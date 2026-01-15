package com.ecommerce.customer.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 회원탈퇴 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawRequest {

    @Size(max = 500, message = "탈퇴 사유는 500자 이하여야 합니다.")
    private String reason;
}
