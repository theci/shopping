# E-Commerce Frontend - Production-Grade Implementation Guide

백엔드 API와 연동하는 프로덕션급 이커머스 프론트엔드 구현 가이드

---

## 아키텍처 개요
Phase 1 (MVP) - 핵심 기능
  ┌──────┬────────────────────┬───────────────────────────────────────────────────────┐
  │ 단계 │        내용        │                       주요 구현                           │
  ├──────┼────────────────────┼───────────────────────────────────────────────────────┤
  │ 1    │ 프로젝트 기반 설정 │ API 클라이언트, 토큰 매니저, React Query, UI 컴포넌트             │
  ├──────┼────────────────────┼───────────────────────────────────────────────────────┤
  │ 2    │ 인증 기능          │ 로그인, 회원가입, JWT 관리, Protected Route                  │
  ├──────┼────────────────────┼───────────────────────────────────────────────────────┤
  │ 3    │ 상품 기능          │ 목록/상세/검색/필터링, 무한 스크롤                              │
  ├──────┼────────────────────┼───────────────────────────────────────────────────────┤
  │ 4    │ 장바구니 기능      │ 추가/수정/삭제, 수량 변경, 총액 계산                             │
  ├──────┼────────────────────┼───────────────────────────────────────────────────────┤
  │ 5    │ 고객 기능          │ 마이페이지, 프로필 수정, 배송지 관리                             │
  ├──────┼────────────────────┼───────────────────────────────────────────────────────┤
  │ 6    │ 주문 기능          │ 주문 생성/조회/취소, 구매 확정                                 │
  ├──────┼────────────────────┼───────────────────────────────────────────────────────┤
  │ 7    │ 결제 기능          │ Toss Payments 연동                                       │
  └──────┴────────────────────┴───────────────────────────────────────────────────────┘
  Phase 2 - 부가 기능
  ┌──────┬───────────┐
  │ 단계 │   내용      │
  ├──────┼───────────┤
  │ 8    │ 리뷰 기능   │
  ├──────┼───────────┤
  │ 9    │ 쿠폰 기능   │
  └──────┴───────────┘
  Phase 3 - Admin 대시보드
  ┌──────┬─────────────────┐
  │ 단계 │      내용         │
  ├──────┼─────────────────┤
  │ 10   │ Admin 기반 설정   │
  ├──────┼─────────────────┤
  │ 11   │ 상품 관리         │
  ├──────┼─────────────────┤
  │ 12   │ 주문 관리         │
  ├──────┼─────────────────┤
  │ 13   │ 고객 관리         │
  ├──────┼─────────────────┤
  │ 14   │ 통계 대시보드      │
  └──────┴─────────────────┘
  Phase 4 - Mobile App
  ┌──────┬─────────────────────────┐
  │ 단계 │          내용             │
  ├──────┼─────────────────────────┤
  │ 15   │ Mobile 기반 설정 (Expo)   │
  ├──────┼─────────────────────────┤
  │ 16   │ Mobile 핵심 기능          │
  └──────┴─────────────────────────┘

### 프로젝트 구조

```
apps/
├── web/                          # 고객용 웹 (Next.js 14)
│   └── src/
│       ├── app/                  # App Router 페이지
│       │   ├── (auth)/           # 인증 관련 페이지 그룹
│       │   │   ├── login/
│       │   │   ├── register/
│       │   │   └── layout.tsx
│       │   ├── (shop)/           # 쇼핑 페이지 그룹
│       │   │   ├── products/
│       │   │   ├── cart/
│       │   │   └── layout.tsx
│       │   ├── (mypage)/         # 마이페이지 그룹
│       │   │   ├── orders/
│       │   │   ├── profile/
│       │   │   ├── addresses/
│       │   │   └── layout.tsx
│       │   ├── checkout/
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── features/             # 기능별 모듈
│       │   ├── auth/
│       │   ├── product/
│       │   ├── cart/
│       │   ├── order/
│       │   ├── customer/
│       │   └── payment/
│       ├── shared/               # 공유 컴포넌트/유틸
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── utils/
│       │   └── constants/
│       ├── lib/                  # 라이브러리 설정
│       │   ├── api/
│       │   ├── auth/
│       │   └── providers/
│       └── styles/
│
├── admin/                        # 관리자 대시보드 (Next.js 14)
│   └── src/
│       ├── app/
│       │   ├── (dashboard)/
│       │   │   ├── page.tsx          # 대시보드 홈
│       │   │   ├── products/
│       │   │   ├── orders/
│       │   │   ├── customers/
│       │   │   ├── coupons/
│       │   │   └── analytics/
│       │   ├── auth/
│       │   └── layout.tsx
│       ├── features/
│       └── shared/
│
└── mobile/                       # 모바일 앱 (Expo + React Native)
    └── app/                      # Expo Router 페이지
        ├── (tabs)/
        │   ├── index.tsx         # 홈
        │   ├── search.tsx        # 검색
        │   ├── cart.tsx          # 장바구니
        │   └── mypage.tsx        # 마이페이지
        ├── product/
        ├── auth/
        ├── order/
        └── _layout.tsx
```

---

## Feature 모듈 구조

각 Feature는 다음 구조를 따릅니다:

```
features/auth/
├── api/
│   └── authApi.ts              # API 호출 함수
├── components/
│   ├── LoginForm/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.test.tsx
│   │   └── index.ts
│   ├── RegisterForm/
│   └── index.ts
├── hooks/
│   ├── useLogin.ts             # React Query mutation
│   ├── useRegister.ts
│   ├── useLogout.ts
│   └── index.ts
├── store/
│   └── authStore.ts            # Zustand store
├── types.ts                    # 타입 정의
├── constants.ts                # 상수
└── index.ts                    # 공개 API (barrel export)
```

---

## 구현 단계별 상세 계획

### Phase 1 (MVP) - 핵심 기능

---

#### 단계 1: 프로젝트 기반 설정
**목표**: 모든 앱에서 공통으로 사용할 기반 설정

**구현 파일 (apps/web)**:
```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts           # Axios 인스턴스
│   │   ├── interceptors.ts     # Request/Response 인터셉터
│   │   └── types.ts            # API 응답 타입
│   ├── auth/
│   │   ├── tokenManager.ts     # JWT 토큰 관리
│   │   └── authContext.tsx     # 인증 Context
│   └── providers/
│       ├── QueryProvider.tsx   # React Query Provider
│       ├── AuthProvider.tsx    # 인증 Provider
│       └── index.tsx           # 통합 Provider
├── shared/
│   ├── types/
│   │   ├── api.ts              # API 공통 타입
│   │   ├── product.ts          # 상품 타입
│   │   ├── customer.ts         # 고객 타입
│   │   ├── order.ts            # 주문 타입
│   │   └── index.ts
│   ├── components/
│   │   ├── ui/                 # 기본 UI 컴포넌트
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Toast/
│   │   │   ├── Skeleton/
│   │   │   ├── Badge/
│   │   │   ├── Spinner/
│   │   │   └── index.ts
│   │   └── layout/
│   │       ├── Header/
│   │       ├── Footer/
│   │       ├── Navigation/
│   │       └── index.ts
│   ├── hooks/
│   │   ├── useToast.ts
│   │   ├── useModal.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   └── utils/
│       ├── format.ts           # 포맷팅 유틸
│       ├── validation.ts       # 유효성 검증
│       └── cn.ts               # className 유틸
└── styles/
    └── globals.css             # Tailwind 글로벌 스타일
```

**구현 순서**:

1. **API 클라이언트 설정**
```typescript
// lib/api/client.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from '../auth/tokenManager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await tokenManager.refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

2. **토큰 매니저**
```typescript
// lib/auth/tokenManager.ts
import { apiClient } from '../api/client';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    tokenManager.setAccessToken(accessToken);
    tokenManager.setRefreshToken(refreshToken);
  },

  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  refreshAccessToken: async (): Promise<string> => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/api/v1/auth/refresh', {
      refreshToken,
    });

    const newAccessToken = response.data.accessToken;
    tokenManager.setAccessToken(newAccessToken);
    return newAccessToken;
  },
};
```

3. **공통 타입 정의**
```typescript
// shared/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  errorCode: string;
  message: string;
  timestamp: string;
  details?: Record<string, string>;
}
```

4. **React Query Provider 설정**
```typescript
// lib/providers/QueryProvider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5분
            gcTime: 1000 * 60 * 30,   // 30분
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

5. **기본 UI 컴포넌트**
```typescript
// shared/components/ui/Button/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';
import { Spinner } from '../Spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        ghost: 'text-gray-700 hover:bg-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Spinner size="sm" className="mr-2" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**완료 조건**:
- [ ] API 클라이언트 설정 완료
- [ ] JWT 토큰 관리 구현
- [ ] React Query Provider 설정
- [ ] 기본 UI 컴포넌트 (Button, Input, Card, Modal, Toast, Skeleton)
- [ ] 레이아웃 컴포넌트 (Header, Footer, Navigation)
- [ ] 공통 훅 (useToast, useModal, useDebounce)
- [ ] Tailwind 테마 설정

---

#### 단계 2: 인증 기능 (Auth Feature)
**목표**: 회원가입, 로그인, 로그아웃, 토큰 갱신

**구현 파일**:
```
src/features/auth/
├── api/
│   └── authApi.ts
├── components/
│   ├── LoginForm/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.schema.ts     # Zod 스키마
│   │   └── index.ts
│   ├── RegisterForm/
│   │   ├── RegisterForm.tsx
│   │   ├── RegisterForm.schema.ts
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── useLogin.ts
│   ├── useRegister.ts
│   ├── useLogout.ts
│   ├── useRefreshToken.ts
│   ├── useAuth.ts                  # 인증 상태 확인
│   └── index.ts
├── store/
│   └── authStore.ts
├── types.ts
└── index.ts

src/app/(auth)/
├── login/
│   └── page.tsx
├── register/
│   └── page.tsx
└── layout.tsx
```

**API 연동**:
```typescript
// features/auth/api/authApi.ts
import { apiClient } from '@/lib/api/client';
import type { LoginRequest, LoginResponse, RegisterRequest, CustomerResponse, TokenRefreshRequest, TokenRefreshResponse } from '../types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<CustomerResponse> => {
    const response = await apiClient.post('/api/v1/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/api/v1/auth/login', data);
    return response.data;
  },

  refreshToken: async (data: TokenRefreshRequest): Promise<TokenRefreshResponse> => {
    const response = await apiClient.post('/api/v1/auth/refresh', data);
    return response.data;
  },
};
```

**Zustand Store**:
```typescript
// features/auth/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { tokenManager } from '@/lib/auth/tokenManager';
import { authApi } from '../api/authApi';
import type { Customer, LoginRequest, RegisterRequest } from '../types';

interface AuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  setCustomer: (customer: Customer) => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      customer: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(data);
          tokenManager.setTokens(response.accessToken, response.refreshToken);
          set({
            customer: response.customer,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          await authApi.register(data);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        tokenManager.clearTokens();
        set({
          customer: null,
          isAuthenticated: false,
        });
      },

      setCustomer: (customer) => {
        set({ customer, isAuthenticated: true });
      },

      checkAuth: () => {
        const token = tokenManager.getAccessToken();
        if (!token) {
          set({ isAuthenticated: false, customer: null });
          return false;
        }
        return get().isAuthenticated;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        customer: state.customer,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

**React Query Hooks**:
```typescript
// features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useToast } from '@/shared/hooks';
import type { LoginRequest } from '../types';

export const useLogin = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: () => {
      showToast({ type: 'success', message: '로그인되었습니다.' });
      router.push('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '로그인에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};

// features/auth/hooks/useRegister.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useToast } from '@/shared/hooks';
import type { RegisterRequest } from '../types';

export const useRegister = () => {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: () => {
      showToast({ type: 'success', message: '회원가입이 완료되었습니다.' });
      router.push('/login');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '회원가입에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};
```

**로그인 폼 컴포넌트**:
```typescript
// features/auth/components/LoginForm/LoginForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@/shared/components/ui';
import { useLogin } from '../../hooks';
import { loginSchema, type LoginFormData } from './LoginForm.schema';

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          type="email"
          label="이메일"
          placeholder="이메일을 입력하세요"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div>
        <Input
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <Button type="submit" fullWidth isLoading={isPending}>
        로그인
      </Button>
    </form>
  );
}
```

**Protected Route Middleware**:
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/cart', '/checkout', '/orders', '/mypage'];
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // 보호된 페이지에 토큰 없이 접근 시 로그인으로 리다이렉트
  if (protectedPaths.some((path) => pathname.startsWith(path)) && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 로그인된 상태에서 인증 페이지 접근 시 홈으로 리다이렉트
  if (authPaths.some((path) => pathname.startsWith(path)) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cart/:path*', '/checkout/:path*', '/orders/:path*', '/mypage/:path*', '/login', '/register'],
};
```

**완료 조건**:
- [ ] 로그인 폼 구현 (이메일/비밀번호 검증)
- [ ] 회원가입 폼 구현
- [ ] JWT 토큰 저장 및 관리
- [ ] 자동 토큰 갱신
- [ ] Protected Route 구현
- [ ] 로그아웃 기능
- [ ] 인증 상태 전역 관리

---

#### 단계 3: 상품 기능 (Product Feature)
**목표**: 상품 목록, 검색, 필터링, 상세 조회

**구현 파일**:
```
src/features/product/
├── api/
│   └── productApi.ts
├── components/
│   ├── ProductList/
│   │   ├── ProductList.tsx
│   │   ├── ProductListSkeleton.tsx
│   │   └── index.ts
│   ├── ProductCard/
│   │   ├── ProductCard.tsx
│   │   └── index.ts
│   ├── ProductDetail/
│   │   ├── ProductDetail.tsx
│   │   ├── ProductInfo.tsx
│   │   ├── ProductImages.tsx
│   │   ├── ProductOptions.tsx
│   │   └── index.ts
│   ├── ProductSearch/
│   │   ├── SearchBar.tsx
│   │   ├── SearchFilters.tsx
│   │   ├── SearchResults.tsx
│   │   └── index.ts
│   ├── CategoryNav/
│   │   └── CategoryNav.tsx
│   └── index.ts
├── hooks/
│   ├── useProducts.ts
│   ├── useProduct.ts
│   ├── useProductSearch.ts
│   ├── useCategories.ts
│   ├── useInfiniteProducts.ts
│   └── index.ts
├── types.ts
└── index.ts

src/app/(shop)/
├── products/
│   ├── page.tsx                    # 상품 목록
│   └── [id]/
│       └── page.tsx                # 상품 상세
├── categories/
│   └── [slug]/
│       └── page.tsx                # 카테고리별 상품
└── search/
    └── page.tsx                    # 검색 결과
```

**API 연동**:
```typescript
// features/product/api/productApi.ts
import { apiClient } from '@/lib/api/client';
import type {
  Product,
  ProductSearchParams,
  Category,
  ApiResponse,
  PageResponse
} from '../types';

export const productApi = {
  // 상품 목록 조회 (페이징)
  getProducts: async (params: ProductSearchParams): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>('/api/v1/products', { params });
    return response.data;
  },

  // 상품 상세 조회
  getProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/api/v1/products/${id}`);
    return response.data;
  },

  // 카테고리 목록 조회
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/api/v1/categories');
    return response.data;
  },

  // 카테고리별 상품 조회
  getProductsByCategory: async (categoryId: number, params: ProductSearchParams): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>('/api/v1/products', {
      params: { ...params, categoryId },
    });
    return response.data;
  },
};
```

**React Query Hooks**:
```typescript
// features/product/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import type { ProductSearchParams } from '../types';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductSearchParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

export const useProducts = (params: ProductSearchParams) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// features/product/hooks/useProduct.ts
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
  });
};

// features/product/hooks/useInfiniteProducts.ts
import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfiniteProducts = (params: Omit<ProductSearchParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', params],
    queryFn: ({ pageParam = 0 }) =>
      productApi.getProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
  });
};
```

**상품 카드 컴포넌트**:
```typescript
// features/product/components/ProductCard/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/shared/utils/format';
import { Badge } from '@/shared/components/ui';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.status === 'OUT_OF_STOCK';
  const isDiscounted = product.originalPrice && product.originalPrice > product.price;
  const discountRate = isDiscounted
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.imageUrl || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-white font-medium">품절</span>
          </div>
        )}
        {isDiscounted && !isOutOfStock && (
          <Badge className="absolute top-2 left-2" variant="danger">
            {discountRate}% OFF
          </Badge>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-sm text-gray-500">{product.brand}</p>
        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{formatPrice(product.price)}</span>
          {isDiscounted && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
```

**상품 목록 페이지**:
```typescript
// app/(shop)/products/page.tsx
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductList, ProductSearch, CategoryNav } from '@/features/product';
import { useProducts, useCategories } from '@/features/product/hooks';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    page: 0,
    size: 20,
    categoryId: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
    keyword: searchParams.get('q') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: searchParams.get('sort') || 'createdAt',
    sortDir: searchParams.get('dir') || 'desc',
  });

  const { data: products, isLoading, error } = useProducts(filters);
  const { data: categories } = useCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* 사이드바: 카테고리 & 필터 */}
        <aside className="hidden lg:block w-64 shrink-0">
          <CategoryNav categories={categories || []} />
          <ProductSearch.Filters
            filters={filters}
            onFilterChange={setFilters}
          />
        </aside>

        {/* 메인: 상품 목록 */}
        <main className="flex-1">
          <ProductSearch.Bar
            keyword={filters.keyword}
            onSearch={(keyword) => setFilters({ ...filters, keyword, page: 0 })}
          />

          <ProductList
            products={products?.content || []}
            isLoading={isLoading}
            error={error}
          />

          {/* 페이지네이션 */}
          {products && (
            <Pagination
              currentPage={products.page}
              totalPages={products.totalPages}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          )}
        </main>
      </div>
    </div>
  );
}
```

**완료 조건**:
- [ ] 상품 목록 조회 (그리드 레이아웃)
- [ ] 상품 상세 조회
- [ ] 검색 기능
- [ ] 카테고리 필터링
- [ ] 가격 필터링
- [ ] 정렬 기능
- [ ] 페이지네이션
- [ ] 무한 스크롤 (선택적)
- [ ] 상품 이미지 최적화
- [ ] 스켈레톤 로딩

---

#### 단계 4: 장바구니 기능 (Cart Feature)
**목표**: 장바구니 추가/수정/삭제, 수량 변경, 총액 계산

**구현 파일**:
```
src/features/cart/
├── api/
│   └── cartApi.ts
├── components/
│   ├── CartList/
│   │   ├── CartList.tsx
│   │   ├── CartItem.tsx
│   │   └── index.ts
│   ├── CartSummary/
│   │   └── CartSummary.tsx
│   ├── CartButton/
│   │   └── CartButton.tsx           # 헤더용 장바구니 버튼
│   ├── AddToCartButton/
│   │   └── AddToCartButton.tsx
│   └── index.ts
├── hooks/
│   ├── useCart.ts
│   ├── useAddToCart.ts
│   ├── useUpdateCartItem.ts
│   ├── useRemoveCartItem.ts
│   ├── useClearCart.ts
│   └── index.ts
├── store/
│   └── cartStore.ts                 # 로컬 장바구니 상태 (비로그인용)
├── types.ts
└── index.ts

src/app/(shop)/cart/
└── page.tsx
```

**API 연동**:
```typescript
// features/cart/api/cartApi.ts
import { apiClient } from '@/lib/api/client';
import type { Cart, CartItemRequest, ApiResponse } from '../types';

export const cartApi = {
  // 내 장바구니 조회
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>('/api/v1/carts/me');
    return response.data;
  },

  // 장바구니에 상품 추가
  addItem: async (data: CartItemRequest): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>('/api/v1/carts/items', data);
    return response.data;
  },

  // 수량 변경
  updateItem: async (itemId: number, quantity: number): Promise<Cart> => {
    const response = await apiClient.put<ApiResponse<Cart>>(
      `/api/v1/carts/items/${itemId}`,
      { quantity }
    );
    return response.data;
  },

  // 상품 삭제
  removeItem: async (itemId: number): Promise<void> => {
    await apiClient.delete(`/api/v1/carts/items/${itemId}`);
  },

  // 장바구니 비우기
  clearCart: async (): Promise<void> => {
    await apiClient.delete('/api/v1/carts/me');
  },
};
```

**React Query Hooks**:
```typescript
// features/cart/hooks/useCart.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cartApi';
import { useAuthStore } from '@/features/auth';
import { useToast } from '@/shared/hooks';

export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

export const useCart = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60, // 1분
  });
};

// features/cart/hooks/useAddToCart.ts
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      showToast({ type: 'success', message: '장바구니에 추가되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '장바구니 추가에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};

// features/cart/hooks/useUpdateCartItem.ts
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

// features/cart/hooks/useRemoveCartItem.ts
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      showToast({ type: 'success', message: '상품이 삭제되었습니다.' });
    },
  });
};
```

**장바구니 아이템 컴포넌트**:
```typescript
// features/cart/components/CartList/CartItem.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus } from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import { useUpdateCartItem, useRemoveCartItem } from '../../hooks';
import type { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem({ itemId: item.id, quantity: newQuantity });
  };

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* 상품 이미지 */}
      <Link href={`/products/${item.productId}`} className="shrink-0">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={item.productImage || '/placeholder.png'}
            alt={item.productName}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* 상품 정보 */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.productId}`}>
          <h3 className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2">
            {item.productName}
          </h3>
        </Link>
        <p className="text-lg font-bold mt-1">{formatPrice(item.price)}</p>

        {/* 수량 조절 */}
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1 || isUpdating}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 소계 & 삭제 */}
      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(item.id)}
          disabled={isRemoving}
        >
          <Trash2 className="w-4 h-4 text-gray-400" />
        </Button>
        <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
      </div>
    </div>
  );
}
```

**완료 조건**:
- [ ] 장바구니 조회
- [ ] 상품 추가 (상세 페이지에서)
- [ ] 수량 변경
- [ ] 상품 삭제
- [ ] 장바구니 비우기
- [ ] 총액 계산
- [ ] 선택 구매 기능
- [ ] 비로그인 장바구니 (localStorage)

---

#### 단계 5: 고객 기능 (Customer Feature)
**목표**: 마이페이지, 프로필 수정, 배송지 관리

**구현 파일**:
```
src/features/customer/
├── api/
│   └── customerApi.ts
├── components/
│   ├── ProfileForm/
│   │   └── ProfileForm.tsx
│   ├── AddressList/
│   │   ├── AddressList.tsx
│   │   ├── AddressCard.tsx
│   │   └── index.ts
│   ├── AddressForm/
│   │   ├── AddressForm.tsx
│   │   ├── AddressForm.schema.ts
│   │   └── index.ts
│   ├── PasswordChangeForm/
│   │   └── PasswordChangeForm.tsx
│   └── index.ts
├── hooks/
│   ├── useCustomer.ts
│   ├── useUpdateProfile.ts
│   ├── useAddresses.ts
│   ├── useAddAddress.ts
│   ├── useUpdateAddress.ts
│   ├── useDeleteAddress.ts
│   ├── useChangePassword.ts
│   └── index.ts
├── types.ts
└── index.ts

src/app/(mypage)/
├── layout.tsx                    # 마이페이지 레이아웃
├── page.tsx                      # 마이페이지 홈
├── profile/
│   └── page.tsx                  # 프로필 수정
├── addresses/
│   ├── page.tsx                  # 배송지 목록
│   └── new/
│       └── page.tsx              # 배송지 추가
└── password/
    └── page.tsx                  # 비밀번호 변경
```

**API 연동**:
```typescript
// features/customer/api/customerApi.ts
import { apiClient } from '@/lib/api/client';
import type {
  Customer,
  UpdateProfileRequest,
  Address,
  AddressRequest,
  PasswordChangeRequest,
  ApiResponse,
} from '../types';

export const customerApi = {
  // 내 정보 조회
  getMe: async (): Promise<Customer> => {
    const response = await apiClient.get<ApiResponse<Customer>>('/api/v1/customers/me');
    return response.data;
  },

  // 프로필 수정
  updateProfile: async (data: UpdateProfileRequest): Promise<Customer> => {
    const response = await apiClient.put<ApiResponse<Customer>>('/api/v1/customers/me', data);
    return response.data;
  },

  // 비밀번호 변경
  changePassword: async (data: PasswordChangeRequest): Promise<void> => {
    await apiClient.put('/api/v1/customers/me/password', data);
  },

  // 배송지 추가
  addAddress: async (data: AddressRequest): Promise<Address> => {
    const response = await apiClient.post<ApiResponse<Address>>('/api/v1/customers/me/addresses', data);
    return response.data;
  },

  // 배송지 수정
  updateAddress: async (addressId: number, data: AddressRequest): Promise<Address> => {
    const response = await apiClient.put<ApiResponse<Address>>(
      `/api/v1/customers/me/addresses/${addressId}`,
      data
    );
    return response.data;
  },

  // 배송지 삭제
  deleteAddress: async (addressId: number): Promise<void> => {
    await apiClient.delete(`/api/v1/customers/me/addresses/${addressId}`);
  },

  // 기본 배송지 설정
  setDefaultAddress: async (addressId: number): Promise<void> => {
    await apiClient.patch(`/api/v1/customers/me/addresses/${addressId}/default`);
  },

  // 회원탈퇴
  withdraw: async (reason?: string): Promise<void> => {
    await apiClient.delete('/api/v1/customers/me', { data: { reason } });
  },
};
```

**완료 조건**:
- [ ] 내 정보 조회
- [ ] 프로필 수정
- [ ] 비밀번호 변경
- [ ] 배송지 목록 조회
- [ ] 배송지 추가
- [ ] 배송지 수정
- [ ] 배송지 삭제
- [ ] 기본 배송지 설정
- [ ] 회원탈퇴

---

#### 단계 6: 주문 기능 (Order Feature)
**목표**: 주문 생성, 주문 목록/상세 조회, 주문 취소

**구현 파일**:
```
src/features/order/
├── api/
│   └── orderApi.ts
├── components/
│   ├── OrderList/
│   │   ├── OrderList.tsx
│   │   ├── OrderCard.tsx
│   │   └── index.ts
│   ├── OrderDetail/
│   │   ├── OrderDetail.tsx
│   │   ├── OrderItems.tsx
│   │   ├── OrderStatus.tsx
│   │   └── index.ts
│   ├── OrderForm/                # 주문서 작성
│   │   ├── OrderForm.tsx
│   │   ├── ShippingInfo.tsx
│   │   ├── PaymentMethod.tsx
│   │   ├── OrderSummary.tsx
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── useOrders.ts
│   ├── useOrder.ts
│   ├── useCreateOrder.ts
│   ├── useCancelOrder.ts
│   ├── useConfirmOrder.ts
│   └── index.ts
├── types.ts
└── index.ts

src/app/
├── checkout/
│   └── page.tsx                  # 주문서 작성/결제
├── (mypage)/orders/
│   ├── page.tsx                  # 주문 목록
│   └── [id]/
│       └── page.tsx              # 주문 상세
└── order-complete/
    └── page.tsx                  # 주문 완료
```

**API 연동**:
```typescript
// features/order/api/orderApi.ts
import { apiClient } from '@/lib/api/client';
import type {
  Order,
  OrderCreateRequest,
  OrderSearchParams,
  ApiResponse,
  PageResponse,
} from '../types';

export const orderApi = {
  // 주문 생성
  createOrder: async (data: OrderCreateRequest): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/api/v1/orders', data);
    return response.data;
  },

  // 내 주문 목록 조회
  getOrders: async (params: OrderSearchParams): Promise<PageResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Order>>>('/api/v1/orders', { params });
    return response.data;
  },

  // 주문 상세 조회
  getOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/api/v1/orders/${id}`);
    return response.data;
  },

  // 주문 취소
  cancelOrder: async (id: number, reason?: string): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(
      `/api/v1/orders/${id}/cancel`,
      { reason }
    );
    return response.data;
  },

  // 구매 확정
  confirmOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(`/api/v1/orders/${id}/complete`);
    return response.data;
  },
};
```

**완료 조건**:
- [ ] 주문서 작성 페이지
- [ ] 배송지 선택/입력
- [ ] 결제 수단 선택
- [ ] 주문 생성
- [ ] 주문 완료 페이지
- [ ] 주문 목록 조회
- [ ] 주문 상세 조회
- [ ] 주문 취소
- [ ] 구매 확정
- [ ] 주문 상태 표시

---

#### 단계 7: 결제 기능 (Payment Feature)
**목표**: 결제 연동 (Toss Payments)

**구현 파일**:
```
src/features/payment/
├── api/
│   └── paymentApi.ts
├── components/
│   ├── PaymentWidget/
│   │   └── PaymentWidget.tsx     # Toss Payments 위젯
│   ├── PaymentMethods/
│   │   └── PaymentMethods.tsx
│   └── index.ts
├── hooks/
│   ├── usePayment.ts
│   ├── usePaymentConfirm.ts
│   └── index.ts
├── types.ts
└── index.ts

src/app/
├── checkout/
│   └── page.tsx                  # 결제 포함
└── payment/
    ├── success/
    │   └── page.tsx              # 결제 성공 콜백
    └── fail/
        └── page.tsx              # 결제 실패 콜백
```

**Toss Payments 연동**:
```typescript
// features/payment/components/PaymentWidget/PaymentWidget.tsx
'use client';

import { useEffect, useRef } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';

interface PaymentWidgetProps {
  clientKey: string;
  customerKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  onSuccess: () => void;
  onFail: (error: Error) => void;
}

export function PaymentWidget({
  clientKey,
  customerKey,
  amount,
  orderId,
  orderName,
  onSuccess,
  onFail,
}: PaymentWidgetProps) {
  const paymentWidgetRef = useRef<any>(null);
  const paymentMethodsWidgetRef = useRef<any>(null);

  useEffect(() => {
    const initWidget = async () => {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey });

      paymentWidgetRef.current = widgets;

      await widgets.setAmount({ currency: 'KRW', value: amount });

      await Promise.all([
        widgets.renderPaymentMethods({
          selector: '#payment-methods',
          variantKey: 'DEFAULT',
        }),
        widgets.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT',
        }),
      ]);

      paymentMethodsWidgetRef.current = widgets;
    };

    initWidget();
  }, [clientKey, customerKey, amount]);

  const handlePayment = async () => {
    try {
      await paymentWidgetRef.current?.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
      onSuccess();
    } catch (error) {
      onFail(error as Error);
    }
  };

  return (
    <div className="space-y-4">
      <div id="payment-methods" />
      <div id="agreement" />
      <Button onClick={handlePayment} fullWidth size="lg">
        {formatPrice(amount)} 결제하기
      </Button>
    </div>
  );
}
```

**완료 조건**:
- [ ] Toss Payments SDK 연동
- [ ] 결제 위젯 구현
- [ ] 결제 요청
- [ ] 결제 성공/실패 처리
- [ ] 결제 확인 API 호출
- [ ] 주문 상태 업데이트

---

### Phase 2 - 부가 기능

---

#### 단계 8: 리뷰 기능 (Review Feature)
**목표**: 상품 리뷰 작성/조회

**구현 파일**:
```
src/features/review/
├── api/
│   └── reviewApi.ts
├── components/
│   ├── ReviewList/
│   ├── ReviewCard/
│   ├── ReviewForm/
│   ├── ReviewRating/
│   └── index.ts
├── hooks/
│   ├── useReviews.ts
│   ├── useCreateReview.ts
│   ├── useUpdateReview.ts
│   ├── useDeleteReview.ts
│   └── index.ts
├── types.ts
└── index.ts
```

**완료 조건**:
- [ ] 상품별 리뷰 목록 조회
- [ ] 리뷰 작성 (구매 확정 후)
- [ ] 별점 입력
- [ ] 리뷰 이미지 업로드
- [ ] 리뷰 수정/삭제
- [ ] 평균 별점 표시

---

#### 단계 9: 쿠폰 기능 (Coupon Feature)
**목표**: 쿠폰 조회/적용

**구현 파일**:
```
src/features/coupon/
├── api/
│   └── couponApi.ts
├── components/
│   ├── CouponList/
│   ├── CouponCard/
│   ├── CouponSelector/           # 주문 시 쿠폰 선택
│   └── index.ts
├── hooks/
│   ├── useCoupons.ts
│   ├── useApplyCoupon.ts
│   └── index.ts
├── types.ts
└── index.ts
```

**완료 조건**:
- [ ] 내 쿠폰 목록 조회
- [ ] 쿠폰 발급 받기
- [ ] 주문 시 쿠폰 선택
- [ ] 할인 금액 계산
- [ ] 쿠폰 유효성 검증

---

### Phase 3 - Admin 대시보드

---

#### 단계 10: Admin 기반 설정
**목표**: 관리자 대시보드 기반 구축

**구현 파일 (apps/admin)**:
```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx            # 대시보드 레이아웃 (사이드바)
│   │   └── page.tsx              # 대시보드 홈
│   ├── auth/
│   │   └── login/
│   │       └── page.tsx
│   └── layout.tsx
├── features/
│   ├── auth/                     # 관리자 인증
│   ├── dashboard/                # 대시보드 위젯
│   ├── product-management/       # 상품 관리
│   ├── order-management/         # 주문 관리
│   ├── customer-management/      # 고객 관리
│   └── analytics/                # 통계
├── shared/
│   ├── components/
│   │   ├── Sidebar/
│   │   ├── DataTable/            # 데이터 테이블
│   │   ├── Charts/               # 차트 컴포넌트
│   │   └── index.ts
│   └── hooks/
└── lib/
```

**완료 조건**:
- [ ] 관리자 로그인
- [ ] 대시보드 레이아웃 (사이드바 네비게이션)
- [ ] 권한 체크

---

#### 단계 11: 상품 관리
**목표**: 상품 CRUD (관리자)

**구현 파일**:
```
src/features/product-management/
├── api/
│   └── productManagementApi.ts
├── components/
│   ├── ProductTable/
│   ├── ProductForm/
│   ├── ProductImageUpload/
│   └── index.ts
├── hooks/
│   ├── useAdminProducts.ts
│   ├── useCreateProduct.ts
│   ├── useUpdateProduct.ts
│   ├── useDeleteProduct.ts
│   └── index.ts
└── types.ts

src/app/(dashboard)/products/
├── page.tsx                      # 상품 목록
├── new/
│   └── page.tsx                  # 상품 등록
└── [id]/
    └── edit/
        └── page.tsx              # 상품 수정
```

**완료 조건**:
- [ ] 상품 목록 테이블
- [ ] 상품 검색/필터링
- [ ] 상품 등록 폼
- [ ] 상품 수정
- [ ] 상품 삭제
- [ ] 재고 관리
- [ ] 상품 상태 변경 (발행/비활성화)

---

#### 단계 12: 주문 관리
**목표**: 주문 조회 및 상태 관리 (관리자)

**구현 파일**:
```
src/features/order-management/
├── api/
│   └── orderManagementApi.ts
├── components/
│   ├── OrderTable/
│   ├── OrderDetail/
│   ├── OrderStatusBadge/
│   └── index.ts
├── hooks/
│   ├── useAdminOrders.ts
│   ├── useAdminOrder.ts
│   ├── useUpdateOrderStatus.ts
│   └── index.ts
└── types.ts

src/app/(dashboard)/orders/
├── page.tsx                      # 주문 목록
└── [id]/
    └── page.tsx                  # 주문 상세
```

**완료 조건**:
- [ ] 주문 목록 테이블
- [ ] 주문 상태별 필터링
- [ ] 주문 상세 조회
- [ ] 주문 상태 변경
- [ ] 배송 정보 입력

---

#### 단계 13: 고객 관리
**목표**: 고객 조회 (관리자)

**구현 파일**:
```
src/features/customer-management/
├── api/
│   └── customerManagementApi.ts
├── components/
│   ├── CustomerTable/
│   ├── CustomerDetail/
│   └── index.ts
├── hooks/
│   ├── useAdminCustomers.ts
│   ├── useAdminCustomer.ts
│   └── index.ts
└── types.ts

src/app/(dashboard)/customers/
├── page.tsx                      # 고객 목록
└── [id]/
    └── page.tsx                  # 고객 상세
```

**완료 조건**:
- [ ] 고객 목록 테이블
- [ ] 고객 검색
- [ ] 고객 상세 조회
- [ ] 고객 주문 내역 조회

---

#### 단계 14: 통계 대시보드
**목표**: 매출/주문 통계

**구현 파일**:
```
src/features/analytics/
├── api/
│   └── analyticsApi.ts
├── components/
│   ├── SalesChart/
│   ├── OrdersChart/
│   ├── TopProducts/
│   ├── RecentOrders/
│   ├── StatCard/
│   └── index.ts
├── hooks/
│   ├── useSalesStats.ts
│   ├── useOrderStats.ts
│   ├── useTopProducts.ts
│   └── index.ts
└── types.ts

src/app/(dashboard)/analytics/
└── page.tsx
```

**완료 조건**:
- [ ] 일별/월별 매출 차트
- [ ] 주문 현황 차트
- [ ] 베스트셀러 상품
- [ ] 최근 주문 목록
- [ ] 통계 카드 (총 매출, 주문 수, 신규 고객 등)

---

### Phase 4 - Mobile App

---

#### 단계 15: Mobile 기반 설정 (Expo)
**목표**: 모바일 앱 기반 구축

**구현 파일 (apps/mobile)**:
```
app/
├── (tabs)/
│   ├── _layout.tsx               # 탭 네비게이션
│   ├── index.tsx                 # 홈
│   ├── search.tsx                # 검색
│   ├── cart.tsx                  # 장바구니
│   └── mypage.tsx                # 마이페이지
├── auth/
│   ├── login.tsx
│   └── register.tsx
├── product/
│   └── [id].tsx
├── order/
│   ├── index.tsx                 # 주문 목록
│   └── [id].tsx                  # 주문 상세
├── checkout.tsx
├── _layout.tsx                   # 루트 레이아웃
└── +not-found.tsx

src/
├── features/                     # Web과 유사한 구조
├── shared/
│   ├── components/               # React Native 컴포넌트
│   └── hooks/
└── lib/
    └── api/
```

**완료 조건**:
- [ ] Expo Router 설정
- [ ] 탭 네비게이션
- [ ] 인증 플로우
- [ ] API 클라이언트 (Web과 공유)
- [ ] 기본 UI 컴포넌트 (React Native)

---

#### 단계 16: Mobile 핵심 기능
**목표**: 모바일 앱 주요 기능 구현

**완료 조건**:
- [ ] 홈 화면 (추천 상품, 배너)
- [ ] 상품 검색
- [ ] 상품 상세
- [ ] 장바구니
- [ ] 주문/결제
- [ ] 주문 내역
- [ ] 마이페이지
- [ ] 푸시 알림 설정

---

## 테스트 전략

### 단위 테스트 (Vitest)

```typescript
// features/product/hooks/useProducts.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from './useProducts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useProducts', () => {
  it('should fetch products successfully', async () => {
    const { result } = renderHook(() => useProducts({ page: 0, size: 20 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.content).toHaveLength(20);
  });
});
```

### E2E 테스트 (Playwright)

```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('should complete checkout', async ({ page }) => {
    // 상품 상세 페이지로 이동
    await page.goto('/products/1');

    // 장바구니에 추가
    await page.click('button:has-text("장바구니")');

    // 장바구니로 이동
    await page.goto('/cart');

    // 주문하기
    await page.click('button:has-text("주문하기")');

    // 주문서 페이지 확인
    await expect(page).toHaveURL('/checkout');
  });
});
```

---

## 배포

### Vercel (Web/Admin)

```yaml
# vercel.json
{
  "buildCommand": "pnpm turbo build --filter=web",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs"
}
```

### EAS (Mobile)

```json
// eas.json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

---

## 환경 변수

### Web/Admin (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxx
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Mobile (.env)

```env
EXPO_PUBLIC_API_URL=http://localhost:8080/api
EXPO_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxx
```

---

## 참고 문서

- [Backend API Specifications](../../backend/docs/API_SPECIFICATIONS.md)
- [Backend Implementation Guide](../../backend/IMPLEMENTATION_GUIDE.md)
- [Frontend Overview](./FRONTEND_OVERVIEW.md)
- [API Integration Guide](./API_INTEGRATION.md)
