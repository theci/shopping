package com.ecommerce.customer.infrastructure.persistence;

import com.ecommerce.customer.domain.Customer;
import com.ecommerce.customer.domain.CustomerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * Customer JPA Repository
 */
public interface JpaCustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT c FROM Customer c LEFT JOIN FETCH c.addresses WHERE c.id = :id")
    Optional<Customer> findByIdWithAddresses(@Param("id") Long id);

    @Query("SELECT c FROM Customer c LEFT JOIN FETCH c.addresses WHERE c.email = :email")
    Optional<Customer> findByEmailWithAddresses(@Param("email") String email);

    Optional<Customer> findByEmailAndStatus(String email, CustomerStatus status);
}
