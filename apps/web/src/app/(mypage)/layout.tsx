'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, MapPin, Lock, Package, LogOut } from 'lucide-react';
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { cn } from '@/shared/utils/cn';

const menuItems = [
  { href: '/mypage', icon: User, label: '내 정보' },
  { href: '/mypage/orders', icon: Package, label: '주문 내역' },
  { href: '/mypage/addresses', icon: MapPin, label: '배송지 관리' },
  { href: '/mypage/password', icon: Lock, label: '비밀번호 변경' },
];

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const { logout } = useLogout();

  // 인증되지 않은 사용자 리다이렉트
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login?redirect=' + pathname);
    }
  }, [isAuthenticated, isInitialized, router, pathname]);

  // 로딩 중이거나 인증되지 않은 경우
  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">마이페이지</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* 사이드 메뉴 */}
            <aside className="lg:w-64 shrink-0">
              <nav className="bg-white rounded-lg shadow-sm p-4">
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href ||
                      (item.href !== '/mypage' && pathname.startsWith(item.href));
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors',
                            isActive
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                  <li className="pt-2 border-t mt-2">
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      로그아웃
                    </button>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
