'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Tag, X } from 'lucide-react';
import { Button, Modal, ModalFooter, Skeleton } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import { useAvailableCoupons, useCalculateDiscount } from '../../hooks';
import { CouponCard } from '../CouponCard';
import { COUPON_TYPE_MAP } from '../../types';
import type { CustomerCoupon } from '../../types';

interface CouponSelectorProps {
  orderAmount: number;
  selectedCoupon: CustomerCoupon | null;
  onSelect: (coupon: CustomerCoupon | null, discountAmount: number) => void;
  disabled?: boolean;
}

export function CouponSelector({
  orderAmount,
  selectedCoupon,
  onSelect,
  disabled = false,
}: CouponSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedCoupon, setTempSelectedCoupon] = useState<CustomerCoupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const { data: availableCoupons, isLoading } = useAvailableCoupons(orderAmount);
  const { mutate: calculateDiscount } = useCalculateDiscount();

  // 모달이 열릴 때 현재 선택된 쿠폰을 임시 선택으로 설정
  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedCoupon(selectedCoupon);
    }
  }, [isModalOpen, selectedCoupon]);

  // 쿠폰 선택 시 할인 금액 계산
  useEffect(() => {
    if (tempSelectedCoupon && orderAmount > 0) {
      calculateDiscount(
        { couponId: tempSelectedCoupon.id, orderAmount },
        {
          onSuccess: (result) => {
            setDiscountAmount(result.discountAmount);
          },
        }
      );
    } else {
      setDiscountAmount(0);
    }
  }, [tempSelectedCoupon, orderAmount, calculateDiscount]);

  const handleOpenModal = () => {
    if (!disabled) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTempSelectedCoupon(selectedCoupon);
  };

  const handleSelectCoupon = (coupon: CustomerCoupon) => {
    if (tempSelectedCoupon?.id === coupon.id) {
      setTempSelectedCoupon(null);
    } else {
      setTempSelectedCoupon(coupon);
    }
  };

  const handleApply = () => {
    onSelect(tempSelectedCoupon, discountAmount);
    setIsModalOpen(false);
  };

  const handleRemoveCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null, 0);
  };

  return (
    <>
      {/* 쿠폰 선택 버튼 */}
      <div
        onClick={handleOpenModal}
        className={`
          flex items-center justify-between p-4 border rounded-lg cursor-pointer
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-primary-500'}
          ${selectedCoupon ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}
        `}
      >
        <div className="flex items-center gap-3">
          <Tag className={`w-5 h-5 ${selectedCoupon ? 'text-primary-500' : 'text-gray-400'}`} />
          {selectedCoupon ? (
            <div>
              <div className="font-medium text-gray-900">{selectedCoupon.name}</div>
              <div className="text-sm text-primary-600">
                -{formatPrice(discountAmount || calculateLocalDiscount(selectedCoupon, orderAmount))}
              </div>
            </div>
          ) : (
            <span className="text-gray-500">쿠폰을 선택하세요</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedCoupon && (
            <button
              onClick={handleRemoveCoupon}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* 쿠폰 사용 가능 개수 */}
      {!isLoading && availableCoupons && availableCoupons.length > 0 && (
        <p className="mt-1 text-xs text-primary-600">
          사용 가능한 쿠폰 {availableCoupons.length}개
        </p>
      )}

      {/* 쿠폰 선택 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="쿠폰 선택"
        description={`주문 금액: ${formatPrice(orderAmount)}`}
        size="lg"
      >
        <div className="max-h-[60vh] overflow-y-auto space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <CouponSelectorSkeleton key={i} />
            ))
          ) : !availableCoupons?.length ? (
            <div className="py-12 text-center text-gray-500">
              사용 가능한 쿠폰이 없습니다.
            </div>
          ) : (
            availableCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                selected={tempSelectedCoupon?.id === coupon.id}
                showSelectButton
                onSelect={handleSelectCoupon}
              />
            ))
          )}
        </div>

        <ModalFooter>
          {tempSelectedCoupon && (
            <div className="flex-1 text-left">
              <span className="text-sm text-gray-500">할인 금액: </span>
              <span className="text-lg font-bold text-primary-600">
                -{formatPrice(discountAmount)}
              </span>
            </div>
          )}
          <Button variant="outline" onClick={handleCloseModal}>
            취소
          </Button>
          <Button onClick={handleApply}>
            {tempSelectedCoupon ? '적용하기' : '쿠폰 사용 안함'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

/**
 * 로컬에서 할인 금액 계산 (API 호출 전 임시 표시용)
 */
function calculateLocalDiscount(coupon: CustomerCoupon, orderAmount: number): number {
  if (coupon.type === 'PERCENTAGE') {
    const discount = Math.floor(orderAmount * (coupon.discountValue / 100));
    return coupon.maxDiscountAmount
      ? Math.min(discount, coupon.maxDiscountAmount)
      : discount;
  }
  return coupon.discountValue;
}

/**
 * 쿠폰 선택 스켈레톤
 */
function CouponSelectorSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 p-4 pl-6">
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gray-200" />
      <div className="flex items-start justify-between mb-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="h-5 w-40 mb-1" />
      <Skeleton className="h-4 w-56 mb-3" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
