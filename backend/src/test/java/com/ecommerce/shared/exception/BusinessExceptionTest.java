package com.ecommerce.shared.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("BusinessException 테스트")
class BusinessExceptionTest {

    @Test
    @DisplayName("에러 코드와 메시지로 예외를 생성할 수 있다")
    void createExceptionWithCodeAndMessage() {
        // given
        String errorCode = "TEST_ERROR";
        String message = "테스트 에러";

        // when
        BusinessException exception = new BusinessException(errorCode, message);

        // then
        assertThat(exception.getErrorCode()).isEqualTo(errorCode);
        assertThat(exception.getMessage()).isEqualTo(message);
    }

    @Test
    @DisplayName("ResourceNotFoundException을 생성할 수 있다")
    void createResourceNotFoundException() {
        // given
        String resourceType = "Product";
        Long id = 1L;

        // when
        ResourceNotFoundException exception = new ResourceNotFoundException(resourceType, id);

        // then
        assertThat(exception.getErrorCode()).isEqualTo("RESOURCE_NOT_FOUND");
        assertThat(exception.getMessage()).contains(resourceType);
        assertThat(exception.getMessage()).contains(id.toString());
    }

    @Test
    @DisplayName("ValidationException을 생성할 수 있다")
    void createValidationException() {
        // given
        String message = "입력값이 올바르지 않습니다";

        // when
        ValidationException exception = new ValidationException(message);

        // then
        assertThat(exception.getErrorCode()).isEqualTo("VALIDATION_ERROR");
        assertThat(exception.getMessage()).isEqualTo(message);
    }

    @Test
    @DisplayName("UnauthorizedException을 생성할 수 있다")
    void createUnauthorizedException() {
        // when
        UnauthorizedException exception = new UnauthorizedException();

        // then
        assertThat(exception.getErrorCode()).isEqualTo("UNAUTHORIZED");
        assertThat(exception.getMessage()).isNotEmpty();
    }

    @Test
    @DisplayName("ForbiddenException을 생성할 수 있다")
    void createForbiddenException() {
        // when
        ForbiddenException exception = new ForbiddenException();

        // then
        assertThat(exception.getErrorCode()).isEqualTo("FORBIDDEN");
        assertThat(exception.getMessage()).isNotEmpty();
    }
}
