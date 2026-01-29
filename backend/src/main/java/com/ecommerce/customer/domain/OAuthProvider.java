package com.ecommerce.customer.domain;

/**
 * OAuth2 인증 제공자
 */
public enum OAuthProvider {
    LOCAL,   // 일반 이메일/비밀번호 로그인
    GOOGLE,
    NAVER,
    KAKAO
}
