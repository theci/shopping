package com.ecommerce.notification.exception;

import com.ecommerce.shared.exception.BusinessException;

/**
 * 알림을 찾을 수 없을 때 발생하는 예외
 */
public class NotificationNotFoundException extends BusinessException {

    public NotificationNotFoundException(Long notificationId) {
        super("NOTIFICATION_NOT_FOUND", "알림을 찾을 수 없습니다. ID: " + notificationId);
    }
}
