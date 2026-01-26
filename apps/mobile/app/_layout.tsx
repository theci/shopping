/**
 * 루트 레이아웃
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Providers } from '@/lib/providers';
import { useAuthStore } from '@/lib/auth';

// 스플래시 화면 자동 숨김 방지
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const initialize = useAuthStore((state) => state.initialize);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return (
    <Providers>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#1f2937',
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#f9fafb' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/login"
          options={{
            title: '로그인',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="auth/register"
          options={{
            title: '회원가입',
            presentation: 'modal',
          }}
        />
        <Stack.Screen name="product/[id]" options={{ title: '상품 상세' }} />
        <Stack.Screen name="checkout" options={{ title: '주문하기' }} />
        <Stack.Screen name="order/index" options={{ title: '주문 내역' }} />
        <Stack.Screen name="order/[id]" options={{ title: '주문 상세' }} />
      </Stack>
    </Providers>
  );
}
