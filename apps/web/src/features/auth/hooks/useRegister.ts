'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useToast } from '@/shared/hooks';
import type { RegisterRequest } from '../types';
import type { AxiosError } from 'axios';

export function useRegister() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const { error: showError, success: showSuccess } = useToast();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: () => {
      showSuccess('회원가입이 완료되었습니다. 로그인해주세요.');
      router.push('/login');
    },
    onError: (error: AxiosError<{ message?: string; errorCode?: string }>) => {
      const message = error.response?.data?.message || '회원가입에 실패했습니다.';
      showError(message);
    },
  });
}
