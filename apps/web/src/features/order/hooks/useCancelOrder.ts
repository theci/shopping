import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';
import { orderKeys } from './useOrders';
import { useToast } from '@/shared/hooks';

/**
 * 주문 취소 훅
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: number; reason?: string }) =>
      orderApi.cancelOrder(orderId, reason ? { reason } : undefined),
    onSuccess: (order) => {
      // 주문 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(order.id) });

      showToast({ type: 'success', message: '주문이 취소되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '주문 취소에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};
