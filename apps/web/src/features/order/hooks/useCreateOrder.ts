import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { orderApi } from '../api/orderApi';
import { orderKeys } from './useOrders';
import { cartKeys } from '@/features/cart/hooks/useCart';
import { useToast } from '@/shared/hooks';
import type { OrderCreateRequest } from '../types';

/**
 * 주문 생성 훅
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: OrderCreateRequest) => orderApi.createOrder(data),
    onSuccess: (order) => {
      // 주문 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      // 장바구니 캐시 무효화
      queryClient.invalidateQueries({ queryKey: cartKeys.all });

      showToast({ type: 'success', message: '주문이 완료되었습니다.' });

      // 주문 완료 페이지로 이동
      router.push(`/order-complete?orderId=${order.id}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '주문 처리에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};
