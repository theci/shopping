package com.ecommerce.notification.presentation.web;

import com.ecommerce.notification.application.NotificationService;
import com.ecommerce.notification.domain.NotificationChannel;
import com.ecommerce.notification.dto.NotificationCreateRequest;
import com.ecommerce.notification.dto.NotificationResponse;
import com.ecommerce.notification.dto.UnreadCountResponse;
import com.ecommerce.shared.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Notification 컨트롤러
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * 알림 생성 및 발송 (관리자/시스템용)
     */
    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
            @Valid @RequestBody NotificationCreateRequest request) {
        NotificationResponse response = notificationService.createAndSend(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 알림 조회
     */
    @GetMapping("/{notificationId}")
    public ResponseEntity<NotificationResponse> getNotification(@PathVariable Long notificationId) {
        NotificationResponse response = notificationService.getNotification(notificationId);
        return ResponseEntity.ok(response);
    }

    /**
     * 내 알림 목록 조회
     */
    @GetMapping("/my")
    public ResponseEntity<PageResponse<NotificationResponse>> getMyNotifications(
            @RequestParam Long customerId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<NotificationResponse> response = notificationService.getMyNotifications(customerId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * 채널별 알림 목록 조회
     */
    @GetMapping("/my/channel/{channel}")
    public ResponseEntity<PageResponse<NotificationResponse>> getMyNotificationsByChannel(
            @RequestParam Long customerId,
            @PathVariable NotificationChannel channel,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<NotificationResponse> response =
                notificationService.getMyNotificationsByChannel(customerId, channel, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * 읽지 않은 알림 목록 조회
     */
    @GetMapping("/my/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(
            @RequestParam Long customerId) {
        List<NotificationResponse> response = notificationService.getUnreadNotifications(customerId);
        return ResponseEntity.ok(response);
    }

    /**
     * 읽지 않은 알림 개수 조회
     */
    @GetMapping("/my/unread/count")
    public ResponseEntity<UnreadCountResponse> getUnreadCount(@RequestParam Long customerId) {
        UnreadCountResponse response = notificationService.getUnreadCount(customerId);
        return ResponseEntity.ok(response);
    }

    /**
     * 알림 읽음 처리
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }

    /**
     * 모든 알림 읽음 처리
     */
    @PutMapping("/my/read-all")
    public ResponseEntity<Void> markAllAsRead(@RequestParam Long customerId) {
        notificationService.markAllAsRead(customerId);
        return ResponseEntity.ok().build();
    }

    /**
     * 실패한 알림 재발송 (관리자용)
     */
    @PostMapping("/retry-failed")
    public ResponseEntity<Void> retryFailedNotifications() {
        notificationService.retryFailedNotifications();
        return ResponseEntity.ok().build();
    }
}
