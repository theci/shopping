package com.ecommerce.shared.dto;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("ApiResponse 테스트")
class ApiResponseTest {

    @Test
    @DisplayName("성공 응답을 생성할 수 있다")
    void createSuccessResponse() {
        // given
        String data = "test data";

        // when
        ApiResponse<String> response = ApiResponse.success(data);

        // then
        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getData()).isEqualTo(data);
        assertThat(response.getMessage()).isNull();
        assertThat(response.getErrorCode()).isNull();
        assertThat(response.getTimestamp()).isNotNull();
    }

    @Test
    @DisplayName("메시지를 포함한 성공 응답을 생성할 수 있다")
    void createSuccessResponseWithMessage() {
        // given
        String data = "test data";
        String message = "작업이 완료되었습니다";

        // when
        ApiResponse<String> response = ApiResponse.success(data, message);

        // then
        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getData()).isEqualTo(data);
        assertThat(response.getMessage()).isEqualTo(message);
    }

    @Test
    @DisplayName("에러 응답을 생성할 수 있다")
    void createErrorResponse() {
        // given
        String message = "에러가 발생했습니다";
        String errorCode = "ERROR_001";

        // when
        ApiResponse<Void> response = ApiResponse.error(message, errorCode);

        // then
        assertThat(response.isSuccess()).isFalse();
        assertThat(response.getData()).isNull();
        assertThat(response.getMessage()).isEqualTo(message);
        assertThat(response.getErrorCode()).isEqualTo(errorCode);
    }

    @Test
    @DisplayName("데이터 없이 메시지만으로 성공 응답을 생성할 수 있다")
    void createSuccessResponseWithMessageOnly() {
        // given
        String message = "작업이 완료되었습니다";

        // when
        ApiResponse<Void> response = ApiResponse.success(message);

        // then
        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getData()).isNull();
        assertThat(response.getMessage()).isEqualTo(message);
    }
}
