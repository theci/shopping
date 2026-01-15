package com.ecommerce.customer.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * 토큰 갱신 응답 DTO
 */
@Getter
@Builder
public class TokenRefreshResponse {

    private String accessToken;
    private String tokenType;
    private Long expiresIn;

    public static TokenRefreshResponse of(String accessToken, Long expiresIn) {
        return TokenRefreshResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(expiresIn)
                .build();
    }
}
