package com.ecommerce.notification.application;

import com.ecommerce.notification.domain.Notification;
import com.ecommerce.notification.dto.NotificationResponse;
import org.springframework.stereotype.Component;

/**
 * Notification 매퍼
 */
@Component
public class NotificationMapper {

    /**
     * Notification -> NotificationResponse 변환
     */
    public NotificationResponse toNotificationResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .customerId(notification.getCustomerId())
                .notificationType(notification.getNotificationType())
                .notificationTypeDescription(notification.getNotificationType().getDescription())
                .channel(notification.getChannel())
                .channelDescription(notification.getChannel().getDescription())
                .title(notification.getTitle())
                .content(notification.getContent())
                .status(notification.getStatus())
                .statusDescription(notification.getStatus().getDescription())
                .sentAt(notification.getSentAt())
                .readAt(notification.getReadAt())
                .referenceId(notification.getReferenceId())
                .referenceType(notification.getReferenceType())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
