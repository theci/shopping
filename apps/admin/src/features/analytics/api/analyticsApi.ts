/**
 * Analytics API
 * Note: Analytics endpoints may not exist in backend, using mock data as fallback
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

// Mock data for analytics when API is not available
const mockDashboardStats: DashboardStats = {
  totalSales: 2500000,
  totalOrders: 150,
  newCustomers: 89,
  averageOrderValue: 16667,
  salesGrowth: 12.5,
  ordersGrowth: 8.3,
  customersGrowth: 15.2,
};

const mockDailySales: DailySales[] = [
  { date: '2024-01-21', sales: 350000, orders: 12 },
  { date: '2024-01-22', sales: 420000, orders: 15 },
  { date: '2024-01-23', sales: 280000, orders: 10 },
  { date: '2024-01-24', sales: 510000, orders: 18 },
  { date: '2024-01-25', sales: 390000, orders: 14 },
  { date: '2024-01-26', sales: 450000, orders: 16 },
  { date: '2024-01-27', sales: 100000, orders: 5 },
];

const mockOrderStatusStats: OrderStatusStats[] = [
  { status: 'PENDING', label: '결제대기', count: 5, percentage: 10 },
  { status: 'PREPARING', label: '상품준비중', count: 8, percentage: 16 },
  { status: 'SHIPPED', label: '배송중', count: 12, percentage: 24 },
  { status: 'DELIVERED', label: '배송완료', count: 20, percentage: 40 },
  { status: 'COMPLETED', label: '구매확정', count: 5, percentage: 10 },
];

const mockTopProducts: TopProduct[] = [
  { id: 8, name: '클래식 화이트 스니커즈', salesCount: 210, revenue: 13272000, rank: 1 },
  { id: 14, name: '무선 블루투스 이어폰', salesCount: 320, revenue: 38144000, rank: 2 },
  { id: 4, name: '슬림핏 청바지', salesCount: 120, revenue: 6624000, rank: 3 },
  { id: 6, name: '울 블렌드 코트', salesCount: 89, revenue: 13456800, rank: 4 },
  { id: 1, name: '베이직 화이트 티셔츠', salesCount: 85, revenue: 1972000, rank: 5 },
];

const mockRecentOrders: RecentOrder[] = [
  { id: 3, orderNumber: 'ORD-20240125-0003', customerName: '박철수', totalAmount: 63200, status: 'PREPARING', createdAt: '2024-01-25T09:15:00' },
  { id: 2, orderNumber: 'ORD-20240120-0002', customerName: '이영희', totalAmount: 239200, status: 'COMPLETED', createdAt: '2024-01-20T14:20:00' },
  { id: 1, orderNumber: 'ORD-20240115-0001', customerName: '김민수', totalAmount: 95400, status: 'DELIVERED', createdAt: '2024-01-15T10:30:00' },
];

export const analyticsApi = {
  /**
   * 대시보드 요약 통계 조회
   */
  getDashboardStats: async (_params?: AnalyticsParams): Promise<DashboardStats> => {
    try {
      const response = await api.get<ApiResponse<DashboardStats>>(
        '/api/v1/analytics/dashboard'
      );
      return response.data;
    } catch {
      return mockDashboardStats;
    }
  },

  /**
   * 일별 매출 조회
   */
  getDailySales: async (_params?: AnalyticsParams): Promise<DailySales[]> => {
    try {
      const response = await api.get<ApiResponse<DailySales[]>>(
        '/api/v1/analytics/sales/daily'
      );
      return response.data;
    } catch {
      return mockDailySales;
    }
  },

  /**
   * 월별 매출 조회
   */
  getMonthlySales: async (_params?: AnalyticsParams): Promise<MonthlySales[]> => {
    try {
      const response = await api.get<ApiResponse<MonthlySales[]>>(
        '/api/v1/analytics/sales/monthly'
      );
      return response.data;
    } catch {
      return [];
    }
  },

  /**
   * 주문 상태별 통계 조회
   */
  getOrderStatusStats: async (_params?: AnalyticsParams): Promise<OrderStatusStats[]> => {
    try {
      const response = await api.get<ApiResponse<OrderStatusStats[]>>(
        '/api/v1/analytics/orders/status'
      );
      return response.data;
    } catch {
      return mockOrderStatusStats;
    }
  },

  /**
   * 베스트셀러 상품 조회
   */
  getTopProducts: async (limit?: number): Promise<TopProduct[]> => {
    try {
      const response = await api.get<ApiResponse<TopProduct[]>>(
        '/api/v1/analytics/products/top',
        { limit: limit || 10 }
      );
      return response.data;
    } catch {
      return mockTopProducts;
    }
  },

  /**
   * 최근 주문 조회
   */
  getRecentOrders: async (limit?: number): Promise<RecentOrder[]> => {
    try {
      const response = await api.get<ApiResponse<RecentOrder[]>>(
        '/api/v1/analytics/orders/recent',
        { limit: limit || 10 }
      );
      return response.data;
    } catch {
      return mockRecentOrders;
    }
  },
};
