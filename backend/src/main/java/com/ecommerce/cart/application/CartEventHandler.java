package com.ecommerce.cart.application;

import com.ecommerce.cart.domain.event.CartClearedEvent;
import com.ecommerce.cart.domain.event.CartItemAddedEvent;
import com.ecommerce.cart.domain.event.CartItemQuantityChangedEvent;
import com.ecommerce.cart.domain.event.CartItemRemovedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Cart 도메인 이벤트 핸들러
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CartEventHandler {

    /**
     * 장바구니 아이템 추가 이벤트 처리
     */
    @Async
    @EventListener
    public void handleCartItemAdded(CartItemAddedEvent event) {
        log.info("장바구니 아이템 추가 이벤트 수신: cartId={}, customerId={}, productId={}, quantity={}",
                event.getCartId(), event.getCustomerId(), event.getProductId(), event.getQuantity());
    }

    /**
     * 장바구니 아이템 삭제 이벤트 처리
     */
    @Async
    @EventListener
    public void handleCartItemRemoved(CartItemRemovedEvent event) {
        log.info("장바구니 아이템 삭제 이벤트 수신: cartId={}, customerId={}, productId={}",
                event.getCartId(), event.getCustomerId(), event.getProductId());
    }

    /**
     * 장바구니 아이템 수량 변경 이벤트 처리
     */
    @Async
    @EventListener
    public void handleCartItemQuantityChanged(CartItemQuantityChangedEvent event) {
        log.info("장바구니 아이템 수량 변경 이벤트 수신: cartId={}, customerId={}, productId={}, newQuantity={}",
                event.getCartId(), event.getCustomerId(), event.getProductId(), event.getNewQuantity());
    }

    /**
     * 장바구니 비우기 이벤트 처리
     */
    @Async
    @EventListener
    public void handleCartCleared(CartClearedEvent event) {
        log.info("장바구니 비우기 이벤트 수신: cartId={}, customerId={}",
                event.getCartId(), event.getCustomerId());
    }
}
