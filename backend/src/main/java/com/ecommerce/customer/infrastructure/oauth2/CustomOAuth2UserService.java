package com.ecommerce.customer.infrastructure.oauth2;

import com.ecommerce.customer.domain.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * OAuth2 사용자 서비스
 * OAuth2 로그인 성공 시 사용자 정보를 처리하고 회원 가입/로그인 처리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final CustomerRepository customerRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());

        String email = userInfo.getEmail();
        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException(
                new OAuth2Error("email_not_found"),
                "OAuth2 제공자로부터 이메일을 가져올 수 없습니다."
            );
        }

        Customer customer = customerRepository.findByEmail(email)
            .map(existingCustomer -> updateExistingCustomer(existingCustomer, userInfo))
            .orElseGet(() -> createNewCustomer(userInfo));

        if (!customer.canLogin()) {
            throw new OAuth2AuthenticationException(
                new OAuth2Error("account_disabled"),
                "계정이 비활성화되었습니다. 관리자에게 문의하세요."
            );
        }

        customer.updateLastLoginAt();

        return new CustomOAuth2User(
            customer.getId(),
            customer.getEmail(),
            customer.getName(),
            customer.getRole(),
            oAuth2User.getAttributes()
        );
    }

    private Customer updateExistingCustomer(Customer customer, OAuth2UserInfo userInfo) {
        // 기존 회원의 경우 OAuth 제공자 정보만 업데이트 (이름 등은 유지)
        if (customer.getOauthProvider() == OAuthProvider.LOCAL) {
            customer.linkOAuthProvider(userInfo.getProvider(), userInfo.getProviderId());
        }
        return customer;
    }

    private Customer createNewCustomer(OAuth2UserInfo userInfo) {
        Customer customer = Customer.builder()
            .email(userInfo.getEmail())
            .password(UUID.randomUUID().toString()) // OAuth 사용자는 비밀번호 불필요
            .name(userInfo.getName() != null ? userInfo.getName() : "사용자")
            .oauthProvider(userInfo.getProvider())
            .oauthProviderId(userInfo.getProviderId())
            .role(CustomerRole.CUSTOMER)
            .build();

        return customerRepository.save(customer);
    }
}
