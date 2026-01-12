package com.ecommerce.product.application;

import com.ecommerce.product.domain.Category;
import com.ecommerce.product.domain.CategoryRepository;
import com.ecommerce.product.dto.CategoryResponse;
import com.ecommerce.product.exception.CategoryNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Category 애플리케이션 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    /**
     * 모든 카테고리 조회
     */
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(productMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * 최상위 카테고리 조회
     */
    public List<CategoryResponse> getRootCategories() {
        return categoryRepository.findByParentIsNull().stream()
                .map(productMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * 특정 카테고리의 하위 카테고리 조회
     */
    public List<CategoryResponse> getChildCategories(Long parentId) {
        Category parent = categoryRepository.findById(parentId)
                .orElseThrow(() -> new CategoryNotFoundException(parentId));

        return categoryRepository.findByParent(parent).stream()
                .map(productMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * 카테고리 생성
     */
    @Transactional
    public CategoryResponse createCategory(String name, Long parentId, Integer displayOrder) {
        Category parent = null;
        if (parentId != null) {
            parent = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new CategoryNotFoundException(parentId));
        }

        Category category = Category.create(name, parent, displayOrder);
        Category savedCategory = categoryRepository.save(category);

        log.info("Category created: id={}, name={}", savedCategory.getId(), savedCategory.getName());

        return productMapper.toCategoryResponse(savedCategory);
    }
}
