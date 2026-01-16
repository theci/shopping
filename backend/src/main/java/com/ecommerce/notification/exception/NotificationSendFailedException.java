package com.ecommerce.notification.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 알림 발송 실패 시 발생하는 예외
 */
public class NotificationSendFailedException extends BusinessException {

    public NotificationSendFailedException(String channel, String reason) {
        super("NOTIFICATION_SEND_FAILED",
              String.format("알림 발송에 실패했습니다. 채널: %s, 사유: %s", channel, reason));
    }
}
