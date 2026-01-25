'use client';

import { Badge } from '@/shared/components/ui';
import { formatPrice, formatDate } from '@/shared/utils/format';
import { cn } from '@/shared/utils/cn';
import { COUPON_STATUS_MAP, COUPON_TYPE_MAP } from '../../types';
import type { CustomerCoupon } from '../../types';

interface CouponCardProps {
  coupon: CustomerCoupon;
  selected?: boolean;
  disabled?: boolean;
  showSelectButton?: boolean;
  onSelect?: (coupon: CustomerCoupon) => void;
}

export function CouponCard({
  coupon,
  selected = false,
  disabled = false,
  showSelectButton = false,
  onSelect,
}: CouponCardProps) {
  const statusInfo = COUPON_STATUS_MAP[coupon.status];
  const typeInfo = COUPON_TYPE_MAP[coupon.type];
  const isExpired = new Date(coupon.validUntil) < new Date();
  const isAvailable = coupon.status === 'ACTIVE' && !isExpired;

  const handleSelect = () => {
    if (!disabled && isAvailable && onSelect) {
      onSelect(coupon);
    }
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border-2 transition-all',
        selected
          ? 'border-primary-500 bg-primary-50'
          : isAvailable
          ? 'border-gray-200 bg-white hover:border-gray-300'
          : 'border-gray-100 bg-gray-50 opacity-60',
        showSelectButton && isAvailable && !disabled && 'cursor-pointer'
      )}
      onClick={showSelectButton ? handleSelect : undefined}
    >
      {/* 쿠폰 좌측 장식 */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary-500" />

      <div className="p-4 pl-6">
        {/* 상단: 할인 금액/비율 & 상태 */}
        <div className="flex items-start justify-between mb-2">
          <div className="text-2xl font-bold text-primary-600">
            {typeInfo.format(coupon.discountValue)}
          </div>
          <Badge
            variant={
              coupon.status === 'ACTIVE'
                ? 'success'
                : coupon.status === 'USED'
                ? 'default'
                : 'danger'
            }
          >
            {statusInfo.label}
          </Badge>
        </div>

        {/* 쿠폰명 */}
        <h3 className="font-semibold text-gray-900 mb-1">{coupon.name}</h3>

        {/* 설명 */}
        {coupon.description && (
          <p className="text-sm text-gray-500 mb-2">{coupon.description}</p>
        )}

        {/* 조건 */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
          {coupon.minOrderAmount && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              {formatPrice(coupon.minOrderAmount)} 이상 주문 시
            </span>
          )}
          {coupon.maxDiscountAmount && coupon.type === 'PERCENTAGE' && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              최대 {formatPrice(coupon.maxDiscountAmount)} 할인
            </span>
          )}
        </div>

        {/* 유효기간 */}
        <div className="text-xs text-gray-400">
          {formatDate(coupon.validFrom)} ~ {formatDate(coupon.validUntil)}
        </div>

        {/* 선택 버튼 */}
        {showSelectButton && isAvailable && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              disabled={disabled}
              onClick={handleSelect}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                selected
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {selected ? '선택됨' : '적용'}
            </button>
          </div>
        )}
      </div>

      {/* 선택 체크 표시 */}
      {selected && (
        <div className="absolute top-2 right-2">
          <svg
            className="w-6 h-6 text-primary-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
