package com.ecommerce.notification.infrastructure.sender;

import com.ecommerce.notification.domain.Notification;
import com.ecommerce.notification.domain.NotificationChannel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 푸시 알림 발송 구현체 (Mock 구현)
 */
@Slf4j
@Component
public class PushNotificationSender implements NotificationSender {

    @Override
    public boolean send(Notification notification) {
        try {
            // TODO: 실제 푸시 알림 API 연동 (FCM, APNs 등)
            log.info("푸시 알림 발송 (Mock) - 고객ID: {}, 제목: {}, 내용: {}",
                    notification.getCustomerId(),
                    notification.getTitle(),
                    truncateContent(notification.getContent()));

            // Mock 구현: 항상 성공으로 처리
            return true;
        } catch (Exception e) {
            log.error("푸시 알림 발송 실패 - 고객ID: {}, 에러: {}",
                    notification.getCustomerId(),
                    e.getMessage());
            return false;
        }
    }

    @Override
    public boolean supports(Notification notification) {
        return notification.getChannel() == NotificationChannel.PUSH;
    }

    private String truncateContent(String content) {
        if (content == null) {
            return "";
        }
        return content.length() > 100 ? content.substring(0, 100) + "..." : content;
    }
}
