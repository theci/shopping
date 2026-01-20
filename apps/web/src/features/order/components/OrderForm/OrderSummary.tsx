'use client';

import Image from 'next/image';
import { Card, Button } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import type { CartItem } from '@/features/cart/types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  onSubmit: () => void;
  isSubmitting?: boolean;
  isValid?: boolean;
}

export function OrderSummary({
  items,
  subtotal,
  shippingFee,
  discount,
  totalAmount,
  onSubmit,
  isSubmitting,
  isValid = true,
}: OrderSummaryProps) {
  return (
    <Card className="p-6 sticky top-24">
      <h3 className="font-bold text-gray-900 mb-4">주문 요약</h3>

      {/* 상품 목록 */}
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <Image
                src={item.productImage || '/placeholder.png'}
                alt={item.productName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                {item.productName}
              </p>
              <p className="text-xs text-gray-500">수량: {item.quantity}</p>
              <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 금액 정보 */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">상품 금액</span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">배송비</span>
          <span className="text-gray-900">
            {shippingFee === 0 ? '무료' : formatPrice(shippingFee)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">할인</span>
            <span className="text-red-600">-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t">
          <span className="font-bold text-gray-900">총 결제 금액</span>
          <span className="font-bold text-blue-600 text-xl">{formatPrice(totalAmount)}</span>
        </div>
      </div>

      {/* 결제 버튼 */}
      <Button
        className="w-full mt-6"
        size="lg"
        onClick={onSubmit}
        isLoading={isSubmitting}
        disabled={!isValid || isSubmitting}
      >
        {formatPrice(totalAmount)} 결제하기
      </Button>

      {/* 안내 문구 */}
      <p className="text-xs text-gray-500 text-center mt-4">
        주문 내용을 확인하였으며, 결제에 동의합니다.
      </p>
    </Card>
  );
}
