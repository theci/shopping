package com.ecommerce.notification.domain;

/**
 * 알림 채널 Enum
 */
public enum NotificationChannel {

    EMAIL("이메일"),
    SMS("문자"),
    PUSH("푸시 알림"),
    KAKAO("카카오톡"),
    IN_APP("인앱 알림");

    private final String description;

    NotificationChannel(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
