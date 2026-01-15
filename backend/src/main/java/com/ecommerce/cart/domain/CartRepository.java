package com.ecommerce.cart.domain;

import java.util.Optional;

/**
 * Cart Repository 인터페이스 (도메인 계층)
 */
public interface CartRepository {

    Cart save(Cart cart);

    Optional<Cart> findById(Long id);

    Optional<Cart> findByCustomerId(Long customerId);

    boolean existsByCustomerId(Long customerId);

    void delete(Cart cart);
}
