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

## 구현 우선순위 및 상세 계획

### Phase 1 (MVP) - 핵심 이커머스 기능

#### 단계 1: Shared 기반 클래스 구축 ✅
**목표**: 모든 도메인에서 공통으로 사용할 기반 클래스 및 인프라 구축

**구현 파일**:
```
src/main/java/com/ecommerce/shared/
├── domain/
│   ├── BaseEntity.java              # 공통 엔티티 (id, createdAt, updatedAt)
│   ├── AggregateRoot.java           # 도메인 이벤트 발행 기능
│   └── DomainEvent.java             # 도메인 이벤트 인터페이스
├── infrastructure/
│   ├── DomainEventPublisher.java    # 이벤트 발행 구현체
│   └── EventStore.java              # 이벤트 저장소 (선택적)
├── dto/
│   ├── ApiResponse.java             # 표준 API 응답 포맷
│   ├── PageResponse.java            # 페이징 응답
│   └── ErrorResponse.java           # 에러 응답
└── exception/
    ├── BusinessException.java       # 비즈니스 예외 기본 클래스
    ├── ResourceNotFoundException.java
    ├── ValidationException.java
    └── GlobalExceptionHandler.java  # 전역 예외 처리기
```

**구현 순서**:
1. BaseEntity.java - JPA Auditing 설정
2. DomainEvent.java - 이벤트 인터페이스 정의
3. AggregateRoot.java - 이벤트 발행 로직
4. ApiResponse/PageResponse - 표준 응답 형식
5. Exception 클래스들 - 예외 계층 구조
6. GlobalExceptionHandler - Spring @ControllerAdvice
7. DomainEventPublisher - Spring ApplicationEventPublisher 활용

**검증 방법**:
- Unit Test: 각 클래스의 기본 동작 테스트
- Integration Test: 이벤트 발행/수신 테스트

**완료 조건**:
- [ ] 모든 기반 클래스 구현 완료
- [ ] Unit Test 커버리지 80% 이상
- [ ] API 응답 형식 표준화 완료

---

#### 단계 2: Product 도메인 구현
**목표**: 상품 관리 핵심 기능 (CRUD, 재고 관리, 상태 관리)

**구현 파일**:
```
src/main/java/com/ecommerce/product/
├── domain/
│   ├── Product.java                 # Aggregate Root
│   ├── ProductImage.java            # Entity
│   ├── ProductOption.java           # Entity
│   ├── Category.java                # Entity
│   ├── ProductStatus.java           # Enum
│   ├── ProductRepository.java       # Repository 인터페이스
│   └── event/
│       ├── ProductCreatedEvent.java
│       ├── ProductPublishedEvent.java
│       └── ProductStockChangedEvent.java
├── application/
│   ├── ProductService.java          # 서비스 계층
│   ├── CategoryService.java
│   ├── ProductMapper.java           # DTO <-> Entity 변환
│   └── ProductEventHandler.java     # 이벤트 핸들러
├── infrastructure/persistence/
│   ├── JpaProductRepository.java    # Spring Data JPA
│   ├── ProductRepositoryImpl.java   # Custom Repository 구현
│   └── JpaCategoryRepository.java
├── dto/
│   ├── ProductCreateRequest.java
│   ├── ProductUpdateRequest.java
│   ├── ProductResponse.java
│   └── ProductSearchRequest.java
├── presentation/web/
│   ├── ProductController.java       # REST API
│   └── CategoryController.java
└── exception/
    ├── ProductNotFoundException.java
    └── InsufficientStockException.java
```

**구현 순서**:
1. **도메인 계층** (1-2일)
   - Product 엔티티 (비즈니스 로직 포함)
   - ProductStatus Enum
   - 도메인 이벤트 정의
   - ProductRepository 인터페이스

2. **인프라 계층** (1일)
   - JpaProductRepository 구현
   - Category 관련 엔티티 및 Repository

3. **애플리케이션 계층** (1-2일)
   - ProductService (CRUD, 재고 관리)
   - ProductMapper
   - DTO 클래스들

4. **프레젠테이션 계층** (1일)
   - ProductController (REST API)
   - API 문서화 (Swagger/OpenAPI)

5. **테스트** (1일)
   - 도메인 로직 Unit Test
   - Service Integration Test
   - API E2E Test

**핵심 기능**:
- 상품 등록/수정/삭제/조회
- 상품 발행/비활성화
- 재고 증가/감소
- 카테고리별 상품 조회
- 상품 검색 및 필터링 (가격, 상태, 카테고리)
- 페이징 처리

**비즈니스 규칙**:
- 재고가 0 이하면 OUT_OF_STOCK 상태로 자동 변경
- DRAFT 상태의 상품은 고객에게 노출 안됨
- 재고 감소 시 0 미만이 되면 예외 발생

**API 엔드포인트**:
```
POST   /api/v1/products              # 상품 생성
GET    /api/v1/products              # 상품 목록 (페이징, 검색)
GET    /api/v1/products/{id}         # 상품 상세
PUT    /api/v1/products/{id}         # 상품 수정
DELETE /api/v1/products/{id}         # 상품 삭제
PATCH  /api/v1/products/{id}/publish # 상품 발행
PATCH  /api/v1/products/{id}/stock   # 재고 조정
GET    /api/v1/categories            # 카테고리 목록
```

**데이터베이스 스키마**:
```sql
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
    INDEX idx_name (name)
);

CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    parent_id BIGINT,
    display_order INT,
    created_at TIMESTAMP
);

CREATE TABLE product_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

**완료 조건**:
- [ ] 모든 CRUD API 동작
- [ ] 재고 관리 로직 정상 작동
- [ ] 도메인 이벤트 발행 확인
- [ ] 통합 테스트 통과
- [ ] API 문서 작성 완료

---

#### 단계 3: Customer 도메인 구현
**목표**: 고객 관리 및 인증/인가 기능

**구현 파일**:
```
src/main/java/com/ecommerce/customer/
├── domain/
│   ├── Customer.java                # Aggregate Root
│   ├── Address.java                 # Value Object
│   ├── CustomerStatus.java          # Enum
│   ├── CustomerLevel.java           # Enum (BRONZE, SILVER, GOLD)
│   ├── CustomerRepository.java
│   └── event/
│       ├── CustomerRegisteredEvent.java
│       ├── CustomerUpdatedEvent.java
│       └── CustomerWithdrawnEvent.java
├── application/
│   ├── CustomerService.java
│   ├── AuthService.java             # 인증 서비스
│   ├── CustomerMapper.java
│   └── CustomerEventHandler.java
├── infrastructure/
│   ├── persistence/
│   │   ├── JpaCustomerRepository.java
│   │   └── CustomerRepositoryImpl.java
│   └── security/
│       ├── JwtTokenProvider.java
│       └── SecurityConfig.java
├── dto/
│   ├── CustomerRegisterRequest.java
│   ├── CustomerUpdateRequest.java
│   ├── CustomerResponse.java
│   ├── LoginRequest.java
│   └── LoginResponse.java
├── presentation/web/
│   ├── CustomerController.java
│   └── AuthController.java
└── exception/
    ├── CustomerNotFoundException.java
    ├── DuplicateEmailException.java
    └── InvalidCredentialsException.java
```

**구현 순서**:
1. **도메인 계층** (1일)
   - Customer 엔티티
   - Address Value Object
   - CustomerStatus, CustomerLevel Enum
   - 도메인 이벤트

2. **보안 설정** (1-2일)
   - Spring Security 설정
   - JWT 토큰 생성/검증
   - Password 암호화 (BCrypt)
   - 인증/인가 필터

3. **애플리케이션 계층** (1일)
   - CustomerService
   - AuthService (로그인, JWT 발급)
   - DTO 및 Mapper

4. **프레젠테이션 계층** (1일)
   - CustomerController
   - AuthController
   - 권한 기반 접근 제어

5. **테스트** (1일)
   - 회원가입/로그인 테스트
   - JWT 인증 테스트
   - 권한 검증 테스트

**핵심 기능**:
- 회원가입 (이메일 중복 체크)
- 로그인 (JWT 발급)
- 내 정보 조회/수정
- 배송지 관리 (추가/수정/삭제)
- 회원탈퇴
- 고객 등급 관리

**비즈니스 규칙**:
- 이메일은 unique, 중복 불가
- 비밀번호는 BCrypt로 암호화
- 회원탈퇴 시 상태만 WITHDRAWN으로 변경 (Soft Delete)
- JWT 토큰 유효기간: 1시간
- Refresh Token 유효기간: 7일

**API 엔드포인트**:
```
POST   /api/v1/auth/register          # 회원가입
POST   /api/v1/auth/login             # 로그인
POST   /api/v1/auth/refresh           # 토큰 갱신
GET    /api/v1/customers/me           # 내 정보 조회
PUT    /api/v1/customers/me           # 내 정보 수정
POST   /api/v1/customers/me/addresses # 배송지 추가
DELETE /api/v1/customers/me           # 회원탈퇴
```

**데이터베이스 스키마**:
```sql
CREATE TABLE customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    status VARCHAR(50) NOT NULL,
    customer_level VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX idx_email (email)
);

CREATE TABLE addresses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    recipient_name VARCHAR(100),
    phone_number VARCHAR(20),
    postal_code VARCHAR(10),
    address VARCHAR(255),
    address_detail VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

**완료 조건**:
- [ ] 회원가입/로그인 정상 작동
- [ ] JWT 인증/인가 동작
- [ ] 배송지 CRUD 완료
- [ ] 보안 테스트 통과
- [ ] API 문서 작성 완료

---

#### 단계 4: Cart 도메인 구현
**목표**: 장바구니 기능 (상품 추가/수정/삭제, 총액 계산)

**구현 파일**:
```
src/main/java/com/ecommerce/cart/
├── domain/
│   ├── Cart.java                    # Aggregate Root
│   ├── CartItem.java                # Entity
│   ├── CartRepository.java
│   └── event/
│       ├── CartItemAddedEvent.java
│       ├── CartItemRemovedEvent.java
│       └── CartItemQuantityChangedEvent.java
├── application/
│   ├── CartService.java
│   ├── CartMapper.java
│   └── CartEventHandler.java
├── infrastructure/persistence/
│   ├── JpaCartRepository.java
│   └── CartRepositoryImpl.java
├── dto/
│   ├── CartItemRequest.java
│   ├── CartResponse.java
│   └── CartItemResponse.java
├── presentation/web/
│   └── CartController.java
└── exception/
    ├── CartNotFoundException.java
    └── CartItemNotFoundException.java
```

**구현 순서**:
1. **도메인 계층** (0.5일)
   - Cart 엔티티 (총액 계산 로직)
   - CartItem 엔티티
   - 도메인 이벤트

2. **애플리케이션 계층** (0.5일)
   - CartService
   - Product 재고 확인 로직
   - DTO 및 Mapper

3. **프레젠테이션 계층** (0.5일)
   - CartController
   - 인증된 사용자의 장바구니만 접근

4. **테스트** (0.5일)
   - 장바구니 CRUD 테스트
   - 재고 검증 테스트

**핵심 기능**:
- 장바구니에 상품 추가
- 수량 변경
- 상품 제거
- 장바구니 비우기
- 총액 계산 (실시간 가격 반영)
- 재고 확인

**비즈니스 규칙**:
- 한 고객당 하나의 장바구니
- 재고 부족 시 추가 불가
- 장바구니 아이템 추가 시 상품 현재 가격으로 저장
- 동일 상품 추가 시 수량만 증가

**API 엔드포인트**:
```
GET    /api/v1/carts/me               # 내 장바구니 조회
POST   /api/v1/carts/items            # 상품 추가
PUT    /api/v1/carts/items/{itemId}   # 수량 변경
DELETE /api/v1/carts/items/{itemId}   # 상품 제거
DELETE /api/v1/carts/me                # 장바구니 비우기
```

**데이터베이스 스키마**:
```sql
CREATE TABLE carts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id),
    UNIQUE KEY uk_cart_product (cart_id, product_id)
);
```

**완료 조건**:
- [ ] 장바구니 CRUD 완료
- [ ] 재고 검증 로직 동작
- [ ] 총액 계산 정확성 검증
- [ ] 통합 테스트 통과

---

#### 단계 5: Order 도메인 구현
**목표**: 주문 생성 및 상태 관리 (취소, 확인, 완료)

**구현 파일**:
```
src/main/java/com/ecommerce/order/
├── domain/
│   ├── Order.java                   # Aggregate Root
│   ├── OrderItem.java               # Entity
│   ├── OrderStatus.java             # Enum
│   ├── OrderRepository.java
│   └── event/
│       ├── OrderPlacedEvent.java
│       ├── OrderConfirmedEvent.java
│       ├── OrderCancelledEvent.java
│       └── OrderCompletedEvent.java
├── application/
│   ├── OrderService.java
│   ├── OrderMapper.java
│   ├── OrderEventHandler.java       # 다른 도메인 이벤트 수신
│   └── OrderFacadeService.java      # 주문 프로세스 오케스트레이션
├── infrastructure/persistence/
│   ├── JpaOrderRepository.java
│   └── OrderRepositoryImpl.java
├── dto/
│   ├── OrderCreateRequest.java
│   ├── OrderResponse.java
│   ├── OrderItemResponse.java
│   └── OrderSearchRequest.java
├── presentation/web/
│   └── OrderController.java
└── exception/
    ├── OrderNotFoundException.java
    ├── OrderCancellationException.java
    └── InvalidOrderStatusException.java
```

**구현 순서**:
1. **도메인 계층** (1일)
   - Order 엔티티 (상태 전이 로직)
   - OrderItem 엔티티
   - OrderStatus Enum
   - 도메인 이벤트

2. **애플리케이션 계층** (1-2일)
   - OrderService (기본 CRUD)
   - OrderFacadeService (장바구니 → 주문 변환)
   - OrderEventHandler (재고 감소, 결제 연동)
   - DTO 및 Mapper

3. **프레젠테이션 계층** (0.5일)
   - OrderController
   - 주문 상태별 조회 API

4. **이벤트 통합** (1일)
   - Product 도메인과 재고 연동
   - Payment 도메인과 결제 연동

5. **테스트** (1일)
   - 주문 생성 플로우 테스트
   - 상태 전이 테스트
   - 재고 감소 검증
   - 취소/환불 플로우 테스트

**핵심 기능**:
- 장바구니에서 주문 생성
- 주문 상세 조회
- 주문 목록 조회 (페이징, 필터링)
- 주문 확인
- 주문 취소 (배송 전)
- 구매 확정
- 주문 상태 추적

**비즈니스 규칙**:
- 주문 생성 시 재고 확인
- 결제 완료 후 주문 확인
- 배송 시작 전에만 취소 가능
- 취소 시 재고 복구
- 구매 확정 후 리뷰 작성 가능

**주문 상태 전이**:
```
PENDING → CONFIRMED → PREPARING → SHIPPED → DELIVERED → COMPLETED
           ↓
        CANCELLED (배송 전에만)
```

**API 엔드포인트**:
```
POST   /api/v1/orders                 # 주문 생성
GET    /api/v1/orders                 # 내 주문 목록
GET    /api/v1/orders/{id}            # 주문 상세
POST   /api/v1/orders/{id}/confirm    # 주문 확인
POST   /api/v1/orders/{id}/cancel     # 주문 취소
POST   /api/v1/orders/{id}/complete   # 구매 확정
```

**데이터베이스 스키마**:
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_status VARCHAR(50) NOT NULL,
    recipient_name VARCHAR(100),
    recipient_phone VARCHAR(20),
    shipping_postal_code VARCHAR(10),
    shipping_address VARCHAR(255),
    shipping_address_detail VARCHAR(255),
    payment_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX idx_customer (customer_id),
    INDEX idx_status (order_status),
    INDEX idx_created_at (created_at DESC)
);

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

**완료 조건**:
- [ ] 주문 생성 플로우 완료
- [ ] 재고 연동 정상 작동
- [ ] 상태 전이 로직 동작
- [ ] 취소 및 재고 복구 검증
- [ ] 통합 테스트 통과

---

#### 단계 6: Payment 도메인 구현
**목표**: 결제 처리 및 PG사 연동 (Toss Payments)

**구현 파일**:
```
src/main/java/com/ecommerce/payment/
├── domain/
│   ├── Payment.java                 # Aggregate Root
│   ├── PaymentMethod.java           # Enum
│   ├── PaymentStatus.java           # Enum
│   ├── PaymentRepository.java
│   ├── PaymentGateway.java          # 인터페이스
│   └── event/
│       ├── PaymentProcessedEvent.java
│       ├── PaymentCompletedEvent.java
│       ├── PaymentFailedEvent.java
│       └── PaymentRefundedEvent.java
├── application/
│   ├── PaymentService.java
│   ├── PaymentMapper.java
│   └── PaymentEventHandler.java
├── infrastructure/
│   ├── persistence/
│   │   ├── JpaPaymentRepository.java
│   │   └── PaymentRepositoryImpl.java
│   └── gateway/
│       ├── TossPaymentGateway.java  # Toss Payments 구현
│       └── PaymentGatewayConfig.java
├── dto/
│   ├── PaymentRequest.java
│   ├── PaymentResponse.java
│   ├── PaymentConfirmRequest.java
│   └── RefundRequest.java
├── presentation/web/
│   └── PaymentController.java
└── exception/
    ├── PaymentNotFoundException.java
    ├── PaymentProcessingException.java
    └── PaymentRefundException.java
```

**구현 순서**:
1. **도메인 계층** (1일)
   - Payment 엔티티
   - PaymentMethod, PaymentStatus Enum
   - PaymentGateway 인터페이스
   - 도메인 이벤트

2. **PG사 연동** (2일)
   - Toss Payments API 연동
   - 결제 요청/승인/취소 구현
   - Webhook 처리

3. **애플리케이션 계층** (1일)
   - PaymentService
   - PaymentEventHandler (주문 연동)
   - DTO 및 Mapper

4. **프레젠테이션 계층** (1일)
   - PaymentController
   - Webhook 엔드포인트

5. **테스트** (1일)
   - Mock을 이용한 결제 테스트
   - 환불 플로우 테스트
   - Webhook 테스트

**핵심 기능**:
- 결제 요청 (주문 기반)
- 결제 승인
- 결제 실패 처리
- 환불 처리
- 결제 내역 조회
- Webhook을 통한 결제 상태 동기화

**비즈니스 규칙**:
- 주문 생성 후 결제 진행
- 결제 완료 후 주문 확인
- 결제 실패 시 주문 취소
- 환불 시 주문 취소 및 재고 복구
- 결제 금액과 주문 금액 일치 검증

**결제 플로우**:
```
1. 클라이언트 → 결제 요청
2. Backend → Toss Payments 결제창 URL 발급
3. 클라이언트 → Toss Payments 결제 진행
4. Toss Payments → Backend Webhook (결제 완료)
5. Backend → 결제 승인 API 호출
6. Backend → 주문 확인 (OrderConfirmedEvent 발행)
```

**API 엔드포인트**:
```
POST   /api/v1/payments               # 결제 요청
GET    /api/v1/payments/{id}          # 결제 조회
POST   /api/v1/payments/{id}/confirm  # 결제 승인
POST   /api/v1/payments/{id}/refund   # 환불
POST   /api/v1/payments/webhook       # PG사 Webhook
```

**데이터베이스 스키마**:
```sql
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    pg_provider VARCHAR(50),
    pg_transaction_id VARCHAR(255),
    failed_reason TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX idx_order (order_id),
    INDEX idx_status (payment_status)
);

CREATE TABLE payment_refunds (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    payment_id BIGINT NOT NULL,
    refund_amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    refunded_at TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id)
);
```

**완료 조건**:
- [ ] Toss Payments 연동 완료
- [ ] 결제/환불 플로우 동작
- [ ] Webhook 처리 정상 작동
- [ ] 주문과 결제 연동 검증
- [ ] 통합 테스트 통과

---

### Phase 2 - 배송 및 고객 피드백

#### 단계 7: Shipping 도메인 구현
**목표**: 배송 상태 관리 및 추적

**구현 파일**:
```
src/main/java/com/ecommerce/shipping/
├── domain/
│   ├── Shipping.java                # Aggregate Root
│   ├── ShippingAddress.java         # Value Object
│   ├── ShippingStatus.java          # Enum
│   ├── ShippingRepository.java
│   └── event/
│       ├── ShippingStartedEvent.java
│       ├── ShippingInTransitEvent.java
│       ├── ShippingOutForDeliveryEvent.java
│       └── ShippingDeliveredEvent.java
├── application/
│   ├── ShippingService.java
│   ├── ShippingMapper.java
│   └── ShippingEventHandler.java
├── infrastructure/persistence/
│   ├── JpaShippingRepository.java
│   └── ShippingRepositoryImpl.java
├── dto/
│   ├── ShippingRequest.java
│   ├── ShippingResponse.java
│   └── ShippingStatusUpdateRequest.java
├── presentation/web/
│   └── ShippingController.java
└── exception/
    └── ShippingNotFoundException.java
```

**구현 순서**:
1. **도메인 계층** (0.5일)
   - Shipping 엔티티
   - ShippingStatus Enum
   - 도메인 이벤트

2. **애플리케이션 계층** (1일)
   - ShippingService
   - ShippingEventHandler (주문 확인 시 배송 생성)
   - DTO 및 Mapper

3. **프레젠테이션 계층** (0.5일)
   - ShippingController
   - 배송 추적 API

4. **테스트** (0.5일)
   - 배송 생성/상태 변경 테스트
   - 주문과 배송 연동 테스트

**핵심 기능**:
- 주문 확인 시 배송 자동 생성
- 배송 상태 업데이트
- 배송 추적 (송장 번호 조회)
- 배송 완료 처리

**비즈니스 규칙**:
- 주문 확인 후 배송 시작
- 배송 완료 후 주문 DELIVERED 상태로 변경
- 배송 시작 후에는 주문 취소 불가

**API 엔드포인트**:
```
GET    /api/v1/shippings              # 배송 목록
GET    /api/v1/shippings/{id}         # 배송 조회
GET    /api/v1/shippings/track/{trackingNumber}  # 송장 조회
PATCH  /api/v1/shippings/{id}/status  # 배송 상태 업데이트 (관리자)
```

**완료 조건**:
- [ ] 배송 CRUD 완료
- [ ] 주문 연동 정상 작동
- [ ] 배송 추적 기능 동작
- [ ] 통합 테스트 통과

---

#### 단계 8: Review 도메인 구현
**목표**: 상품 리뷰 작성 및 관리

**구현 파일**:
```
src/main/java/com/ecommerce/review/
├── domain/
│   ├── Review.java                  # Aggregate Root
│   ├── ReviewImage.java             # Entity
│   ├── ReviewStatus.java            # Enum
│   ├── ReviewRepository.java
│   └── event/
│       ├── ReviewCreatedEvent.java
│       └── ReviewDeletedEvent.java
├── application/
│   ├── ReviewService.java
│   ├── ReviewMapper.java
│   └── ReviewEventHandler.java
├── infrastructure/persistence/
│   ├── JpaReviewRepository.java
│   └── ReviewRepositoryImpl.java
├── dto/
│   ├── ReviewCreateRequest.java
│   ├── ReviewUpdateRequest.java
│   └── ReviewResponse.java
├── presentation/web/
│   └── ReviewController.java
└── exception/
    ├── ReviewNotFoundException.java
    └── ReviewNotAllowedException.java
```

**구현 순서**:
1. **도메인 계층** (0.5일)
   - Review 엔티티
   - ReviewImage 엔티티
   - 도메인 이벤트

2. **애플리케이션 계층** (1일)
   - ReviewService (구매 확정 검증)
   - 상품별 평균 평점 계산
   - DTO 및 Mapper

3. **프레젠테이션 계층** (0.5일)
   - ReviewController
   - 이미지 업로드 처리

4. **테스트** (0.5일)
   - 리뷰 CRUD 테스트
   - 구매 확정 검증 테스트

**핵심 기능**:
- 리뷰 작성 (구매 확정 후)
- 리뷰 수정/삭제
- 상품별 리뷰 목록 조회
- 평점별 필터링
- 리뷰 신고

**비즈니스 규칙**:
- 구매 확정된 주문만 리뷰 작성 가능
- 한 주문당 하나의 리뷰만 작성
- 본인 리뷰만 수정/삭제 가능

**API 엔드포인트**:
```
POST   /api/v1/reviews                # 리뷰 작성
GET    /api/v1/reviews/products/{id}  # 상품 리뷰 목록
GET    /api/v1/reviews/{id}           # 리뷰 조회
PUT    /api/v1/reviews/{id}           # 리뷰 수정
DELETE /api/v1/reviews/{id}           # 리뷰 삭제
```

**완료 조건**:
- [ ] 리뷰 CRUD 완료
- [ ] 구매 확정 검증 로직 동작
- [ ] 평점 계산 정확성 검증
- [ ] 통합 테스트 통과

---

#### 단계 9: Coupon 도메인 구현
**목표**: 쿠폰 발급 및 사용 관리

**구현 파일**:
```
src/main/java/com/ecommerce/promotion/
├── domain/
│   ├── Coupon.java                  # Aggregate Root
│   ├── CouponIssue.java             # Entity
│   ├── CouponType.java              # Enum
│   ├── DiscountType.java            # Enum
│   ├── CouponRepository.java
│   └── event/
│       ├── CouponCreatedEvent.java
│       ├── CouponIssuedEvent.java
│       └── CouponUsedEvent.java
├── application/
│   ├── CouponService.java
│   ├── CouponMapper.java
│   └── CouponEventHandler.java
├── infrastructure/persistence/
│   ├── JpaCouponRepository.java
│   └── CouponRepositoryImpl.java
├── dto/
│   ├── CouponCreateRequest.java
│   ├── CouponResponse.java
│   ├── CouponIssueRequest.java
│   └── CouponDiscountResponse.java
├── presentation/web/
│   └── CouponController.java
└── exception/
    ├── CouponNotFoundException.java
    ├── CouponExpiredException.java
    └── CouponAlreadyUsedException.java
```

**구현 순서**:
1. **도메인 계층** (1일)
   - Coupon 엔티티
   - CouponIssue 엔티티
   - 할인 계산 로직
   - 도메인 이벤트

2. **애플리케이션 계층** (1일)
   - CouponService
   - 주문에서 쿠폰 적용 로직
   - DTO 및 Mapper

3. **프레젠테이션 계층** (0.5일)
   - CouponController

4. **주문 연동** (0.5일)
   - Order 생성 시 쿠폰 적용

5. **테스트** (0.5일)
   - 쿠폰 발급/사용 테스트
   - 할인 계산 테스트

**핵심 기능**:
- 쿠폰 생성 (관리자)
- 쿠폰 발급 (고객에게)
- 내 쿠폰 목록 조회
- 쿠폰 사용 (주문 시)
- 할인 금액 계산
- 쿠폰 유효성 검증

**비즈니스 규칙**:
- 유효기간 내에만 사용 가능
- 최소 주문 금액 충족 필요
- 최대 할인 금액 제한
- 한 번만 사용 가능
- 중복 사용 불가

**쿠폰 타입**:
- FIXED_AMOUNT: 정액 할인 (예: 5,000원)
- PERCENTAGE: 정률 할인 (예: 10%)

**API 엔드포인트**:
```
POST   /api/v1/coupons                # 쿠폰 생성 (관리자)
GET    /api/v1/coupons/me             # 내 쿠폰 목록
POST   /api/v1/coupons/{id}/issue     # 쿠폰 발급
POST   /api/v1/coupons/validate       # 쿠폰 유효성 검증
GET    /api/v1/coupons/{id}/discount  # 할인 금액 계산
```

**완료 조건**:
- [ ] 쿠폰 CRUD 완료
- [ ] 할인 계산 로직 정상 작동
- [ ] 주문 연동 완료
- [ ] 유효성 검증 동작
- [ ] 통합 테스트 통과

---

### Phase 3 (Advanced) - 고급 기능

#### 단계 10: Wishlist 도메인 구현
**목표**: 찜하기 기능

**구현 파일**:
```
src/main/java/com/ecommerce/wishlist/
├── domain/
│   ├── Wishlist.java                # Aggregate Root
│   ├── WishlistItem.java            # Entity
│   └── WishlistRepository.java
├── application/
│   ├── WishlistService.java
│   └── WishlistMapper.java
├── infrastructure/persistence/
│   ├── JpaWishlistRepository.java
│   └── WishlistRepositoryImpl.java
├── dto/
│   ├── WishlistItemRequest.java
│   └── WishlistResponse.java
└── presentation/web/
    └── WishlistController.java
```

**핵심 기능**:
- 상품 찜하기 추가/삭제
- 찜 목록 조회
- 찜한 상품 재고 알림 설정

**API 엔드포인트**:
```
GET    /api/v1/wishlists/me           # 내 찜 목록
POST   /api/v1/wishlists/items        # 상품 찜하기
DELETE /api/v1/wishlists/items/{id}   # 찜 삭제
```

**완료 조건**:
- [ ] 찜하기 CRUD 완료
- [ ] 통합 테스트 통과

---

#### 단계 11: Notification 도메인 구현
**목표**: 알림 시스템 (이메일, SMS, 푸시)

**구현 파일**:
```
src/main/java/com/ecommerce/notification/
├── domain/
│   ├── Notification.java            # Aggregate Root
│   ├── NotificationType.java        # Enum
│   ├── NotificationChannel.java     # Enum (EMAIL, SMS, PUSH)
│   └── NotificationRepository.java
├── application/
│   ├── NotificationService.java
│   ├── EmailService.java
│   ├── SmsService.java
│   └── NotificationEventHandler.java
├── infrastructure/
│   ├── persistence/JpaNotificationRepository.java
│   ├── email/EmailSender.java
│   └── sms/SmsSender.java
└── dto/
    └── NotificationResponse.java
```

**핵심 기능**:
- 주문 확인 알림
- 배송 시작 알림
- 배송 완료 알림
- 쿠폰 발급 알림
- 재고 입고 알림

**이벤트 리스너**:
- OrderConfirmedEvent → 주문 확인 이메일
- ShippingStartedEvent → 배송 시작 SMS
- ShippingDeliveredEvent → 배송 완료 알림

**완료 조건**:
- [ ] 이메일 발송 완료
- [ ] 이벤트 기반 알림 동작
- [ ] 알림 내역 조회 기능

---

#### 단계 12: Analytics 도메인 구현
**목표**: 통계 및 대시보드 데이터

**구현 파일**:
```
src/main/java/com/ecommerce/analytics/
├── application/
│   ├── AnalyticsService.java
│   ├── SalesAnalyticsService.java
│   └── ProductAnalyticsService.java
├── dto/
│   ├── SalesStatisticsResponse.java
│   ├── ProductRankingResponse.java
│   └── CustomerStatisticsResponse.java
└── presentation/web/
    └── AnalyticsController.java
```

**핵심 기능**:
- 일별/월별 매출 통계
- 베스트셀러 상품
- 카테고리별 판매 분석
- 고객 구매 패턴 분석
- 리뷰 평점 통계

**API 엔드포인트**:
```
GET /api/v1/analytics/sales/daily     # 일별 매출
GET /api/v1/analytics/sales/monthly   # 월별 매출
GET /api/v1/analytics/products/best-sellers  # 베스트셀러
GET /api/v1/analytics/customers/statistics   # 고객 통계
```

**완료 조건**:
- [ ] 통계 쿼리 최적화
- [ ] 대시보드 API 완료
- [ ] 성능 테스트 통과

---

#### 단계 13: Search 최적화 구현
**목표**: 전문 검색 엔진 연동 (Elasticsearch)

**구현 파일**:
```
src/main/java/com/ecommerce/search/
├── domain/
│   ├── ProductDocument.java         # Elasticsearch Document
│   └── ProductSearchRepository.java
├── application/
│   ├── SearchService.java
│   └── SearchSyncService.java       # DB → ES 동기화
├── infrastructure/
│   ├── ElasticsearchConfig.java
│   └── ProductSearchRepositoryImpl.java
├── dto/
│   ├── SearchRequest.java
│   └── SearchResponse.java
└── presentation/web/
    └── SearchController.java
```

**핵심 기능**:
- 상품명 전문 검색
- 자동완성
- 검색어 하이라이팅
- 필터링 (가격, 카테고리, 평점)
- 정렬 (인기순, 가격순, 평점순)
- 검색어 추천

**이벤트 동기화**:
- ProductCreatedEvent → ES 인덱싱
- ProductUpdatedEvent → ES 업데이트
- ProductDeletedEvent → ES 삭제

**API 엔드포인트**:
```
GET /api/v1/search/products           # 상품 검색
GET /api/v1/search/autocomplete       # 자동완성
GET /api/v1/search/suggestions        # 검색어 추천
```

**완료 조건**:
- [ ] Elasticsearch 연동 완료
- [ ] 실시간 동기화 동작
- [ ] 검색 성능 최적화
- [ ] 통합 테스트 통과

---

## 전체 구현 타임라인 (예상)

**Phase 1 (MVP)**: 약 3-4주
- 단계 1: 2일
- 단계 2: 5일
- 단계 3: 5일
- 단계 4: 2일
- 단계 5: 5일
- 단계 6: 5일

**Phase 2**: 약 1-2주
- 단계 7: 2-3일
- 단계 8: 2-3일
- 단계 9: 3-4일

**Phase 3 (Advanced)**: 약 1-2주
- 단계 10: 1-2일
- 단계 11: 3-4일
- 단계 12: 2-3일
- 단계 13: 4-5일

**총 예상 기간**: 6-8주

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
