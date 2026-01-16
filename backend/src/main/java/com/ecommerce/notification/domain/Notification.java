package com.ecommerce.notification.domain;

import com.ecommerce.notification.domain.event.NotificationSentEvent;
import com.ecommerce.shared.domain.AggregateRoot;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Notification Aggregate Root (알림)
 */
@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notification_customer", columnList = "customer_id"),
        @Index(name = "idx_notification_type", columnList = "notification_type"),
        @Index(name = "idx_notification_status", columnList = "status"),
        @Index(name = "idx_notification_created", columnList = "created_at DESC")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notification extends AggregateRoot {

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false, length = 50)
    private NotificationType notificationType;

    @Enumerated(EnumType.STRING)
    @Column(name = "channel", nullable = false, length = 30)
    private NotificationChannel channel;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "recipient")
    private String recipient; // 이메일 주소 또는 전화번호

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NotificationStatus status;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "failed_reason")
    private String failedReason;

    @Column(name = "reference_id")
    private Long referenceId; // 관련 엔티티 ID (주문 ID, 배송 ID 등)

    @Column(name = "reference_type", length = 50)
    private String referenceType; // ORDER, SHIPPING, COUPON 등

    @Column(name = "retry_count", nullable = false)
    private Integer retryCount;

    @Builder
    public Notification(Long customerId, NotificationType notificationType,
                        NotificationChannel channel, String title, String content,
                        String recipient, Long referenceId, String referenceType) {
        this.customerId = customerId;
        this.notificationType = notificationType;
        this.channel = channel;
        this.title = title;
        this.content = content;
        this.recipient = recipient;
        this.referenceId = referenceId;
        this.referenceType = referenceType;
        this.status = NotificationStatus.PENDING;
        this.retryCount = 0;
    }

    /**
     * 발송 시작
     */
    public void startSending() {
        this.status = NotificationStatus.SENDING;
    }

    /**
     * 발송 성공
     */
    public void markAsSent() {
        this.status = NotificationStatus.SENT;
        this.sentAt = LocalDateTime.now();

        registerEvent(new NotificationSentEvent(
                this.getId(),
                this.customerId,
                this.notificationType,
                this.channel
        ));
    }

    /**
     * 발송 실패
     */
    public void markAsFailed(String reason) {
        this.status = NotificationStatus.FAILED;
        this.failedReason = reason;
        this.retryCount++;
    }

    /**
     * 읽음 처리
     */
    public void markAsRead() {
        if (this.status == NotificationStatus.SENT) {
            this.status = NotificationStatus.READ;
            this.readAt = LocalDateTime.now();
        }
    }

    /**
     * 재발송 가능 여부
     */
    public boolean canRetry() {
        return this.status == NotificationStatus.FAILED && this.retryCount < 3;
    }

    /**
     * 재발송을 위해 대기 상태로 변경
     */
    public void resetForRetry() {
        if (canRetry()) {
            this.status = NotificationStatus.PENDING;
            this.failedReason = null;
        }
    }

    /**
     * 읽었는지 확인
     */
    public boolean isRead() {
        return this.status == NotificationStatus.READ;
    }

    /**
     * 발송 완료 여부
     */
    public boolean isSent() {
        return this.status == NotificationStatus.SENT || this.status == NotificationStatus.READ;
    }
}
