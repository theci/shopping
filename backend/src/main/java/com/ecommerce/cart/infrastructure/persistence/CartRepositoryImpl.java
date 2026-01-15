package com.ecommerce.cart.infrastructure.persistence;

import com.ecommerce.cart.domain.Cart;
import com.ecommerce.cart.domain.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Cart Repository 구현체
 */
@Repository
@RequiredArgsConstructor
public class CartRepositoryImpl implements CartRepository {

    private final JpaCartRepository jpaCartRepository;

    @Override
    public Cart save(Cart cart) {
        return jpaCartRepository.save(cart);
    }

    @Override
    public Optional<Cart> findById(Long id) {
        return jpaCartRepository.findByIdWithItems(id);
    }

    @Override
    public Optional<Cart> findByCustomerId(Long customerId) {
        return jpaCartRepository.findByCustomerIdWithItems(customerId);
    }

    @Override
    public boolean existsByCustomerId(Long customerId) {
        return jpaCartRepository.existsByCustomerId(customerId);
    }

    @Override
    public void delete(Cart cart) {
        jpaCartRepository.delete(cart);
    }
}
