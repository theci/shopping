'use client';

import Link from 'next/link';
import { ChevronRight, Trash2 } from 'lucide-react';
import { CartList, CartSummary } from '@/features/cart/components';
import { useCart, useClearCart } from '@/features/cart/hooks';
import { Button } from '@/shared/components/ui';

export default function CartPage() {
  const { items, isLoading, isAuthenticated } = useCart();
  const { clearCart, isPending: isClearing } = useClearCart();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 브레드크럼 */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">홈</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">장바구니</span>
      </nav>

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">장바구니</h1>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearCart()}
            disabled={isClearing}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            전체 삭제
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 장바구니 목록 */}
        <div className="flex-1 min-w-0">
          <CartList
            items={items}
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
          />
        </div>

        {/* 주문 요약 */}
        <aside className="lg:w-80 shrink-0">
          <CartSummary
            items={items}
            isAuthenticated={isAuthenticated}
          />
        </aside>
      </div>

      {/* 비로그인 안내 */}
      {!isAuthenticated && items.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>로그인하면</strong> 장바구니가 저장되고, 여러 기기에서 동기화됩니다.
            <Link href="/login?redirect=/cart" className="underline ml-1">
              로그인하기
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
