package com.ecommerce.shared.config;

import com.ecommerce.customer.infrastructure.oauth2.CustomOAuth2UserService;
import com.ecommerce.customer.infrastructure.oauth2.OAuth2AuthenticationFailureHandler;
import com.ecommerce.customer.infrastructure.oauth2.OAuth2AuthenticationSuccessHandler;
import com.ecommerce.customer.infrastructure.security.JwtAuthenticationFilter;
import com.ecommerce.customer.infrastructure.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Spring Security 설정
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            // OAuth2는 세션이 필요하므로 IF_REQUIRED로 변경
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .authorizeHttpRequests(auth -> auth
                // 인증 없이 접근 가능한 엔드포인트
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/h2-console/**", "/h2-console/**").permitAll()
                .requestMatchers("/api/actuator/**", "/actuator/**").permitAll()
                .requestMatchers("/api/swagger-ui/**", "/swagger-ui/**", "/api/v3/api-docs/**", "/v3/api-docs/**").permitAll()

                // 상품 조회는 인증 없이 가능
                .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()

                // Admin API - 주문 관리 (임시로 permitAll, 실제 운영 시 ADMIN 권한 체크 필요)
                .requestMatchers(HttpMethod.GET, "/api/v1/orders").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/orders/{orderId}").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/api/v1/orders/*/status").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/api/v1/orders/*/shipping").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/api/v1/orders/*/memo").permitAll()

                // Admin API - 고객 관리 (임시로 permitAll, 실제 운영 시 ADMIN 권한 체크 필요)
                .requestMatchers(HttpMethod.GET, "/api/v1/customers").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/customers/{customerId}").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/customers/*/orders").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/api/v1/customers/*/status").permitAll()

                // OAuth2 로그인 엔드포인트
                .requestMatchers("/oauth2/**", "/login/**").permitAll()

                // 그 외 요청은 인증 필요
                .anyRequest().authenticated()
            )
            // OAuth2 로그인 설정
            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(authorization -> authorization
                    .baseUri("/oauth2/authorization")
                )
                .redirectionEndpoint(redirection -> redirection
                    .baseUri("/login/oauth2/code/*")
                )
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService)
                )
                .successHandler(oAuth2AuthenticationSuccessHandler)
                .failureHandler(oAuth2AuthenticationFailureHandler)
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            // H2 콘솔을 위한 설정
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 허용할 Origin 설정
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:3001",
            "http://3.39.36.234:3000",
            "http://3.39.36.234:3001"
        ));
        
        // 허용할 HTTP 메서드 설정
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));
        
        // 허용할 헤더 설정
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // 자격 증명(쿠키 등) 허용
        configuration.setAllowCredentials(true);
        
        // Preflight 요청의 캐시 시간 (초)
        configuration.setMaxAge(3600L);
        
        // 노출할 헤더 설정
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type"
        ));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
