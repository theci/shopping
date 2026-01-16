package com.ecommerce.order.exception;

import com.ecommerce.order.domain.OrderStatus;
import com.ecommerce.shared.exception.BusinessException;

/**
 * 잘못된 주문 상태 예외
 */
public class InvalidOrderStatusException extends BusinessException {

    public InvalidOrderStatusException(OrderStatus currentStatus, String operation) {
        super("INVALID_ORDER_STATUS",
              String.format("현재 주문 상태(%s)에서 %s 작업을 수행할 수 없습니다.",
                      currentStatus.getDescription(), operation));
    }
}
