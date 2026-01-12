package com.ecommerce.shared.exception;

/**
 * 권한이 없는 접근 시 발생하는 예외
 */
public class ForbiddenException extends BusinessException {

    private static final String ERROR_CODE = "FORBIDDEN";

    public ForbiddenException(String message) {
        super(ERROR_CODE, message);
    }

    public ForbiddenException() {
        super(ERROR_CODE, "접근 권한이 없습니다");
    }
}
