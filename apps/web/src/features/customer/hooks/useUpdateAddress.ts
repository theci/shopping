import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { customerApi } from '../api/customerApi';
import { customerKeys } from './useCustomer';
import { useToast } from '@/shared/hooks';
import type { AddressRequest } from '../types';

/**
 * 배송지 수정 훅
 */
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ addressId, data }: { addressId: number; data: AddressRequest }) =>
      customerApi.updateAddress(addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.addresses() });
      showToast({ type: 'success', message: '배송지가 수정되었습니다.' });
      router.push('/mypage/addresses');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '배송지 수정에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};
