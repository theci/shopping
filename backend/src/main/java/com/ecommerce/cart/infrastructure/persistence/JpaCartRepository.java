package com.ecommerce.cart.infrastructure.persistence;

import com.ecommerce.cart.domain.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * Cart JPA Repository
 */
public interface JpaCartRepository extends JpaRepository<Cart, Long> {

    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.items WHERE c.customerId = :customerId")
    Optional<Cart> findByCustomerIdWithItems(@Param("customerId") Long customerId);

    Optional<Cart> findByCustomerId(Long customerId);

    boolean existsByCustomerId(Long customerId);

    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.items WHERE c.id = :id")
    Optional<Cart> findByIdWithItems(@Param("id") Long id);
}
