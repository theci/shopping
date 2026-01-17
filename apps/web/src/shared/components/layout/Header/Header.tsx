'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/Button';
import { cn } from '@/shared/utils/cn';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { isAuthenticated, customer } = useAuthStore();
  const { logout } = useLogout();

  return (
    <header className={cn('sticky top-0 z-40 bg-white border-b border-gray-200', className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="text-xl font-bold text-primary-600">
            E-Commerce
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-600 hover:text-gray-900 transition-colors">
              전체 상품
            </Link>
            <Link href="/products?category=1" className="text-gray-600 hover:text-gray-900 transition-colors">
              신상품
            </Link>
            <Link href="/products?sort=popular" className="text-gray-600 hover:text-gray-900 transition-colors">
              베스트
            </Link>
          </nav>

          {/* 액션 버튼들 */}
          <div className="flex items-center space-x-2">
            {/* 검색 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden sm:flex"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* 장바구니 */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </Link>

            {/* 사용자 메뉴 */}
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User className="w-5 h-5" />
                </Button>
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{customer?.name}</p>
                        <p className="text-xs text-gray-500">{customer?.email}</p>
                      </div>
                      <Link
                        href="/mypage"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        마이페이지
                      </Link>
                      <Link
                        href="/mypage/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        주문 내역
                      </Link>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
            )}

            {/* 모바일 메뉴 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* 검색바 (토글) */}
        {isSearchOpen && (
          <div className="py-3 border-t border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="상품을 검색하세요"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link
                href="/products"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                전체 상품
              </Link>
              <Link
                href="/products?category=1"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                신상품
              </Link>
              <Link
                href="/products?sort=popular"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                베스트
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
