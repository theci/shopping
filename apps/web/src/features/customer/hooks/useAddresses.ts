import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../api/customerApi';
import { customerKeys } from './useCustomer';
import { useAuthStore } from '@/features/auth/store/authStore';

/**
 * 배송지 목록 조회 훅
 */
export const useAddresses = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: customerKeys.addresses(),
    queryFn: customerApi.getAddresses,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

/**
 * 배송지 상세 조회 훅
 */
export const useAddress = (addressId: number) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: customerKeys.address(addressId),
    queryFn: () => customerApi.getAddress(addressId),
    enabled: isAuthenticated && !!addressId,
  });
};
