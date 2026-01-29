package com.ecommerce.customer.infrastructure.oauth2;

import com.ecommerce.customer.domain.OAuthProvider;

/**
 * OAuth2 사용자 정보 인터페이스
 */
public interface OAuth2UserInfo {
    OAuthProvider getProvider();
    String getProviderId();
    String getEmail();
    String getName();
    String getProfileImageUrl();
}
