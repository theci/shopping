import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cartApi';
import { cartKeys } from './useCart';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useCartStore } from '../store/cartStore';

/**
 * 장바구니 아이템 수량 변경 훅
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { updateQuantity: updateLocalQuantity } = useCartStore();

  const serverMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });

  const updateItem = (params: { itemId: number; productId: number; quantity: number }) => {
    if (isAuthenticated) {
      serverMutation.mutate({ itemId: params.itemId, quantity: params.quantity });
    } else {
      updateLocalQuantity(params.productId, params.quantity);
    }
  };

  return {
    updateItem,
    mutate: serverMutation.mutate,
    isPending: serverMutation.isPending,
  };
};
