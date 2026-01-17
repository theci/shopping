'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  ShoppingCart,
  User,
  Heart,
  Ticket,
  ClipboardList,
  LogOut,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  { label: '홈', href: '/', icon: <Home className="w-5 h-5" /> },
  { label: '상품', href: '/products', icon: <Package className="w-5 h-5" /> },
  { label: '장바구니', href: '/cart', icon: <ShoppingCart className="w-5 h-5" /> },
];

const mypageNavItems: NavItem[] = [
  { label: '마이페이지', href: '/mypage', icon: <User className="w-5 h-5" /> },
  { label: '주문 내역', href: '/mypage/orders', icon: <ClipboardList className="w-5 h-5" /> },
  { label: '찜한 상품', href: '/mypage/wishlist', icon: <Heart className="w-5 h-5" /> },
  { label: '쿠폰', href: '/mypage/coupons', icon: <Ticket className="w-5 h-5" /> },
];

interface NavigationProps {
  variant?: 'main' | 'mypage';
  className?: string;
}

export function Navigation({ variant = 'main', className }: NavigationProps) {
  const pathname = usePathname();
  const navItems = variant === 'mypage' ? mypageNavItems : mainNavItems;

  return (
    <nav className={cn('space-y-1', className)}>
      {navItems.map((item) => {
        const isActive = pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * 모바일 하단 네비게이션
 */
export function BottomNavigation({ className }: { className?: string }) {
  const pathname = usePathname();

  const items: NavItem[] = [
    { label: '홈', href: '/', icon: <Home className="w-6 h-6" /> },
    { label: '검색', href: '/search', icon: <Package className="w-6 h-6" /> },
    { label: '장바구니', href: '/cart', icon: <ShoppingCart className="w-6 h-6" /> },
    { label: '마이', href: '/mypage', icon: <User className="w-6 h-6" /> },
  ];

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 md:hidden',
        className
      )}
    >
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive ? 'text-primary-600' : 'text-gray-500'
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
