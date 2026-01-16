package com.ecommerce.notification.infrastructure.sender;

import com.ecommerce.notification.domain.Notification;
import com.ecommerce.notification.domain.NotificationChannel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 카카오톡 알림 발송 구현체 (Mock 구현)
 */
@Slf4j
@Component
public class KakaoNotificationSender implements NotificationSender {

    @Override
    public boolean send(Notification notification) {
        try {
            // TODO: 실제 카카오 알림톡 API 연동
            log.info("카카오 알림톡 발송 (Mock) - 수신자: {}, 제목: {}",
                    notification.getRecipient(),
                    notification.getTitle());

            // Mock 구현: 항상 성공으로 처리
            return true;
        } catch (Exception e) {
            log.error("카카오 알림톡 발송 실패 - 수신자: {}, 에러: {}",
                    notification.getRecipient(),
                    e.getMessage());
            return false;
        }
    }

    @Override
    public boolean supports(Notification notification) {
        return notification.getChannel() == NotificationChannel.KAKAO;
    }
}
