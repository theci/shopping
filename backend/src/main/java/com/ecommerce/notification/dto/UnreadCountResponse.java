package com.ecommerce.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 읽지 않은 알림 개수 응답 DTO
 */
@Getter
@AllArgsConstructor
public class UnreadCountResponse {

    private int unreadCount;
}
