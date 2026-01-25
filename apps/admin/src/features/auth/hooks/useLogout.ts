import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useToast } from '@/shared/hooks';

export const useLogout = () => {
  const router = useRouter();
  const logoutStore = useAuthStore((state) => state.logout);
  const { showToast } = useToast();

  const logout = () => {
    logoutStore();
    showToast({ type: 'success', message: '로그아웃되었습니다.' });
    router.push('/auth/login');
  };

  return { logout };
};
