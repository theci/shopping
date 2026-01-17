import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cartApi';
import { cartKeys } from './useCart';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useCartStore } from '../store/cartStore';
import { useToast } from '@/shared/hooks';

/**
 * 장바구니 비우기 훅
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { clearCart: clearLocalCart } = useCartStore();
  const { showToast } = useToast();

  const serverMutation = useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      showToast({ type: 'success', message: '장바구니가 비워졌습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '장바구니 비우기에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });

  const clearCart = () => {
    if (isAuthenticated) {
      serverMutation.mutate();
    } else {
      clearLocalCart();
      showToast({ type: 'success', message: '장바구니가 비워졌습니다.' });
    }
  };

  return {
    clearCart,
    isPending: serverMutation.isPending,
  };
};
