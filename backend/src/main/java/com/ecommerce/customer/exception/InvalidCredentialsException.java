package com.ecommerce.customer.exception;

import com.ecommerce.shared.exception.UnauthorizedException;

/**
 * 잘못된 인증 정보 예외
 */
public class InvalidCredentialsException extends UnauthorizedException {

    public InvalidCredentialsException() {
        super("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
}
