package com.ecommerce.shared.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 에러 응답을 위한 표준 DTO
 */
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private final boolean success = false;
    private final String errorCode;
    private final String message;
    private final Map<String, String> fieldErrors;
    private final LocalDateTime timestamp;

    private ErrorResponse(String errorCode, String message, Map<String, String> fieldErrors) {
        this.errorCode = errorCode;
        this.message = message;
        this.fieldErrors = fieldErrors;
        this.timestamp = LocalDateTime.now();
    }

    /**
     * 단순 에러 응답 생성
     */
    public static ErrorResponse of(String errorCode, String message) {
        return new ErrorResponse(errorCode, message, null);
    }

    /**
     * 필드 검증 에러를 포함한 응답 생성
     */
    public static ErrorResponse withFieldErrors(String errorCode, String message, Map<String, String> fieldErrors) {
        return new ErrorResponse(errorCode, message, fieldErrors);
    }
}
