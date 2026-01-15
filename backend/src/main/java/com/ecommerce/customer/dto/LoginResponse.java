package com.ecommerce.customer.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * 로그인 응답 DTO
 */
@Getter
@Builder
public class LoginResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private CustomerResponse customer;

    public static LoginResponse of(String accessToken, String refreshToken,
                                   Long expiresIn, CustomerResponse customer) {
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(expiresIn)
                .customer(customer)
                .build();
    }
}
