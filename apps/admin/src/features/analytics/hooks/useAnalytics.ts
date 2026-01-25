/**
 * Analytics Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analyticsApi';
import type { AnalyticsParams } from '../types';

/**
 * React Query 캐시 키
 */
export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: (params?: AnalyticsParams) => [...analyticsKeys.all, 'dashboard', params] as const,
  dailySales: (params?: AnalyticsParams) => [...analyticsKeys.all, 'dailySales', params] as const,
  monthlySales: (params?: AnalyticsParams) => [...analyticsKeys.all, 'monthlySales', params] as const,
  orderStatus: (params?: AnalyticsParams) => [...analyticsKeys.all, 'orderStatus', params] as const,
  topProducts: (limit?: number) => [...analyticsKeys.all, 'topProducts', limit] as const,
  recentOrders: (limit?: number) => [...analyticsKeys.all, 'recentOrders', limit] as const,
};

/**
 * 대시보드 요약 통계 조회
 */
export const useDashboardStats = (params?: AnalyticsParams) => {
  return useQuery({
    queryKey: analyticsKeys.dashboard(params),
    queryFn: () => analyticsApi.getDashboardStats(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

/**
 * 일별 매출 조회
 */
export const useDailySales = (params?: AnalyticsParams) => {
  return useQuery({
    queryKey: analyticsKeys.dailySales(params),
    queryFn: () => analyticsApi.getDailySales(params),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 월별 매출 조회
 */
export const useMonthlySales = (params?: AnalyticsParams) => {
  return useQuery({
    queryKey: analyticsKeys.monthlySales(params),
    queryFn: () => analyticsApi.getMonthlySales(params),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 주문 상태별 통계 조회
 */
export const useOrderStatusStats = (params?: AnalyticsParams) => {
  return useQuery({
    queryKey: analyticsKeys.orderStatus(params),
    queryFn: () => analyticsApi.getOrderStatusStats(params),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 베스트셀러 상품 조회
 */
export const useTopProducts = (limit?: number) => {
  return useQuery({
    queryKey: analyticsKeys.topProducts(limit),
    queryFn: () => analyticsApi.getTopProducts(limit),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 최근 주문 조회
 */
export const useRecentOrders = (limit?: number) => {
  return useQuery({
    queryKey: analyticsKeys.recentOrders(limit),
    queryFn: () => analyticsApi.getRecentOrders(limit),
    staleTime: 1000 * 60, // 1분
  });
};
