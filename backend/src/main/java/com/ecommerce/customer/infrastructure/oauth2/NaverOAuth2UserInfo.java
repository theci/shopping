package com.ecommerce.customer.infrastructure.oauth2;

import com.ecommerce.customer.domain.OAuthProvider;

import java.util.Map;

/**
 * Naver OAuth2 사용자 정보
 */
public class NaverOAuth2UserInfo implements OAuth2UserInfo {

    private final Map<String, Object> attributes;

    @SuppressWarnings("unchecked")
    public NaverOAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = (Map<String, Object>) attributes.get("response");
    }

    @Override
    public OAuthProvider getProvider() {
        return OAuthProvider.NAVER;
    }

    @Override
    public String getProviderId() {
        return (String) attributes.get("id");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }

    @Override
    public String getProfileImageUrl() {
        return (String) attributes.get("profile_image");
    }
}
