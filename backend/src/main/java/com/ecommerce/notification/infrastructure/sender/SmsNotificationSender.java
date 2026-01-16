package com.ecommerce.notification.infrastructure.sender;

import com.ecommerce.notification.domain.Notification;
import com.ecommerce.notification.domain.NotificationChannel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * SMS 알림 발송 구현체 (Mock 구현)
 */
@Slf4j
@Component
public class SmsNotificationSender implements NotificationSender {

    @Override
    public boolean send(Notification notification) {
        try {
            // TODO: 실제 SMS 발송 API 연동 (NHN Cloud, AWS SNS 등)
            log.info("SMS 발송 (Mock) - 수신자: {}, 내용: {}",
                    notification.getRecipient(),
                    truncateContent(notification.getContent()));

            // Mock 구현: 항상 성공으로 처리
            return true;
        } catch (Exception e) {
            log.error("SMS 발송 실패 - 수신자: {}, 에러: {}",
                    notification.getRecipient(),
                    e.getMessage());
            return false;
        }
    }

    @Override
    public boolean supports(Notification notification) {
        return notification.getChannel() == NotificationChannel.SMS;
    }

    private String truncateContent(String content) {
        if (content == null) {
            return "";
        }
        // SMS는 보통 90바이트(한글 45자) 제한
        return content.length() > 45 ? content.substring(0, 45) + "..." : content;
    }
}
