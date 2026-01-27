/**
 * Order Management API
 */

import { api } from '@/lib/api/client';
import type {
  Order,
  OrderListItem,
  OrderSearchParams,
  OrderStatusUpdateRequest,
  ShippingUpdateRequest,
  AdminMemoRequest,
  ApiResponse,
  PageResponse,
} from '../types';

export const orderManagementApi = {
  /**
   * 주문 목록 조회
   */
  getOrders: async (params?: OrderSearchParams): Promise<PageResponse<OrderListItem>> => {
    const response = await api.get<ApiResponse<PageResponse<OrderListItem>>>(
      '/api/v1/orders',
      params
    );
    return response.data;
  },

  /**
   * 주문 상세 조회
   */
  getOrder: async (orderId: number): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(
      `/api/v1/orders/${orderId}`
    );
    return response.data;
  },

  /**
   * 주문 상태 변경
   */
  updateOrderStatus: async (
    orderId: number,
    data: OrderStatusUpdateRequest
  ): Promise<Order> => {
    const response = await api.patch<ApiResponse<Order>>(
      `/api/v1/orders/${orderId}/status`,
      data
    );
    return response.data;
  },

  /**
   * 배송 정보 입력
   */
  updateShipping: async (
    orderId: number,
    data: ShippingUpdateRequest
  ): Promise<Order> => {
    const response = await api.patch<ApiResponse<Order>>(
      `/api/v1/orders/${orderId}/shipping`,
      data
    );
    return response.data;
  },

  /**
   * 관리자 메모 저장
   */
  updateAdminMemo: async (
    orderId: number,
    data: AdminMemoRequest
  ): Promise<Order> => {
    const response = await api.patch<ApiResponse<Order>>(
      `/api/v1/orders/${orderId}/memo`,
      data
    );
    return response.data;
  },
};
