package com.ecommerce.notification.infrastructure.persistence;

import com.ecommerce.notification.domain.Notification;
import com.ecommerce.notification.domain.NotificationChannel;
import com.ecommerce.notification.domain.NotificationRepository;
import com.ecommerce.notification.domain.NotificationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Notification Repository 구현체 (인프라 계층)
 */
@Repository
@RequiredArgsConstructor
public class NotificationRepositoryImpl implements NotificationRepository {

    private final JpaNotificationRepository jpaNotificationRepository;

    @Override
    public Notification save(Notification notification) {
        return jpaNotificationRepository.save(notification);
    }

    @Override
    public Optional<Notification> findById(Long id) {
        return jpaNotificationRepository.findById(id);
    }

    @Override
    public Page<Notification> findByCustomerId(Long customerId, Pageable pageable) {
        return jpaNotificationRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);
    }

    @Override
    public Page<Notification> findByCustomerIdAndChannel(Long customerId, NotificationChannel channel, Pageable pageable) {
        return jpaNotificationRepository.findByCustomerIdAndChannelOrderByCreatedAtDesc(customerId, channel, pageable);
    }

    @Override
    public List<Notification> findUnreadByCustomerId(Long customerId) {
        return jpaNotificationRepository.findUnreadByCustomerId(customerId);
    }

    @Override
    public int countUnreadByCustomerId(Long customerId) {
        return jpaNotificationRepository.countUnreadByCustomerId(customerId);
    }

    @Override
    public List<Notification> findPendingNotifications() {
        return jpaNotificationRepository.findByStatus(NotificationStatus.PENDING);
    }

    @Override
    public List<Notification> findFailedNotificationsForRetry() {
        return jpaNotificationRepository.findFailedNotificationsForRetry();
    }

    @Override
    public List<Notification> findByReferenceIdAndReferenceType(Long referenceId, String referenceType) {
        return jpaNotificationRepository.findByReferenceIdAndReferenceType(referenceId, referenceType);
    }

    @Override
    public void deleteOlderThan(LocalDateTime dateTime) {
        jpaNotificationRepository.deleteByCreatedAtBefore(dateTime);
    }
}
