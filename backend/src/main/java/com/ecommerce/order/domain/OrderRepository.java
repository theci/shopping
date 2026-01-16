package com.ecommerce.order.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Order Repository 인터페이스 (도메인 계층)
 */
public interface OrderRepository {

    Order save(Order order);

    Optional<Order> findById(Long id);

    Optional<Order> findByOrderNumber(String orderNumber);

    Page<Order> findByCustomerId(Long customerId, Pageable pageable);

    Page<Order> findByCustomerIdAndOrderStatus(Long customerId, OrderStatus status, Pageable pageable);

    boolean existsByOrderNumber(String orderNumber);
}
