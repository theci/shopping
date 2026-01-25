/**
 * 주문 조회 관련 Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { orderManagementApi } from '../api/orderManagementApi';
import type { OrderSearchParams } from '../types';

/**
 * React Query 캐시 키
 */
export const orderKeys = {
  all: ['admin-orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params?: OrderSearchParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
};

/**
 * 주문 목록 조회
 */
export const useAdminOrders = (params?: OrderSearchParams) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderManagementApi.getOrders(params),
    staleTime: 1000 * 60, // 1분
  });
};

/**
 * 주문 상세 조회
 */
export const useAdminOrder = (orderId: number) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => orderManagementApi.getOrder(orderId),
    enabled: !!orderId,
  });
};
