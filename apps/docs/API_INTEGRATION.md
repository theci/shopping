# API Integration Guide

프론트엔드와 백엔드 API 통합 가이드

---

## 📡 API 클라이언트 설정

### 1. Axios Instance 생성

```typescript
// lib/api/client.ts
import axios, { AxiosError, AxiosResponse } from 'axios';
import { tokenManager } from '@/lib/auth/tokenManager';
import type { ApiResponse } from '@repo/shared-types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // Backend ApiResponse 구조에서 data만 추출
    return response.data.data;
  },
  async (error: AxiosError<ApiResponse<any>>) => {
    const originalRequest = error.config;

    // 401 에러 처리 (토큰 만료)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await tokenManager.refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 리프레시 실패 시 로그아웃
        tokenManager.clearTokens();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    // 에러 메시지 추출
    const errorMessage = error.response?.data?.message || '요청 처리 중 오류가 발생했습니다';
    const errorCode = error.response?.data?.errorCode;

    return Promise.reject({
      message: errorMessage,
      code: errorCode,
      status: error.response?.status,
    });
  }
);
```

---

## 🔐 인증 API

### authApi.ts

```typescript
// features/auth/api/authApi.ts
import { apiClient } from '@/lib/api/client';
import type { Customer, ApiResponse } from '@repo/shared-types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  customer: Customer;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToMarketing: boolean;
}

export const authApi = {
  /**
   * 로그인
   * POST /api/v1/auth/login
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },

  /**
   * 회원가입
   * POST /api/v1/auth/register
   */
  register: async (data: RegisterRequest): Promise<Customer> => {
    const response = await apiClient.post<ApiResponse<Customer>>('/auth/register', data);
    return response.data;
  },

  /**
   * 토큰 갱신
   * POST /api/v1/auth/refresh
   */
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data;
  },

  /**
   * 로그아웃
   * POST /api/v1/auth/logout
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
```

### useAuth Hook

```typescript
// features/auth/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, LoginRequest, RegisterRequest } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { tokenManager } from '@/lib/auth/tokenManager';
import { useToast } from '@/hooks/useToast';

export const useAuth = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      // 토큰 저장
      tokenManager.setAccessToken(response.accessToken);
      tokenManager.setRefreshToken(response.refreshToken);

      // 사용자 정보 저장
      setAuth(response.customer, response.accessToken);

      toast({
        title: '로그인 성공',
        description: `${response.customer.name}님, 환영합니다!`,
        type: 'success',
      });

      router.push('/');
    },
    onError: (error: any) => {
      toast({
        title: '로그인 실패',
        description: error.message,
        type: 'error',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      toast({
        title: '회원가입 완료',
        description: '로그인 페이지로 이동합니다',
        type: 'success',
      });

      router.push('/auth/login');
    },
    onError: (error: any) => {
      toast({
        title: '회원가입 실패',
        description: error.message,
        type: 'error',
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      tokenManager.clearTokens();
      clearAuth();
      router.push('/auth/login');
    },
  });

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isLoading,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isLoading,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isLoading,
  };
};
```

---

## 🛍️ 상품 API

### productApi.ts

```typescript
// features/product/api/productApi.ts
import { apiClient } from '@/lib/api/client';
import type { Product, PageResponse, ApiResponse } from '@repo/shared-types';

export interface ProductListParams {
  page?: number;
  size?: number;
  sort?: string;
  categoryId?: number;
  status?: 'ACTIVE' | 'OUT_OF_STOCK';
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
}

export interface ProductSearchParams {
  keyword: string;
  searchType?: 'ALL' | 'NAME' | 'DESCRIPTION';
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export const productApi = {
  /**
   * 상품 목록 조회
   * GET /api/v1/products
   */
  getProducts: async (params: ProductListParams): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>('/products', {
      params,
    });
    return response.data;
  },

  /**
   * 상품 검색
   * GET /api/v1/products/search
   */
  searchProducts: async (params: ProductSearchParams): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>(
      '/products/search',
      { params }
    );
    return response.data;
  },

  /**
   * 상품 상세 조회
   * GET /api/v1/products/:id
   */
  getProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  /**
   * 카테고리 목록 조회
   * GET /api/v1/products/categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/products/categories');
    return response.data;
  },
};
```

### useProducts Hook

```typescript
// features/product/hooks/useProducts.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { productApi, ProductListParams } from '../api/productApi';

export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, 'list'] as const,
  list: (params: ProductListParams) => [...PRODUCT_QUERY_KEYS.lists(), params] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PRODUCT_QUERY_KEYS.details(), id] as const,
};

/**
 * 상품 목록 조회 (페이징)
 */
export const useProducts = (params: ProductListParams) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(params),
    queryFn: () => productApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5분
    keepPreviousData: true,
  });
};

/**
 * 상품 목록 조회 (무한 스크롤)
 */
export const useInfiniteProducts = (params: Omit<ProductListParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(params),
    queryFn: ({ pageParam = 0 }) =>
      productApi.getProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.pageNumber + 1;
    },
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 상품 상세 조회
 */
export const useProductDetail = (id: number) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id),
    queryFn: () => productApi.getProduct(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};
```

---

## 🛒 장바구니 API

### cartApi.ts

```typescript
// features/cart/api/cartApi.ts
import { apiClient } from '@/lib/api/client';
import type { Cart, ApiResponse } from '@repo/shared-types';

export interface AddCartItemRequest {
  productId: number;
  quantity: number;
  options?: Array<{ name: string; value: string }>;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export const cartApi = {
  /**
   * 내 장바구니 조회
   * GET /api/v1/carts/me
   */
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>('/carts/me');
    return response.data;
  },

  /**
   * 장바구니에 상품 추가
   * POST /api/v1/carts/items
   */
  addItem: async (data: AddCartItemRequest): Promise<void> => {
    await apiClient.post('/carts/items', data);
  },

  /**
   * 장바구니 수량 변경
   * PUT /api/v1/carts/items/:cartItemId
   */
  updateItem: async (cartItemId: number, data: UpdateCartItemRequest): Promise<void> => {
    await apiClient.put(`/carts/items/${cartItemId}`, data);
  },

  /**
   * 장바구니에서 상품 제거
   * DELETE /api/v1/carts/items/:cartItemId
   */
  removeItem: async (cartItemId: number): Promise<void> => {
    await apiClient.delete(`/carts/items/${cartItemId}`);
  },

  /**
   * 장바구니 비우기
   * DELETE /api/v1/carts/me
   */
  clearCart: async (): Promise<void> => {
    await apiClient.delete('/carts/me');
  },

  /**
   * 선택 항목 삭제
   * DELETE /api/v1/carts/items/batch
   */
  removeItems: async (cartItemIds: number[]): Promise<void> => {
    await apiClient.delete('/carts/items/batch', { data: { cartItemIds } });
  },
};
```

### useCart & useCartMutations Hooks

```typescript
// features/cart/hooks/useCart.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi, AddCartItemRequest, UpdateCartItemRequest } from '../api/cartApi';
import { useToast } from '@/hooks/useToast';

export const CART_QUERY_KEY = ['cart'];

/**
 * 장바구니 조회
 */
export const useCart = () => {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartApi.getCart(),
    staleTime: 1000 * 60, // 1분
  });
};

/**
 * 장바구니 mutations
 */
export const useCartMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addToCart = useMutation({
    mutationFn: (data: AddCartItemRequest) => cartApi.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries(CART_QUERY_KEY);
      toast({
        title: '장바구니에 추가되었습니다',
        type: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: '장바구니 추가 실패',
        description: error.message,
        type: 'error',
      });
    },
  });

  const updateCartItem = useMutation({
    mutationFn: ({ cartItemId, data }: { cartItemId: number; data: UpdateCartItemRequest }) =>
      cartApi.updateItem(cartItemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(CART_QUERY_KEY);
    },
    onError: (error: any) => {
      toast({
        title: '수량 변경 실패',
        description: error.message,
        type: 'error',
      });
    },
  });

  const removeCartItem = useMutation({
    mutationFn: (cartItemId: number) => cartApi.removeItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries(CART_QUERY_KEY);
      toast({
        title: '상품이 삭제되었습니다',
        type: 'success',
      });
    },
  });

  const clearCart = useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries(CART_QUERY_KEY);
      toast({
        title: '장바구니가 비워졌습니다',
        type: 'success',
      });
    },
  });

  return {
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
  };
};
```

---

## 📦 주문 API

### orderApi.ts

```typescript
// features/order/api/orderApi.ts
import { apiClient } from '@/lib/api/client';
import type { Order, PageResponse, ApiResponse } from '@repo/shared-types';

export interface CreateOrderRequest {
  cartItemIds: number[];
  shippingAddressId?: number;
  customShippingAddress?: {
    name: string;
    phoneNumber: string;
    zipCode: string;
    address: string;
    detailAddress: string;
  };
  couponId?: number;
  usePoint?: number;
  paymentMethod: 'CARD' | 'BANK_TRANSFER' | 'KAKAO_PAY' | 'NAVER_PAY' | 'TOSS_PAY';
  orderMessage?: string;
}

export interface OrderListParams {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export const orderApi = {
  /**
   * 주문 생성
   * POST /api/v1/orders
   */
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', data);
    return response.data;
  },

  /**
   * 주문 목록 조회
   * GET /api/v1/orders
   */
  getOrders: async (params: OrderListParams): Promise<PageResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Order>>>('/orders', {
      params,
    });
    return response.data;
  },

  /**
   * 주문 상세 조회
   * GET /api/v1/orders/:id
   */
  getOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  /**
   * 주문 취소
   * POST /api/v1/orders/:id/cancel
   */
  cancelOrder: async (id: number, reason: string): Promise<void> => {
    await apiClient.post(`/orders/${id}/cancel`, { reason });
  },

  /**
   * 구매 확정
   * POST /api/v1/orders/:id/complete
   */
  completeOrder: async (id: number): Promise<void> => {
    await apiClient.post(`/orders/${id}/complete`);
  },
};
```

### useOrder Hooks

```typescript
// features/order/hooks/useOrder.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { orderApi, CreateOrderRequest, OrderListParams } from '../api/orderApi';
import { useToast } from '@/hooks/useToast';
import { CART_QUERY_KEY } from '@/features/cart/hooks/useCart';

export const ORDER_QUERY_KEYS = {
  all: ['orders'] as const,
  lists: () => [...ORDER_QUERY_KEYS.all, 'list'] as const,
  list: (params: OrderListParams) => [...ORDER_QUERY_KEYS.lists(), params] as const,
  details: () => [...ORDER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...ORDER_QUERY_KEYS.details(), id] as const,
};

/**
 * 주문 생성
 */
export const useCreateOrder = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderApi.createOrder(data),
    onSuccess: (order) => {
      // 장바구니 무효화
      queryClient.invalidateQueries(CART_QUERY_KEY);

      toast({
        title: '주문이 생성되었습니다',
        description: `주문번호: ${order.orderNumber}`,
        type: 'success',
      });

      // 결제 페이지로 이동
      router.push(`/payment/${order.id}`);
    },
    onError: (error: any) => {
      toast({
        title: '주문 생성 실패',
        description: error.message,
        type: 'error',
      });
    },
  });
};

/**
 * 주문 목록 조회
 */
export const useOrders = (params: OrderListParams) => {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.list(params),
    queryFn: () => orderApi.getOrders(params),
    keepPreviousData: true,
  });
};

/**
 * 주문 상세 조회
 */
export const useOrderDetail = (id: number) => {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.detail(id),
    queryFn: () => orderApi.getOrder(id),
    enabled: !!id,
  });
};

/**
 * 주문 취소
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      orderApi.cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(ORDER_QUERY_KEYS.all);
      toast({
        title: '주문이 취소되었습니다',
        type: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: '주문 취소 실패',
        description: error.message,
        type: 'error',
      });
    },
  });
};
```

---

## 🔄 React Query 설정

### queryClient.ts

```typescript
// lib/api/queryClient.ts
import { QueryClient, QueryClientConfig } from '@tanstack/react-query';

const queryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5분
      cacheTime: 1000 * 60 * 30, // 30분
      useErrorBoundary: false,
    },
    mutations: {
      retry: false,
      useErrorBoundary: false,
    },
  },
};

export const queryClient = new QueryClient(queryConfig);
```

### QueryProvider.tsx

```typescript
// components/providers/QueryProvider.tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/api/queryClient';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

---

## 🎯 API Error Handling

### 전역 에러 처리

```typescript
// lib/api/errorHandler.ts
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export const handleApiError = (error: ApiError): string => {
  // 에러 코드별 메시지 매핑
  const errorMessages: Record<string, string> = {
    RESOURCE_NOT_FOUND: '요청한 리소스를 찾을 수 없습니다',
    DUPLICATE_RESOURCE: '이미 존재하는 리소스입니다',
    UNAUTHORIZED: '로그인이 필요합니다',
    FORBIDDEN: '접근 권한이 없습니다',
    VALIDATION_ERROR: '입력값을 확인해주세요',
    INSUFFICIENT_STOCK: '재고가 부족합니다',
    INVALID_ORDER_STATUS: '주문 상태가 올바르지 않습니다',
    PAYMENT_FAILED: '결제에 실패했습니다',
  };

  return errorMessages[error.code || ''] || error.message || '오류가 발생했습니다';
};
```

---

## ✅ API 통합 체크리스트

### Phase 1: 기반 구축
- [ ] API 클라이언트 설정 (axios)
- [ ] 인터셉터 구현 (토큰, 에러)
- [ ] React Query 설정
- [ ] 에러 핸들링
- [ ] 타입 정의 (@repo/shared-types)

### Phase 2: 인증
- [ ] 로그인 API 연동
- [ ] 회원가입 API 연동
- [ ] 토큰 관리
- [ ] 자동 로그아웃

### Phase 3: 주요 기능
- [ ] 상품 API 연동
- [ ] 장바구니 API 연동
- [ ] 주문 API 연동
- [ ] 결제 API 연동

### Phase 4: 부가 기능
- [ ] 고객 API 연동
- [ ] 리뷰 API 연동
- [ ] 쿠폰 API 연동

---

이상으로 API 통합 가이드가 완료되었습니다!
