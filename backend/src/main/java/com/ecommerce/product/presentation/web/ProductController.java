package com.ecommerce.product.presentation.web;

import com.ecommerce.product.application.ProductService;
import com.ecommerce.product.dto.*;
import com.ecommerce.shared.dto.ApiResponse;
import com.ecommerce.shared.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * Product REST API Controller
 */
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * 상품 생성
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ProductResponse> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ApiResponse.success(response, "상품이 생성되었습니다");
    }

    /**
     * 상품 상세 조회
     */
    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable Long id) {
        ProductResponse response = productService.getProduct(id);
        return ApiResponse.success(response);
    }

    /**
     * 상품 목록 조회
     */
    @GetMapping
    public ApiResponse<PageResponse<ProductResponse>> getProducts(
            @ModelAttribute ProductSearchRequest searchRequest) {
        PageResponse<ProductResponse> response = productService.searchProducts(searchRequest);
        return ApiResponse.success(response);
    }

    /**
     * 상품 수정
     */
    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest request) {
        ProductResponse response = productService.updateProduct(id, request);
        return ApiResponse.success(response, "상품이 수정되었습니다");
    }

    /**
     * 상품 삭제
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.success("상품이 삭제되었습니다");
    }

    /**
     * 상품 발행 (판매 시작)
     */
    @PostMapping("/{id}/publish")
    public ApiResponse<ProductResponse> publishProduct(@PathVariable Long id) {
        ProductResponse response = productService.publishProduct(id);
        return ApiResponse.success(response, "상품이 발행되었습니다");
    }

    /**
     * 재고 조정
     */
    @PatchMapping("/{id}/stock")
    public ApiResponse<ProductResponse> adjustStock(
            @PathVariable Long id,
            @Valid @RequestBody StockAdjustmentRequest request) {
        ProductResponse response = productService.adjustStock(id, request);
        return ApiResponse.success(response, "재고가 조정되었습니다");
    }
}
