package com.ecommerce.customer.infrastructure.oauth2;

import com.ecommerce.customer.domain.OAuthProvider;

import java.util.Map;

/**
 * OAuth2 제공자별 사용자 정보 팩토리
 */
public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        OAuthProvider provider = OAuthProvider.valueOf(registrationId.toUpperCase());

        return switch (provider) {
            case GOOGLE -> new GoogleOAuth2UserInfo(attributes);
            case NAVER -> new NaverOAuth2UserInfo(attributes);
            case KAKAO -> new KakaoOAuth2UserInfo(attributes);
            default -> throw new IllegalArgumentException("지원하지 않는 OAuth2 제공자입니다: " + registrationId);
        };
    }
}
