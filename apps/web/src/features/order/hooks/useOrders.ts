import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { OrderSearchParams } from '../types';

/**
 * 주문 Query Keys
 */
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: OrderSearchParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
};

/**
 * 주문 목록 조회 훅
 */
export const useOrders = (params: OrderSearchParams = {}) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderApi.getOrders(params),
    enabled: isAuthenticated,
    staleTime: 1000 * 60, // 1분
  });
};
