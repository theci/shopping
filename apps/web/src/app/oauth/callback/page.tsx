'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { tokenManager } from '@/lib/auth/tokenManager';
import { useAuthStore } from '@/features/auth/store/authStore';
import { authApi } from '@/features/auth/api/authApi';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const setCustomer = useAuthStore((state) => state.setCustomer);

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const errorMessage = searchParams.get('error');

      if (errorMessage) {
        setError(decodeURIComponent(errorMessage));
        return;
      }

      if (accessToken && refreshToken) {
        try {
          tokenManager.setTokens(accessToken, refreshToken);
          const customer = await authApi.getMe();
          setCustomer(customer);
          router.replace('/');
        } catch (err) {
          console.error('OAuth 콜백 처리 실패:', err);
          setError('로그인 처리 중 오류가 발생했습니다.');
          tokenManager.clearTokens();
        }
      } else {
        setError('인증 정보가 없습니다.');
      }
    };

    handleCallback();
  }, [searchParams, router, setCustomer]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인 실패</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
