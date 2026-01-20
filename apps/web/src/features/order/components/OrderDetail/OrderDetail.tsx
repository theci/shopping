'use client';

import { Card, Button, Badge, Skeleton } from '@/shared/components/ui';
import { formatPrice, formatDate } from '@/shared/utils/format';
import { OrderStatus } from './OrderStatus';
import { OrderItems } from './OrderItems';
import { ORDER_STATUS_MAP, type Order } from '../../types';

interface OrderDetailProps {
  order: Order;
  isLoading?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  isCancelling?: boolean;
  isConfirming?: boolean;
}

const statusColors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  gray: 'default',
  blue: 'primary',
  green: 'success',
  yellow: 'warning',
  red: 'danger',
  purple: 'primary',
};

export function OrderDetail({
  order,
  isLoading,
  onCancel,
  onConfirm,
  isCancelling,
  isConfirming,
}: OrderDetailProps) {
  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  const statusInfo = ORDER_STATUS_MAP[order.status];
  const badgeVariant = statusColors[statusInfo.color] || 'default';

  // 취소 가능 여부
  const canCancel = ['PENDING', 'PAID'].includes(order.status);
  // 구매 확정 가능 여부
  const canConfirm = order.status === 'DELIVERED';

  return (
    <div className="space-y-6">
      {/* 주문 정보 헤더 */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-bold text-gray-900">주문 상세</h2>
              <Badge variant={badgeVariant}>{statusInfo.label}</Badge>
            </div>
            <p className="text-sm text-gray-500">주문번호: {order.orderNumber}</p>
            <p className="text-sm text-gray-500">주문일시: {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            {canCancel && onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                isLoading={isCancelling}
              >
                주문 취소
              </Button>
            )}
            {canConfirm && onConfirm && (
              <Button
                variant="primary"
                size="sm"
                onClick={onConfirm}
                isLoading={isConfirming}
              >
                구매 확정
              </Button>
            )}
          </div>
        </div>

        {/* 주문 상태 */}
        <OrderStatus status={order.status} />
      </Card>

      {/* 주문 상품 */}
      <OrderItems items={order.items} />

      {/* 배송 정보 */}
      <Card className="p-6">
        <h3 className="font-bold text-gray-900 mb-4">배송 정보</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex">
            <dt className="w-24 text-gray-500">수령인</dt>
            <dd className="text-gray-900">{order.shippingInfo.recipientName}</dd>
          </div>
          <div className="flex">
            <dt className="w-24 text-gray-500">연락처</dt>
            <dd className="text-gray-900">{order.shippingInfo.phone}</dd>
          </div>
          <div className="flex">
            <dt className="w-24 text-gray-500">주소</dt>
            <dd className="text-gray-900">
              [{order.shippingInfo.zipCode}] {order.shippingInfo.address}
              {order.shippingInfo.addressDetail && `, ${order.shippingInfo.addressDetail}`}
            </dd>
          </div>
          {order.shippingInfo.memo && (
            <div className="flex">
              <dt className="w-24 text-gray-500">배송 메모</dt>
              <dd className="text-gray-900">{order.shippingInfo.memo}</dd>
            </div>
          )}
        </dl>
      </Card>

      {/* 결제 정보 */}
      <Card className="p-6">
        <h3 className="font-bold text-gray-900 mb-4">결제 정보</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">상품 금액</dt>
            <dd className="text-gray-900">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">배송비</dt>
            <dd className="text-gray-900">
              {order.shippingFee === 0 ? '무료' : formatPrice(order.shippingFee)}
            </dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-gray-500">할인 금액</dt>
              <dd className="text-red-600">-{formatPrice(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t">
            <dt className="font-bold text-gray-900">총 결제 금액</dt>
            <dd className="font-bold text-blue-600 text-lg">{formatPrice(order.totalAmount)}</dd>
          </div>
        </dl>
      </Card>

      {/* 취소 정보 (취소된 경우) */}
      {order.status === 'CANCELLED' && order.cancelReason && (
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="font-bold text-red-700 mb-2">취소 사유</h3>
          <p className="text-sm text-red-600">{order.cancelReason}</p>
          {order.cancelledAt && (
            <p className="text-xs text-red-500 mt-2">취소일시: {formatDate(order.cancelledAt)}</p>
          )}
        </Card>
      )}
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48 mb-1" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-9 w-20" />
        </div>
        <Skeleton className="h-24 w-full" />
      </Card>

      <Card className="p-6">
        <Skeleton className="h-5 w-24 mb-4" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-4">
            <Skeleton className="w-20 h-20 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
        ))}
      </Card>

      <Card className="p-6">
        <Skeleton className="h-5 w-24 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </Card>
    </div>
  );
}
