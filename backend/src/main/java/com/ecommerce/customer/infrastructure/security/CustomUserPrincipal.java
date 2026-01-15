package com.ecommerce.customer.infrastructure.security;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 인증된 사용자 정보를 담는 Principal
 */
@Getter
@RequiredArgsConstructor
public class CustomUserPrincipal {

    private final Long customerId;
    private final String email;
    private final String role;
}
