'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/Button';
import { cn } from '@/shared/utils/cn';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
                {/* 장바구니 뱃지 - 상태 연동 시 조건부 렌더링 */}
                {/* <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span> */}
              </Button>
            </Link>

            {/* 마이페이지 */}
            <Link href="/mypage">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>

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
