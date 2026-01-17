import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cartApi';
import { cartKeys } from './useCart';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useCartStore } from '../store/cartStore';
import { useToast } from '@/shared/hooks';
import type { CartItemRequest, LocalCartItem } from '../types';

interface AddToCartParams extends CartItemRequest {
  productName: string;
  productImage?: string;
  price: number;
  stockQuantity: number;
}

/**
 * 장바구니 추가 훅
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { addItem: addLocalItem } = useCartStore();
  const { showToast } = useToast();

  const serverMutation = useMutation({
    mutationFn: (data: CartItemRequest) => cartApi.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      showToast({ type: 'success', message: '장바구니에 추가되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '장바구니 추가에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });

  const addToCart = (params: AddToCartParams) => {
    if (isAuthenticated) {
      serverMutation.mutate({
        productId: params.productId,
        quantity: params.quantity,
      });
    } else {
      addLocalItem({
        productId: params.productId,
        productName: params.productName,
        productImage: params.productImage,
        price: params.price,
        quantity: params.quantity,
        stockQuantity: params.stockQuantity,
      });
      showToast({ type: 'success', message: '장바구니에 추가되었습니다.' });
    }
  };

  return {
    addToCart,
    isPending: serverMutation.isPending,
    isSuccess: serverMutation.isSuccess,
    isError: serverMutation.isError,
  };
};
