package com.ecommerce.notification.infrastructure.persistence;

import com.ecommerce.notification.domain.Notification;
import com.ecommerce.notification.domain.NotificationChannel;
import com.ecommerce.notification.domain.NotificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Notification JPA Repository
 */
public interface JpaNotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    Page<Notification> findByCustomerIdAndChannelOrderByCreatedAtDesc(
            Long customerId, NotificationChannel channel, Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE n.customerId = :customerId " +
           "AND n.status IN ('SENT', 'PENDING', 'SENDING') AND n.readAt IS NULL " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.customerId = :customerId " +
           "AND n.status = 'SENT' AND n.readAt IS NULL")
    int countUnreadByCustomerId(@Param("customerId") Long customerId);

    List<Notification> findByStatus(NotificationStatus status);

    @Query("SELECT n FROM Notification n WHERE n.status = 'FAILED' AND n.retryCount < 3")
    List<Notification> findFailedNotificationsForRetry();

    List<Notification> findByReferenceIdAndReferenceType(Long referenceId, String referenceType);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.createdAt < :dateTime")
    void deleteByCreatedAtBefore(@Param("dateTime") LocalDateTime dateTime);
}
