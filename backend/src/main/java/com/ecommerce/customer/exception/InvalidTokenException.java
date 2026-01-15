package com.ecommerce.customer.exception;

import com.ecommerce.shared.exception.UnauthorizedException;

/**
 * 잘못된 토큰 예외
 */
public class InvalidTokenException extends UnauthorizedException {

    public InvalidTokenException(String message) {
        super(message);
    }

    public InvalidTokenException() {
        super("유효하지 않은 토큰입니다.");
    }
}
