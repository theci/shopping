package com.ecommerce.product.application;

import com.ecommerce.product.domain.Category;
import com.ecommerce.product.domain.CategoryRepository;
import com.ecommerce.product.domain.Product;
import com.ecommerce.product.domain.ProductRepository;
import com.ecommerce.product.domain.event.ProductCreatedEvent;
import com.ecommerce.product.dto.ProductCreateRequest;
import com.ecommerce.product.dto.ProductResponse;
import com.ecommerce.product.dto.ProductSearchRequest;
import com.ecommerce.product.dto.ProductUpdateRequest;
import com.ecommerce.product.dto.StockAdjustmentRequest;
import com.ecommerce.product.exception.CategoryNotFoundException;
import com.ecommerce.product.exception.ProductNotFoundException;
import com.ecommerce.shared.dto.PageResponse;
import com.ecommerce.shared.infrastructure.DomainEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Product 애플리케이션 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final DomainEventPublisher eventPublisher;

    /**
     * 상품 생성
     */
    @Transactional
    public ProductResponse createProduct(ProductCreateRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CategoryNotFoundException(request.getCategoryId()));
        }

        Product product = Product.create(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getStockQuantity(),
                request.getBrand(),
                category
        );

        Product savedProduct = productRepository.save(product);

        // 저장 후 이벤트 발행 (ID가 생성된 후)
        savedProduct.registerEvent(new ProductCreatedEvent(savedProduct.getId()));
        eventPublisher.publishEvents(savedProduct);

        log.info("Product created: id={}, name={}", savedProduct.getId(), savedProduct.getName());

        return productMapper.toResponse(savedProduct);
    }

    /**
     * 상품 조회
     */
    public ProductResponse getProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        return productMapper.toResponse(product);
    }

    /**
     * 상품 목록 조회
     */
    public PageResponse<ProductResponse> getProducts(ProductSearchRequest searchRequest) {
        Pageable pageable = createPageable(searchRequest);

        Page<Product> productPage = productRepository.findAll(pageable);

        Page<ProductResponse> responsePage = productPage.map(productMapper::toResponse);

        return PageResponse.of(responsePage);
    }

    /**
     * 상품 검색
     */
    public PageResponse<ProductResponse> searchProducts(ProductSearchRequest searchRequest) {
        Pageable pageable = createPageable(searchRequest);

        Page<Product> productPage;

        if (searchRequest.getKeyword() != null && !searchRequest.getKeyword().isBlank()) {
            productPage = productRepository.findByNameContaining(
                    searchRequest.getKeyword(), pageable);
        } else if (searchRequest.getStatus() != null) {
            productPage = productRepository.findByStatus(
                    searchRequest.getStatus(), pageable);
        } else if (searchRequest.getCategoryId() != null) {
            Category category = categoryRepository.findById(searchRequest.getCategoryId())
                    .orElseThrow(() -> new CategoryNotFoundException(searchRequest.getCategoryId()));
            productPage = productRepository.findByCategory(category, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        Page<ProductResponse> responsePage = productPage.map(productMapper::toResponse);

        return PageResponse.of(responsePage);
    }

    /**
     * 상품 수정
     */
    @Transactional
    public ProductResponse updateProduct(Long productId, ProductUpdateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CategoryNotFoundException(request.getCategoryId()));
        }

        product.update(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getBrand(),
                category
        );

        Product savedProduct = productRepository.save(product);

        log.info("Product updated: id={}", productId);

        return productMapper.toResponse(savedProduct);
    }

    /**
     * 상품 삭제
     */
    @Transactional
    public void deleteProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ProductNotFoundException(productId);
        }

        productRepository.deleteById(productId);

        log.info("Product deleted: id={}", productId);
    }

    /**
     * 상품 발행
     */
    @Transactional
    public ProductResponse publishProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        product.publish();

        Product savedProduct = productRepository.save(product);
        eventPublisher.publishEvents(savedProduct);

        log.info("Product published: id={}", productId);

        return productMapper.toResponse(savedProduct);
    }

    /**
     * 재고 조정
     */
    @Transactional
    public ProductResponse adjustStock(Long productId, StockAdjustmentRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        if (request.getType() == StockAdjustmentRequest.AdjustmentType.INCREASE) {
            product.increaseStock(request.getQuantity());
        } else {
            product.decreaseStock(request.getQuantity());
        }

        Product savedProduct = productRepository.save(product);
        eventPublisher.publishEvents(savedProduct);

        log.info("Stock adjusted: productId={}, type={}, quantity={}",
                productId, request.getType(), request.getQuantity());

        return productMapper.toResponse(savedProduct);
    }

    private Pageable createPageable(ProductSearchRequest searchRequest) {
        Sort sort = Sort.by(
                "DESC".equalsIgnoreCase(searchRequest.getDirection())
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC,
                searchRequest.getSort()
        );

        return PageRequest.of(
                searchRequest.getPage(),
                searchRequest.getSize(),
                sort
        );
    }
}
