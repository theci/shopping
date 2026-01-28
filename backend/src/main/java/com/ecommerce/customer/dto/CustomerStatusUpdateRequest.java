package com.ecommerce.customer.dto;

import com.ecommerce.customer.domain.CustomerStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * 고객 상태 변경 요청 DTO
 */
@Getter
@Setter
public class CustomerStatusUpdateRequest {

    @NotNull(message = "상태는 필수입니다.")
    private CustomerStatus status;

    private String reason;
}
