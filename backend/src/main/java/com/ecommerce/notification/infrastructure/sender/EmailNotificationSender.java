package com.ecommerce.notification.infrastructure.sender;

import com.ecommerce.notification.domain.Notification;
import com.ecommerce.notification.domain.NotificationChannel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 이메일 알림 발송 구현체 (Mock 구현)
 * 실제 이메일 발송을 위해서는 spring-boot-starter-mail 의존성 추가 필요
 */
@Slf4j
@Component
public class EmailNotificationSender implements NotificationSender {

    @Override
    public boolean send(Notification notification) {
        try {
            // TODO: 실제 이메일 발송 API 연동 (JavaMailSender 또는 외부 서비스)
            log.info("이메일 발송 (Mock) - 수신자: {}, 제목: {}, 내용: {}",
                    notification.getRecipient(),
                    notification.getTitle(),
                    truncateContent(notification.getContent()));

            // Mock 구현: 항상 성공으로 처리
            return true;
        } catch (Exception e) {
            log.error("이메일 발송 실패 - 수신자: {}, 에러: {}",
                    notification.getRecipient(),
                    e.getMessage());
            return false;
        }
    }

    @Override
    public boolean supports(Notification notification) {
        return notification.getChannel() == NotificationChannel.EMAIL;
    }

    private String truncateContent(String content) {
        if (content == null) {
            return "";
        }
        return content.length() > 100 ? content.substring(0, 100) + "..." : content;
    }
}
