/**
 * Order API
 */

import { apiClient } from '@/lib/api/client';
import type { ApiResponse, PageResponse } from '@/lib/api/types';

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PREPARING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  recipientName: string;
  phoneNumber: string;
  zipCode: string;
  address: string;
  addressDetail?: string;
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  cartItemIds?: number[];
}

export interface OrderSearchParams {
  page?: number;
  size?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}

export const orderApi = {
  /**
   * 주문 목록 조회
   */
  getOrders: async (params: OrderSearchParams = {}): Promise<PageResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Order>>>(
      '/api/v1/orders',
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
};

/**
 * 주문 상태 한글 변환
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: '결제 대기',
  PAID: '결제 완료',
  PREPARING: '상품 준비중',
  SHIPPING: '배송중',
  DELIVERED: '배송 완료',
  CANCELLED: '주문 취소',
  REFUNDED: '환불 완료',
};

/**
 * 주문 상태 색상
 */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: '#f59e0b',
  PAID: '#3b82f6',
  PREPARING: '#8b5cf6',
  SHIPPING: '#6366f1',
  DELIVERED: '#10b981',
  CANCELLED: '#6b7280',
  REFUNDED: '#ef4444',
};
