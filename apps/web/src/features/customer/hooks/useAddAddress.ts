import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { customerApi } from '../api/customerApi';
import { customerKeys } from './useCustomer';
import { useToast } from '@/shared/hooks';
import type { AddressRequest } from '../types';

/**
 * 배송지 추가 훅
 */
export const useAddAddress = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: AddressRequest) => customerApi.addAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.addresses() });
      showToast({ type: 'success', message: '배송지가 추가되었습니다.' });
      router.push('/mypage/addresses');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '배송지 추가에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};
