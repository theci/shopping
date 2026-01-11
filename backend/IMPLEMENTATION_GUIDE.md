# E-Commerce Backend - Production-Grade DDD Implementation Guide

DDD3 패턴을 참고한 프로덕션급 이커머스 백엔드 설계 가이드

## 아키텍처 개요

```
com.ecommerce/
├── shared/                          # 공통 기반 클래스
│   ├── domain/
│   │   ├── BaseEntity.java          # ID, createdAt, updatedAt
│   │   ├── AggregateRoot.java       # 도메인 이벤트 지원
│   │   └── DomainEvent.java         # 이벤트 인터페이스
│   ├── infrastructure/
│   │   └── DomainEventPublisher.java
│   ├── dto/
│   │   ├── ApiResponse.java         # 표준 API 응답
│   │   └── PageResponse.java        # 페이징 응답
│   └── exception/
│       ├── BusinessException.java
│       └── GlobalExceptionHandler.java
│
├── product/                         # 상품 도메인
│   ├── domain/
│   │   ├── Product.java             # Aggregate Root
│   │   ├── ProductImage.java        # Entity
│   │   ├── ProductOption.java       # Entity
│   │   ├── Category.java            # Entity
│   │   ├── ProductStatus.java       # Enum
│   │   ├── ProductRepository.java   # Repository 인터페이스
│   │   └── event/
│   │       ├── ProductCreatedEvent.java
│   │       ├── ProductPublishedEvent.java
│   │       └── ProductStockChangedEvent.java
│   ├── application/
│   │   ├── ProductService.java
│   │   ├── CategoryService.java
│   │   ├── ProductMapper.java
│   │   └── ProductEventHandler.java
│   ├── infrastructure/persistence/
│   │   ├── JpaProductRepository.java
│   │   ├── ProductRepositoryImpl.java
│   │   └── JpaCategoryRepository.java
│   ├── dto/
│   │   ├── ProductCreateRequest.java
│   │   ├── ProductUpdateRequest.java
│   │   ├── ProductResponse.java
│   │   └── ProductSearchRequest.java
│   ├── presentation/web/
│   │   ├── ProductController.java
│   │   └── CategoryController.java
│   └── exception/
│       ├── ProductNotFoundException.java
│       └── InsufficientStockException.java
│
├── order/                           # 주문 도메인
│   ├── domain/
│   │   ├── Order.java               # Aggregate Root
│   │   ├── OrderItem.java           # Entity
│   │   ├── OrderStatus.java         # Enum
│   │   ├── OrderRepository.java
│   │   └── event/
│   │       ├── OrderPlacedEvent.java
│   │       ├── OrderConfirmedEvent.java
│   │       ├── OrderCancelledEvent.java
│   │       └── OrderCompletedEvent.java
│   ├── application/
│   │   ├── OrderService.java
│   │   ├── OrderMapper.java
│   │   └── OrderEventHandler.java
│   ├── infrastructure/persistence/
│   │   ├── JpaOrderRepository.java
│   │   └── OrderRepositoryImpl.java
│   ├── dto/
│   │   ├── OrderCreateRequest.java
│   │   ├── OrderResponse.java
│   │   └── OrderItemResponse.java
│   ├── presentation/web/
│   │   └── OrderController.java
│   └── exception/
│       ├── OrderNotFoundException.java
│       └── OrderCancellationException.java
│
├── cart/                            # 장바구니 도메인
│   ├── domain/
│   │   ├── Cart.java                # Aggregate Root
│   │   ├── CartItem.java            # Entity
│   │   ├── CartRepository.java
│   │   └── event/
│   │       ├── CartItemAddedEvent.java
│   │       └── CartItemRemovedEvent.java
│   ├── application/
│   │   ├── CartService.java
│   │   └── CartMapper.java
│   ├── infrastructure/persistence/
│   │   ├── JpaCartRepository.java
│   │   └── CartRepositoryImpl.java
│   ├── dto/
│   │   ├── CartItemRequest.java
│   │   └── CartResponse.java
│   └── presentation/web/
│       └── CartController.java
│
├── customer/                        # 고객 도메인
│   ├── domain/
│   │   ├── Customer.java            # Aggregate Root
│   │   ├── Address.java             # Value Object
│   │   ├── CustomerStatus.java      # Enum
│   │   ├── CustomerRepository.java
│   │   └── event/
│   │       ├── CustomerRegisteredEvent.java
│   │       └── CustomerUpdatedEvent.java
│   ├── application/
│   │   ├── CustomerService.java
│   │   └── CustomerMapper.java
│   ├── infrastructure/persistence/
│   │   ├── JpaCustomerRepository.java
│   │   └── CustomerRepositoryImpl.java
│   ├── dto/
│   │   ├── CustomerRegisterRequest.java
│   │   ├── CustomerUpdateRequest.java
│   │   └── CustomerResponse.java
│   └── presentation/web/
│       └── CustomerController.java
│
├── payment/                         # 결제 도메인
│   ├── domain/
│   │   ├── Payment.java             # Aggregate Root
│   │   ├── PaymentMethod.java       # Enum
│   │   ├── PaymentStatus.java       # Enum
│   │   ├── PaymentRepository.java
│   │   └── event/
│   │       ├── PaymentProcessedEvent.java
│   │       ├── PaymentFailedEvent.java
│   │       └── PaymentRefundedEvent.java
│   ├── application/
│   │   ├── PaymentService.java
│   │   ├── PaymentGatewayService.java (interface)
│   │   └── PaymentMapper.java
│   ├── infrastructure/
│   │   ├── persistence/
│   │   │   ├── JpaPaymentRepository.java
│   │   │   └── PaymentRepositoryImpl.java
│   │   └── gateway/
│   │       └── TossPaymentGateway.java
│   ├── dto/
│   │   ├── PaymentRequest.java
│   │   ├── PaymentResponse.java
│   │   └── RefundRequest.java
│   └── presentation/web/
│       └── PaymentController.java
│
├── shipping/                        # 배송 도메인
│   ├── domain/
│   │   ├── Shipping.java            # Aggregate Root
│   │   ├── ShippingAddress.java     # Value Object
│   │   ├── ShippingStatus.java      # Enum
│   │   ├── ShippingRepository.java
│   │   └── event/
│   │       ├── ShippingStartedEvent.java
│   │       ├── ShippingInTransitEvent.java
│   │       └── ShippingDeliveredEvent.java
│   ├── application/
│   │   ├── ShippingService.java
│   │   └── ShippingMapper.java
│   ├── infrastructure/persistence/
│   │   ├── JpaShippingRepository.java
│   │   └── ShippingRepositoryImpl.java
│   ├── dto/
│   │   ├── ShippingRequest.java
│   │   └── ShippingResponse.java
│   └── presentation/web/
│       └── ShippingController.java
│
├── review/                          # 리뷰 도메인
│   ├── domain/
│   │   ├── Review.java              # Aggregate Root
│   │   ├── ReviewImage.java         # Entity
│   │   ├── ReviewStatus.java        # Enum
│   │   ├── ReviewRepository.java
│   │   └── event/
│   │       ├── ReviewCreatedEvent.java
│   │       └── ReviewDeletedEvent.java
│   ├── application/
│   │   ├── ReviewService.java
│   │   └── ReviewMapper.java
│   ├── infrastructure/persistence/
│   │   ├── JpaReviewRepository.java
│   │   └── ReviewRepositoryImpl.java
│   ├── dto/
│   │   ├── ReviewCreateRequest.java
│   │   └── ReviewResponse.java
│   └── presentation/web/
│       └── ReviewController.java
│
└── promotion/                       # 프로모션/쿠폰 도메인
    ├── domain/
    │   ├── Coupon.java              # Aggregate Root
    │   ├── CouponIssue.java         # Entity
    │   ├── CouponType.java          # Enum
    │   ├── DiscountType.java        # Enum
    │   ├── CouponRepository.java
    │   └── event/
    │       ├── CouponIssuedEvent.java
    │       └── CouponUsedEvent.java
    ├── application/
    │   ├── CouponService.java
    │   └── CouponMapper.java
    ├── infrastructure/persistence/
    │   ├── JpaCouponRepository.java
    │   └── CouponRepositoryImpl.java
    ├── dto/
    │   ├── CouponCreateRequest.java
    │   ├── CouponResponse.java
    │   └── CouponIssueRequest.java
    └── presentation/web/
        └── CouponController.java
```

## 주요 도메인 엔티티 설계

### 1. Product (상품)

**Aggregate Root: Product**
- 속성: name, description, price, stockQuantity, status, category, brand
- 자식 Entity: ProductImage (여러 이미지), ProductOption (옵션: 색상, 사이즈 등)
- 상태: DRAFT, ACTIVE, INACTIVE, OUT_OF_STOCK, DISCONTINUED
- 도메인 메서드:
  - `publish()` - 상품 발행
  - `deactivate()` - 상품 비활성화
  - `decreaseStock(int quantity)` - 재고 감소
  - `increaseStock(int quantity)` - 재고 증가
  - `updatePrice(BigDecimal newPrice)` - 가격 변경
- 이벤트: ProductCreatedEvent, ProductPublishedEvent, ProductStockChangedEvent

### 2. Order (주문)

**Aggregate Root: Order**
- 속성: customerId, totalAmount, orderStatus, shippingAddress, paymentId
- 자식 Entity: OrderItem (주문 상품 목록)
- 상태: PENDING, CONFIRMED, PREPARING, SHIPPED, DELIVERED, CANCELLED, RETURNED
- 도메인 메서드:
  - `place()` - 주문 생성
  - `confirm()` - 주문 확인
  - `cancel(String reason)` - 주문 취소
  - `complete()` - 주문 완료
  - `calculateTotalAmount()` - 총액 계산
- 이벤트: OrderPlacedEvent, OrderConfirmedEvent, OrderCancelledEvent, OrderCompletedEvent
- 비즈니스 규칙:
  - 주문 취소는 배송 전에만 가능
  - 재고 확인 후 주문 확정
  - 결제 완료 후에만 주문 확정

### 3. Cart (장바구니)

**Aggregate Root: Cart**
- 속성: customerId, items
- 자식 Entity: CartItem (productId, quantity, price)
- 도메인 메서드:
  - `addItem(Long productId, int quantity)` - 아이템 추가
  - `removeItem(Long productId)` - 아이템 제거
  - `updateQuantity(Long productId, int quantity)` - 수량 변경
  - `clear()` - 장바구니 비우기
  - `getTotalAmount()` - 총액 계산
- 이벤트: CartItemAddedEvent, CartItemRemovedEvent

### 4. Customer (고객)

**Aggregate Root: Customer**
- 속성: email, password, name, phoneNumber, status, customerLevel
- Value Object: Address (우편번호, 주소, 상세주소)
- 상태: ACTIVE, INACTIVE, BLOCKED, WITHDRAWN
- 도메인 메서드:
  - `register()` - 회원가입
  - `updateProfile(name, phoneNumber)` - 프로필 수정
  - `addAddress(Address)` - 주소 추가
  - `withdraw(String reason)` - 회원탈퇴
- 이벤트: CustomerRegisteredEvent, CustomerUpdatedEvent, CustomerWithdrawnEvent

### 5. Payment (결제)

**Aggregate Root: Payment**
- 속성: orderId, amount, paymentMethod, status, transactionId
- 결제 수단: CARD, BANK_TRANSFER, KAKAO_PAY, NAVER_PAY, TOSS_PAY
- 상태: PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED, REFUNDED
- 도메인 메서드:
  - `process()` - 결제 처리
  - `complete()` - 결제 완료
  - `fail(String reason)` - 결제 실패
  - `refund(BigDecimal amount)` - 환불
- 이벤트: PaymentProcessedEvent, PaymentFailedEvent, PaymentRefundedEvent

### 6. Shipping (배송)

**Aggregate Root: Shipping**
- 속성: orderId, trackingNumber, shippingCompany, status, shippingAddress
- 상태: PENDING, PREPARING, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, RETURNED
- 도메인 메서드:
  - `start()` - 배송 시작
  - `updateStatus(ShippingStatus)` - 상태 업데이트
  - `complete()` - 배송 완료
- 이벤트: ShippingStartedEvent, ShippingInTransitEvent, ShippingDeliveredEvent

### 7. Review (리뷰)

**Aggregate Root: Review**
- 속성: productId, customerId, orderId, rating, content, status
- 자식 Entity: ReviewImage (리뷰 이미지)
- 상태: ACTIVE, DELETED, REPORTED, HIDDEN
- 도메인 메서드:
  - `create()` - 리뷰 작성
  - `update(rating, content)` - 리뷰 수정
  - `delete()` - 리뷰 삭제
  - `report(String reason)` - 신고
- 이벤트: ReviewCreatedEvent, ReviewDeletedEvent
- 비즈니스 규칙:
  - 구매 확정된 주문에 대해서만 리뷰 작성 가능
  - 한 주문당 하나의 리뷰만 작성 가능

### 8. Coupon (쿠폰)

**Aggregate Root: Coupon**
- 속성: name, discountType, discountValue, minOrderAmount, maxDiscountAmount, validFrom, validUntil
- 자식 Entity: CouponIssue (customerId, issuedAt, usedAt, used)
- 할인 타입: FIXED_AMOUNT, PERCENTAGE
- 쿠폰 타입: GENERAL, WELCOME, BIRTHDAY, EVENT
- 도메인 메서드:
  - `issue(Long customerId)` - 쿠폰 발급
  - `use(Long customerId)` - 쿠폰 사용
  - `calculateDiscount(BigDecimal orderAmount)` - 할인 금액 계산
- 이벤트: CouponIssuedEvent, CouponUsedEvent

## API 엔드포인트 설계

### Product API
```
POST   /api/v1/products                    # 상품 생성
GET    /api/v1/products                    # 상품 목록 조회 (페이징, 검색, 필터)
GET    /api/v1/products/{id}               # 상품 상세 조회
PUT    /api/v1/products/{id}               # 상품 수정
DELETE /api/v1/products/{id}               # 상품 삭제
POST   /api/v1/products/{id}/publish       # 상품 발행
POST   /api/v1/products/{id}/stock         # 재고 조정
GET    /api/v1/products/categories         # 카테고리 목록
```

### Order API
```
POST   /api/v1/orders                      # 주문 생성
GET    /api/v1/orders                      # 내 주문 목록
GET    /api/v1/orders/{id}                 # 주문 상세
POST   /api/v1/orders/{id}/confirm         # 주문 확인
POST   /api/v1/orders/{id}/cancel          # 주문 취소
POST   /api/v1/orders/{id}/complete        # 구매 확정
```

### Cart API
```
GET    /api/v1/carts/me                    # 내 장바구니 조회
POST   /api/v1/carts/items                 # 장바구니에 상품 추가
PUT    /api/v1/carts/items/{productId}     # 수량 변경
DELETE /api/v1/carts/items/{productId}     # 상품 제거
DELETE /api/v1/carts                       # 장바구니 비우기
```

### Customer API
```
POST   /api/v1/customers/register          # 회원가입
GET    /api/v1/customers/me                # 내 정보 조회
PUT    /api/v1/customers/me                # 내 정보 수정
POST   /api/v1/customers/me/addresses      # 배송지 추가
DELETE /api/v1/customers/me                # 회원탈퇴
```

### Payment API
```
POST   /api/v1/payments                    # 결제 요청
GET    /api/v1/payments/{id}               # 결제 조회
POST   /api/v1/payments/{id}/confirm       # 결제 확인
POST   /api/v1/payments/{id}/refund        # 환불
```

### Shipping API
```
GET    /api/v1/shippings                   # 배송 목록
GET    /api/v1/shippings/{id}              # 배송 조회
GET    /api/v1/shippings/track/{trackingNumber}  # 배송 추적
```

### Review API
```
POST   /api/v1/reviews                     # 리뷰 작성
GET    /api/v1/reviews/products/{productId} # 상품 리뷰 목록
GET    /api/v1/reviews/{id}                # 리뷰 조회
PUT    /api/v1/reviews/{id}                # 리뷰 수정
DELETE /api/v1/reviews/{id}                # 리뷰 삭제
```

### Coupon API
```
POST   /api/v1/coupons                     # 쿠폰 생성 (관리자)
GET    /api/v1/coupons/me                  # 내 쿠폰 목록
POST   /api/v1/coupons/{id}/issue          # 쿠폰 발급
POST   /api/v1/coupons/{id}/use            # 쿠폰 사용
```

## 도메인 이벤트 플로우

### 주문 플로우
```
1. Cart → Order 생성
   - CartItemAddedEvent

2. Order 생성 → Payment 요청
   - OrderPlacedEvent → PaymentService listens

3. Payment 완료 → Order 확인
   - PaymentProcessedEvent → OrderService listens
   - OrderConfirmedEvent → ProductService listens (재고 감소)

4. Order 확인 → Shipping 시작
   - OrderConfirmedEvent → ShippingService listens
   - ShippingStartedEvent

5. Shipping 완료 → Order 완료
   - ShippingDeliveredEvent → OrderService listens
   - OrderCompletedEvent → Review 가능
```

### 취소/환불 플로우
```
1. Order 취소 요청
   - OrderCancelledEvent

2. Payment 환불 처리
   - OrderCancelledEvent → PaymentService listens
   - PaymentRefundedEvent

3. 재고 복구
   - OrderCancelledEvent → ProductService listens
   - ProductStockChangedEvent
```

## 구현 우선순위

### Phase 1 (MVP)
1. ✅ Shared 기반 클래스
2. 🔄 Product 도메인
3. 🔄 Customer 도메인
4. 🔄 Cart 도메인
5. 🔄 Order 도메인
6. 🔄 Payment 도메인

### Phase 2
7. Shipping 도메인
8. Review 도메인
9. Coupon 도메인

### Phase 3 (Advanced)
10. Wishlist (찜하기)
11. Notification (알림)
12. Analytics (통계)
13. Search (검색 최적화)

## 데이터베이스 설계

### 주요 테이블

```sql
-- products
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    brand VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at DESC)
);

-- orders
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_status VARCHAR(50) NOT NULL,
    shipping_address TEXT,
    payment_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX idx_customer (customer_id),
    INDEX idx_status (order_status),
    INDEX idx_created_at (created_at DESC)
);

-- order_items
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

## 보안 고려사항

1. **인증/인가**: JWT 토큰 기반
2. **권한 관리**: CUSTOMER, SELLER, ADMIN 역할
3. **데이터 검증**: DTO 레벨 + 도메인 레벨 이중 검증
4. **결제 보안**: PCI DSS 준수, 토큰화
5. **개인정보**: 암호화 저장, GDPR 준수

## 성능 최적화

1. **N+1 방지**: JOIN FETCH 적극 활용
2. **캐싱**: Redis를 통한 상품 정보, 재고 캐싱
3. **페이징**: 커서 기반 페이징
4. **QueryDSL**: 복잡한 검색 쿼리
5. **인덱스**: 전략적 인덱스 설계

## 테스트 전략

1. **Unit Tests**: 도메인 로직 테스트
2. **Integration Tests**: Repository, API 테스트
3. **End-to-End Tests**: 전체 플로우 테스트
4. **Performance Tests**: 부하 테스트

---

이 가이드를 바탕으로 각 도메인을 구현하면 프로덕션급 이커머스 백엔드를 완성할 수 있습니다.
