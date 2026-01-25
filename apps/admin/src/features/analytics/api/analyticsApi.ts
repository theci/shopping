/**
 * Analytics API
 */

import { api } from '@/lib/api/client';
import type {
  DashboardStats,
  DailySales,
  MonthlySales,
  OrderStatusStats,
  TopProduct,
  RecentOrder,
  AnalyticsParams,
  ApiResponse,
} from '../types';

export const analyticsApi = {
  /**
   * 대시보드 요약 통계 조회
   */
  getDashboardStats: async (params?: AnalyticsParams): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>(
      '/api/v1/admin/analytics/dashboard',
      params
    );
    return response.data;
  },

  /**
   * 일별 매출 조회
   */
  getDailySales: async (params?: AnalyticsParams): Promise<DailySales[]> => {
    const response = await api.get<ApiResponse<DailySales[]>>(
      '/api/v1/admin/analytics/sales/daily',
      params
    );
    return response.data;
  },

  /**
   * 월별 매출 조회
   */
  getMonthlySales: async (params?: AnalyticsParams): Promise<MonthlySales[]> => {
    const response = await api.get<ApiResponse<MonthlySales[]>>(
      '/api/v1/admin/analytics/sales/monthly',
      params
    );
    return response.data;
  },

  /**
   * 주문 상태별 통계 조회
   */
  getOrderStatusStats: async (params?: AnalyticsParams): Promise<OrderStatusStats[]> => {
    const response = await api.get<ApiResponse<OrderStatusStats[]>>(
      '/api/v1/admin/analytics/orders/status',
      params
    );
    return response.data;
  },

  /**
   * 베스트셀러 상품 조회
   */
  getTopProducts: async (limit?: number): Promise<TopProduct[]> => {
    const response = await api.get<ApiResponse<TopProduct[]>>(
      '/api/v1/admin/analytics/products/top',
      { limit: limit || 10 }
    );
    return response.data;
  },

  /**
   * 최근 주문 조회
   */
  getRecentOrders: async (limit?: number): Promise<RecentOrder[]> => {
    const response = await api.get<ApiResponse<RecentOrder[]>>(
      '/api/v1/admin/analytics/orders/recent',
      { limit: limit || 10 }
    );
    return response.data;
  },
};
