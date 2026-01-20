import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../api/customerApi';
import { customerKeys } from './useCustomer';
import { useToast } from '@/shared/hooks';

/**
 * 배송지 삭제 훅
 */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (addressId: number) => customerApi.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.addresses() });
      showToast({ type: 'success', message: '배송지가 삭제되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '배송지 삭제에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};

/**
 * 기본 배송지 설정 훅
 */
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (addressId: number) => customerApi.setDefaultAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.addresses() });
      showToast({ type: 'success', message: '기본 배송지로 설정되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '기본 배송지 설정에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};
