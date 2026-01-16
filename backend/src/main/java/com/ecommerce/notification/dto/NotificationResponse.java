package com.ecommerce.notification.dto;

import com.ecommerce.notification.domain.NotificationChannel;
import com.ecommerce.notification.domain.NotificationStatus;
import com.ecommerce.notification.domain.NotificationType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 알림 응답 DTO
 */
@Getter
@Builder
public class NotificationResponse {

    private Long id;
    private Long customerId;
    private NotificationType notificationType;
    private String notificationTypeDescription;
    private NotificationChannel channel;
    private String channelDescription;
    private String title;
    private String content;
    private NotificationStatus status;
    private String statusDescription;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;
    private Long referenceId;
    private String referenceType;
    private boolean read;
    private LocalDateTime createdAt;
}
