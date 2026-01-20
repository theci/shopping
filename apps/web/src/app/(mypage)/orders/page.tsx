'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { OrderList } from '@/features/order/components';
import { useOrders, useCancelOrder, useConfirmOrder } from '@/features/order/hooks';
import type { OrderStatus } from '@/features/order/types';

const statusFilters: { value: OrderStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'PAID', label: '결제완료' },
  { value: 'PREPARING', label: '준비중' },
  { value: 'SHIPPED', label: '배송중' },
  { value: 'DELIVERED', label: '배송완료' },
  { value: 'CANCELLED', label: '취소/환불' },
];

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useOrders({
    page,
    size: 10,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });

  const { mutate: cancelOrder } = useCancelOrder();
  const { mutate: confirmOrder } = useConfirmOrder();

  const handleCancel = (orderId: number) => {
    if (confirm('주문을 취소하시겠습니까?')) {
      cancelOrder({ orderId });
    }
  };

  const handleConfirm = (orderId: number) => {
    if (confirm('구매를 확정하시겠습니까? 확정 후에는 취소할 수 없습니다.')) {
      confirmOrder(orderId);
    }
  };

  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <Link
        href="/mypage"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft className="w-4 h-4" />
        마이페이지
      </Link>

      {/* 페이지 타이틀 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">주문 내역</h2>
        <p className="text-sm text-gray-500 mt-1">주문 및 배송 현황을 확인하세요.</p>
      </div>

      {/* 상태 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={statusFilter === filter.value ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              setStatusFilter(filter.value);
              setPage(0);
            }}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* 주문 목록 */}
      <OrderList
        orders={data?.content || []}
        isLoading={isLoading}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />

      {/* 페이지네이션 */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={data.first}
          >
            이전
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            {data.page + 1} / {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={data.last}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
