/**
 * 주문 상태 변경 및 관리 Hooks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderManagementApi } from '../api/orderManagementApi';
import { orderKeys } from './useAdminOrders';
import { useToast } from '@/shared/hooks';
import type { OrderStatusUpdateRequest, ShippingUpdateRequest, AdminMemoRequest } from '../types';

/**
 * 주문 상태 변경
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: number; data: OrderStatusUpdateRequest }) =>
      orderManagementApi.updateOrderStatus(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      showToast({ type: 'success', message: '주문 상태가 변경되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '상태 변경에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};

/**
 * 배송 정보 입력
 */
export const useUpdateShipping = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: number; data: ShippingUpdateRequest }) =>
      orderManagementApi.updateShipping(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      showToast({ type: 'success', message: '배송 정보가 저장되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '배송 정보 저장에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};

/**
 * 관리자 메모 저장
 */
export const useUpdateAdminMemo = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: number; data: AdminMemoRequest }) =>
      orderManagementApi.updateAdminMemo(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      showToast({ type: 'success', message: '메모가 저장되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '메모 저장에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};
