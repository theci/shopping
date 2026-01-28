package com.ecommerce.customer.infrastructure.persistence;

import com.ecommerce.customer.domain.Customer;
import com.ecommerce.customer.domain.CustomerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // Admin용 메서드
    Page<Customer> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Customer> findByStatusOrderByCreatedAtDesc(CustomerStatus status, Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE " +
           "(:keyword IS NULL OR c.name LIKE %:keyword% OR c.email LIKE %:keyword% OR c.phoneNumber LIKE %:keyword%) AND " +
           "(:status IS NULL OR c.status = :status) " +
           "ORDER BY c.createdAt DESC")
    Page<Customer> searchCustomers(
            @Param("keyword") String keyword,
            @Param("status") CustomerStatus status,
            Pageable pageable);
}
