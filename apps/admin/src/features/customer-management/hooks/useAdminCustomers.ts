/**
 * 고객 조회 관련 Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { customerManagementApi } from '../api/customerManagementApi';
import type { CustomerSearchParams } from '../types';

/**
 * React Query 캐시 키
 */
export const customerKeys = {
  all: ['admin-customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params?: CustomerSearchParams) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: number) => [...customerKeys.details(), id] as const,
  orders: (id: number) => [...customerKeys.detail(id), 'orders'] as const,
};

/**
 * 고객 목록 조회
 */
export const useAdminCustomers = (params?: CustomerSearchParams) => {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customerManagementApi.getCustomers(params),
    staleTime: 1000 * 60, // 1분
  });
};

/**
 * 고객 상세 조회
 */
export const useAdminCustomer = (customerId: number) => {
  return useQuery({
    queryKey: customerKeys.detail(customerId),
    queryFn: () => customerManagementApi.getCustomer(customerId),
    enabled: !!customerId,
  });
};

/**
 * 고객 주문 내역 조회
 */
export const useCustomerOrders = (
  customerId: number,
  params?: { page?: number; size?: number }
) => {
  return useQuery({
    queryKey: [...customerKeys.orders(customerId), params],
    queryFn: () => customerManagementApi.getCustomerOrders(customerId, params),
    enabled: !!customerId,
  });
};
