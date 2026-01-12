package com.ecommerce.product.infrastructure.persistence;

import com.ecommerce.product.domain.Category;
import com.ecommerce.product.domain.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * CategoryRepository 구현체
 * JpaCategoryRepository와 CategoryQuerydslRepository를 조합하여 사용
 */
@Repository
@RequiredArgsConstructor
public class CategoryRepositoryImpl implements CategoryRepository {

    private final JpaCategoryRepository jpaCategoryRepository;
    private final CategoryQuerydslRepository querydslRepository;

    @Override
    public Category save(Category category) {
        return jpaCategoryRepository.save(category);
    }

    @Override
    public Optional<Category> findById(Long id) {
        return jpaCategoryRepository.findById(id);
    }

    @Override
    public List<Category> findAll() {
        // QueryDSL로 정렬된 카테고리 트리 조회
        return querydslRepository.findCategoryTree();
    }

    @Override
    public List<Category> findByParentIsNull() {
        // QueryDSL로 최상위 카테고리 조회 (정렬 포함)
        return querydslRepository.findByDepth(0);
    }

    @Override
    public List<Category> findByParent(Category parent) {
        return jpaCategoryRepository.findByParent(parent);
    }

    @Override
    public boolean existsById(Long id) {
        return jpaCategoryRepository.existsById(id);
    }

    @Override
    public void delete(Category category) {
        jpaCategoryRepository.delete(category);
    }

    @Override
    public void deleteById(Long id) {
        jpaCategoryRepository.deleteById(id);
    }
}
