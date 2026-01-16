package com.ecommerce.wishlist.application;

import com.ecommerce.product.domain.event.ProductStockChangedEvent;
import com.ecommerce.wishlist.domain.WishlistItem;
import com.ecommerce.wishlist.domain.WishlistRepository;
import com.ecommerce.wishlist.domain.event.WishlistItemAddedEvent;
import com.ecommerce.wishlist.domain.event.WishlistItemRemovedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Wishlist 이벤트 핸들러
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WishlistEventHandler {

    private final WishlistRepository wishlistRepository;

    /**
     * 찜 아이템 추가 이벤트 처리
     */
    @Async
    @EventListener
    public void handleWishlistItemAdded(WishlistItemAddedEvent event) {
        log.info("찜 아이템 추가됨 - 고객ID: {}, 상품ID: {}, 상품명: {}",
                event.getCustomerId(),
                event.getProductId(),
                event.getProductName());
    }

    /**
     * 찜 아이템 삭제 이벤트 처리
     */
    @Async
    @EventListener
    public void handleWishlistItemRemoved(WishlistItemRemovedEvent event) {
        log.info("찜 아이템 삭제됨 - 고객ID: {}, 상품ID: {}",
                event.getCustomerId(),
                event.getProductId());
    }

    /**
     * 상품 재고 변경 이벤트 처리 - 재입고 알림
     */
    @Async
    @EventListener
    public void handleProductStockChanged(ProductStockChangedEvent event) {
        // 재고가 양수인 경우 (재입고 가능성)
        if (event.getCurrentStock() != null && event.getCurrentStock() > 0) {
            log.debug("상품 재고 변경 감지 - 상품ID: {}, 현재 재고: {}",
                    event.getProductId(),
                    event.getCurrentStock());

            // 재고 알림 설정한 고객들 조회
            List<WishlistItem> notificationTargets =
                    wishlistRepository.findItemsByProductIdAndNotifyOnRestock(event.getProductId());

            if (!notificationTargets.isEmpty()) {
                log.info("재입고 알림 대상 고객 수: {} - 상품ID: {}",
                        notificationTargets.size(),
                        event.getProductId());

                // 실제 알림 발송은 Notification 도메인에서 처리
                // 여기서는 알림 대상만 로깅
                notificationTargets.forEach(item -> {
                    log.info("재입고 알림 발송 대상 - 찜ID: {}, 상품ID: {}",
                            item.getId(),
                            item.getProductId());
                });
            }
        }
    }
}
