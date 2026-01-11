# Production-Grade E-Commerce Code Examples

DDD3 패턴을 적용한 프로덕션급 이커머스 코드 예시

## 목차
1. [Product 도메인 완전 구현](#product-도메인)
2. [Order 도메인 완전 구현](#order-도메인)
3. [Cart 도메인 구현](#cart-도메인)
4. [Payment 도메인 구현](#payment-도메인)
5. [공통 패턴](#공통-패턴)

---

## Product 도메인

### 1. Product.java (Aggregate Root)

```java
package com.ecommerce.product.domain;

import com.ecommerce.shared.domain.AggregateRoot;
import com.ecommerce.product.domain.event.*;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_category", columnList = "category_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "created_at DESC")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product extends AggregateRoot {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private String name;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stockQuantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ProductStatus status;

    private String brand;

    @Column(nullable = false)
    private Long viewCount = 0L;

    @Column(nullable = false)
    private Long salesCount = 0L;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    @Column(nullable = false)
    private Boolean isDeleted = false;

    private LocalDateTime publishedAt;
    private LocalDateTime discontinuedAt;

    // Factory method
    public static Product create(Category category, String name, String description,
                                 BigDecimal price, Integer stockQuantity, String brand) {
        validateProductData(name, description, price, stockQuantity);

        Product product = new Product();
        product.category = category;
        product.name = name;
        product.description = description;
        product.price = price;
        product.stockQuantity = stockQuantity;
        product.brand = brand;
        product.status = ProductStatus.DRAFT;

        product.addDomainEvent(new ProductCreatedEvent(product.getId(), product.getName()));
        return product;
    }

    // Business operations
    public void publish() {
        if (this.status == ProductStatus.ACTIVE) {
            throw new IllegalStateException("이미 발행된 상품입니다.");
        }
        if (this.stockQuantity <= 0) {
            throw new IllegalStateException("재고가 없는 상품은 발행할 수 없습니다.");
        }

        this.status = ProductStatus.ACTIVE;
        this.publishedAt = LocalDateTime.now();

        addDomainEvent(new ProductPublishedEvent(this.getId(), this.getName()));
    }

    public void deactivate() {
        if (this.status != ProductStatus.ACTIVE) {
            throw new IllegalStateException("활성화된 상품만 비활성화할 수 있습니다.");
        }

        this.status = ProductStatus.INACTIVE;
        addDomainEvent(new ProductDeactivatedEvent(this.getId()));
    }

    public void discontinue() {
        this.status = ProductStatus.DISCONTINUED;
        this.discontinuedAt = LocalDateTime.now();
        addDomainEvent(new ProductDiscontinuedEvent(this.getId()));
    }

    public void decreaseStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("수량은 0보다 커야 합니다.");
        }
        if (this.stockQuantity < quantity) {
            throw new InsufficientStockException(
                String.format("재고가 부족합니다. 현재 재고: %d, 요청 수량: %d",
                             this.stockQuantity, quantity));
        }

        this.stockQuantity -= quantity;

        if (this.stockQuantity == 0 && this.status == ProductStatus.ACTIVE) {
            this.status = ProductStatus.OUT_OF_STOCK;
        }

        addDomainEvent(new ProductStockChangedEvent(this.getId(), this.stockQuantity));
    }

    public void increaseStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("수량은 0보다 커야 합니다.");
        }

        this.stockQuantity += quantity;

        if (this.status == ProductStatus.OUT_OF_STOCK && this.stockQuantity > 0) {
            this.status = ProductStatus.ACTIVE;
        }

        addDomainEvent(new ProductStockChangedEvent(this.getId(), this.stockQuantity));
    }

    public void updatePrice(BigDecimal newPrice) {
        validatePrice(newPrice);

        BigDecimal oldPrice = this.price;
        this.price = newPrice;

        addDomainEvent(new ProductPriceChangedEvent(this.getId(), oldPrice, newPrice));
    }

    public void updateInfo(String name, String description) {
        validateName(name);
        this.name = name;
        this.description = description;
    }

    public void addImage(String imageUrl, boolean isPrimary) {
        ProductImage image = new ProductImage(this, imageUrl, images.size(), isPrimary);
        this.images.add(image);
    }

    public void increaseViewCount() {
        this.viewCount++;
    }

    public void increaseSalesCount() {
        this.salesCount++;
    }

    public void softDelete() {
        this.isDeleted = true;
        this.status = ProductStatus.DISCONTINUED;
    }

    public boolean isAvailableForPurchase() {
        return this.status == ProductStatus.ACTIVE &&
               this.stockQuantity > 0 &&
               !this.isDeleted;
    }

    // Validation
    private static void validateProductData(String name, String description,
                                           BigDecimal price, Integer stockQuantity) {
        validateName(name);
        validatePrice(price);

        if (stockQuantity == null || stockQuantity < 0) {
            throw new IllegalArgumentException("재고 수량은 0 이상이어야 합니다.");
        }
    }

    private static void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("상품명은 필수입니다.");
        }
        if (name.length() > 255) {
            throw new IllegalArgumentException("상품명은 255자를 초과할 수 없습니다.");
        }
    }

    private static void validatePrice(BigDecimal price) {
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("가격은 0보다 커야 합니다.");
        }
    }
}
```

### 2. ProductImage.java (Entity)

```java
package com.ecommerce.product.domain;

import com.ecommerce.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_images")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductImage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private Integer displayOrder;

    @Column(nullable = false)
    private Boolean isPrimary = false;

    public ProductImage(Product product, String imageUrl, Integer displayOrder, Boolean isPrimary) {
        this.product = product;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
        this.isPrimary = isPrimary;
    }
}
```

### 3. ProductRepository.java (Interface)

```java
package com.ecommerce.product.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ProductRepository {
    Product save(Product product);
    Optional<Product> findById(Long id);
    Optional<Product> findByIdWithCategory(Long id);
    Page<Product> findAll(Pageable pageable);
    List<Product> findByCategory(Category category);
    Page<Product> searchProducts(String keyword, Long categoryId, ProductStatus status,
                                 Pageable pageable);
    void delete(Product product);
    boolean existsById(Long id);
}
```

### 4. ProductService.java (Application Layer)

```java
package com.ecommerce.product.application;

import com.ecommerce.product.domain.*;
import com.ecommerce.product.exception.ProductNotFoundException;
import com.ecommerce.shared.infrastructure.DomainEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final DomainEventPublisher eventPublisher;

    @Transactional
    public Product createProduct(Long categoryId, String name, String description,
                                BigDecimal price, Integer stockQuantity, String brand) {
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다: " + categoryId));

        Product product = Product.create(category, name, description, price, stockQuantity, brand);
        Product savedProduct = productRepository.save(product);

        eventPublisher.publishEvents(savedProduct);

        log.info("Product created: {}", savedProduct.getId());
        return savedProduct;
    }

    @Transactional
    public void publishProduct(Long productId) {
        Product product = getProductById(productId);
        product.publish();

        eventPublisher.publishEvents(product);

        log.info("Product published: {}", productId);
    }

    @Transactional
    public void updateProductPrice(Long productId, BigDecimal newPrice) {
        Product product = getProductById(productId);
        product.updatePrice(newPrice);

        eventPublisher.publishEvents(product);

        log.info("Product price updated: {} to {}", productId, newPrice);
    }

    @Transactional
    public void decreaseStock(Long productId, int quantity) {
        Product product = getProductById(productId);
        product.decreaseStock(quantity);

        eventPublisher.publishEvents(product);

        log.info("Product stock decreased: {} by {}", productId, quantity);
    }

    @Transactional
    public void increaseStock(Long productId, int quantity) {
        Product product = getProductById(productId);
        product.increaseStock(quantity);

        eventPublisher.publishEvents(product);

        log.info("Product stock increased: {} by {}", productId, quantity);
    }

    public Product getProductById(Long productId) {
        return productRepository.findByIdWithCategory(productId)
            .orElseThrow(() -> new ProductNotFoundException(productId));
    }

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Page<Product> searchProducts(String keyword, Long categoryId,
                                       ProductStatus status, Pageable pageable) {
        return productRepository.searchProducts(keyword, categoryId, status, pageable);
    }

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = getProductById(productId);
        product.softDelete();

        log.info("Product deleted (soft): {}", productId);
    }
}
```

### 5. ProductController.java (Presentation Layer)

```java
package com.ecommerce.product.presentation.web;

import com.ecommerce.product.application.ProductService;
import com.ecommerce.product.domain.Product;
import com.ecommerce.product.domain.ProductStatus;
import com.ecommerce.product.dto.*;
import com.ecommerce.shared.dto.ApiResponse;
import com.ecommerce.shared.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ProductResponse> createProduct(
            @Valid @RequestBody ProductCreateRequest request) {
        Product product = productService.createProduct(
            request.getCategoryId(),
            request.getName(),
            request.getDescription(),
            request.getPrice(),
            request.getStockQuantity(),
            request.getBrand()
        );

        return ApiResponse.success(
            productMapper.toResponse(product),
            "상품이 생성되었습니다."
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ApiResponse.success(productMapper.toResponse(product));
    }

    @GetMapping
    public ApiResponse<PageResponse<ProductResponse>> getAllProducts(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<Product> products = productService.getAllProducts(pageable);
        Page<ProductResponse> responses = products.map(productMapper::toResponse);

        return ApiResponse.success(PageResponse.of(responses));
    }

    @GetMapping("/search")
    public ApiResponse<PageResponse<ProductResponse>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) ProductStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<Product> products = productService.searchProducts(
            keyword, categoryId, status, pageable
        );
        Page<ProductResponse> responses = products.map(productMapper::toResponse);

        return ApiResponse.success(PageResponse.of(responses));
    }

    @PostMapping("/{id}/publish")
    public ApiResponse<Void> publishProduct(@PathVariable Long id) {
        productService.publishProduct(id);
        return ApiResponse.success("상품이 발행되었습니다.");
    }

    @PutMapping("/{id}/price")
    public ApiResponse<Void> updatePrice(
            @PathVariable Long id,
            @Valid @RequestBody ProductPriceUpdateRequest request) {
        productService.updateProductPrice(id, request.getPrice());
        return ApiResponse.success("가격이 수정되었습니다.");
    }

    @PostMapping("/{id}/stock/increase")
    public ApiResponse<Void> increaseStock(
            @PathVariable Long id,
            @Valid @RequestBody StockAdjustmentRequest request) {
        productService.increaseStock(id, request.getQuantity());
        return ApiResponse.success("재고가 증가되었습니다.");
    }

    @PostMapping("/{id}/stock/decrease")
    public ApiResponse<Void> decreaseStock(
            @PathVariable Long id,
            @Valid @RequestBody StockAdjustmentRequest request) {
        productService.decreaseStock(id, request.getQuantity());
        return ApiResponse.success("재고가 감소되었습니다.");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.success("상품이 삭제되었습니다.");
    }
}
```

### 6. Domain Events

```java
package com.ecommerce.product.domain.event;

import com.ecommerce.shared.domain.DomainEvent;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ProductCreatedEvent implements DomainEvent {
    private final Long productId;
    private final String productName;
    private final LocalDateTime occurredOn;

    public ProductCreatedEvent(Long productId, String productName) {
        this.productId = productId;
        this.productName = productName;
        this.occurredOn = LocalDateTime.now();
    }
}

@Getter
public class ProductPublishedEvent implements DomainEvent {
    private final Long productId;
    private final String productName;
    private final LocalDateTime occurredOn;

    public ProductPublishedEvent(Long productId, String productName) {
        this.productId = productId;
        this.productName = productName;
        this.occurredOn = LocalDateTime.now();
    }
}

@Getter
public class ProductStockChangedEvent implements DomainEvent {
    private final Long productId;
    private final Integer currentStock;
    private final LocalDateTime occurredOn;

    public ProductStockChangedEvent(Long productId, Integer currentStock) {
        this.productId = productId;
        this.currentStock = currentStock;
        this.occurredOn = LocalDateTime.now();
    }
}
```

---

## Order 도메인

### 1. Order.java (Aggregate Root)

```java
package com.ecommerce.order.domain;

import com.ecommerce.shared.domain.AggregateRoot;
import com.ecommerce.order.domain.event.*;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_customer", columnList = "customer_id"),
    @Index(name = "idx_status", columnList = "order_status"),
    @Index(name = "idx_created_at", columnList = "created_at DESC")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order extends AggregateRoot {

    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal finalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private OrderStatus orderStatus;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @Embedded
    private ShippingAddress shippingAddress;

    private String orderNumber;
    private Long paymentId;
    private Long couponId;

    private LocalDateTime confirmedAt;
    private LocalDateTime cancelledAt;
    private String cancellationReason;
    private LocalDateTime completedAt;

    // Factory method
    public static Order place(Long customerId, List<OrderItem> items,
                             ShippingAddress shippingAddress) {
        validateOrderData(customerId, items, shippingAddress);

        Order order = new Order();
        order.customerId = customerId;
        order.shippingAddress = shippingAddress;
        order.orderStatus = OrderStatus.PENDING;
        order.orderNumber = generateOrderNumber();

        items.forEach(item -> item.setOrder(order));
        order.items.addAll(items);
        order.calculateTotalAmount();

        order.addDomainEvent(new OrderPlacedEvent(order.getId(), order.customerId));
        return order;
    }

    public void confirm() {
        if (this.orderStatus != OrderStatus.PENDING) {
            throw new IllegalStateException("대기 중인 주문만 확인할 수 있습니다.");
        }

        this.orderStatus = OrderStatus.CONFIRMED;
        this.confirmedAt = LocalDateTime.now();

        addDomainEvent(new OrderConfirmedEvent(this.getId(), this.customerId));
    }

    public void cancel(String reason) {
        if (!canBeCancelled()) {
            throw new IllegalStateException("이미 배송이 시작된 주문은 취소할 수 없습니다.");
        }

        this.orderStatus = OrderStatus.CANCELLED;
        this.cancelledAt = LocalDateTime.now();
        this.cancellationReason = reason;

        addDomainEvent(new OrderCancelledEvent(this.getId(), this.customerId, reason));
    }

    public void startPreparing() {
        if (this.orderStatus != OrderStatus.CONFIRMED) {
            throw new IllegalStateException("확인된 주문만 준비할 수 있습니다.");
        }

        this.orderStatus = OrderStatus.PREPARING;
    }

    public void ship() {
        if (this.orderStatus != OrderStatus.PREPARING) {
            throw new IllegalStateException("준비 중인 주문만 배송할 수 있습니다.");
        }

        this.orderStatus = OrderStatus.SHIPPED;
        addDomainEvent(new OrderShippedEvent(this.getId()));
    }

    public void deliver() {
        if (this.orderStatus != OrderStatus.SHIPPED) {
            throw new IllegalStateException("배송 중인 주문만 배송 완료할 수 있습니다.");
        }

        this.orderStatus = OrderStatus.DELIVERED;
    }

    public void complete() {
        if (this.orderStatus != OrderStatus.DELIVERED) {
            throw new IllegalStateException("배송 완료된 주문만 구매 확정할 수 있습니다.");
        }

        this.orderStatus = OrderStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();

        addDomainEvent(new OrderCompletedEvent(this.getId(), this.customerId));
    }

    public void applyCoupon(Long couponId, BigDecimal discountAmount) {
        this.couponId = couponId;
        this.discountAmount = discountAmount;
        calculateFinalAmount();
    }

    private void calculateTotalAmount() {
        this.totalAmount = items.stream()
            .map(OrderItem::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        calculateFinalAmount();
    }

    private void calculateFinalAmount() {
        this.finalAmount = this.totalAmount.subtract(this.discountAmount);
        if (this.finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            this.finalAmount = BigDecimal.ZERO;
        }
    }

    public boolean canBeCancelled() {
        return this.orderStatus == OrderStatus.PENDING ||
               this.orderStatus == OrderStatus.CONFIRMED ||
               this.orderStatus == OrderStatus.PREPARING;
    }

    private static void validateOrderData(Long customerId, List<OrderItem> items,
                                         ShippingAddress shippingAddress) {
        if (customerId == null) {
            throw new IllegalArgumentException("고객 ID는 필수입니다.");
        }
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("주문 항목이 없습니다.");
        }
        if (shippingAddress == null) {
            throw new IllegalArgumentException("배송 주소는 필수입니다.");
        }
    }

    private static String generateOrderNumber() {
        return "ORD" + System.currentTimeMillis();
    }
}
```

### 2. OrderItem.java

```java
package com.ecommerce.order.domain;

import com.ecommerce.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @Setter
    private Order order;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    public OrderItem(Long productId, String productName, Integer quantity, BigDecimal price) {
        validateOrderItem(productId, productName, quantity, price);

        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
        this.subtotal = price.multiply(BigDecimal.valueOf(quantity));
    }

    private static void validateOrderItem(Long productId, String productName,
                                         Integer quantity, BigDecimal price) {
        if (productId == null) {
            throw new IllegalArgumentException("상품 ID는 필수입니다.");
        }
        if (productName == null || productName.trim().isEmpty()) {
            throw new IllegalArgumentException("상품명은 필수입니다.");
        }
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("수량은 1 이상이어야 합니다.");
        }
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("가격은 0보다 커야 합니다.");
        }
    }
}
```

이 파일을 계속 작성하시겠습니까? 전체 구조와 핵심 패턴을 보여드렸습니다.
