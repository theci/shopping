import { useQuery } from '@tanstack/react-query';
import { cartApi } from '../api/cartApi';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useCartStore } from '../store/cartStore';

export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

/**
 * 장바구니 조회 훅
 * - 로그인: 서버 장바구니
 * - 비로그인: 로컬 장바구니 (Zustand)
 */
export const useCart = () => {
  const { isAuthenticated } = useAuthStore();
  const localCart = useCartStore();

  const serverCart = useQuery({
    queryKey: cartKeys.detail(),
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60, // 1분
  });

  // 로그인 상태면 서버 장바구니 사용
  if (isAuthenticated) {
    return {
      data: serverCart.data,
      items: serverCart.data?.items || [],
      totalAmount: serverCart.data?.totalAmount || 0,
      totalQuantity: serverCart.data?.totalQuantity || 0,
      isLoading: serverCart.isLoading,
      error: serverCart.error,
      isAuthenticated: true,
    };
  }

  // 비로그인 상태면 로컬 장바구니 사용
  return {
    data: null,
    items: localCart.items,
    totalAmount: localCart.totalAmount(),
    totalQuantity: localCart.totalItems(),
    isLoading: false,
    error: null,
    isAuthenticated: false,
  };
};
