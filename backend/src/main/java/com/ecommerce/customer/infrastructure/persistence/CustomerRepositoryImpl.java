package com.ecommerce.customer.infrastructure.persistence;

import com.ecommerce.customer.domain.Customer;
import com.ecommerce.customer.domain.CustomerRepository;
import com.ecommerce.customer.domain.CustomerStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Customer Repository 구현체
 */
@Repository
@RequiredArgsConstructor
public class CustomerRepositoryImpl implements CustomerRepository {

    private final JpaCustomerRepository jpaCustomerRepository;

    @Override
    public Customer save(Customer customer) {
        return jpaCustomerRepository.save(customer);
    }

    @Override
    public Optional<Customer> findById(Long id) {
        return jpaCustomerRepository.findByIdWithAddresses(id);
    }

    @Override
    public Optional<Customer> findByIdWithAddresses(Long id) {
        return jpaCustomerRepository.findByIdWithAddresses(id);
    }

    @Override
    public Optional<Customer> findByEmail(String email) {
        return jpaCustomerRepository.findByEmailWithAddresses(email);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaCustomerRepository.existsByEmail(email);
    }

    @Override
    public void delete(Customer customer) {
        jpaCustomerRepository.delete(customer);
    }

    // Admin용 메서드
    @Override
    public Page<Customer> findAll(Pageable pageable) {
        return jpaCustomerRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Override
    public Page<Customer> findByStatus(CustomerStatus status, Pageable pageable) {
        return jpaCustomerRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
    }

    @Override
    public Page<Customer> searchCustomers(String keyword, CustomerStatus status, Pageable pageable) {
        return jpaCustomerRepository.searchCustomers(keyword, status, pageable);
    }
}
