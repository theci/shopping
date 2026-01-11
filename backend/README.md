# E-Commerce Backend

Spring Boot 기반 DDD 아키텍처 백엔드

## 아키텍처

### Domain-Driven Design (DDD) 구조

```
com.ecommerce/
├── domain/              # 도메인 계층
│   ├── product/
│   │   ├── Product.java            # 엔티티
│   │   ├── ProductStatus.java      # Value Object
│   │   └── ProductRepository.java  # Repository 인터페이스
│   ├── order/
│   └── customer/
├── application/         # 애플리케이션 계층
│   └── product/
│       └── ProductService.java     # Use Case
├── infrastructure/      # 인프라 계층
│   ├── persistence/
│   │   ├── JpaProductRepository.java     # JPA Repository
│   │   └── ProductRepositoryImpl.java    # Repository 구현
│   └── config/
│       ├── JpaConfig.java
│       └── SecurityConfig.java
└── interfaces/          # 인터페이스 계층
    └── rest/
        ├── controller/
        │   └── ProductController.java    # REST Controller
        └── dto/
            ├── ProductResponse.java      # Response DTO
            └── CreateProductRequest.java # Request DTO
```

## 기술 스택

- Spring Boot 3.2
- Spring Data JPA
- Spring Security
- H2 Database
- Lombok
- MapStruct
- Gradle

## 개발

```bash
# 개발 서버 실행
./gradlew bootRun

# 빌드
./gradlew build

# 테스트
./gradlew test

# JAR 생성
./gradlew bootJar
```

## API 엔드포인트

### Product API

```
GET    /api/products          # 모든 상품 조회
GET    /api/products/{id}     # 특정 상품 조회
POST   /api/products          # 상품 생성
DELETE /api/products/{id}     # 상품 삭제
GET    /api/products/category/{category}  # 카테고리별 조회
```

### H2 Console

- URL: http://localhost:8080/api/h2-console
- JDBC URL: `jdbc:h2:mem:ecommerce`
- Username: `sa`
- Password: (비어있음)

## 환경 설정

### application.yml

개발 환경 설정 (기본)

### application-prod.yml

프로덕션 환경 설정

```bash
# 프로덕션 프로파일로 실행
./gradlew bootRun --args='--spring.profiles.active=prod'
```

## DDD 계층별 책임

### Domain Layer
- 비즈니스 로직의 핵심
- 프레임워크에 독립적
- Entity, Value Object, Aggregate
- 도메인 규칙 및 불변성 보장

### Application Layer
- Use Case 구현
- 트랜잭션 관리
- 도메인 객체 조율
- 외부 의존성 없음

### Infrastructure Layer
- 기술적 구현
- JPA, Database 연동
- 외부 API 연동
- 설정 관리

### Interface Layer
- 외부 세계와의 통신
- REST API
- DTO 변환
- 입력 검증
