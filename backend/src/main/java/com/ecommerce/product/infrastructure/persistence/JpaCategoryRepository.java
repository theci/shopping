package com.ecommerce.product.infrastructure.persistence;

import com.ecommerce.product.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data JPA Category Repository
 */
public interface JpaCategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByParentIsNull();

    List<Category> findByParent(Category parent);
}
