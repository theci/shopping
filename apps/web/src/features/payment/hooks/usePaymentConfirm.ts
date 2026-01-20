import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { paymentApi } from '../api/paymentApi';
import { useToast } from '@/shared/hooks';
import { orderKeys } from '@/features/order/hooks/useOrders';
import { cartKeys } from '@/features/cart/hooks/useCart';
import type { PaymentConfirmRequest } from '../types';

/**
 * 결제 승인 처리 훅
 */
export function usePaymentConfirm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: PaymentConfirmRequest) => paymentApi.confirmPayment(data),
    onSuccess: (response) => {
      // 주문 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      // 장바구니 캐시 무효화
      queryClient.invalidateQueries({ queryKey: cartKeys.all });

      showToast({ type: 'success', message: '결제가 완료되었습니다.' });

      // 주문 완료 페이지로 이동
      router.push(`/order-complete?orderId=${response.orderId}&paymentKey=${response.paymentKey}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '결제 승인에 실패했습니다.';
      showToast({ type: 'error', message });

      // 결제 실패 페이지로 이동
      const orderId = error.config?.data ? JSON.parse(error.config.data).orderId : '';
      router.push(`/payment/fail?code=PAYMENT_ERROR&message=${encodeURIComponent(message)}&orderId=${orderId}`);
    },
  });
}
