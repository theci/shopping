/**
 * 회원가입 Hook
 */

import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { authApi, RegisterRequest } from '../api/authApi';

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      Alert.alert('회원가입 완료', '로그인 페이지로 이동합니다.', [
        {
          text: '확인',
          onPress: () => router.replace('/auth/login'),
        },
      ]);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || '회원가입에 실패했습니다.';
      Alert.alert('회원가입 실패', message);
    },
  });
}
