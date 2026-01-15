package com.ecommerce.customer.application;

import com.ecommerce.customer.domain.event.CustomerRegisteredEvent;
import com.ecommerce.customer.domain.event.CustomerUpdatedEvent;
import com.ecommerce.customer.domain.event.CustomerWithdrawnEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Customer 도메인 이벤트 핸들러
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CustomerEventHandler {

    /**
     * 고객 등록 이벤트 처리
     */
    @Async
    @EventListener
    public void handleCustomerRegistered(CustomerRegisteredEvent event) {
        log.info("고객 등록 이벤트 수신: customerId={}, email={}, name={}",
                event.getCustomerId(), event.getEmail(), event.getName());

        // TODO: 웰컴 이메일 발송
        // TODO: 웰컴 쿠폰 발급
    }

    /**
     * 고객 정보 업데이트 이벤트 처리
     */
    @Async
    @EventListener
    public void handleCustomerUpdated(CustomerUpdatedEvent event) {
        log.info("고객 정보 업데이트 이벤트 수신: customerId={}, email={}, name={}",
                event.getCustomerId(), event.getEmail(), event.getName());

        // TODO: 정보 변경 알림 발송
    }

    /**
     * 고객 탈퇴 이벤트 처리
     */
    @Async
    @EventListener
    public void handleCustomerWithdrawn(CustomerWithdrawnEvent event) {
        log.info("고객 탈퇴 이벤트 수신: customerId={}, email={}, reason={}",
                event.getCustomerId(), event.getEmail(), event.getReason());

        // TODO: 탈퇴 확인 이메일 발송
        // TODO: 관련 데이터 처리 (장바구니, 찜 목록 등)
    }
}
