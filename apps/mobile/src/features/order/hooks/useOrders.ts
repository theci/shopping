/**
 * Order Hooks
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { orderApi, CreateOrderRequest, OrderSearchParams } from '../api/orderApi';
import { useAuthStore } from '@/lib/auth/authStore';
import { cartKeys } from '@/features/cart/hooks/useCart';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: OrderSearchParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
};

/**
 * 주문 목록 조회
 */
export function useOrders(params: OrderSearchParams = {}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderApi.getOrders(params),
    enabled: isAuthenticated,
  });
}

/**
 * 무한 스크롤 주문 목록
 */
export function useInfiniteOrders(params: Omit<OrderSearchParams, 'page'> = {}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useInfiniteQuery({
    queryKey: ['orders', 'infinite', params],
    queryFn: ({ pageParam = 0 }) =>
      orderApi.getOrders({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
    enabled: isAuthenticated,
  });
}

/**
 * 주문 상세 조회
 */
export function useOrder(id: number) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderApi.getOrder(id),
    enabled: isAuthenticated && !!id && id > 0,
  });
}

/**
 * 주문 생성
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderApi.createOrder(data),
    onSuccess: (order) => {
      // 장바구니 및 주문 목록 갱신
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });

      Alert.alert(
        '주문 완료',
        `주문번호: ${order.orderNumber}\n주문이 성공적으로 완료되었습니다.`,
        [
          {
            text: '주문 확인',
            onPress: () => router.replace(`/order/${order.id}`),
          },
        ]
      );
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '주문 처리에 실패했습니다.';
      Alert.alert('주문 실패', message);
    },
  });
}

/**
 * 주문 취소
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => orderApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      Alert.alert('알림', '주문이 취소되었습니다.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '주문 취소에 실패했습니다.';
      Alert.alert('오류', message);
    },
  });
}
