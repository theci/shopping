'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import type { OrderItem } from '../../types';

interface OrderItemsProps {
  items: OrderItem[];
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-4">주문 상품</h3>
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            {/* 상품 이미지 */}
            <Link href={`/products/${item.productId}`} className="shrink-0">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.productImage || '/placeholder.png'}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>

            {/* 상품 정보 */}
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.productId}`}>
                <h4 className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
                  {item.productName}
                </h4>
              </Link>
              {item.optionName && (
                <p className="text-sm text-gray-500 mt-0.5">{item.optionName}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">수량: {item.quantity}개</span>
                <span className="font-bold text-gray-900">{formatPrice(item.totalPrice)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
