package com.ecommerce.notification.domain.event;

import com.ecommerce.notification.domain.NotificationChannel;
import com.ecommerce.notification.domain.NotificationType;
import com.ecommerce.shared.domain.BaseDomainEvent;
import lombok.Getter;

/**
 * 알림 발송 이벤트
 */
@Getter
public class NotificationSentEvent extends BaseDomainEvent {

    private final Long notificationId;
    private final Long customerId;
    private final NotificationType notificationType;
    private final NotificationChannel channel;

    public NotificationSentEvent(Long notificationId, Long customerId,
                                  NotificationType notificationType, NotificationChannel channel) {
        super();
        this.notificationId = notificationId;
        this.customerId = customerId;
        this.notificationType = notificationType;
        this.channel = channel;
    }
}
