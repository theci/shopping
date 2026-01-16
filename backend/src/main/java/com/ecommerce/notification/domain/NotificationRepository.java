package com.ecommerce.notification.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Notification Repository 인터페이스 (도메인 계층)
 */
public interface NotificationRepository {

    Notification save(Notification notification);

    Optional<Notification> findById(Long id);

    Page<Notification> findByCustomerId(Long customerId, Pageable pageable);

    Page<Notification> findByCustomerIdAndChannel(Long customerId, NotificationChannel channel, Pageable pageable);

    List<Notification> findUnreadByCustomerId(Long customerId);

    int countUnreadByCustomerId(Long customerId);

    List<Notification> findPendingNotifications();

    List<Notification> findFailedNotificationsForRetry();

    List<Notification> findByReferenceIdAndReferenceType(Long referenceId, String referenceType);

    void deleteOlderThan(LocalDateTime dateTime);
}
