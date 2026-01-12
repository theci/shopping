package com.ecommerce.product.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Product Repository 인터페이스 (도메인 계층)
 */
public interface ProductRepository {

    Product save(Product product);

    Optional<Product> findById(Long id);

    Page<Product> findAll(Pageable pageable);

    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    Page<Product> findByCategory(Category category, Pageable pageable);

    Page<Product> findByNameContaining(String name, Pageable pageable);

    boolean existsById(Long id);

    void delete(Product product);

    void deleteById(Long id);
}
