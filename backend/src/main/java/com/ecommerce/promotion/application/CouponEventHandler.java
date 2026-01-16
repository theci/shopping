package com.ecommerce.promotion.application;

import com.ecommerce.promotion.domain.event.CouponIssuedEvent;
import com.ecommerce.promotion.domain.event.CouponUsedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * 쿠폰 이벤트 핸들러
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CouponEventHandler {

    /**
     * 쿠폰 발급 이벤트 처리
     */
    @Async
    @EventListener
    public void handleCouponIssued(CouponIssuedEvent event) {
        log.info("쿠폰 발급됨 - 쿠폰ID: {}, 쿠폰코드: {}, 쿠폰명: {}, 고객ID: {}",
                event.getCouponId(),
                event.getCouponCode(),
                event.getCouponName(),
                event.getCustomerId());

        // 필요시 추가 처리
        // - 알림 발송
        // - 쿠폰 발급 이력 저장
    }

    /**
     * 쿠폰 사용 이벤트 처리
     */
    @Async
    @EventListener
    public void handleCouponUsed(CouponUsedEvent event) {
        log.info("쿠폰 사용됨 - 쿠폰ID: {}, 쿠폰코드: {}, 고객ID: {}, 주문ID: {}, 할인금액: {}",
                event.getCouponId(),
                event.getCouponCode(),
                event.getCustomerId(),
                event.getOrderId(),
                event.getDiscountAmount());

        // 필요시 추가 처리
        // - 쿠폰 사용 이력 저장
        // - 통계 업데이트
    }
}
