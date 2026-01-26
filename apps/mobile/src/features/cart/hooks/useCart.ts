/**
 * Cart Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { cartApi, AddToCartRequest, UpdateCartItemRequest } from '../api/cartApi';
import { useAuthStore } from '@/lib/auth/authStore';

export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

/**
 * 장바구니 조회
 */
export function useCart() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
  });
}

/**
 * 장바구니에 상품 추가
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartApi.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '장바구니 추가에 실패했습니다.';
      Alert.alert('오류', message);
    },
  });
}

/**
 * 장바구니 상품 수량 변경
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: number; data: UpdateCartItemRequest }) =>
      cartApi.updateCartItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '수량 변경에 실패했습니다.';
      Alert.alert('오류', message);
    },
  });
}

/**
 * 장바구니 상품 삭제
 */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => cartApi.removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '상품 삭제에 실패했습니다.';
      Alert.alert('오류', message);
    },
  });
}

/**
 * 장바구니 비우기
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '장바구니 비우기에 실패했습니다.';
      Alert.alert('오류', message);
    },
  });
}
