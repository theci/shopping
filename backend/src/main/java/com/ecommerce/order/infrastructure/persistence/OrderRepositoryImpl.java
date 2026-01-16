package com.ecommerce.order.infrastructure.persistence;

import com.ecommerce.order.domain.Order;
import com.ecommerce.order.domain.OrderRepository;
import com.ecommerce.order.domain.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Order Repository 구현체
 */
@Repository
@RequiredArgsConstructor
public class OrderRepositoryImpl implements OrderRepository {

    private final JpaOrderRepository jpaOrderRepository;

    @Override
    public Order save(Order order) {
        return jpaOrderRepository.save(order);
    }

    @Override
    public Optional<Order> findById(Long id) {
        return jpaOrderRepository.findByIdWithItems(id);
    }

    @Override
    public Optional<Order> findByOrderNumber(String orderNumber) {
        return jpaOrderRepository.findByOrderNumberWithItems(orderNumber);
    }

    @Override
    public Page<Order> findByCustomerId(Long customerId, Pageable pageable) {
        return jpaOrderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);
    }

    @Override
    public Page<Order> findByCustomerIdAndOrderStatus(Long customerId, OrderStatus status, Pageable pageable) {
        return jpaOrderRepository.findByCustomerIdAndOrderStatusOrderByCreatedAtDesc(customerId, status, pageable);
    }

    @Override
    public boolean existsByOrderNumber(String orderNumber) {
        return jpaOrderRepository.existsByOrderNumber(orderNumber);
    }
}
