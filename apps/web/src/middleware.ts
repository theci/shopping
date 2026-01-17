import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 보호된 경로 (인증 필요)
const protectedPaths = [
  '/cart',
  '/checkout',
  '/mypage',
  '/orders',
];

// 인증 관련 경로 (로그인된 사용자 접근 불가)
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // localStorage는 서버에서 접근 불가하므로 쿠키 대신 클라이언트에서 처리
  // 여기서는 클라이언트 측 리다이렉트를 위한 기본 체크만 수행

  // 보호된 페이지에 대한 처리는 클라이언트 컴포넌트에서 수행
  // middleware에서는 기본적인 라우팅만 처리

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
