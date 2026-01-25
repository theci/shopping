'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Spinner } from '@/shared/components/ui';
import { formatPrice, formatRelativeTime } from '@/shared/utils/format';
import { useRecentOrders } from '../../hooks';

interface RecentOrdersProps {
  limit?: number;
}

const ORDER_STATUS_MAP: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' | 'primary' | 'info' }> = {
  PENDING: { label: '주문 대기', variant: 'default' },
  PAID: { label: '결제 완료', variant: 'primary' },
  PREPARING: { label: '상품 준비중', variant: 'info' },
  SHIPPED: { label: '배송중', variant: 'warning' },
  DELIVERED: { label: '배송 완료', variant: 'success' },
  CONFIRMED: { label: '구매 확정', variant: 'success' },
  CANCELLED: { label: '주문 취소', variant: 'danger' },
};

export function RecentOrders({ limit = 5 }: RecentOrdersProps) {
  const { data, isLoading } = useRecentOrders(limit);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>최근 주문</CardTitle>
          <Link
            href="/orders"
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            전체 보기
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : !data?.length ? (
          <div className="py-12 text-center text-gray-500">
            최근 주문이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((order) => {
              const statusConfig = ORDER_STATUS_MAP[order.status] || { label: order.status, variant: 'default' as const };

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(order.totalAmount)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={statusConfig.variant} className="text-xs">
                        {statusConfig.label}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {formatRelativeTime(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
