package com.ecommerce.shared.exception;

/**
 * 비즈니스 검증 실패 시 발생하는 예외
 */
public class ValidationException extends BusinessException {

    private static final String ERROR_CODE = "VALIDATION_ERROR";

    public ValidationException(String message) {
        super(ERROR_CODE, message);
    }

    public ValidationException(String errorCode, String message) {
        super(errorCode, message);
    }
}
