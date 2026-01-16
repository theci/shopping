package com.ecommerce.notification.domain;

/**
 * 알림 상태 Enum
 */
public enum NotificationStatus {

    PENDING("대기 중"),
    SENDING("발송 중"),
    SENT("발송 완료"),
    FAILED("발송 실패"),
    READ("읽음");

    private final String description;

    NotificationStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
