# Database Schema Design

**Database**: H2 (Development), MySQL 8.0+ (Production)
**Charset**: utf8mb4
**Collation**: utf8mb4_unicode_ci

---

## ERD 개요

```
Customer (고객)
  ├─ CustomerAddress (배송지)
  ├─ Cart (장바구니)
  │   └─ CartItem (장바구니 항목)
  ├─ Order (주문)
  │   ├─ OrderItem (주문 항목)
  │   └─ Payment (결제)
  │       └─ PaymentTransaction (결제 트랜잭션)
  ├─ Review (리뷰)
  │   └─ ReviewImage (리뷰 이미지)
  └─ CouponIssue (쿠폰 발급)

Product (상품)
  ├─ ProductImage (상품 이미지)
  ├─ ProductOption (상품 옵션)
  ├─ CartItem
  ├─ OrderItem
  └─ Review

Category (카테고리)
  └─ Product

Coupon (쿠폰)
  └─ CouponIssue

Shipping (배송)
  └─ Order
```

---

## 1. Customer Domain

### 1.1 customers 테이블

```sql
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    level VARCHAR(20) NOT NULL DEFAULT 'BRONZE',
    total_purchase_amount INT NOT NULL DEFAULT 0,
    point INT NOT NULL DEFAULT 0,
    last_login_at TIMESTAMP,
    withdrawn_at TIMESTAMP,
    withdrawal_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_level (level),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**필드 설명**

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 고객 ID |
| email | VARCHAR(255) | NOT NULL, UNIQUE | 이메일 (로그인 ID) |
| password | VARCHAR(255) | NOT NULL | BCrypt 암호화 비밀번호 |
| name | VARCHAR(100) | NOT NULL | 이름 |
| phone_number | VARCHAR(20) | NULL | 전화번호 |
| status | VARCHAR(20) | NOT NULL | ACTIVE, INACTIVE, BLOCKED, WITHDRAWN |
| level | VARCHAR(20) | NOT NULL | BRONZE, SILVER, GOLD, PLATINUM, VIP |
| total_purchase_amount | INT | NOT NULL, DEFAULT 0 | 누적 구매 금액 (원) |
| point | INT | NOT NULL, DEFAULT 0 | 보유 포인트 |
| last_login_at | TIMESTAMP | NULL | 마지막 로그인 시각 |
| withdrawn_at | TIMESTAMP | NULL | 탈퇴 시각 |
| withdrawal_reason | TEXT | NULL | 탈퇴 사유 |
| created_at | TIMESTAMP | NOT NULL | 생성 시각 |
| updated_at | TIMESTAMP | NOT NULL | 수정 시각 |

**인덱스 전략**

- `idx_email`: 로그인 시 이메일로 조회 (UNIQUE)
- `idx_status`: 상태별 고객 조회
- `idx_level`: 등급별 통계/마케팅
- `idx_created_at`: 가입일 기준 정렬

### 1.2 customer_addresses 테이블

```sql
CREATE TABLE customer_addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    address VARCHAR(255) NOT NULL,
    detail_address VARCHAR(255) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer (customer_id),
    INDEX idx_default (customer_id, is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**필드 설명**

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 배송지 ID |
| customer_id | BIGINT | NOT NULL, FK | 고객 ID |
| name | VARCHAR(100) | NOT NULL | 수령인 이름 |
| phone_number | VARCHAR(20) | NOT NULL | 수령인 전화번호 |
| zip_code | VARCHAR(10) | NOT NULL | 우편번호 |
| address | VARCHAR(255) | NOT NULL | 주소 |
| detail_address | VARCHAR(255) | NOT NULL | 상세 주소 |
| is_default | BOOLEAN | NOT NULL, DEFAULT FALSE | 기본 배송지 여부 |

**비즈니스 규칙**

- 고객당 최대 10개 배송지
- 기본 배송지는 1개만 가능
- 고객 삭제 시 배송지도 함께 삭제 (CASCADE)

---

## 2. Product Domain

### 2.1 categories 테이블

```sql
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT,
    name VARCHAR(100) NOT NULL,
    path VARCHAR(500) NOT NULL,
    level INT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_parent (parent_id),
    INDEX idx_level (level),
    INDEX idx_path (path)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**계층 구조**

```
전자제품 (level=1, path="/전자제품")
 ├─ 컴퓨터 (level=2, path="/전자제품/컴퓨터")
 │   ├─ 노트북 (level=3, path="/전자제품/컴퓨터/노트북")
 │   └─ 데스크탑 (level=3, path="/전자제품/컴퓨터/데스크탑")
 └─ 스마트폰 (level=2, path="/전자제품/스마트폰")
```

**필드 설명**

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK | 카테고리 ID |
| parent_id | BIGINT | NULL, FK | 부모 카테고리 ID |
| name | VARCHAR(100) | NOT NULL | 카테고리명 |
| path | VARCHAR(500) | NOT NULL | 계층 경로 (예: "/전자제품/컴퓨터/노트북") |
| level | INT | NOT NULL | 계층 레벨 (1=최상위) |
| display_order | INT | NOT NULL | 표시 순서 |
| is_active | BOOLEAN | NOT NULL | 활성화 여부 |

### 2.2 products 테이블

```sql
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    discount_rate DECIMAL(5, 2),
    stock_quantity INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    brand VARCHAR(100),
    view_count BIGINT NOT NULL DEFAULT 0,
    sales_count BIGINT NOT NULL DEFAULT 0,
    wishlist_count BIGINT NOT NULL DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    review_count INT NOT NULL DEFAULT 0,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP,
    discontinued_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_brand (brand),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_sales_count (sales_count DESC),
    INDEX idx_average_rating (average_rating DESC),
    INDEX idx_price (price),
    FULLTEXT INDEX idx_fulltext (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**필드 설명**

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK | 상품 ID |
| category_id | BIGINT | NOT NULL, FK | 카테고리 ID |
| name | VARCHAR(255) | NOT NULL | 상품명 |
| description | TEXT | NULL | 상품 설명 (HTML/Markdown) |
| price | DECIMAL(10,2) | NOT NULL | 정가 |
| discount_price | DECIMAL(10,2) | NULL | 할인가 |
| discount_rate | DECIMAL(5,2) | NULL | 할인율 (%) |
| stock_quantity | INT | NOT NULL | 재고 수량 |
| status | VARCHAR(20) | NOT NULL | DRAFT, ACTIVE, INACTIVE, OUT_OF_STOCK, DISCONTINUED |
| brand | VARCHAR(100) | NULL | 브랜드명 |
| view_count | BIGINT | NOT NULL | 조회수 |
| sales_count | BIGINT | NOT NULL | 판매량 |
| wishlist_count | BIGINT | NOT NULL | 찜 개수 |
| average_rating | DECIMAL(3,2) | DEFAULT 0.00 | 평균 평점 (0.00-5.00) |
| review_count | INT | NOT NULL | 리뷰 개수 |
| is_deleted | BOOLEAN | NOT NULL | 삭제 여부 (소프트 삭제) |
| published_at | TIMESTAMP | NULL | 발행 시각 |
| discontinued_at | TIMESTAMP | NULL | 단종 시각 |

**인덱스 전략**

- `idx_category`: 카테고리별 상품 조회
- `idx_status`: 상태별 필터링
- `idx_brand`: 브랜드별 검색
- `idx_created_at`: 최신순 정렬
- `idx_sales_count`: 인기순 정렬
- `idx_average_rating`: 평점순 정렬
- `idx_price`: 가격순 정렬
- `idx_fulltext`: 전문 검색 (MySQL 5.7+)

**통계 필드 업데이트**

- `view_count`: 상품 조회 시 증가
- `sales_count`: 주문 완료 시 증가
- `wishlist_count`: 찜 추가/삭제 시 증감
- `average_rating`: 리뷰 작성/수정/삭제 시 재계산
- `review_count`: 리뷰 작성/삭제 시 증감

### 2.3 product_images 테이블

```sql
CREATE TABLE product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_primary (product_id, is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**비즈니스 규칙**

- 상품당 최대 10개 이미지
- 대표 이미지(is_primary=true)는 1개만 가능
- display_order로 정렬

### 2.4 product_options 테이블

```sql
CREATE TABLE product_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    value VARCHAR(50) NOT NULL,
    price_adjustment DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    UNIQUE KEY uk_product_option (product_id, name, value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**예시 데이터**

| product_id | name | value | price_adjustment | stock_quantity |
|------------|------|-------|------------------|----------------|
| 1 | 색상 | 스페이스 그레이 | 0 | 30 |
| 1 | 색상 | 실버 | 0 | 20 |
| 1 | 저장용량 | 512GB | 0 | 25 |
| 1 | 저장용량 | 1TB | 200000 | 25 |

---

## 3. Cart Domain

### 3.1 carts 테이블

```sql
CREATE TABLE carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**비즈니스 규칙**

- 고객당 1개의 장바구니
- 고객 삭제 시 장바구니도 함께 삭제

### 3.2 cart_items 테이블

```sql
CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    selected_options JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_cart (cart_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**selected_options JSON 구조**

```json
[
  {"name": "색상", "value": "스페이스 그레이"},
  {"name": "저장용량", "value": "512GB"}
]
```

**비즈니스 규칙**

- 장바구니당 최대 100개 항목
- 동일 상품+옵션 조합은 1개 항목으로 수량 증가
- price, discount_price는 장바구니 담을 때의 가격 저장

---

## 4. Order Domain

### 4.1 orders 테이블

```sql
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    order_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    -- 금액 정보
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    coupon_discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    point_discount_amount INT NOT NULL DEFAULT 0,
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    final_amount DECIMAL(10, 2) NOT NULL,

    -- 배송 정보
    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    shipping_zip_code VARCHAR(10) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    shipping_detail_address VARCHAR(255) NOT NULL,
    order_message VARCHAR(200),

    -- 결제 정보
    payment_id BIGINT,
    payment_method VARCHAR(20),

    -- 쿠폰 정보
    coupon_id BIGINT,
    used_point INT NOT NULL DEFAULT 0,

    -- 상태별 시각
    confirmed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    completed_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE RESTRICT,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE RESTRICT,
    INDEX idx_customer (customer_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (order_status),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**order_status 상태 전이**

```
PENDING (결제 대기)
  ↓
CONFIRMED (결제 완료)
  ↓
PREPARING (상품 준비중)
  ↓
SHIPPED (배송중)
  ↓
DELIVERED (배송 완료)
  ↓
COMPLETED (구매 확정)

취소/반품:
PENDING/CONFIRMED/PREPARING → CANCELLED (취소)
DELIVERED → RETURNED (반품)
```

**필드 설명**

| 필드 | 타입 | 설명 |
|------|------|------|
| order_number | VARCHAR(50) | 주문번호 (예: ORD20240115001) |
| total_amount | DECIMAL(10,2) | 상품 총액 |
| discount_amount | DECIMAL(10,2) | 상품 할인 총액 |
| coupon_discount_amount | DECIMAL(10,2) | 쿠폰 할인액 |
| point_discount_amount | INT | 포인트 사용액 |
| shipping_fee | DECIMAL(10,2) | 배송비 |
| final_amount | DECIMAL(10,2) | 최종 결제 금액 |

**금액 계산 공식**

```
final_amount = total_amount
             - discount_amount
             - coupon_discount_amount
             - point_discount_amount
             + shipping_fee
```

### 4.2 order_items 테이블

```sql
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image_url VARCHAR(500),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    subtotal DECIMAL(10, 2) NOT NULL,
    selected_options JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**비즈니스 규칙**

- 주문 시점의 상품 정보를 스냅샷으로 저장
- product_name, product_image_url 등을 별도 저장 (이력 관리)
- 상품이 삭제되어도 주문 내역은 유지

---

## 5. Payment Domain

### 5.1 payments 테이블

```sql
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    amount DECIMAL(10, 2) NOT NULL,

    -- PG사 정보
    pg_provider VARCHAR(50),
    transaction_id VARCHAR(100) UNIQUE,
    approval_number VARCHAR(100),

    -- 카드 정보 (마스킹)
    card_company VARCHAR(50),
    card_number VARCHAR(20),
    installment_months INT DEFAULT 0,

    -- 실패 정보
    failure_reason TEXT,
    failure_code VARCHAR(50),

    -- 환불 정보
    refunded_amount DECIMAL(10, 2) DEFAULT 0.00,
    refunded_at TIMESTAMP,
    refund_reason TEXT,

    -- 타임스탬프
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    failed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_customer (customer_id),
    INDEX idx_status (payment_status),
    INDEX idx_transaction (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**payment_method**

- `CARD` - 신용/체크카드
- `BANK_TRANSFER` - 계좌이체
- `VIRTUAL_ACCOUNT` - 가상계좌
- `KAKAO_PAY` - 카카오페이
- `NAVER_PAY` - 네이버페이
- `TOSS_PAY` - 토스페이

**payment_status**

- `PENDING` - 결제 대기
- `PROCESSING` - 결제 진행중
- `COMPLETED` - 결제 완료
- `FAILED` - 결제 실패
- `CANCELLED` - 결제 취소
- `REFUNDED` - 환불 완료

---

## 6. Shipping Domain

### 6.1 shippings 테이블

```sql
CREATE TABLE shippings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    tracking_number VARCHAR(50),
    shipping_company VARCHAR(50),
    shipping_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    address VARCHAR(255) NOT NULL,
    detail_address VARCHAR(255) NOT NULL,

    started_at TIMESTAMP,
    in_transit_at TIMESTAMP,
    out_for_delivery_at TIMESTAMP,
    delivered_at TIMESTAMP,
    returned_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_tracking (tracking_number),
    INDEX idx_status (shipping_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**shipping_status**

- `PENDING` - 배송 준비
- `PREPARING` - 상품 준비중
- `IN_TRANSIT` - 배송중
- `OUT_FOR_DELIVERY` - 배송 출발
- `DELIVERED` - 배송 완료
- `RETURNED` - 반품

---

## 인덱스 최적화 전략

### 1. 복합 인덱스

```sql
-- 고객의 활성 주문 조회
CREATE INDEX idx_customer_status ON orders(customer_id, order_status);

-- 카테고리별 활성 상품 조회
CREATE INDEX idx_category_status ON products(category_id, status, created_at DESC);

-- 상품의 평균 평점이 높은 순
CREATE INDEX idx_rating_review ON products(average_rating DESC, review_count DESC);
```

### 2. 파티셔닝 (대용량 데이터 시)

```sql
-- orders 테이블을 월별로 파티셔닝
ALTER TABLE orders PARTITION BY RANGE (YEAR(created_at) * 100 + MONTH(created_at)) (
    PARTITION p202401 VALUES LESS THAN (202402),
    PARTITION p202402 VALUES LESS THAN (202403),
    -- ...
);
```

### 3. 통계 테이블 (읽기 최적화)

```sql
-- 일별 판매 통계
CREATE TABLE daily_sales_stats (
    stat_date DATE PRIMARY KEY,
    total_orders INT NOT NULL DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    completed_orders INT NOT NULL DEFAULT 0,
    cancelled_orders INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 상품별 판매 통계
CREATE TABLE product_sales_stats (
    product_id BIGINT PRIMARY KEY,
    total_sales_count BIGINT NOT NULL DEFAULT 0,
    total_sales_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    last_sold_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;
```

---

## 백업 및 복구 전략

### 1. 백업 스케줄

- **Full Backup**: 매일 새벽 3시
- **Incremental Backup**: 6시간마다
- **Transaction Log**: 실시간

### 2. 보관 정책

- 최근 7일: 모든 백업 보관
- 최근 1개월: 일일 백업 보관
- 최근 1년: 주간 백업 보관

### 3. 테스트 복구

- 월 1회 백업 복구 테스트
- DR 환경에서 복구 시뮬레이션

이상으로 데이터베이스 스키마 설계가 완료되었습니다!
