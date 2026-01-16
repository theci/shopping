package com.ecommerce.notification.dto;

import com.ecommerce.notification.domain.NotificationChannel;
import com.ecommerce.notification.domain.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 알림 생성 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationCreateRequest {

    @NotNull(message = "고객 ID는 필수입니다.")
    private Long customerId;

    @NotNull(message = "알림 타입은 필수입니다.")
    private NotificationType notificationType;

    @NotNull(message = "알림 채널은 필수입니다.")
    private NotificationChannel channel;

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    private String content;

    private String recipient;

    private Long referenceId;

    private String referenceType;
}
