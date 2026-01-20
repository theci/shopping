import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';
import { orderKeys } from './useOrders';
import { useAuthStore } from '@/features/auth/store/authStore';

/**
 * 주문 상세 조회 훅
 */
export const useOrder = (orderId: number) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => orderApi.getOrder(orderId),
    enabled: isAuthenticated && !!orderId,
  });
};
