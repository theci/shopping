package com.ecommerce.customer.infrastructure.oauth2;

import com.ecommerce.customer.domain.CustomerRole;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

/**
 * OAuth2 인증된 사용자 정보
 */
@Getter
public class CustomOAuth2User implements OAuth2User {

    private final Long customerId;
    private final String email;
    private final String name;
    private final CustomerRole role;
    private final Map<String, Object> attributes;

    public CustomOAuth2User(Long customerId, String email, String name, CustomerRole role, Map<String, Object> attributes) {
        this.customerId = customerId;
        this.email = email;
        this.name = name;
        this.role = role;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getName() {
        return name;
    }
}
