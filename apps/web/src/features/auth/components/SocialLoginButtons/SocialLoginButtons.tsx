'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface SocialLoginButtonsProps {
  className?: string;
}

export function SocialLoginButtons({ className = '' }: SocialLoginButtonsProps) {
  const handleSocialLogin = (provider: 'google' | 'naver' | 'kakao') => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">또는</span>
        </div>
      </div>

      <div className="space-y-2">
        {/* Google 로그인 */}
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">Google로 계속하기</span>
        </button>

        {/* Naver 로그인 */}
        <button
          type="button"
          onClick={() => handleSocialLogin('naver')}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg bg-[#03C75A] hover:bg-[#02b351] transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#FFFFFF"
              d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"
            />
          </svg>
          <span className="text-sm font-medium text-white">네이버로 계속하기</span>
        </button>

        {/* Kakao 로그인 */}
        <button
          type="button"
          onClick={() => handleSocialLogin('kakao')}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg bg-[#FEE500] hover:bg-[#fdd800] transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#000000"
              d="M12 3C6.477 3 2 6.463 2 10.691c0 2.65 1.734 4.974 4.38 6.304-.195.727-.696 2.619-.798 3.026-.122.49.18.483.378.352.156-.103 2.477-1.68 3.472-2.36.847.123 1.716.188 2.568.188 5.523 0 10-3.463 10-7.691S17.523 3 12 3z"
            />
          </svg>
          <span className="text-sm font-medium text-[#191919]">카카오로 계속하기</span>
        </button>
      </div>
    </div>
  );
}
