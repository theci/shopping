import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../api/customerApi';
import { customerKeys } from './useCustomer';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useToast } from '@/shared/hooks';
import type { UpdateProfileRequest } from '../types';

/**
 * 프로필 수정 훅
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setCustomer } = useAuthStore();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => customerApi.updateProfile(data),
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.me() });
      setCustomer(customer);
      showToast({ type: 'success', message: '프로필이 수정되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '프로필 수정에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};
