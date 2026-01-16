package com.ecommerce.wishlist.infrastructure.persistence;

import com.ecommerce.wishlist.domain.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * Wishlist JPA Repository
 */
public interface JpaWishlistRepository extends JpaRepository<Wishlist, Long> {

    @Query("SELECT w FROM Wishlist w LEFT JOIN FETCH w.items WHERE w.customerId = :customerId")
    Optional<Wishlist> findByCustomerIdWithItems(@Param("customerId") Long customerId);

    Optional<Wishlist> findByCustomerId(Long customerId);

    boolean existsByCustomerId(Long customerId);

    @Query("SELECT CASE WHEN COUNT(wi) > 0 THEN true ELSE false END " +
           "FROM Wishlist w JOIN w.items wi " +
           "WHERE w.customerId = :customerId AND wi.productId = :productId")
    boolean existsByCustomerIdAndProductId(@Param("customerId") Long customerId,
                                           @Param("productId") Long productId);
}
