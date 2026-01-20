'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Card, Badge, Button } from '@/shared/components/ui';
import { formatPrice, formatDate } from '@/shared/utils/format';
import { ORDER_STATUS_MAP, type Order, type OrderStatus } from '../../types';

interface OrderCardProps {
  order: Order;
  onCancel?: (orderId: number) => void;
  onConfirm?: (orderId: number) => void;
}

const statusColors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  gray: 'default',
  blue: 'primary',
  green: 'success',
  yellow: 'warning',
  red: 'danger',
  purple: 'primary',
};

export function OrderCard({ order, onCancel, onConfirm }: OrderCardProps) {
  const statusInfo = ORDER_STATUS_MAP[order.status];
  const badgeVariant = statusColors[statusInfo.color] || 'default';

  // 첫 번째 상품 정보
  const firstItem = order.items[0];
  const remainingCount = order.items.length - 1;

  // 취소 가능 여부 (결제 완료 또는 주문 대기 상태에서만)
  const canCancel = ['PENDING', 'PAID'].includes(order.status);

  // 구매 확정 가능 여부 (배송 완료 상태에서만)
  const canConfirm = order.status === 'DELIVERED';

  return (
    <Card className="p-4">
      {/* 헤더: 주문 날짜 & 상태 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
          <Badge variant={badgeVariant}>{statusInfo.label}</Badge>
        </div>
        <Link
          href={`/mypage/orders/${order.id}`}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          주문 상세
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 주문 번호 */}
      <p className="text-xs text-gray-400 mb-3">주문번호: {order.orderNumber}</p>

      {/* 상품 정보 */}
      <div className="flex gap-4">
        {/* 상품 이미지 */}
        <Link href={`/mypage/orders/${order.id}`} className="shrink-0">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={firstItem?.productImage || '/placeholder.png'}
              alt={firstItem?.productName || '상품'}
              fill
              className="object-cover"
            />
          </div>
        </Link>

        {/* 상품 상세 */}
        <div className="flex-1 min-w-0">
          <Link href={`/mypage/orders/${order.id}`}>
            <h3 className="font-medium text-gray-900 line-clamp-1 hover:text-blue-600">
              {firstItem?.productName}
              {remainingCount > 0 && (
                <span className="text-gray-500 font-normal"> 외 {remainingCount}건</span>
              )}
            </h3>
          </Link>
          {firstItem?.optionName && (
            <p className="text-sm text-gray-500 mt-0.5">{firstItem.optionName}</p>
          )}
          <p className="text-lg font-bold text-gray-900 mt-2">
            {formatPrice(order.totalAmount)}
          </p>
        </div>
      </div>

      {/* 액션 버튼 */}
      {(canCancel || canConfirm) && (
        <div className="flex gap-2 mt-4 pt-4 border-t">
          {canCancel && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(order.id)}
            >
              주문 취소
            </Button>
          )}
          {canConfirm && onConfirm && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onConfirm(order.id)}
            >
              구매 확정
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
