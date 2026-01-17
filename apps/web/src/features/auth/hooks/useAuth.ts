'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * 인증 상태 확인 훅
 */
export function useAuth() {
  const {
    customer,
    isAuthenticated,
    isLoading,
    isInitialized,
    initialize,
    checkAuth,
    logout,
  } = useAuthStore();

  // 앱 시작 시 인증 상태 초기화
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    customer,
    isAuthenticated,
    isLoading,
    isInitialized,
    checkAuth,
    logout,
  };
}

/**
 * 인증 필요 페이지에서 사용하는 훅
 * 인증되지 않은 경우 로그인 페이지로 리다이렉트
 */
export function useRequireAuth() {
  const { isAuthenticated, isInitialized } = useAuth();

  return {
    isAuthenticated,
    isInitialized,
    isReady: isInitialized && isAuthenticated,
  };
}
