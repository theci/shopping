/**
 * Analytics Types
 */

export type { ApiResponse } from '@/lib/api/types';

/**
 * 기간 타입
 */
export type DateRange = 'today' | 'week' | 'month' | 'year';

/**
 * 대시보드 요약 통계
 */
export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  newCustomers: number;
  averageOrderValue: number;
  salesGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
}

/**
 * 일별 매출 데이터
 */
export interface DailySales {
  date: string;
  sales: number;
  orders: number;
}

/**
 * 월별 매출 데이터
 */
export interface MonthlySales {
  month: string;
  sales: number;
  orders: number;
}

/**
 * 주문 상태별 통계
 */
export interface OrderStatusStats {
  status: string;
  label: string;
  count: number;
  percentage: number;
}

/**
 * 베스트셀러 상품
 */
export interface TopProduct {
  id: number;
  name: string;
  imageUrl?: string;
  salesCount: number;
  revenue: number;
  rank: number;
}

/**
 * 최근 주문
 */
export interface RecentOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

/**
 * 통계 조회 파라미터
 */
export interface AnalyticsParams {
  range?: DateRange;
  startDate?: string;
  endDate?: string;
}

/**
 * 기간 옵션
 */
export const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: 'today', label: '오늘' },
  { value: 'week', label: '이번 주' },
  { value: 'month', label: '이번 달' },
  { value: 'year', label: '올해' },
];
