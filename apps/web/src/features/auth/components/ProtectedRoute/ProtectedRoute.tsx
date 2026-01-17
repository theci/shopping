'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { Spinner } from '@/shared/components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * 인증이 필요한 페이지를 감싸는 컴포넌트
 * 인증되지 않은 경우 로그인 페이지로 리다이렉트
 */
export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isInitialized, router, redirectTo]);

  // 초기화 중이거나 인증되지 않은 경우 로딩 표시
  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * 로그인된 사용자가 접근하면 안 되는 페이지를 감싸는 컴포넌트
 * 로그인된 경우 홈으로 리다이렉트
 */
export function GuestRoute({ children, redirectTo = '/' }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isInitialized, router, redirectTo]);

  // 초기화 중이면 로딩 표시
  if (!isInitialized) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // 로그인된 경우 표시하지 않음
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
