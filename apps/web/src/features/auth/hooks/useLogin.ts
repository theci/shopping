'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useToast } from '@/shared/hooks';
import type { LoginRequest } from '../types';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/shared/types';

export function useLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { error: showError, success: showSuccess } = useToast();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: () => {
      showSuccess('로그인되었습니다.');
      router.push('/');
    },
    onError: (error: AxiosError<{ message?: string; errorCode?: string }>) => {
      const message = error.response?.data?.message || '로그인에 실패했습니다.';
      showError(message);
    },
  });
}
