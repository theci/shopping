package com.ecommerce.customer.infrastructure.oauth2;

import com.ecommerce.customer.infrastructure.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * OAuth2 인증 성공 핸들러
 * 인증 성공 시 JWT 토큰을 생성하고 프론트엔드로 리다이렉트
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;

    @Value("${oauth2.success-redirect-url:http://localhost:3000/oauth/callback}")
    private String redirectUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        String accessToken = jwtTokenProvider.createAccessToken(
            oAuth2User.getCustomerId(),
            oAuth2User.getEmail(),
            oAuth2User.getRole()
        );

        String refreshToken = jwtTokenProvider.createRefreshToken(
            oAuth2User.getCustomerId(),
            oAuth2User.getEmail()
        );

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUrl)
            .queryParam("accessToken", accessToken)
            .queryParam("refreshToken", refreshToken)
            .build()
            .toUriString();

        log.info("OAuth2 로그인 성공 - 사용자: {}, 리다이렉트: {}", oAuth2User.getEmail(), redirectUrl);

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
