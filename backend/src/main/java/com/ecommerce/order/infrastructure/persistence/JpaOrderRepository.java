package com.ecommerce.order.infrastructure.persistence;

import com.ecommerce.order.domain.Order;
import com.ecommerce.order.domain.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * Order JPA Repository
 */
public interface JpaOrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :id")
    Optional<Order> findByIdWithItems(@Param("id") Long id);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.orderNumber = :orderNumber")
    Optional<Order> findByOrderNumberWithItems(@Param("orderNumber") String orderNumber);

    Optional<Order> findByOrderNumber(String orderNumber);

    Page<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    Page<Order> findByCustomerIdAndOrderStatusOrderByCreatedAtDesc(
            Long customerId, OrderStatus orderStatus, Pageable pageable);

    boolean existsByOrderNumber(String orderNumber);

    @Query("SELECT o FROM Order o WHERE o.customerId = :customerId ORDER BY o.createdAt DESC")
    Page<Order> findByCustomerId(@Param("customerId") Long customerId, Pageable pageable);
}
