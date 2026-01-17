'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useToast } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';

export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { success: showSuccess } = useToast();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    queryClient.clear();
    showSuccess('로그아웃되었습니다.');
    router.push('/');
  };

  return { logout: handleLogout };
}
