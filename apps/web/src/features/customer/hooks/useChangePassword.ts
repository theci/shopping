import { useMutation } from '@tanstack/react-query';
import { customerApi } from '../api/customerApi';
import { useToast } from '@/shared/hooks';
import type { PasswordChangeRequest } from '../types';

/**
 * 비밀번호 변경 훅
 */
export const useChangePassword = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: PasswordChangeRequest) => customerApi.changePassword(data),
    onSuccess: () => {
      showToast({ type: 'success', message: '비밀번호가 변경되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '비밀번호 변경에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};
