import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';
import { orderKeys } from './useOrders';
import { useToast } from '@/shared/hooks';

/**
 * 구매 확정 훅
 */
export const useConfirmOrder = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (orderId: number) => orderApi.confirmOrder(orderId),
    onSuccess: (order) => {
      // 주문 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(order.id) });

      showToast({ type: 'success', message: '구매가 확정되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '구매 확정에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};
