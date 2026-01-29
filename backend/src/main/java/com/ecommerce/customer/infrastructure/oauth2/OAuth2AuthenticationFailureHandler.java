package com.ecommerce.customer.infrastructure.oauth2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * OAuth2 인증 실패 핸들러
 */
@Slf4j
@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Value("${oauth2.success-redirect-url:http://localhost:3000/oauth/callback}")
    private String redirectUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {
        log.error("OAuth2 인증 실패: {}", exception.getMessage());

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUrl)
            .queryParam("error", URLEncoder.encode(exception.getMessage(), StandardCharsets.UTF_8))
            .build()
            .toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
