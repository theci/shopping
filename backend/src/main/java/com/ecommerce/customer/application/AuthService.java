package com.ecommerce.customer.application;

import com.ecommerce.customer.domain.Customer;
import com.ecommerce.customer.domain.CustomerRepository;
import com.ecommerce.customer.domain.CustomerStatus;
import com.ecommerce.customer.dto.*;
import com.ecommerce.customer.exception.CustomerBlockedException;
import com.ecommerce.customer.exception.CustomerNotFoundException;
import com.ecommerce.customer.exception.InvalidCredentialsException;
import com.ecommerce.customer.exception.InvalidTokenException;
import com.ecommerce.customer.infrastructure.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 인증 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${jwt.access-token-validity:3600000}")
    private long accessTokenValidityInMilliseconds;

    /**
     * 로그인
     */
    @Transactional
    public LoginResponse login(LoginRequest request) {
        Customer customer = customerRepository.findByEmail(request.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new InvalidCredentialsException();
        }

        // 계정 상태 확인
        if (customer.getStatus() == CustomerStatus.WITHDRAWN) {
            throw new InvalidCredentialsException();
        }

        if (customer.getStatus() == CustomerStatus.BLOCKED) {
            throw new CustomerBlockedException();
        }

        if (!customer.canLogin()) {
            throw new CustomerBlockedException();
        }

        // 마지막 로그인 시간 업데이트
        customer.updateLastLoginAt();

        // 토큰 생성
        String accessToken = jwtTokenProvider.createAccessToken(
                customer.getId(),
                customer.getEmail(),
                customer.getRole()
        );
        String refreshToken = jwtTokenProvider.createRefreshToken(
                customer.getId(),
                customer.getEmail()
        );

        log.info("로그인 성공: {}", customer.getEmail());

        return LoginResponse.of(
                accessToken,
                refreshToken,
                accessTokenValidityInMilliseconds / 1000,
                customerMapper.toResponse(customer)
        );
    }

    /**
     * 토큰 갱신
     */
    @Transactional
    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        String refreshToken = request.getRefreshToken();

        // Refresh Token 검증
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new InvalidTokenException("유효하지 않은 Refresh Token입니다.");
        }

        if (!jwtTokenProvider.isRefreshToken(refreshToken)) {
            throw new InvalidTokenException("Refresh Token이 아닙니다.");
        }

        // 고객 조회
        Long customerId = jwtTokenProvider.getCustomerId(refreshToken);
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException(customerId));

        // 계정 상태 확인
        if (!customer.canLogin()) {
            throw new CustomerBlockedException();
        }

        // 새로운 Access Token 발급
        String newAccessToken = jwtTokenProvider.createAccessToken(
                customer.getId(),
                customer.getEmail(),
                customer.getRole()
        );

        log.info("토큰 갱신 완료: {}", customer.getEmail());

        return TokenRefreshResponse.of(
                newAccessToken,
                accessTokenValidityInMilliseconds / 1000
        );
    }
}
