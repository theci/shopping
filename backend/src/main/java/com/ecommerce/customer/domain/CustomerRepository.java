package com.ecommerce.customer.domain;

import java.util.Optional;

/**
 * Customer Repository 인터페이스 (도메인 계층)
 */
public interface CustomerRepository {

    Customer save(Customer customer);

    Optional<Customer> findById(Long id);

    Optional<Customer> findByEmail(String email);

    boolean existsByEmail(String email);

    void delete(Customer customer);
}
