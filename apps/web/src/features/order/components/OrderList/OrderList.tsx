'use client';

import { Package } from 'lucide-react';
import Link from 'next/link';
import { Button, Skeleton } from '@/shared/components/ui';
import { OrderCard } from './OrderCard';
import type { Order } from '../../types';

interface OrderListProps {
  orders: Order[];
  isLoading?: boolean;
  onCancel?: (orderId: number) => void;
  onConfirm?: (orderId: number) => void;
}

export function OrderList({ orders, isLoading, onCancel, onConfirm }: OrderListProps) {
  if (isLoading) {
    return <OrderListSkeleton />;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">주문 내역이 없습니다</h3>
        <p className="text-gray-500 mb-6">첫 주문을 시작해보세요!</p>
        <Link href="/products">
          <Button>상품 둘러보기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      ))}
    </div>
  );
}

function OrderListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-3 w-40 mb-3" />
          <div className="flex gap-4">
            <Skeleton className="w-20 h-20 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
