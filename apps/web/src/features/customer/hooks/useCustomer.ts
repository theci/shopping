import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../api/customerApi';
import { useAuthStore } from '@/features/auth/store/authStore';

export const customerKeys = {
  all: ['customer'] as const,
  me: () => [...customerKeys.all, 'me'] as const,
  addresses: () => [...customerKeys.all, 'addresses'] as const,
  address: (id: number) => [...customerKeys.addresses(), id] as const,
};

/**
 * 내 정보 조회 훅
 */
export const useCustomer = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: customerKeys.me(),
    queryFn: customerApi.getMe,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
