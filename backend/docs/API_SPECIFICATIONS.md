# E-Commerce API Specifications

**Version**: 1.0.0
**Base URL**: `http://localhost:8080/api/v1`
**Authentication**: JWT Bearer Token

---

## 목차

1. [인증 API](#1-인증-api)
2. [고객 API](#2-고객-api)
3. [상품 API](#3-상품-api)
4. [카테고리 API](#4-카테고리-api)
5. [장바구니 API](#5-장바구니-api)
6. [주문 API](#6-주문-api)
7. [결제 API](#7-결제-api)
8. [배송 API](#8-배송-api)
9. [리뷰 API](#9-리뷰-api)
10. [쿠폰 API](#10-쿠폰-api)

---

## 공통 사항

### 응답 형식

#### 성공 응답
```json
{
  "success": true,
  "data": { /* 응답 데이터 */ },
  "message": "작업이 완료되었습니다.",
  "timestamp": "2024-01-15T10:30:00"
}
```

#### 에러 응답
```json
{
  "success": false,
  "message": "에러 메시지",
  "errorCode": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00"
}
```

### 에러 코드

| 코드 | HTTP Status | 설명 |
|------|-------------|------|
| RESOURCE_NOT_FOUND | 404 | 리소스를 찾을 수 없음 |
| DUPLICATE_RESOURCE | 400 | 리소스가 이미 존재함 |
| UNAUTHORIZED | 401 | 인증 실패 |
| FORBIDDEN | 403 | 권한 없음 |
| VALIDATION_ERROR | 400 | 입력값 검증 실패 |
| INSUFFICIENT_STOCK | 400 | 재고 부족 |
| INVALID_ORDER_STATUS | 400 | 주문 상태 오류 |
| PAYMENT_FAILED | 400 | 결제 실패 |
| INTERNAL_SERVER_ERROR | 500 | 서버 내부 오류 |

### 페이징 응답

```json
{
  "success": true,
  "data": {
    "content": [ /* 데이터 배열 */ ],
    "pageNumber": 0,
    "pageSize": 20,
    "totalElements": 100,
    "totalPages": 5,
    "first": true,
    "last": false
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

### 페이징 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| page | integer | 0 | 페이지 번호 (0부터 시작) |
| size | integer | 20 | 페이지 크기 |
| sort | string | - | 정렬 (예: "createdAt,desc") |

---

## 3. 상품 API

### 3.1 상품 목록 조회

**GET** `/products`

상품 목록을 페이징하여 조회합니다.

#### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| page | integer | X | 0 | 페이지 번호 |
| size | integer | X | 20 | 페이지 크기 (최대 100) |
| sort | string | X | "createdAt,desc" | 정렬 기준 |
| categoryId | long | X | - | 카테고리 ID |
| status | string | X | ACTIVE | 상품 상태 (ACTIVE, OUT_OF_STOCK) |
| minPrice | decimal | X | - | 최소 가격 |
| maxPrice | decimal | X | - | 최대 가격 |
| brand | string | X | - | 브랜드명 |

#### Response (200)

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "맥북 프로 16인치",
        "description": "M3 Pro 칩 탑재",
        "price": 3590000,
        "discountPrice": null,
        "discountRate": null,
        "stockQuantity": 50,
        "status": "ACTIVE",
        "brand": "Apple",
        "category": {
          "id": 1,
          "name": "노트북",
          "path": "전자제품 > 컴퓨터 > 노트북"
        },
        "images": [
          {
            "id": 1,
            "imageUrl": "https://cdn.example.com/products/1/main.jpg",
            "isPrimary": true,
            "displayOrder": 0
          },
          {
            "id": 2,
            "imageUrl": "https://cdn.example.com/products/1/sub1.jpg",
            "isPrimary": false,
            "displayOrder": 1
          }
        ],
        "averageRating": 4.8,
        "reviewCount": 245,
        "viewCount": 12560,
        "salesCount": 89,
        "createdAt": "2024-01-01T00:00:00",
        "publishedAt": "2024-01-02T10:00:00"
      }
    ],
    "pageNumber": 0,
    "pageSize": 20,
    "totalElements": 150,
    "totalPages": 8,
    "first": true,
    "last": false
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

#### 정렬 옵션

- `createdAt,desc` - 최신순 (기본값)
- `createdAt,asc` - 오래된순
- `price,asc` - 낮은 가격순
- `price,desc` - 높은 가격순
- `salesCount,desc` - 판매량 높은순
- `averageRating,desc` - 평점 높은순
- `viewCount,desc` - 조회수 높은순

### 3.2 상품 검색

**GET** `/products/search`

키워드로 상품을 검색합니다.

#### Query Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| keyword | string | O | 검색 키워드 (2자 이상) |
| searchType | string | X | 검색 타입 (ALL, NAME, DESCRIPTION) |
| categoryId | long | X | 카테고리 필터 |
| minPrice | decimal | X | 최소 가격 |
| maxPrice | decimal | X | 최대 가격 |
| page | integer | X | 페이지 번호 |
| size | integer | X | 페이지 크기 |
| sort | string | X | 정렬 기준 |

#### Response (200)

동일한 페이징 응답 형식

#### 검색 로직

1. **searchType=ALL** (기본값)
   - 상품명, 설명, 브랜드에서 검색

2. **searchType=NAME**
   - 상품명에서만 검색

3. **searchType=DESCRIPTION**
   - 상품 설명에서만 검색

#### 검색 우선순위

1. 정확히 일치하는 상품명
2. 상품명에 키워드 포함
3. 상품 설명에 키워드 포함
4. 브랜드명 일치

### 3.3 상품 상세 조회

**GET** `/products/{id}`

특정 상품의 상세 정보를 조회합니다.

#### Path Parameters

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| id | long | 상품 ID |

#### Response (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "맥북 프로 16인치",
    "description": "M3 Pro 칩 탑재, 36GB 메모리, 512GB SSD\n\n**주요 사양**\n- 디스플레이: 16.2인치 Liquid Retina XDR\n- 프로세서: M3 Pro 칩\n- 메모리: 36GB\n- 저장공간: 512GB SSD",
    "price": 3590000,
    "discountPrice": 3390000,
    "discountRate": 5.6,
    "stockQuantity": 50,
    "status": "ACTIVE",
    "brand": "Apple",
    "category": {
      "id": 1,
      "name": "노트북",
      "path": "전자제품 > 컴퓨터 > 노트북",
      "parentId": 5
    },
    "images": [
      {
        "id": 1,
        "imageUrl": "https://cdn.example.com/products/1/main.jpg",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": 2,
        "imageUrl": "https://cdn.example.com/products/1/sub1.jpg",
        "isPrimary": false,
        "displayOrder": 1
      },
      {
        "id": 3,
        "imageUrl": "https://cdn.example.com/products/1/sub2.jpg",
        "isPrimary": false,
        "displayOrder": 2
      }
    ],
    "options": [
      {
        "id": 1,
        "name": "색상",
        "values": ["스페이스 그레이", "실버"]
      },
      {
        "id": 2,
        "name": "저장용량",
        "values": ["512GB", "1TB"]
      }
    ],
    "specifications": [
      {
        "name": "CPU",
        "value": "M3 Pro 12코어"
      },
      {
        "name": "RAM",
        "value": "36GB 통합 메모리"
      },
      {
        "name": "무게",
        "value": "2.14kg"
      }
    ],
    "averageRating": 4.8,
    "reviewCount": 245,
    "viewCount": 12560,
    "salesCount": 89,
    "wishlistCount": 450,
    "seller": {
      "id": 1,
      "name": "애플 공식스토어",
      "rating": 4.9
    },
    "shipping": {
      "feeType": "FREE",
      "fee": 0,
      "estimatedDays": "1-2",
      "returnFeeType": "CUSTOMER",
      "returnFee": 5000
    },
    "policy": {
      "returnDays": 14,
      "exchangeDays": 14,
      "warrantyDays": 365
    },
    "createdAt": "2024-01-01T00:00:00",
    "publishedAt": "2024-01-02T10:00:00",
    "updatedAt": "2024-01-15T10:00:00"
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

#### Business Logic

1. 조회 시 viewCount 증가 (Redis 기반 중복 방지, 24시간)
2. 최근 본 상품 기록 (로그인 사용자)
3. 연관 상품 추천 데이터 수집

#### Error Responses

- 404: 상품을 찾을 수 없음
- 410: 삭제된 상품

### 3.4 상품 생성 (관리자)

**POST** `/products`

**Authorization**: ADMIN

새로운 상품을 등록합니다.

#### Request Body

```json
{
  "categoryId": 1,
  "name": "맥북 프로 16인치",
  "description": "M3 Pro 칩 탑재",
  "price": 3590000,
  "stockQuantity": 50,
  "brand": "Apple",
  "images": [
    {
      "imageUrl": "https://cdn.example.com/products/1/main.jpg",
      "isPrimary": true
    }
  ],
  "options": [
    {
      "name": "색상",
      "values": ["스페이스 그레이", "실버"]
    }
  ],
  "specifications": [
    {
      "name": "CPU",
      "value": "M3 Pro 12코어"
    }
  ],
  "shippingFeeType": "FREE",
  "shippingFee": 0,
  "returnFeeType": "CUSTOMER",
  "returnFee": 5000
}
```

#### Validation Rules

| 필드 | 규칙 |
|------|------|
| categoryId | 필수, 존재하는 카테고리 |
| name | 필수, 2-255자 |
| description | 필수, 10-10000자 |
| price | 필수, 0보다 큼 |
| stockQuantity | 필수, 0 이상 |
| brand | 선택, 1-100자 |
| images | 필수, 최소 1개, 최대 10개 |
| options | 선택, 최대 5개 |

#### Response (201)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "맥북 프로 16인치",
    "status": "DRAFT",
    "createdAt": "2024-01-15T10:30:00"
  },
  "message": "상품이 생성되었습니다.",
  "timestamp": "2024-01-15T10:30:00"
}
```

#### Business Logic

1. 초기 상태는 DRAFT
2. ProductCreatedEvent 발행
3. 이미지 첫번째가 대표 이미지
4. 재고 0개로 생성 가능 (발행 불가)

### 3.5 상품 발행 (관리자)

**POST** `/products/{id}/publish`

**Authorization**: ADMIN

상품을 판매 가능 상태로 변경합니다.

#### Path Parameters

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| id | long | 상품 ID |

#### Response (200)

```json
{
  "success": true,
  "message": "상품이 발행되었습니다.",
  "timestamp": "2024-01-15T10:35:00"
}
```

#### Business Rules

- DRAFT 상태만 발행 가능
- 재고가 0개 이상이어야 함
- 필수 정보가 모두 입력되어야 함
- ProductPublishedEvent 발행

#### Error Responses

- 400: 이미 발행된 상품
- 400: 재고가 없는 상품
- 404: 상품을 찾을 수 없음

### 3.6 상품 수정 (관리자)

**PUT** `/products/{id}`

**Authorization**: ADMIN

#### Request Body

```json
{
  "categoryId": 1,
  "name": "맥북 프로 16인치 (2024)",
  "description": "M3 Pro 칩 탑재, 업그레이드 버전",
  "price": 3690000,
  "brand": "Apple"
}
```

#### Response (200)

```json
{
  "success": true,
  "message": "상품이 수정되었습니다.",
  "timestamp": "2024-01-15T10:40:00"
}
```

#### Business Rules

- ACTIVE 상태 상품도 수정 가능
- 가격 변경 시 ProductPriceChangedEvent 발행
- 주문이 진행 중인 상품은 일부 필드 수정 제한

### 3.7 재고 조정 (관리자)

**POST** `/products/{id}/stock/increase`

재고를 증가시킵니다.

#### Request Body

```json
{
  "quantity": 100,
  "reason": "입고"
}
```

**POST** `/products/{id}/stock/decrease`

재고를 감소시킵니다.

#### Request Body

```json
{
  "quantity": 10,
  "reason": "불량 재고 폐기"
}
```

#### Response (200)

```json
{
  "success": true,
  "data": {
    "productId": 1,
    "currentStock": 140,
    "changedAmount": 100
  },
  "message": "재고가 조정되었습니다.",
  "timestamp": "2024-01-15T10:45:00"
}
```

#### Business Logic

- ProductStockChangedEvent 발행
- 재고 이력 기록
- 재고가 0이 되면 자동으로 OUT_OF_STOCK 상태로 변경
- 재고가 1 이상이 되면 OUT_OF_STOCK → ACTIVE로 자동 변경

### 3.8 상품 삭제 (관리자)

**DELETE** `/products/{id}`

**Authorization**: ADMIN

상품을 소프트 삭제합니다.

#### Response (200)

```json
{
  "success": true,
  "message": "상품이 삭제되었습니다.",
  "timestamp": "2024-01-15T10:50:00"
}
```

#### Business Rules

- 실제로는 소프트 삭제 (isDeleted = true)
- 상태를 DISCONTINUED로 변경
- 진행 중인 주문이 있는 상품은 삭제 불가
- ProductDeletedEvent 발행

---

## 5. 장바구니 API

### 5.1 내 장바구니 조회

**GET** `/carts/me`

**Authorization**: Required

현재 사용자의 장바구니를 조회합니다.

#### Response (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "customerId": 1,
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "맥북 프로 16인치",
          "price": 3590000,
          "discountPrice": 3390000,
          "stockQuantity": 50,
          "status": "ACTIVE",
          "image": "https://cdn.example.com/products/1/main.jpg"
        },
        "quantity": 1,
        "price": 3590000,
        "discountPrice": 3390000,
        "subtotal": 3390000,
        "options": [
          {
            "name": "색상",
            "value": "스페이스 그레이"
          }
        ],
        "available": true,
        "unavailableReason": null,
        "addedAt": "2024-01-10T15:30:00"
      },
      {
        "id": 2,
        "product": {
          "id": 2,
          "name": "아이패드 프로 12.9",
          "price": 1590000,
          "discountPrice": null,
          "stockQuantity": 0,
          "status": "OUT_OF_STOCK",
          "image": "https://cdn.example.com/products/2/main.jpg"
        },
        "quantity": 1,
        "price": 1590000,
        "discountPrice": null,
        "subtotal": 1590000,
        "options": [],
        "available": false,
        "unavailableReason": "품절",
        "addedAt": "2024-01-12T10:00:00"
      }
    ],
    "summary": {
      "totalItemCount": 2,
      "availableItemCount": 1,
      "unavailableItemCount": 1,
      "totalPrice": 4980000,
      "totalDiscountPrice": 3390000,
      "totalDiscountAmount": 200000,
      "expectedShippingFee": 0,
      "expectedPaymentAmount": 3390000
    },
    "updatedAt": "2024-01-12T10:00:00"
  },
  "timestamp": "2024-01-15T11:00:00"
}
```

#### Business Logic

1. 상품 재고/상태 실시간 확인
2. 가격 변동 체크
3. 품절/판매중지 상품 표시
4. 쿠폰 적용 가능 여부 체크

### 5.2 장바구니에 상품 추가

**POST** `/carts/items`

**Authorization**: Required

장바구니에 상품을 추가합니다.

#### Request Body

```json
{
  "productId": 1,
  "quantity": 1,
  "options": [
    {
      "name": "색상",
      "value": "스페이스 그레이"
    },
    {
      "name": "저장용량",
      "value": "512GB"
    }
  ]
}
```

#### Validation Rules

| 필드 | 규칙 |
|------|------|
| productId | 필수, 존재하는 상품 |
| quantity | 필수, 1-999 |
| options | 선택, 상품에 정의된 옵션만 가능 |

#### Response (201)

```json
{
  "success": true,
  "data": {
    "cartItemId": 1,
    "productId": 1,
    "quantity": 1
  },
  "message": "장바구니에 추가되었습니다.",
  "timestamp": "2024-01-15T11:05:00"
}
```

#### Business Rules

1. **동일 상품 존재 시**:
   - 옵션이 동일하면 수량 증가
   - 옵션이 다르면 별도 항목으로 추가

2. **재고 확인**:
   - 현재 장바구니 수량 + 추가 수량 ≤ 재고
   - 초과 시 에러 반환

3. **상품 상태 확인**:
   - ACTIVE 상품만 추가 가능
   - INACTIVE, OUT_OF_STOCK, DISCONTINUED는 추가 불가

4. **최대 수량 제한**:
   - 장바구니 최대 100개 항목
   - 상품당 최대 999개

#### Error Responses

- 400: 재고 부족
- 400: 판매 불가 상품
- 400: 장바구니 최대 항목 초과
- 404: 상품을 찾을 수 없음

### 5.3 장바구니 수량 변경

**PUT** `/carts/items/{cartItemId}`

**Authorization**: Required

#### Request Body

```json
{
  "quantity": 2
}
```

#### Response (200)

```json
{
  "success": true,
  "data": {
    "cartItemId": 1,
    "quantity": 2,
    "subtotal": 6780000
  },
  "message": "수량이 변경되었습니다.",
  "timestamp": "2024-01-15T11:10:00"
}
```

#### Business Rules

- 재고 확인
- 최소 1개, 최대 999개
- 수량 0은 삭제 처리

### 5.4 장바구니에서 상품 제거

**DELETE** `/carts/items/{cartItemId}`

**Authorization**: Required

#### Response (200)

```json
{
  "success": true,
  "message": "장바구니에서 제거되었습니다.",
  "timestamp": "2024-01-15T11:15:00"
}
```

### 5.5 장바구니 비우기

**DELETE** `/carts/me`

**Authorization**: Required

장바구니의 모든 항목을 제거합니다.

#### Response (200)

```json
{
  "success": true,
  "message": "장바구니가 비워졌습니다.",
  "timestamp": "2024-01-15T11:20:00"
}
```

### 5.6 선택 항목 삭제

**DELETE** `/carts/items/batch`

**Authorization**: Required

#### Request Body

```json
{
  "cartItemIds": [1, 2, 3]
}
```

#### Response (200)

```json
{
  "success": true,
  "data": {
    "deletedCount": 3
  },
  "message": "선택한 상품이 삭제되었습니다.",
  "timestamp": "2024-01-15T11:25:00"
}
```

---

## 6. 주문 API

### 6.1 주문 생성

**POST** `/orders`

**Authorization**: Required

장바구니의 상품들로 주문을 생성합니다.

#### Request Body

```json
{
  "cartItemIds": [1, 2],
  "shippingAddressId": 1,
  "customShippingAddress": null,
  "couponId": 5,
  "usePoint": 5000,
  "paymentMethod": "CARD",
  "orderMessage": "부재 시 문 앞에 놓아주세요"
}
```

#### Request Fields

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| cartItemIds | long[] | O | 주문할 장바구니 항목 ID 배열 |
| shippingAddressId | long | X | 배송지 ID |
| customShippingAddress | object | X | 직접 입력 배송지 |
| couponId | long | X | 사용할 쿠폰 ID |
| usePoint | integer | X | 사용할 포인트 (100 단위) |
| paymentMethod | string | O | 결제 수단 |
| orderMessage | string | X | 배송 메시지 (최대 200자) |

#### Custom Shipping Address

```json
{
  "name": "홍길동",
  "phoneNumber": "01012345678",
  "zipCode": "06234",
  "address": "서울시 강남구 테헤란로 123",
  "detailAddress": "456호"
}
```

#### Response (201)

```json
{
  "success": true,
  "data": {
    "orderId": 12345,
    "orderNumber": "ORD20240115001",
    "orderStatus": "PENDING",
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "맥북 프로 16인치",
        "quantity": 1,
        "price": 3590000,
        "discountPrice": 3390000,
        "subtotal": 3390000
      }
    ],
    "payment": {
      "totalProductAmount": 3590000,
      "totalDiscountAmount": 200000,
      "couponDiscountAmount": 50000,
      "pointDiscountAmount": 5000,
      "shippingFee": 0,
      "finalAmount": 3135000
    },
    "shippingAddress": {
      "name": "홍길동",
      "phoneNumber": "01012345678",
      "zipCode": "06234",
      "address": "서울시 강남구 테헤란로 123",
      "detailAddress": "456호"
    },
    "createdAt": "2024-01-15T11:30:00"
  },
  "message": "주문이 생성되었습니다.",
  "timestamp": "2024-01-15T11:30:00"
}
```

#### Business Logic

1. **재고 확인 및 예약**:
   - 모든 상품의 재고 확인
   - 재고 부족 시 주문 생성 실패
   - 주문 생성 시 재고 차감 (실제 차감은 결제 완료 후)

2. **가격 계산**:
   ```
   최종 금액 = (상품 가격 합계 - 상품 할인)
              - 쿠폰 할인
              - 포인트 사용
              + 배송비
   ```

3. **쿠폰 검증**:
   - 사용 가능 기간 확인
   - 최소 주문 금액 확인
   - 이미 사용되지 않았는지 확인

4. **포인트 검증**:
   - 보유 포인트 충분한지 확인
   - 최소 사용 금액 (1,000원)
   - 100원 단위로만 사용 가능

5. **이벤트 발행**:
   - OrderPlacedEvent
   - 결제 대기 상태로 전환

#### Error Responses

- 400: 재고 부족
- 400: 쿠폰 사용 불가
- 400: 포인트 부족
- 400: 품절 상품 포함
- 404: 장바구니 항목 없음

### 6.2 주문 목록 조회

**GET** `/orders`

**Authorization**: Required

내 주문 목록을 조회합니다.

#### Query Parameters

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| status | string | - | 주문 상태 필터 |
| startDate | date | - | 시작일 (YYYY-MM-DD) |
| endDate | date | - | 종료일 (YYYY-MM-DD) |
| page | integer | 0 | 페이지 번호 |
| size | integer | 10 | 페이지 크기 |

#### Status Values

- `PENDING` - 결제 대기
- `CONFIRMED` - 결제 완료
- `PREPARING` - 상품 준비중
- `SHIPPED` - 배송중
- `DELIVERED` - 배송 완료
- `COMPLETED` - 구매 확정
- `CANCELLED` - 취소됨
- `RETURNED` - 반품됨

#### Response (200)

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 12345,
        "orderNumber": "ORD20240115001",
        "orderStatus": "SHIPPED",
        "items": [
          {
            "productId": 1,
            "productName": "맥북 프로 16인치",
            "productImage": "https://cdn.example.com/products/1/main.jpg",
            "quantity": 1,
            "price": 3390000
          }
        ],
        "itemCount": 1,
        "totalAmount": 3390000,
        "finalAmount": 3135000,
        "paymentMethod": "CARD",
        "orderedAt": "2024-01-15T11:30:00",
        "confirmedAt": "2024-01-15T11:35:00",
        "shippedAt": "2024-01-16T10:00:00",
        "deliveryExpectedAt": "2024-01-17T18:00:00",
        "canCancel": false,
        "canReturn": false,
        "canReview": false
      }
    ],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 25,
    "totalPages": 3
  },
  "timestamp": "2024-01-15T12:00:00"
}
```

이 API 명세를 계속 작성하시겠습니까? Order, Payment, Shipping, Review, Coupon API까지 모두 상세하게 작성하겠습니다.
