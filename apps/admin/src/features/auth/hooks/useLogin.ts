import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useToast } from '@/shared/hooks';
import type { LoginRequest } from '../types';

export const useLogin = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: () => {
      showToast({ type: 'success', message: '로그인되었습니다.' });
      router.push('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '로그인에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};
