# E-Commerce Platform

프로덕션급 이커머스 플랫폼 - 모노레포 구조

## 프로젝트 구조

```
ecommerce-monorepo/
├── apps/
│   ├── web/                 # Next.js 웹 애플리케이션
│   ├── mobile/              # Expo 모바일 애플리케이션
│   └── admin/               # Next.js 관리자 대시보드
├── backend/                 # Spring Boot DDD 백엔드
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/ecommerce/
│   │               ├── domain/           # 도메인 계층
│   │               ├── application/      # 애플리케이션 계층
│   │               ├── infrastructure/   # 인프라 계층
│   │               └── interfaces/       # 인터페이스 계층 (REST API)
│   └── build.gradle
├── packages/
│   ├── shared-types/        # 공유 TypeScript 타입 정의
│   ├── ui/                  # 공유 UI 컴포넌트
│   └── config/              # 공유 설정
├── docker-compose.yml       # 프로덕션 Docker 설정
└── docker-compose.dev.yml   # 개발 Docker 설정
```

## 기술 스택

### Frontend
- **Web & Admin**: Next.js 14 (App Router), React 18, TypeScript
- **Mobile**: Expo (React Native), TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)

### Backend
- **Framework**: Spring Boot 3.2
- **Language**: Java 21
- **Architecture**: Domain-Driven Design (DDD)
- **Database**: H2 (개발), PostgreSQL/MySQL (프로덕션 대응 가능)
- **Build Tool**: Gradle

### Infrastructure
- **Package Manager**: pnpm
- **Monorepo Tool**: Turborepo
- **Containerization**: Docker, Docker Compose

## 시작하기

### 사전 요구사항

- Node.js 20+
- pnpm 9+
- Java 21
- Docker & Docker Compose (선택사항)

### 설치

```bash
# 의존성 설치
pnpm install

# Backend Gradle wrapper 생성 (최초 1회)
cd backend
gradle wrapper
cd ..
```

### 개발 서버 실행

#### 전체 실행

```bash
# Turborepo를 통한 모든 앱 실행
pnpm dev
```

#### 개별 실행

```bash
# Backend
make backend-dev
# 또는
cd backend && ./gradlew bootRun

# Web
make web-dev
# 또는
pnpm --filter web dev

# Admin
make admin-dev
# 또는
pnpm --filter admin dev

# Mobile
make mobile-dev
# 또는
pnpm --filter mobile dev
```

### 프로덕션 빌드

```bash
# 전체 빌드
pnpm build

# Backend 빌드
cd backend && ./gradlew bootJar
```

## Docker 실행

### 프로덕션 모드

```bash
# Docker 이미지 빌드
make docker-build
# 또는
docker-compose build

# 컨테이너 실행
make docker-up
# 또는
docker-compose up -d

# 중지
make docker-down
# 또는
docker-compose down
```

### 개발 모드

```bash
docker-compose -f docker-compose.dev.yml up
```

## API 엔드포인트

### Backend
- Base URL: `http://localhost:8080/api`
- H2 Console: `http://localhost:8080/api/h2-console`
  - JDBC URL: `jdbc:h2:mem:ecommerce`
  - Username: `sa`
  - Password: (비어있음)

### Frontend
- Web: `http://localhost:3000`
- Admin: `http://localhost:3001`
- Mobile: Expo Go 앱 사용

## DDD 아키텍처 구조

### Domain Layer (도메인 계층)
- 비즈니스 로직의 핵심
- Entity, Value Object, Aggregate, Domain Service
- 예: `Product`, `Order`, `Customer`

### Application Layer (애플리케이션 계층)
- Use Case 구현
- 도메인 객체를 조율
- 트랜잭션 관리
- 예: `ProductService`, `OrderService`

### Infrastructure Layer (인프라 계층)
- Repository 구현 (JPA)
- 외부 서비스 연동
- 기술적 구현 세부사항
- 예: `ProductRepositoryImpl`, `JpaProductRepository`

### Interface Layer (인터페이스 계층)
- REST API 컨트롤러
- DTO (Data Transfer Object)
- 외부 세계와의 통신
- 예: `ProductController`, `ProductResponse`

## 주요 기능

### 현재 구현됨
- ✅ 모노레포 구조 설정
- ✅ Next.js 웹 애플리케이션
- ✅ Expo 모바일 애플리케이션
- ✅ Next.js 관리자 대시보드
- ✅ Spring Boot DDD 백엔드
- ✅ Product 도메인 (CRUD)
- ✅ 공유 타입 정의
- ✅ 공유 UI 컴포넌트
- ✅ Docker 컨테이너화

### 향후 확장 가능
- 🔲 Order 도메인 구현
- 🔲 Customer 도메인 구현
- 🔲 인증/인가 (JWT)
- 🔲 결제 시스템 연동
- 🔲 이미지 업로드
- 🔲 검색 기능
- 🔲 장바구니
- 🔲 주문 관리
- 🔲 재고 관리

## 스크립트

```bash
# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 린트
pnpm lint

# 포맷팅
pnpm format

# 정리
pnpm clean
make clean
```

## 환경 변수

각 애플리케이션의 `.env.example` 파일을 `.env.local`로 복사하여 사용하세요.

### Web & Admin
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Mobile
```env
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

## 라이선스

MIT

## 기여

이슈와 Pull Request를 환영합니다.
