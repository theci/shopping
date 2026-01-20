'use client';

import { Check, Clock, Package, Truck, Home, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import type { OrderStatus as OrderStatusType } from '../../types';

interface OrderStatusProps {
  status: OrderStatusType;
  className?: string;
}

const statusSteps = [
  { status: 'PAID', label: '결제 완료', icon: Check },
  { status: 'PREPARING', label: '상품 준비중', icon: Package },
  { status: 'SHIPPED', label: '배송중', icon: Truck },
  { status: 'DELIVERED', label: '배송 완료', icon: Home },
  { status: 'CONFIRMED', label: '구매 확정', icon: CheckCircle },
];

const statusOrder: Record<OrderStatusType, number> = {
  PENDING: 0,
  PAID: 1,
  PREPARING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CONFIRMED: 5,
  CANCELLED: -1,
  REFUNDED: -1,
};

export function OrderStatus({ status, className }: OrderStatusProps) {
  // 취소/환불 상태인 경우
  if (status === 'CANCELLED' || status === 'REFUNDED') {
    return (
      <div className={cn('p-4 bg-red-50 rounded-lg', className)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="font-medium text-red-700">
              {status === 'CANCELLED' ? '주문이 취소되었습니다' : '환불이 완료되었습니다'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 주문 대기 상태
  if (status === 'PENDING') {
    return (
      <div className={cn('p-4 bg-gray-50 rounded-lg', className)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="font-medium text-gray-700">결제 대기중</p>
            <p className="text-sm text-gray-500">결제를 완료해주세요</p>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = statusOrder[status];

  return (
    <div className={cn('p-4 bg-white rounded-lg border', className)}>
      <div className="flex items-center justify-between">
        {statusSteps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep >= stepNumber;
          const isCurrent = currentStep === stepNumber;
          const Icon = step.icon;

          return (
            <div key={step.status} className="flex flex-col items-center flex-1">
              {/* 연결선 (첫 번째 제외) */}
              {index > 0 && (
                <div
                  className={cn(
                    'absolute h-0.5 w-full -left-1/2 top-5 -z-10',
                    isCompleted ? 'bg-blue-500' : 'bg-gray-200'
                  )}
                  style={{ width: 'calc(100% - 40px)', left: 'calc(-50% + 20px)' }}
                />
              )}

              {/* 아이콘 */}
              <div
                className={cn(
                  'relative w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                  isCompleted
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-400'
                )}
              >
                <Icon className="w-5 h-5" />
                {isCurrent && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* 라벨 */}
              <span
                className={cn(
                  'text-xs mt-2 text-center',
                  isCompleted ? 'text-blue-600 font-medium' : 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
