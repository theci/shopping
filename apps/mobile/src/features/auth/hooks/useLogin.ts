/**
 * 로그인 Hook
 */

import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { authApi, LoginRequest } from '../api/authApi';
import { tokenManager, useAuthStore } from '@/lib/auth';

export function useLogin() {
  const setCustomer = useAuthStore((state) => state.setCustomer);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (data) => {
      // 토큰 저장
      await tokenManager.setTokens(data.accessToken, data.refreshToken);

      // 상태 업데이트
      setCustomer(data.customer);

      // 홈으로 이동
      router.replace('/(tabs)');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || '로그인에 실패했습니다.';
      Alert.alert('로그인 실패', message);
    },
  });
}
