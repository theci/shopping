# Frontend Architecture Overview

프로덕션급 이커머스 프론트엔드 전체 아키텍처

---

## 📱 애플리케이션 구조

```
apps/
├── web/              # Next.js 웹 애플리케이션 (고객용)
│   ├── 고객 쇼핑몰
│   ├── 상품 검색/조회
│   ├── 장바구니
│   ├── 주문/결제
│   └── 마이페이지
│
├── mobile/           # Expo 모바일 앱
│   ├── 네이티브 앱 경험
│   ├── 푸시 알림
│   ├── 바코드 스캔
│   └── 오프라인 지원
│
└── admin/            # Next.js 관리자 대시보드
    ├── 상품 관리
    ├── 주문 관리
    ├── 고객 관리
    ├── 통계 대시보드
    └── 설정

packages/
├── shared-types/     # 공유 TypeScript 타입
├── ui/              # 공유 UI 컴포넌트
└── config/          # 공유 설정
```

---

## 🎯 기술 스택

### Core
- **Framework**: Next.js 14 (App Router), Expo SDK 51
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand 4.5
- **Data Fetching**: TanStack Query (React Query) 5.28
- **Forms**: React Hook Form 7.50
- **Validation**: Zod 3.22

### UI Components
- **Shared Components**: Custom Design System
- **Icons**: Lucide React / Expo Icons
- **Toast/Modal**: Custom implementations
- **Animation**: Framer Motion / React Native Reanimated

### API Integration
- **HTTP Client**: Axios 1.6
- **API Layer**: Custom hooks with React Query
- **WebSocket**: Socket.io (실시간 알림용)

### Testing
- **Unit/Integration**: Vitest / Jest
- **E2E**: Playwright / Detox
- **Component**: React Testing Library

### Build & Deploy
- **Package Manager**: pnpm
- **Monorepo**: Turborepo
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (Web/Admin), EAS (Mobile)

---

## 📦 패키지 구조

### packages/shared-types
```typescript
// Backend API 응답 타입과 동기화
export interface Product {
  id: number;
  name: string;
  price: number;
  // ... backend와 동일
}

export interface Order {
  id: number;
  orderNumber: string;
  // ... backend와 동일
}
```

### packages/ui
```
ui/
├── components/
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Modal/
│   ├── Toast/
│   └── Loading/
├── layouts/
│   ├── Header/
│   ├── Footer/
│   └── Sidebar/
└── hooks/
    ├── useToast.ts
    ├── useModal.ts
    └── useLocalStorage.ts
```

---

## 🏗️ 공통 아키텍처 패턴

### 1. Feature-Based 구조

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── store/
│   │   └── types.ts
│   ├── product/
│   │   ├── components/
│   │   │   ├── ProductList/
│   │   │   ├── ProductDetail/
│   │   │   └── ProductCard/
│   │   ├── hooks/
│   │   │   ├── useProducts.ts
│   │   │   └── useProductDetail.ts
│   │   ├── api/
│   │   │   └── productApi.ts
│   │   └── types.ts
│   ├── cart/
│   ├── order/
│   └── customer/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── constants/
└── lib/
    ├── api/
    ├── auth/
    └── storage/
```

### 2. API Layer 구조

```typescript
// lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshToken();
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### 3. React Query 통합

```typescript
// features/product/api/productApi.ts
import { apiClient } from '@/lib/api/client';
import type { Product, ApiResponse } from '@repo/shared-types';

export const productApi = {
  getProducts: async (params: ProductListParams): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products', { params });
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },
};

// features/product/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/productApi';

export const useProducts = (params: ProductListParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
};
```

### 4. Zustand Store 구조

```typescript
// features/auth/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const response = await authApi.login(email, password);
        set({
          user: response.customer,
          accessToken: response.accessToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);
```

---

## 🔐 인증 플로우

### JWT Token 관리

```typescript
// lib/auth/tokenManager.ts
export const tokenManager = {
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  setAccessToken: (token: string) => {
    localStorage.setItem('accessToken', token);
  },

  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  setRefreshToken: (token: string) => {
    localStorage.setItem('refreshToken', token);
  },

  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  refreshAccessToken: async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');

    const response = await authApi.refreshToken(refreshToken);
    tokenManager.setAccessToken(response.accessToken);
    return response.accessToken;
  },
};
```

### Protected Routes (Next.js)

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedPage = ['/cart', '/orders', '/mypage'].some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cart/:path*', '/orders/:path*', '/mypage/:path*', '/auth/:path*'],
};
```

---

## 📱 반응형 디자인 전략

### Breakpoints

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'xs': '375px',   // Mobile S
      'sm': '640px',   // Mobile L
      'md': '768px',   // Tablet
      'lg': '1024px',  // Laptop
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Large Desktop
    },
  },
};
```

### 반응형 Hook

```typescript
// hooks/useResponsive.ts
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  return { isMobile, isTablet, isDesktop };
};
```

---

## 🎨 디자인 시스템

### Color Palette

```typescript
// tailwind.config.ts
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    700: '#374151',
    900: '#111827',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
}
```

### Typography

```typescript
fontSize: {
  'xs': ['12px', '16px'],
  'sm': ['14px', '20px'],
  'base': ['16px', '24px'],
  'lg': ['18px', '28px'],
  'xl': ['20px', '28px'],
  '2xl': ['24px', '32px'],
  '3xl': ['30px', '36px'],
  '4xl': ['36px', '40px'],
}
```

---

## 🚀 성능 최적화

### 1. 코드 스플리팅

```typescript
// Next.js Dynamic Import
import dynamic from 'next/dynamic';

const ProductDetail = dynamic(() => import('@/features/product/components/ProductDetail'), {
  loading: () => <ProductDetailSkeleton />,
  ssr: false,
});

// React Lazy
const OrderHistory = lazy(() => import('@/features/order/components/OrderHistory'));
```

### 2. 이미지 최적화

```typescript
// Next.js Image
import Image from 'next/image';

<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  placeholder="blur"
  blurDataURL={product.blurDataURL}
  loading="lazy"
/>
```

### 3. 무한 스크롤

```typescript
// hooks/useInfiniteProducts.ts
import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfiniteProducts = (params: ProductListParams) => {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', params],
    queryFn: ({ pageParam = 0 }) =>
      productApi.getProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.last ? undefined : pages.length;
    },
  });
};

// Component
const { data, fetchNextPage, hasNextPage } = useInfiniteProducts({});

<InfiniteScroll
  loadMore={fetchNextPage}
  hasMore={hasNextPage}
  loader={<Loading />}
>
  {data.pages.map((page) =>
    page.content.map((product) => <ProductCard key={product.id} product={product} />)
  )}
</InfiniteScroll>
```

---

## 🧪 테스트 전략

### 단위 테스트 (Hooks)

```typescript
// features/product/hooks/useProducts.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from './useProducts';

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProducts', () => {
  it('should fetch products successfully', async () => {
    const { result } = renderHook(() => useProducts({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(20);
  });
});
```

### 컴포넌트 테스트

```typescript
// features/product/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 10000,
    imageUrl: 'https://example.com/image.jpg',
  };

  it('should render product information', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('₩10,000')).toBeInTheDocument();
  });
});
```

---

## 📊 구현 우선순위

### Phase 1: Core Features (4주)
**Week 1-2: 기반 구축**
- [ ] 프로젝트 셋업
- [ ] 공유 타입 정의
- [ ] 공유 UI 컴포넌트
- [ ] API 클라이언트 설정
- [ ] 인증 시스템

**Week 3-4: 주요 기능**
- [ ] 상품 목록/검색
- [ ] 상품 상세
- [ ] 장바구니
- [ ] 주문/결제

### Phase 2: Advanced Features (3주)
**Week 5-6: 부가 기능**
- [ ] 마이페이지
- [ ] 주문 내역
- [ ] 리뷰 시스템
- [ ] 찜하기

**Week 7: 관리자**
- [ ] Admin 대시보드
- [ ] 상품 관리
- [ ] 주문 관리

### Phase 3: Polish & Deploy (2주)
**Week 8: 최적화**
- [ ] 성능 최적화
- [ ] SEO 최적화
- [ ] 접근성 개선

**Week 9: 배포**
- [ ] CI/CD 설정
- [ ] 프로덕션 배포
- [ ] 모니터링 설정

---

## 📱 앱별 특화 기능

### Web (apps/web)
- SEO 최적화
- Server-Side Rendering
- Static Generation
- 웹 결제 연동
- 소셜 로그인

### Mobile (apps/mobile)
- 푸시 알림
- 바코드 스캔
- 생체 인증
- 오프라인 모드
- 딥링크

### Admin (apps/admin)
- 대시보드 차트
- 데이터 테이블
- 엑셀 Export
- 권한 관리
- 감사 로그

---

## 🔗 Backend API 연동

모든 프론트엔드 앱은 동일한 Backend API를 사용합니다:

**Base URL**: `http://localhost:8080/api/v1`

**주요 엔드포인트**:
- `/auth/*` - 인증
- `/customers/*` - 고객
- `/products/*` - 상품
- `/carts/*` - 장바구니
- `/orders/*` - 주문
- `/payments/*` - 결제

상세 내용은 `backend/docs/API_SPECIFICATIONS.md` 참고

---

다음 문서에서 각 앱별 상세 구현 가이드를 제공합니다:
- [WEB_IMPLEMENTATION.md](./WEB_IMPLEMENTATION.md)
- [MOBILE_IMPLEMENTATION.md](./MOBILE_IMPLEMENTATION.md)
- [ADMIN_IMPLEMENTATION.md](./ADMIN_IMPLEMENTATION.md)
