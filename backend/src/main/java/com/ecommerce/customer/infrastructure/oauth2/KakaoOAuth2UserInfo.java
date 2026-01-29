package com.ecommerce.customer.infrastructure.oauth2;

import com.ecommerce.customer.domain.OAuthProvider;

import java.util.Map;

/**
 * Kakao OAuth2 사용자 정보
 */
public class KakaoOAuth2UserInfo implements OAuth2UserInfo {

    private final Map<String, Object> attributes;

    public KakaoOAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public OAuthProvider getProvider() {
        return OAuthProvider.KAKAO;
    }

    @Override
    public String getProviderId() {
        return String.valueOf(attributes.get("id"));
    }

    @Override
    public String getEmail() {
        Map<String, Object> kakaoAccount = getKakaoAccount();
        if (kakaoAccount == null) {
            return null;
        }
        return (String) kakaoAccount.get("email");
    }

    @Override
    public String getName() {
        Map<String, Object> kakaoAccount = getKakaoAccount();
        if (kakaoAccount == null) {
            return null;
        }
        Map<String, Object> profile = getProfile(kakaoAccount);
        if (profile == null) {
            return null;
        }
        return (String) profile.get("nickname");
    }

    @Override
    public String getProfileImageUrl() {
        Map<String, Object> kakaoAccount = getKakaoAccount();
        if (kakaoAccount == null) {
            return null;
        }
        Map<String, Object> profile = getProfile(kakaoAccount);
        if (profile == null) {
            return null;
        }
        return (String) profile.get("profile_image_url");
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getKakaoAccount() {
        return (Map<String, Object>) attributes.get("kakao_account");
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getProfile(Map<String, Object> kakaoAccount) {
        return (Map<String, Object>) kakaoAccount.get("profile");
    }
}
