import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cartApi';
import { cartKeys } from './useCart';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useCartStore } from '../store/cartStore';
import { useToast } from '@/shared/hooks';

/**
 * 장바구니 아이템 삭제 훅
 */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { removeItem: removeLocalItem } = useCartStore();
  const { showToast } = useToast();

  const serverMutation = useMutation({
    mutationFn: (itemId: number) => cartApi.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      showToast({ type: 'success', message: '상품이 삭제되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '삭제에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });

  const removeItem = (params: { itemId: number; productId: number }) => {
    if (isAuthenticated) {
      serverMutation.mutate(params.itemId);
    } else {
      removeLocalItem(params.productId);
      showToast({ type: 'success', message: '상품이 삭제되었습니다.' });
    }
  };

  return {
    removeItem,
    mutate: serverMutation.mutate,
    isPending: serverMutation.isPending,
  };
};
