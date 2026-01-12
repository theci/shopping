package com.ecommerce.shared.exception;

/**
 * 인증되지 않은 접근 시 발생하는 예외
 */
public class UnauthorizedException extends BusinessException {

    private static final String ERROR_CODE = "UNAUTHORIZED";

    public UnauthorizedException(String message) {
        super(ERROR_CODE, message);
    }

    public UnauthorizedException() {
        super(ERROR_CODE, "인증되지 않은 접근입니다");
    }
}
