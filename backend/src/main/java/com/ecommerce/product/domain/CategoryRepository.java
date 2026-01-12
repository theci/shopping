package com.ecommerce.product.domain;

import java.util.List;
import java.util.Optional;

/**
 * Category Repository 인터페이스 (도메인 계층)
 */
public interface CategoryRepository {

    Category save(Category category);

    Optional<Category> findById(Long id);

    List<Category> findAll();

    List<Category> findByParentIsNull();

    List<Category> findByParent(Category parent);

    boolean existsById(Long id);

    void delete(Category category);

    void deleteById(Long id);
}
