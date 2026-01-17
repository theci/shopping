'use client';

import Link from 'next/link';
import { Button, Card } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import type { CartItem, LocalCartItem } from '../../types';

interface CartSummaryProps {
  items: (CartItem | LocalCartItem)[];
  isAuthenticated: boolean;
}

export function CartSummary({ items, isAuthenticated }: CartSummaryProps) {
  const selectedItems = items.filter((item) => item.selected);
  const selectedCount = selectedItems.length;
  const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 50000 ? 0 : 3000; // 5만원 이상 무료배송
  const totalAmount = subtotal + shippingFee;

  const hasOutOfStockItems = selectedItems.some((item) => item.stockQuantity === 0);

  return (
    <Card className="p-6 sticky top-24">
      <h2 className="text-lg font-bold text-gray-900 mb-4">주문 요약</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">선택한 상품</span>
          <span className="text-gray-900">{selectedCount}개 ({totalQuantity}개)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">상품 금액</span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">배송비</span>
          <span className="text-gray-900">
            {shippingFee === 0 ? (
              <span className="text-green-600">무료</span>
            ) : (
              formatPrice(shippingFee)
            )}
          </span>
        </div>

        {subtotal > 0 && subtotal < 50000 && (
          <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
            {formatPrice(50000 - subtotal)} 더 담으면 무료배송!
          </p>
        )}

        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-bold text-lg">
            <span>총 결제 금액</span>
            <span className="text-blue-600">{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* 주문하기 버튼 */}
      <div className="mt-6 space-y-3">
        {isAuthenticated ? (
          <Link href="/checkout" className="block">
            <Button
              fullWidth
              size="lg"
              disabled={selectedCount === 0 || hasOutOfStockItems}
            >
              {hasOutOfStockItems
                ? '품절 상품이 있습니다'
                : selectedCount === 0
                ? '상품을 선택해주세요'
                : `${selectedCount}개 상품 주문하기`}
            </Button>
          </Link>
        ) : (
          <div className="space-y-2">
            <Link href="/login?redirect=/cart" className="block">
              <Button fullWidth size="lg">
                로그인하고 주문하기
              </Button>
            </Link>
            <p className="text-xs text-gray-500 text-center">
              로그인하면 장바구니가 저장됩니다
            </p>
          </div>
        )}

        <Link href="/products" className="block">
          <Button variant="outline" fullWidth>
            계속 쇼핑하기
          </Button>
        </Link>
      </div>

      {/* 혜택 안내 */}
      <div className="mt-6 pt-4 border-t">
        <h3 className="text-sm font-medium text-gray-900 mb-2">혜택 안내</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            5만원 이상 구매 시 무료배송
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            당일 출고 (오후 2시 이전 결제)
          </li>
        </ul>
      </div>
    </Card>
  );
}
