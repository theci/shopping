package com.ecommerce.notification.application;

import com.ecommerce.notification.domain.Notification;
import com.ecommerce.notification.domain.NotificationChannel;
import com.ecommerce.notification.domain.NotificationRepository;
import com.ecommerce.notification.domain.NotificationType;
import com.ecommerce.notification.dto.NotificationCreateRequest;
import com.ecommerce.notification.dto.NotificationResponse;
import com.ecommerce.notification.dto.UnreadCountResponse;
import com.ecommerce.notification.exception.NotificationNotFoundException;
import com.ecommerce.notification.infrastructure.sender.NotificationSender;
import com.ecommerce.shared.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Notification 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final List<NotificationSender> notificationSenders;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * 알림 생성 및 발송
     */
    @Transactional
    public NotificationResponse createAndSend(NotificationCreateRequest request) {
        Notification notification = Notification.builder()
                .customerId(request.getCustomerId())
                .notificationType(request.getNotificationType())
                .channel(request.getChannel())
                .title(request.getTitle())
                .content(request.getContent())
                .recipient(request.getRecipient())
                .referenceId(request.getReferenceId())
                .referenceType(request.getReferenceType())
                .build();

        Notification savedNotification = notificationRepository.save(notification);

        // 비동기 발송
        sendAsync(savedNotification.getId());

        return notificationMapper.toNotificationResponse(savedNotification);
    }

    /**
     * 알림 발송 (비동기)
     */
    @Async
    @Transactional
    public void sendAsync(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElse(null);

        if (notification == null) {
            log.warn("알림을 찾을 수 없습니다. ID: {}", notificationId);
            return;
        }

        send(notification);
    }

    /**
     * 알림 발송
     */
    @Transactional
    public void send(Notification notification) {
        notification.startSending();

        NotificationSender sender = notificationSenders.stream()
                .filter(s -> s.supports(notification))
                .findFirst()
                .orElse(null);

        if (sender == null) {
            log.error("지원하지 않는 알림 채널: {}", notification.getChannel());
            notification.markAsFailed("지원하지 않는 알림 채널");
            notificationRepository.save(notification);
            return;
        }

        boolean success = sender.send(notification);

        if (success) {
            notification.markAsSent();
            log.info("알림 발송 성공 - ID: {}, 채널: {}, 타입: {}",
                    notification.getId(),
                    notification.getChannel(),
                    notification.getNotificationType());
        } else {
            notification.markAsFailed("발송 실패");
            log.error("알림 발송 실패 - ID: {}, 채널: {}",
                    notification.getId(),
                    notification.getChannel());
        }

        Notification savedNotification = notificationRepository.save(notification);

        // 도메인 이벤트 발행
        savedNotification.getDomainEvents().forEach(eventPublisher::publishEvent);
        savedNotification.clearDomainEvents();
    }

    /**
     * 알림 조회
     */
    public NotificationResponse getNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException(notificationId));
        return notificationMapper.toNotificationResponse(notification);
    }

    /**
     * 내 알림 목록 조회
     */
    public PageResponse<NotificationResponse> getMyNotifications(Long customerId, Pageable pageable) {
        Page<NotificationResponse> page = notificationRepository.findByCustomerId(customerId, pageable)
                .map(notificationMapper::toNotificationResponse);
        return PageResponse.of(page);
    }

    /**
     * 채널별 알림 목록 조회
     */
    public PageResponse<NotificationResponse> getMyNotificationsByChannel(
            Long customerId, NotificationChannel channel, Pageable pageable) {
        Page<NotificationResponse> page = notificationRepository
                .findByCustomerIdAndChannel(customerId, channel, pageable)
                .map(notificationMapper::toNotificationResponse);
        return PageResponse.of(page);
    }

    /**
     * 읽지 않은 알림 목록 조회
     */
    public List<NotificationResponse> getUnreadNotifications(Long customerId) {
        return notificationRepository.findUnreadByCustomerId(customerId).stream()
                .map(notificationMapper::toNotificationResponse)
                .collect(Collectors.toList());
    }

    /**
     * 읽지 않은 알림 개수 조회
     */
    public UnreadCountResponse getUnreadCount(Long customerId) {
        int count = notificationRepository.countUnreadByCustomerId(customerId);
        return new UnreadCountResponse(count);
    }

    /**
     * 알림 읽음 처리
     */
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException(notificationId));

        notification.markAsRead();
        notificationRepository.save(notification);
    }

    /**
     * 모든 알림 읽음 처리
     */
    @Transactional
    public void markAllAsRead(Long customerId) {
        List<Notification> unreadNotifications = notificationRepository.findUnreadByCustomerId(customerId);

        unreadNotifications.forEach(notification -> {
            notification.markAsRead();
            notificationRepository.save(notification);
        });
    }

    /**
     * 실패한 알림 재발송
     */
    @Transactional
    public void retryFailedNotifications() {
        List<Notification> failedNotifications = notificationRepository.findFailedNotificationsForRetry();

        log.info("재발송 대상 알림 수: {}", failedNotifications.size());

        failedNotifications.forEach(notification -> {
            notification.resetForRetry();
            notificationRepository.save(notification);
            sendAsync(notification.getId());
        });
    }

    /**
     * 오래된 알림 삭제
     */
    @Transactional
    public void deleteOldNotifications(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        notificationRepository.deleteOlderThan(cutoffDate);
        log.info("{}일 이전 알림 삭제 완료", daysOld);
    }

    /**
     * 간편 알림 발송 메서드
     */
    @Transactional
    public void sendNotification(Long customerId, NotificationType type, NotificationChannel channel,
                                  String title, String content, String recipient,
                                  Long referenceId, String referenceType) {
        NotificationCreateRequest request = NotificationCreateRequest.builder()
                .customerId(customerId)
                .notificationType(type)
                .channel(channel)
                .title(title)
                .content(content)
                .recipient(recipient)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .build();

        createAndSend(request);
    }
}
