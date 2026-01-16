package com.ecommerce.payment.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * 결제 초기화 응답 DTO
 */
@Getter
@Builder
public class PaymentInitResponse {

    private Long paymentId;
    private String paymentKey;
    private String clientKey;
    private String checkoutUrl;
    private boolean success;
    private String errorCode;
    private String errorMessage;
}
