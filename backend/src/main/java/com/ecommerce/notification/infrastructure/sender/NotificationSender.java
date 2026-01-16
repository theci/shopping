package com.ecommerce.notification.infrastructure.sender;

import com.ecommerce.notification.domain.Notification;

/**
 * 알림 발송 인터페이스
 */
public interface NotificationSender {

    /**
     * 알림 발송
     * @param notification 발송할 알림
     * @return 발송 성공 여부
     */
    boolean send(Notification notification);

    /**
     * 해당 채널 지원 여부
     */
    boolean supports(Notification notification);
}
