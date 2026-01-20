'use client';

import { use } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Card, Skeleton } from '@/shared/components/ui';
import { OrderDetail } from '@/features/order/components';
import { useOrder, useCancelOrder, useConfirmOrder } from '@/features/order/hooks';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const orderId = parseInt(id, 10);

  const { data: order, isLoading, error } = useOrder(orderId);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  const { mutate: confirmOrder, isPending: isConfirming } = useConfirmOrder();

  const handleCancel = () => {
    if (confirm('주문을 취소하시겠습니까?')) {
      cancelOrder({ orderId });
    }
  };

  const handleConfirm = () => {
    if (confirm('구매를 확정하시겠습니까? 확정 후에는 취소할 수 없습니다.')) {
      confirmOrder(orderId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-24 w-full" />
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Link
          href="/mypage/orders"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="w-4 h-4" />
          주문 내역
        </Link>
        <Card className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">주문 정보를 불러올 수 없습니다.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <Link
        href="/mypage/orders"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft className="w-4 h-4" />
        주문 내역
      </Link>

      {/* 주문 상세 */}
      <OrderDetail
        order={order}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        isCancelling={isCancelling}
        isConfirming={isConfirming}
      />
    </div>
  );
}
