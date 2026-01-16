package com.ecommerce.notification.infrastructure.sender;

import com.ecommerce.notification.domain.Notification;
import com.ecommerce.notification.domain.NotificationChannel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 인앱 알림 발송 구현체
 * 인앱 알림은 DB에 저장되면 발송 완료로 처리
 */
@Slf4j
@Component
public class InAppNotificationSender implements NotificationSender {

    @Override
    public boolean send(Notification notification) {
        // 인앱 알림은 DB에 저장되면 발송 완료
        log.info("인앱 알림 발송 - 고객ID: {}, 제목: {}",
                notification.getCustomerId(),
                notification.getTitle());

        return true;
    }

    @Override
    public boolean supports(Notification notification) {
        return notification.getChannel() == NotificationChannel.IN_APP;
    }
}
