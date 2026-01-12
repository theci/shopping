package com.ecommerce.product.presentation.web;

import com.ecommerce.product.application.CategoryService;
import com.ecommerce.product.dto.CategoryResponse;
import com.ecommerce.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Category REST API Controller
 */
@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * 모든 카테고리 조회
     */
    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> response = categoryService.getAllCategories();
        return ApiResponse.success(response);
    }

    /**
     * 최상위 카테고리 조회
     */
    @GetMapping("/root")
    public ApiResponse<List<CategoryResponse>> getRootCategories() {
        List<CategoryResponse> response = categoryService.getRootCategories();
        return ApiResponse.success(response);
    }

    /**
     * 특정 카테고리의 하위 카테고리 조회
     */
    @GetMapping("/{id}/children")
    public ApiResponse<List<CategoryResponse>> getChildCategories(@PathVariable Long id) {
        List<CategoryResponse> response = categoryService.getChildCategories(id);
        return ApiResponse.success(response);
    }
}
