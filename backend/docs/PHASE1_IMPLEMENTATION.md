# Phase 1: MVP Implementation Guide

## 개요

Phase 1은 기본적인 이커머스 기능을 구현하는 단계입니다. 사용자가 상품을 둘러보고, 장바구니에 담고, 주문하고, 결제할 수 있는 핵심 기능을 완성합니다.

**예상 소요 시간**: 4-6주
**목표**: 기본 이커머스 거래 플로우 완성

---

## 구현 순서

### Step 1: Shared Infrastructure (1주차)
### Step 2: Customer Domain (1주차)
### Step 3: Product Domain (1.5주차)
### Step 4: Cart Domain (1주차)
### Step 5: Order Domain (1.5주차)
### Step 6: Payment Domain (2주차)
### Step 7: Integration & Testing (1주차)

---

## Step 1: Shared Infrastructure (Week 1)

### 1.1 목표
- DDD 기반 클래스 구조 완성
- 공통 예외 처리
- API 응답 표준화
- 보안 기본 설정

### 1.2 구현 체크리스트

#### Core Classes
- [x] `BaseEntity.java` - 모든 엔티티의 기본 클래스
- [x] `AggregateRoot.java` - 도메인 이벤트 지원
- [x] `DomainEvent.java` - 이벤트 인터페이스
- [x] `DomainEventPublisher.java` - 이벤트 발행

#### Exception Handling
- [x] `BusinessException.java` - 비즈니스 예외
- [x] `GlobalExceptionHandler.java` - 전역 예외 처리
- [ ] `ResourceNotFoundException.java` - 리소스 미발견
- [ ] `DuplicateResourceException.java` - 중복 리소스
- [ ] `UnauthorizedException.java` - 인증 실패
- [ ] `ForbiddenException.java` - 권한 부족

#### API Response
- [x] `ApiResponse.java` - 표준 응답 래퍼
- [x] `PageResponse.java` - 페이징 응답
- [ ] `ErrorResponse.java` - 에러 상세 정보

#### Security (Basic)
- [ ] `SecurityConfig.java` - 기본 보안 설정
- [ ] `CorsConfig.java` - CORS 설정
- [ ] `JwtTokenProvider.java` - JWT 토큰 생성/검증
- [ ] `JwtAuthenticationFilter.java` - JWT 필터

#### Validation
- [ ] `ValidationGroups.java` - 검증 그룹
- [ ] Custom Validators (이메일, 전화번호 등)

### 1.3 예외 처리 상세 설계

```java
// ResourceNotFoundException.java
package com.ecommerce.shared.exception;

public class ResourceNotFoundException extends BusinessException {
    public ResourceNotFoundException(String resource, Long id) {
        super("RESOURCE_NOT_FOUND",
              String.format("%s를 찾을 수 없습니다. ID: %d", resource, id));
    }
}

// DuplicateResourceException.java
public class DuplicateResourceException extends BusinessException {
    public DuplicateResourceException(String resource, String field, Object value) {
        super("DUPLICATE_RESOURCE",
              String.format("%s가 이미 존재합니다. %s: %s", resource, field, value));
    }
}

// UnauthorizedException.java
public class UnauthorizedException extends BusinessException {
    public UnauthorizedException(String message) {
        super("UNAUTHORIZED", message);
    }
}

// ForbiddenException.java
public class ForbiddenException extends BusinessException {
    public ForbiddenException(String message) {
        super("FORBIDDEN", message);
    }
}
```

### 1.4 보안 설정 (Basic JWT)

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/products/**").permitAll()
                .requestMatchers("/api/v1/categories/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()

                // Authenticated endpoints
                .requestMatchers("/api/v1/customers/me/**").authenticated()
                .requestMatchers("/api/v1/carts/**").authenticated()
                .requestMatchers("/api/v1/orders/**").authenticated()
                .requestMatchers("/api/v1/payments/**").authenticated()

                // Admin endpoints
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter(),
                            UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",    // Web
            "http://localhost:3001"     // Admin
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

### 1.5 테스트

```java
@SpringBootTest
class GlobalExceptionHandlerTest {

    @Test
    void businessException_반환시_BadRequest() {
        // given
        BusinessException exception = new BusinessException("TEST_ERROR", "테스트 에러");

        // when
        ResponseEntity<ApiResponse<Void>> response =
            handler.handleBusinessException(exception);

        // then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody().getErrorCode()).isEqualTo("TEST_ERROR");
    }
}
```

---

## Step 2: Customer Domain (Week 1)

### 2.1 목표
- 회원가입/로그인 기능
- 프로필 관리
- 배송지 관리
- 회원 등급 관리

### 2.2 Domain Model

#### Customer (Aggregate Root)
```java
@Entity
@Table(name = "customers", indexes = {
    @Index(name = "idx_email", columnList = "email", unique = true),
    @Index(name = "idx_status", columnList = "status")
})
public class Customer extends AggregateRoot {

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;  // BCrypt 암호화

    @Column(nullable = false)
    private String name;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustomerStatus status;  // ACTIVE, INACTIVE, BLOCKED, WITHDRAWN

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustomerLevel level;    // BRONZE, SILVER, GOLD, PLATINUM, VIP

    @Column(nullable = false)
    private Integer totalPurchaseAmount = 0;  // 누적 구매 금액

    @Column(nullable = false)
    private Integer point = 0;  // 포인트

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CustomerAddress> addresses = new ArrayList<>();

    private LocalDateTime lastLoginAt;
    private LocalDateTime withdrawnAt;
    private String withdrawalReason;

    // Factory method
    public static Customer register(String email, String rawPassword,
                                   String name, String phoneNumber,
                                   PasswordEncoder passwordEncoder) {
        validateRegistration(email, rawPassword, name);

        Customer customer = new Customer();
        customer.email = email;
        customer.password = passwordEncoder.encode(rawPassword);
        customer.name = name;
        customer.phoneNumber = phoneNumber;
        customer.status = CustomerStatus.ACTIVE;
        customer.level = CustomerLevel.BRONZE;

        customer.addDomainEvent(new CustomerRegisteredEvent(customer.getId(), customer.email));
        return customer;
    }

    public void updateProfile(String name, String phoneNumber) {
        validateName(name);
        this.name = name;
        this.phoneNumber = phoneNumber;

        addDomainEvent(new CustomerProfileUpdatedEvent(this.getId()));
    }

    public void addAddress(String name, String phoneNumber, String zipCode,
                          String address, String detailAddress, boolean isDefault) {
        if (isDefault) {
            addresses.forEach(addr -> addr.setDefault(false));
        }

        CustomerAddress newAddress = new CustomerAddress(
            this, name, phoneNumber, zipCode, address, detailAddress, isDefault
        );
        this.addresses.add(newAddress);
    }

    public void updatePassword(String currentPassword, String newPassword,
                              PasswordEncoder passwordEncoder) {
        if (!passwordEncoder.matches(currentPassword, this.password)) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        validatePassword(newPassword);
        this.password = passwordEncoder.encode(newPassword);
    }

    public void increasePurchaseAmount(int amount) {
        this.totalPurchaseAmount += amount;
        updateLevel();
    }

    public void earnPoints(int points) {
        this.point += points;
    }

    public void usePoints(int points) {
        if (this.point < points) {
            throw new IllegalStateException("포인트가 부족합니다.");
        }
        this.point -= points;
    }

    public void withdraw(String reason) {
        if (this.status == CustomerStatus.WITHDRAWN) {
            throw new IllegalStateException("이미 탈퇴한 회원입니다.");
        }

        this.status = CustomerStatus.WITHDRAWN;
        this.withdrawnAt = LocalDateTime.now();
        this.withdrawalReason = reason;

        addDomainEvent(new CustomerWithdrawnEvent(this.getId(), this.email));
    }

    public void recordLogin() {
        this.lastLoginAt = LocalDateTime.now();
    }

    private void updateLevel() {
        CustomerLevel newLevel = CustomerLevel.calculateLevel(this.totalPurchaseAmount);
        if (newLevel != this.level) {
            CustomerLevel oldLevel = this.level;
            this.level = newLevel;
            addDomainEvent(new CustomerLevelUpEvent(this.getId(), oldLevel, newLevel));
        }
    }

    private static void validateRegistration(String email, String password, String name) {
        validateEmail(email);
        validatePassword(password);
        validateName(name);
    }

    private static void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("이메일은 필수입니다.");
        }
        if (!email.matches("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$")) {
            throw new IllegalArgumentException("올바른 이메일 형식이 아닙니다.");
        }
    }

    private static void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 8자 이상이어야 합니다.");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("비밀번호는 대문자를 포함해야 합니다.");
        }
        if (!password.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("비밀번호는 소문자를 포함해야 합니다.");
        }
        if (!password.matches(".*\\d.*")) {
            throw new IllegalArgumentException("비밀번호는 숫자를 포함해야 합니다.");
        }
        if (!password.matches(".*[!@#$%^&*].*")) {
            throw new IllegalArgumentException("비밀번호는 특수문자를 포함해야 합니다.");
        }
    }

    private static void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("이름은 필수입니다.");
        }
        if (name.length() < 2 || name.length() > 50) {
            throw new IllegalArgumentException("이름은 2-50자 사이여야 합니다.");
        }
    }
}
```

#### CustomerAddress (Entity)
```java
@Entity
@Table(name = "customer_addresses")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CustomerAddress extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false)
    private String name;  // 수령인 이름

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String zipCode;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String detailAddress;

    @Column(nullable = false)
    @Setter
    private Boolean isDefault = false;

    public CustomerAddress(Customer customer, String name, String phoneNumber,
                          String zipCode, String address, String detailAddress,
                          Boolean isDefault) {
        this.customer = customer;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.zipCode = zipCode;
        this.address = address;
        this.detailAddress = detailAddress;
        this.isDefault = isDefault;
    }

    public void update(String name, String phoneNumber, String zipCode,
                      String address, String detailAddress) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.zipCode = zipCode;
        this.address = address;
        this.detailAddress = detailAddress;
    }
}
```

#### CustomerLevel (Enum)
```java
public enum CustomerLevel {
    BRONZE("브론즈", 0, 1.0),           // 0원 이상
    SILVER("실버", 100000, 1.02),       // 10만원 이상, 2% 적립
    GOLD("골드", 500000, 1.03),         // 50만원 이상, 3% 적립
    PLATINUM("플래티넘", 1000000, 1.05),// 100만원 이상, 5% 적립
    VIP("VIP", 3000000, 1.07);          // 300만원 이상, 7% 적립

    private final String displayName;
    private final int minPurchaseAmount;
    private final double pointRate;

    CustomerLevel(String displayName, int minPurchaseAmount, double pointRate) {
        this.displayName = displayName;
        this.minPurchaseAmount = minPurchaseAmount;
        this.pointRate = pointRate;
    }

    public static CustomerLevel calculateLevel(int totalPurchaseAmount) {
        if (totalPurchaseAmount >= VIP.minPurchaseAmount) return VIP;
        if (totalPurchaseAmount >= PLATINUM.minPurchaseAmount) return PLATINUM;
        if (totalPurchaseAmount >= GOLD.minPurchaseAmount) return GOLD;
        if (totalPurchaseAmount >= SILVER.minPurchaseAmount) return SILVER;
        return BRONZE;
    }

    public int calculatePoints(int purchaseAmount) {
        return (int) (purchaseAmount * pointRate / 100);
    }
}
```

### 2.3 API Endpoints

#### 2.3.1 인증 API

##### POST /api/v1/auth/register
회원가입

**Request**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "홍길동",
  "phoneNumber": "01012345678",
  "agreeToTerms": true,
  "agreeToPrivacy": true,
  "agreeToMarketing": false
}
```

**Response (201)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "phoneNumber": "01012345678",
    "status": "ACTIVE",
    "level": "BRONZE",
    "point": 0,
    "createdAt": "2024-01-15T10:30:00"
  },
  "message": "회원가입이 완료되었습니다.",
  "timestamp": "2024-01-15T10:30:00"
}
```

**Validation Rules**
- email: 필수, 이메일 형식, 중복 불가
- password: 필수, 8자 이상, 대소문자/숫자/특수문자 포함
- name: 필수, 2-50자
- phoneNumber: 선택, 10-11자 숫자
- agreeToTerms: 필수, true
- agreeToPrivacy: 필수, true

**Business Rules**
- 이메일 중복 검사
- 비밀번호 암호화 (BCrypt)
- 기본 등급은 BRONZE
- 회원가입 시 웰컴 쿠폰 발급 (이벤트)

##### POST /api/v1/auth/login
로그인

**Request**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "customer": {
      "id": 1,
      "email": "user@example.com",
      "name": "홍길동",
      "level": "GOLD",
      "point": 5000
    }
  },
  "message": "로그인 성공",
  "timestamp": "2024-01-15T10:35:00"
}
```

**Error Responses**
- 401: 이메일 또는 비밀번호 불일치
- 403: 계정 정지 또는 탈퇴

#### 2.3.2 고객 프로필 API

##### GET /api/v1/customers/me
내 정보 조회

**Response (200)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "phoneNumber": "01012345678",
    "status": "ACTIVE",
    "level": "GOLD",
    "levelBenefits": {
      "displayName": "골드",
      "pointRate": 3.0,
      "minPurchaseAmount": 500000
    },
    "totalPurchaseAmount": 750000,
    "point": 5000,
    "addresses": [
      {
        "id": 1,
        "name": "홍길동",
        "phoneNumber": "01012345678",
        "zipCode": "06234",
        "address": "서울시 강남구 테헤란로 123",
        "detailAddress": "456호",
        "isDefault": true
      }
    ],
    "lastLoginAt": "2024-01-15T10:35:00",
    "createdAt": "2024-01-01T00:00:00"
  },
  "timestamp": "2024-01-15T10:36:00"
}
```

##### PUT /api/v1/customers/me
내 정보 수정

**Request**
```json
{
  "name": "홍길동",
  "phoneNumber": "01087654321"
}
```

**Response (200)**
```json
{
  "success": true,
  "message": "프로필이 수정되었습니다.",
  "timestamp": "2024-01-15T10:40:00"
}
```

##### PUT /api/v1/customers/me/password
비밀번호 변경

**Request**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!",
  "newPasswordConfirm": "NewPassword456!"
}
```

**Response (200)**
```json
{
  "success": true,
  "message": "비밀번호가 변경되었습니다.",
  "timestamp": "2024-01-15T10:45:00"
}
```

#### 2.3.3 배송지 관리 API

##### GET /api/v1/customers/me/addresses
배송지 목록 조회

**Response (200)**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "홍길동",
      "phoneNumber": "01012345678",
      "zipCode": "06234",
      "address": "서울시 강남구 테헤란로 123",
      "detailAddress": "456호",
      "isDefault": true,
      "createdAt": "2024-01-01T00:00:00"
    }
  ],
  "timestamp": "2024-01-15T10:50:00"
}
```

##### POST /api/v1/customers/me/addresses
배송지 추가

**Request**
```json
{
  "name": "회사",
  "phoneNumber": "01012345678",
  "zipCode": "06234",
  "address": "서울시 강남구 테헤란로 123",
  "detailAddress": "10층",
  "isDefault": false
}
```

**Response (201)**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "회사",
    "phoneNumber": "01012345678",
    "zipCode": "06234",
    "address": "서울시 강남구 테헤란로 123",
    "detailAddress": "10층",
    "isDefault": false
  },
  "message": "배송지가 추가되었습니다.",
  "timestamp": "2024-01-15T10:55:00"
}
```

##### PUT /api/v1/customers/me/addresses/{id}
배송지 수정

##### DELETE /api/v1/customers/me/addresses/{id}
배송지 삭제

##### POST /api/v1/customers/me/addresses/{id}/default
기본 배송지 설정

### 2.4 Service Layer

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final DomainEventPublisher eventPublisher;

    @Transactional
    public Customer register(String email, String password, String name, String phoneNumber) {
        // 이메일 중복 검사
        if (customerRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Customer", "email", email);
        }

        // 고객 생성
        Customer customer = Customer.register(email, password, name, phoneNumber, passwordEncoder);
        Customer savedCustomer = customerRepository.save(customer);

        // 도메인 이벤트 발행
        eventPublisher.publishEvents(savedCustomer);

        return savedCustomer;
    }

    public Customer login(String email, String password) {
        Customer customer = customerRepository.findByEmail(email)
            .orElseThrow(() -> new UnauthorizedException("이메일 또는 비밀번호가 일치하지 않습니다."));

        if (!passwordEncoder.matches(password, customer.getPassword())) {
            throw new UnauthorizedException("이메일 또는 비밀번호가 일치하지 않습니다.");
        }

        if (customer.getStatus() != CustomerStatus.ACTIVE) {
            throw new ForbiddenException("사용할 수 없는 계정입니다.");
        }

        customer.recordLogin();

        return customer;
    }

    // 나머지 메서드들...
}
```

### 2.5 테스트 전략

```java
@SpringBootTest
@Transactional
class CustomerServiceTest {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    @Test
    @DisplayName("회원가입 - 성공")
    void register_success() {
        // given
        String email = "test@example.com";
        String password = "Password123!";
        String name = "테스트";
        String phoneNumber = "01012345678";

        // when
        Customer customer = customerService.register(email, password, name, phoneNumber);

        // then
        assertThat(customer.getId()).isNotNull();
        assertThat(customer.getEmail()).isEqualTo(email);
        assertThat(customer.getName()).isEqualTo(name);
        assertThat(customer.getStatus()).isEqualTo(CustomerStatus.ACTIVE);
        assertThat(customer.getLevel()).isEqualTo(CustomerLevel.BRONZE);
    }

    @Test
    @DisplayName("회원가입 - 이메일 중복 시 예외 발생")
    void register_duplicateEmail_throwsException() {
        // given
        String email = "duplicate@example.com";
        customerService.register(email, "Password123!", "테스트1", null);

        // when & then
        assertThatThrownBy(() ->
            customerService.register(email, "Password456!", "테스트2", null)
        ).isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    @DisplayName("로그인 - 성공")
    void login_success() {
        // given
        String email = "test@example.com";
        String password = "Password123!";
        customerService.register(email, password, "테스트", null);

        // when
        Customer customer = customerService.login(email, password);

        // then
        assertThat(customer.getEmail()).isEqualTo(email);
        assertThat(customer.getLastLoginAt()).isNotNull();
    }

    @Test
    @DisplayName("로그인 - 잘못된 비밀번호로 실패")
    void login_wrongPassword_throwsException() {
        // given
        String email = "test@example.com";
        customerService.register(email, "Password123!", "테스트", null);

        // when & then
        assertThatThrownBy(() ->
            customerService.login(email, "WrongPassword!")
        ).isInstanceOf(UnauthorizedException.class);
    }
}
```

---

## Step 3-6은 별도 문서에서 계속...

이어서 Product, Cart, Order, Payment 도메인의 상세 구현 가이드를 작성하겠습니다.
