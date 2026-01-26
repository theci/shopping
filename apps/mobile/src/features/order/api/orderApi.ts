/**
 * Order API - 백엔드와 일치하는 타입
 */

import { apiClient } from '@/lib/api/client';
import type { ApiResponse, PageResponse } from '@/lib/api/types';

/**
 * 주문 상태 (백엔드 OrderStatus와 일치)
 */
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RETURNED';

/**
 * 주문 상품 응답 (백엔드 OrderItemResponse와 일치)
 */
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

/**
 * 주문 응답 (백엔드 OrderResponse와 일치)
 * 배송 정보는 플랫 필드로 제공됨
 */
export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: OrderStatus;
  orderStatusDescription: string;

  // 배송 정보 (플랫 필드)
  recipientName: string;
  recipientPhone: string;
  shippingPostalCode: string;
  shippingAddress: string;
  shippingAddressDetail?: string;
  shippingMemo?: string;

  // 결제 정보
  paymentId?: number;

  // 취소 정보
  cancelReason?: string;
  cancelledAt?: string;

  // 완료 정보
  completedAt?: string;

  itemCount: number;
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 주문 생성 요청 (백엔드 OrderCreateRequest와 일치)
 */
export interface CreateOrderRequest {
  recipientName: string;
  recipientPhone: string;
  shippingPostalCode: string;
  shippingAddress: string;
  shippingAddressDetail?: string;
  shippingMemo?: string;
}

/**
 * 주문 검색 파라미터
 */
export interface OrderSearchParams {
  page?: number;
  size?: number;
  status?: OrderStatus;
}

export const orderApi = {
  /**
   * 주문 목록 조회
   */
  getOrders: async (params: OrderSearchParams = {}): Promise<PageResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Order>>>(
      '/api/v1/orders/me',
      { params }
    );
    return (response as any).data || response;
  },

  /**
   * 주문 상세 조회
   */
  getOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/api/v1/orders/${id}`);
    return (response as any).data || response;
  },

  /**
   * 주문 생성
   */
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/api/v1/orders', data);
    return (response as any).data || response;
  },

  /**
   * 주문 취소
   */
  cancelOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(`/api/v1/orders/${id}/cancel`);
    return (response as any).data || response;
  },

  /**
   * 구매 확정
   */
  completeOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(`/api/v1/orders/${id}/complete`);
    return (response as any).data || response;
  },
};

/**
 * 주문 상태 한글 라벨 (백엔드 OrderStatus description과 일치)
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: '주문 대기',
  CONFIRMED: '주문 확인',
  PREPARING: '상품 준비중',
  SHIPPED: '배송중',
  DELIVERED: '배송 완료',
  COMPLETED: '구매 확정',
  CANCELLED: '주문 취소',
  RETURNED: '반품',
};

/**
 * 주문 상태 색상
 */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#3b82f6',
  PREPARING: '#8b5cf6',
  SHIPPED: '#6366f1',
  DELIVERED: '#10b981',
  COMPLETED: '#059669',
  CANCELLED: '#6b7280',
  RETURNED: '#ef4444',
};
