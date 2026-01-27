'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginForm, useAuthStore } from '@/features/auth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    }
  }, [isAuthenticated, isInitialized, router, searchParams]);

  return (
    <div className="min-h-screen flex">
      {/* 왼쪽 브랜딩 영역 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 p-12 flex-col justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">E-Commerce</h1>
          <p className="text-purple-200 mt-2">관리자 대시보드</p>
        </div>
        <div className="text-white">
          <h2 className="text-4xl font-bold mb-4">
            효율적인 쇼핑몰 관리를<br />
            시작하세요
          </h2>
          <p className="text-purple-200 text-lg">
            상품, 주문, 고객을 한 곳에서 관리하세요.
          </p>
        </div>
        <div className="text-purple-300 text-sm">
          © 2024 E-Commerce Admin. All rights reserved.
        </div>
      </div>

      {/* 오른쪽 로그인 폼 영역 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <LoginForm />
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-gray-500">로딩 중...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginContent />
    </Suspense>
  );
}
