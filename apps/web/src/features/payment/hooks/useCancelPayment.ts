import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../api/paymentApi';
import { useToast } from '@/shared/hooks';
import { orderKeys } from '@/features/order/hooks/useOrders';

/**
 * 결제 취소 훅
 */
export function useCancelPayment() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ paymentKey, cancelReason }: { paymentKey: string; cancelReason: string }) =>
      paymentApi.cancelPayment(paymentKey, cancelReason),
    onSuccess: () => {
      // 주문 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

      showToast({ type: 'success', message: '결제가 취소되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '결제 취소에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
}
