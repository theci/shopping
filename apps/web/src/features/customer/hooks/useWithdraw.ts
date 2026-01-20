import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { customerApi } from '../api/customerApi';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useToast } from '@/shared/hooks';
import type { WithdrawRequest } from '../types';

/**
 * 회원탈퇴 훅
 */
export const useWithdraw = () => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: WithdrawRequest) => customerApi.withdraw(data),
    onSuccess: () => {
      logout();
      showToast({ type: 'success', message: '회원탈퇴가 완료되었습니다.' });
      router.push('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '회원탈퇴에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};
