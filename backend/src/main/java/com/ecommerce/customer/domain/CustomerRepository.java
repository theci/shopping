package com.ecommerce.customer.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Customer Repository 인터페이스 (도메인 계층)
 */
public interface CustomerRepository {

    Customer save(Customer customer);

    Optional<Customer> findById(Long id);

    Optional<Customer> findByIdWithAddresses(Long id);

    Optional<Customer> findByEmail(String email);

    boolean existsByEmail(String email);

    void delete(Customer customer);

    // Admin용 메서드
    Page<Customer> findAll(Pageable pageable);

    Page<Customer> findByStatus(CustomerStatus status, Pageable pageable);

    Page<Customer> searchCustomers(String keyword, CustomerStatus status, Pageable pageable);
}
