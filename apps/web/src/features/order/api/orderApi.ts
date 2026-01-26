import { api } from '@/lib/api/client';
import type {
  Order,
  OrderCreateRequest,
  OrderSearchParams,
  OrderCancelRequest,
  ApiResponse,
  PageResponse,
} from '../types';

/**
 * Order API
 */
export const orderApi = {
  /**
   * 주문 생성
   */
  createOrder: async (data: OrderCreateRequest): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/api/v1/orders', data);
    return response.data;
  },

  /**
   * 내 주문 목록 조회
   */
  getOrders: async (params: OrderSearchParams = {}): Promise<PageResponse<Order>> => {
    const response = await api.get<ApiResponse<PageResponse<Order>>>('/api/v1/orders/me', { params });
    return response.data;
  },

  /**
   * 주문 상세 조회
   */
  getOrder: async (id: number): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/v1/orders/${id}`);
    return response.data;
  },

  /**
   * 주문 취소
   */
  cancelOrder: async (id: number, data?: OrderCancelRequest): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>(`/v1/orders/${id}/cancel`, data);
    return response.data;
  },

  /**
   * 구매 확정
   */
  confirmOrder: async (id: number): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>(`/v1/orders/${id}/confirm`);
    return response.data;
  },
};
